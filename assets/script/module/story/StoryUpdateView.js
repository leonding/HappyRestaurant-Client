const UPTYPE_DOWNLOAD = 1
const UPTYPE_LOADING = 2
const UPTYPE_RELEASE = 3
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
        byteProgress:cc.ProgressBar,
        byteLabel:cc.Label,
        percentLabel:cc.Label,
        tipLabel:cc.Label,

        baseURL:"",
        cdnURL:"",
        btn:cc.Node,

        usefulArray:"",
        usefultips:cc.Label,
        m_oCampFrame:{
            type:cc.SpriteFrame,
            default:[],
        },
        m_oShowNode:cc.PageView,
        m_oItemNode:cc.Node,
        wifitips:cc.Node,

    },
    enableUpdateView:function(data){
        if (data){
            this.m_bCanDo = cc.sys.isNative
            this.m_oShowNode.removeAllPages()
            var tips = this.usefulArray.split("|")
            this.usefultips.node.active = true
            this.byteProgress.node.active = true
            this.usefultips.string = Ls.get(tips[Func.random(0,tips.length)])
            if(data.type == UPTYPE_DOWNLOAD){
                this.m_oBackGround.color = cc.color(255,255,255)
            }else if(data.type == UPTYPE_LOADING){
                this.initLoad(data)
            }else if(data.type == UPTYPE_RELEASE){
                this.m_oBackGround.color = cc.color(255,255,255)
                var self = this
                var title = Ls.get(100)
                var tmpTimer = setTimeout(function(){
                    self.release(function(count, total){
                        var percent = count/total
                        self.byteProgress.progress = percent
                        self.percentLabel.string = title + Math.floor(percent*100) + " %"
                        if (count == total){
                            Gm.ui.removeByName("StoryUpdateView")
                        }
                    })
                    clearTimeout(tmpTimer)
                },1000)                
            }
        }
    },
    onDestroy: function () {
        if (this._updateListener) {
            this.am.setEventCallback(null);
            this._updateListener = null;
        }
    },
    initLoad(data){
        this.m_oBackGround.color = cc.color(255,255,255)
        var self = this
        var title = Ls.get(100)
        var tmpTimer = setTimeout(function(){
            self.load(data, function(count, total){
                var percent = count/total
                self.byteProgress.progress = percent
                self.percentLabel.string = title + Math.floor(percent*100) + " %"
                if (count == total){
                    Gm.ui.removeByName("StoryUpdateView")
                    Gm.ui.create("StoryShow",data.chapterData)
                }
            })
            clearTimeout(tmpTimer)
        },1000)
    },

    load(data, callback){
        var count = 0
        var total = data.heroSkeletonName.length //+ data.effectName.length
        var heroSkeleton = data.heroSkeletonName
        var effect = 0//data.effectName
        var tmpNode = cc.instantiate(this.m_oItemNode)
        for(let key in heroSkeleton){
            Gm.load.loadType("personal/character/"+heroSkeleton[key]+"/"+heroSkeleton[key],sp.SkeletonData,function(sp){
                if (sp){
                    count++
                    Gm.getLogic("StoryLogic").addLoadSkeleton(sp)
                    callback(count, total)
                }
            },tmpNode)
        }
        for(let index in effect){
            Gm.load.loadType(effect[index],sp.SkeletonData,function(sp){
                if (sp){
                    count++
                    Gm.getLogic("StoryLogic").addLoadEffect(sp)
                    callback(count, total)
                }
            },tmpNode)
        }
    },

    release(callback){
        var count = 100
        var total = 100

        Gm.getLogic("StoryLogic").removeAllLoadSkeleton()

        callback(count, total)
    },

    loadComplete(data){
    
    },
    
    toFixed(num){
        return num.toFixed(2) + "M"
    },

    updateDownload(count, total){
        var percent = count/total
        this.byteProgress.progress = percent
        this.percentLabel.string = Math.floor(percent*100) + " %"
    },

    updateDownLoadPercent(percent){
        this.byteProgress.progress = percent
        this.percentLabel.string = Math.floor(percent*100) + " %"
    }
});
