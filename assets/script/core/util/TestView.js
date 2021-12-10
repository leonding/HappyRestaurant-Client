var BaseView = require("BaseView")

const POS_X = 210
const ACTION_TIME = 0.2
cc.Class({
    extends: BaseView,
    properties: {
        heroBackSpr:cc.Sprite,
        personSpine:sp.Skeleton,
    },
    changeSpine(skinId){
        this.skinConf = Gm.config.getSkin(skinId)
        this.isUnlock = this.heroConf.quality >= this.skinConf.quality
        Gm.load.loadSpriteFrame("img/bg/"+this.skinConf.background,function(sp,icon){
            icon.spriteFrame = sp
            // sp.addRef()
            cc.log(sp)
        },this.heroBackSpr)
          
        this.showSpine()
    },
    showSpine(){
        this.personSpine.node.color = this.isUnlock?cc.color(255,255,255):cc.color(100,100,100)
        Gm.load.loadSkeleton(this.skinConf.rolePic,(sp,owner)=>{
            owner.skeletonData = sp
            // sp.addRef()
            cc.log(sp)
            owner.setAnimation(0, "ziran", true)
            this.scheduleOnce(()=>{
                owner.paused = !this.isUnlock
                // owner.node.color = this.isUnlock?cc.color(255,255,255):cc.color(100,100,100)
            },1/60)
        },this.personSpine)
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        this.heroData = Gm.heroData.getHeroByQualityId(this.openData)
        this.heroConf = Gm.config.getHero(0,this.openData)
        this.allSkinList = Gm.config.getSkins(this.heroConf.id)
        this.changeSpine(this.allSkinList[0].id)
    },
});

