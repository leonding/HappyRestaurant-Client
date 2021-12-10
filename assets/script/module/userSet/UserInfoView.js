var BaseView = require("BaseView")
var TYPE_BUTTON = 0
var TYPE_INFO = 1
var TYPE_SETTING = 2
cc.Class({
    extends: BaseView,
    properties: {
        userBaseInfo:require("UserBaseInfo"),
        userSetBase:require("UserSetView"),
        pageNodes:{
            default:[],
            type:cc.Node,
        },
        bottomListNode:cc.Node,
        listBtns:{
            default:[],
            type:cc.Node,
        },
    },
    onLoad:function(){
        this._super()
        this.selectType = -1
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.updateView.bind(this)
    },
    enableUpdateView(args){
        if (args){
            this.select(TYPE_INFO)
        }
    },
    
    select:function(type){
        if (this.selectType != type){
            if(this.selectType != -1){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                if (this.pageNodes[key]){
                    this.pageNodes[key].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                v.getChildByName("lab").color = Func.getPageColor(isSelect)
                if(isSelect){
                    var str_title = v.getChildByName("lab").getComponent(cc.Label).string
                    this.popupUI.setTitle(str_title)
                }
            }
            this.updateView()
        }
    },
    updateView(){
        this["updateNode" + (this.selectType)]()
    },
    updateNode0(){
        
    },
    updateNode1(){
        var dd = {}
        dd.playerId = Gm.userInfo.id
        dd.head = Gm.userInfo.head
        if (Gm.heroData.getHeroByBaseId(dd.head)){
            dd.qualityId = Gm.heroData.getHeroByBaseId(dd.head).qualityId
        }else{
            dd.qualityId = Gm.userInfo.head
        }
        dd.name = Gm.userInfo.name
        dd.level = Gm.userInfo.level
        dd.fightValue = Gm.heroData.getFightAll()
        if (Gm.unionData.isUnion()){
            dd.allianceName = Gm.unionData.info.name
        }
        dd.mapId = Gm.userInfo.maxMapId
        dd.sign = Gm.userInfo.signature

        this.userBaseInfo.setData(dd)

        var newDd = {}
        newDd.lineHero = [Gm.heroData.getLineByType(ConstPb.lineHero.LINE_BOSS)]
        newDd.heroInfo = []
        for (let index = 0; index < newDd.lineHero[0].hero.length; index++) {
            const heroId = newDd.lineHero[0].hero[index];
            if (heroId > 0){
                newDd.heroInfo.push(Gm.heroData.getHeroById(heroId))
            }
        }
        this.userBaseInfo.updateTeam(newDd)
    },
    updateNode2(){
        
    },
    onUserInfoUpdate:function(){
        this.editbox.maxLength = Gm.config.getConst("autograph_max_lenth")
        
        this.nameLab.string = Gm.userInfo.name
        this.idLab.string = Gm.userInfo.id
        this.lvLab.string = Gm.userInfo.level
        this.expLab.string = Gm.userInfo.exp + "/" + Gm.userInfo.upExp

        this.vipLv.string = "VIP"+Gm.userInfo.vipLevel

        this.editbox.string = Gm.userInfo.signature

        Func.newHead2(Gm.userInfo.head,this.headNode)
    },
    onVipBtn(){
        Gm.ui.create("PayShopView",2)
        this.onBack()
    },
    onNameChange(){
        Gm.ui.create("NameChangeView")
    },
    onBack(){
        Gm.playerNet.pushSave({close:Gm.userData.pushswitch,showHeroLine:Gm.userData.showHeroLine})
        this._super()
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
        // if(this.popupUI){
        //     var str_title = sender.target.getChildByName("New Label").string
        //     this.popupUI.setData({title:parseInt(str_title),isClose:false})
        // }
    },
    onOkBtn(sender,value){
        value = checkint(value)
        if (value == 1){ //公告
            Gm.getLogic("LoginLogic").openNotice(true)
        }else if (value == 2){//继承码
            Gm.ui.create("UserInheritView",1)
        }else if (value == 3){//礼包码
            Gm.ui.create("CdkView")
        }else if (value == 4){//客服
            Gm.ui.create("UserCustomerView")
            this.onBack()
        }else if (value == 5){//规则
            if(Gm.getLogic("LoginLogic").checkTermsAppType()){
                Gm.ui.create("UserHelpView")
            }
           // Gm.floating(Ls.get(201))
        }else if (value == 6){//注销
            Gm.box({msg:Ls.get(5347)},(btnType)=>{
                if (btnType == 1){
                    Gm.send(Events.MSG_CLOSE,{quit:true})
                    Gm.ui.removeAllView()
                    Gm.ui.create("LoginView",1)
                 //   Gm.ui.create("ChangeAccountView",2)
                }
            })

        }
    },
   onHeadClick:function(){
        Gm.ui.create("ChangeHead",true)
   },
   onSignClick:function(){
        Gm.ui.create("SignChangeView",true)
   },
});

