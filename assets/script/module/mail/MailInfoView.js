var BaseView = require("BaseView")
// MailInfoView

cc.Class({
    extends: BaseView,
    properties: {
        m_oItemPerfab:cc.Prefab,
        m_oItemLabel:cc.Node,
        m_oItemNode:cc.Node,
        m_oTimeLab:cc.Label,
        m_oContentLab:cc.Label,
        m_oGetBtn:cc.Node,
        m_oDetBtn:cc.Node,
        scrollWidget:cc.Widget,
    },
    runOpenAction(){

        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            this.m_oData = args
            this.updateList()
        }
    },
    register:function(){
        this.events[Events.MAIL_UPDATE] = this.updateType.bind(this)
    },
    updateType:function(){
        this.m_oData = Gm.mailData.getMailById(this.m_oData.emailID)
        if (this.m_oData){
            if (this.m_oData.emailState == 0){
                if (this.m_oData.attachment){
                    this.m_oGetBtn.active = true
                    this.m_oDetBtn.active = false
                    for(const i in this.m_tItemList){
                        this.m_tItemList[i].updateLock(false)
                    }
                }else{
                    this.onGetClick()
                }
            }else{
                this.m_oGetBtn.active = false
                this.m_oDetBtn.active = true
                if (this.m_oData.attachment){
                    for(const i in this.m_tItemList){
                        this.m_tItemList[i].updateLock(true)
                    }
                }
            }
        }
    },
    updateList:function(){
        var tmpTitleStr = ""
        if (this.m_oData.emailTitle){
            tmpTitleStr = this.m_oData.emailTitle
        }else{
            var tmpStr = this.m_oData.emailTitleAlias || this.m_oData.emailContentAlias
            var tmpAlias = tmpStr.split("|")
            var tmpConfig = Gm.config.getMailConfig(tmpAlias[0])
            tmpTitleStr = tmpConfig.mailTitle
        }
        this.popupUI.setTitle(tmpTitleStr)
        var tmpContetStr = ""
        if (this.m_oData.emailContent){
            tmpContetStr = this.m_oData.emailContent
        }else{
            tmpContetStr = Func.dealCode(this.m_oData.emailContentAlias)
        }
        this.m_oContentLab.string = tmpContetStr
        this.m_tItemList = []
        this.m_iCheckBag = 0
        this.m_iCheckHero = 0
        if (this.m_oData.attachment){
            this.scrollWidget.bottom = 170
            this.m_oItemLabel.active = true
            this.m_oItemNode.active = true
            Func.destroyChildren(this.m_oItemNode)
            var tmpAry = this.m_oData.attachment.split("|")
            for(const i in tmpAry){
                var infos = tmpAry[i].split("_")
                var type = Number(infos[0])
                if (type == ConstPb.itemType.HERO_CARD){
                    this.m_iCheckHero++
                }else if(type == ConstPb.itemType.EQUIP){
                    this.m_iCheckBag++
                }
                var tmpSpt = Gm.ui.getNewItem(this.m_oItemNode)
                // if(infos[0] == ConstPb.itemType.EQUIP){
                //     tmpSpt.updateEquip({baseId:infos[1],count:infos[2]})
                // }else{
                //     tmpSpt.updateItem({baseId:infos[1],count:infos[2]})
                // }
                // tmpSpt.setMaxHeight()
                tmpSpt.setData({itemType:type,baseId:Number(infos[1]),count:Number(infos[2])})
                tmpSpt.updateLock(this.m_oData.emailState != 0)
                this.m_tItemList.push(tmpSpt)
            }
        }else{
            this.scrollWidget.bottom = 40
            this.m_oItemLabel.active = false
            this.m_oItemNode.active = false
        }
        this.m_oTimeLab.string = Func.timeToJSBX(Math.floor((Gm.userData.getTime_m() - this.m_oData.emailDate)/1000))
        this.updateType()
    },
    onGetClick:function(){
        if (this.m_oData.attachment){
            if (this.m_iCheckBag > 0 && Gm.bagData.checkEquip(this.m_iCheckBag)){
                Gm.box({msg:Ls.get(70038),ok:Ls.get(70049),cancel:Ls.get(70048),onlyBtn:true},(btnType)=>{
                    if (btnType == 1){
                        this.onBack()
                        Gm.ui.removeByName("MailView")
                        Gm.ui.getScript("MainView").showBag()
                    }
                })
            }else if(this.m_iCheckHero > Gm.userInfo.heroBagSize - Gm.heroData.heros.length){
                var tmpMax = Gm.config.getVip().heroBagMaxNum
                if (Gm.userInfo.heroBagSize >= tmpMax){
                    Gm.floating(Ls.get(5281))
                    return 
                }
                var everyNum = Gm.config.getConst("buy_hero_bag_num")
                var baseNum = Gm.config.getConst("role_init_hero_bag_num")
                var diamon = Func.itemConfig({itemType:ConstPb.itemType.PLAYER_ATTR,id:ConstPb.playerAttr.GOLD})
                var idx = Math.ceil((Gm.userInfo.heroBagSize - baseNum)/everyNum)
                var buyDiam = Gm.config.buy(idx+1)
                if(Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:buyDiam.buyHeroBag})){
                    var str = Ls.get(5818)
                    var newStr = cc.js.formatStr(str,buyDiam.buyHeroBag,everyNum)
                    Gm.box({msg:newStr,btnNum:2,title:Ls.get(5817)},function(btnType){
                        if (btnType== 1){
                            Gm.bagNet.buyBag(2)
                        }
                    })
                }
            }else{
                Gm.emailNet.sendHandEmail(this.m_oData.emailID,2,this.m_oData.emailType)
            }
        }else{
            Gm.emailNet.sendHandEmail(this.m_oData.emailID,1,this.m_oData.emailType)
        }
    },
    onDetClick:function(){
        Gm.audio.playEffect("music/06_page_tap")
        var tmpList = []
        tmpList.push(this.m_oData.emailID)
        Gm.emailNet.sendDelReadEmail(1,tmpList)
        this.onBack()
    },
});

