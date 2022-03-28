// SceneManager
cc.Class({
    setRetain:function(list){
        this.retainList = {}
        for(const i in list){
            var node = cc.instantiate(list[i])
            let name = list[i]._name
            // this.curScene.addChild(node)
            cc.game.addPersistRootNode(node)
            var path = Gm.ui.getPath(name)
            this.retainList[name] = node
            if (path){
                node.zIndex = path[2]
            }else if(name == "scaleView"){
                this.setScaleView(node)
            }else if(name == "click"){
                this.bindClickEffect(node)
            }else if(name == "itemMoveNode"){
                ActionFunc.setRootNode(node)
            }
        }
    },
    ctor:function(){
        this.setScene()
    },
    setScene:function(){
        this.curScene = cc.director.getScene()
        this.sceneCanvas = this.curScene.getChildByName("Canvas")
        for(var i=0;i<this.curScene.dependAssets.length;i++){
            const item = cc.loader.getRes(this.curScene.dependAssets[i])
            if (Func.isRetain(item)){
                Gm.load.retainList("pictureList",this.curScene.dependAssets[i])
            }else if(item instanceof cc.Prefab){
                Gm.load.retainList("fabList",this.curScene.dependAssets[i])
            }
        }
    },
    loseBattle:function(page){
        this.m_oData = [{name:"MainView",data:{page:page}}]
    },
    leaveBattle:function(){
        this.changeScene("LeaveBattleView",true)
    },
    changeScene:function(name,destData,destFunc,pageNum){
        var tmpData = Gm.ui.getViewData()
        Gm.ui.resetBGMAll()
        cc.director.loadScene("MainScene",()=>{
            this.setScene()
            Gm.ui.removeAllView()
            Gm.load.releaseAll()
            cc.sys.garbageCollect()
            Gm.ui.m_bBgmPause = false
            // console.log("changeScene!!!!!!!!!!!",this.m_oData,tmpData)
            // console.log("====:",cc.loader._cache)
            if (name){
                Gm.ui.create1(name,destData,()=>{
                    if (destFunc){
                        destFunc()
                    }
                    this.coverData(tmpData)
                },pageNum)
            }else{
                this.coverData(tmpData)
            }
        })
    },
    coverData:function(data){
        if (this.m_oData && this.m_oData.length > 0){
            var total = this.m_oData.length
            var count = 0
            for(var i = total - 1;i >=0;i--){
                // console.log("name====:",this.m_oData[i].name)
                Gm.ui.create1(this.m_oData[i].name,this.m_oData[i].data,function(){
                    count++
                    if (count == total){
                        setTimeout(function(){
                            Gm.ui.removeByName("LeaveBattleView")
                        },500)
                    }
                })
            }
        }
        this.m_oData = data
    },
    getView:function(name){
        return this.retainList[name]
    },
    getScene:function(){
        return this.curScene
    },
    getCanvas:function(){
        return this.sceneCanvas
    },
    setScaleView:function(node){
        this.scaleView = node
        this.scaleView.zIndex = 1
        Gm.ui.base = this.scaleView.getChildByName("baseView")
        var tmpSize = cc.view.getFrameSize()
        var tmpScale = tmpSize.height/tmpSize.width
        var defultSize = cc.view.getDesignResolutionSize()
        var defultScale = defultSize.height/defultSize.width
        cc.fixBgScale = 1
        var tmpWid = this.scaleView.getComponent(cc.Widget)
        if (tmpScale <= 1.5 || tmpScale == 1.6){
            var hScale = tmpSize.height/(tmpSize.width * defultScale)
            node.scale = hScale
            var wid = (defultSize.width * hScale)
            var need = (defultSize.width - wid)/2
            cc.fixNeed = need
            tmpWid.left = need
            tmpWid.right = need
        }else if(tmpScale > 1.85){
            cc.fixBgScale = cc.winSize.height/defultSize.height
            if (cc.sys.platform == cc.sys.IPHONE){
                // tmpWid.top = 60
            }
        }
        tmpWid.updateAlignment()
    },
    bindClickEffect:function(node){
        this.clickNode = node
        this.clickNode.zIndex = cc.macro.MAX_ZINDEX
        this.clickStar = this.clickNode.getChildByName("star").getComponent(cc.ParticleSystem)
        this.clickDian = this.clickNode.getChildByName("dianji").getComponent(cc.Animation)
        this.clickNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.callClick()
        })
        this.clickNode.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.callClick(event)
        })
        this.clickNode.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.callClick(event,true)
        })
        this.clickNode.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.callClick()
        })
        this.clickNode._touchListener.setSwallowTouches(false)
    },
    callClick:function(event,start){
        if (event){
            var nowPos = this.clickNode.convertToNodeSpaceAR(event.getLocation())
            if (!this.clickStar.active){
                this.clickStar.resetSystem()
            }
            if (start){
                this.clickDian.node.x = nowPos.x
                this.clickDian.node.y = nowPos.y
                this.clickDian.play()
            }
            this.clickStar.node.x = nowPos.x
            this.clickStar.node.y = nowPos.y
        }else{
            this.clickStar.stopSystem()
        }
    },
    pushData:function(name,data){
        this.m_oData.push({name:name,data:data})
    },
});
