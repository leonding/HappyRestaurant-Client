var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
    },
    onLoad:function(){
        // this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
        //     this.onBtnClick()
        // })
    },
    setData:function(data){
        this.data = data
    },
    onBtnClick(){
         if(this.data && this.data.callback){
             this.data.callback(this.data.index)
         }
    }
});