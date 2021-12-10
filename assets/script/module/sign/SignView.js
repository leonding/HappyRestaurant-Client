var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        signPre: cc.Prefab,
        topBoxList:{
            default: [],
            type: cc.Node,
        },
        nowSignDayLab:cc.RichText,
        repairRich:cc.RichText,
        timeRich:cc.RichText,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        proBar:cc.ProgressBar,
        okBtn:cc.Button,
        okBtnLab:cc.Label,

        m_oBoxPre:cc.Prefab,
        m_oBoxFrame: {
            default: [],
            type: cc.SpriteFrame
        },
        getNode:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.m_tBoxFab = []
        for(const i in this.topBoxList){
            var tmpBox = cc.instantiate(this.m_oBoxPre)
            tmpBox.active = false
            tmpBox.parent = this.topBoxList[i]
            tmpBox.zIndex = -1
            tmpBox.y = -14
            this.m_tBoxFab.push(tmpBox)
        }
        Gm.red.add(this.okBtn.node,"sign","month")
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            
            this.updateList()
            this.onSignItemClick()
            Gm.ui.scrollOffset(this.scrollView,Gm.signData.getHasDay(),5,0)
        }
    },
    updateList(){
        this.updateData()
        if(this.scrollView.content.children.length > 0 ){
            return
        }
        this.signItems = []
        var list = Gm.config.getMonthSigns(Gm.signData.monthData.round)
        for (let index = 0; index < list.length; index++) {
            var item = cc.instantiate(this.signPre)
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("SignItem")
            itemSp.updateSign(index+1,list[index],this)
            this.signItems.push(itemSp)
        }
    },
    updateData(){
        var ss = "<color=#ffffff>%s</c><color=#0BFF00>%s</color>"

        var hasDay = Gm.signData.getHasDay()
        this.nowSignDayLab.string = cc.js.formatStr(ss,Ls.get(200032),hasDay,"/",30)
        this.proBar.progress = hasDay/Gm.config.getSignCount(4).day

        if(this.signItems){
            for (let index = 0; index < this.signItems.length; index++) {
                const v = this.signItems[index];
                v.updateCheck()
            }
        }

        for (let index = 0; index < this.topBoxList.length; index++) {
            const v = this.topBoxList[index];
            var countId = index + 1
            var tmpAni = Gm.signData.getHasDay()>=Gm.config.getSignCount(countId).day && Gm.signData.getHasCountId(countId)==false
            var item = this.m_tBoxFab[index]
            item.active = true
            var itemAni = item.getComponent(cc.Animation)
            var nodeIcon = v.getChildByName("rw_img_hyd3").getChildByName("task_img_zz")
            nodeIcon.active = Gm.config.getSignCount(countId).day > Gm.signData.getHasDay()
            if (tmpAni){
                itemAni.play("box_lizi")
            }else{
                itemAni.play("box_none")
            }
            var isHas = Gm.signData.getHasCountId(countId)
            item.getChildByName("box").getChildByName("prop_bx_jk").active = isHas
            item.getChildByName("box").getChildByName("prop_bx_j").active = !isHas
        }
    },
    updateItemByDay(day){
        this.signItems[day].updateCheck()
        return this.signItems[day].data
    },
    onSignItemClick(){
        this.okBtn.interactable = Gm.signData.getNowDay() > Gm.signData.getHasDay()
        if (this.okBtn.interactable){
            this.okBtnLab.string = Ls.get(1001)
        }else{
            this.okBtnLab.string = Ls.get(1002)
        }
    },
    onTopBoxBtn:function(sender,value){
        value = checkint(value)
        if (Gm.signData.getHasCountId(value)){
            Gm.floating(Ls.get(200034))
            return
        }
        var countData = Gm.config.getSignCount(value)
        if (Gm.signData.getHasDay() >= countData.day){
            Gm.signNet.signCount(value)
            return
        }
        Gm.audio.playEffect("music/02_popup_open")
        Gm.award({award:countData.item})
    },
    onOkBtn(){
        Gm.signNet.signDay()
    },
    
});

