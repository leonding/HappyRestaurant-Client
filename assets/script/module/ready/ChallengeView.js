var BaseView = require("BaseView")
// ChallengeView
cc.Class({
    extends: BaseView,

    properties: {
        m_oItemScroll1:cc.ScrollView,
        m_oItemScroll2:cc.ScrollView,
        m_oItemScroll3:cc.ScrollView,

        m_oChanllengeLab:cc.Label,
        m_oBtLab:cc.Label,
        m_oTitleName:cc.Label,
        m_oBtn2:cc.Node
    },
    enableUpdateView:function(data){
        // Gm.userInfo.vipLevel = 1
        if (data){
            this.m_oData = data
            this.isElite = data.mapType == 2
            this.m_oBtn2.active = data.mapType ==1

            var self = this
            this.m_oTitleName.string = data.mapName
            var tmpDealScroll = function(node,items){
                for (let index = 0; index < items.length; index++) {
                    const v = items[index]
                    
                    var itemSp = Gm.ui.getNewItem(node)
                    itemSp.setData(v)
                }
            }
            Func.destroyChildren(this.m_oItemScroll1.content)
            Func.destroyChildren(this.m_oItemScroll2.content)
            if (this.isElite){
                this.m_oItemScroll1.node.parent.active = false
                var widget = this.m_oItemScroll2.node.parent.getComponent(cc.Widget)
                widget.top = 80
                widget.updateAlignment()
                tmpDealScroll(this.m_oItemScroll2.content,data.bossDropItems)
                tmpDealScroll(this.m_oItemScroll2.content,data.needDropItems)
            }else{
                this.m_oItemScroll1.node.parent.active = true
                var widget = this.m_oItemScroll2.node.parent.getComponent(cc.Widget)
                widget.top = 433
                widget.updateAlignment()
                tmpDealScroll(this.m_oItemScroll1.content,data.dropItems)
                tmpDealScroll(this.m_oItemScroll2.content,data.bossDropItems)
                tmpDealScroll(this.m_oItemScroll2.content,data.needDropItems)
            }
            this.updateNums()
            if (Gm.config.getVip().sweepBossOpen && this.m_oData.id != Gm.userInfo.getMaxMapId(this.isElite)){
                this.m_oBtLab.string = Ls.get(90001)
            }else{
                this.m_oBtLab.string = Ls.get(90002)
            }
        }
    },
    updateNums:function(){
        this.m_oChanllengeLab.string = Ls.get(90003)+ Gm.userInfo.getFightBossCount(this.isElite)
    },
    onAddsClick:function(){
        // console.log("Gm.userInfo.bossBuyCount===:",Gm.userInfo.bossBuyCount,Gm.config.getConst("boss_fight_init_num"))\
        var buyCount = Gm.userInfo.getBossBuyCount(this.isElite)
        var confCount = this.isElite?Gm.config.getVip().eliteBossLimit:Gm.config.getVip().bossCount
        var tmpMax = confCount - buyCount
        if (tmpMax <= 0){
            Gm.floating(Ls.get(90004))
            return
        }
        var self = this
        Gm.ui.create("ArenaBuyFight",{
            maxNum:tmpMax,
            dealFunc:function(destNums){
                if (destNums > 0){
                    Gm.battleNet.sendBuyBossFightCount(destNums,self.m_oData.mapType)
                }
            },
            numFunc:function(destNums){
                if (destNums == 0){
                    return [1001,0]
                }
                var tmpNums = Func.dealNumFunc(Gm.userInfo.bossBuyCount,destNums,"buyBossCost")
                return [1001,tmpNums]
            },
        })
    },
    onGuaJi:function(){
        var map = Gm.config.getMapById(this.m_oData.id)
        // if(Gm.userInfo.level < map.unlockLevel){
        //     Gm.floating(map.unlockLevel + "½âËø" )
        //     return
        // }
        if (this.m_oData.id != Gm.userInfo.mapId){
            Gm.battleNet.changeMap(this.m_oData.id)
        }else{
            Gm.floating(Ls.get(90006))
        }
    },
    onChallenge:function(){
        var map = Gm.config.getMapById(this.m_oData.id)
        if(Gm.userInfo.level < map.unlockLevel){
            Gm.floating(map.unlockLevel + Ls.get(90005) )
            return
        }
        var tmpMax = Gm.userInfo.getMaxMapId(this.isElite)
        var map = Gm.config.getMapById(tmpMax)
        if (map.nextMapId){
            if (Gm.userInfo.getFightBossCount(this.isElite) <= 0 && this.m_oData.id != tmpMax){
                Gm.floating(Ls.get(90007))
                return
            }
        }else{
            if (Gm.userInfo.getFightBossCount(this.isElite) <= 0){
                Gm.floating(Ls.get(90007))
                return
            }
        }
        if (Gm.config.getVip().sweepBossOpen && this.m_oData.id != Gm.userInfo.getMaxMapId(this.isElite)){
            Gm.battleNet.sendSweepBoss(this.m_oData.id)
        }else{
            Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_BOSS,map:this.m_oData.id})
        }
        this.onBack()
    },
});

