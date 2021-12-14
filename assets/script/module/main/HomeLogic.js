CoreLogic = require("CoreLogic");

cc.Class({
    extends: CoreLogic,

    ctor:function(){
        cc.log("HomeLogic========")
    },

    register:function(){
        this.events[MSGCode.OP_CLEAN_TABLE_S] = this.onCleanTableRet.bind(this)
    },

    sendTableClean:function(data){
        Gm.tableNet.clean(data)
    },

    onCleanTableRet:function(data){
        cc.log(data);
        if(data.result > 0) {

        }else{
            Gm.floating(Gm.config.getErr(data.result))
        }
    },

    

});