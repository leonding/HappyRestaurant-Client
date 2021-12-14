cc.Class({
    properties: {
        configList:null,
        isLoaded:false
    },
    ctor:function(){
        this.configList = {}
    },
    init:function(callback){
        this.fb = callback
        if (this.isLoaded){
            this.loadComplete()
            return
        }
        var self = this
        //resources/config/
        cc.loader.loadResDir("config", (error, data) => {
            for (let index = 0; index < data.length; index++) {
                const v = data[index];
                try {
                    self.configList[v.name] = JSON.parse(v.text) 
                } catch (e) {
                    cc.error("config error " + v.name,e)
                    return
                }
            }
            this.loadComplete()
        });
    },
    loadComplete:function(){
        cc.log("配置读取完成")
        this.isLoaded = true
        if (this.fb){
            this.fb()
        }
    },
    getConfig:function(configName){
        return this.configList[configName]
    },
    getByIndex:function(configName,index){
        return this.getConfig(configName)[index]
    },
    getKeyById:function(configName,key,cId){
        var con = this.getConfig(configName)
        if (con){
            for (let index = 0; index < con.length; index++) {
                var v = con[index];
                if (v[key] == cId){
                    return v
                }
            }
        }
    },
    getKeyById2:function(configName,key,cId,key1,cId1){
        var con = this.getConfig(configName)
        for (let index = 0; index < con.length; index++) {
            var v = con[index];
            if (v[key] == cId && v[key1] == cId1){
                return v
            }
        }
    },
    getKeysById:function(configName,key,cId){
        var list = []
        var con = this.getConfig(configName)
        for (let index = 0; index < con.length; index++) {
            var v = con[index];
            if (v[key] == cId){
                list.push(v)
            }
        }
        return list
    },
    getKeysById2:function(configName,key,cId,key1,cId1){
        var list = []
        var con = this.getConfig(configName)
        for (let index = 0; index < con.length; index++) {
            var v = con[index];
            if (v[key] == cId && v[key1] == cId1){
                list.push(v)
            }
        }
        return list
    },
    getErr:function(code){
        var item = this.getKeyById("ErrorCodeConfig","errorcode",code)
        if (item){
            return item.description
        }
        return "错误码：" + code
    },
});
