var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {

        topButton:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        selectIcon:cc.Sprite,
        selectLab:cc.RichText,

        view8TopSpr:cc.Node,

        views:cc.Node,
        viewBgWidget:cc.Widget,

        vipGiftItem:cc.Node,
        vipGiftScroll: {
        	default: null,
        	type: cc.ScrollView
        },

        vipFlItem:cc.Node,
        vipFlScroll:{
            default: null,
        	type: cc.ScrollView
        },
        vipFlLqBtnSpr:cc.Sprite,
        vipFlLqBtnLab:cc.Label,
    },
    onLoad () {
        this._super()
        var list = Gm.config.getEventPay()
        list.sort(function(a,b){
            return a.priority - b.priority
        })
        var itemWidth = 0
        var sum = 0 
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.trigger == 1){
                var item = cc.instantiate(this.topButton)
                item.configData = v
                item.active = true
                itemWidth = item.width
                this.scrollView.content.addChild(item)
                var icon = item.getChildByName("icon")
                // item.getChildByName("nameLab").getComponent(cc.Label).string = v.name
                Gm.load.loadSpriteFrame("texture/activity/"+v.icon,function(sp,spr){
                    spr.spriteFrame = sp
                },icon.getComponent(cc.Sprite))
                item.on(cc.Node.EventType.TOUCH_END,function  (event) {
                    this.select(v.id)
                }.bind(this))
                sum = sum + 1
            }
        }
        this.scrollView.content.width = (itemWidth + 45)*Math.ceil((sum))
        this.selectType = -1
    },
    onEnable(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.select(args)
        }
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
    },
    onUserInfoUpdate:function(){
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (let index = 0; index < this.scrollView.content.children.length; index++) {
                const v = this.scrollView.content.children[index];
                var isSelect = v.configData.id == type
                v.getChildByName("defSpr").active = !isSelect
                v.getChildByName("selectSpr").active = isSelect
            }
            var conf = Gm.config.getEventPay(this.selectType)
            Gm.load.loadSpriteFrame("texture/event/"+conf.title_icon,function(sp,spr){
                spr.spriteFrame = sp
            },this.selectIcon)

            this.view8TopSpr.active =  this.selectType==8

            var currView = "view" + this.selectType
            for (let index = 0; index < this.views.children.length; index++) {
                const v = this.views.children[index];
                v.active = v._name == currView
            }
            cc.log(this.selectType,"wwwwwwwwwwwwwwwwwwwww")
            this["updateView" + this.selectType]()
        }
    },
    updateView7(){ //VIP礼包
        if(this.vipGiftScroll.content.children.length > 0 ){
            for (const key in this.vipGiftScroll.content.children) {
                const item = this.vipGiftScroll.content.children[key];
                item.getComponent("VipGiftItem").refView()
            }
            return
        }
        Func.destroyChildren(this.vipGiftScroll.content)
        var itemHeight = 0
        this.bagItems = []
        var vipConf = Gm.config.getConfig("VipConfig")

        var sum = 0 


        var showIndex = 0
        var showFlag = true
        for (let index = 0; index < vipConf.length; index++) {
            var vipLvConf = vipConf[index]
            for (let i = 0; i < vipLvConf.vipPackageId.length; i++) {
                var pId = checkint(vipLvConf.vipPackageId[i]);
                if(pId > 0){
                    sum = sum + 1
                    var itemData = Gm.config.getVipPackage(pId)
                    var item = cc.instantiate(this.vipGiftItem)
                    item.active = true
                    itemHeight = item.height
                    this.vipGiftScroll.content.addChild(item)
                    var itemSp = item.getComponent("VipGiftItem")
                    itemSp.setData(itemData,this)
                    if (showFlag && itemSp.getState() ==0 ){
                        showIndex = sum-1
                        showFlag = false
                    }
                }
            }
        }
        this.vipGiftScroll.content.height = (itemHeight + 8)*sum
        this.scheduleOnce(()=>{
            var nowPos = this.vipGiftScroll.getContentPosition()
            nowPos.y = 253 + Math.min(13,showIndex)*135
            this.vipGiftScroll.setContentPosition(nowPos)
            if(this.vipGiftScroll.content.children.length > 0 ){
                for (const key in this.vipGiftScroll.content.children) {
                    const item = this.vipGiftScroll.content.children[key];
                    item.active = true
                }
            }
       },0.01)
    },
    updateView8(){
        var vipSteate = Gm.activityData.vipFlState()
        Gm.ui.setBtnInteractable(this.vipFlLqBtnSpr.node,vipSteate==0)
        if (vipSteate== 0 ){
            this.vipFlLqBtnLab.string =  Ls.get(1001)
        }else if (vipSteate == 1){
            this.vipFlLqBtnLab.string = Ls.get(1002)
        }else if (vipSteate == 2){
            this.vipFlLqBtnLab.string = Ls.get(1003)
        }
        
        if(this.vipFlScroll.content.children.length > 0 ){
            return
        }
        Func.destroyChildren(this.vipFlScroll.content)
        var itemHeight = 0
        this.bagItems = []
        var vipConf = Gm.config.getConfig("VipConfig")

        var sum = 0 
        for (let index = 0; index < vipConf.length; index++) {
            var vipLvConf = vipConf[index]
            if(vipLvConf.vip_reward_everyday.length > 0 ){
                sum = sum + 1
                var item = cc.instantiate(this.vipFlItem)
                item.active = true
                itemHeight = item.height
                this.vipFlScroll.content.addChild(item)
                var itemSp = item.getComponent("VipFlItem")
                itemSp.setData(index,vipLvConf.vip_reward_everyday,this)
            }
        }
        this.vipFlScroll.content.height = (itemHeight + 10)*sum+5
        if ( Gm.userInfo.vipLevel == 0 ){
            return
        }
        this.scheduleOnce(()=>{
            var nowPos = this.vipFlScroll.getContentPosition()
            nowPos.y = 196 + Math.min(13, Gm.userInfo.vipLevel-1)*130
            this.vipFlScroll.setContentPosition(nowPos)
            if(this.vipFlScroll.content.children.length > 0 ){
                for (const key in this.vipFlScroll.content.children) {
                    const item = this.vipFlScroll.content.children[key];
                    item.active = true
                }
            }
       },0.01)
    },
    onGiftClick(){

    },
    onView8payBtn(){
        this.onBack()
        Gm.ui.create("PayShopView",1)
    },
    onView8LqBtn(){
        if (Gm.activityData.vipFlState()==0){
            Gm.activityNet.vipReward(Gm.userInfo.vipLevel,8)
        }
    },
    
});

