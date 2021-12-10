var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_person:sp.Skeleton
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    enableUpdateView(args){
        if (args){
            this.loadHeroSkin(args.skinconf)
        }
    },
    loadHeroSkin(skinConf){
        Gm.load.loadSkeleton(skinConf.rolePic,function(sp,owner){
            owner.skeletonData = sp
            owner.setAnimation(0, "ziran", true)
        },this.m_person)

    }
});
