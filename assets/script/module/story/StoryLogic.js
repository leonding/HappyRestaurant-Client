
var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC] = this.onLoginSuc.bind(this)
    },

    onLoginSuc(){
        this.updateChapterList(1)  
    },

    updateChapterList(type){
        var data = this.getListInfo(type)
        Gm.storyData.setMainListData(data)

        Gm.red.refreshEventState("story")
    },

    getListInfo(type){
        var conf = Gm.config.getStoryListByType(type)
        var length = Gm.userInfo.hasReadStoryIds.length
        var tmpConf = Func.copyObj(conf)
        var data = []
        for(var i=0;i<tmpConf.length;i++){       
            var isRead = false 
            for(let j=0;j<Gm.userInfo.hasReadStoryIds.length;j++){
                if(tmpConf[i].unlockMap != -1 && tmpConf[i].id == Gm.userInfo.hasReadStoryIds[j]){
                    //已阅
                    data.unshift(tmpConf[i])
                    isRead = true
                    break
                }
            }
            if(isRead){
                continue
            }
            if(tmpConf[i].unlockMap != -1 && Gm.userInfo.maxMapId >= tmpConf[i].unlockMap && (tmpConf[i].read == 0 || Gm.userInfo.hasReadStoryIds.indexOf(tmpConf[i].read) != -1)){
                //new
                tmpConf[i].new = true
                data.unshift(tmpConf[i])
            }else{
                if(tmpConf[i].unlockMap == -1){
                    tmpConf[i].forbidden = true
                    data.unshift(tmpConf[i])
                }else if((Gm.userInfo.maxMapId >= tmpConf[i].unlockMap)){ //加锁
                    tmpConf[i].lock = 1
                    data.unshift(tmpConf[i])
                }else{
                    tmpConf[i].lock = 2
                    data.unshift(tmpConf[i])
                    break
                }
            }
        }
        return data
    },

    setHaveRead(){
        var baseInfo = this.getBaseChapterInfo()
        if(baseInfo.new){
            Gm.userInfo.hasReadStoryIds.push(baseInfo.id)

            var data = this.getListInfo(1)
            Gm.storyData.setMainListData(data)

            this.enterStoryList(Math.floor(baseInfo.id/1000))
            Gm.playerNet.readStory(baseInfo.id)

            Gm.red.refreshEventState("story")
        }
    },

    enterStoryList:function(id){
        var conf = Gm.config.getStoryListByType(id)
        var data = Gm.storyData.getMainListData()
        if(Gm.ui.getLayerActive("StoryListView")){
            Gm.ui.getScript("StoryListView").updateList(data,conf)
        }else{
            Gm.ui.create("StoryListView",{data:data,config:conf})
        }
    },
    setChapterInfo:function(data){
        Gm.storyData.setChapterInfo(data)
    },
    getChapterInfo(){
        return Gm.storyData.getChapterInfo()
    },  
    preLoad:function(data){
        var heroName = []
        var effects = []
        for(var i=0;i<data.length;i++){
           if(data[i].character1.length > 0 && heroName.indexOf(data[i].character1) == -1 && undefined == this.getLoadSkeleton(data[i].character1)){
                heroName.push(data[i].character1)
           }    
           if(data[i].character2.length > 0 && heroName.indexOf(data[i].character2) == -1 && undefined == this.getLoadSkeleton(data[i].character2)){
               heroName.push(data[i].character2)
           }
           if(data[i].effect.length > 0){
               effects.push(data[i].effect.split('|')[0])
           } 
        }
        var data = {type:2,heroSkeletonName:heroName,chapterData:data,effectName:effects}
        if(Gm.ui.getLayerActive("StoryUpdateView")){
            Gm.ui.getScript("StoryUpdateView").initLoad(data)
        }else{
            Gm.ui.create("StoryUpdateView",data)
        }
    },
    addLoadSkeleton:function(sp){
        Gm.storyData.addLoadSkeleton(sp)
    },
    getLoadSkeleton:function(name){
        return Gm.storyData.getLoadSkeleton(name)
    },
    removeAllLoadSkeleton:function(){
        Gm.storyData.removeAllLoadSkeleton()
    },
    // addLoadEffect:function(sp){
    //     Gm.storyData.addLoadEffect(sp)
    // },
    // getLoadEffect:function(name){
    //     return Gm.storyData.getLoadEffect(name)
    // },
    // removeAllLoadEffect:function(){
    //     Gm.storyData.removeAllLoadEffect()
    // },
    setBaseChapterInfo:function(data){
        Gm.storyData.setBaseChapterInfo(data)
    },
    getBaseChapterInfo:function(){
        return Gm.storyData.getBaseChapterInfo()
    },
    getAudioClip:function(name){
        return Gm.storyData.getAudioClip(name)
    },
    setMainListInfo:function(data){
        Gm.storyData.setMainListInfo(data)
    },
    //针对web平台
    download:function(url){
        var self = this
        Gm.ui.create("StoryUpdateView",{type:1},function(){
            self.addFile(url,self)
        })
    },
    //针对native
    download1:function(url,episodes){
        var self = this
        let storagePath = jsb.fileUtils.getWritablePath() + "story/"
        let currChapter = cc.js.formatStr("chapter%s",episodes)
        let zipFile = currChapter+".zip"
        if (!jsb.fileUtils.isDirectoryExist(storagePath)){
            jsb.fileUtils.createDirectory(storagePath)
        }
        Gm.ui.create("StoryUpdateView",{type:1})
        Gm.http.downloadFile2(url,jsb.fileUtils.getWritablePath() + "story/"+zipFile,function(data){
            // jsb.fileUtils.removeFile(fPath)
            // jsb.fileUtils.removeDirectory(storagePath)
            if(cc.sys.isNative){
                console.log("下载成功")
                //解压
                self.am = new jsb.AssetsManager("",storagePath)
                var isSucceed = self.am.decompressLocalZip(storagePath + zipFile)
                if(isSucceed){
                    console.log("解压成功")
                    jsb.fileUtils.addSearchPath(storagePath)
                    self.addFile(storagePath+currChapter+"/",self)
                }
            }
        },function(percent){
            Gm.ui.getScript("StoryUpdateView").updateDownLoadPercent(percent)
            console.log("进度"+percent)
        })
    },

    addFile(argsUrl,self){

        var count = 0 //当前下载数量
        var downloadComplete = function(type, name, data, count, total,noName){
            if(type == "png"){
                console.log("加载png",noName)
                Gm.storyData.addSpriteTextures(data,noName)
            }else if(type == "mp3"){
                console.log("加载mp3",noName)
                Gm.storyData.addAudioClips(noName,data)
            }else if(type == "txt"){
                console.log("加载txt",noName)
                var chapterInfo = JSON.parse(data);
                self.setChapterInfo(chapterInfo)
            }else if(type == "skeleton"){
                console.log("加载spine",noName)
                self.addLoadSkeleton(data)
            }
            // console.log(percent)
            var view = Gm.ui.getScript("StoryUpdateView")
            if(view){
                view.updateDownload(count, total)
            }else{
                console.log("页面没有加载完成")
            }
            if(count == total){
                var chapterInfo = self.getChapterInfo()
                self.preLoad(chapterInfo)
            }
        }
        // console.log("load file.manifest",argsUrl + "file.manifest")
        cc.loader.load({url: argsUrl + "file.manifest", type: "txt"}, function(err, ret) {    
            
            if(err){
                console.log("error ====>",err)
                return 
            }
            var file_list = JSON.parse(ret)
            var fileName = ""
            var txtFileName = ""
            for(let i in file_list){
                fileName = file_list[i]
                var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
                if(fileExtension == "txt"){
                    txtFileName = fileName
                }
                if(fileExtension == "json") {
                    continue
                }
                if(fileExtension == "atlas"){ // 加载 skeleton
                    var fileNames = fileName.split('.')
                    cc.loader.load(argsUrl + fileNames[0] + ".png", (error, texture) => {
                        if(error){
                            console.log(error)
                            return;
                        }
                        var textureList = texture.url.split('/')
                        var atlasName = textureList[textureList.length-1].split('.')[0]
                        cc.loader.load({url: argsUrl + atlasName + ".atlas", type: 'txt'}, (error, atlasJson) => {
                            var spineList =  atlasJson.split('\n')
                            var spineName = spineList[1].split('.')[0]
                            cc.loader.load({url: argsUrl + spineName + ".json", type: 'txt'}, (error, spineJson) => {
                                var textureList = texture.url.split('/')
                                var fileName = textureList[textureList.length-1].split('.')[0]
                                var asset = new sp.SkeletonData();
                                asset.skeletonJson = spineJson;
                                asset.atlasText = atlasJson;
                                asset.textures = [texture];
                                asset.textureNames = [fileName + '.png'];
                                asset._uuid = argsUrl + fileName + ".json"
                                asset._name = fileName
                                count = count + 1
                                downloadComplete("skeleton", fileName, asset, count, Object.keys(file_list).length,fileName)
                            })
                        })
                    }); 
                }else{
                    cc.loader.load({url: argsUrl + fileName, type: fileExtension}, function(err, ret) {
                        if(err) {
                            console.log(err);
                            return;
                        }
                        var name = ret._native ? ret._native.substring(ret._native.lastIndexOf('/') + 1) : txtFileName
                        var type = name.substring(name.lastIndexOf('.') + 1)
                        var noName = name.substring(0,name.lastIndexOf('.') )
                        count = count + 1
                        downloadComplete(type, name, ret, count, Object.keys(file_list).length,noName)
                    }.bind(this));
                }
            }
            
        }.bind(this));
    },
    sendBi(id,type,episodes,step){
        var biUrl = Globalval.biUrl ? Globalval.biUrl : "http://bi.gold.bianfenghd.com/operationlog.lc"
        if (id == null || biUrl == null || Gm.userInfo.id== 0 || Gm.userInfo.id== null){
            return
        }
        // cc.log("埋点",id)
        var sign = CryptoJS.MD5(Gm.userInfo.id + "" + id+ "@syhd2018@").toString()
        var sendData = {}
        sendData.playerID = Gm.userInfo.id
        sendData.systemId = id
        sendData.storyId = episodes
        sendData.action = type
        sendData.secret = sign
        sendData.param = step
        
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        xhr.open("POST", biUrl);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }else{
            xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        }
        xhr.onreadystatechange = function () {};
        var str = "";
        for (const key in sendData) {
            if (str != ""){
                str = str + "&"
            }
            str = str + key + "=" + sendData[key]
        }
        xhr.send(str);
    },

    enterUpdateView(url, episodes){
        Gm.ui.create("StoryUpdateView",{type:1})
        jsb.fileUtils.addSearchPath(url)
        let chapter = cc.js.formatStr("chapter%s", episodes)
        this.addFile(url+chapter+"/", this)
    }
});
