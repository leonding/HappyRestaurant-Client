var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        bgSpr:cc.Sprite,
        topSpr:cc.Sprite,
        contentLab:cc.Label,
    },
    onLoad(){
        this._super()
    },
    runOpenAction(){
        Gm.load.loadSpriteFrame("img/zj/zj_img_bt_" +this.openData.camp,(sp,icon)=>{
            if (icon && icon.node){
                icon.spriteFrame = sp
            }
        },this.topSpr)

        Gm.load.loadSpriteFrame("img/zj/zj_img_" +this.openData.camp,(sp,icon)=>{
            if (icon && icon.node){
                icon.spriteFrame = sp
            }
        },this.bgSpr)
        this._super()
    },
    enableUpdateView(args){
        if (args){
            if (Gm.red.getState("biography")[this.openData.id]){
                cc.sys.localStorage.setItem(HeroFunc.getBiographyKey(this.openData.id),1)
                Gm.red.refreshEventState("biography")
            }
            this.info = Gm.config.getHeroHistoryByBaseId(this.openData.id).info
            this.contentLab.string = this.info
        }
    },
});

