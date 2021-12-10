// LoterryTopCell
cc.Class({
    extends: cc.Component,

    properties: {
        iconSpr:cc.Sprite,
        lab:cc.Label
    },
    setData(viewId,owner){
        this.viewId = viewId
        this.owner = owner

        var conf = Gm.config.getViewById(viewId)
        this.lab.string = conf.viewDes

        Gm.load.loadSpriteFrame("img/" +conf.icon,(sp,owner)=>{
            if (owner && owner.node){
                owner.spriteFrame = sp
            }
        },this.iconSpr)
    },
    onBtnClick(){
        var isUnlock = Gm.ui.jump(this.viewId)
        if (isUnlock){
            Gm.ui.removeByName("HeroTjView")
            Gm.ui.removeByName("TeamListView")
            Gm.ui.removeByName("HeroFlySelectView")
            Gm.ui.removeByName("TeamYokeView")
            Gm.ui.removeByName("NewShopView")
            Gm.ui.removeByName("EquipMainView")
            Gm.ui.removeByName("HeroSkinView")
            Gm.ui.removeByName("CrystalView")
            var config = Gm.config.getViewById(this.viewId)
            if(config.clientDes != "DungeonActivityView"){
                Gm.ui.removeByName("DungeonActivityView")
            }
            if(config.clientDes != "DungeonMissionView"){
                Gm.ui.removeByName("DungeonMissionView")
            }
            this.owner.onBack()
        }
    },
});

