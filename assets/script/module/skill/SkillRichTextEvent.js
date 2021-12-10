cc.Class({
    extends: cc.Component,

    properties: {
    },

    onClick(sender, param){
        var self = this
        var posx = sender.touch._point.x - cc.winSize.width/2
        var posy = sender.touch._point.y - cc.winSize.height/2
        
        Gm.ui.create("TipsBuffView",{id:param,x:posx,y:posy},function(node){
            
        })
    },


});