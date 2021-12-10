var BaseView = require("BaseView")
// LotterySecond
cc.Class({
    extends: cc.Component,
    properties: {
        m_oBackNode:cc.Node,
        m_oListNode:cc.Node,
        m_oCellFab:cc.Node,
        m_oCellList:null,
    },
    updateInfo:function(data){
        this.m_oData = data
        for(const i in this.m_oCellList){
            if (this.m_oCellList[i].getId() == data.config.id){
                this.m_oCellList[i].updateInfo(data)
            }else if(this.m_oCellList[i].getMode() == 4 && data.config.id >= 1004){
                this.m_oCellList[i].updateInfo(data)
            }
        }
    },
    updateView:function(owner,data){
        this.m_oOwner = owner
        this.m_oData = data
        this.m_oCellList = []
        for(const i in this.m_oData){
            var tmpNode = cc.instantiate(this.m_oCellFab)
            tmpNode.active = true
            this.m_oListNode.addChild(tmpNode)
            var tmpSpt = tmpNode.getComponent("SecondCell")
            tmpSpt.updateView(this.m_oOwner,this.m_oData[i])
            this.m_oCellList.push(tmpSpt)
        }
    },
    updateOffer:function(offerStatus){

    },
    updateRefreshTime:function(){
        for(const i in this.m_oCellList){
            this.m_oCellList[i].updateRefreshTime()
        }
    },
});

