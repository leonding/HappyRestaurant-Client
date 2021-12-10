var BaseView = require("BaseView")
// LotteryAwardNew
cc.Class({
    extends: BaseView,
    properties: {
        contentNode:cc.Node,
        m_oFabBtn:cc.Node,
        m_oCardItemNode:cc.Node,
        singleNode:cc.Node,
        singleBtnOne:cc.Node,
        singBtnTen:cc.Node,
        actionItem:cc.Node,
        backBtn:cc.Node,
        touchNode:cc.Node,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView(args){
        if(args && typeof(args) == "object"){
            this.data = args
            this.data.config = Gm.lotteryData.getConfigByFieId(this.data.fieldId)
            if(this.isSingHero()){
                this.singleNode.active = true
                this.m_oFabBtn.active = false
                this.animationNodes = []
                this.itemJs = []
                this.animationName = "xialuo"
                if(this.data.list.length == 10){
                     this.animationName = "xialuo2"
                }
                this.createSingleHeroContentNode()
                this.touchNode.active = true
            }
            else{
                this.data.list.sort(function(a,b){
                    var q1 = a.baseId % 10
                    var  q2 = b.baseId % 10
                    return q2-q1
                })
                this.createContentNode()
                this.showBtns()
            }
            this.setMenu()
        }
    },
    isSingHero(){
        return this.data.fieldId == 1008
    },
    setMenu(){
        if(this.isSingHero()){//单抽
            if(this.data.config.oneCost.length>0){
                this.payOneTypeData = this.data.config.oneCost
                this.drawOneType = 0
                LotteryFunc.transBtn(this.singleBtnOne,this.data.config.oneCost)
            }
            if(this.data.config.tenCost.length>0){
                this.payTypeData = this.data.config.tenCost
                this.drawType = 1
                LotteryFunc.transBtn(this.singBtnTen,this.data.config.tenCost)
            }
        }
        else{
             if(this.data.config.tenCost.length>0 && this.data.list.length == 10){
                this.m_oFabBtn.active = true
                this.drawType = Gm.cardNet.m_iDrawType
                if (Gm.cardNet.m_iDrawType < 2){
                    this.payTypeData = this.data.config.tenCost
                    LotteryFunc.transBtn(this.m_oFabBtn,this.data.config.tenCost)
                }
                else{
                    this.payTypeData = this.data.config.payTenCost
                    LotteryFunc.transBtn(this.m_oFabBtn,this.data.config.payTenCost)
                }
            }
            else{
                this.m_oFabBtn.active = false
            }
        }
    },
    createContentNode(){
        var config = LotteryFunc.getLotteryAwardNewRes()
        for(var i=0;i<this.data.list.length;i++){
            var heroCfg = Gm.config.getHero(parseInt(this.data.list[i].baseId/1000),this.data.list[i].baseId)
            var skinConfig = Gm.config.getSkin(heroCfg.skin_id)
            var node = cc.instantiate(this.m_oCardItemNode)
            node.active = true
            this.setNodePosition(node,i)
            this.contentNode.addChild(node)
            node.getComponent("ItemNode").setData(this.data.list[i])
            Gm.load.loadSpriteFrame("/personal/banshnew/" + skinConfig.role,function(sp,s){
                    if (s && s.node && s.node.isValid){
                        s.spriteFrame = sp
                    }
            },node.getChildByName("icon").getComponent(cc.Sprite))

            for(var j=0;j<config.length;j++){
                if(config[j].quality == this.data.list[i].baseId%10){
                    Gm.load.loadSpriteFrame("/img/chouka/" + config[j].res1,function(sp,s){
                        if (s && s.node && s.node.isValid){
                            s.spriteFrame = sp
                        }
                    },node.getChildByName("cardN1").getComponent(cc.Sprite))

                    Gm.load.loadSpriteFrame("/img/chouka/" + config[j].res2,function(sp,s){
                        if (s && s.node && s.node.isValid){
                            s.spriteFrame = sp
                        }
                    },node.getChildByName("cardN2").getComponent(cc.Sprite))

                    Gm.load.loadSpriteFrame("/img/equipLogo/" + config[j].qualityRes,function(sp,s){
                        if (s && s.node && s.node.isValid){
                            s.spriteFrame = sp
                        }
                    },node.getChildByName("charactor_quality_icon").getComponent(cc.Sprite))
                    break
                }
            }
        }
        if(this.data.list.length == 1){
            this.contentNode.scale = 2.5
        }
        else{
            this.contentNode.scale = 1
        }
    },
    onItemClick(sender){
        var hero = sender.target.getComponent("ItemNode").data
        Gm.ui.create("UnLockHero",{qualityId:hero.baseId})
    },
    setNodePosition(node,i){
        if(this.data.list.length == 1){
            node.x = 0
            node.y = 0
        }
        else{
            if(i>=2){
                i = i+2
            }
            var r = Math.floor(i/4)
            var l = Math.floor(i%4) + 1
            if(i<2){
                l = l + 1
            }
            node.x = l * 170 - 425
            node.y = (1-r) * 325 + 22
        }
    },
    onOneBtnClick(){
        var teamNum = 1
        var itemNum = 0
        if(this.data.fieldId == 1008){
            teamNum = 1
            itemNum = 1
        }
        LotteryFunc.onBtnClick(this.data.config,this.payOneTypeData,this.drawOneType,1,teamNum,itemNum,this.drawReset.bind(this))
    },
    onTenBtnClick(){
        var teamNum = 10
        var itemNum = 0
        if(this.data.fieldId == 1008){
            teamNum = 1
            itemNum = 1
        }
        LotteryFunc.onBtnClick(this.data.config,this.payTypeData,this.drawType,10,teamNum,itemNum,this.drawReset.bind(this))
    },
    drawReset(){
        this.onBack()
        Gm.ui.removeByName("LotteryAwardNew")
    },
    createSingleHeroContentNode(){
        this.contentNode.removeAllChildren()
        for(var i=0;i<this.data.list.length;i++){
            var width = 150
            if(this.data.list[i].itemType == 80000){
                 width = 163
            }
            var itemJs = Gm.ui.getNewItem(this.contentNode,false,width)
            this.setItemPosition(itemJs.node,i)
            if(this.data.list[i].itemType == 80000){
                itemJs.updateHero({baseId:Math.floor(this.data.list[i].baseId/1000),qualityId:this.data.list[i].baseId})
            }
            else if(this.data.list[i].itemType == 40000){
                itemJs.updateEquip(this.data.list[i])
            }
            else if(this.data.list[i].itemType == 30000){
                itemJs.setData(this.data.list[i])
            }
            itemJs.node.active = false
            this.itemJs.push(itemJs)
        }
        this.perShowAnimation()
    },
    perShowAnimation(){
        var array = [0,1,2,3,4,5,6,7,8,9]
        for(var i=0;i<5;i++){
            var index1 = Func.random(0,9)
            var index2 =  Func.random(0,9)
            if(index1 != index2){
                 var t = array[index1]
                 array[index1] = array[index2]
                 array[index2] = t
            }
        }
        for(var i=0;i<this.itemJs.length;i++){
            this.showAnimation(array[i],i)
        }
    },
    showAnimation(index,i){
        var self = this
        setTimeout(() => {
            if(self.node && self.node.isValid && !self.isSkip){
                var item = self.getAnimationNode()
                item.x = 0
                var distan = 900
                item.y = self.itemJs[index].node.y + distan
                var time = Func.random(1,4)/10
                var move = cc.moveBy(time,cc.v2(self.itemJs[index].node.x,-distan-50))
                var callback = cc.callFunc(function () {
                    item.getComponent(cc.Animation).stop(self.animationName)
                    item.active = false
                    self.itemJs[index].node.active = true
                    if(i +1 == self.data.list.length){
                        self.onSkipAnimation()
                    }
                }, this);
                item.runAction(cc.sequence(cc.delayTime(0.7-time),move,cc.delayTime(0.4),callback))
                item.getComponent(cc.Animation).play(self.animationName)
            }
        }, i * 300);
    },
    getAnimationNode(){
        for(var i=0;i<this.animationNodes.length;i++){
            if(!this.animationNodes[i].active){
                this.animationNodes[i].active = true
                return this.animationNodes[i]
            }
        }
        var item = cc.instantiate(this.actionItem)
        item.active = true
        this.animationNodes.push(item)
        this.touchNode.addChild(item)
        return item
    },
    setItemPosition(node,i){
         if(this.data.list.length == 1){
            node.x = 0
            node.y = 0
        }
        else{
            var r = Math.floor(i/4)
            var l = Math.floor(i%4) + 1
            if(i>=8){
                l = l + 1
            }
            node.x = l * 170 - 425
            node.y = (1-r) * 170
        }
    },
    hideBtns(){
        if(this.isSingHero()){
            this.singleBtnOne.active = false
            this.singBtnTen.active = false
         }
         else{
             this.m_oFabBtn.active = false
         }
         this.backBtn.active = false
    },
    showBtns(){
         if(this.isSingHero()){
            this.singleBtnOne.active = true
            this.singBtnTen.active = true
         }
         else{
             this.m_oFabBtn.active = false
         }
         this.backBtn.active = true
         this.touchNode.active = false
    },
    onSkipAnimation(){
        this.isSkip = true
         for(var i=0;i<this.animationNodes.length;i++){
            if(this.animationNodes[i].active){
                this.animationNodes[i].stopAllActions()
            }
         }
         for(var i=0;i<this.itemJs.length;i++){
             this.itemJs[i].node.active = true
         }
         this.showBtns()
    }
});

