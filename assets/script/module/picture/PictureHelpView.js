var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        helpItems:{
            default: [],
            type: require("PictureHelpItem"),
        },
    },
    onLoad:function(){
        this.popupUIData = {title:Ls.get(70046)}
        this._super()
    },
    enableUpdateView(args){
        if(args){
            Gm.audio.playEffect("music/02_popup_open")
            this.select(0)
        }
    },
    select(type){
        if (this.selectType != type){
            this.selectType = type
            var list = Gm.config.getPictureHelp(this.selectType)
            for (let index = 0; index < this.helpItems.length; index++) {
                const v = this.helpItems[index];
                v.setData(list[index])
            }
        }
    },
    onLeftClick(){
        this.select(Math.max(this.selectType-1,0))
    },
    onRightClick(){
        this.select(Math.min(this.selectType+1,3))
    },
});

