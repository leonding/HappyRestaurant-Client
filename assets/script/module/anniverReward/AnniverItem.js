cc.Class({
    extends: cc.Component,
    properties: {
        m_ozheNode:cc.Node,
        m_oChoose:cc.Node,
        m_oTimeLabel:cc.Label,
    },

    onLoad(){
    },

    setData:function(index,itemData,date){
        this.m_index = index
        var m = date.getMonth()+1
        var d = date.getDate()
        this.m_oTimeLabel.string =m + Ls.get(40018) +d + Ls.get(40024)
        this.m_newItem = Gm.ui.getNewItem(this.node.getChildByName("itemNode"))
        this.m_newItem.setData(itemData)
        this.m_newItem.setTips(false)
    },


    updateStatus(){
        var status = Gm.anniversaryRewardData.getRewardIsReceived(this.m_index) 
        this.m_ozheNode.active = status == 2
        this.m_oChoose.active = status == 1
        if( status == 1){
            Gm.load.loadPerfab("perfab/ui/kuang01",(sp)=>{
                if(this.m_newItem.node.isValid){
                    this.m_aniNode = cc.instantiate(sp)
                    this.m_newItem.node.addChild(this.m_aniNode)
                }
            })
        }else{
            if(this.m_aniNode){
                this.m_aniNode.active = false 
            } 
        }
    }
});


