cc.Class({
    properties: {

    },
    
    ctor:function(){
        this.baseChapterInfo = null //章节列表选项信息
        this.chapterInfo = null //播放章节信息
        this.loadSkeleton = {}//载入的女神立绘
        this.loadEffect = {}//特效

        this.chapterSpriteTextures = {} //下载的当前章节图片资源
        this.chapterAudioClips = {}//下载的当前章节声音资源

        this.m_oMainListInfo = null// 主线列表数据

        //清除剧情缓存文件
        if(cc.sys.isNative){
            let storagePath = jsb.fileUtils.getWritablePath() + "story/"
            jsb.fileUtils.removeDirectory(storagePath)
        }
    },
    setBaseChapterInfo:function(data){
        this.baseChapterInfo = data
    },
    getBaseChapterInfo:function(){
        return this.baseChapterInfo
    },
    setChapterInfo:function(data){
        this.chapterInfo = data
    },
    getChapterInfo:function(){
        return this.chapterInfo
    },
    addLoadSkeleton:function(sp){
        this.loadSkeleton[sp._name] = sp
    },
    getLoadSkeleton:function(name){
        return this.loadSkeleton[name]
    },
    removeAllLoadSkeleton:function(){
        this.loadSkeleton = {}
    },
    // addLoadEffect:function(sp){
    //     this.loadEffect[sp._name] = sp
    // },
    // getLoadEffect:function(name){
    //     return this.loadEffect[name]
    // },
    // removeAllLoadEffect:function(){
    //     this.loadEffect = {}
    // },
    addSpriteTextures(texture, name){
        this.chapterSpriteTextures[name] = texture
    },

    getSpriteTexture(name){
        return this.chapterSpriteTextures[name]
    },
    addAudioClips(name, clip){
        this.chapterAudioClips[name] = clip
    },

    getAudioClip(name){
        return this.chapterAudioClips[name]
    },

    setResType(resType){
        this.m_resType = resType
    },

    getResType(){
        return this.m_resType
    },

    setDeviceMemory(memory){
        console.log("设备存储空间 =====> ",memory)
        this.m_deviceMemory = memory
    },

    getDeviceMemory(){
        return this.m_deviceMemory
    },

    setMainListData(data){
        this.m_oMainListInfo = data
    },

    getMainListData(){
        return this.m_oMainListInfo
    },

    hasNewChapter(){
        var isNew = false
        for(let i = 0; i < this.m_oMainListInfo.length; i++) {
            if(this.m_oMainListInfo[i].new){
                isNew = true
                break
            }
        }
        return isNew
    },
});
