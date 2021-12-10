var BaseView = require("BaseView")
// MailView

cc.Class({
    extends: BaseView,
    properties: {
        itemPerfab:cc.Prefab,
        m_oBtnDelet:cc.Node,
        m_oBtnGetAl:cc.Node,
        m_oMailNone:cc.Node,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },
    onLoad(){
        this.popupUIData = {title:30005}
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            this.updateList()
        }
    },
    register:function(){
        this.events[Events.MAIL_UPDATE] = this.updateList.bind(this)
    },
    updateList:function(){
        var tmpList = Gm.mailData.getMisByType()
        if (tmpList){
            this.m_oMailNone.active = tmpList.length == 0
            tmpList.sort(function(a,b){
                if (a.emailState == b.emailState){
                    return b.emailDate - a.emailDate
                }else{
                    return a.emailState - b.emailState
                }
            })
        }
        this.items = []
        Func.destroyChildren(this.scrollView.content)

        Gm.ui.simpleScroll(this.scrollView,tmpList,function(tmpData,tmpIdx){
            var item = cc.instantiate(this.itemPerfab)
            this.scrollView.content.addChild(item)
            var tmpSpt = item.getComponent("MailCell")
            tmpSpt.setOwner(this,tmpData)
            this.items.push(tmpSpt)
            return item
        }.bind(this))
        var tmpHas = false
        var list = Gm.mailData.getMisByType()
        for(const i in list){
            if (list[i].emailState == 0 && list[i].attachment){
                tmpHas = true
                break
            }
        }
        this.m_oBtnGetAl.getComponent(cc.Button).interactable = tmpHas
    },
    onDeletClick:function(){
        var tmpList = []
        var items = Gm.mailData.getMisByType()
        for(const i in items){
            if (items[i].emailState == 0){
            }else{
                tmpList.push(items[i].emailID)
            }
        }
        if (tmpList.length > 0){
            Gm.emailNet.sendDelReadEmail(1,tmpList)
        }
    },
    onGetClick:function(){
        var tmpHas = false
        var checkBag = 0
        var checkHero = 0
        var list = Gm.mailData.getMisByType()
        for(const i in list){
            if (list[i].emailState == 0 && list[i].attachment){
                tmpHas = true
                var tmpAry = list[i].attachment.split("|")
                for (var j = 0; j < tmpAry.length; j++) {
                    var infos = tmpAry[j].split("_")
                    var type = Number(infos[0])
                    if (type == ConstPb.itemType.HERO_CARD){
                        checkHero++
                    }else if(type == ConstPb.itemType.EQUIP){
                        checkBag++
                    }
                }
            }
        }
        if (tmpHas){
            if (checkBag > 0 && Gm.bagData.checkEquip(checkBag)){
                Gm.box({msg:Ls.get(70038),ok:Ls.get(70049),cancel:Ls.get(70048),onlyBtn:true},(btnType)=>{
                    if (btnType == 1){
                        this.onBack()
                        Gm.ui.getScript("MainView").showBag()
                    }
                })
            }else if(checkHero > Gm.userInfo.heroBagSize - Gm.heroData.heros.length){
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
                Gm.emailNet.sendReveiveAll(1)
            }
        }
    },
});

