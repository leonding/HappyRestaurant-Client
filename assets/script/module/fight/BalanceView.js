var BaseView = require("BaseView")
const PP = "<color=#ffffff>%s</c><color=#00ff00>(+%s)</c>"
const QQ = "<color=#ffffff>%s</c><color=#ff0000>(%s)</c>"
const TYPE_CHANGE = {
    3:2,
    4:2,
    13:7,
    14:5,
    17:-1,
}
// BalanceView
cc.Class({
    extends: BaseView,

    properties: {
        //失败
        m_oLoseNode:cc.Node,
        m_oLoseArena:cc.Node,
        m_oFingerFab:cc.Prefab,

        //胜利
        m_oVectNode:cc.Node,
        m_oUnionLab:cc.Label,
        m_oListScroll:cc.ScrollView,
        m_oVectArena:cc.Node,
        m_oVectArenRank:cc.Node,
        m_oVectArenOwn:cc.Node,
        m_oVectArenHim:cc.Node,
        m_oMissList:cc.Node,
        m_oMissItem:cc.Node,
        
        m_oBtnNext:cc.Node,
        m_oBattleBtn:cc.Node,

        tipsLab:cc.Label,

        loseHelpNode:cc.Node,
        loseHelpTitle:cc.Node,

        dungeonNode:cc.Node,
        dungeonItem:{
            default: [],
            type: cc.Node,
        },
        star1:cc.SpriteFrame,
        star2:cc.SpriteFrame,

        m_oChessScroll:cc.ScrollView,
        chessItem:cc.Prefab,

        m_oTipsLab:cc.Node,

        battleScoreItem:cc.Node,

        worldNode:cc.Node,

        //ore
        oreNode:cc.Node,
        oreTitleLabel:cc.Label,
        oreHeadNode:cc.Node,
        oreScoresNode:{
            default:[],
            type:cc.Node
        },

        //hegemony
        hegemonyNode:cc.Node,
        hegemonyBgSprite:cc.Sprite,
        hegemonyMsgLab:cc.Label,
    },

    onLoad () {
        this._super()
    },
    dealListNode:function(node,str1,str2){
        var lab1 = node.getChildByName("lab1").getComponent(cc.Label)
        lab1.string = str1
        var lab2 = node.getChildByName("lab2").getComponent(cc.Label)
        lab2.string = str2
    },
    updateArena:function(){
        if (this.m_oData.type == ConstPb.battleType.BATTLE_PVP_ARENA){
            var show = []
            for(const i in Gm.arenaData.m_iOwnScore.reward){
                const v = Gm.arenaData.m_iOwnScore.reward[i]
                if (v.itemType == ConstPb.itemType.PLAYER_ATTR){
                    show.push({itemType:ConstPb.itemType.TOOL,count:v.count,baseId:v.baseId})
                }else{
                    show.push(v)
                }
            }
            if (show.length > 0){
                Gm.receive(show)
            }
            if (this.m_oData.fightResult){
                this.m_oVectArena.active = true
                this.dealListNode(this.m_oVectArenRank,Gm.arenaData.m_iOwnScore.ownRank,Gm.arenaData.myRank - Gm.arenaData.m_iOwnScore.ownRank)
                var tmpLevel = Gm.arenaData.m_oOwnPerson.level || "???"
                var tmpName = Gm.arenaData.m_oOwnPerson.name
                var tmpHead = Gm.arenaData.m_oOwnPerson.head
                if (Gm.arenaData.m_oOwnPerson.type == ConstPb.roleType.MONSTER){
                    var tmpConfig = Gm.config.getArenaMon(Gm.arenaData.m_oOwnPerson.playerId)
                    if (tmpConfig){
                        tmpLevel = tmpConfig.level
                        tmpName = tmpConfig.name
                        tmpHead = tmpConfig.icon
                    }else{
                        tmpLevel = "???"
                        tmpName = "???"
                        tmpHead = 1302
                    }
                }
                Func.newHead2(tmpHead,this.m_oVectArenHim.getChildByName("head"))
                // var itemHim = Gm.ui.getNewItem(this.m_oVectArenHim.getChildByName("head"))
                // itemHim.setMaxHeight()
                // itemHim.updateHero({baseId:tmpHead})
                this.m_oVectArenHim.getChildByName("name").getComponent(cc.Label).string = tmpName
                this.m_oVectArenHim.getChildByName("paiming").getChildByName("fen").getComponent(cc.RichText).string = cc.js.formatStr(QQ,Gm.arenaData.m_iOwnScore.tarPoint,Gm.arenaData.m_iOwnScore.tarScore)


                Func.newHead2(Gm.userInfo.head,this.m_oVectArenOwn.getChildByName("head"))
                // var itemOwn = Gm.ui.getNewItem(this.m_oVectArenOwn.getChildByName("head"))
                // itemOwn.setMaxHeight()
                // itemOwn.updateHero({baseId:Gm.userInfo.head})
                this.m_oVectArenOwn.getChildByName("name").getComponent(cc.Label).string = Gm.userInfo.name
                this.m_oVectArenOwn.getChildByName("paiming").getChildByName("fen").getComponent(cc.RichText).string = cc.js.formatStr(PP,Gm.arenaData.m_iOwnScore.ownPoint,Gm.arenaData.m_iOwnScore.ownScore)
            }else{
                this.m_oLoseArena.active = true
                this.dealListNode(this.m_oLoseArena.getChildByName("paiming"),Gm.arenaData.m_iOwnScore.ownRank,Gm.arenaData.myRank - Gm.arenaData.m_iOwnScore.ownRank)
                this.dealListNode(this.m_oLoseArena.getChildByName("fenshu"),Gm.arenaData.m_iOwnScore.ownPoint,Gm.arenaData.m_iOwnScore.ownScore)
            }
        }
    },
    updateFinger:function(){
        if (Gm.guideData.checkTime(400,"battle_lose_guide_pass")){
            if (this.m_oFinger){
                this.m_oFinger.active = true
            }else{
                var node = this.loseHelpNode.getChildByName("0")
                this.m_oFinger = cc.instantiate(this.m_oFingerFab)
                this.loseHelpNode.addChild(this.m_oFinger)
                this.m_oFinger.x = node.x + node.width/3
                this.m_oFinger.y = node.y
            }
        }else{
            if (this.m_oFinger){
                this.m_oFinger.active = false
            }
        }
    },
    updateBattle:function(){
        Gm.showLevelUp()
        if (this.m_oData.openTowerBox){
            Gm.ui.create("TowerBoxView")
        }
        if (this.m_oData.fightResult){
            Gm.audio.playEffect("music/28_battle_win")
            if (this.m_oData.type == ConstPb.battleType.BATTLE_PVE_BOSS){
                this.m_oBtnNext.active = true
                var tmpNew = Gm.config.getMapById(Gm.userInfo.maxMapId)
                if (tmpNew && tmpNew.nextMapId){
                    var tmpOld = Gm.config.getMapById(tmpNew.nextMapId)
                }
                if (tmpOld && tmpNew && tmpOld.chapter != tmpNew.chapter){
                    Gm.userData.m_bChapter = true
                    this.m_oBtnNext.getChildByName("New Label").getComponent(cc.Label).string = Ls.get(6031)
                }else{
                    this.m_oBtnNext.getChildByName("New Label").getComponent(cc.Label).string = Ls.get(6030)
                }
            }else{
                this.m_oBtnNext.active = false
            }
            //副本奖励
            // if (this.m_oData.type == ConstPb.battleType.BATTLE_DUNGEON_ONE){
            //     var list = []
            //     var dungeonConf = Gm.config.getDungeonInfo(Gm.dungeonData.battleData.dungeonId,Gm.dungeonData.battleData.mode)
            //     for (let j = 0; j < dungeonConf.oneReward.length; j++) {
            //         const vj = dungeonConf.oneReward[j];
            //         list.push({itemType:vj.type,baseId:vj.id,itemCount:vj.num})
            //     }
            //     this.m_oData.award = {drop:{item:list}}
            // }
            // //拼图奖励
            // if (this.m_oData.type == ConstPb.battleType.BATTLE_PICTURE){
            //     var list = []
            //     var mapConf = Gm.config.getPicturePuzzle(this.m_oData.currentMapId)

            //     var eventId
            //     if(mapConf.eventGroup[this.m_oData.stageId]){
            //         eventId = mapConf.eventGroup[this.m_oData.stageId].id
            //     }else{
            //         eventId = mapConf.endEvent
            //     }
            //     var eventGroupConf = Gm.config.getPictureEventGroup(eventId)
            //     for (let j = 0; j < eventGroupConf.eventReward.length; j++) {
            //         const vj = eventGroupConf.eventReward[j];
            //         list.push({itemType:vj.type,baseId:vj.id,itemCount:vj.num})
            //     }
            //     this.m_oData.award = {drop:{item:list}}
            // }
            this.m_oVectNode.active = true
            Func.destroyChildren(this.m_oListScroll.content)
            if(this.m_oData.type == ConstPb.battleType.BATTLE_GVE){
                 if(this.m_oData.battleScore){
                      var itemBase = Gm.ui.getNewItem(this.m_oListScroll.content)
                     itemBase.node.scale = 0.85
                    itemBase.setData(this.m_oData.battleScore)
                }
            }
           
            var hasHero = 0
            if (this.m_oData.award){
                for(const i in this.m_oData.award.drop.item){
                    const v = this.m_oData.award.drop.item[i]
                    var itemBase = Gm.ui.getNewItem(this.m_oListScroll.content)
                    itemBase.setData(v)
                    if (v.itemType == ConstPb.itemType.HERO_CARD){
                        hasHero = v.baseId
                    }
                }
            }
            if (hasHero){
                Gm.ui.create("UnLockHero",{qualityId:hasHero})
            }
        }else{
            Gm.audio.playEffect("music/29_battle_failure")
            this.m_oLoseNode.active = true
            if (this.m_oData.type == ConstPb.battleType.BATTLE_PVE_BOSS){
                this.updateFinger()
            }
        }

        
    },
    updateUnion:function(){
        this.m_oUnionLab.string = " "
        if (this.m_oData.type == ConstPb.battleType.BATTLE_ALLIANCE_BOSS){
            this.m_oUnionLab.string = cc.js.formatStr(Ls.get(5325),this.m_oData.hurt)
        }
    },
    updateDungeon(){
        if (this.m_oData.type == ConstPb.battleType.BATTLE_DUNGEON_ONE){
            this.m_oListScroll.node.y = -256
            this.dungeonNode.active = true
            this.loseHelpNode.active = false
            Func.destroyChildren(this.m_oMissList)

            var dungeonConf = Gm.config.getDungeonInfo(Gm.dungeonData.battleData.dungeonId,Gm.dungeonData.battleData.mode)
            var dataMode = Gm.dungeonData.getDataByMode(Gm.dungeonData.battleData.dungeonId,Gm.dungeonData.battleData.mode)

            this.m_oBtnNext.active = true
            if (this.m_oData.fightResult){
                this.m_oBtnNext.active = Gm.dungeonData.isUnlock(Gm.dungeonData.battleData.dungeonId,Gm.dungeonData.battleData.mode+1)
            }

            for (let index = 0; index < dungeonConf.star.length; index++) {
                const v = dungeonConf.star[index];

                var starIcon = this.dungeonItem[index].getChildByName("starIcon").getComponent(cc.Sprite)
                cc.log(dataMode,v)
                if (dataMode && v.type == dataMode.star[index]){
                    starIcon.spriteFrame = this.star2
                }else{
                    starIcon.spriteFrame = this.star1
                }
    
                var value = v.num
                if (v.type == 6){//特殊处理，武将职业
                    value = Gm.config.getJobType(value).childTypeName
                }else if (v.type == 7){//特殊处理,光环
                    value = Gm.config.getBattleAuraById(value).aruaInfo
                }
                var labStr = cc.js.formatStr(Gm.config.getDungeonType(v.type).childTypeName,value)
                var lab = this.dungeonItem[index].getChildByName("lab").getComponent(cc.Label)
                lab.string = labStr
            }
        }
    },
    updatePicture(){
        if (this.m_oData.type == ConstPb.battleType.BATTLE_PICTURE){
            Func.destroyChildren(this.m_oMissList)
            if (this.m_oData.chessInfo){
                this.m_oChessScroll.node.active = true
                Gm.pictureData.addChessItem(this.m_oData.chessInfo,this.m_oData.currentMapId,this.m_oData.treasure)
                // for (let index = 0; index < this.m_oData.chessInfo.length; index++) {
                    // const v = this.m_oData.chessInfo[index];
                    var item = cc.instantiate(this.chessItem)
                    item.active = true
                    item.scale = 1
                    this.m_oChessScroll.content.addChild(item)
                    var itemSp = item.getComponent("PictureChessItem")
                    itemSp.setData(this.m_oData.chessInfo,this,this.m_oData.treasure)
                // }
            }
        }
    },
    updateWorldBoss(){
        if (this.m_oData.type == ConstPb.battleType.BATTLE_WORLD){

            Func.destroyChildren(this.m_oMissList)
                
            this.m_oListScroll.node.active = false
            this.worldNode.active = true

            var unionNode = this.worldNode.getChildByName("unionNode")
            var playerNode = this.worldNode.getChildByName("playerNode")


            var destFunc = function(node,score,lastScore,isRank){
                var numLab = node.getChildByName("numLab")
                numLab.getComponent(cc.Label).string = score
                if (isRank && score == 10000){
                    numLab.getComponent(cc.Label).string = Ls.get(7100011)
                }

                var arrowStr
                if (score > lastScore){
                    arrowStr = "Settlement_bg_up"
                }else if (score < lastScore){
                    arrowStr = "Settlement_bg_down"
                }
                if (isRank){
                    if (score == 10000){
                        numLab.getComponent(cc.Label).string = Ls.get(7100011)    
                    }
                    if (score > lastScore){
                        arrowStr = "Settlement_bg_down"
                    }else if (score < lastScore){
                        arrowStr = "Settlement_bg_up"
                    }
                }
                var arrowIcon = node.getChildByName("arrowIcon")
                arrowIcon.active = false
                if (arrowStr){
                    arrowIcon.active = true
                    node.getChildByName("numLab").on("size-changed",()=>{
                        arrowIcon.x = numLab.x + numLab.width + 20
                    })
                    Gm.load.loadSpriteFrame("img/Settlement/" + arrowStr,(spf,icon)=>{
                        icon.spriteFrame = spf
                    },arrowIcon.getComponent(cc.Sprite))
                }
            }
            //numLab,arrowIcon

            destFunc(unionNode,this.m_oData.nowRank,this.m_oData.lastRank,true)
            destFunc(playerNode,this.m_oData.nowScore,this.m_oData.lastScore)

            
        }
    },
    updateOre(){
         if (this.m_oData.type == ConstPb.battleType.BATTLE_ORE){
             this.m_oBattleBtn.active = false
             this.m_oMissList.active = false
             this.m_oListScroll.node.active = false
             this.loseHelpNode.active = false
             this.loseHelpTitle.active = false

             this.oreNode.active = true
             this.oreTitleLabel.string = this.m_oData.oreData.titleName
             if(this.m_oData.oreData.head){
                 Func.newHead2(this.m_oData.oreData.head,this.oreHeadNode)
             }
            for(var i=0;i<this.m_oData.oreData.scores.length;i++){
                this.setOreScore(this.oreScoresNode[i],this.m_oData.oreData.scores[i])
            }
         }
    },
    updateBossTrial(){
        if (this.m_oData.type == ConstPb.battleType.ZHENFA_BOSS){
            this.m_oBattleBtn.active = false
         }
    },
    updateAllianceWar(){
        if(this.m_oData.type == ConstPb.battleType.BATTLE_ALLIANCE_WAR || this.m_oData.type == ConstPb.battleType.BATTLE_MONSTER_WAR){
            this.m_oBattleBtn.active = false
            this.loseHelpNode.active = false
            this.loseHelpTitle.active = false
            this.m_oMissList.active = false
            this.hegemonyNode.active = true
            this.m_oListScroll.node.active = false
            var picName = "gh_img_sb"
            var str =  Ls.get(7110124)
            var color = new cc.Color(0,0,0)
            if(this.m_oData.fightResult == 1){
                picName = "gh_img_sl"
                str =   Ls.get(7110123)
                color = new cc.Color(150,50,0)
            }
            Gm.load.loadSpriteFrame("/img/league/ghzbZS/" + picName,function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.hegemonyBgSprite)
            if(this.m_oData.type == ConstPb.battleType.BATTLE_ALLIANCE_WAR){
                this.hegemonyMsgLab.string =  cc.js.formatStr(Ls.get(str),this.m_oData.hegemonyData.atkpidname)
            }
            else{
                 this.hegemonyMsgLab.string = this.m_oData.hegemonyData.clearMsg
            }
            this.hegemonyMsgLab.node.getComponent(cc.LabelOutline).color = color
        }
    },
    setOreScore(item,scores){
        var label1 = item.getChildByName("node").getChildByName("label1").getComponent(cc.Label)
        var label3 = item.getChildByName("label3").getComponent(cc.Label)
        label1.string = scores.num
        if(!this.m_oData.oreData.isRecord){
            label3.string = OreFunc.getNumShowStr(scores.add)
            label3.node.color = OreFunc.getNumShowStrColor(scores.add)
            item.getChildByName("sprite").active = scores.add > 0
        }
        else{
            label3.node.active = false
            item.getChildByName("sprite").active = false
        }
    },
    getMissionType:function(){
        if (TYPE_CHANGE[this.m_oData.type]){
            return TYPE_CHANGE[this.m_oData.type]
        }else{
            return 1
        }
    },
    updateMission:function(){
        if (this.m_oData.fightResult){
            if (this.m_oData.type == ConstPb.battleType.ZHENFA_BOSS){
                this.m_oMissList.active = false
                return
            }
            var tmpMission = Gm.missionData.getMisByBalance(this.getMissionType())
            for(const i in tmpMission){
                var item = cc.instantiate(this.m_oMissItem)
                item.active = true
                this.m_oMissList.addChild(item)
                var lab = item.getChildByName("lab")
                var dui = item.getChildByName("dui")
                var tmpNeed = checkint(tmpMission[i].data.rate)
                var tmpCount = checkint(tmpMission[i].rate)
                lab.getComponent(cc.Label).string = "("+tmpCount+"/"+tmpNeed+") "+tmpMission[i].data.desc
                if (tmpCount >= tmpNeed){
                    lab.color = cc.color(0,255,0)
                    dui.active = true
                }else{
                    lab.color = cc.color(255,255,255)
                    dui.active = false
                }
            }
        }
    },
    onEnable(){
        Func.destroyChildren(this.m_oMissList)
        this.m_oLoseArena.active = false
        this.m_oVectArena.active = false
        this.m_oLoseNode.active = false
        this.m_oVectNode.active = false
        this._super()
    },
    enableUpdateView:function(destData){
        if (destData){
            this.m_oData = destData
            if(this.m_oData.rfightResult != undefined){
                this.m_oData.fightResult = this.m_oData.rfightResult
            }
            this.updateBattle()
            this.updateArena()
            this.updateUnion()
            this.updateMission()
            this.updateDungeon()
            this.updatePicture()
            this.updateWorldBoss()
            this.updateOre()
            this.updateBossTrial()
            this.updateAllianceWar()
        }
    },
    onScreenClick:function(){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        if (this.m_oData){
            if (this.m_oData.type == ConstPb.battleType.BATTLE_PVE_BOSS){
                Gm.send(Events.OPEN_APPRAISALK)
                Gm.getLogic("FirstPayLogic").checkPopView()
                Gm.send(Events.CEHCK_OPENP_ANNIVER_VIEW,{type:ConstPb.EventOpenType.EVENTOP_LOGIN_SIGN})
                Gm.send(Events.CEHCK_OPENP_ANNIVER_VIEW,{type:ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN})
            }
        }
        if (Gm.userData.m_bChapter){
            Gm.scene.pushData("UnlockChapter",true)
        }
        Gm.scene.leaveBattle()
    },
    onTeamClick:function(){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        if (this.m_oData){
            if (this.m_oData.type == ConstPb.battleType.BATTLE_PVE_BOSS){
                this.onAgainClick()
            }
        }
        Gm.scene.leaveBattle()
    },
    onLevelUp:function(){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        Gm.scene.loseBattle(1)
        Gm.scene.leaveBattle()
    },
    onEquipUp:function(){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        Gm.scene.loseBattle(1)
        Gm.scene.leaveBattle()
    },
    onChallenge:function(destId){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        if (Gm.userInfo.checkChallenge(destId)){
            Gm.scene.pushData("FightTeamView",{type:ConstPb.lineHero.LINE_BOSS,map:destId})
        }
        Gm.scene.leaveBattle()
    },
    onAgainClick:function(){
        // Gm.ui.removeByName("BattleView")
        // Gm.ui.removeByName("BalanceView")
        if (Gm.battleData.m_oLocalTeam){
            Gm.scene.pushData("FightTeamView",Gm.battleData.m_oLocalTeam)
            Gm.scene.leaveBattle()
        }else{
            Gm.scene.loseBattle(0)
        }
    },
    onNextClick:function(){
        if (this.m_oData.type == ConstPb.battleType.BATTLE_DUNGEON_ONE){
            var mode = Gm.dungeonData.battleData.mode
            if (this.m_oData.fightResult){
                mode = mode + 1
            }
            Gm.scene.pushData("FightTeamView",{type:ConstPb.lineHero.LINE_DUNGEON,
                dungeonType:1,dungeonId:Gm.dungeonData.battleData.dungeonId,mode:mode})
            Gm.scene.leaveBattle()
        }else{
            if (Gm.userData.m_bChapter){
                this.onScreenClick()
            }else{
                this.onChallenge(Gm.userInfo.getMaxMapId())
            }
        }
    },
    getClick:function(destName){
        if (destName == "m_oTipsLab"){
            return "onScreenClick"
        }
    },
    onStatisticClick(){
        cc.log(this.m_oData)
        Gm.ui.create("BalanceStatisticView",this.m_oData)
    },
    onDestroy(){
        this._super()
        setTimeout(() => {
            if(Gm.ui.isExist("SportsModelSelectView")){
                 Gm.ui.getScript("SportsModelSelectView").checkShowNewChapter()
            }
        }, 2000);
    }
});

