// ArenaRecordCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oMakeBtn:cc.Node,
        m_oHeadNode:cc.Node,
        m_oLvNmLab:cc.Label,
        m_oTimeLab:cc.Label,
        m_oFightLab:cc.Label,
        m_oFightBtn:cc.Node,
        m_oItemSpr:cc.Sprite,
        m_oItemNum:cc.Label,
        m_oVictoryIcon:cc.Sprite,
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        var c0 = "#00ff00"
        var c1 = "#0fffff"
        var c2 = "#FF2F13"
        this.m_oData = data
        // var self = this
        // var getHead = function(baseId){
        //     if (baseId){
        //         if (typeof(baseId) == "string"){
        //             Func.getHeadWithParent(baseId,self.m_oHeadNode)
        //         }else{
        //             var tmpConfig = Gm.config.getHero(baseId)
        //             if (tmpConfig){
        //                 Func.getHeadWithParent(tmpConfig.picture,self.m_oHeadNode)
        //             }else{
        //                 Func.getHeadWithParent("tx_1",self.m_oHeadNode)
        //             }
        //         }
        //     }
        // }
        var tmpTime = Func.timeToJSBX(Math.floor((Gm.userData.getTime_m() - data.fightTime)/1000))
        // var tmpTime = Func.dateFtt("yyyy-MM-dd hh:mm:ss",new Date(data.fightTime))
        this.m_oTimeLab.string = tmpTime
        // var tmpContent = ""
        var tmpFight = 0
        var tmpWinLose = 0
        if (data.attackId == Gm.userInfo.id){
            this.m_iEnemyId = data.defendId
            Func.newHead2(data.defendHead,this.m_oHeadNode)
            this.m_oLvNmLab.string = data.defendName
            tmpFight = 1
            tmpWinLose = data.fightResult
        }else{
            this.m_iEnemyId = data.attackId
            Func.newHead2(data.attackHead,this.m_oHeadNode)
            this.m_oLvNmLab.string = data.attackName
            tmpFight = 0
            tmpWinLose = 1 - data.fightResult
        }
        if (tmpWinLose){
            this.m_oFightBtn.active = false
            this.m_oVictoryIcon.node.active = true
        }else{
            this.m_oFightBtn.active = true
            this.m_oVictoryIcon.node.active = false
            var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:Gm.arenaData.getUsedItem()})
            Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oItemSpr)
            if (Gm.arenaData.getFightNums()){
                this.m_oItemNum.string = Ls.get(20024)
            }else{
                this.m_oItemNum.string = "x1"
            }
        }
        this.m_oFightLab.string = data.score > 0?"+"+data.score:data.score
    },
    updateFight:function(destTime){
        if (this.m_oFightBtn.active){
            this.m_oFightBtn.active = this.m_oData.fightTime == destTime
        }
    },
    onLookClick:function(){
        Gm.audio.playEffect("music/06_page_tap")
        Gm.arenaNet.sendbattleRecordView(3,this.m_oData.recordId)
    },
    onFightBack:function(){
        if (!Gm.arenaData.getFightNums()){
            var nums = Gm.bagData.getNum(Gm.arenaData.getUsedItem())
            if (!nums){
                Gm.floating(Ls.get(2011))
                this.m_oOwner.onAdds()
                return
            }
        }
        Gm.audio.playEffect("music/06_page_tap")
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_PVP,
                                      isRobot:this.m_oData.isRobot,
                                      playerId:this.m_iEnemyId})
    },
});

