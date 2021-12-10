var BaseView = require("BaseView")

const zList = [4,1,3,0,5,2]
// FightTeamView
cc.Class({
    extends: BaseView,

    properties: {
        m_oFingerFab:cc.Prefab,
        m_oFirstNode:cc.Node,
        //m_oTopNode
        m_oLightNod1:cc.Node,
        m_oFightLab:cc.Label,
        m_oEnemyLab:cc.Label,
        m_oLightNod2:cc.Node,
        m_oFightLab2:cc.Label,
        m_oLevelLab:cc.Label,

        //m_oMidNode
        m_oMidNode:cc.Node,
        m_oFightPerfab:cc.Prefab,
        m_tHeroNode:{
            default: [],
            type: cc.Node,
        },
        m_tEnemyNode:{
            default: [],
            type: cc.Node,
        },
        needLab:cc.RichText,

        //m_oBotNode
        m_oListScroll:cc.ScrollView,
        m_oFilterPerfab:cc.Prefab,
        m_oFilterNode:cc.Node,
        m_oBtnHelp:cc.Node,

        //克制界面
        m_oRingNod:cc.Node,

        FightHeroCellBar:cc.Node,//拼图上阵加个血条
        chessBtn:cc.Node,

        // 羁绊
        m_oYokeTips:cc.Node,
        m_oYokeSprUp:cc.Node,
        m_oYokeSprDown:cc.Node,
        m_oYokeInfo:cc.Label,
        m_oYokeList:cc.Node,
        m_oYokeDown:cc.Node,
        m_oYokeUp:cc.Node,
        m_oYokeLab:cc.Label,
        m_oHeroFab:cc.Node,
        m_oOpenTip:cc.Node,

        //guide
        m_oSelet1:cc.Node,
        m_oSelet2:cc.Node,
        m_oSelet3:cc.Node,
        m_oFightBtn:cc.Node,
        guideMove:cc.Node,
        //guide
        m_oBlankTipNode:cc.Node,//空白页提示               
    },
    reHeroIdx:function(isGuide){
        var len = this.m_tHeroNode.length
        
        for(var i = 0;i < len;i++){
            if (isGuide){
                if (i == 1 || i == 3){
                    this.m_tHeroNode[i].zIndex = cc.macro.MAX_ZINDEX
                }else{
                    this.m_tHeroNode[i].zIndex = cc.macro.MAX_ZINDEX - len - 2 + i
                }
            }else{
                this.m_tHeroNode[zList[i]].zIndex = i
            }
        }
        if (isGuide){
            this.guideMove.zIndex = cc.macro.MAX_ZINDEX - 1
            this.guideMove.opacity = isGuide
        }else{
            this.guideMove.opacity = 0
        }
    },
    onLoad:function(){
        this._super()
        this.preLoadData()
        var self = this
        this.m_oYokeIds = {}
        this.m_oMidNode.on(cc.Node.EventType.TOUCH_START,function  (event) {
            self.touchBegan(event)
        })
        this.m_oMidNode.on(cc.Node.EventType.TOUCH_MOVE,function  (event) {
            self.touchMove(event)
        })
        this.m_oMidNode.on(cc.Node.EventType.TOUCH_END,function  (event) {
            self.touchEnd(event)
        })
        this.m_oMidNode.on(cc.Node.EventType.TOUCH_CANCEL,function  (event) {
            self.touchEnd(event)
        })
        this.m_iTouchIdx = -1

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)
        this.m_oFilterNode.on("size-changed",()=>{
            this.m_oBtnHelp.x = - this.m_oBtnHelp.width/2 - (this.m_oFilterNode.width)*this.m_oFilterNode.scale/2
        },this)

        this.m_oLitAni1 = this.m_oLightNod1.getComponent(cc.Animation)
        this.m_oLitAni1.on('finished',function(name,sender){
            this.m_oLitAni1.play("FightTeamView_Loop")
            var part = this.m_oLightNod1.getChildByName("kuang3").getComponent(cc.ParticleSystem)
            part.resetSystem()
        }.bind(this))
        this.m_oLitAni2 = this.m_oLightNod2.getComponent(cc.Animation)

        this.m_tYokeAll = YokeFunc.calculationYokeAll()
    },
    preLoadData:function(){
        if (this.openData){
            var map = null
            this.m_tPreEnemy = []
            this.m_oLevelLab.string = ""
            if (this.openData.type == ConstPb.lineHero.LINE_BOSS){
                this.m_tPreEnemy = Gm.config.getMonsterByMap(this.openData.map)
                map = Gm.config.getMapById(this.openData.map)
                this.m_oLevelLab.string = Ls.get(90013)+":"+map.mapName
            }else if(this.openData.type == ConstPb.lineHero.LINE_PVP){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_PVP_ARENA,1)
                if (this.openData.isRobot){
                    var tmpTb = Gm.config.getArenaMon(this.openData.playerId).monsterIds
                    for(const i in tmpTb){
                        this.m_tPreEnemy.push(Gm.config.getMonster(tmpTb[i]))
                    }
                }else{
                    Gm.heroNet.getLineHero(ConstPb.lineHero.LINE_DEFEND,this.openData.playerId,true)
                }
            }else if(this.isTowerType(this.openData.type)){
                var tmpTower = Gm.config.getTower(this.openData.towerId)
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_TOWER,tmpTower.group)
                for(const i in tmpTower.monsterIds){
                    this.m_tPreEnemy.push(Gm.config.getMonster(tmpTower.monsterIds[i]))
                }
            }else if(this.openData.type == ConstPb.lineHero.LINE_DUNGEON){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_DUNGEON_ONE,0)
                var tmpDungeon = Gm.config.getDungeonMonster(this.openData.dungeonId,this.openData.mode)
                for(const i in tmpDungeon.monsterIds){
                    this.m_tPreEnemy.push(Gm.config.getMonster(tmpDungeon.monsterIds[i].id))
                }
            }else if (this.openData.type == ConstPb.lineHero.ALLIANCE_BOSS){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_ALLIANCE_BOSS,0)
                var monsterGroup = Gm.config.getUnionBoss(Gm.unionData.bossInfo.level).monsterGroup[0]
                var bossGroupConf = Gm.config.getUnionBossGroup(monsterGroup.id)
                for (var i = 0; i < bossGroupConf.monsterId.length; i++) {
                    this.m_tPreEnemy.push(Gm.config.getMonster(bossGroupConf.monsterId[i].id))
                }
            }else if (this.isPicture()){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_ALLIANCE_BOSS,0)
                var eventData = Gm.pictureData.getEventDataByStageId(this.openData.stageId,this.openData.treasure)
                this.m_tPreEnemy = {}
                for (let index = 0; index < eventData.length; index++) {
                    const v = eventData[index];
                    if (v.hp > 0 || (v.hp == 0 && v.maxMp == 0)){
                        this.m_tPreEnemy[index] = v
                    }
                }
            }else if(this.openData.type == ConstPb.lineHero.LINE_GVE){
                this.m_tPreEnemy = []
                var data = Gm.unionData.getMonsterData(this.openData.id)
                for(var i=0;i<data.length;i++){
                    if(data[i].hp>0){
                        this.m_tPreEnemy.push(data[i])
                    }
                }
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_GVE,0)
            }else if (this.openData.type == ConstPb.lineHero.LINE_WORLD_BOSS){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_GVE,0)
                for(const i in this.openData.worldBoss.monsterIds){
                    this.m_tPreEnemy.push(Gm.config.getMonster(this.openData.worldBoss.monsterIds[i].id))
                }
            }
            else if(this.openData.type == ConstPb.lineHero.LINE_ORE){//水晶秘境
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_ORE,0)
                 if(this.openData.type1 == "battle"){
                    var monsters = Gm.oreData.getMonstersById(this.openData.id)
                    for(var i=0;i<monsters.length;i++){
                        if(monsters[i] !=0){
                            var monster = monsters[i]
                            monster.position = i+1
                            monster.combat = monster.fight
                            this.m_tPreEnemy.push(monster)
                        }
                    }
                 }
            }else if(this.openData.type == ConstPb.lineHero.LINE_ZHENFA_BOSS){//BOSS试炼
                var bossConf = Gm.config.getZhenFaBossById(this.openData.bossId)
                map = Gm.config.getBattleBg(ConstPb.battleType.ZHENFA_BOSS,0)
                for(const i in bossConf.monster){
                    this.m_tPreEnemy.push(Gm.config.getMonster(bossConf.monster[i].id))
                }
            }else if(this.openData.type == ConstPb.lineHero.LINE_MONSTER_WAR){
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_ORE,0)
                 if(this.openData.type1 == "battle"){
                    var monsters = Gm.getLogic("HegemonyLogic").getMonsters(this.openData.mapId,this.openData.modelId)
                    for(var i=0;i<monsters.length;i++){
                        if(monsters[i] !=0){
                            var monster = monsters[i]
                            monster.position = i+1
                            monster.combat = monster.fight
                            this.m_tPreEnemy.push(monster)
                        }
                    }
                 }
            }
            else{
                map = Gm.config.getBattleBg(ConstPb.battleType.BATTLE_PVP_ARENA,1)
            }
            Gm.load.loadSpriteFrame("img/bossbattle/"+map.picture,function(sp,icon){
                if (icon.node){
                    icon.spriteFrame = sp
                }
            },this.m_oBackGround.getComponent(cc.Sprite))
        }
    },
    touchBegan:function(event){
        this.m_iTouchIdx = this.m_iNowIdx = this.pointInArray(event)
        if (this.m_iTouchIdx > -1 && this.m_tReadyData[this.m_iTouchIdx].m_oData){
            var spt = Gm.ui.getScript("GuideView")
            if(spt.isMove()){
                if (this.m_iTouchIdx == 1){
                    spt.hideMove(false)
                }else{
                    this.m_iTouchIdx = -1
                    return
                }
            }
            for(const i in this.m_tReadyData){
                this.m_tReadyData[i].node.x = 0
                this.m_tReadyData[i].node.y = 0
                if (this.guideMove.opacity == 0){
                    if (i == this.m_iTouchIdx){
                        this.m_tReadyData[i].node.parent.zIndex = 15
                    }else{
                        this.m_tReadyData[i].node.parent.zIndex = 0
                    }
                }
            }
        }else{
            this.m_iTouchIdx = -1
        }
    },
    touchMove:function(event){
        if (this.m_iTouchIdx > -1){
            var tmpIdx = this.pointInArray(event)
            if (tmpIdx != this.m_iNowIdx){
                this.m_iNowIdx = tmpIdx
                if (this.m_iNowIdx == this.m_iTouchIdx){
                    for(var i = 0;i < this.m_tReadyData.length;i++){
                        this.m_tReadyData[i].bindingCell(false)
                    }
                }else{
                    for(var i = 0;i < this.m_tReadyData.length;i++){
                        this.m_tReadyData[i].bindingCell(i == tmpIdx)
                    }
                }
            }
            if (this.m_iNowIdx != this.m_iTouchIdx){
                this.m_bIsMoved = true
                this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = true
            }else{
                this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = false
            }
            var newxy = this.m_tHeroNode[this.m_iTouchIdx].convertToNodeSpaceAR(event.getLocation())
            this.m_tReadyData[this.m_iTouchIdx].node.x = newxy.x
            this.m_tReadyData[this.m_iTouchIdx].node.y = newxy.y
        }
    },
    touchEnd:function(event){
        if (this.m_iTouchIdx > -1){
            var tmpIdx = this.pointInArray(event)
            var spt = Gm.ui.getScript("GuideView")
            if (tmpIdx == -1){
                spt.hideMove(true)
                this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = false
                this.m_tReadyData[this.m_iTouchIdx].node.x = 0
                this.m_tReadyData[this.m_iTouchIdx].node.y = 0
            }else if(this.m_iTouchIdx == tmpIdx){
                if(spt.isMove()){
                    spt.hideMove(true)
                    this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = false
                    this.m_tReadyData[this.m_iTouchIdx].node.x = 0
                    this.m_tReadyData[this.m_iTouchIdx].node.y = 0
                    return
                }
                if (!this.m_bIsMoved){
                    this.m_tReadyData[this.m_iTouchIdx].onCellClick()
                }else{
                    spt.hideMove(true)
                    this.m_tReadyData[this.m_iTouchIdx].node.x = 0
                    this.m_tReadyData[this.m_iTouchIdx].node.y = 0
                    this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = false
                }
            }else{
                if (spt.isMove()){
                    if (this.m_iTouchIdx == 1 && tmpIdx == 3){
                        this.reHeroIdx(false)
                        Gm.send(Events.GUIDE_DONE)
                    }else{
                        spt.hideMove(true)
                        this.m_tReadyData[this.m_iTouchIdx].node.parent.getChildByName("shadow").getChildByName("m_oPosLab").active = false
                        this.m_tReadyData[this.m_iTouchIdx].node.x = 0
                        this.m_tReadyData[this.m_iTouchIdx].node.y = 0
                        for(var i = 0;i < this.m_tReadyData.length;i++){
                            this.m_tReadyData[i].bindingCell(false)
                        }
                        return
                    }
                }
                this.changeTwo(this.m_iTouchIdx,tmpIdx)
            }
            if (this.guideMove.opacity == 0){
                for(const i in zList){
                    this.m_tHeroNode[zList[i]].zIndex = i
                }
            }
            this.m_bIsMoved = false
            this.m_iTouchIdx = -1
        }
    },
    changeTwo:function(destIdx1,destIdx2){
        Gm.audio.playEffect("music/10_chara_change")
        var tmpId1 = 0
        var isHir1 = false
        if (this.m_tReadyData[destIdx1].m_oData){
            tmpId1 = this.m_tReadyData[destIdx1].m_oData.heroId
            isHir1 = this.m_tReadyData[destIdx1].m_oData.isHire
        }
        var tmpId2 = 0
        var isHir2 = false
        if (this.m_tReadyData[destIdx2].m_oData){
            tmpId2 = this.m_tReadyData[destIdx2].m_oData.heroId
            isHir2 = this.m_tReadyData[destIdx2].m_oData.isHire
        }

        var herolistData = this.getHeroListData()
        if (tmpId2){
            // if (isHir2){
            //     this.m_tReadyData[destIdx1].setData(Gm.friendData.getHireByHeroId(tmpId2))
            // }else{
            //     this.m_tReadyData[destIdx1].setData(Gm.heroData.getHeroById(tmpId2))
            // }
            this.m_tReadyData[destIdx1].setData(Func.forBy(herolistData,"heroId",tmpId2))
        }else{
            this.m_tReadyData[destIdx1].setData()
        }
        if (tmpId1){
            // if (isHir1){
            //     this.m_tReadyData[destIdx2].setData(Gm.friendData.getHireByHeroId(tmpId1))
            // }else{
            //     this.m_tReadyData[destIdx2].setData(Gm.heroData.getHeroById(tmpId1))
            // }
            this.m_tReadyData[destIdx2].setData(Func.forBy(herolistData,"heroId",tmpId1))
        }else{
            this.m_tReadyData[destIdx2].setData()
        }
    },
    pointInArray:function(event){
        var nowxy = this.m_oMidNode.convertToNodeSpaceAR(event.getLocation())
        nowxy.x = nowxy.x
        nowxy.y = nowxy.y
        for(const i in this.m_tHeroNode){
            var rect = this.m_tHeroNode[i].getBoundingBox()
            if (rect.contains(nowxy) && !this.m_tReadyData[i].isLocked()){
                return i
            }
        }
        return -1
    },
    isPicture(){
        return this.openData.type == ConstPb.lineHero.LINE_PICTURE || this.openData.type == ConstPb.lineHero.LINE_PICTURE2 || false
    },
    hideFinger:function(){
        if (this.m_oFinger){
            this.m_oFinger.active = false
        }
    },
    updateFinger:function(){
        if (Gm.guideData.checkTime(400,"fight_team_guide_pass")){
            if (this.m_oFinger){
                this.m_oFinger.active = true
            }else{
                this.m_oFinger = cc.instantiate(this.m_oFingerFab)
                this.m_oFightBtn.parent.addChild(this.m_oFinger)
            }
            if (this.m_iAllNum < this.m_iLimitNum && this.m_tListData.length <= 8){
                var can = true
                for(const i in this.m_tListData){
                    if (this.m_tListData[i].getBaseClass().canTouch()){
                        var pos = this.m_oFightBtn.parent.convertToNodeSpaceAR(this.m_tListData[i].node.convertToWorldSpaceAR(cc.v2(0,0)))
                        this.m_oFinger.x = pos.x
                        this.m_oFinger.y = pos.y
                        can = false
                        break
                    }
                }
                if (can){
                    this.m_oFinger.x = this.m_oFightBtn.x
                    this.m_oFinger.y = this.m_oFightBtn.y
                }
            }else{
                this.m_oFinger.x = this.m_oFightBtn.x
                this.m_oFinger.y = this.m_oFightBtn.y
            }
        }else{
            if (this.m_oFinger){
                this.m_oFinger.active = false
            }
        }
    },
    enableUpdateView:function(data){
        if (data){
            this.reHeroIdx(false)
            this.m_tYokeList = []
            this.m_oData = data
            this.m_bCross = Gm.battleData.m_bCross
            Gm.battleData.setFightCross(false)
            // console.log("this.m_bCross===:",this.m_bCross)
            Gm.battleData.setFightTeamLocal(this.m_oData)
            Func.destroyChildren(this.m_oListScroll.content)
            this.m_oFirstNode.active = true

            if(this.isPicture() || this.m_oData.type == ConstPb.lineHero.LINE_GVE){
                var layout = this.m_oListScroll.content.getComponent(cc.Layout)
                layout.spacingY = 30
                layout.paddingBottom = 32
                if(this.isPicture()){
                    this.chessBtn.active = true
                }
            }

            this.m_tReadyData = []
            // this.m_iLockNum = this.m_tFightTeam.length
            this.m_iLimitNum = 0
            let tmpData = Gm.config.getConfig("UnlockFightLineConfig")
            tmpData.sort(function(a,b){
                return a.lineMax - b.lineMax
            })
            this.needLab.string = ""
            var tmpMaxId = Gm.userInfo.getMaxMapId()
            for(const i in tmpData){
                if (tmpData[i].id >= tmpMaxId){
                    var map = Gm.config.getMapById(tmpData[i].id)
                    var tmpTable = Gm.config.getMapsByChap(map.chapter)
                    tmpTable.sort(function(a,b){
                        return a.id - b.id
                    })
                    var tmpIdx = 0
                    for(const j in tmpTable){
                        tmpIdx = tmpIdx + 1
                        if (tmpTable[j].id == tmpData[i].id){
                            this.needLab.string = "<outline color='#000000' width=2>"+cc.js.formatStr(Ls.get(90008),this.m_iLimitNum,map.chapter+"-"+tmpIdx)
                            break
                        }
                    }
                    break
                }else{
                    this.m_iLimitNum = tmpData[i].lineMax
                    // this.m_iLockNum = tmpData[i].field
                }
            }
            this.initLine(this.m_tPreEnemy)
        }
    },
    initLine:function(enemy){
        for(const i in this.m_tHeroNode){
            var tmpPage = cc.instantiate(this.m_oFightPerfab)
            this.m_tHeroNode[i].addChild(tmpPage,2,"fight")
            var tmpSpt = tmpPage.getComponent("FightHeroCell")
            tmpSpt.setOwner(this,parseInt(i)+1)
            this.m_tReadyData.push(tmpSpt)
            // var tmpLock = this.m_iLockNum <= parseInt(i)
        }
        var tmpLine = Gm.heroData.getLineWithLimit(this.m_oData.type)
        if(this.m_oData.type == ConstPb.lineHero.LINE_ORE || this.m_oData.type == ConstPb.lineHero.LINE_MONSTER_WAR){
            if(this.m_oData.type1 == "set"){
                tmpLine.hero = this.m_oData.teamList
            }
        }
        // cc.log(tmpLine)
        if (tmpLine && tmpLine.hero){
            this.m_iAllNum = 0
            var herolistData = this.getHeroListData()
            for(const i in tmpLine.hero){
                if (this.m_iAllNum <= this.m_iLimitNum){
                    var tmpId = tmpLine.hero[i]
                    // console.log("tmpHero===:",tmpId,Func.forBy(herolistData,"heroId",tmpId))
                    if (tmpId && Func.forBy(herolistData,"heroId",tmpId)){
                        if (!this.m_tReadyData[i].isLocked()){
                            this.m_iAllNum = this.m_iAllNum + 1
                            if (tmpId < 0){
                                if (this.isPicture()){
                                    this.m_tReadyData[i].setData(Gm.pictureData.getHero(tmpId,this.m_oData.treasure),false,true)
                                }else{
                                    this.m_tReadyData[i].setData(Func.forBy(herolistData,"heroId",tmpId),false,true)
                                }
                            }else{
                                this.m_tReadyData[i].setData(Gm.heroData.getHeroById(tmpId),false,true)
                            }
                        }
                    }else{
                        this.m_tReadyData[i].setData()
                    }
                }
            }
        }else{
            for(const i in this.m_tReadyData){
                this.m_tReadyData[i].setData()
            }
        }

        var defaultFilter = 0
        if (this.isTowerType(this.m_oData.type)){
            if(this.m_oData.type == ConstPb.lineHero.LINE_TOWER1){
                defaultFilter = 1
            }else if (this.m_oData.type == ConstPb.lineHero.LINE_TOWER2){
                defaultFilter = 2
            }else if (this.m_oData.type == ConstPb.lineHero.LINE_TOWER3){
                defaultFilter = 3
            }
        }
        this.m_oTeamFilter.setCallBack(defaultFilter,0,function(filter,job){
            if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                this.m_iFilterValue = filter
                this.m_iJobValue = job
                this.updateHeroList()
            }
        }.bind(this))
        if (defaultFilter > 0){
            this.m_oTeamFilter.setForbidden()
        }
        this.updateReady(true)
        var otherFight = 0
        for(const j in this.m_tEnemyNode){
            var tmpPage = cc.instantiate(this.m_oFightPerfab)
            this.m_tEnemyNode[j].addChild(tmpPage,2,"fight")
            var tmpSpt = tmpPage.getComponent("FightHeroCell")
            var val = Number(j) + 1
            tmpSpt.setOwner(this,val,true)
            var can = true
            if (this.isPicture() || this.m_oData.type == ConstPb.lineHero.LINE_GVE){
                if (enemy[j]){
                    tmpSpt.setData(enemy[j],false,true)
                    otherFight = otherFight + enemy[j].fight
                    can = false
                }
            }else{
                for(const i in enemy){
                    if (enemy[i].position == val){
                        tmpSpt.setData(enemy[i],false,true)
                        otherFight = otherFight + enemy[i].combat
                        can = false
                        break
                    }
                }
            }
            if (can){
                tmpSpt.setData()
            }
        }
        this.m_oFightLab2.string = otherFight
        if(this.m_oData.fight){
             this.m_oFightLab2.string = this.m_oData.fight
        }
        this.updateYoke(false,false)
        this.updateYoke(true,false)
        this.m_oFightBtn.active = true
    },
    setEnemyTeam:function(args){
        var otherFight = 0
        for(const i in args.lineHero[0].hero){
            var tmpPage = this.m_tEnemyNode[i].getChildByName("fight")
            if (!tmpPage){
                tmpPage = cc.instantiate(this.m_oFightPerfab)
                this.m_tEnemyNode[i].addChild(tmpPage,2,"fight")
            }
            var tmpSpt = tmpPage.getComponent("FightHeroCell")
            tmpSpt.setOwner(this,parseInt(i)+1,true)
            if (args.lineHero[0].hero[i]){
                for(const j in args.heroInfo){
                    if (args.heroInfo[j].heroId == args.lineHero[0].hero[i]){
                        tmpSpt.setData(args.heroInfo[j],false,true)
                        otherFight = otherFight + args.heroInfo[j].fight
                    }
                }
            }else{
                tmpSpt.setData()
            }
        }
        this.m_oFightLab2.string = otherFight
        this.updateYoke(true,false)
    },
    isTowerType(lineType){
        if(lineType == ConstPb.lineHero.LINE_TOWER || lineType == ConstPb.lineHero.LINE_TOWER1 || lineType == ConstPb.lineHero.LINE_TOWER2 || lineType == ConstPb.lineHero.LINE_TOWER3){
            return true
        }
        return false
    },
    getHeroListData(){
        var tmpLine = Gm.heroData.getLineWithLimit(this.m_oData.type)
        var tmpData
        if (this.m_oData.type == ConstPb.lineHero.LINE_BOSS || this.isTowerType(this.m_oData.type) ){
            tmpData = Gm.friendData.getFightTeamHire().concat(Gm.heroData.getAll())
        }else if (this.isPicture()){
            tmpData = Gm.pictureData.getHeroinfo(this.m_oData.treasure)
        }
        else if(this.m_oData.type == ConstPb.lineHero.LINE_GVE){
            tmpData = Gm.unionData.getSportNDeadHeroData()
        }else if (this.m_oData.type == ConstPb.lineHero.LINE_ZHENFA_BOSS){
            tmpData = Gm.bossTrialData.getAllHelpHero().concat(Gm.heroData.getAll())
        }
        else if(this.m_oData.type == ConstPb.lineHero.LINE_MONSTER_WAR){
            if(this.m_oData.type1 == "set"){
                tmpData = Gm.getLogic("HegemonyLogic").getAllHero(Gm.heroData.getAll(),this.m_oData.position)
            }else{
                tmpData = Gm.heroData.getAll()
            }
        }
        else{
            tmpData = Gm.heroData.getAll()
        }
        // console.log("tmpData==:",tmpLine,tmpData)
        tmpData.sort(function(a,b){
            let at = a.isHire || a.isHelpHero
            let bt = b.isHire || b.isHelpHero
            if (at == bt){
                let inA = false
                let inB = false
                if (tmpLine && tmpLine.hero){
                    for(const i in tmpLine.hero){
                        if (tmpLine.hero[i] == a.heroId){
                            inA = true
                        }
                        if (tmpLine.hero[i] == b.heroId){
                            inB = true
                        }
                    }
                }
                if (inA){
                    return -1
                }
                if (inB){
                    return 1
                }
                var levelA = a.level
                var levelB = b.level
                var confA = Gm.config.getHero(a.baseId,a.qualityId)
                var confB = Gm.config.getHero(b.baseId,b.qualityId)
                if ((!at) && Gm.heroData.isInPool(a.heroId)){
                    levelA = Func.configHeroLv(a,confA)
                }
                if ((!bt) && Gm.heroData.isInPool(b.heroId)){
                    levelB = Func.configHeroLv(b,confB)
                }
                if (levelB == levelA){
                    if (confA.quality == confB.quality){
                        if (confB.camp == confA.camp){
                            return confA.idGroup - confB.idGroup
                        }
                        return confB.camp - confA.camp
                    }else{
                        return confB.quality - confA.quality
                    }
                    return -1
                }else{
                    return levelB - levelA
                }
            }else{
                if (at){
                    return -1
                }else{
                    return 1
                }
            }
        })
        return tmpData
    },
    updateHeroList:function(){
        var tmpData = this.getHeroListData()
        var tmpGiao = []
        for(const i in tmpData){
            var baseId = tmpData[i].baseId
            if (baseId == 0){
                baseId = Gm.config.getQulityHero(tmpData[i].qualityId).idGroup
            }
            var tmpConfig = Gm.config.getHero(baseId)
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.camp)&&
                (this.m_iJobValue == 0 || this.m_iJobValue == tmpConfig.job)){
                tmpGiao.push(tmpData[i])
            }
        }
        this.m_tListData = []
        this.m_oListScroll.stopAutoScroll()
        Func.destroyChildren(this.m_oListScroll.content)
        Gm.ui.simpleScroll(this.m_oListScroll,tmpGiao,function(itemData,tmpIdx){
            var tmpSpt = Gm.ui.getNewItem(this.m_oListScroll.content)
            tmpSpt.setMaxHeight()
            tmpSpt.updateHero(itemData)
            tmpSpt.getBaseClass().updateHire(this.m_oData.type)
            tmpSpt.setFb(this.onHeroListClick.bind(this))
            tmpSpt.setAlso()
            
            if(this.isPicture() || this.m_oData.type == ConstPb.lineHero.LINE_GVE){
                var barNode = cc.instantiate(this.FightHeroCellBar)
                barNode.active = true
                tmpSpt.node.addChild(barNode)
                // barNode.scale = 1.25
                barNode.x = 0
                barNode.y = -90
                var bar = barNode.getComponent("FightHeroCellBar")
                bar.setData(itemData)
            }
            for(var j in this.m_tReadyData){
                if (this.m_tReadyData[j].m_oData){
                    if (this.m_tReadyData[j].m_oData.heroId == itemData.heroId){
                        tmpSpt.getBaseClass().setHeroReady(true)
                        break
                    }else{
                        if (this.isPicture()){
                            if (this.m_tReadyData[j].m_oData.baseId == itemData.baseId){
                                tmpSpt.getBaseClass().lockSame(true)
                                break
                            }
                        }else{
                            if (this.m_tReadyData[j].m_oData.baseId == itemData.baseId){
                                tmpSpt.getBaseClass().lockSame(true)
                                break
                            }
                        }
                    }
                }
            }
            this.m_tListData.push(tmpSpt)
            return tmpSpt.node
        }.bind(this))
        this.m_oListScroll.scrollToTop()

        this.checkBlank(tmpGiao)

        setTimeout(()=>{
            if (cc.isValid(this.node)){
                this.updateFinger()
            }
        },1000)
    },
    onOkClick:function(){
        var list = []
        var heroNum = 0 
        for (let index = 0; index < this.m_tReadyData.length; index++) {
            const v = this.m_tReadyData[index];
            if (v.m_oData){
                list.push(v.m_oData.heroId)
                heroNum = heroNum + 1
            }else{
                list.push(0)
            }
        }
        if (heroNum==0){
            Gm.floating(Ls.get(90009))
            return
        }
        var self = this
        var tmpDone = ()=>{
            if (self.m_oData.type != ConstPb.lineHero.LINE_DEFEND){
                Gm.loading(null,true)
            }
            if (self.m_oData.type == ConstPb.lineHero.LINE_BOSS){
                Gm.battleNet.fightBoss(list,self.m_oData.map)
            }else if(self.m_oData.type == ConstPb.lineHero.LINE_PVP){
                Gm.arenaNet.sendArenaBattle(self.m_oData.isRobot || 0,self.m_oData.playerId,list)
            }else if(self.m_oData.type == ConstPb.lineHero.LINE_TRAVEL_CAPTURE){
                Gm.heroNet.setGjHero(list,self.m_oData.type)
                // Gm.travelNet.sendCaptureBattle(self.m_oData.playerId,list)
                Gm.travelNet.sendCaptureRefresh()
            }else if(self.m_oData.type == ConstPb.lineHero.ALLIANCE_BOSS){
                Gm.unionNet.bossBattle(list,self.m_oData.heroId)
            }else if(self.m_oData.type == ConstPb.lineHero.LINE_TRAVEL_RANSOM){
                Gm.travelNet.sendRansomBattle(list,self.m_oData.heroId)
            }else if (self.m_oData.type == ConstPb.lineHero.LINE_DUNGEON){
                if(self.m_oData.dungeonType == 1){//副本单人
                    Gm.dungeonNet.battle(self.m_oData.dungeonId,self.m_oData.mode,self.m_oData.dungeonType,list)
                }else{//副本组队
                    Gm.heroNet.setGjHero(list,self.m_oData.type)
                    if (self.m_oData.isJoin){
                        var info = {}
                        info.editType = ConstPb.dungeonEditTeam.DUNGEON_JOIN
                        info.dungeonId = self.m_oData.dungeonId
                        info.mode = self.m_oData.mode
                        info.editId = self.m_oData.leaderId
                        Gm.dungeonNet.edit(info)
                    }else if (self.m_oData.isCreate){
                        Gm.ui.create("DungeonCreateTeamView",{dungeonId:self.m_oData.dungeonId,mode:self.m_oData.mode})
                    }else{
                        Gm.dungeonNet.invite(self.m_oData.sendInviteId,self.m_oData.dungeonId)
                        Gm.dungeonData.delInvites(self.m_oData.sendInviteId)
                    }
                }
            }else if (self.isTowerType(self.m_oData.type)){//爬塔
                Gm.battleNet.towerBattle(list,self.m_oData.towerType,self.m_oData.type)
                
            }else if (this.isPicture()){
                Gm.gamePlayNet.triggerEvent(self.m_oData.nowId,self.m_oData.stageId,list,0,self.m_oData.treasure)
            }
            else if(this.m_oData.type == ConstPb.lineHero.LINE_GVE){//公会竞技
                Gm.unionNet.battleGVE(this.m_oData.id,list)
                Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_GVE,hero:list})
            }else if (this.openData.type == ConstPb.lineHero.LINE_WORLD_BOSS){
                Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_WORLD_BOSS,hero:list})
                Gm.worldBossNet.bossBattle(list)
            }else if(this.m_oData.type == ConstPb.lineHero.LINE_ORE){//水晶秘境战斗
                if(this.m_oData.type1 == "set"){
                    Gm.oreNet.sendOreSetHeros(this.m_oData.id,list)
                    Gm.removeLoading()
                    self.onBack()
                }
                else{
                    Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_ORE,hero:list})
                    Gm.oreNet.sendOreBattle(this.m_oData.id,list)
                }
            }else if (this.openData.type == ConstPb.lineHero.LINE_ZHENFA_BOSS){
                Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_ZHENFA_BOSS,hero:list})
                // cc.log(this.m_oData)
                Gm.bossTrialNet.battle(this.m_oData.bossId,list)
            }else if(this.openData.type == ConstPb.lineHero.LINE_MONSTER_WAR){//同盟争霸
                if(this.m_oData.type1 == "set"){
                    // for(var i=0;i<list.length;i++){
                    //     if(list[i] == 0){
                    //         Gm.floating("玩家数量不足")
                    //         return
                    //     }
                    // }
                    Gm.getLogic("HegemonyLogic").onSetArmy(this.openData,list)
                    Gm.removeLoading()
                    self.onBack()
                }else{
                    Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_MONSTER_WAR,hero:list})
                    Gm.allianceWarNet.sendBattleAllianceWar(this.m_oData.mapId,list,this.m_oData.modelId)
                }
            }
            else{
                Gm.heroNet.setGjHero(list,self.m_oData.type)
            }
            if (this.openData.type == ConstPb.lineHero.LINE_DEFEND){
                self.onBack()
            }
        }
        // if (heroNum < this.m_iLockNum){
        //     Gm.box({msg:Ls.get(90023)},function (btnType) {
        //         if ( btnType == 1 ){
        //             tmpDone()
        //         }
        //     })
        // }else{
            tmpDone()
        // }
    },
    onNoClick:function(){
        this.onBack()
    },
    onTeamHeroYoke:function(){
        this.updateYoke(false,true)
    },
    onTeamEnemyYoke:function(){
        this.updateYoke(true,true)
    },
    cheackReady:function(destData){
        var tmpIdx = -1
        return tmpIdx
    },
    insertReady:function(destData){
        var tmpIdx = -1
        this.m_iAllNum = 0
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData){
                    this.m_iAllNum = this.m_iAllNum + 1
                }else{
                    if (tmpIdx == -1){
                        tmpIdx = i
                    }
                }
            }
        }
        if (this.m_iAllNum < this.m_iLimitNum){
            if (tmpIdx != -1){
                this.m_tReadyData[tmpIdx].setData(destData,true)
            }
            this.m_iAllNum ++
            this.updateReady()
            return tmpIdx != -1
        }else{
            Gm.floating(Ls.get(90026))
            return false
        }
    },
    removeReady:function(destData){
        var tmpIdx = -1
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData && this.m_tReadyData[i].m_oData.heroId == destData.heroId){
                    tmpIdx = i
                    break
                }
            }
        }
        if (tmpIdx != -1){
            this.m_iAllNum--
            this.m_tReadyData[tmpIdx].setData()
        }
        this.updateReady()
        return tmpIdx != -1
    },
    updateReady:function(isFirst){
        var tmpTotalFight = 0
        var camps = {}
        var jobs = {}
        var heros = {}
        for(const i in this.m_tReadyData){
            if (!this.m_tReadyData[i].isLocked()){
                if (this.m_tReadyData[i].m_oData){
                    var fight = 0
                    if (this.m_tReadyData[i].m_oData.getAttrValue){
                        fight = this.m_tReadyData[i].m_oData.getAttrValue(203)
                    }else{
                        fight = this.m_tReadyData[i].m_oData.fight || 0
                    }
                    var conf = Gm.config.getHero(this.m_tReadyData[i].m_oData.baseId,this.m_tReadyData[i].m_oData.qualityId)
                    if (!camps[conf.camp]){
                        camps[conf.camp] = 0
                    }
                    camps[conf.camp]++
                    if (!jobs[conf.job]){
                        jobs[conf.job] = 0
                    }
                    jobs[conf.job]++
                    if (!heros[conf.id]){
                        heros[conf.id] = this.m_tReadyData[i].m_oData.heroId
                    }
                    // if(this.m_tReadyData[i].m_oData.baseId == 0){
                    //     tmpTotalFight = tmpTotalFight + this.m_tReadyData[i].m_oData.fight || 0
                    // }else{
                    //     tmpTotalFight = tmpTotalFight + this.m_tReadyData[i].m_oData.getAttrValue(203)
                    // }
                    tmpTotalFight = tmpTotalFight + fight
                }
            }
        }
        this.m_oFightLab.string = tmpTotalFight
        this.updateYoke(false,false)
        // this.m_tYokeList
        var tmpList = []
        for(const i in this.m_tYokeAll){
            const v = this.m_tYokeAll[i]
            var tmpCan = true
            var wid = this.m_tYokeAll[i].hero
            var oneWid = Math.abs(heros[wid])
            for(const j in this.m_tYokeAll[i].need){
                var value = this.m_tYokeAll[i].need[j]
                if (v.type == 1){//阵营
                    if (camps[j] && camps[j] >= value && oneWid > 0){}else{
                        tmpCan = false
                        break
                    }
                }else if(v.type == 2){//职业
                    if (jobs[j] && jobs[j] >= value && oneWid > 0){}else{
                        tmpCan = false
                        break
                    }
                }else{//女神
                    if (heros[j]){//heros[j] >= value
                    }else{
                        tmpCan = false
                        break
                    }
                }
            }
            if (tmpCan){
                var idx = checkint(i)
                var tmpHas = false
                for(const j in this.m_tYokeList){
                    if (this.m_tYokeList[j] == idx){
                        this.m_tYokeList.splice(j,1)
                        tmpHas = true
                        break
                    }
                }
                if (!tmpHas){
                    this.pushYoke(idx,true)
                }
                tmpList.push(idx)
            }
        }
        // 下降战斗力
        for(const i in this.m_tYokeList){
            this.pushYoke(this.m_tYokeList[i],false)
        }
        if (isFirst){
            this.m_tYokeShow = []
        }
        this.m_tYokeList = tmpList
        if (this.m_tYokeShow.length > 0){
            this.m_iYokeIdx = 0
            this.showYoke()
        }
        var tmpFire = []
        for(const i in this.m_oYokeIds){
            if (this.m_oYokeIds[i]){
                var group = this.m_tYokeAll[i].group
                var tmpCan = true
                for(const j in tmpFire){
                    if (tmpFire[j] == group){
                        tmpCan = false
                        break
                    }
                }
                if (tmpCan){
                    tmpFire.push(group)
                }
            }
        }
        // console.log("tmpFire===:",tmpFire,this.m_tYokeShow)
        if (tmpFire.length > 0){
            if(!this.m_oLitAni1.isShow){
                this.m_oLitAni1.isShow = true
                this.m_oLitAni1.play("FightTeamView")
            }
            this.m_oLightNod1.getChildByName("none").active = false
            this.m_oLightNod1.getChildByName("icon").active = true
        }else{
            this.m_oLitAni1.isShow = false
            this.m_oLitAni1.setCurrentTime(0)
            this.m_oLitAni1.stop()
            var part = this.m_oLightNod1.getChildByName("kuang3").getComponent(cc.ParticleSystem)
            part.stopSystem()
            this.m_oLightNod1.getChildByName("none").active = true
            this.m_oLightNod1.getChildByName("icon").active = false
        }
        for(var i = 1;i < 5;i++){
            this.m_oLightNod1.getChildByName("shan"+i).active = (i <= tmpFire.length)
        }
    },
    pushYoke:function(idx,isUp){
        this.m_oYokeIds[idx] = isUp
        if(!isUp){
            return
        }
        if (this.m_tYokeShow){
            var tmpCan = true
            var data = this.m_tYokeAll[idx]
            for(const i in this.m_tYokeShow){
                var group = this.m_tYokeAll[this.m_tYokeShow[i].idx].group
                if (group == data.group){
                    tmpCan = false
                    break
                }
            }
            if (tmpCan){
                if (data.type == 3){
                    for(const j in data.need){
                        var valJ = Number(j)
                        for(const i in this.m_tReadyData){
                            var conf = this.m_tReadyData[i].m_oConf
                            if (conf && conf.id == valJ){
                                this.m_tReadyData[i].callYoke()
                                break
                            }
                        }
                    }
                }else{
                    for(const i in this.m_tReadyData){
                        var conf = this.m_tReadyData[i].m_oConf
                        if (conf && conf.id == data.hero){
                            this.m_tReadyData[i].callYoke()
                            break
                        }
                    }
                }
                if (Gm.userData.teamyoketip){
                    this.m_tYokeShow.push({idx:idx,isUp:isUp})
                }else{
                    this.m_tYokeShow = []
                }
            }
        }
    },
    onHideYoke:function(sender){
        var tmpNum = 1 - Number(Gm.userData.teamyoketip)
        Gm.userData.setYokeTips(tmpNum)
        var dui = sender.target.parent.getChildByName("dui")
        dui.active = tmpNum == 0
        if (tmpNum == 0){
            Gm.floating(Ls.get(1810))
        }
    },
    showYoke:function(){
        if (Gm.userData.teamyoketip){
            this.m_oYokeTips.active = true
            var run = this.m_tYokeShow[this.m_iYokeIdx]
            var data = this.m_tYokeAll[run.idx]
            this.m_oYokeInfo.string = data.info
            if (run.isUp){
                this.m_oYokeSprUp.active = true
                this.m_oYokeSprDown.active = false
                this.m_oYokeUp.active = true
                this.m_oYokeDown.active = false
                this.m_oYokeLab.node.color = cc.color(0,254,36)
                // this.m_oYokeLab.string = Ls.get(1803) + data.fight
                if (data.type == 3){
                    this.m_oYokeLab.string = Ls.get(1803)
                }else{
                    this.m_oYokeLab.string = Ls.get(1804)
                }
            }else{
                this.m_oYokeSprUp.active = false
                this.m_oYokeSprDown.active = true
                this.m_oYokeUp.active = false
                this.m_oYokeDown.active = true
                this.m_oYokeLab.node.color = cc.color(0,254,36)
                this.m_oYokeLab.string = Ls.get(1804) + data.fight
            }
            Func.destroyChildren(this.m_oYokeList)
            var isFirst = true
            if (data.type == 3){
                for(const i in data.need){
                    var sp = Gm.ui.getNewItem(this.m_oYokeList)
                    for(const o in this.m_tReadyData){
                        var heroData = this.m_tReadyData[o].m_oData
                        if (heroData && heroData.baseId == i){
                            sp.updateHero(heroData)
                            break
                        }
                    }
                }
            }else{
                for(var j = 0;j < data.condition.length;j++){
                    var tmp = data.condition[j]
                    var fab = cc.instantiate(this.m_oHeroFab)
                    fab.active = true
                    this.m_oYokeList.addChild(fab)
                    var name0 = null
                    if (data.type == 1){//阵营
                        name0 = Gm.config.getTeamType(tmp)
                    }else{//职业
                        name0 = Gm.config.getJobType(tmp)
                    }
                    var floor = fab.getChildByName("node").getComponent(cc.Sprite)
                    var spr = floor.node.getChildByName("spr").getComponent(cc.Sprite)
                    if (isFirst && data.hero){
                        isFirst = false
                        spr.spriteFrame = null
                        var sp = Gm.ui.getNewItem(spr.node)
                        sp.setMaxHeight()
                        for(const o in this.m_tReadyData){
                            var heroData = this.m_tReadyData[o].m_oData
                            if (heroData && heroData.baseId == data.hero){
                                sp.updateHero(heroData)
                                break
                            }
                        }
                    }else{
                        YokeFunc.yokeHeroFloor(data.type,name0.childType-1,floor)
                        YokeFunc.yokeHeroFrame(data.type,name0.childType-1,spr)
                    }
                    Gm.load.loadSpriteFrame("img/jobicon/"+name0.currencyIcon,function(sp,icon){
                        icon.spriteFrame = sp
                    },fab.getChildByName("spr").getComponent(cc.Sprite))
                }
            }
            if (Gm.userData.teamyoketip){
                this.m_oOpenTip.active = true
                this.m_oOpenTip.getChildByName("btn").getChildByName("dui").active = false
            }else{
                this.m_oOpenTip.active = false
            }
        }
    },
    closeYoke:function(){
        this.m_iYokeIdx++
        if (this.m_iYokeIdx < this.m_tYokeShow.length){
            this.showYoke()
        }else{
            this.m_tYokeShow = []
            this.m_oYokeTips.active = false
        }
    },
    updateYoke:function(isEnmey,isView){
        if(!isView){
            if (isEnmey){
                var data = this.calculationEnmeyYoke(true)
                var tmpFire = []
                for(const i in data.data){
                    if (data.data[i]){
                        var group = this.m_tYokeAll[i-1].group
                        var tmpCan = true
                        for(const j in tmpFire){
                            if (tmpFire[j] == group){
                                tmpCan = false
                                break
                            }
                        }
                        if (tmpCan){
                            tmpFire.push(group)
                        }
                    }
                }
                var part = this.m_oLightNod2.getChildByName("kuang3").getComponent(cc.ParticleSystem)
                if (tmpFire.length > 0){
                    this.m_oLitAni2.play("FightTeamView_Loop")
                    part.resetSystem()
                    this.m_oLightNod2.getChildByName("none").active = false
                    this.m_oLightNod2.getChildByName("icon").active = true
                }else{
                    this.m_oLitAni2.setCurrentTime(0)
                    this.m_oLitAni2.stop()
                    part.stopSystem()
                    this.m_oLightNod2.getChildByName("none").active = true
                    this.m_oLightNod2.getChildByName("icon").active = false
                }
                for(var i = 1;i < 5;i++){
                    this.m_oLightNod2.getChildByName("shan"+i).active = (i <= tmpFire.length)
                }
            }
            return
        }
        var data = {none:true}
        if(isEnmey){//敌人
            if(YokeFunc.enemyHeroNeedCheckYoke(this.m_oData.type)){
                data = this.calculationEnmeyYoke(isEnmey)
            }
            data.type = this.m_oData.type
            data.isEnmey = true
        }else{
            data = this.calculationEnmeyYoke(isEnmey)
        }
        if (data.none){
            Gm.floating(Ls.get(5853))
        }else{
            Gm.ui.create("FightYokeView",data)
        }
    },
    //计算敌人的羁绊 //返回需要展示的id
    calculationEnmeyYoke(isEnmey){
        var temp = []
        var heroData = []
        if(isEnmey){
            for(const i in this.m_tEnemyNode){
                var hero = this.m_tEnemyNode[i].getChildByName("fight")
                if (hero && hero.getComponent("FightHeroCell")){
                    var spt = hero.getComponent("FightHeroCell")
                    if(spt && spt.m_oData){
                        temp.push(spt)
                        heroData.push(spt.m_oData)
                    }
                }
            }
        }
        else{
            for(const i in this.m_tHeroNode){
                var hero = this.m_tHeroNode[i].getChildByName("fight")
                if (hero && hero.getComponent("FightHeroCell")){
                    var spt = hero.getComponent("FightHeroCell")
                     if(spt && spt.m_oData){
                        temp.push(spt)
                        heroData.push(spt.m_oData)
                     }
                }
            }
        }
        var data = YokeFunc.calculationYokeData(temp)
        var yokes = YokeFunc.calculationYokeShowIds(data,isEnmey)
        return {data:yokes.ids,team:data,heroData:heroData,none:yokes.none}
    },
    onHeroListClick:function(destData){
        if (destData){
            var hasSame = false // 佣兵去重
            var tmpDone = false
            var tmpIdx = -1
            for(const i in this.m_tListData){
                if (this.m_tListData[i].data.heroId == destData.heroId){
                    tmpIdx = i
                    break
                }
            }
            var destValue = true
            for(const i in this.m_tReadyData){
                if (this.m_tReadyData[i].m_oData){
                    if (this.m_tReadyData[i].m_oData.heroId == destData.heroId){
                        destValue = false
                    }else{
                        if (this.isPicture()){
                            if (this.m_tReadyData[i].m_oData.baseId == destData.baseId){
                                hasSame = true
                            }
                        }else{
                            if (this.m_tReadyData[i].m_oData.baseId == destData.baseId){
                                hasSame = true
                            }
                        }
                    }
                }
            }
            if (hasSame){
                Gm.floating(Ls.get(5247))
                return
            }
            if (!destValue && tmpIdx == -1 ){
                tmpDone = this.removeReady(destData)
            }
            if (tmpIdx != -1){
                if (destValue){
                    tmpDone = this.insertReady(destData)
                }else{
                    tmpDone = this.removeReady(destData)
                }
                // console.log("tmpDone===:",tmpDone,destValue,tmpIdx)
                if (tmpDone){
                    this.m_tListData[tmpIdx].getBaseClass().setHeroReady(destValue)
                }
            }
            if (tmpDone){
                for(const i in this.m_tListData){
                    const v = this.m_tListData[i];
                    var tmpHas = false
                    var tmpSame = false
                    for(const j in this.m_tReadyData){
                        if (this.m_tReadyData[j].m_oData){
                            if (v.data.heroId == this.m_tReadyData[j].m_oData.heroId){
                                tmpHas = true
                            }else{
                                if (this.isPicture()){
                                    if (this.m_tReadyData[j].m_oData.baseId == v.data.baseId){
                                        tmpSame = true
                                    }
                                }else{
                                    if (this.m_tReadyData[j].m_oData.baseId == v.data.baseId){
                                        tmpSame = true
                                    }
                                }
                            }
                        }
                    }
                    v.getBaseClass().lockSame(tmpSame)
                    v.getBaseClass().setHeroReady(tmpHas)
                    
                    if (destData.isHire){
                        if (destValue){
                            if (v.data.isHire && destData.heroId != v.data.heroId){ //选中的佣兵下来
                                v.getBaseClass().lockHire(true)
                            }
                        }else{
                            if (v.data.isHire){ //选中的佣兵下来
                                v.getBaseClass().lockHire(false)
                            }
                        }
                    }
                }
            }
            this.updateFinger()
        }
    },
    onCleanUp:function(){
        for(const i in this.m_tReadyData){
            if (this.m_tReadyData[i].m_oData){
                this.onHeroListClick(this.m_tReadyData[i].m_oData)
            }
        }
    },
    onCross:function(){
        Gm.ui.create("FightCross",true)
    },
    onLightRing:function(){//光环克制
        this.m_oRingNod.active = !this.m_oRingNod.active
    },
    onHeroNodClick:function(sender,value){

    },
    onGuide1:function(){
        // console.log("点到我了==：",this.m_tListData[0])
        this.onHeroListClick(this.m_tListData[1].data)
    },
    onGuide2:function(){
        // console.log("点到我了==：",this.m_tListData[0])
        this.onHeroListClick(this.m_tListData[2].data)
    },
    getClick:function(destName){
        if (destName == "m_oSelet1"){
            return "onGuide1"
        }else if(destName == "m_oSelet2"){
            return "onGuide2"
        }else if(destName == "m_oSelet3"){
            return "closeYoke"
        }
    },
    onChessClick(){
        var readyList = []
        for (let index = 0; index < this.m_tListData.length; index++) {
            const v = this.m_tListData[index];
            if (v.getBaseClass().isReady()){
                readyList.push(v.data.heroId)
            }
        }
        if (readyList.length == 0){
            Gm.floating(Ls.get(5331))
            return
        }
        this.m_oData.readyList = readyList
        Gm.ui.create("FightChessView",this.m_oData)
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },        
});

