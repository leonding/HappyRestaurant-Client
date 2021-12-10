var BaseView = require("PageView")

// LotteryMain
cc.Class({
    extends: BaseView,

    properties: {
        m_tFabTab:{
            default: [],
            type: cc.Prefab,
        },
        m_tTopNode:{
            default: [],
            type: cc.Node,
        },
        m_oFabBtn:cc.Node,
        m_oFabTips:cc.Node,

        m_oShowNode:cc.Node,

        btnFrame:{
            default: [],
            type:cc.SpriteFrame,
        },
        btnColor:{
            default: [],
            type:cc.Color,
        },
        m_oBgSprite:cc.Sprite,
        lockNode:cc.Node
    },
    onLoad(){
        this._super()
        this.addTimes()
    },
    onEnable:function(){
        this._super()
        Gm.audio.stopDub();
    },
    enableUpdateView:function(args){
        if (args && args.page >= 0){
            this.m_iLostTime = 0
            Func.destroyChildren(this.m_oShowNode)
            this.m_oRunSpt = null
            this.m_oData = Gm.lotteryData.openAll()
            this.m_iSeleted = -1
            var tmpIdx = 0
            if (args && args.page){
                tmpIdx = args.page
            }
            this.pages = []
            
            var tmpPage = args.page
            var tmpNode = null
            if (tmpPage == 4){
               tmpNode = cc.instantiate(this.m_tFabTab[1])
            }else{
                tmpNode = cc.instantiate(this.m_tFabTab[0])
            }
            this.m_oShowNode.addChild(tmpNode)
            this.pages.push(tmpNode);

            this.updateSeletIndex(tmpIdx)
            this.tmpPage = tmpPage
        }
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.BAG_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.UPDATE_WISH_LIST] = this.onWishListUpdate.bind(this)
    },
    onUserInfoUpdate:function(){
        var tmpData = Gm.lotteryData.getData(this.m_iSeleted)
        LotteryFunc.setTopNode(tmpData,this.m_tTopNode)
    },
    updateSeletIndex:function(destIndex){
        if (this.m_iSeleted != destIndex){
            this.m_iSeleted = destIndex
            const tmpNode = this.pages[0]
            this.m_oRunSpt = tmpNode.getComponent(tmpNode.name)
            if (this.m_oRunSpt.m_oOwner){
                this.m_oRunSpt.updateInfo(this.m_oData[this.m_iSeleted][0])
            }else{
                this.m_oRunSpt.updateView(this,this.m_oData[this.m_iSeleted])
            }
            this.onUserInfoUpdate()
                    
            Gm.load.loadSpriteFrame("img/chouka/"+this.m_oData[this.m_iSeleted][0].config.res2,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.m_oBgSprite)
        }
    },
    updateInfo:function(){
        if (this.m_oRunSpt){
            var tmpData = Gm.lotteryData.getData(this.m_iSeleted)
            for(const i in tmpData){
                this.m_oRunSpt.updateInfo(tmpData[i])
            }
            // this.m_oRunSpt.updateOffer(tmpData.offerStatus)
            // 
        }
    },
    updateDraw:function(){
        if (this.m_oRunSpt){
            var tmpData = Gm.lotteryData.getOne(Gm.cardNet.m_iDrawActivity,Gm.cardNet.m_iDrawField)
            this.m_oRunSpt.updateDraw(tmpData)
        }
    },
    onCloseClick:function(){
        this.onBack()
    },
    onDestroy(){
        if(this.tmpPage == 0){
            if(Gm.lotteryData.checkCommonOneRed()){
            Gm.lotteryData.setCheckRedTime(this.tmpPage,"one")
            }
            if(Gm.lotteryData.checkCommonTenRed()){
                Gm.lotteryData.setCheckRedTime(this.tmpPage,"ten")
            }
            Gm.red.refreshEventLotteryState()
        }
        else if(this.tmpPage == 1){
            if(Gm.lotteryData.checkFriendOneRed() || Gm.lotteryData.checkFriendTenRed() ){
                Gm.lotteryData.setCheckRedTime(this.tmpPage)
                Gm.red.refreshEventLotteryState()
            }
        }
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
    updateRefreshTime:function(){
        if (this.m_oRunSpt && this.m_oRunSpt.updateRefreshTime){
            this.m_oRunSpt.updateRefreshTime()
        }
        if (this.m_iLostTime){
            // var time = this.m_iLostTime - Gm.userData.getTime_s()
            // if (time < 0){
            //     this.m_iLostTime = 0
            //     Gm.cardNet.sendDrawCardInfo(this.m_oData[this.m_iSeleted].activityID)
            // }else{
            // }
        }
    },
    transBtn:function(node,data,isFree,num){
        var name = node.getChildByName("name").getComponent(cc.Label)
        var lay = node.getChildByName("lay")
        var type = lay.getChildByName("type")
        var spr = lay.getChildByName("spr")
        var lab = lay.getChildByName("lab").getComponent(cc.Label)
        if(this.m_iSeleted == 1){
            spr.x = -55
        }
        var tmpType = 0
        var tmpFree = 0
        var tmpNum = 0
        var tmpSprite = null
        var tmpHas = false
        var useGoldPay = false //是否使用付费的
        for(const i in data){
            // if (data[i].type == ConstPb.itemType.TOOL){
                tmpType = num
                // if (data[i].num == 1){
                //     tmpType = 1
                // }else{
                //     tmpType = 10
                // }
            // }else if(data[i].type == ConstPb.itemType.PLAYER_ATTR){
            //     if(data[i].num == 10){
            //         tmpType = 1
            //     }
            // }
            var item = Func.itemConfig(data[i])
            tmpSprite = item.con.icon
            tmpNum = data[i].num
            if (data[i].id == ConstPb.playerAttr.PAY_GOLD){
                tmpFree = 2
            }else if(data[i].id == ConstPb.playerAttr.GOLD){
                tmpFree = 1
            }else{
                tmpFree = 0
            }
            var hasNum = item.num
            if (hasNum >= data[i].num){
                tmpHas = true
                if(tmpFree == 1){
                    if(data[i].num > (Gm.userInfo.golden || 0)){//免费钻石可以使用付费钻石
                         useGoldPay = true
                    }
                }
                break
            }
        }
        
        if (tmpType == 1){
            name.string = Ls.get(20036)
        }else{
            name.string = Ls.get(20037)
        }
        if (isFree){
            lab.string = Ls.get(20009)//免费一回
             lab.node.color = cc.color(255,255,255)
            lab.node.x = 0
            lab.node.setAnchorPoint(0.5,0.5)
            spr.active = false
            type.active = false
        }else{
             lab.node.x = 78.22
             lab.node.setAnchorPoint(1,0.5)
            type.active = true
            spr.active = true
            Gm.load.loadSpriteFrame("img/items/" +tmpSprite,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                    var tmpScale = 30/sp._originalSize.width
                    icon.node.width = sp._originalSize.width * tmpScale
                    icon.node.height = sp._originalSize.height * tmpScale
                }
            },spr.getComponent(cc.Sprite))
            lab.string = tmpNum
            if (tmpHas){
                lab.node.color = cc.color(255,255,255)
            }else{
                lab.node.color = cc.color(255,0,0)
            }
            if (tmpFree == 1){
                if(useGoldPay){
                    type.getComponent(cc.Label).string = Ls.get(20050)
                }
                else{
                    type.getComponent(cc.Label).string = Ls.get(20053)
                }
            }else if(tmpFree == 2){
                type.getComponent(cc.Label).string = Ls.get(20050)
            }else{
                type.getComponent(cc.Label).string = ""
            }

             //使用券的情况
            if(this.m_iSeleted == 0){
                if(type.getComponent(cc.Label).string == ""){
                    spr.x = -61
                }
                else{
                    spr.x = -21.22
                }
            }
        }
    },
    getFabBtn:function(frameValue){
        var tmpNode = cc.instantiate(this.m_oFabBtn)
        tmpNode.getComponent(cc.Sprite).spriteFrame = this.btnFrame[frameValue]
        tmpNode.active = true
        tmpNode.getChildByName("name").getComponent(cc.LabelOutline).color = this.btnColor[frameValue]
        var lay = tmpNode.getChildByName("lay")
        lay.getChildByName("type").getComponent(cc.LabelOutline).color = this.btnColor[frameValue]
        lay.getChildByName("lab").getComponent(cc.LabelOutline).color = this.btnColor[frameValue]
        return tmpNode
    },
    transTips:function(node,quality){
        var lay = node.getChildByName("lay")
        var type = lay.getChildByName("type").getComponent(cc.Label)
        var spr = lay.getChildByName("spr").getComponent(cc.Sprite)
        var lab1 = lay.getChildByName("lab1").getComponent(cc.Label)
        var lab2 = lay.getChildByName("lab2").getComponent(cc.Label)
        var lab3 = lay.getChildByName("lab3").getComponent(cc.Label)
        type.string = Ls.get(20050)
        var gold = Func.itemConfig({type:ConstPb.itemType.TOOL,id:1001})
        Gm.load.loadSpriteFrame("img/items/" +gold.con.icon,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
                var tmpScale = 30/sp._originalSize.width
                icon.node.width = sp._originalSize.width * tmpScale
                icon.node.height = sp._originalSize.height * tmpScale
            }
        },spr)
        lab1.string = Ls.get(20051)
        var con = Gm.config.getHeroType(quality)
        if (con){
            lab2.string = con.childTypeName
        }
        lab3.string = Ls.get(20052)
    },
    getFabTips:function(){
        var tmpNode = cc.instantiate(this.m_oFabTips)
        tmpNode.active = true
        return tmpNode
    },
    checkItem:function(data,isNoTips){
        if (data.length > 0){
            for(const i in data){
                var tmpNum = 0
                if (data[i] == ConstPb.playerAttr.PAY_GOLD){
                    tmpNum = Gm.userInfo.golden || 0
                }else if(data[i] == ConstPb.playerAttr.GOLD){
                    tmpNum = Gm.userInfo.payGolden || 0
                }else if(data[i] == ConstPb.playerAttr.FRIEND_POINT){
                    tmpNum = Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.FRIEND_POINT) || 0
                }else{
                    var item = Func.itemConfig(data[i])
                    tmpNum = item.num
                }
                if (tmpNum >= data[i].num){
                    return true
                }
            }
        }
        if (!isNoTips){
            var item = data[data.length-1]
            var conf = Gm.config.getItem(item.id)
            if (item.id == ConstPb.playerAttr.GOLD){
                Gm.floating(2001)
            }else if (conf){
                Gm.floating(conf.name + Ls.get(1740))
            }else{
                Gm.floating(20011)    
            }
            Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.TOOL,baseId:item.id})    

            // Gm.floating(Ls.get(1527))
        }
        return false
    },
    checkCostDiamond:function(drawType, data, func){
        if(data.length > 0){
            for(const i in data){
                var tmpNum = 0
                if(data[i] == ConstPb.playerAttr.PAY_GOLD){
                    tmpNum = Gm.userInfo.golden || 0
                }else if(data[i] == ConstPb.playerAttr.GOLD){
                    tmpNum = Gm.userInfo.payGolden || 0
                }else if(data[i] == ConstPb.playerAttr.FRIEND_POINT){
                    tmpNum = Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.FRIEND_POINT) || 0
                }else{
                    var item = Func.itemConfig(data[i])
                    tmpNum = item.num
                }
                if(tmpNum >= data[i].num){
                    if(data[i].id == ConstPb.playerAttr.PAY_GOLD || data[i].id == ConstPb.playerAttr.GOLD || data[i].id == LotteryFunc.TICKET_BASE || data[i].id == LotteryFunc.TICKET_HIGH){
                        var gold = 0
                        var gold_pay = 0
                        var ticket = 0
                        var ticket_high = 0
                        if(data[i].id == ConstPb.playerAttr.GOLD){
                            var cost = Gm.userInfo.golden - data[i].num 
                            gold = data[i].num
                            if(cost < 0){   
                                gold_pay = Math.abs(cost)
                            }
                            // else if(drawType == 0){//单抽只有消耗付费钻才提示
                            //     return true
                            // }
                        }else if(data[i].id == ConstPb.playerAttr.PAY_GOLD){
                            gold_pay = data[i].num
                        }else if(data[i].id == LotteryFunc.TICKET_BASE || data[i].id == LotteryFunc.TICKET_HIGH){
                            if(drawType == 0){
                                return true
                            }
                            if(data[i].id == LotteryFunc.TICKET_BASE){
                                ticket = data[i].num
                            }else{
                                ticket_high = data[i].num
                            }
                        }
                        if(func){
                            func({gold:gold,gold_pay:gold_pay,ticket:ticket,ticket_high:ticket_high})
                        }
                        return false    
                    }
                    return true
                }
            }
        }
        return false
    },
    onAddsClick:function(){
        AtyFunc.openView()    
    },
    onWishListUpdate:function(data){
        if (this.m_oRunSpt){
            if(this.m_oRunSpt.updateWishNode){
                this.m_oRunSpt.updateWishNode(data.sender)
            }
        }        
    },
    onInfoClick:function(){
        Gm.ui.create("LotteryThirdInfo", this.m_iSeleted) 
    },
    onDiamondClick:function(){
        AtyFunc.openView()
    },
});

