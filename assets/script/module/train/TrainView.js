var BaseView = require("BaseView")

const ITEM_NAME = ["","hero_culture_c","hero_culture_b","hero_culture_a","hero_culture_s"]
const ITEM_NONE = ["","hero_culture_c_primary","hero_culture_b_senior","hero_culture_a_senior","hero_culture_s_senior"]

const UPDATE_DT = 0.8

const TYPE_SHOW1 = 1
const TYPE_SHOW2 = 2
const TYPE_SHOW3 = 3
// TrainView
cc.Class({
    extends: BaseView,
    properties: {
        m_oHeadNode:cc.Node,
        m_oLevelLab:cc.Label,
        m_oNameLab:cc.Label,
        m_oJobLab:cc.Label,
        m_oMainLab:cc.Label,
        m_oBeforLab:{
            default: [],
            type: cc.Label,
        },
        m_oAfterLab:{
            default: [],
            type: cc.Label,
        },
        m_oAutoBtn:{
            default: [],
            type: cc.Node,
        },
        m_oBtnSelet:{
            default: [],
            type: cc.Node,
        },

        m_oTrainNode1:cc.Node,
        m_oTrainNode2:cc.Node,
        silverFrame:cc.SpriteFrame,
        goldFrame:cc.SpriteFrame,
    },
    register:function(){
        this.events[Events.CULTRUE_HERO] = this.updateOnce.bind(this)
    },

    enableUpdateView:function(args){
        if (args){
            this.m_iUpdateTime = 0
            Gm.heroData.setLocalCultrue()
            // this.m_oAutoSpr.active = false
            this.m_oData = args
            var tmpConfig = Gm.config.getHero(this.m_oData.baseId)
            // console.log("this.m_oData===:",this.m_oData)
            // console.log("===:",tmpConfig)
            Func.getHeadWithParent(tmpConfig.picture,this.m_oHeadNode)
            this.m_oLevelLab.string = Ls.lv()+Gm.userInfo.level
            this.m_oNameLab.string = tmpConfig.name
            var tmpJob = Gm.config.getJobWithId(this.m_oData.job)
            if (tmpJob){
                this.m_oJobLab.string = tmpJob.name
                this.m_oMainLab.string = Gm.config.getBaseAttr(tmpJob.attribute).childTypeName
            }else{
                var tmpJob1 = Gm.config.getJobWithId(tmpConfig.job)
                this.m_oJobLab.string = tmpJob1.name
                this.m_oMainLab.string = Gm.config.getBaseAttr(tmpJob1.attribute).childTypeName
            }
            var con = Gm.config.getVip()
            for(const i in this.m_oAutoBtn){
                if (con.cultureType[i]){
                    this.m_oAutoBtn[i].active = true
                }else{
                    this.m_oAutoBtn[i].active = false
                }
            }
            for(const i in this.m_oBtnSelet){
                if (con.cultureMode[i]){
                    this.m_oBtnSelet[i].active = true
                    this.m_oBtnSelet[i].m_iCount = con.cultureMode[i]
                    var tmpLab = this.m_oBtnSelet[i].getChildByName("lab")
                    tmpLab.getComponent(cc.Label).string = con.cultureMode[i]+Ls.get(500042)
                }else{
                    this.m_oBtnSelet[i].active = false
                }
            }

            this.m_iHeroQuality = tmpConfig.quality
            this.updateOnce({})
            this.updateSelet(0)
        }
    },
    updateOnce:function(args){
        var destData = Gm.heroData.m_oLocalCul
        var hero = Gm.heroData.getHeroById(this.m_oData.heroId)
        var tmpMode = Gm.config.getCultrueData(Gm.userInfo.level,this.m_iHeroQuality)
        var tmpInfo = ["strength","dexerity","endurance","constitution"]
        for(const i in hero.cultureAttribute){
            var tmpId = hero.cultureAttribute[i].attrId
            var tmpIdx = tmpId - 1
            var tmpTotal = hero.cultureAttribute[i].attrValue
            var tmpColor = cc.color(255,226,65)
            var tmpStr = "0(0)"
            if (destData){
                for(const j in destData){
                    if (destData[j].attrId == tmpId){
                        var tmpNow = destData[j].attrValue
                        if (tmpNow < 0){
                            tmpColor = cc.color(255,60,0,255)
                            tmpStr = (tmpTotal + tmpNow)+"("+tmpNow+")"
                        }else{
                            tmpStr = (tmpTotal + tmpNow)+"(+"+tmpNow+")"
                        }
                    }
                }
            }
            this.m_oBeforLab[tmpIdx].string = tmpTotal+"("+tmpMode[tmpInfo[tmpIdx]]+")"
            this.m_oAfterLab[tmpIdx].node.color = tmpColor
            this.m_oAfterLab[tmpIdx].string = tmpStr
        }

        for(var i = 1;i < 5;i++){
            var tmpId = Gm.config.getConst(ITEM_NAME[i])
            var tmpItem = Gm.bagData.getItemByBaseId(tmpId)
            var tmpNode = this.m_oAutoBtn[i-1]
            if (tmpNode.active){
                if (tmpItem && tmpItem.count > 0){
                    this["loadBtn"+i](tmpId)
                    tmpNode.getChildByName("nums").getComponent(cc.Label).string = "x"+tmpItem.count
                }else{
                    tmpNode.getChildByName("nums").getComponent(cc.Label).string = "x"+Gm.config.getConst(ITEM_NONE[i])
                    var iconspr = this.m_oAutoBtn[i-1].getChildByName("icon")
                    iconspr.scale = 0.5
                    if (i == 1){
                        iconspr.getComponent(cc.Sprite).spriteFrame = this.silverFrame
                        if (Gm.userInfo.silver >= Gm.config.getConst(ITEM_NONE[i])){
                            tmpNode.getChildByName("nums").color = new cc.Color(255,255,255)
                        }else{
                            tmpNode.getChildByName("nums").color = new cc.Color(180,0,0)
                        }
                    }else{
                        iconspr.getComponent(cc.Sprite).spriteFrame = this.goldFrame
                        if (Gm.userInfo.getGolden() >= Gm.config.getConst(ITEM_NONE[i])){
                            tmpNode.getChildByName("nums").color = new cc.Color(255,255,255)
                        }else{
                            tmpNode.getChildByName("nums").color = new cc.Color(180,0,0)
                        }
                    }
                }
            }
        }
        if (args.newAttribute && args.newAttribute.length > 0){
            this.changeType(TYPE_SHOW2)
        }else{
            this.changeType(TYPE_SHOW1)
        }
    },
    cheack:function(destValue,destCount){
        var tmpId = Gm.config.getConst(ITEM_NAME[destValue])
        var tmpItem = Gm.bagData.getItemByBaseId(tmpId)
        var tmpCount = destCount || 1
        if (tmpItem){
            if (tmpItem.count > tmpCount){
                return tmpCount
            }else{
                return tmpItem.count
            }
        }else{
            var tmpNeed = 0
            var tmpYong = 0
            if (destValue == 1){
                tmpNeed = Gm.config.getConst(ITEM_NONE[destValue])
                tmpYong = Math.floor(Gm.userInfo.silver/tmpNeed)
            }else{
                var tmpNeed = Gm.config.getConst(ITEM_NONE[destValue])
                tmpYong = Math.floor(Gm.userInfo.getGolden()/tmpNeed)
            }
            if (tmpYong > tmpCount){
                return -tmpCount
            }else{
                if (tmpYong < 1){
                    return 0
                }else{
                    return -tmpYong
                }
            }
        }
    },
    changeType:function(destType){
        if (this.m_iType != destType){
            this.m_iUpdateTime = 0
            this.m_iType = destType
            for(var i = 1;i < 3;i++){
                if (i == destType){
                    this["m_oTrainNode"+i].active = true
                }else{
                    this["m_oTrainNode"+i].active = false
                }
            }
        }
    },
    onAutoClick:function(){
        // this.m_oAutoSpr.active = !this.m_oAutoSpr.active
    },
    updateSelet:function(destType){
        if (this.m_iSelet != destType){
            this.m_iSelet = destType
            for(const i in this.m_oBtnSelet){
                var tmpDui = this.m_oBtnSelet[i].getChildByName("dui")
                tmpDui.active = i == destType
            }
        }
    },
    getSelet:function(){
        var tmpCount = 0
        for(const i in this.m_oBtnSelet){
            if (i == this.m_iSelet){
                tmpCount = this.m_oBtnSelet[i].m_iCount
                break
            }
        }
        return tmpCount
    },
    onSelet1:function(){
        this.updateSelet(0)
    },
    onSelet10:function(){
        this.updateSelet(1)
    },
    onSelet100:function(){
        this.updateSelet(2)
    },
    onTrain:function(sender,value){
        this.m_iSendValue = checkint(value)
        // console.log("this.m_iSendValue===:",this.m_iSendValue)
        if (this.m_iSendValue){
            var tmpCheack = this.cheack(this.m_iSendValue,this.getSelet())
            if (tmpCheack == 0){
                Gm.floating(Ls.get(500043))
            }else{
                if (tmpCheack < 0){
                    tmpCheack = -tmpCheack
                    var tmpNeed = Gm.config.getConst(ITEM_NONE[this.m_iSendValue])
                    var tmpYong = tmpNeed * tmpCheack
                    var tmpStr = Ls.get(500044)+tmpYong
                    if (this.m_iSendValue == 1){
                        tmpStr = tmpStr + Ls.get(500045)
                    }else{
                        tmpStr = tmpStr + Ls.get(500046)
                    }
                    tmpStr = tmpStr + tmpCheack + Ls.get(500047)
                    var self = this
                    Gm.box({msg:tmpStr,btnNum:2,title:Ls.get(500048)},function(btnType){
                        if (btnType== 1){
                            Gm.heroNet.sendCulTure(self.m_oData.heroId,tmpCheack,self.m_iSendValue)
                        }
                    })
                }else{
                    Gm.heroNet.sendCulTure(this.m_oData.heroId,tmpCheack,this.m_iSendValue)
                }
            }
        }
    },
    onSaveClick:function(){
        Gm.heroNet.sendCultureSave(this.m_oData.heroId)
    },
    onCloseClick:function(){
        // this.m_oAutoSpr.active = false
        this.m_iSendValue = 0
        Gm.heroData.setLocalCultrue()
        Gm.send(Events.CULTRUE_HERO)
        this.changeType(TYPE_SHOW1)
    },
    onGoonClick:function(){
        this.m_iSendValue = 0
        this.m_iCheack = 0
        if (this.m_iUpdateTime){
            this.m_iUpdateTime = 0
            this.changeType(TYPE_SHOW1)
        }
    },
    loadBtn1:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            var iconspr = this.m_oAutoBtn[0].getChildByName("icon")
            iconspr.scale = 0.45
            iconspr.getComponent(cc.Sprite).spriteFrame = sp
        }.bind(this))
    },
    loadBtn2:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            var iconspr = this.m_oAutoBtn[1].getChildByName("icon")
            iconspr.scale = 0.45
            iconspr.getComponent(cc.Sprite).spriteFrame = sp
        }.bind(this))
    },
    loadBtn3:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            var iconspr = this.m_oAutoBtn[2].getChildByName("icon")
            iconspr.scale = 0.45
            iconspr.getComponent(cc.Sprite).spriteFrame = sp
        }.bind(this))
    },
    loadBtn4:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            var iconspr = this.m_oAutoBtn[3].getChildByName("icon")
            iconspr.scale = 0.45
            iconspr.getComponent(cc.Sprite).spriteFrame = sp
        }.bind(this))
    },
});

