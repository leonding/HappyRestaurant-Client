// NewCardItem
cc.Class({
    extends: cc.Component,

    properties: {
        qualitySprite1:cc.Sprite,
        qualitySprite2:cc.Sprite,
        qualitySprite3:cc.Sprite,
        personNode:sp.Skeleton,
        newSprite:cc.Node,
        spCardSprite:cc.Sprite,
        actionStr:{
            default:""
        },
    },
    onLoad(){
         this.node.getComponent(cc.Animation).on("finished",this.onAnimationFinished.bind(this))
         this.isOpen  = false
    },
    setData(data,config,index,ower){
        this.data = data
        this.ower = ower
        this.index = index
        for(var i=0;i<config.length;i++){
            if(config[i].quality == this.data.baseId%10){
                this.config = config[i]
            }
        }
        var self = this
        setTimeout(() => {
            self.setUI()
        }, index*0.01);
    },
    setUI(){
        this.setRes()
        this.checkNew()
        // this.addPerson()
        this.addTouchEvent()
    },
    setRes(){
        Gm.load.loadSpriteFrame("/img/chouka/" + this.config.res1,function(spr,icon){
            if(icon.node && icon.node.isValid){
                icon.spriteFrame = spr     
            }
        },this.qualitySprite1)
        Gm.load.loadSpriteFrame("/img/chouka/" + this.config.res2,function(spr,icon){
            if(icon.node && icon.node.isValid){
                icon.spriteFrame = spr     
            }
        },this.qualitySprite2)

        Gm.load.loadSpriteFrame("/img/equipLogo/" + this.config.qualityRes,function(spr,icon){
            if(icon.node && icon.node.isValid){
                icon.spriteFrame = spr     
            }
        },this.qualitySprite3)
    },
    onNewSpriteShow(){
        if(this.newSprite.active){
            Gm.audio.playEffect("/music/gacha/37_gacha2021_newRole")
        }
    },
    checkNew(){
        var hero = Gm.heroData.getHerosByBaseId(Math.floor(this.data.baseId / 1000))
        var key = true
        if(hero && hero.length >1){
            key = false
        }
        this.newSprite.active = key
    },
    addPerson(){
        var heroCfg = Gm.config.getHero(parseInt(this.data.baseId/1000),this.data.baseId)
        var skinConfig = Gm.config.getSkin(heroCfg.skin_id)
        Gm.load.loadSkeleton(skinConfig.rolePic,function(sp,self){
                if (self && self.node && self.personNode.node){
                    self.personNode.skeletonData = sp
                    self.personNode.setAnimation(0, "ziran", true)
                    self.personNode.node.active = true
                }
        },this)
        this.ower.playPersonEffect(skinConfig)
    },
    playCardAnmation(){
        this.node.getComponent(cc.Animation).play(this.config.ani)
        if(this.config.quality >= 5){
            Gm.audio.playEffect("/music/gacha/36_gacha2021_rare")
        }
        else{
            Gm.audio.playEffect("/music/gacha/35_gacha2021_normal")
        }
    },
    onAnimationFinished(){
        if(this.ower.onAnimationFinished){
            this.ower.onAnimationFinished(this.index)
        }
        this.isOpen = true
    },
    addTouchEvent(){
        var self = this
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            self.startPos = event.getLocation()
            self.isMove = false
        })
        this.node.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            let endPos = event.getLocation()
            let distance = this.startPos.sub(endPos).mag()
            if(distance>50){
               self.isMove = true
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            if(!self.isMove && self.index == self.ower.pageview.getCurrentPageIndex()){
                self.playCardAnmation()
                self.removeTouchEvent()
                self.ower.onAnimationStart(self.index)
                self.spCardSprite.node.active = false
                self.addPerson()
            }
        })
    },
    removeTouchEvent(){
        this.node.off(cc.Node.EventType.TOUCH_START)
        this.node.off(cc.Node.EventType.TOUCH_MOVE)
        this.node.off(cc.Node.EventType.TOUCH_END)
    },
    spCardAction(){
         if(this.config.quality < 5){
            return
        }
        if(this.spCardSprite.node.active){
            return
        }
        var name = null
        if(this.config.quality == 5){
            name = "nvshen_di_share_img_kd4"
        }
        else if(this.config.quality == 7){
            name = "nvshen_di_share_img_kd5"
        }
        this.spCardSprite.node.active = true
        Gm.load.loadSpriteFrame("/img/chouka/" + name,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.spCardSprite)
        var strArray = this.actionStr.split("|")
        if(strArray.length==2){
            this.shakeScreen(parseInt(strArray[0]),parseInt(strArray[1]))
        }
    },
    shakeScreen:function(time, sk){
        var tmpTimes = time/50
        var tmpTime = 50
        if (tmpTime){
            var tmpSk = sk
            var tmpHeight = tmpSk
            var tmpLostY = 0
            var shakeList = new Array()
            for(var i = 0;i < tmpTimes;i++){
                var tmpY = Func.random(tmpLostY,tmpHeight)
                tmpLostY = tmpHeight - tmpY
                shakeList.push(cc.rotateTo(tmpTime/1000,tmpY - tmpSk + 5))
            }
            shakeList.push(cc.callFunc( ()=>{
                this.node.angle = 0
            }))
            this.node.runAction(cc.sequence(shakeList))
        }
    },
});

