var BaseView = require("BaseView")

// UnionBossBalanceView
cc.Class({
    extends: BaseView,

    properties: {
        roleNode:cc.Node,
        item1:require("BalanceStatisticItem"),
        item2:require("BalanceStatisticItem"),
    },
    onLoad () {
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        var roleList = []
        var monsterList = []
        var maxNums = {sumHurt:0,sumBeHeal:0,sumBeHurt:0}

        for (let index = 0; index < this.openData.battleData.roleInfo.length; index++) {
            const v = this.openData.battleData.roleInfo[index];

            var tmpList
            if (v.pos >=0){
                tmpList = roleList
            }else{
                tmpList = monsterList
            }
            tmpList.push(v)

            if (v.sumHurt > maxNums.sumHurt){
                maxNums.sumHurt = v.sumHurt
            }
            if (v.sumBeHurt > maxNums.sumBeHurt){
                maxNums.sumBeHurt = v.sumBeHurt
            }
            if (v.sumBeHeal > maxNums.sumBeHeal){
                maxNums.sumBeHeal = v.sumBeHeal
            }
        }

        var atkHead = this.openData.atkHead || Gm.userInfo.head
        var defHead
        if (this.openData.type == ConstPb.battleType.BATTLE_PVP_ARENA){
            if (Gm.arenaData.m_oOwnPerson){
                defHead = Gm.arenaData.m_oOwnPerson.head
                if (Gm.arenaData.m_oOwnPerson.type == ConstPb.roleType.MONSTER){
                    var tmpConfig = Gm.config.getArenaMon(Gm.arenaData.m_oOwnPerson.playerId)
                    if (tmpConfig){
                        defHead = tmpConfig.icon
                    }
                }
            }
        }
        this.item1.setData(roleList,maxNums,this.openData.fightResult,atkHead,this)
        this.item2.setData(monsterList,maxNums,this.openData.fightResult==0?1:0,defHead,this)
    },
});

