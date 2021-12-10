//OreMainInfo
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        titleName:cc.Label,
        bgSprite:cc.Sprite,
        oreSprite:cc.Sprite,

         headNode:cc.Node,
         nameLabel:cc.Label,
         unionNameLabel:cc.Label,

         dNumLabel:cc.Label,
         goldNumLabel:cc.Label,
         
         timeNode:cc.Node,
         timeNumLabel:cc.Label,

         fightValueLabel:cc.Label,
         teamNode:cc.Node,
         heroNode:cc.Node,

         setTeamBtn:cc.Node,
         battleBtn:cc.Node,

         oreRewardNode:cc.Node,
         rewardSprite:cc.Sprite,

         myGoldNumLabel:cc.Label,
         totalGoldNumLabel:cc.Label,
         myOreNumLabel:cc.Label,
         totalOreNumLabel:cc.Label,
    },
    onLoad(){
        this._super()
        this.data = this.openData.oreData
        this.config = Gm.config.getOreConfigById(this.data.oreId)
        Gm.oreNet.sendOreRoomInfo(this.data.index)
        this.isMe =  this.data.info && this.data.info.playerId == Gm.userInfo.id
        this.setBgSprite()
    },
    register:function(){
         this.events[Events.ORE_UPDATE_ROOM] = this.onUpdateRoomInfo.bind(this) //进入页面
        this.events[Events.ON_GET_DEFENDER_INFO] = this.onGetDefendedInfo.bind(this)//防守阵容
        this.events[Events.UPDATE_ORE_INFO]  = this.updateOreInfo.bind(this)//被占领
        this.events[Events.ORE_ON_GET_REWARD]  = this.onGetReward.bind(this)//领取奖励
    },
    enableUpdateView:function(args){
        if(args){
           if(!OreFunc.oreIsOpen()){
                this.onUpdateRoomInfo()
           }
        }
    },
    onUpdateRoomInfo:function(){
        this.data = Gm.oreData.getOreById(this.data.id)
        this.isMe =  this.data.info && this.data.info.playerId == Gm.userInfo.id
        if(this.isMe){
            this.goldSpeed =   Gm.oreData.getMyGoldSpeed(this.data)
            this.myGoldNumLabel.string = this.goldSpeed
            this.oreSpeed = Gm.oreData.getMyOreSpeed(this.data)
            this.myOreNumLabel.string = this.oreSpeed
        }
        
        this.setUI()
    },
    updateOreInfo(data){
        if(data.id == this.data.id){
            this.data = Gm.oreData.getOreById(data.id)
            this.isMe =  this.data.info && this.data.info.playerId == Gm.userInfo.id
            this.setUI()
        }
    },
    onGetDefendedInfo(data){
        this.teamList = data
        for(var i=0;i<data.length;i++){
            if(data[i] && data[i].qualityId){
                var config = Gm.config.getHero(data[i].baseId,data[i].qualityId)  //passive_skills
                var t = []
                for(var j=0;j<data[i].skillList.length;j++){
                    var key = false
                    for(var z=0;z<config.passive_skills.length;z++){
                        if(data[i].skillList[j] == config.passive_skills[z]){
                            key = true
                        }
                    }
                    if(!key){
                        //data[i].skillList.splice(j,1)
                    }
                    else{
                        t.push(data[i].skillList[j])
                    }
                }
                data[i].skillList = t
            }
        }
        this.setTeamNode()
    },
    onGetReward(data){//领取奖励
        if(data.id == this.data.id){
            this.data = Gm.oreData.getOreById(data.id)
            this.data.curGold = 0
        }
        this.getStartTime()
    },
    setUI(){
        this.setBgSprite()
        this.setOreSprite()
        this.setUserInfo()
        this.setGoldNum()
        this.getTeamListData()
        this.getStartTime()
        this.addTimes()
    },
    getStartTime(){
        var date = this.getDate()
        this.enterTime = date.getTime() 
        if(this.enterTime < this.data.startTime){
            this.enterTime = this.enterTime + 60000
        }
    },
    getDate(){
        var date = new Date()
        date.setTime(Gm.userData.getTime_m())
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date
    },
    getTeamListData(){
        if(this.data.startTime == 0){//未占领
            this.teamList = []
            for(var i=0;i<this.data.monsters.length;i++){
                 var data =Gm.config.getMonster(this.data.monsters[i])
                 data.isMonster = true
                 data.baseId = this.data.monsters[i]
                 this.teamList.push(data)
            }
            this.setTeamNode()
        }
        else{
            Gm.oreNet.sendOreDeffender(this.data.id)//获取
        }
    },
    setBgSprite(){
        if(this.isMe){
            this.bgSprite.node.height = 990
            this.oreRewardNode.active = true

            this.setTeamBtn.active = true
            this.battleBtn.active = false
        }
        else{
            this.bgSprite.node.height = 775
            this.oreRewardNode.active = false

            this.setTeamBtn.active = false
            this.battleBtn.active = true
        }
        this.titleName.string = this.config.name
    },
    setOreSprite(){
        var self = this
        Gm.load.loadSpriteFrame("/img/shuijing/"+ this.config.icon,function(sp,icon){
            if(icon && icon.node.isValid){
                icon.spriteFrame = sp
                icon.node.scale = self.config.size
                icon.node.y = 10 + self.config.offsety
            }
        },this.oreSprite)
    },
    setUserInfo(){
        if(this.data.info){
            this.nameLabel.string = this.data.info.name
            this.unionNameLabel.string = this.data.info.allianceName || ""
            Func.newHead2(this.data.info.head,this.headNode)
        }
        else{
            this.nameLabel.string = Ls.get(7500012)
            this.unionNameLabel.string = ""
        }
    },
    setGoldNum(){
        if(this.isMe){
            this.dNumLabel.string = this.oreSpeed
            this.goldNumLabel.string = this.goldSpeed
        }
        else{
            this.dNumLabel.string = this.data.perScore
            this.goldNumLabel.string = this.data.perGold
        }
        this.timeNode.active = this.isMe
    },
    setTeamNode(){
        if(this.teamNode && this.teamNode.isValid){
            Func.destroyChildren(this.teamNode)
            var fight = 0
            for(var i=0;i<this.teamList.length;i++){
                if( (typeof(this.teamList[i]) == "number" &&  this.teamList[i] != 0 ) || 
                (typeof(this.teamList[i]) == "object" && this.teamList[i].baseId !=0) ){
                    const v = this.teamList[i];
                    var itemSp = Gm.ui.getNewItem(this.teamNode,false)
                    itemSp.updateHero(v)
                    fight = fight + v.fight
                    if(this.data.info){
                        this.setCallBack(itemSp)
                    }
                }
            }
            var tFight = 0
            if(this.data.info){
                    tFight= fight
            }
            else{
                tFight =  this.config.military
            }
            this.fightValueLabel.string = Math.ceil(tFight)
        }
    },
    setCallBack(item){
        item.node.off(cc.Node.EventType.TOUCH_END)
        item.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            if (this.data.info.playerId == Gm.userInfo.id){
                return
            }
            Gm.ui.create("TeamListView",{isOther:true,heroData:Gm.heroData.toHeroInfo(item.data),enterName:"ArenaView"})
         })
    },
    onSetTeamBtnClick(){
        var teamList = [0,0,0,0,0,0]
        for(var i=0;i<6;i++){
            if(this.teamList[i] && this.teamList[i].heroId != 0){
                teamList[this.teamList[i].position-1] = this.teamList[i].heroId
            }
        }
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_ORE,type1:"set",id:this.data.id,teamList:teamList})
    },
    onBattleBtnClick(){
        if(!OreFunc.oreIsOpen()){
            Gm.floating(Ls.get(7500042))
            return
        }
        var logic = Gm.getLogic("OreLogic")
        if(!logic.checkMeCanBattle()){
            Gm.floating(Ls.get(7500043))
            return
        }
        if(logic.isOreInWarfree(this.data)){
            Gm.floating(Ls.get(7500044))
            return
        }
        //检测挑战次数
        if(Gm.oreData.getBattleCount() == 0 && this.data.info){
            var callback = function(currentNum){
                Gm.oreNet.sendOreBuyCount(currentNum)
            }
            Gm.ui.create("OreBuyView",{callback:callback,})
            return
        }
        //自己拥有挑战新的
        var id = Gm.oreData.myOreId
        var self = this
        var callback = function() {
            var fight = null
            if(!self.data.info){
                fight = parseInt(self.fightValueLabel.string)
            }
            Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_ORE,type1:"battle",id:self.data.id,fight:fight})
            Gm.ui.removeByName("OreMainInfo")
        }
        if(id){
            Gm.ui.create("OreBattleAlertView",{msg:Ls.get(7500031),callback:callback})
        }
        else{
            callback()
        }
    },
    onUnionAddClick(){
        if(!Gm.unionData.info){
            Gm.floating(Ls.get(7500049))
            return
        }
        if(this.data.info){
            var roomData = Gm.oreData.getEnterRoomDataByIndex(this.data.index)
            var num = Gm.oreData.getRoomPlayerNumUnion(roomData,Gm.unionData.info.allianceId)
            if(num>=2){
                Gm.ui.create("OreUnionAddView",{num:num,config:this.config,data:this.data})
            }
            else{
                Gm.floating(Ls.get(7500068))
            }
        }
    },

     //更新结束时间
    onDestroy(){
        this.clearTime()
        if(this.isMe){
            Gm.ui.getScript("OreMainView").setRewardSprite(this.totalGoldNum)
        }
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
    dealStartTime(startTime){
        var date = new Date()
        date.setTime(startTime+60*1000)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date.getTime()
    },
    updateRefreshTime:function(){
        if(this.timeNode.active){
            var tmpTime = (Gm.userData.getTime_m() -  this.dealStartTime(this.data.startTime))/1000
            if(tmpTime<0){
                tmpTime = 0
            }
            this.timeNumLabel.string = OreFunc.getTimeStr(tmpTime)
            tmpTime = (this.getDate().getTime() -  this.enterTime)/1000
            if(tmpTime<0){
                tmpTime = 0
            }
            var num = OreFunc.getRewardNumByTime(tmpTime,this.goldSpeed) 
            num = num + this.data.curGold
            this.totalGoldNum = num
            this.totalGoldNumLabel.string = "/" + num
            this.setRewardSprite(num)
            num = OreFunc.getRewardNumByTime(tmpTime,this.oreSpeed)
            num = num + this.data.curScore
            this.totalOreNumLabel.string = "/" + num
        }
    },
    onRewardBtnClick(){
        if(this.totalGoldNum == 0){
            Gm.floating(Ls.get(40007))
            return 
        }
        Gm.oreNet.sendOreReceive(this.data.id,this.data.index)
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
    }
});


