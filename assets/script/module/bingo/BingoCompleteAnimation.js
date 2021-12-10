
cc.Class({
    extends: cc.Component,

    properties: {
        m_oBg:cc.Sprite,
    },


    start () {

    },


    play(callback){
        var action = cc.moveTo(0.5,cc.v2(0,0))
        var delay = cc.delayTime(3)
        action.easing(cc.easeIn(0.5))
        var finish = cc.callFunc(()=>{
            callback()
            this.node.removeFromParent()
        }, this)
        var seq = cc.sequence(action, delay,finish)
        this.m_oBg.node.runAction(seq)
    }
});
