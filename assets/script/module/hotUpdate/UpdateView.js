const UPTYPE_LOGIN = 1
const UPTYPE_LOADING = 2
// UpdateView
cc.Class({
    extends: require("BaseView"),
    properties: {
        projectUrl:{
            type:cc.Asset,
            default:null,
        },
        updating:false,
        canRetry:false,
        versionLab:cc.Label,
        baseURL:"",
        cdnURL:"",

    },
    enableUpdateView:function(data){
        if (data){
            this.m_bCanDo = cc.sys.isNative
     
            if (data == UPTYPE_LOGIN){
           
                // console.log("new update",cc.sys.getNetworkType(),"0000000000000")
                // if (this.m_bCanDo){
                //     this.loadAm()
                // }
                // if (Globalval.baseUrl == null){
                //     cc.loader.loadRes("/config/ServerGateConfig", (error, data) => {
                //         this.urlLoadComplete(JSON.parse(data.text))
                //     });
                // }else{
                //     this.urls.push(Globalval.baseUrl)
                //     this.urlLoadComplete()
                // }
                this.skipUpdate()
            }else if(data == UPTYPE_LOADING){
                // Gm.load.loadSpriteFrame("/img/chouka/chouk_dan_bg",function(sp,icon){
                //     icon.spriteFrame = sp
                // },this.m_oBackGround.getComponent(cc.Sprite))
       
                var self = this
                var title = Ls.get(100)
                cc.log(title)
                var tmpTimer = setTimeout(function(){
                    Gm.ui.loadLayer(function(total,count){
                        if (count == total){
                            //进入到登录
                            Gm.ui.removeByName("UpdateView")
                            Gm.ui.create("MainView",{page:0})
                        }
                    })
                    clearTimeout(tmpTimer)
                },1000)
            }
        }
    },
    loadAm:function(){
        this.storagePath = this.getHotPath()

        var searchPaths = jsb.fileUtils.getSearchPaths();
        console.log(searchPaths)
        console.log(JSON.stringify(searchPaths))
        console.log("11111111111112222222222222222")
        this.versionCompareHandle = function (versionA, versionB) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };
        // var url = this.projectUrl.nativeUrl;
        // if (cc.loader.md5Pipe) {
        //     url = cc.loader.md5Pipe.transformURL(url);
        // }
        this.am = new jsb.AssetsManager("res/project.manifest", this.storagePath, this.versionCompareHandle);
        this.am.setEventCallback(this.updateCb.bind(this));
        //全局保存资源版本号
        Globalval.resVersion = this.am.getLocalManifest().getVersion()
    },
    getHotPath(){
        var hotPath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'newUpdate')
        return hotPath
    },
    onUserInfoUpdate:function(){
        this.equipNumLab.string =  this.getEquipList().length + "/" + Gm.userInfo.pocketSize
    },
    hotUpdate:function(){
        console.log(this.am,this.cdnURL)
        this.tipLabel.node.active = true
        
        this.setVersionLab()
        this.tipLabel.string = Ls.get(9001)
        if (this.am) {
            this.am.setDonwloadUrl(this.cdnURL + "allFile/")
            this.am.update();
            this.updating = true;
        }else{
            this.skipUpdate()
        }
    },
    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        var resetUpdate = false
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            console.log('No local manifest file found, hot update skipped.')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var msg = event.getMessage();
                if(event.getAssetId() != "@version" && event.getAssetId() != "@project"){
                    if (this.tipLabel.string != Ls.get(9002)){
                        this.tipLabel.string = Ls.get(9003)
                    }
                    this.wifitips.active = true
                    this.byteProgress.node.active = true
                    if (checkint(event.getPercentByFile()) == 0 ){
                        this.byteProgress.progress = 0
                        var percent = 0.00
                        this.byteLabel.string = Ls.get(321)+percent.toFixed(2) + "%"
                        return
                    }
                    
                    this.byteProgress.progress = event.getPercentByFile();
                    var percent = checkint(event.getPercentByFile())*100
                    this.byteLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                    // this.percentLabel.string = percent.toFixed(2) + "%"
                    this.percentLabel.string = Ls.get(321)+percent.toFixed(2) + "%"

                    // var p = checkint(event.getPercent())*100
                    // console.log(p.toFixed(2),event.getTotalBytes())
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                console.log('error download manifest')
                resetUpdate = true
                break
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.')
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.')
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage())
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage())
                this.updating = false;
                this.canRetry = true;
                break;
            case jsb.EventAssetsManager.ERRORupdating:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage())
                break;
            default:
                break;
        }
        if (resetUpdate){
            this.am.update();
        }
        if (this.canRetry){
            this.tipLabel.string = Ls.get(9004)
            this.canRetry = false
            this.am.downloadFailedAssets()
        }
        if (failed) {
            this.am.setEventCallback(null);
            this._updateListener = null;
            this.updating = false;
            this.skipUpdate()
        }

        if (needRestart) {
            this.am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            // var searchPaths = jsb.fileUtils.getSearchPaths();
            // var newPaths = this.am.getLocalManifest().getSearchPaths();
            // console.log(JSON.stringify(newPaths));
            // Array.prototype.unshift.apply(searchPaths, newPaths);
            // // This value will be retrieved and appended to the default search path during game startup,
            // // please refer to samples/js-tests/main.js for detailed usage.
            // // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            // jsb.fileUtils.setSearchPaths(searchPaths);

            // console.log("保存热更文件",cc.sys.localStorage.getItem('HotUpdateSearchPaths'));

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },
    onDestroy: function () {
        if (this._updateListener) {
            this.am.setEventCallback(null);
            this._updateListener = null;
        }
        this._super()
    },
    urlLoadComplete(data){
        if (data){
            var dd = Func.forBy(data,"appType", Bridge.getAppType())
            this.urls.push(dd.url)
            if (dd.url1){
                this.urls.push(dd.url1)
            }
        }
        this.errorIndex = 0
        this.urlIndex = 0
        Globalval.setBaseURL(this.urls[this.urlIndex])


        cc.loader.loadRes("/config/ServerGateConfig", (error, data) => {
            this.serverGateConfig = JSON.parse(data.text)
            this.serverCheck()
        });
        
    },
    skipUpdate:function(){
        var self = this
        Gm.config.init(function(){
 
            Gm.ui.removeByName("UpdateView")
            Gm.ui.create("LoginView",1)
            // if (self.m_bCanDo && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.ANDROID)){
            //     Gm.ui.loadLayer(function(total,count){
            //         var percent = count/total
            //         self.byteProgress.progress = percent
            //         self.byteLabel.string = Ls.get(321) + Math.floor(percent*100) + " %"
            //         if (count == total){
            //             //进入到登录
            //             Gm.ui.removeByName("UpdateView")
            //             Gm.ui.create("LoginView",1)
            //         }
            //     })
            // }else{
            // }
        })
    },

    serverCheck:function(){
        if (cc.sys.getNetworkType() == cc.sys.NetworkType.NONE ){
            Gm.box({msg:Ls.get(9015),btnNum:1,isUpdateOpen:true},()=>{
                this.serverCheck()
            })
            return
        }

        if(this.m_bCanDo){
            Gm.loginData.setLoginName(Bridge.getOpenUDID())
        }else{
            Gm.loginData.setLoginName(cc.sys.localStorage.getItem("loginName") || "")
        }


        var serverGate = Func.forBy(this.serverGateConfig,"appType", Bridge.getAppType())
        var self = this
        var data = {}
        data.url = Globalval.getCheck()
        data.type = "POST"
        data.sendData = {}
        data.sendData.channel = Gm.loginData.getChannel()
        data.sendData.area = serverGate.area
        data.sendData.appType = serverGate.serverType
        data.sendData.appVer = Bridge.getAppVersion()
        data.sendData.deviceId = Gm.loginData.getDeviceId()
        data.handler = function(args){
            if (args && args.result == 0){
                Globalval.staticUrl = args.staticUrl
                Globalval.videoUrl = args.videoUrl
                Gm.loginData.setCanExtendBind(args.canExtendBind)
                if (args.hotUrl){
                    Globalval.hotUrl = args.hotUrl
                }
                if(!self.m_bCanDo){
                    self.skipUpdate()
                    return
                }
                if (args.toughUrl){ //强更
                    self.setToughData(args.toughUrl,args.appVer)
                }else if (args.hotUrl){//热更
                    self.baseURL = args.hotUrl
                    self.cdnURL = args.hotUrl + "guaJi/"
                    self.hotUpdate()
                }else{
                    self.skipUpdate()
                }
            }else{
                self.errorIndex = self.errorIndex + 1
                if (self.errorIndex == 3){
                    Gm.box({msg:Ls.get(9006),btnNum:1,isUpdateOpen:true},function(){
                        self.errorIndex = 0
                        self.urlIndex = self.urlIndex + 1
                        if (self.urls[self.urlIndex] == null){
                            self.urlIndex = 0
                            cc.log("没有下一个")
                        }
                        Globalval.setBaseURL(self.urls[self.urlIndex])
                        self.serverCheck()
                    })
                }else{
                    self.serverCheck()
                }
            }
        }
        Gm.sendHttp(data)
    },
    setVersionLab(){
        this.versionLab.node.active = true
        this.versionLab.string = cc.js.formatStr(Ls.get(9007),this.am.getLocalManifest().getVersion())
    },
    setToughData(url,version){
        this.setVersionLab()
        var self = this
        Gm.box({msg:Ls.get(9009),btnNum:1,isUpdateOpen:true},function(){
            //删除热更新资源
            // console.log("删除热更新资源 path======>",self.getHotPath())
            // jsb.fileUtils.removeDirectory( self.getHotPath() )
            jsb.openURL(url)
        })
        // var self = this
        // this.toughUrl = url
        // this.version = version
        // this.apkName = cc.js.formatStr("%s.apk",this.version)
        // this.savePath = this.storagePath + "/" + this.apkName

        // this.installApk()
    },
    installApk(){
        var self = this
        if (jsb.fileUtils.isFileExist(this.savePath)){
            this.byteProgress.node.active = false
            this.tipLabel.string = Ls.get(9008)
            this.scheduleOnce(()=>{
                Bridge.setInstallApkName(this.apkName)
            },2)
            return
        }
        Gm.box({msg:Ls.get(9009),btnNum:1,isUpdateOpen:true},function(){
            self.toughUpdate()
        })
    },
    toughUpdate(){
        if(cc.sys.getNetworkType() == 0 ){
            var self = this
            this.scheduleOnce(()=>{
                Gm.box({msg:Ls.get(9015),isUpdateOpen:true},function(){
                    self.toughUpdate()
                })
            },0.1)
            return
        }
        this.donwloadApk()
    },
    donwloadApk(){
        console.log("开始下载",this.toughUrl,"aaaa",cc.sys.getNetworkType())
        this.downloader = new jsb.Downloader({countOfMaxProcessingTasks:6,timeoutInSeconds:5,tempFileNameSuffix:".tmp"}); //
        this.byteProgress.node.active = true
        this.percentLabel.node.active = true
        this.tipLabel.string = Ls.get(9011)
        this.percentLabel.string = "0.00%"
        var self = this
        this.downloader.setOnFileTaskSuccess(function(event){        
           console.log("下载成功",self.apkName)
           self.downloader = null
           self.installApk()
        });
        this.downloader.setOnTaskProgress(function(event,bytesReceived,totalBytesReceived,totalBytesExpected){
            // console.log("下载中",event,bytesReceived,totalBytesReceived,totalBytesExpected)
            if (totalBytesReceived  && totalBytesExpected){
                var percent = totalBytesReceived/totalBytesExpected
                self.byteProgress.progress = percent
                self.byteLabel.string = Ls.get(321)+self.toFixed(Math.floor(totalBytesReceived/1024)/1024)  + "/" + self.toFixed(Math.floor(totalBytesExpected/1024)/1024)
                self.percentLabel.string = (percent*100).toFixed(2) + "%"
            }
        });
        this.downloader.setOnTaskError(function(event,errorCode,errorCodeInternal,errorStr){
            console.log("下载失败",event,errorCode,errorCodeInternal,errorStr)
            self.downloader = null
            Gm.box({msg:Ls.get(9014),isUpdateOpen:true},function(btnType){
                self.toughUpdate()
            })
        });
        this.downloader.createDownloadFileTask(this.toughUrl,this.savePath)
        console.log(this.downloader)
    },
    toFixed(num){
        return num.toFixed(2) + "M"
    },
});
