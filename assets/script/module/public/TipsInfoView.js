var BaseView = require("BaseView")
const MAX_WIDTH = 500
const WIDTH_BET = 40
const FONT_WIDTH = 30
const FONT_HEIGH = 31
// TipsInfoView
cc.Class({
    extends: BaseView,
    properties: {
        m_oBaseNode:cc.Node,
        m_oNameText:cc.Label,
        m_oInfoText:cc.RichText,
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
                const skill = Gm.config.getSkill(args.id)
                this.m_oNameText.string = skill.name
                this.m_oInfoText.string = skill.detailed
                this.m_oBaseNode.opacity = 255
            }
        }
    },
});

