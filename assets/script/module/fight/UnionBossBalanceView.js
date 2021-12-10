var BaseView = require("BaseView")

// UnionBossBalanceView
cc.Class({
    extends: BaseView,

    properties: {
        m_oTrainScroll:cc.ScrollView,
        hurtLab:cc.Label,
        scoreLab:cc.Label,
    },

    onLoad () {
        this._super()
    },
    enableUpdateView:function(destData){
        if (destData){
            this.m_oData = destData.data
            this.owner = destData.owner
            Func.destroyChildren(this.m_oTrainScroll.content)

            this.scoreLab.string = this.m_oData.source
            this.hurtLab.string = this.m_oData.hurt
            
            var list = []
            for (let i = 0; i < this.owner.battleDestData.battleInfo.length; i++) {
                const v = this.owner.battleDestData.battleInfo[i];
                if (v.fightResult == 1){
                    var conf = Gm.config.getUnionBossGroup(v.monsterGroupId)
                    for (let j = 0; j < conf.reward.length; j++) {
                        const vj = conf.reward[j];
                        list.push({itemType:vj.type,baseId:vj.id,itemCount:vj.num})
                    }
                }
            }
            this.m_oData.award = {drop:{item:list}}

            if (this.m_oData.award){
                this.m_oTrainScroll.node.active = true
                for(const i in this.m_oData.award.drop.item){
                    const v = this.m_oData.award.drop.item[i]
                    var itemSp = Gm.ui.getNewItem(this.m_oTrainScroll.content)
                    itemSp.setData(v)
                }
            }
        }
    },
    onScreenClick:function(){
        Gm.ui.removeByName("BattleView")
    },
});

