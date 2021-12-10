
cc.Class({
    extends: cc.Component,

    properties: {
  
    },


    start () {

    },

    onUnlockKaiDone(){
        var itemComponent = this.node.parent.getComponent("VillaHeroItem")
        itemComponent.onUnlockKaiDone()
    }
});
