var MSGCode = require("MSGCode")

MSGCode.proto[MSGCode.OP_CLEAN_TABLE_C] = "Table.CleanTableCmd"
MSGCode.proto[MSGCode.OP_CLEAN_TABLE_S] = "Table.CleanTableRet"

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    clean:function(data){
        Gm.sendCmdHttp(MSGCode.OP_CLEAN_TABLE_C, data);
    }

});
