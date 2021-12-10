// lotterywishlist
cc.Class({
    extends: require("BaseView"),

    properties: {
        
        HeroFlyItem:cc.Node,
        scroll:cc.ScrollView,

        m_addNodes:{
            default:[],
            type:cc.Node
        },
        
        m_oFilterNode:cc.Node,
        m_oFilterPerfab:cc.Prefab,

        m_oPercentLabel:cc.Label,

        m_oWishCurrentNumber:cc.Label,
        m_oWishTotalNumber:cc.Label,
        m_oWishLabelColor:{
            default:[],
            type:cc.Color
        },
        m_oWishDesLabel:cc.RichText,
    },
    onLoad(){
        this._super()
        this.fileId = 1001
        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)

        this.m_iJobValue = 0
        this.m_iFilterValue = 0

        this.heroAddNodes = []
        for (let index = 0; index < 2; index++) {
            var itemSp1 = Gm.ui.getNewItem(this.m_addNodes[index], true)
            //itemSp1.setData()
            itemSp1.setChoice(true)
            itemSp1.setTips(false)
            this.heroAddNodes.push(itemSp1)
        }
        this.selectHeroIds = [0,0]
        //var percent = Gm.config.getConst("hero_wish_chance")
        this.m_oPercentLabel.string =Ls.get(20068)
        this.setWishNode()
    },
    register:function(){
        
    },

    enableUpdateView:function(args){
        if (args){
            this.data = args.data 
            if(this.data.wishInfo.length > 0){
                for(var i = 0; i < this.data.wishInfo.length; i++){
                    if(this.selectHeroIds[i] == 0){
                        this.selectHeroIds[i] = this.data.wishInfo[i].baseId
                    }
                }
            }
            this.initHeroList()
            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job
                    this.initHeroList()
                }
            }.bind(this))
        }
    },
    initHeroList(){
        this.heroFlyAll = Gm.heroData.heroWishAll(1001,this.m_iFilterValue,this.m_iJobValue)

        var selectHero = []
        for(var i = 0; i < this.selectHeroIds.length; i++){
            selectHero["id"] = this.selectHeroIds[i]
            selectHero["index"] = i
            selectHero["state"] = this.selectHeroIds[i] != 0 ? 1: 0
            selectHero["status"] = this.data.wishInfo[i] ? this.data.wishInfo[i].status : 0     
            this.updateSelectHero(selectHero)
        }
        //更新概率
        this.setLabelPercent()

        this.scroll.scrollToTop()
        this.removeAllPoolItem(this.scroll.content)

        Gm.ui.simpleScroll(this.scroll,this.heroFlyAll,function(v,tmpIdx){
            var item = this.getPoolItem()
            item.active = true
            this.scroll.content.addChild(item)

            var itemSp = item.getComponent("HeroWishItem")
            itemSp.setData(v,this)
            v.isRed = HeroFunc.getFlyList([v],this.heroFlyAll,{}).length >0
            itemSp.updateHero(v)
            itemSp.hideAllCheck()
            var tmpCan = false
            for(const i in this.selectHeroIds){
                if (this.selectHeroIds[i] == v.qualityId){
                    tmpCan = true
                    break
                }
            }
            itemSp.setCheck(tmpCan)
            var str =  this.m_tPercent[v.qualityId] + "%"
            itemSp.setLabStr(str)
            itemSp.setLabelFontSize(14)
            return item
        }.bind(this))
    },
    //子类继承
    getBasePoolItem(){
        return this.HeroFlyItem
    },

    onItemClick(item){
        var isFull = true
        for(var i = 0; i < this.selectHeroIds.length; i++){
            if(this.selectHeroIds[i] == item.data.qualityId || this.selectHeroIds[i] == 0){
                isFull = false
                break
            }
        }
        if(isFull){
            //女神已满
            Gm.floating(20071)
            return
        }
        if(!Gm.lotteryData.isActivateHero(this.fileId,item.data.qualityId)){
            Gm.floating(Ls.get(5831))
            return
        }
        var herostate = -1
        var heroindex = -1
        var length = this.selectHeroIds.length
        var index = this.selectHeroIds.indexOf(item.data.qualityId)
        if(index == -1){
            if(length == 0){
                this.selectHeroIds[0] = item.data.qualityId
                herostate = 1
                heroindex = 0
            }else{
                for(var i = 0; i < length; i++){
                    if(this.selectHeroIds[i] == null || this.selectHeroIds[i] == 0){
                        this.selectHeroIds[i] = item.data.qualityId
                        herostate = 1
                        heroindex = i
                        break
                    }
                }
            }
        }else{
            if(this.data.wishInfo[index] && this.data.wishInfo[index].status == 1){
                //女神已实现
                Gm.floating(20072)
                return
            }else{
                this.selectHeroIds[index] = 0
                herostate = 0
                heroindex = index
            }
        }
        var selectHero = []
        selectHero["id"] = item.data.qualityId
        selectHero["index"] = heroindex
        selectHero["state"] = herostate
        this.updateSelectHero(selectHero)

        //更新概率
        this.setLabelPercent(true)
    },
    updateSelectHero(selectHero){

        // cc.log("刷新武将==============",this.selectItem)
        // this.tipLab.string = Ls.get(5265)
        // this.heroInfoNode.active = true
        // this.btn.node.active = true

        var heroData = null//this.selectItem.data
        var selectItem = null
        for (var i = 0; i < this.heroFlyAll.length; i++) {
            var v = this.heroFlyAll[i]
            if(v.qualityId == selectHero.id){
                heroData = v
                break
            }
        }
        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var v = this.scroll.content.children[i].getComponent("HeroWishItem")
            if(v.data.qualityId == selectHero.id){
                selectItem = v
                break
            }
        }

        
        var conf = Gm.config.getHero(0,selectHero.id)
        this.heroConf = conf
        if(selectHero.state == 1){
            if(heroData){
                this.heroAddNodes[selectHero.index].updateHero(heroData)
            }
            if(selectItem){
                selectItem.setCheck(true)
            }
            this.m_addNodes[selectHero.index].getChildByName("New Label").getComponent(cc.Label).string = conf.name
        }else{
            this.heroAddNodes[selectHero.index].setData()
            if(selectItem){
                selectItem.setCheck(false)
            }
            this.heroAddNodes[selectHero.index].setChoice(true)
            this.m_addNodes[selectHero.index].getChildByName("New Label").getComponent(cc.Label).string = ""
        }
    
        var mask = this.m_addNodes[selectHero.index].getChildByName("mask")
        mask.active = Boolean(selectHero.status)
        mask.zIndex = 1
        var icon = this.m_addNodes[selectHero.index].getChildByName("icon")
        icon.active = Boolean(selectHero.status)
        icon.zIndex = 2  

        //var labStr = ""
        // var list = Gm.heroData.getGreatThanEqualHeros(selectHero.id)
        // if(list == 0 && selectHero.state == 1){
        //     labStr = Ls.get(1808)
        // }
        //this.heroAddNodes[selectHero.index].setLabStr(labStr)        
    },
    reset(){
        var selectHero = []
        for(var i = 0; i < this.selectHeroIds.length; i++){
            selectHero["id"] = this.selectHeroIds[i]
            selectHero["index"] = i
            selectHero["state"] = 1
            selectHero["status"] = 0     
            this.updateSelectHero(selectHero)   
            if(this.data.wishInfo[i] && this.data.wishInfo[i].status == 1){
                this.data.wishInfo[i].status = 0
            }
        }
    },
    onBack(){
        if(!this.data.wishInfo[0]){
            this.data.wishInfo[0] = {baseId:0,status:0}
        }
        if(!this.data.wishInfo[1]){
            this.data.wishInfo[1] = {baseId:0,status:0}
        }
        if(this.data.wishInfo[0].baseId == this.selectHeroIds[0] && this.data.wishInfo[1].baseId == this.selectHeroIds[1]){
            this._super()
            return
        }
        Gm.cardNet.sendSetWishList(this.selectHeroIds)
        
        for(var i = 0; i < this.data.wishInfo.length; i++){
            if(this.data.wishInfo[i].baseId != this.selectHeroIds[i]){
                this.data.wishInfo[i].baseId = this.selectHeroIds[i]
            }
        }
        Gm.send(Events.UPDATE_WISH_LIST,{sender:this.data.wishInfo})
        this._super()
    },
    onIconButtonClick:function(sender,index){
        if(this.data.wishInfo[index] && this.data.wishInfo[index].status == 1){
            //女神已实现
            Gm.floating(20072)
            return
        }
        else
        {
            if(this.selectHeroIds[index] != 0)
            {
                var selectHero = []
                selectHero["id"] = this.selectHeroIds[index]
                this.selectHeroIds[index] = 0
                selectHero["index"] = index
                selectHero["state"] = 0
                this.updateSelectHero(selectHero)
                //更新概率
               this.setLabelPercent(true)
            }
        }
    },
    updateHeroPencent(){
        var list = Gm.heroData.heroWishAll(1001,0,0)
        this.m_tPercent = {}
        var seleteNumberPercent = 0
        var seleteNumber = 0
        var changePercent = Gm.config.getConst("hero_wish_chance")/100
        var total = LotteryFunc.getChoukaPercentByQualityId(5)
         for(var i=0;i<2;i++){
            if(this.selectHeroIds[i] !=0 && (!this.data.wishInfo[i] || (this.data.wishInfo[i] && this.data.wishInfo[i].status != 1))){
                seleteNumber = seleteNumber + 1
                var  percent = this.getPercent(this.selectHeroIds[i])
                seleteNumberPercent =  seleteNumberPercent + (percent+(1-percent)*changePercent)*total
            }
        }
        //更新下面的
         for (var i = 0; i < list.length; i++) {
            // var v = this.scroll.content.children[i].getComponent("HeroWishItem")
            var precent =this.getHeroPencent(list[i].qualityId,seleteNumberPercent,seleteNumber,total,changePercent)* 100
            this.m_tPercent[list[i].qualityId] = precent.toFixed(2)
            // var str =  precent.toFixed(2) + "%"
            // v.setLabStr(str)
            // v.setLabelFontSize(14)
         }
         //更新上面2个
         for(var i=0;i< this.selectHeroIds.length;i++){
             if(this.selectHeroIds[i] != 0){
                 // var precent = this.getHeroPencent(this.selectHeroIds[i],seleteNumberPercent,seleteNumber,total,changePercent)* 100
                 var str =  this.m_tPercent[this.selectHeroIds[i]] + "%"
                 this.heroAddNodes[i].setLabStr(str)
                 this.heroAddNodes[i].setLabelFontSize(14)
                 this.heroAddNodes[i].setLabeLFontPositionY(3)
                 this.heroAddNodes[i].updateCountLabX(10)
             }
         }
    },
    getHeroPencent(herId,seleteNumberPercent,seleteNumber,total,changePercent){
        var key = false
        for(var i=0;i<2;i++){
            if(this.selectHeroIds[i] == herId  && (!this.data.wishInfo[i] || this.data.wishInfo[i] && this.data.wishInfo[i].status != 1) ){
                key = true
            }
        }
        var percent = this.getPercent(herId)
        if(key){//是选中的
            return  (percent+(1-percent)*changePercent)*total
        }
        else{
           return  (total - seleteNumberPercent)*percent
        }
    },
    //占0.05的百分比
    getPercent(qualityId){
        if(!this.percentData){
            this.percentData = []
            var data = Gm.lotteryData.getProbabilityDisplayDataByIndexAndQuli(1,5)
            var total = LotteryFunc.getChoukaPercentByQualityId(5)
            //计算出未激活的卡的
            var tempPercent = 0
            for(var i=0;i<data.length;i++){
                if(!Gm.lotteryData.isActivateHero(this.fileId,data[i].wId)){
                    tempPercent = tempPercent + data[i].weight
                }
            }
            //计算出所有卡的新的占比
            for(var i=0;i<data.length;i++){
                if(!Gm.lotteryData.isActivateHero(this.fileId,data[i].wId)){
                    this.percentData[data[i].wId] = 0
                }
                else{
                    this.percentData[data[i].wId] = parseFloat(data[i].weight + this.getAddWeight(total,parseFloat(data[i].weight),tempPercent) )/total
                }
            }
        }
         if(this.percentData[qualityId]){
             return this.percentData[qualityId]
         }
        // cc.log("LotteryWishList:",qualityId)
        return 0
    },
    getAddWeight(total,weight,nActivityWight){
        var surplusWeight = total - nActivityWight
        var tpercent = weight / surplusWeight
        var weight = nActivityWight * tpercent
        return weight
    },
    setLabelPercent(draw){
        // setTimeout(() => {
        if(this.node && this.node.isValid){
            this.updateHeroPencent()
            if (draw){
                for(const i in this.scroll.content.children){
                    const v = this.scroll.content.children[i].getComponent("HeroWishItem")
                    var str =  this.m_tPercent[v.data.qualityId] + "%"
                    v.setLabStr(str)
                    v.setLabelFontSize(14)
                }
            }
        }
        // }, 0.01);
    },
    setWishNode(){
        this.m_oWishCurrentNumber.string = Gm.lotteryData.getWishNumber()
        var number = LotteryFunc.getWishTotalNumber()
        this.m_oWishTotalNumber.string = number
        if(Gm.lotteryData.getWishNumber() >= number - 1){
            this.m_oWishCurrentNumber.node.color = this.m_oWishLabelColor[1]
        }
        else{
            this.m_oWishCurrentNumber.node.color = this.m_oWishLabelColor[0]
        }
        var number1  = Math.max(0,number - Gm.lotteryData.getWishNumber())
        this.m_oWishDesLabel.string =  cc.js.formatStr(Ls.get(20073),number1)
    },
});
