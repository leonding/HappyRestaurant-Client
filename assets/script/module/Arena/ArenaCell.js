// ArenaCell
const CELL_FIGHT = 0
const CELL_PHANG = 1
cc.Class({
    extends: cc.Component,

    properties: {
        m_oHeadNode:cc.Node,
        m_oLvNmLab:cc.Label,
        m_oFightLab:cc.Label,
        m_oGiftLab:cc.Label,
        m_oItemSpr:cc.Sprite,
        m_oItemNum:cc.Label,
        m_oMakeBtn:cc.Node,
    },
    setOwner:function(destOwner,destType,data,rankType){
        this.m_iType = destType
        this.m_oData = data
        this.rankType = rankType
        var tmpLevel = this.m_oData.level
        var tmpName = this.m_oData.name
        var tmpFight = this.m_oData.fightValue
        var tmpHead = this.m_oData.head
        if (this.m_oData.type == ConstPb.roleType.MONSTER){
            var tmpConfig = Gm.config.getArenaMon(data.playerId)
            tmpLevel = tmpConfig.level
            tmpName = tmpConfig.name
            tmpFight = tmpConfig.power
            tmpHead = tmpConfig.icon
        }
        this.m_oOwner = destOwner
        Func.newHead2(tmpHead,this.m_oHeadNode)
        this.m_oLvNmLab.string = Ls.lv()+tmpLevel+"  "+tmpName
        this.m_oFightLab.string = Func.transNumStr(tmpFight,true)
        this.m_oGiftLab.string = this.m_oData.arenaPoint || 0
        var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:Gm.arenaData.getUsedItem()})
        Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oItemSpr)
        if (Gm.arenaData.getFightNums()){
            this.m_oItemNum.string = Ls.get(20024)
        }else{
            this.m_oItemNum.string = "x1"
        }
    },
    hideBtn:function(){
        this.m_oMakeBtn.active = false
    },
    onCellClick:function(){
        Gm.audio.playEffect("music/06_page_tap")
        if (!Gm.arenaData.getFightNums()){
            var nums = Gm.bagData.getNum(Gm.arenaData.getUsedItem())
            if (!nums){
                Gm.floating(Ls.get(2011))
                this.m_oOwner.onAdds()
                return
            }
        }
        var isRobot = 0
        if (this.m_oData.type == ConstPb.roleType.MONSTER){
            isRobot = 1
        }
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_PVP,isRobot:isRobot,playerId:this.m_oData.playerId})
    },
    onHeadClick:function(){
        if (this.m_oData.playerId == Gm.userInfo.id){
            return
        }
        // if(this.isArena()){//竞技场
            if (this.m_oData.type != ConstPb.roleType.MONSTER){
                Gm.ui.create("ArenaInfoBox",{player:this.m_oData,enterName:"ArenaView"})
            }else{
                Gm.floating(Ls.get(2012))
            }
        // }else{//排行
        //     Gm.ui.create("ArenaInfoBox",{player:this.m_oData,enterName:"RankView"})
        // }
    },
});

