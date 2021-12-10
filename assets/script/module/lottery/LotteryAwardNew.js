var BaseView = require("BaseView")
// LotteryAwardNew
cc.Class({
    extends: BaseView,
    properties: {
        startAnimation:cc.Node,

        newCardItem:cc.Node,

        bookNode:cc.Node,
        nextBtnNode:cc.Node,
        detailBtnNode:cc.Node,

        pageview:cc.PageView,
        topNode:cc.Node,
        skipNode:cc.Node,
        guideAnimationNode:cc.Node,
    },
    onLoad:function(){
        this._super()
    },
    register:function(){
    },
    showGuide1Action(){
        if(this.guideAnimation){
            this.guideAnimation.play("lott_award_guide2")
        }
    },
    showGuide2Action(){
        if(this.guideAnimation){
            this.guideAnimation.node.opacity = 255
            this.guideAnimation.play("lott_award_guide1")
        }
    },
    hideGuideAction(){
        if(this.guideAnimation){
            var index = this.pageview.getCurrentPageIndex()
            if(index == 0){
            }
            else{
                this.guideAnimation.node.active = false
            }
        }
    },
    addGuideNode(item,i){
        if(Gm.userData.lotteryAwardGuide  && i == 0 && this.data.list.length == 10){
            // var guideNode = cc.instantiate(this.guideAnimationNode)
            // guideNode.active = true
            // item.addChild(guideNode)
            // this.guideAnimation = guideNode.getComponent(cc.Animation)
            // this.showGuide1Action()
        }
    },
    enableUpdateView(args){
        if(args && typeof(args) == "object"){
            this.data = args
            this.currentPage = 0
            this.detailBtnNode.active = false
            this.createContentNode()
            this.addTouchEvent()
        }
    },
    createContentNode(){
        this.pageview.removeAllPages()
        var resConfig = LotteryFunc.getLotteryAwardNewRes()
        for(var i=0;i<this.data.list.length;i++){
            this.createContentItem(i,resConfig)
        }
    },
    createContentItem(i,resConfig){
        var self = this
        setTimeout(() => {
            if(self && self.node && self.node.isValid){
                var item = cc.instantiate(self.newCardItem)
                item.active = true
                var itemJs = item.getComponent("NewCardItem")
                itemJs.setData(self.data.list[i],resConfig,i,self)
                self.pageview.addPage(item)
                if(i+1==self.data.list.length){
                    self.setItemScale(self.pageview)
                }
                self.addGuideNode(item,i)
                if(i == 0){
                    itemJs.spCardAction()
                }
            }
        }, i*0.03);
    },
    addTouchEvent(){
        let self = this
        this.pageview.node.off("scroll-began")
        this.pageview.node.off("scroll-ended")
        this.pageview.node.on("scroll-began",(page)=>{
            self.startPos = page._touchBeganPosition
            self.detailBtnNode.active = false
            Gm.audio.playEffect("music/gacha/34_gacha2021_flip")
        })
        this.pageview.node.on("scroll-ended",(page)=>{
            if(this.isAnimation){
                return
            }
            if(self.startPos){
                let endPos = page._touchEndPosition
                let distance = this.startPos.sub(endPos).mag()
                if(distance>50){
                    var dir = endPos.x - self.startPos.x >0 ? -1:1
                    self.startPos = null
                    self.bookAnimation(dir)
                    self.hideGuideAction()
                }
                self.detailBtnAnimation()
            }
        })
        if(this.data.list.length>1){
            this.pageview.node.off("scrolling")
            this.pageview.node.on("scrolling",(page)=>{
                self.setItemScale(page)
            })
        }
    },
    setItemScale(page){
        var pages = page.getPages()
        for(var i=0;i<pages.length;i++){
            var x = pages[i].x + page.content.x
            var scale = (Math.abs(x)/5000)*1.5
            pages[i].scale = Math.max(1 - scale,0.5)
        }
    },
    bookAnimation(dir){
        if(this.data.list.length == 1){
            return
        }
        var index = this.pageview.getCurrentPageIndex()
        if(index == this.currentPage){
            return 
        }
        this.currentPage = index
        var str = "shu"
        if(dir>0){
            str = "shu - 001"
        }
        this.bookNode.getComponent(cc.Animation).play(str)
        Gm.audio.playEffect("music/gacha/34_gacha2021_flip_book")
    },
    detailBtnAnimation(){
        var index = this.pageview.getCurrentPageIndex()
        var pages = this.pageview.getPages()
        var itemJs = pages[index].getComponent("NewCardItem")
        if(itemJs.isOpen){
            this.detailBtnNode.active = true
            this.detailBtnNode.opacity = 0
            var ac = cc.fadeIn(0.1)
            this.detailBtnNode.runAction(ac)
        }else{
            this.detailBtnNode.active = false
            itemJs.spCardAction()
        }
    },
    onAnimationStart(index){
        this.isAnimation = true
        if(index==0 && this.guideAnimation){
            this.guideAnimation.node.opacity = 0
        }
    },
    onAnimationFinished(index){
        this.isAnimation = false
        if(this.pageview.getCurrentPageIndex()+1 == this.data.list.length){
            this.nextBtnNode.active = true
            this.nextBtnNode.opacity = 0
            this.nextBtnNode.runAction(cc.fadeIn(1))
        }
        this.detailBtnNode.active = true
        if(index == 0){
            this.showGuide2Action()
        }
    },
    playPersonEffect(skinConfig){
        var self = this
        if(this.personEffectId){
            Gm.audio.stopEffect(this.personEffectId)
            this.personEffectId = null
        }
        Gm.audio.playEffect("/personal/voice/" + skinConfig.voc019,function(id){
            self.personEffectId = id
        })
    },
    onSkipBtnClick(){
        Gm.ui.create("LotteryAwardResult",this.data)
        Gm.ui.removeByName("LotteryAwardNew")
        if(this.personEffectId){
            Gm.audio.stopEffect(this.personEffectId)
            this.personEffectId = null
        }
    },
    onNextBtnClick(){
        if(this.data.list.length == 10){
            Gm.ui.create("LotteryAwardResult",this.data)
        }
        Gm.ui.removeByName("LotteryAwardNew")
        if(this.personEffectId){
            Gm.audio.stopEffect(this.personEffectId)
            this.personEffectId = null
        }
    },
    onDetailBtnClick(){
        var hero = this.data.list[this.pageview.getCurrentPageIndex()]
        Gm.ui.create("UnLockHero",{qualityId:hero.baseId})
    },
});

