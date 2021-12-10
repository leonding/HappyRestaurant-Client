// LotteryFirst
cc.Class({
    extends: cc.Component,
    properties: {
        m_oBackNode:cc.Node,
        m_oListNode:cc.Node,
        m_oBackSprs:cc.Sprite,
        m_oTitleNameSprite:cc.Sprite,
        //m_oBtnInfo:cc.Node,
        //m_oBtnList:cc.Node,
        //m_oQualitySpr:cc.Sprite,
        //m_oJobName:cc.Node,
        m_oGuideNode:cc.Node,
        m_oDrawTimesLay:cc.Node,
        m_oLostLay1:cc.Label,
        m_oLostLay2:cc.Label,
        //m_oDrawTimesLabel:cc.Label,
        // wishNode
        m_oWishNode:cc.Node,
        m_oIconNodes:{
            default: [],
            type: cc.Node
        },
        m_oChoukImgs:{
            default: [],
            type: cc.Sprite
        },
        m_oWishCurrentNumber:cc.Label,
        m_oWishTotalNumber:cc.Label,
        m_oWishDesLabel:cc.RichText,
        m_oWishLockNode:cc.Node,
        m_oWishLabelColor:{
            default:[],
            type:cc.Color
        },
        m_oWishRedNode:cc.Node,

        m_oSuggestNode:cc.Node,

        m_oIconSprite1:cc.Sprite,
        m_oIconSprite2:cc.Sprite,
    },
    onEnable(){
        console.log("onEnable===:",this.node.name)
        this.nums = 1
        Gm.send(Events.GUIDE_ENTER,{sender:this})
        // Gm.bi.ui(this.node._name)
        // this.sendBi()
    },
    updateInfo:function(data){
        this.m_oData = data
        if (this.m_oData.data.nextFreeTime == 0){
            this.m_oBtnOne.getChildByName("free").getComponent(cc.RichText).string = ""
            this.m_oBtnOne.getChildByName("labelBgSprite").active = false
        }
        if (this.m_oData.config.oneCost.length > 0){ //免费一抽
            this.m_oBtnOne.getChildByName("pay").getComponent(cc.Label).string = ""
            this.m_oBtnOne.getChildByName("labelBgSprite").active = false
            this.m_oOwner.transBtn(this.m_oBtnOne,this.m_oData.config.oneCost,this.m_oData.data.nextFreeTime == 0,1)
        }

        if (this.m_oData.config.tenCost.length > 0){ //免费十抽
            this.m_oBtnTenFree.getChildByName("pay").getComponent(cc.Label).string = ""
            this.m_oBtnTenFree.getChildByName("labelBgSprite").active = false
            this.m_oOwner.transBtn(this.m_oBtnTenFree,this.m_oData.config.tenCost,null,10)
        }

        if (this.m_oData.config.payTenCost.length > 0){ //付费十抽
            this.m_oOwner.transBtn(this.m_oBtnTenPay,this.m_oData.config.payTenCost,null,10)
        }
        var tmpEnsure = Gm.config.getDrawBoxReward(this.m_oData.config.mode,this.m_oData.data.boxSumCount || 0)
        if (tmpEnsure && tmpEnsure.times){
            var tmpNum = tmpEnsure.times - (this.m_oData.data.boxSumCount || 0)
            this.m_oLostLay2.string = this.m_oData.data.boxSumCount
            this.m_oLostLay1.string = tmpEnsure.times

            //this.m_oDrawTimesLabel.string = cc.js.formatStr(Ls.get(20057),tmpEnsure.times)
        }
        this.m_oDrawTimesLay.active = (tmpEnsure && tmpEnsure.times)
        
        this.m_oTips.active = false
        if(this.m_oData.config.mode == 1)
        {
            this.updateWishNode(data.data.wishInfo)
        }
        if(this.m_oData.config.mode == 1 || this.m_oData.config.mode == 5){
            this.m_oSuggestNode.active = true
        }
    },
    addRed(item,type){
        if(this.m_oOwner.m_iSeleted == 0){
                if(type==1){
                    Gm.red.add(item,"lottery","commonOne")
                }
                else{
                    Gm.red.add(item,"lottery","commonTen")
                }
        }
        else if(this.m_oOwner.m_iSeleted == 1){
                if(type==1){
                    Gm.red.add(item,"lottery","friendOne")
                }
                else if(type == 10){
                    Gm.red.add(item,"lottery","friendTen")
                }
        }
    },
    updateView:function(owner,data){
        this.m_oOwner = owner
        this.m_oData = data[0]
        var freeNode = this.m_oListNode.getChildByName("freeNode")

        if (this.m_oData.config.oneCost.length > 0){ //免费一抽
            this.m_oBtnOne = owner.getFabBtn(0)
            freeNode.addChild(this.m_oBtnOne)
            this.m_oBtnOne.on('click',this.onOneClick,this)
            this.addRed(this.m_oBtnOne,1)
        }

        if (this.m_oData.config.tenCost.length > 0){ //免费十抽
            this.m_oBtnTenFree = owner.getFabBtn(0)
            freeNode.addChild(this.m_oBtnTenFree)
            this.m_oBtnTenFree.on('click',this.onTenFree,this)
            this.addRed(this.m_oBtnTenFree,10)
        }

        if (this.m_oData.config.payTenCost.length > 0){ //免费十抽
            this.m_oBtnTenPay = owner.getFabBtn(1)
            freeNode.addChild(this.m_oBtnTenPay)
            this.m_oBtnTenPay.on('click',this.onTenPay,this)
        }
        if(this.m_oData.data.fieldId == 1002){
            freeNode.getComponent(cc.Layout).spacingX = 90
        }else{
            freeNode.getComponent(cc.Layout).spacingX = 15
        }

        if (this.m_oData.config.darwQuality){
            this.m_oTips = owner.getFabTips()
            this.m_oListNode.addChild(this.m_oTips,-1)
            owner.transTips(this.m_oTips,this.m_oData.config.darwQuality)
        }
        
        //人物
        var tdata =LotteryFunc.getChouKaPersonRes(this.m_oOwner.m_iSeleted)
        Gm.load.loadSpriteFrame("img/chouka/"+tdata.person,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.m_oBackSprs)


       //title
       if(tdata.titleName){
           this.m_oTitleNameSprite.node.active = true
            Gm.load.loadSpriteFrame("img/chouka/"+tdata.titleName,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                    icon.node.x = tdata.pos.x
                    icon.node.y = tdata.pos.y
                }
            },this.m_oTitleNameSprite)
       }
       else{
           this.m_oTitleNameSprite.node.active = false
       }


        //icon1
        if(this.m_oData.config.res1){
             this.m_oIconSprite1.node.active = true
            Gm.load.loadSpriteFrame("img/chouka/"+this.m_oData.config.res1,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.m_oIconSprite1)
        }else{
            this.m_oIconSprite1.node.active = false
        }

        if(this.m_oData.config.res){
            this.m_oIconSprite2.node.active = true
            Gm.load.loadSpriteFrame("img/chouka/"+this.m_oData.config.res,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.m_oIconSprite2)
        }
        else{
             this.m_oIconSprite2.node.active = false
        }

        this.updateInfo(data[0])
        Gm.send(Events.GUIDE_ENTER,{sender:this})
    },
    onOneClick:function(){
        var self = this
        var tmpSend = this.m_oOwner.checkItem(this.m_oData.config.oneCost,this.m_oData.data.nextFreeTime == 0)
        if(tmpSend){
            tmpSend = Gm.checkBagAddTeam(1)
        }
        if(tmpSend && this.m_oData.data.nextFreeTime != 0){
            if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
                tmpSend = this.m_oOwner.checkCostDiamond(0, this.m_oData.config.oneCost, function(data){
                    Gm.ui.create("LotteryDiamondTip",{num:1,data:data,id:self.m_oData.config.id,drawType:0,quality:self.m_oData.config.darwQuality})
                })
            }
        }
        if (tmpSend || this.m_oData.data.nextFreeTime == 0){
            this.setLockNode()
            Gm.cardNet.sendDrawCard(this.m_oData.config.id,0,this.m_oData.config.darwQuality)
        }
    },
    onTenFree:function(){
        var self = this
        var tmpSend = this.m_oOwner.checkItem(this.m_oData.config.tenCost)
        if(tmpSend){
            tmpSend = Gm.checkBagAddTeam(10)
        }
        if(tmpSend){
            if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
                tmpSend = this.m_oOwner.checkCostDiamond(1, this.m_oData.config.tenCost, function(data){
                    Gm.ui.create("LotteryDiamondTip",{num:10,data:data,id:self.m_oData.config.id,drawType:1,quality:self.m_oData.config.darwQuality})
                })        
            }
        }
        if (tmpSend){
            this.setLockNode()
            Gm.cardNet.sendDrawCard(this.m_oData.config.id,1,this.m_oData.config.darwQuality)
        }
    },
    onTenPay:function(){
        var self = this
        var tmpSend = this.m_oOwner.checkItem(this.m_oData.config.payTenCost)
        if(tmpSend){
            tmpSend = Gm.checkBagAddTeam(10)
        }
        if(tmpSend){
            if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
                tmpSend = this.m_oOwner.checkCostDiamond(2, this.m_oData.config.payTenCost, function(data){
                    Gm.ui.create("LotteryDiamondTip",{num:10,data:data,id:self.m_oData.config.id,drawType:2,quality:self.m_oData.config.darwQuality})
                })        
            }
        }        
        if (tmpSend){
            this.setLockNode()
            Gm.cardNet.sendDrawCard(this.m_oData.config.id,2,this.m_oData.config.darwQuality)
        }
    },
    onInfoClick:function(){
        Gm.ui.create("LotteryInfo",this.m_oData.config.darwDesc)
    },
    onListClick:function(){

    },
    onHelpClick:function(){

    },
    updateOffer:function(offerStatus){

    },
    timeToDayAndH:function(destTime){
        var _fen = 60
        var _shi = 3600
        var _tian = 86400
        var tmpTian = Math.floor(destTime/_tian)
        var tmpShi = Math.floor((destTime%_tian)/_shi)
        var tmpFen = Math.ceil((destTime%_shi)/_fen)
        var str = ""
        if(tmpTian>0){
            str = str + tmpTian +  Ls.get(5308)
            if(tmpShi>0){
                str = str +tmpShi +Ls.get(5309)
            }
        }
        else{
            str = str +tmpShi + Ls.get(5309) + tmpFen +  Ls.get(5310)
        }
        return str
    },
    updateRefreshTime:function(){
        if (this.nums > 0){
            this.nums = this.nums - 1
            Gm.send(Events.GUIDE_ENTER_DONE,{sender:this})
        }
        if (this.m_oData.data.nextFreeTime > 0){
            var tmpTime = (this.m_oData.data.nextFreeTime - (Gm.userData.getTime_m() - this.m_oData.data.nowTime))
            var time = this.m_oBtnOne.getChildByName("free")
            if (tmpTime < 0){
                time.getComponent(cc.RichText).string = ""
                this.m_oData.data.nextFreeTime = 0
                Gm.cardNet.sendDrawCardInfo(this.m_oData.config.id)
                this.m_oBtnOne.getChildByName("labelBgSprite").active = false
                 this.m_oOwner.transBtn(this.m_oBtnOne,this.m_oData.config.oneCost,true,1)
            }else{
                var str = "<color=#FDF100>" + this.timeToDayAndH(tmpTime/1000)  + "</c><color=#ffffff>" + Ls.get(20010) + "</color>"
                time.getComponent(cc.RichText).string = str
                this.m_oBtnOne.getChildByName("labelBgSprite").active = true
            }
        }
        if (this.m_oData.data.nextResetWishTime > 0){
            var tmpTime = (this.m_oData.data.nextResetWishTime - (Gm.userData.getTime_m() - this.m_oData.data.nowTime))
            if(tmpTime < 0){
                this.m_oData.data.nextResetWishTime = 0
                var layer = Gm.ui.getScript("LotteryWishList")
                if(layer){
                    layer.reset()
                }
                for(const i in this.m_oData.data.wishInfo){
                    this.m_oData.data.wishInfo[i].status = 0
                }
                this.updateWishNode(this.m_oData.data.wishInfo)
            }
        }
    },
    getGuide:function(destName){
        if (destName == "m_oBtnOne"){
            return this.m_oGuideNode
        }else{
            return this[destName]
        }
    },
    getClick:function(destName){
        if (destName == "m_oBtnOne"){
            return "onOneClick"
        }
    },
    onTopBoxClick:function(){
        var tmpEnsure = Gm.config.getDrawBoxReward(this.m_oData.config.mode,this.m_oData.data.boxSumCount || 0)
        if (tmpEnsure && tmpEnsure.reward){
            Gm.award({award:tmpEnsure.reward})
        }
    },
    updateWishNode:function(data){
        data = data || []
        this.m_oWishNode.active = true
        var wishNum = 0
        var finishNum = 0
        for(var i=0;i<2;i++){
            this.m_oChoukImgs[i].node.active = false
            if(data[i] && data[i].baseId != 0)
            {
                var baseId = Math.ceil(data[i].baseId/1000)
                var qualityId = data[i].baseId
               
                var newData = {}
                newData.baseId = baseId
                newData.qualityId = qualityId
                newData.level = 1
                newData.lock = false
               
                var heroConf = Gm.config.getHero(baseId,qualityId)
                if(heroConf){
                    newData.quality = heroConf.quality
                    newData.camp = heroConf.camp
                    newData.job= heroConf.job
                }
                Func.destroyChildren(this.m_oIconNodes[i])
                var newItem = Gm.ui.getNewItem(this.m_oIconNodes[i],true)
                newItem.updateHero(newData)
                newItem.setLabStr("")
                newItem.setTips(false)
                wishNum = wishNum + 1
                if(data[i].status == 1){
                    this.m_oChoukImgs[i].node.active = true
                    newItem.setGray(true)
                    finishNum = finishNum + 1
                }
            }
            else{
                Func.destroyChildren(this.m_oIconNodes[i])
                var newItem = Gm.ui.getNewItem(this.m_oIconNodes[i],true)
                newItem.setLabStr("")
                newItem.setChoice(true,false)
                newItem.loadFloor("share_img_kd1")
                newItem.setTips(false)
                newItem.setData()
            }
        }
        //更新显示抽卡次数
        this.setWishNode(wishNum,finishNum)
    },
    onWishButtonClick:function(){
        Gm.ui.create("LotteryWishList",{data:this.m_oData.data})
        if(this.m_oWishRedNode.active){
            var key = Gm.userInfo.id + "wishIsOpen"
            cc.sys.localStorage.setItem(key, 1)
            this.m_oWishRedNode.active = false
        }
    },
    onSuggestBtnClick:function(){
        Gm.ui.create("SuggestView",{m_iSeleted:this.m_oOwner.m_iSeleted})
    },
    setLockNode(){
       var  lockNode = this.m_oOwner.lockNode
       lockNode.active = true
       setTimeout(() => {
           if(lockNode && lockNode.isValid){
               lockNode.active = false
           }
       }, 1000);
    },
    setWishNode(wishNum,finishNum){
        if(Gm.lotteryData.wishIsOpen()){
            this.m_oWishLockNode.active = false
            this.m_oWishCurrentNumber.string = Gm.lotteryData.getWishNumber()
            this.m_oWishTotalNumber.string = LotteryFunc.getWishTotalNumber()
            if(Gm.lotteryData.getWishNumber() >= LotteryFunc.getWishTotalNumber() - 1){
                this.m_oWishCurrentNumber.node.color = this.m_oWishLabelColor[1]
            }
            else{
                this.m_oWishCurrentNumber.node.color = this.m_oWishLabelColor[0]
            }
            LotteryFunc.setWishDesLabel(this.m_oWishDesLabel,wishNum,finishNum)
            var key = Gm.userInfo.id + "wishIsOpen"
            var num = cc.sys.localStorage.getItem(key) || 0
            if(num == 0 && !Gm.lotteryData.hasWishHero()){
                this.m_oWishRedNode.active = true
            }
        }
        else{
             this.m_oWishLockNode.active = true
             var num =  LotteryFunc.getWishOpenNumber() -  Gm.lotteryData.getWishOpenNumber()
             var str = 	cc.js.formatStr(Ls.get(5845),num)
             this.m_oWishDesLabel.string = str
        }        
    },
    onWishLockBtnClick(){
        var num =  LotteryFunc.getWishOpenNumber() -  Gm.lotteryData.getWishOpenNumber()
        var str = 	cc.js.formatStr(Ls.get(5845),num)
        Gm.floating(str)
    },
});

