var BaseView = require("BaseView")
// ArenaView
cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab: cc.Prefab,
        m_oListBack:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        // 啊
        m_oHeadNode:cc.Node,
        m_oLvNmLab:cc.Label,
        m_oPmLab:cc.Label,
        m_oFightLab:cc.Label,
        m_oValueLab:cc.Label,
        m_oItemSpr:cc.Sprite,
        m_oItemNum:cc.Label,

        refLab:cc.Label,
        m_oTimeLab:cc.Label,
    },
    onLoad(){
        this._super()
        // Gm.red.add(this.m_oBtnRecover,"arena",1)
        this.addTimes()
    },
    enableUpdateView:function(args){
        if (args){
            var tmpHeroData = Gm.config.getHero(Gm.userInfo.head)
            // Func.getHeadWithParent(tmpHeroData.picture,this.m_oHeadNode)
            Func.newHead2(Gm.userInfo.head,this.m_oHeadNode)
            Gm.arenaNet.sendArenaInfo()
            var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:Gm.arenaData.getUsedItem()})
            Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oItemSpr)
            this.m_oItemNum.string = item.num
        }
    },
    updateTime:function(){
        if (this.m_iTime >= 0){
            this.m_iTime = Gm.arenaData.seasonRemain - (Gm.userData.getTime_m() - Gm.arenaData.getTime)/1000
            this.m_oTimeLab.string = Func.timeToTSFM(this.m_iTime)
        }
    },
    updateHero:function(){
        this.m_oLvNmLab.string = Ls.lv()+Gm.userInfo.level+"  "+Gm.userInfo.name
        this.m_oPmLab.string = Gm.arenaData.myRank || "???"
        this.m_oFightLab.string = Func.transNumStr(Gm.heroData.getFightByLineType(ConstPb.lineHero.LINE_DEFEND),true)
        this.m_oValueLab.string = Gm.arenaData.arenaPoint || "???"
        this.m_iTime = Gm.arenaData.seasonRemain - (Gm.userData.getTime_m() - Gm.arenaData.getTime)
        if (this.m_iTime > 0){
            this.updateTime()
            this.schedule(()=>{
                this.updateTime()
            },1)
        }
    },
    updateMidInfo:function(){
        this.m_oItemNum.string = Gm.bagData.getNum(Gm.arenaData.getUsedItem())
    },
    updateScroll:function(){
        if (this.node.active){
            Func.destroyChildren(this.scrollView.content)
            var allData = Gm.arenaData.getListData(0)
            Gm.ui.simpleScroll(this.scrollView,allData,function(tmpData,tmpIdx){
                var item = cc.instantiate(this.itemPerfab)
                this.scrollView.content.addChild(item)
                var tmpSpt = item.getComponent("ArenaCell")
                tmpSpt.setOwner(this,this.selectType,tmpData)
                return item
            }.bind(this))
        }
    },
    register:function(){
        this.events[Events.All_FIGHT_UPDATE]  = this.updateHero.bind(this)
    },
    updateList:function(){
        this.updateHero()
        this.updateMidInfo()
        this.updateScroll()
    },
    onCloseClick:function(){
        this.onBack()
    },
    onJJC:function(){
        // console.log("onJJC")
        Gm.ui.jump(90003)
    },
    onPHB:function(){
        // Gm.ui.jump(3000,ConstPb.rankType.RANK_ARENA)
        // Gm.arenaNet.sendRankInfo(ConstPb.rankType.RANK_ARENA)
        Gm.ui.jump(3001)
    },
    onExchange:function(){
        Gm.ui.create("ArenaAwardView",true)
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
    onJiLu:function(){
        Gm.ui.create("ArenaRecordView",true)
    },
    onTBZL:function(){
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_DEFEND})
    },
    onRefresh:function(){
        Gm.arenaNet.sendArenaRefresh()
    },
    onBack:function(){
        this._super()
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        var tmpTime = Gm.arenaData.getSurplusTime()
        if (tmpTime > 0){
            this.refLab.string = Func.timeToTSFM(tmpTime)
        }else{
            this.refLab.string = Ls.get(2039)
            // if (this.selectType == ARENA_JJC && tmpTime == 0){
            //     Gm.arenaData.nextRefreshTime = 0
            //     Gm.arenaNet.sendArenaInfo()
            // }
        }
    },
    onNewSkipBtn(){
        Gm.ui.jump(90003)
    },
    getSceneData:function(){
        return true
    },
});

