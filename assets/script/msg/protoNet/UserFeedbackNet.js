var MSGCode = require("MSGCode")


cc.Class({
    properties: {
        
    },
    commitFeedback(data){
        Gm.http.sendFormBUG(data,this.handler.bind(this))
    },

    handler(ret){
        if(ret && ret.success){
            Gm.floating(Ls.get(2232))
        }
        var layer = Gm.ui.getLayer("FeedbackConfirmView")
        if(layer){
            layer.getComponent("FeedbackConfirmView").onBack()
        }
    }
});
