// ArenaAwardCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oRankSpr:cc.Sprite,
        m_oRankNod:cc.Node,
        m_oRankLab:cc.Label,
        m_oItemNod:cc.Node,
        m_oRankIcon:cc.Sprite,
        m_oIndexIcon:cc.Sprite,
    },
    setOwner:function(destOwner,data,tmpIdx){
        this.m_oOwner = destOwner
        this.m_oData = data
        if (data.minRank == data.maxRank){
            if (data.minRank > this.m_oOwner.m_tFrame.length){
                this.m_oRankSpr.node.active = false
                this.m_oRankLab.string = data.minRank
            }else{
                this.m_oRankSpr.spriteFrame = this.m_oOwner.getFrame(data.minRank - 1)
                this.m_oRankLab.node.active = false
                this.m_oRankNod.active = false
                Gm.load.loadSpriteFrame("img/shuijing/crystal_icon_ph_"+data.minRank,function(sp,icon){
                    if(icon && icon.node.isValid){
                        icon.spriteFrame = sp
                    }
            },this.m_oIndexIcon)
            }
        }else{
            this.m_oRankLab.string = data.rank
            this.m_oRankSpr.node.active = false
        }
        if (tmpIdx % 2 == 0){
            // this.node.getComponent(cc.Sprite).spriteFrame = null
        }
        if (tmpIdx ==  0) {
            this.m_oRankIcon.node.active = false
            this.node.getComponent(cc.Sprite).spriteFrame = null
            this.m_oItemNod.y = this.m_oItemNod.y - 15
        }
    },
    updateList:function(destType){
        if (this.m_oData){
            var tmpTb = null
            if (destType == 0){
                tmpTb = this.m_oData.rankReward
            }else{
                tmpTb = this.m_oData.seasonRankReward
            }
            Func.destroyChildren(this.m_oItemNod)
            for(const i in tmpTb){
                var itemBase = Gm.ui.getNewItem(this.m_oItemNod)
                itemBase.setData(tmpTb[i])
            }
        }else{
            this.m_oRankSpr.node.active = false
            this.m_oRankIcon.node.active = false
            this.node.getComponent(cc.Sprite).spriteFrame = null
            this.m_oRankLab.string = Ls.get(800026)
        }
    },
});

