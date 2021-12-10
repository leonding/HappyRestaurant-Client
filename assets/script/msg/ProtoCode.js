var pbkiller = require('pbkiller')
var PACKAGE_NAME = "com.game.message.proto" //基础包名
var ProtoCode = cc.Class({
    extends: cc.Component,
    properties: {
        
    },
    ctor:function(){
        console.log("初始化ProtoCode")
        this.fileName = {}
        this.pbList = {}
        var self = this
        pbkiller.preload(() => {
            let pb = pbkiller.loadAll();
            for (const key in pb.com.game.message.proto) {
                if (pb.com.game.message.proto.hasOwnProperty(key)) {
                    const v = pb.com.game.message.proto[key];
                    if (typeof v == "object"){
                        window.ConstPb[key] = v
                    }
                }
            }
        });
    },
    encode:function(cmd,buff){
        var nameData = this.getFileNameCmd(cmd)
        var newPb = this.readPb(nameData)
        if (buff){
            for (const key in buff) {
                newPb[key] = buff[key]
            }
        }
        return newPb
    },
    decode:function(cmd,buff){
        var nameData = this.getFileNameCmd(cmd)
        var newPb = this.readPb(nameData,buff,true)
        return newPb
    },
    readPb:function(nameData,buff,isDecode){
        // let pb = pbkiller.loadFromFile(nameData.protoName + '.proto',PACKAGE_NAME);
        let pb = this.loadPb(nameData.protoName)
        if (isDecode){
            return new pb[nameData.funcName].decode(buff)
        }else{
            return new pb[nameData.funcName]()
        }
    },

    getFileNameCmd:function(cmd){
        if (MSGCode.proto[cmd] ){
            if (this.fileName[cmd] == undefined){
                var strs = MSGCode.proto[cmd].split(".")
                this.fileName[cmd]  = {protoName:strs[0],funcName:strs[1]}
            }
            return this.fileName[cmd]
        }
        return null
    },
    loadPb:function(pbName){
        if(this.pbList[pbName]){
            return this.pbList[pbName]
        }
        var pb = pbkiller.loadFromFile(pbName + '.proto',PACKAGE_NAME);
        this.pbList[pbName] = pb
        return pb
    }

});
