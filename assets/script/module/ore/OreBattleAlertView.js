var BaseView = require("BaseView")
const max_num = 100
cc.Class({
    extends: BaseView,
    properties: {
        msg:cc.RichText,
    },
    onLoad:function(){
        this.popupUIData = {title:Ls.get(8009)}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.msg.string = args.msg
            this.callback = args.callback
        }
    },
    onOkBtnClick(){
        if(this.callback){
            this.callback()
        }
        this.onBack()
    },
});

