const c_t = {
    c:"character",
    h:"heroperfab",
    b:"bufffab",
    s:"skillfab",
}
//做一层封装，预留后期快速升级引擎
cc.Class({
    properties: {
        fabList:null,
        ownerList:null,
        pictureList:null,
        character:null,
        heroperfab:null,
        bufffab:null,
        skillfab:null,
    },
    ctor:function(){
        this.fabList = {}
        this.ownerList = {
            c:{},
            h:{},
            b:{},
            s:{},
        }
        this.pictureList = {}
        this.character = {}
        this.heroperfab = {}
        this.bufffab = {}
        this.skillfab = {}
    },
    pushOwner:function(cType,path,owner){
        if (owner){
            var can = true
            if (!this.ownerList[cType][path]){
                this.ownerList[cType][path] = []
            }else{
                for(const i in this.ownerList[cType][path]){
                    if (this.ownerList[cType][path][i].uuid == owner.uuid){
                        can = false
                        break
                    }
                }
            }
            if (can){
                this.ownerList[cType][path].push(owner)
            }
        }
    },
    cleanOwner:function(){
        var need = false
        for(const i in this.ownerList){
            for(const path in this.ownerList[i]){
                var len = this.ownerList[i][path].length
                if (len > 0){
                    var tmpCan = true
                    for(var j = len - 1;j>=0;j--){
                        if (cc.isValid(this.ownerList[i][path][j],true)){
                            tmpCan = false
                        }else{
                            this.ownerList[i][path].splice(j,1)
                        }
                    }
                    if (tmpCan){
                        this.cleanOne(i,path)
                        need = true
                    }
                }
            }
        }
        if (need){
            Gm.audio.releaseAll()
        }
    },
    cleanOne:function(cType,path){
        var des = cc.loader.getDependsRecursively(this[c_t[cType]][path])
        if (this[c_t[cType]][path]){
            this[c_t[cType]][path].destroy()
            this[c_t[cType]][path] = null
        }
        cc.loader.release(des)
    },
    retainFab:function(fab){
        var array = cc.loader.getDependsRecursively(fab)
        for(var i=0;i<array.length;i++){
            const item = cc.loader.getRes(array[i])
            if (Func.isRetain(item)){
                this.retainList("pictureList",array[i])
            }else if(item instanceof cc.Prefab){
                this.retainList("fabList",array[i])
            }
        }
    },
    releaseFab:function(fab){
        var pics = []
        var array = cc.loader.getDependsRecursively(fab)
        for(var i=0;i<array.length;i++){
            const item = cc.loader.getRes(array[i])
            if (Func.isRetain(item)){
                pics.push(array[i])
            }else if(item instanceof cc.Prefab){
                this.releaseList("fabList",array[i])
            }
        }
        for(const i in pics){
            this.releaseList("pictureList",pics[i])
        }
    },
    retainList:function(list,uuid){
        if(!this[list][uuid]){
            this[list][uuid] = 1
        }else{
            this[list][uuid]++
        }
    },
    releaseList:function(list,uuid){
        if(this[list][uuid]){
            this[list][uuid]--
            // if (this[list][uuid] == 0){
            //     cc.loader.release(uuid)
            // }
        }
    },
    releaseAll:function(){
        var list = ["fabList","pictureList"]
        for(const i in list){
            for(const j in this[list[i]]){
                if (this[list[i]][j] == 0){
                    // console.log("releaseAll===:",list[i],j)
                    cc.loader.release(j)
                }
            }
        }
    },
    releaseTb:function(name){
        for(const i in this[name]){
            var des = cc.loader.getDependsRecursively(this[name][i])
            this[name][i] = null
            cc.loader.release(des)
            // cc.loader.releaseRes("personal/effects/"+path+"/"+path,sp.SkeletonData,function(){
            //     console.log("???")
            // })
        }
        this[name] = {}
    },
    load:function(path,callback){
        cc.loader.loadRes(path, function (err, data) {
            if (err){
                callback(null)
            }else{
                callback(data)
            }
            
        })
    },
    loadPerfab:function(path,callback){
        this.load(path,callback)
    },
    loadType:function(path,type,callback,owner){
        cc.loader.loadRes(path,type,function(err,data){
            if(err){
                cc.error("load error " ,path)
                return
            }
            if (callback){
                callback(data,owner)
            }
        })
    },
    loadSpriteFrame:function(path,callback,owner){
        this.loadType(path,cc.SpriteFrame,function(data){
            var uuid = null
            if (owner && owner.spriteFrame){
                uuid = cc.loader.getDependsRecursively(owner.spriteFrame._uuid)
            }
            if (callback){
                if (data){
                    var list = cc.loader.getDependsRecursively(data._uuid)
                    for(const i in list){
                        if (Func.isRetain(cc.loader.getRes(list[i]))){
                            Gm.load.retainList("pictureList",list[i])
                            break
                        }
                    }
                }
                if(owner){
                    if (owner.node){
                        callback(data,owner)
                    }
                }else{
                    callback(data,owner)
                }
            }
            if (uuid){
                for(const i in uuid){
                    Gm.load.releaseList("pictureList",uuid[i])
                }
            }
        },owner)
    },
    loadAudio:function(path,callback){
        this.loadType(path,cc.AudioClip,callback)
    },
    checkLoaded:function(from,path,list,callback,owner){
        if (list[path]){
            if (callback){
                callback(list[path],owner)
            }
        }else{
            this.loadType(from+path+"/"+path,sp.SkeletonData,function(data){
                list[path] = data
                if (callback){
                    callback(data,owner)
                }
            },owner)
        }
    },
    loadSkeleton:function(path,callback,owner){
        this.pushOwner("c",path,owner)
        this.checkLoaded("personal/character/",path,this.character,function(data,sender){
            if (callback && sender && cc.isValid(sender)){
                callback(data,sender)
            }
        },owner)
    },
    loadFight:function(path,callback,owner){
        this.pushOwner("h",path,owner)
        this.checkLoaded("personal/heroperfab/",path,this.heroperfab,function(data,sender){
            if (callback && sender && cc.isValid(sender)){
                callback(data,sender)
            }
        },owner)
    },
    loadFightEffect:function(path,from,callback,owner){
        switch(from){
            case 1:
                this.pushOwner("b",path,owner)
                this.checkLoaded("personal/effects/",path,this.bufffab,callback,owner)
            break
            case 0:
                this.pushOwner("s",path,owner)
                this.checkLoaded("personal/characterperfab/",path,this.skillfab,callback,owner)
            break
        }
    },
    md5Raw:function(url){
        var u = cc.url.raw("resources/" + url)
        if(cc.loader.md5Pipe){
            u = cc.loader.md5Pipe.transformURL(u)
        }
        return u
    }

});
