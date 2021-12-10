var BaseView = require("BaseView")
// TravelUsed
cc.Class({
    extends: BaseView,
    properties: {
        m_oCellNode:cc.Node,
        m_oListScroll: {
            default: null,
            type: cc.ScrollView
        },
        m_oItemNone:cc.Node,
        m_tFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            var tmpData = null
            if (args == 1){//个人
                tmpData = Gm.config.getConst("travel_task_item_num").split("|")
            }else{
                tmpData = Gm.config.getConst("teamt_rave_task_item_num").split("|")
            }
            this.m_oItemNone.active = false
            Func.destroyChildren(this.m_oListScroll.content)
            for(const i in tmpData){
                this.dealCell(tmpData[i])
            }
        }
    },
    dealCell:function(destId){
        var item = cc.instantiate(this.m_oCellNode)
        item.active = true
        var tmpSpt = item.getComponent("UsedCell")
        tmpSpt.setOwner(checkint(destId),this)
        this.m_oListScroll.content.addChild(item)
    },
    getCellSprite:function(destType){
        if (destType){
            return this.m_tFrame[0]
        }else{
            return this.m_tFrame[1]
        }
    },
});

