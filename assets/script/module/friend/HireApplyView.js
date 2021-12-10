var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        HireApplyItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        maxLab:cc.RichText,
    },
    onLoad:function(){
        this.popupUIData = {title:7064}
        this._super()
    },
    register:function(){
        this.events[MSGCode.OP_HIRE_AID_APPLY_S] = this.onNetHireApply.bind(this)
        this.events[MSGCode.OP_HIRE_AID_LIST_S] = this.onNetHireCanList.bind(this)
        this.events[MSGCode.OP_HIRE_AID_INFO_S] = this.onNetHireApply.bind(this)
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
    },
    onLogicSuss(){
        this.onBack()
    },
    onNetHireApply(){
        this.updateView()
    },
    onNetHireCanList(){
        var list = Gm.friendData.getCanHireHeads()
        if (Func.forBy(list,"idGroup",this.data.idGroup) == null){
            this.onBack()
        }
    },
    enableUpdateView(args){
        if (args){
            this.data = args
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var itemHeight = 0
        this.items = []

        this.data.list.sort((a,b)=>{
            if (a.request == b.request){
                var aConf = Gm.config.getHero(0,a.qualityId)
                var bConf = Gm.config.getHero(0,b.qualityId)
                return bConf.quality-aConf.quality
            }
            return a.request?-1:1
        })
        for (let index = 0; index < this.data.list.length; index++) {
            var v = this.data.list[index]
            var item = cc.instantiate(this.HireApplyItem)
            item.active = true
            itemHeight = item.height
            this.scrollView.content.addChild(item)

            var sp = item.getComponent("HireApplyItem")
            sp.setData(v,this)
        }
        this.scrollView.content.height = (itemHeight+5)*this.data.list.length
        this.scrollView.scrollToTop()
        this.updateMaxLab()
    },
    updateMaxLab(){
        var textColor = "<outline color='#000000'><color=#FFF3E0>%s<color=#70f46d>%s</c>/%s</c></outline>"
        this.maxLab.string = cc.js.formatStr(textColor,Ls.get(7065),Gm.friendData.getApplyHireNum(),Gm.config.getConst("hire_aid_apply_limit"))
    },
    onBack(){
        this._super()
    },
    
});

