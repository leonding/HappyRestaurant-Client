var BaseView = require("BaseView")
// TipsInfoView
cc.Class({
    extends: BaseView,
    properties: {
        m_oBaseNode:cc.Node,
        m_oNameText:cc.Label,
        m_oInfoText:cc.Label,
    },
    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START,function  (event) {
            this.node._touchListener.swallowTouches = false
        },this)
        this.node.on(cc.Node.EventType.TOUCH_END,function  (event) {
            this.onBack()
        },this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function  (event) {
            this.onBack()
        },this)
    },
    enableUpdateView:function(args){
        if (args){
            this.m_oBaseNode.x = args.x
            this.m_oBaseNode.y = args.y
            if (args.id){
                if(checkint(args.id) == 0){
                    var array = args.id.split("_")
                    this.m_oNameText.string = array[0]
                    this.m_oInfoText.string = array[1]
                }else{
                    const skill = Gm.config.getBuffWithId(args.id)
                    this.m_oNameText.string = skill.name
                    this.m_oInfoText.string = skill.describe
                }
                this.m_oBaseNode.opacity = 255
                var posx = args.x 
                var posy = args.y
                // console.log(this.m_oInfoText.node.height)
                if(posx - this.m_oBaseNode.width / 2 < - cc.winSize.width / 2){
                    posx = -cc.winSize.width / 2 + this.m_oBaseNode.width / 2
                }else if(posx + this.m_oBaseNode.width / 2 > cc.winSize.width / 2){
                    posx = cc.winSize.width / 2 - this.m_oBaseNode.width / 2
                }
                posy = posy + this.m_oBaseNode.height / 2

                this.m_oBaseNode.x = posx
                this.m_oBaseNode.y = posy + 20
    
            }
        }
    },
});

