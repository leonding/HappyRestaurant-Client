var BaseView = require("BaseView")
// ArenaRecordView

cc.Class({
    extends: BaseView,
    properties: {
        itemPerfab:cc.Prefab,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            Gm.red.m_bHasArena = false
            Gm.red.refreshEventState("arena")
            Gm.arenaNet.sendArenaBattleLog(3)
        }
    },
    register:function(){
        this.events[Events.ARENA_RECORD] = this.updateList.bind(this)
    },
    updateList:function(){
        var tmpList = Gm.arenaData.recordList
        Func.destroyChildren(this.scrollView.content)
        var tmpZuiJin = {}
        var m_tList = []
        for(const i in tmpList){
            var tmpData = tmpList[i]
            var item = cc.instantiate(this.itemPerfab)
            this.scrollView.content.addChild(item)
            var tmpSpt = item.getComponent("ArenaRecordCell")
            tmpSpt.setOwner(this,tmpData)
            if (tmpZuiJin[tmpSpt.m_iEnemyId]){
                if (tmpData.fightTime > tmpZuiJin[tmpSpt.m_iEnemyId]){
                    tmpZuiJin[tmpSpt.m_iEnemyId] = tmpData.fightTime
                }
            }else{
                tmpZuiJin[tmpSpt.m_iEnemyId] = tmpData.fightTime
            }
            m_tList.push(tmpSpt)
        }
        for(const i in m_tList){
            m_tList[i].updateFight(tmpZuiJin[m_tList[i].m_iEnemyId])
        }
    },
    onAdds:function(sender){
        var tmpBuyConfig = Gm.config.getConfig("BuyCostConfig")
        var con = Gm.config.getVip().arenaBuyLimit - Gm.arenaData.hasBuyFightCount
        if (con > 0){
            Gm.ui.create("ArenaBuyFight",{
                maxNum:con,
                item:Gm.arenaData.getUsedItem(),
                dealFunc:function(destNums){
                    if (destNums > 0){
                        Gm.arenaNet.sendArenaBuyCount(destNums)
                    }
                },
                numFunc:function(destNums){
                    if (destNums == 0){
                        return [1001,0]
                    }
                    var tmpNums = Func.dealNumFunc(Gm.arenaData.hasBuyFightCount,destNums,"arenaBuyCountCost")
                    return [1001,tmpNums]
                },
            })
        }else{
            if (sender){
                Gm.floating(Ls.get(2037))
            }
        }
    },
    getSceneData:function(){
        return true
    },
});

