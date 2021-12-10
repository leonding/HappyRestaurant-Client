cc.Class({
    extends: require("BaseView"),
    properties: {
        enterItems:{
            default: [],
            type:require("TowerEnterItem"),
        },
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    register:function(){
        this.events[Events.TOWER_UPDATE] = this.updateView.bind(this)
    },
    updateView:function(){
        var list = Gm.config.getTowerGroup()
        for (let index = 0; index < this.enterItems.length; index++) {
            const v = this.enterItems[index];
            v.setData(list[index],this)
        }
    },
});

