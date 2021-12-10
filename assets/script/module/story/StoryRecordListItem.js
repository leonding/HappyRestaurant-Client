
cc.Class({
    extends: cc.Component,

    properties: {
        m_oHeadNode:cc.Node,
        m_oRoleName:cc.Label,
        m_oTalk:cc.Label,
    },

    onLoad () {
        
    },

    setData (data){
        this.data = data
        if(data.heroid){
            Func.newHead(data.heroid,this.m_oHeadNode,data.heroid,1)
            this.m_oHeadNode.itemBase.loadBottomFrame("share_img_k1")
            this.m_oHeadNode.itemBase.setLabStr("")
        }
        this.m_oRoleName.string = data.name
        this.m_oTalk.string = data.talk
    },

    onAudioClick(){
            
    },

});

