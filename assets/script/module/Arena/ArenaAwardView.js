var BaseView = require("BaseView")
// ArenaAwardView
const AWARD_EVERY = 0
const AWARD_MATCH = 1

const titleLab = [60017,7029]

cc.Class({
    extends: BaseView,
    properties: {
        itemPerfab:cc.Prefab,
        m_oRankLab:cc.Label,
        m_oSelfNod:cc.Node,
        m_oTimeTitle:cc.Label,
        m_oTimeLab:cc.Label,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        m_tFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        m_oBtnNode:{
            default: [],
            type: cc.Node,
        },
    },
    onLoad(){
        this.popupUIData = {title:2047}
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.everyTime = Func.dealConfigTime(Gm.config.getConst("arena_reward_time"))/1000
            // Gm.audio.playEffect("music/02_popup_open")
            this.m_tList = []

            var tmpConfig = Gm.config.getArenaReward()

            Gm.ui.simpleScroll(this.scrollView,tmpConfig,function(tmpData,tmpIdx){
                var item = cc.instantiate(this.itemPerfab)
                this.scrollView.content.addChild(item)
                var tmpSpt = item.getComponent("ArenaAwardCell")
                tmpSpt.setOwner(this,tmpData,tmpIdx)
                tmpSpt.updateList(this.selectType)
                this.m_tList.push(tmpSpt)
                return item
            }.bind(this))

            var selfRank = Gm.arenaData.myRank || 0
            var item = cc.instantiate(this.itemPerfab)
            item.y = -10
            this.m_oSelfNod.addChild(item)
            this.m_oSelfItem = item.getComponent("ArenaAwardCell")
            for(const i in tmpConfig){
                if (selfRank >= tmpConfig[i].minRank && selfRank <= tmpConfig[i].maxRank){
                    this.m_oSelfItem.setOwner(this,tmpConfig[i],0)
                    this.m_oSelfItem.updateList(this.selectType)
                }
            }
            this.m_oSelfItem.m_oRankLab.string = selfRank || Ls.get(800026)
            this.m_oRankLab.string = Ls.get(1121) + (selfRank || Ls.get(800026))
            this.select(AWARD_EVERY)
            this.schedule(()=>{
                this.updateTime()
            },1)
        }
    },
    updateTime:function(){
        if (this.m_iTime >= 0){
            if (this.selectType == AWARD_EVERY){
                this.m_iTime = this.everyTime - Gm.userData.getTime_m()/1000
            }else{
                this.m_iTime = Gm.arenaData.seasonRemain - (Gm.userData.getTime_m() - Gm.arenaData.getTime)/1000
            }
            this.m_oTimeLab.string = Func.timeToTSFM(this.m_iTime)
        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            this.m_oTimeTitle.string = Ls.get(titleLab[type])
            if (type == AWARD_EVERY){
                this.m_iTime = this.everyTime - Gm.userData.getTime_m()/1000
            }else{
                this.m_iTime = Gm.arenaData.seasonRemain - (Gm.userData.getTime_m() - Gm.arenaData.getTime)/1000
            }
            this.updateTime()
            Gm.audio.playEffect("music/06_page_tap")
            for(const i in this.m_oBtnNode){
                var spr = this.m_oBtnNode[i].getChildByName("selectSpr")
                var lab = this.m_oBtnNode[i].getChildByName("lab").getComponent(cc.Label)
                if (checkint(i) == this.selectType){
                    spr.active = true
                    this.popupUI.setTitle(lab.string)
                }else{
                    spr.active = false
                }
            }
            this.updateList()
        }
    },
    updateList:function(){
        for(const i in this.m_tList){
            this.m_tList[i].updateList(this.selectType)
        }
        this.m_oSelfItem.updateList(this.selectType)
    },
    getFrame:function(destValue){
        return this.m_tFrame[destValue]
    },
    onEveryDay:function(){
        this.select(AWARD_EVERY)
    },
    onMatch:function(){
        this.select(AWARD_MATCH)
    },
});

