var BaseView = require("BaseView")
// OreMainView
cc.Class({
    extends: BaseView,

    properties: {
        timeLabel1:cc.Label,
        timeLabel2:cc.Label,
        bgSprite:cc.Sprite,
        roomNameLabel:cc.Label,

        unionNode:cc.Node,
        unionNameLabel:cc.Label,
        unionNumLabel:cc.Label,
        unionRewardPercentLabel:cc.Label,

        battleNumberLabel:cc.Label,
        oreNode:cc.Node,

        OreMainViewItem:cc.Prefab,

        locationBtn:cc.Node,
        rewardSprite:cc.Sprite,

        battleLogBtn:cc.Node,

        leftBtn:cc.Node,
        rightBtn:cc.Node,
    },
    onLoad () {
       this._super()
       Gm.oreData.setCheckRedTime()
       Gm.red.add(this.battleLogBtn,"ore","oreHasReward")
       //Gm.red.refreshEventState('ore')
       this.addTimes()
    },
    register:function(){
        this.events[Events.UPDATE_ORE_INFO]  = this.updateOreInfo.bind(this)
        this.events[Events.ORE_ENTER_ROOM]  = this.onEnterRoom.bind(this)
        //this.events[Events.ORE_ON_GET_REWARD]  = this.onGetReward.bind(this)//领取奖励
        this.events[Events.ORE_UPDATE_ROOM]  = this.onUpdateRoom.bind(this)//更新房间数据
        this.events[Events.ORE_UP_BAT_COUNT]  = this.onUpdateBattleCount.bind(this)//更新battleCount
        this.events[Events.ORE_ROOM_INFO]  = this.onUpdateCurrentRoom.bind(this)//更新battleCount
    },
    enableUpdateView:function(args){
         if(args){
             if(args.index){
                 this.data = Gm.oreData.getEnterRoomDataByIndex(args.index)
             }
             else{
                 this.data = Gm.oreData.getEnterRoomData()
             }
             this.setUI()
             Gm.getLogic("OreLogic").checkShowOccupied()
         }
    },
    updateOreInfo(data){
        for(var i=0;i<this.oreNode.children.length;i++){
            var item = this.oreNode.children[i]
            if(item && item.active && item.getComponent("OreMainViewItem")){
                var itemJs = item.getComponent("OreMainViewItem")
                itemJs.updateItem()
            }
        }
        this.data = Gm.oreData.getEnterRoomData()
        this.setUnionNode()
    },
    onEnterRoom(data){
        if(data){
            if(data.index != null || data.roomData.index != null){
                var index = data.index
                if(index == null){
                    index = data.roomData.index
                }
                this.data = Gm.oreData.getEnterRoomDataByIndex(index)
                this.setUI()
            }
        }
    },
    setUI(){
        this.setTopNode()
        this.setBottomNode()
        this.setUnionNode()
        this.setContentNode()
        this.onGetReward()
        this.setBgSprite()
        this.setLeftRightBtn()
    },
    setTopNode(){
        this.roomNameLabel.string = OreFunc.getRoomNameStr(this.data.type,this.data.roomIndex)
        this.battleNumberLabel.string = Ls.get(7500010) +  Gm.oreData.getBattleCount()
    },
    setContentNode(){
        var pos = OreFunc.getOrePositions(this.data.type)
        var pos2 = OreFunc.getOrePositions2(this.data.type)
        if(!this.itemJs){
            this.itemJs = []
            for(var i=0;i<6;i++){
                var item = cc.instantiate(this.OreMainViewItem);
                this.oreNode.addChild(item)
                var js = item.getComponent("OreMainViewItem")
                this.itemJs.push(js)
                if(this.data.oreList[i]){
                    js.setUI(this.data.oreList[i],i,pos,this.onItemClick.bind(this),pos2)
                 }
                 else{
                    item.active = false
                 }
            }
        }
        else{
             for(var i=0;i<6;i++){
                if(this.data.oreList[i]){
                    this.itemJs[i].setUI(this.data.oreList[i],i,pos,this.onItemClick.bind(this),pos2)
                    this.itemJs[i].node.active = true
                }
                else{
                    this.itemJs[i].node.active = false
                }
            }
        }
    },
    setBottomNode(){
        //设置定位按钮
        var myRoomIndex = Gm.oreData.getMyRoomIndex()
        if(myRoomIndex !=null  && this.data.index != myRoomIndex){
            this.locationBtn.active = true
        }
        else{
             this.locationBtn.active = false
        }
    },
    setUnionNode(){
        var unionNum = Gm.oreData.getUnionNum(this.data)
        if(unionNum >= 2){
            this.unionNode.active = true
            this.unionNameLabel.string = Gm.unionData.info.name
            this.unionNumLabel.string = unionNum
            var config = Gm.config.getOreBuffConfig(unionNum)
            this.unionRewardPercentLabel.string = config.buff / 100 + "%"
        }
        else{
             this.unionNode.active = false
        }
    },
    setBgSprite(){
        var config = Gm.config.getOreConfigByType(this.data.type)
        Gm.load.loadSpriteFrame("/img/shuijing/" + config.backdrop,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.bgSprite)
    },
    setLeftRightBtn(){
        var index = this.data.index
         var maxIndex = Gm.oreData.getRoomListCount()  -1
        this.leftBtn.active = true
        this.rightBtn.active = true
        if(index == 0){
            this.leftBtn.active = false
        }
        else if(index == maxIndex){
            this.rightBtn.active = false
        }
    },

    onItemClick(data){
        Gm.ui.create("OreMainInfo",{oreData:data})
    },
    onBattleLogBtnClick(){
        Gm.ui.create("OreBattleLogView")
    },
    onRankBtnClick(){
        Gm.ui.create("OreRankView")
    },
    onShopBtnClick(){
        Gm.ui.jump(90008)
    },
    onOrePreviewBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        Gm.ui.create("OreRoomListView")
    },
    onSearchingBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        if(Gm.oreData.getMyOreId()){
            Gm.floating(Ls.get(7500046))
            return
        }
        if(!this.isSeaching){
            this.isSeaching = true
            setTimeout(() => {
                this.isSeaching = false
            }, 5000);
            var data = Gm.oreData.getSearchEnterRoomData(Gm.userInfo.fight)
            if(data.index == this.data.index){
                Gm.floating(Ls.get(7500047))
                return 
            }
            Gm.oreNet.sendOreRoomInfo(data.index)
            this.data = data
            this.setUI()
        }
        else{
            Gm.floating(Ls.get(7500048))
        }
    },
    onUnionOreBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        if(!Gm.unionData.info){
            Gm.floating(Ls.get(7500049))
            return
        }
        var data =  Gm.oreData.getUnionOreData( Gm.unionData.info.allianceId)
        if(data.length == 0){
            Gm.floating(Ls.get(7500050))
            return
        }
        Gm.ui.create("OreUnionRoomList",data)
    },
    onAddBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        if(!Gm.oreData.isCanBuyBattleCount()){
            Gm.floating(Ls.get(2037))
            return
        }
        var callback = function(currentNum){
            Gm.oreNet.sendOreBuyCount(currentNum)
        }
        Gm.ui.create("OreBuyView",{callback:callback,})
    },
    onLocationBtnClick(){
        this.data = Gm.oreData.getEnterRoomData()
        this.setUI() 
    },
    getNextIndex(index,dir){
        var newIndex = index + dir
        var maxIndex = Gm.oreData.getRoomListCount()  -1
        if(newIndex<0){
            newIndex = maxIndex
        }
        else if(newIndex > maxIndex){
            newIndex = 0
        }
        return newIndex
    },
    onLeftBtnClick(){
        var index = this.getNextIndex(this.data.index,-1)
        Gm.oreNet.sendOreRoomInfo(index)
        this.data = Gm.oreData.getEnterRoomDataByIndex(index)
        this.setUI()       
    },
    onRightBtnClick(){
        var index = this.getNextIndex(this.data.index,1)
        Gm.oreNet.sendOreRoomInfo(index)
        this.data = Gm.oreData.getEnterRoomDataByIndex(index)
        this.setUI()          
    },
    onGetReward(){//更新下面的奖励图片
        var id = Gm.oreData.getMyOreId()
        var num =0
        if(id){
            var oreData = Gm.oreData.getOreById(id)
            num = oreData.curGold
        }
        this.setRewardSprite(num)
    },
    onRewardBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        var id = Gm.oreData.getMyOreId()
        if(id){
            var oreData = Gm.oreData.getOreById(id)
            Gm.ui.create("OreMainInfo",{oreData:oreData})
        }
        else{
            Gm.floating(Ls.get(7500051))
        }
    },
    onUpdateRoom(data){
        if(data.index == this.data.index){
            this.data = Gm.oreData.getEnterRoomDataByIndex(this.data.index)
            this.setUI()       
        }
    },
    onUpdateCurrentRoom(){
        this.data = Gm.oreData.getEnterRoomDataByIndex(this.data.index)
        this.setUI()
    },
    onUpdateBattleCount(){
        this.setTopNode()
    },
    setRewardSprite(num){
        var str = null
        if(num>0){
            str = "/img/shuijing/crystal_icon_car_full"
        }
        else{
            str = "/img/shuijing/crystal_icon_car_empty"
        }
        if(!this.strPicName){
            this.strPicName = str
        }
        else if(this.strPicName == str){
            return
        }
         this.strPicName = str
        Gm.load.loadSpriteFrame(str,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.rewardSprite)
        OreFunc.rewardBoxAddAnimation(this.rewardSprite.node,num>0)
    },

     //更新结束时间
    onDestroy(){
        this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime(){
        if(OreFunc.oreIsOpen()){
            this.timeLabel1.string = Ls.get(7500070)
            this.timeLabel2.string = OreFunc.getTimeStr((OreFunc.getEndTime()-Gm.userData.getTime_m())/1000)
        }
        else{
            this.timeLabel1.string = Ls.get(7500069)
            var time = OreFunc.getStartTime()
            this.timeLabel2.string = OreFunc.getTimeStr(time/1000 - Func.getDay())
            if(OreFunc.istest){
                  var time = OreFunc.getStartTime1()
                  this.timeLabel2.string = OreFunc.getTimeStr(time/1000 - Func.getDay())
            }
        }
    },
    getSceneData:function(){
        return {index:this.data.index}
    },
});

