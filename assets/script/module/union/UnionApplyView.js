var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        UnionApplyItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
    },
    onLoad:function(){
        this.popupUIData = {title:800126}
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    register:function(){
        this.events[MSGCode.OP_REPLY_APPLY_S] = this.onNetReplyApply.bind(this)
    },
    onNetReplyApply:function(args){
        if(Gm.unionData.applyList.length == 0 ){
            this.onBack()
            return
        }
        this.updateView()
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.unionData.applyList
        cc.log(Gm.unionData.applyList)
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.UnionApplyItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("UnionApplyItem")
            itemSp.updateData(itemData,this)
        }
        this.scrollView.scrollToTop()
    },
    onCancelBtn(){
        Gm.unionNet.replyApply(0,0)
    },
    onOkBtn(){
        Gm.unionNet.replyApply(0,1)
    },
});

