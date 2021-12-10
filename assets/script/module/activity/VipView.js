var BaseView = require("BaseView")
var MIN_LV = 1
var MAX_LV = 15
var BASE_ATY_ID = 100100
cc.Class({
    extends: BaseView,
    properties: {
        awardVipLab:cc.Label,
        awardDescLab:cc.Label,
        awardItemNodes:cc.Node,

        tqVipLab:cc.Label,
        vipTextUI:require("VipTextUI"),
        btn:cc.Button,
        btnLab:cc.Label,

        leftBtn:cc.Node,
        rightBtn:cc.Node,

        maskNode:cc.Node,
    },
    onLoad(){
        this._super()
        this.popupUI.setHeight(906)
    },
    register(){
        this.events[MSGCode.OP_ACTIVITY_REWARD_S] = this.updateRed.bind(this)
    },
    onEnable(){
        this._super()
        Gm.audio.playEffect("music/02_popup_open")
        this.vipLevel = Gm.userInfo.vipLevel || MIN_LV
        this.updateView()
    },
    updateView(){
        MAX_LV = Gm.config.getVip().showVipMax
        this.leftRightBtnState()
        this.popupUI.setTitle("VIP" + this.vipLevel)

        this.vipTextUI.setVipLv(this.vipLevel)
        
        // var lvConf = Gm.config.getVip(this.vipLevel)
        
        // Func.destroyChildren(this.scrollView.content)
        // var list = lvConf.info.split("\n")
        // for (let index = 0; index < list.length; index++) {
        //     const v = list[index];

        //     var item = cc.instantiate(this.itemFab)
        //     item.active = true
        //     this.scrollView.content.addChild(item)
        //     var lab = item.getChildByName("name").getComponent(cc.RichText)
        //     lab.string = v
        //     if (v.indexOf("camp_img_fk") >=0 ){
        //         lab.node.x = lab.node.x + 29
        //     }
        //     item.getChildByName("back").active = index%2 ==0
        // }

        Func.destroyChildren(this.awardItemNodes)

        this.items = []
        if (this.vipLevel > 0){
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_VIP)
            var conf = Func.forBy(list,"id",AtyFunc.getVipActivityId(this.vipLevel))
            for (let i = 0; i < conf.reward.length; i++) {
                const v = conf.reward[i];
                var itemBase = Gm.ui.getNewItem(this.awardItemNodes)
                itemBase.setData(v)

                var mask = cc.instantiate(this.maskNode)
                itemBase.maskNode = mask
                itemBase.node.addChild(mask)

                this.items.push(itemBase)
            }
        }
        this.updateRed()
    },
    updateRed(){
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.btn.node)
        }
        var isRed = this.vipLevel >0 && Gm.userInfo.vipLevel >= this.vipLevel && !Gm.activityData.isHasAty(AtyFunc.getVipActivityId(this.vipLevel))
        this.redNode.active = isRed
        this.btn.interactable = isRed


        var isHas = Gm.activityData.isHasAty(AtyFunc.getVipActivityId(this.vipLevel))

        this.btn.node.active = !isHas
        this.btnLab.string = isHas?Ls.get(5312):Ls.get(5311)
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            v.maskNode.active = isHas
        }
    },
    onLeftBtn(){
        this.vipLevel = Math.max(this.vipLevel-1,MIN_LV)
        this.updateView()
    },
    onRichtBtn(){

        this.vipLevel = Math.min(this.vipLevel+1,MAX_LV)
        this.updateView()
    },
    leftRightBtnState(){
        this.leftBtn.active = this.vipLevel != MIN_LV
        this.rightBtn.active = this.vipLevel != MAX_LV
    },
    onBtn(){
        Gm.activityNet.reward(AtyFunc.getVipActivityId(this.vipLevel))
    },
    getActivityId(){
        return this.vipLevel+BASE_ATY_ID
    },
});

