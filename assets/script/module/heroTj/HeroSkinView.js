var BaseView = require("BaseView")

const POS_X = 210
const ACTION_TIME = 0.2
cc.Class({
    extends: BaseView,
    properties: {
        heroBackSpr:cc.Sprite,
        personSpine:sp.Skeleton,

        HeroSkinItem:cc.Node,
        skinListNode:cc.Node,
        biographyBtn:cc.Node,
    },
    onLoad () {
        this.backLoad = false
        this._super()

    },
    register:function(){
        this.events[MSGCode.OP_HERO_SKIN_SET_S] = this.onNetSkinSet.bind(this)
    },
    onNetSkinSet(){
        for (let index = 0; index < this.skinItems.length; index++) {
            const v = this.skinItems[index];
            v.updateState()
        }
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    changeSpine(skinId){
        this.skinConf = Gm.config.getSkin(skinId)

        this.isUnlock = this.heroData && (this.skinConf.type ==0 && this.heroConf.quality >= this.skinConf.quality) || (this.skinConf.type ==1 && Gm.userInfo.hasSkinById(this.skinConf.id))
        // if(!this.backLoad){
            Gm.load.loadSpriteFrame("img/bg/"+this.skinConf.background,function(sp,icon){
                icon.spriteFrame = sp
            },this.heroBackSpr)
            // this.backLoad = true
        // }
        // if(this.isMove){
        //     var xx = this.isMoveLeft?-720:720
        //     this.moveSpine(xx,()=>{
        //         this.showSpine()
        //     })
        // }else{
        //     this.showSpine()
        // }
        this.showSpine()
    },
    moveSpine(tox,func){
        var acs = cc.sequence(cc.moveTo(ACTION_TIME/2,cc.v2(tox,0)),cc.callFunc(function(){
            if (func){
                func()
            }
        }))
        this.personSpine.node.runAction(acs)
    },
    showSpine(){
        this.personSpine.node.color = this.isUnlock?cc.color(255,255,255):cc.color(100,100,100)
        Gm.load.loadSkeleton(this.skinConf.rolePic,(sp,owner)=>{
            owner.skeletonData = sp
            owner.setAnimation(0, "ziran", true)
            this.scheduleOnce(()=>{
                owner.paused = !this.isUnlock
                // owner.node.color = this.isUnlock?cc.color(255,255,255):cc.color(100,100,100)
            },1/60)
        },this.personSpine)
    },
    updateView(){
        var qualityId = this.openData.opt ?   this.openData.qualityId : this.openData
        this.heroData = Gm.heroData.getHeroByQualityId(qualityId)
        if(!this.heroData){
            let unlockHeroId = Gm.heroData.queryUnlockHeroByBaseId(parseInt(qualityId/1000))
            if(unlockHeroId != 0 ){
                this.heroData = Gm.config.getHero(0,unlockHeroId)
            }
        }
        this.heroConf = Gm.config.getHero(0,qualityId)

        // if (HeroFunc.isBiography){
        //     this.biographyBtn.active = true
        //     Gm.red.add(this.biographyBtn,"biography",this.heroConf.id)//传记    
        // }
        
        this.allSkinList = Gm.config.getSkins(this.heroConf.id)
        this.allSkinList.sort((a,b)=>{
            return  a.show - b.show  
        })

        this.nowSkinIndex = 0

        this.skinItems = []
      
        
        // if(!this.heroData){ //玩家未持有该角色，自动聚集到最后一次购买的皮肤上
        //     if(!Gm.userInfo.skins){ //玩家没有购买皮肤
        //         console.log("皮肤=====>",Gm.userInfo.skins)
        //     }else{
        //         this.nowSkinIndex = this.getLastReceiveIndex(this.allSkinList)
        //     }
        // }
        var len = this.allSkinList.length
        for (let index = 0; index < len; index++) {
            var tmpSkinConf = this.allSkinList[index]
            var item = cc.instantiate(this.HeroSkinItem)
            this.skinListNode.addChild(item)
            item.active = true
           // item.zIndex = -1
            // item.y = 0
            var sp = item.getComponent("HeroSkinItem")
            sp.setOwner(this)
            sp.setData(tmpSkinConf)
            if(this.openData.opt == 1){
                sp.setOpt(this.openData.opt)
                sp.setFb(this.setGoddess.bind(this),index)
            }
           
            this.skinItems.push(sp)
            item.zIndex = len - index
            if (this.heroData && this.heroData.skin == tmpSkinConf.id){
                this.nowSkinIndex = index
            }
        }

        this.setNow(this.nowSkinIndex)
    },
    setShowText(index){
        for(let i = 0; i<this.skinItems.length; ++i){
            const v = this.skinItems[i];
            v.setTextBySkinType(index == i)
        }
        
    },
    getLastReceiveIndex(args){
        var len = Gm.userInfo.skins.length -1
        for(let i = 0; i<args.length; ++i){
            for(let j = len ; j >= 0; --j ){
                if(args[i].id == Gm.userInfo.skins[j].id ){
                    return i
                }
            }
        }

        return 0
    },

    checkScale(){
        for (let index = 0; index < this.skinItems.length; index++) {
            const v = this.skinItems[index].node;
            v.scale = v.x == 0?1:0.82
        }
    },
    itemAction(i,j,isLeft){
        for (let index = 0; index < this.skinItems.length; index++) {
            this.skinItems[index].node.zIndex = 0
        }

        var nowItem = this.skinItems[i]
        var nextItem = this.skinItems[j]
        nowItem.node.zIndex = 1
        nextItem.node.zIndex = 1

        var pos
        var scale = []
        if (isLeft){
            pos = [-POS_X,0]
            scale = [0.82,1]
        }else{
            pos = [0,POS_X]
            scale = [1,0.82]
        }

        this.isMove = true
        this.isMoveLeft = isLeft
        var acs = cc.spawn(cc.moveTo(ACTION_TIME,cc.v2(pos[0],0)),cc.scaleTo(ACTION_TIME,scale[0]))
        nowItem.node.runAction(acs)

        var acs = cc.spawn(cc.moveTo(ACTION_TIME,cc.v2(pos[1],0)),cc.scaleTo(ACTION_TIME,scale[1]))
        nextItem.node.runAction(acs)

        nextItem.node.runAction(cc.sequence(new Array(cc.delayTime(ACTION_TIME+0.1),cc.callFunc( ()=>{
            this.isMove = false
        }))))
    },
    onLeftBtn(){
        if (this.isMove){
            return
        }
        if(this.isCanLeft()){
            return
        }
        this.itemAction(this.nowSkinIndex-1,this.nowSkinIndex,false)
        this.setNow(this.nowSkinIndex - 1)
        this.setShowText(this.nowSkinIndex - 1)
    },
    onRightBtn(){
        if (this.isMove){
            return
        }
        if(this.isCanRight()){
            return
        }
        this.itemAction(this.nowSkinIndex,this.nowSkinIndex+1,true)
        this.setNow(this.nowSkinIndex +1)
        this.setShowText(this.nowSkinIndex +1)
    },
    setNow(index){
        this.nowSkinIndex = index

        for (let index = 0; index < this.skinItems.length; index++) {
            const v = this.skinItems[index];

            var isNow = index == this.nowSkinIndex
            v.setNowShow(isNow)
            if (isNow){
                this.changeSpine(v.skinConf.id)
            }
            if (!this.isMove){
                v.node.scale = 0.82
                if (index < this.nowSkinIndex){
                    v.node.x = -POS_X
                }else if (isNow){
                    v.node.x = 0
                    v.node.scale = 1
                }else{
                    v.node.x = POS_X
                }
            }
        }

    },
    isCanLeft(){
        if (this.nowSkinIndex == 0){
            return true
        }
        return false
    },
    isCanRight(){
        if (this.nowSkinIndex == this.allSkinList.length -1){
            return true
        }
        return false
    },

    //看板娘逻辑设置女神
    setGoddess(index){
        for(let i =0 ; i < this.skinItems.length; ++i ){
            if(index == i){
                this.skinItems[i].setForbidden()
            }else{
                this.skinItems[i].setAvailable()
            }
        }
    },
    onZjClick(){
        Gm.ui.create("HeroBiographyView",this.heroConf)    
    }
});

