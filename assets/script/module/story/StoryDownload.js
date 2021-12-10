var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        // m_oNoVoiceBtnLabel:cc.Label,
        m_oVoiceBtnLabel:cc.Label,
    },
    onDisable(){
   
    },
    onLoad:function(){
        this.popupUIData = {title:7300004}
        this._super()

        this.url = "http://down.gold.bianfenghd.com/update/story/chapter%s/"
        this.nativeUrl = Globalval.hotUrl ? Globalval.hotUrl + "story/chapter%s.zip" : "http://down.gold.bianfenghd.com/update/story/chapter%s.zip"
        this.data = {}
    },
    enableUpdateView(args){
        if(args){
            this.data = args
            // this.m_oNoVoiceBtnLabel.string = "("+args.size+")MB"
            this.m_oVoiceBtnLabel.string = "("+args.size+")MB"
        }

        if( !Gm.storyData.getDeviceMemory()){
            Bridge.getFreeMemory()
        }
    },
    onNoVoiceClick(sender,args){
        if(this.checkMemory(this.data.noSize)){
            Gm.floating("您的设备空间不足，无法下载！")
            return
        }
        this.onBack()
    },
    onVoiceClick(sender,args){
        if(this.checkMemory(this.data.size)){
            Gm.floating("您的设备空间不足，无法下载！")
            return
        }
        Gm.getLogic("StoryLogic").removeAllLoadSkeleton()
        if(cc.sys.isNative){
            Gm.getLogic("StoryLogic").download1(cc.js.formatStr(this.nativeUrl,this.data.episodes),this.data.episodes )
        }else{
            Gm.getLogic("StoryLogic").download(cc.js.formatStr(this.url,this.data.episodes),this.data.episodes )
        }
        this.onBack()
    },

    checkMemory(fileSize){
        return parseInt(fileSize)  >  parseInt(Gm.storyData.getDeviceMemory())
    }

});
