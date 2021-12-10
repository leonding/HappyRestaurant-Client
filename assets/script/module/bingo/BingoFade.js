
cc.Class({
    extends: cc.Component,

    properties: {

    },

    start () {
        var fadeOut = cc.fadeOut(1)
        var fadeIn = cc.fadeIn(1.3)
        var seq = cc.sequence(fadeOut,fadeIn)
        var forevery = cc.repeatForever(seq)
        this.node.runAction(forevery)
    },

    // update (dt) {},
});
