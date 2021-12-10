//做一层封装，预留后期快速升级引擎
cc.Class({
    load:function(path,callback){
        cc.loader.loadRes(path, function (err, data) {
            callback(data)
        })
    },
    loadPerfab:function(path,callback){
        this.load(path,callback)
    },
    loadType:function(path,type,callback){
        cc.loader.loadRes(path,type,function(err,data){
            if(err){
                console.log("读取失败-不给回调了")
                return
            }
            if (callback){
                callback(data)
            }
        })
    },
    loadSpriteFrame:function(path,callback){
        this.loadType(path,cc.SpriteFrame,callback)
    },
    loadAudio:function(path,callback){
        this.loadType(path,cc.AudioClip,callback)
    },
    md5Raw:function(url){
        var u = cc.url.raw("resources/" + url)
        if(cc.loader.md5Pipe){
            u = cc.loader.md5Pipe.transformURL(u)
        }
        return u
    }

});
