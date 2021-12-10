var BaseView = require("BaseView")
cc.Class({
    extends:BaseView,

    properties: {
        m_oTimeLabel:cc.Label,
        m_oEdit:cc.Label,
        m_oInnserLabel:cc.Label,
        m_oEmail:cc.Label,
        m_oQuestion:cc.Label,

        m_oEmailNode:cc.Node,
        m_oInnerNode:cc.Node,
        m_oTimeNode:cc.Node,

        contentNode:cc.Node,
        m_oListPanel:cc.Sprite,
    },

    enableUpdateView(args){
        if (args){
            this.data = args
            this.popupUI.setData({title:args.title})
            this.updateUI()
            this.updateListPanel()
        }
    },

    updateUI(){
        this.m_oTimeNode.active = this.data.timeStr != undefined && this.data.timeStr != ''
        this.m_oInnerNode.active = this.data.code != undefined
        if(this.data.timeStr){
            this.m_oTimeLabel.string = this.data.timeStr
        }
        if(this.data.code){
            this.m_oInnserLabel.string = this.data.code == 1 ? Ls.get(2208):Ls.get(2209)
        }

        if(this.data.text){
            this.m_oEdit.string = this.data.text
            this.m_oEdit._forceUpdateRenderData(true)
            this.m_oEdit.node.parent.height = this.m_oEdit.node.height + 15
        }

        if(this.data.mail){
            this.m_oEmail.string = this.data.mail
            this.m_oEmail._forceUpdateRenderData(true)
            this.m_oEmail.node.parent.height = this.m_oEmail.node.height + 15
        }
    },

    onCommitClick(){
        this.data.title = undefined
        Gm.userFeedbackNet.commitFeedback(this.data)
    },

    updateListPanel(){
        setTimeout(()=>{
            var layout = this.contentNode.getComponent(cc.Layout)
            layout.active = true
            layout._layoutDirty = true
            layout.updateLayout()
            var height = this.contentNode.height
            var parentHeight = this.contentNode.parent.height
            if(height > parentHeight){
                height = parentHeight
            }
            this.m_oListPanel.node.height = height + 50
        },0.1)
    },
});
