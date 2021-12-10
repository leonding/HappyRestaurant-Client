cc.Class({
    extends: cc.Component,

    properties: {
        textLabel:{
            default:null,
            type:cc.Label
        },
        loadAnim:cc.Animation
    },
    
    start () {

    },
    updateLabel:function(text,isAnim){
        if (checkint(text) > 0 ){
            text = ""
        }
        this.textLabel.string = text
        this.loadAnim.node.active = false
        if (isAnim){
            this.textLabel.string = ""
            this.loadAnim.node.active = true
            this.loadAnim.play("load")
        }
    },

    // update (dt) {},
});
