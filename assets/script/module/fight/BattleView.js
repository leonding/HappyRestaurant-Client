var BaseView = require("BaseView")
var efList = require("EffectList")
const MAX_TIME = 3

const BULLET_TIME = 0.05

const JOB_1 = 1//战士
const JOB_2 = 2//法师
const JOB_3 = 3//射手
const JOB_4 = 4//辅助

const TYPE_NONE = 0
const TYPE_LOAD = 1
const TYPE_INIT = 2
const TYPE_PLAY = 3
const TYPE_DONE = 4

const pos_scale = [0.9,0.8,1,0.85,0.75,0.95]

const attack_wid = 280

const SPEED_DT = 500

const SKILL_BG = "skill_bg"
const POWER_MAX = "powermax"
const FAZHEN = "fazhen"
const JIAXUE = "jiaxueziran"
const JIALAN = "huilan"

const DEF_WIDTH = 50

const SHAKE_TIME = 50

const IDLE_STR = {
    1:"battlelihui",
    2:"battlelihui_yellow",
    3:"battlelihui_red",
}

const ZHEN_STR = {
    1:"blue",
    2:"yellow",
    3:"red",
}

// ConstPb.effectType
const EFFECT_IDX = {
    0:{res:2},//EFFECT_DAMAGE
    1:{res:2,spr:1},//EFFECT_CRITS
    2:{spr:2},//EFFECT_MISS
    3:{res:2,spr:0},//EFFECT_PARRY
    4:{res:3},//EFFECT_HEAL_HP1
    5:{res:3},//EFFECT_HEAL_HP2
    6:{res:1},//EFFECT_HEAL_MP1
    7:{res:1},//EFFECT_HEAL_MP2
    8:{res:2},//EFFECT_REDUCE_HP
    11:{res:1},//EFFECT_REDUCE_MP
    12:{res:0,spr:3},//EFFECT_SHIELD
    13:{res:3},//EFFECT_SUCK_HP
}

// BattleView
cc.Class({
    extends: BaseView,

    properties: {
        m_tNumRes:{
            default: [],
            type: cc.Font,
        },
        m_tNumSpr:{
            default: [],
            type: cc.SpriteFrame,
        },
        m_oZoomNode:cc.Node,
        m_oSkillFab:cc.Prefab,
        m_oBattleStart:cc.Prefab,
        m_oRoundLab:cc.Label,
        m_oHurtLab:cc.Prefab,
        m_oBuffLab:cc.Prefab,
        m_oHeroPerfab:cc.Prefab,
        m_tHeroNode:{
            default: [],
            type: cc.Node,
        },
        m_tEnemyNode:{
            default: [],
            type: cc.Node,
        },
        m_oSkillPos:cc.Node,
        timesBtn:cc.Node,
        m_oTimesLab:cc.Label,
        m_oTimesFrame:{
            default:[],
            type:cc.SpriteFrame,
        },
        dungeonHeads:{
            default:[],
            type:require("DungeonFightHeadItem")
        },
        selectType:0,
        m_oSkillNode:cc.Node,

        m_oSkillBlack:cc.Node,
        m_oSkillBg:sp.Skeleton,
        m_oPersonNode:cc.Node,
        m_oUINode:cc.Node,
        unionTopBoxNode:cc.Node,
        skipBtn:cc.Node,

        m_oLightNod1:cc.Node,
        m_oLightNod2:cc.Node,
        m_oUserInfoNode:cc.Node,
    },

    onLoad () {
        this._super()
        Gm.send(Events.GUIDE_PAUSE)
        this.m_iTimesNum = checkint(Gm.userData.fightSpeed)
        this.skipBtnActive(false)
        if (this.cheackBtn(1)){
            this.m_oTimesLab.node.color = cc.color(255,248,61)
            this.timesBtn.getComponent(cc.Sprite).spriteFrame = this.m_oTimesFrame[0]
        }else{
            this.m_oTimesLab.node.color = cc.color(255,255,255)
            this.timesBtn.getComponent(cc.Sprite).spriteFrame = this.m_oTimesFrame[1]
        }
        

        var showNode = new cc.Node()
        this.m_oSkillShow = showNode.addComponent(sp.Skeleton)
        this.m_oSkillBlack.addChild(showNode)
        this.m_oSkillShow.node.active = false

        this.m_oStartEffect = cc.instantiate(this.m_oBattleStart)
        this.m_oUINode.addChild(this.m_oStartEffect)
        var tmpAni = this.m_oStartEffect.getComponent(cc.Animation)
        tmpAni.on('finished',function(name,sender){
            this.m_oStartEffect.active = false
            this.playOnce()
        }.bind(this))
        this.m_oStartEffect.active = false

        this.m_oSkillIdle = cc.instantiate(this.m_oSkillFab)
        this.m_oSkillIdle.scale = cc.fixBgScale
        this.m_oSkillBg.node.scale = cc.fixBgScale
        this.m_oSkillNode.addChild(this.m_oSkillIdle)
        var tmpIdle = this.m_oSkillIdle.getComponent(cc.Animation)
        tmpIdle.on('finished',function(name,sender){
            this.m_oSkillIdle.active = false
            this.m_oSkillShow.node.active = false
            var active = this.getSeletPos(this.actionNow.active.pos,true)
            this.showSkillBg(active.skinConf)
            active.doAttack(this.m_oDealData)
            // this.playOnce()
        }.bind(this))
        this.m_oSkillIdle.active = false
        this.m_oLitAni1 = this.m_oLightNod1.getComponent(cc.Animation)
        this.m_oLitAni2 = this.m_oLightNod2.getComponent(cc.Animation)
        this.m_iRoundMax = Gm.config.getConst("battle_skip_max_round")
    },
    onDestroy(){
        if (this.m_oAwardData){
            if (this.m_oAwardData.type == ConstPb.battleType.BATTLE_DUNGEON_ONE || this.m_oAwardData.type == ConstPb.battleType.BATTLE_DUNGEON_TEAM){
                if (Gm.dungeonData.recodTeamInfo){
                    Gm.dungeonData.recodTeamInfo = null
                }else{
                    Gm.dungeonData.teamInfo = null
                }
                Gm.dungeonData.battleData = null
            }
        }
        this._super()
    },
    
    onEnable(){
        if (this.m_oBGMFile){
            Gm.audio.playBGM(this.m_oBGMFile)
        }
        this._super()
    },
    enableUpdateView:function(destData){
        if (destData && typeof(destData) != "boolean"){
            this.select(TYPE_LOAD)
            this.battleDestData = destData
            if (!Bridge.getAppType()){
                this.battleDestData.isRecord = true
            }
            if (destData.battleInfo[0].type == ConstPb.battleType.BATTLE_DUNGEON_TEAM){
                for (let index = 0; index < this.dungeonHeads.length; index++) {
                    const v = this.dungeonHeads[index];
                    if(Gm.dungeonData.recodTeamInfo){
                        v.setData(Gm.dungeonData.recodTeamInfo[index])
                    }else{
                        v.setData(Gm.dungeonData.teamInfo.member[index])
                    }
                }
            }
            this.setUserInfoNode()
            this.setBattleIndex(0)
        }
    },
    isNextBattle(){
        if (this.isDungeonTeam() || this.isUnionBoss() ){
            var bIndex = this.battleIndex + 1
            var data = this.battleDestData.battleInfo[bIndex]
            if (data && data.isEmpty == null){
                return true
            }else{
                var data = this.battleDestData.battleInfo[bIndex+1]
                if (data && data.isEmpty == null){
                    return true
                }
            }
        }
        return false
    },
    nextBattle(){
        this.setBattleIndex(this.battleIndex +1)
    },
    isDungeonTeam(){
        return this.m_oAwardData.type == ConstPb.battleType.BATTLE_DUNGEON_TEAM
    },
    isUnionBoss(){
        return this.m_oAwardData.type == ConstPb.battleType.BATTLE_ALLIANCE_BOSS
    },
    setBattleIndex(index){
        this.m_bOverSix = false
        this.battleIndex = index 
        this.m_oAwardData = this.battleDestData.battleInfo[index]
        this.deadHeros = []
        this.deadEnemys = []
        if (this.isDungeonTeam()){
            this.dungeonHeads[this.battleIndex].setBattleState()
        }
        if (this.isUnionBoss() && this.unionTopItemBases == null){
            this.unionTopItemBases = []
            var itemIds = [200501,200502,200503]
            for (let index = 0; index < itemIds.length; index++) {
                const itemId = itemIds[index];
                var itemBase = Gm.ui.getNewItem(this.unionTopBoxNode)
                itemBase.node.scale = 0.7
                itemBase.updateItem({baseId:itemId,count:0})
                this.unionTopItemBases.push(itemBase)
            }
        }
        this.m_oAwardData.battleIndex = index

        if (this.m_oAwardData.isEmpty){
            this.refreshDungeonHead()
            this.nextBattle()
            return
        }
        if (this.m_oAwardData.type == ConstPb.battleType.BATTLE_PVP_ARENA){
            Gm.load.loadSpriteFrame("img/bossbattle/"+Gm.config.getBattleBg(this.m_oAwardData.type,1).picture,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oBackGround.getComponent(cc.Sprite))
        }else if(this.m_oAwardData.type == 0){//新手教学
            Gm.load.loadSpriteFrame("img/bossbattle/"+Gm.config.getBattleBg(0,0).picture,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oBackGround.getComponent(cc.Sprite))
        }else{
            if (this.battleDestData.mapId){
                var map = Gm.config.getMapById(this.battleDestData.mapId)
                console.log("map====:",map)
                if (map.bossMapId){
                    this.m_bIsBoss = true
                }
                // map = "bg_boss1"
                // console.log("地图"+this.battleDestData.mapId+"==:",Gm.userInfo.mapId,Gm.userInfo.getMaxMapId(true))

                Gm.load.loadSpriteFrame("img/bossbattle/"+map.picture,function(sp,icon){
                    icon.spriteFrame = sp
                },this.m_oBackGround.getComponent(cc.Sprite))
            }else{
                var map
                if (this.m_oAwardData.type == ConstPb.battleType.BATTLE_TOWER){
                    map = Gm.config.getBattleBg(this.m_oAwardData.type,Gm.config.getTower(this.m_oAwardData.towerId).group)
                }else{
                    map = Gm.config.getBattleBg(this.m_oAwardData.type,0)
                }

                if (map){
                    Gm.load.loadSpriteFrame("img/bossbattle/"+map.picture,function(sp,icon){
                        icon.spriteFrame = sp
                    },this.m_oBackGround.getComponent(cc.Sprite))
                }
            }
        }

        this.m_oRoundLab.string = Ls.get(6009)+"0/"+Gm.config.getConst("attribute_calc_value1")+Ls.get(6010)
        this.m_tSkillFab = {}
        this.m_tSkillFab[SKILL_BG] = SKILL_BG
        this.m_tBuffFab = {}
        this.m_tBuffFab[POWER_MAX] = POWER_MAX
        this.m_tBuffFab[FAZHEN] = FAZHEN
        this.m_tBuffFab[JIAXUE] = JIAXUE
        this.m_tBuffFab[JIALAN] = JIALAN
        var loadMax = 5
        var loadNum = 0
        // console.log("this.m_oAwardData==:",this.m_oAwardData)
        var self = this
        var tmpInsert = function(destStr,type){
            var tmpAry = null
            if (type == 0){
                tmpAry = self.m_tSkillFab
            }else if(type == 1){
                tmpAry = self.m_tBuffFab
            }
            if (destStr && destStr.length > 0){
                if (!tmpAry[destStr]){
                    loadMax = loadMax + 1
                }
                tmpAry[destStr] = destStr
            } 
        }
        for(const i in this.m_oAwardData.battleData.roleInfo){
            var tmpData = this.m_oAwardData.battleData.roleInfo[i]
            var tmpChar = null
            var tmpConfig = null
            if (tmpData.type == ConstPb.roleType.MONSTER){
                tmpConfig = Gm.config.getHero(0,Gm.config.getMonster(tmpData.baseId).heroQualityID)
            }else{
                tmpConfig = Gm.config.getHero(tmpData.baseId,tmpData.quality)
            }
            var skinConf = Gm.config.getSkin(tmpData.skin || tmpConfig.skin_id)
            if (skinConf==null){
                skinConf = Gm.config.getSkin(tmpConfig.skin_id)
            }
            if (skinConf.enlarge > 0){
                tmpInsert(skinConf.dwarf+"_boss",0)
            }else{
                tmpInsert(skinConf.dwarf,0)
            }
        }
        for(const i in this.m_oAwardData.battleData.actions){
            var skillId = this.m_oAwardData.battleData.actions[i].skillId
            if (skillId){
                var skillConfig = Gm.config.getSkill(skillId)
                if (skillConfig && skillConfig.buffEffect.length > 0){
                    tmpInsert(skillConfig.buffEffect,1)
                }
            }
            var buffInfo = this.m_oAwardData.battleData.actions[i].active.buffInfo
            if (buffInfo){
                for(const j in buffInfo){
                    var tmpBuf = Gm.config.getBuffWithId(buffInfo[j].buffId)
                    // console.log("buffInfo[j].buffId==:",buffInfo[j].buffId)
                    if (tmpBuf && tmpBuf.file.length > 0){
                        tmpInsert(tmpBuf.file,1)
                    }
                }
            }
            for(const j in this.m_oAwardData.battleData.actions[i].passive){
                for(const k in this.m_oAwardData.battleData.actions[i].passive[j].buffInfo){
                    var tmpBufId = this.m_oAwardData.battleData.actions[i].passive[j].buffInfo[k].buffId
                    var tmpBuf = Gm.config.getBuffWithId(tmpBufId)
                    // console.log("buffInfo[j].buffId==:",tmpBufId)
                    if (tmpBuf && tmpBuf.file.length > 0){
                        tmpInsert(tmpBuf.file,1)
                    }
                }
            }
        }
        var dealFab = function(table,destFrom){
            for(const i in table){
                // console.log("table[i]==:",i)
                Gm.load.loadFightEffect(i,destFrom,function(sp){
                    if (sp){
                        // console.log("==",sp._name)
                        table[sp._name] = sp
                        if (sp._name == FAZHEN){
                            self.m_oSkillShow.skeletonData = sp
                        }
                        loadNum = loadNum + 1
                        // console.log("loadNum===:",loadNum,loadMax)
                        if (loadNum == loadMax){
                            self.loadDone()
                        }
                    }else{
                        console.log(Ls.get(6008))
                    }
                },self.node)
            }
        }
        dealFab(this.m_tSkillFab,0)
        dealFab(this.m_tBuffFab,1)
        if (loadMax == 0){
            this.loadDone()
        }
    },
    loadDone:function(){
        this.select(TYPE_INIT)
        this.initPerson()
        this.initData(this.m_oAwardData.battleData)
        // console.log("this.m_tSkillFab==:",this.m_tSkillFab)
        this.updateTimeLab()
    },
    initPerson:function(){
        var self = this
        var tmpInit = function(destAry1,destAry2,destFab,destValue){
            var tmpCounts = 0
            for(const i in destAry1){
                Func.destroyChildren(destAry1[i])
                var tmpNode = cc.instantiate(destFab)
                var tmpHero = tmpNode.getComponent(destFab.name)
                tmpHero.node.parent = destAry1[i]
                tmpHero.updateAlive(false)
                tmpHero.setOwner(self,destValue,checkint(i))
                destAry2.push(tmpHero)
                tmpCounts = tmpCounts + 1
            }
        }
        this.m_tEnemyList = []
        tmpInit(this.m_tEnemyNode,this.m_tEnemyList,this.m_oHeroPerfab,1)
        if (this.isUnionBossFollow()){
            //公会BOSS ，己方不在重新加载
            return
        }
        this.m_tHeroList = []
        tmpInit(this.m_tHeroNode,this.m_tHeroList,this.m_oHeroPerfab,0)
    },
    isUnionBossFollow(){
        return this.isUnionBoss() && this.battleIndex > 0
    },
    initData:function(destData){
        this.m_iRoundIdx = 0
        this.m_iReadyCounts = 0
        this.m_iReadyNeedCounts = 0
        this.m_iRunIndex = 0
        this.m_oBattleData = destData
        for(const i in this.m_oBattleData.roleInfo){
            var tmpData = this.m_oBattleData.roleInfo[i]
            var tmpHero = this.getSeletPos(tmpData.pos)
            var tmpConfig = null
            if (tmpData.type == ConstPb.roleType.MONSTER){
                if (tmpData.quality > 0){
                    tmpConfig = Gm.config.getHero(0,tmpData.quality)
                }else{
                    tmpData.quality = Gm.config.getMonster(tmpData.baseId).heroQualityID
                    tmpConfig = Gm.config.getHero(0,tmpData.quality)
                }
            }else{
                tmpConfig = Gm.config.getHero(tmpData.baseId,tmpData.quality)
                if (this.isUnionBossFollow()){
                    continue
                }
            }
            this.m_iReadyNeedCounts = this.m_iReadyNeedCounts + 1
            tmpHero.setSkinId(tmpData.skin || tmpConfig.skin_id)
            tmpHero.updateConfig(tmpConfig,tmpData.maxHp,tmpData.maxMp,tmpData.level,tmpData.job)
            tmpHero.setJobId(tmpData.quality,tmpData.job)
            if (tmpData.hp){
                tmpHero.updateHp(tmpData.hp,tmpData.shield)
            }
            if (tmpData.mp){
                tmpHero.updateMp(tmpData.mp)
            }
        }
        if (YokeFunc.enemyBattleNeedCheckYoke(this.m_oAwardData.type)){
            this.updateYoke(true,false)
        }
        this.updateYoke(false,false)
    },
    playOnce:function(){
        if (this.m_iRunIndex != -2){
            this.m_iRunIndex = this.m_iRunIndex + 1
            // console.log("this.m_iRunIndex===:",this.m_iRunIndex)
            var tmpLens = this.m_oBattleData.actions.length
            if (this.m_iRunIndex == tmpLens){
                this.select(TYPE_DONE)
                this.openBalanceView()
            }else{
                this.resetDoneAll()
                var tmpAction = this.m_oBattleData.actions[this.m_iRunIndex]
                // console.log("tmpAction===:",tmpAction)
                // 更新回合数
                if (tmpAction){
                    // if (this.actionNow && this.actionNow.skillId == 1303106){
                    //     return
                    // }
                    if (this.m_iRoundIdx != tmpAction.round){
                        this.m_iRoundIdx = tmpAction.round
                        this.m_oRoundLab.string = Ls.get(6009)+tmpAction.round+"/"+Gm.config.getConst("attribute_calc_value1")+Ls.get(6010)
                        if (this.m_iRoundIdx >= this.m_iRoundMax && !this.m_bOverSix){
                            this.m_bOverSix = true
                            this.skipBtnActive(true)
                        }
                    }
                    this.transferAction(tmpAction)
                }
            }
        }
    },
    showNext:function(){
        this.getSeletPos(this.actionNow.active.pos).updateNext(false)
        var tmpNext = null
        for(var i = this.m_iRunIndex + 1;i < this.m_oBattleData.actions.length;i++){
            if (this.m_oBattleData.actions[i]){
                const tmpAction = this.m_oBattleData.actions[i]
                if (tmpAction.type == ConstPb.actionType.ACTION_ATTACK
                || tmpAction.type == ConstPb.actionType.ACTION_KEEP_ATTACK){
                    tmpNext = tmpAction.active.pos
                    for(const i in this.m_tHeroList){
                        if (checkint(i) == tmpNext - 1){
                            this.m_tHeroList[i].updateNext(true)
                        }else{
                            this.m_tHeroList[i].updateNext(false)
                        }
                    }
                    for(const i in this.m_tEnemyList){
                        if (checkint(i) == - tmpNext - 1){
                            this.m_tEnemyList[i].updateNext(true)
                        }else{
                            this.m_tEnemyList[i].updateNext(false)
                        }
                    }
                    break
                }
            }
        }
    },
    transferAction:function(action){
        console.log("action===:",action)
        this.actionNow = action
        
        // console.log("行动==:",this.actionNow.active.pos)
        this.m_bSuckPause = false // 技能吸血暂停
        this.m_bSkillMove = true
        this.m_bShowEffect = true
        // 攻击
        this.m_bAtDone = true // 完成攻击动画
        // 协防
        this.m_bDefDone = true // 
        // 敌人
        this.m_iPassLens = 0
        var tmpLens = {}
        this.skillConfig = null
        if (this.actionNow.skillId){
            this.skillConfig = Gm.config.getSkill(this.actionNow.skillId)
        }
        this.actionNow.passive.sort(function(a,b){
            if (a.pos == b.pos){
                return b.hp - a.hp
            }else{
                return Math.abs(a.pos) - Math.abs(b.pos)
            }
        })
        if (this.actionNow.active){
            for(const i in this.actionNow.passive){
                if (!tmpLens[this.actionNow.passive[i].pos]){
                    let tmpPas = this.actionNow.passive[i]
                    if (tmpPas.pos * this.actionNow.active.pos > 0){
                        tmpLens[tmpPas.pos] = true
                        this.m_iPassLens = this.m_iPassLens + 1
                    }else{
                        if (Func.isAtkEffect(tmpPas.effect.type)){
                            tmpLens[tmpPas.pos] = true
                            this.m_iPassLens = this.m_iPassLens + 1
                            if (tmpPas.effect.type == ConstPb.effectType.BE_HELP_DEFENSE){
                                this.m_bDefDone = false
                            }
                        }
                    }
                }
            }
        }
        this.m_iPassNums = 0
        if (this.m_iPassLens > 0){
            var active = this.getSeletPos(this.actionNow.active.pos,true)
            var tmpFirst = this.getSeletPos(this.actionNow.passive[0].pos)
            if (tmpFirst.m_iTtype != active.m_iTtype){
                this.m_bPsDone = false // 完成受伤动画
            }else{
                this.m_bPsDone = true
            }
        }else{
            if (this.actionNow.active.state == ConstPb.personState.PERSON_DEAD){
                this.m_iPassLens = 1
                this.m_bPsDone = false
            }else{
                this.m_bPsDone = true
            }
        }

        switch(action.type){
            case ConstPb.actionType.ACTION_RECOVER:
                this.showRecover()
            break
            case ConstPb.actionType.ACTION_BUFF:
                this.showBuff()
            break
            case ConstPb.actionType.ACTION_REDUCE:
                this.showReduce()
            break
            case ConstPb.actionType.ACTION_CATTACK:
            case ConstPb.actionType.ACTION_ATTACK:
            case ConstPb.actionType.ACTION_KEEP_ATTACK:
                this.m_bAtDone = false // 完成攻击动画
                this.showAttack()
            break
        }
    },
    showRecover:function(){
        var active = this.getSeletPos(this.actionNow.active.pos,true)
        if (this.actionNow.active.effect){
            active.showRecover(this.actionNow.active)
        }else{
            active.updatePerson(this.actionNow.active)
            active.showBuff(this.actionNow.active)
        }
        this.actionDoneAll()
    },
    showBuff:function(){
        var active = this.getSeletPos(this.actionNow.active.pos,true)
        active.updatePerson(this.actionNow.active)
        active.showBuff(this.actionNow.active)
        this.actionDoneAll()
    },
    showReduce:function(){
        var active = this.getSeletPos(this.actionNow.active.pos,true)
        if (this.actionNow.active.effect){
            active.showRecover(this.actionNow.active)
        }else{
            active.showBuff(this.actionNow.active)
        }
        this.actionDoneAll()
    },
    showIdle:function(){ // 展示立绘
        var active = this.getSeletPos(this.actionNow.active.pos,true)
        var self = this
        var lhui = this.m_oSkillIdle.getChildByName("lhui").getComponent(sp.Skeleton)
        var lhuicopy = this.m_oSkillIdle.getChildByName("lhuicopy").getComponent(sp.Skeleton)
        active.m_oBuffNode.active = false
        Gm.load.loadSkeleton(active.skinConf.rolePic,function(sp,owner){
            // var value = checkint(self.m_iTimesNum)
            var tmpAni = self.m_oSkillIdle.getComponent(cc.Animation)
            var clips = tmpAni.getClips()
            // for(const i in clips){
            //     clips[i].speed = value
            // }
            self.m_oSkillIdle.active = true

            lhui.skeletonData = sp
            lhui.setAnimation(0, "ziran", true)
            // lhui.timeScale = value
            lhuicopy.skeletonData = sp
            lhuicopy.setAnimation(0, "ziran", true)
            // lhuicopy.timeScale = value
            tmpAni.play(IDLE_STR[active.m_oData.camp])
        },lhui)
    },
    zoomLayer:function(pos,time,scale){
        // var times = 1
        var ac1 = cc.spawn(cc.moveTo(time,pos),cc.scaleTo(time,scale))
        this.m_oZoomNode.runAction(ac1)
        if (scale == 1){
            var active = this.getSeletPos(this.actionNow.active.pos,true)
            for(const i in this.m_tHeroList){
                if (this.m_tHeroList[i].node.active && 
                    this.m_tHeroList[i].node.opacity && 
                    this.m_tHeroList[i].node.opacity == 1){
                    this.m_tHeroList[i].node.opacity = 255
                }
            }
            for(const i in this.m_tEnemyList){
                if (this.m_tEnemyList[i].node.active && 
                    this.m_tEnemyList[i].node.opacity && 
                    this.m_tEnemyList[i].node.opacity == 1){
                    this.m_tEnemyList[i].node.opacity = 255
                }
            }
        }
        // this.m_oPersonNode.runAction(cc.sequence(ac1,cc.callFunc(()=>{
        //     console.log("?????")
        // })))
    },
    showSkillBg:function(skConf){
        if (skConf && skConf.skill_bg.length > 0){
            console.log("skConf.skill_bg===:",skConf.skill_bg)
            this.m_oSkillBg.node.active = true
            if (!this.m_oSkillBg.skeletonData){
                this.m_oSkillBg.skeletonData = this.m_tSkillFab[SKILL_BG]
            }
            this.m_oSkillBg.setAnimation(0,skConf.skill_bg,true)
        }else{
            this.m_oSkillBg.node.active = false
        }
    },
    showAttack:function(){
        this.showNext()
        var active = this.getSeletPos(this.actionNow.active.pos,true)
        var tmpData = this.m_oDealData = this.dealAttack(active,this.actionNow.skillId)
        var self = this
        console.log("showAttack===:",this.actionNow.skillId,this.m_oDealData.zoom)
        if (this.isSkill(this.actionNow.skillId) && this.m_oDealData.zoom){
            this.dealZorder(active.isEnemy(),active.m_iPosNum,true)
            var tmpFirst = false
            var isMid = 3
            var tmpCounts = [{total:"",count:0,front:false},{total:"",count:0,front:true}]
            if (this.m_iPassLens > 0){
                var tmpLens = {}
                for(var i = 0;i < this.actionNow.passive.length;i++){
                    var tmpPas = this.actionNow.passive[i].pos
                    var passive = this.getSeletPos(tmpPas)
                    if (i == 0){
                        tmpFirst = (passive.m_iTtype != active.m_iTtype)
                        if (!tmpFirst){
                            isMid = -1// 受击为敌方，站己方中间
                        }
                    }
                    if (!tmpLens[tmpPas]){
                        tmpLens[tmpPas] = true
                        if (tmpPas * tmpPas > 10){
                            tmpCounts[1].total = tmpCounts[1].total + (Math.abs(tmpPas) - 3)
                        }else{
                            tmpCounts[0].total = tmpCounts[0].total + Math.abs(tmpPas)
                        }
                    }
                }
            }
            if (tmpCounts[1].total.length == 0){
                tmpCounts[0].front = true
            }
            var isEnemy = active.m_iTtype == 1
            var tmpDone = null
            var hasIdle = false
            var tmpDoit = function(){
                self.m_bSkillMove = false
                self.m_oSkillBlack.active = true
                self.m_oUINode.active = false
                if (self.canIdle(active)){
                    hasIdle = true
                    tmpDone = function(){
                        var midPos = self.getSkillMove(isMid,isEnemy,true)
                        self.m_oSkillShow.node.active = true
                        self.m_oSkillShow.node.x = midPos.x
                        self.m_oSkillShow.node.y = midPos.y
                        self.m_oSkillShow.setAnimation(0,ZHEN_STR[active.m_oData.camp],true)
                        self.showIdle()
                    }
                }else{
                    tmpDone = function(){
                        self.showSkillBg(active.skinConf)
                        active.doAttack(tmpData)
                    }
                }
            }
            // console.log("tmpCounts===:",tmpCounts)
            var checkPas = function(pos,from){
                var tmpPos = null
                for(var j = 0;j < self.actionNow.passive.length;j++){
                    var passive = self.getSeletPos(self.actionNow.passive[j].pos)
                    if (passive.m_iPosNum == pos){
                        var tmpPas = self.actionNow.passive[j].pos
                        // console.log("tmpPas===:",tmpPas)
                        if (tmpPas * tmpPas > 10){
                            tmpPos = self.getSpeSkillMove(tmpCounts[1],from)
                            tmpCounts[1].count++
                        }else{
                            tmpPos = self.getSpeSkillMove(tmpCounts[0],from)
                            tmpCounts[0].count++
                        }
                        break
                    }
                }
                return tmpPos
            }
            var tmpSearch = function(destList){
                for(const i in destList){
                    if (active.m_iTtype == destList[i].m_iTtype){//己方阵营
                        if (active.m_iPosNum == destList[i].m_iPosNum){// 寻找自己
                            destList[i].skillMove(self.getSkillMove(isMid,isEnemy,true),null,tmpDone)
                            if (isMid == -1 && destList[i].skinConf.turn){
                                destList[i].m_oSkPerson.node.scaleX = -destList[i].m_oSkPerson.node.scaleX
                            }
                        }else{
                            if (!tmpFirst){ // 受击为同类
                                destList[i].skillMove(checkPas(destList[i].m_iPosNum,isEnemy))
                                if (hasIdle){
                                    destList[i].node.hasIdle = true
                                    destList[i].node.opacity = 1
                                }
                            }else{ // 受击为敌方，全部隐藏
                                destList[i].skillMove()
                            }
                        }
                    }else{//敌方阵营
                        if (tmpFirst){// 受击为敌方
                            destList[i].skillMove(checkPas(destList[i].m_iPosNum,!isEnemy))
                            if (hasIdle){
                                destList[i].node.hasIdle = true
                                destList[i].node.opacity = 1
                            }
                        }else{ // 敌方全部隐藏
                            destList[i].skillMove()
                        }
                    }
                }
            }
            active.setMpFlash(isEnemy?2:1)
            active.updateMp(0,function(){
                tmpDoit()
                tmpSearch(self.m_tHeroList)
                tmpSearch(self.m_tEnemyList)
            })
        }else{// 普通攻击
            this.dealZorder(active.isEnemy(),active.m_iPosNum,false)
            if (tmpData.def){
                var tmpPass = this.getSeletPos(tmpData.def.data.pos,true)
                if (tmpData.x && tmpData.y){
                    tmpPass.doDefense(tmpData)
                    active.doAttack(tmpData)
                }else{
                    tmpPass.doDefense(tmpData,function(){
                        active.doAttack(tmpData)
                    })
                }
            }else{
                active.doAttack(tmpData)
                if (tmpData.type == 0){
                    this.attackDone(active)
                }
            }
        }
    },
    getSpeSkillMove:function(tmpCounts,isEnemy){
        const special_move = {
            1:[0],
            2:[0],
            3:[0],
            12:[-0.5,0.5],
            23:[0.5,-0.5],
            13:[0.5,-0.5],
            123:[0,1,-1],
        }
        // const special_zindex = [[0],[2,1],[3,2,1]]
        const special_height = 160
        var tmpPos = null
        if (tmpCounts.front){
            tmpPos = this.getSkillMove(3,isEnemy,false)
        }else{
            tmpPos = this.getSkillMove(0,isEnemy,false)
        }
        var tmpY = special_height * special_move[tmpCounts.total][tmpCounts.count]
        // if (special_zindex[tmpCounts.total - 1][tmpCounts.count]){
        //     passive.node.parent.zIndex = special_zindex[tmpCounts.total - 1][tmpCounts.count]
        // }
        // console.log("tmpPos.x===:",tmpPos.x,tmpPos.scale,special_move[tmpCounts.total][tmpCounts.count])
        return {scale:tmpPos.scale,x:tmpPos.x,y:tmpY,z:tmpPos.z}
    },
    getSkillMove:function(destCount,isEnemy,isAttack){
        var tmpName = "hero"
        if (isEnemy){
            tmpName = "enemy"
        }
        if (destCount == -1){
            const pos = this.m_oSkillPos.getChildByName(tmpName+"3")
            return {x:0,y:0,scale:pos.scale}
        }
        if (isAttack){
            const pos = this.m_oSkillPos.getChildByName(tmpName+destCount)
            if (isEnemy){
                return {z:pos.zIndex,x:this.m_oSkillPos.getChildByName("hero"+destCount).x + this.m_oDealData.dis,y:pos.y,scale:pos.scale}
            }else{
                return {z:pos.zIndex,x:this.m_oSkillPos.getChildByName("enemy"+destCount).x + this.m_oDealData.dis,y:pos.y,scale:pos.scale}
            }
        }else{
            return this.m_oSkillPos.getChildByName(tmpName+destCount)
        }
    },
    doEffectAtk:function(skill,pos,callBack){
        if (this.m_tSkillFab[skill]){
            this.m_bShowEffect = false
            var tmpFab = new cc.Node()
            tmpFab.x = pos.act.x
            tmpFab.y = pos.act.y
            this.node.addChild(tmpFab)
            tmpFab.scale = this.m_oDealData.scale
            var tmpSk = tmpFab.addComponent(sp.Skeleton)
            tmpSk.skeletonData = this.m_tSkillFab[skill]
            // console.log("tmpSk.skeletonData===:",tmpSk.skeletonData)
            var active = this.getSeletPos(this.actionNow.active.pos)
            var atkSound = null
            var canDestroy = true
            var tmpHas = true
            var tmpSound = false
            if (this.isSkill(this.actionNow.skillId)){
                var tmpEffectName = "skill1"
                if (this.skillConfig.effect.length > 0){
                    console.log("==播放特殊==：",this.skillConfig.effect)
                    tmpEffectName = this.skillConfig.effect
                }
                tmpSk.setAnimation(0,tmpEffectName, false)
                const events = tmpSk.skeletonData.skeletonJson.animations[tmpEffectName].events
                if (events && events.length > 0){
                }else{
                    if (callBack){
                        callBack()
                    }
                }
                // console.log("events[i].name===:",events,tmpEffectName)
                for(const i in events){
                    if (events[i].name == "heal"){
                        this.m_bSuckPause = true
                    }else if(events[i].name == "sound"){
                        tmpSound = true
                    }
                }
                atkSound = active.skinConf.skill_impact_sound
                if (active.isBoss()){
                    tmpFab.scale = active.skinConf.enlarge
                }
            }else{
                atkSound = active.skinConf.attack_impact_sound
                if (pos.pas){//子弹
                    canDestroy = false
                    tmpSk.setAnimation(0,"trajectory",true)
                    tmpFab.scaleX = this.getPosScale(active.m_iPosNum)
                    var tan = (pos.pas.y - pos.act.y)/(pos.pas.x - pos.act.x)
                    tmpFab.angle = Math.atan(tan)/(Math.PI/180)
                    var tmpTime = active.getTimes(BULLET_TIME)
                    tmpFab.runAction(cc.sequence(cc.moveTo(tmpTime,cc.v2(pos.pas.x,pos.pas.y)),cc.callFunc(()=>{
                        canDestroy = true
                        tmpFab.angle = 0
                        tmpSk.setAnimation(0,"hit",false)
                        var hitevents = tmpSk.skeletonData.skeletonJson.animations["hit"].events
                        if (hitevents && hitevents.length > 0){
                        }else{
                            Gm.audio.playAtk(atkSound)
                            if (callBack){
                                callBack()
                            }
                        }
                    })))
                }else{
                    if (this.m_oDealData.type == 12){
                        tmpSk.setAnimation(0,"counter", false)
                    }else{
                        tmpSk.setAnimation(0,"attack1", false)
                    }
                }
            }
            tmpSk.timeScale = checkint(this.m_iTimesNum)
            var active = this.getSeletPos(this.actionNow.active.pos,true)
            if (pos.follow){
                tmpFab.scaleX = -tmpFab.scaleX
            }
            tmpSk.setEventListener((trackEntry, event) => {
                console.log("event.data.name===:",event.data.name)
                if (event.data.name == "hit"){
                    if (tmpHas){
                        tmpHas = false
                        if (!tmpSound){
                            Gm.audio.playAtk(atkSound)
                        }
                    }
                    this.shakeScreen()
                    if (callBack){
                        callBack()
                    }
                }
                if (event.data.name == "heal"){
                    active.m_oBuffNode.active = true
                    active.showRecover(this.actionNow.active)
                }
                if (event.data.name == "sound"){
                    Gm.audio.playAtk(atkSound)
                }
            })
            tmpSk.setCompleteListener((trackEntry) => {
                if (canDestroy){
                    tmpFab.removeFromParent(true)
                    tmpFab.destroy()
                    this.m_bShowEffect = true
                    this.actionDoneAll()
                }
            })
        }
    },
    dealAttack:function(active,skillId){
        var tmpPass = this.actionNow.passive[0] // 受击者
        if (!this.m_bDefDone){
            for(const i in this.actionNow.passive){
                if (this.actionNow.passive[i].effect.type == ConstPb.effectType.BE_HELP_DEFENSE){
                    tmpPass = this.actionNow.passive[i]
                    break
                }
            }
        }
        var tmpDef = null // 协防
        var _dis = 0 // 攻击距离
        var _insertSelf = false // 己方加buff，需要添加自己
        var isFollow = active.isEnemy()
        var tmpX = null
        var tmpY = null
        var activePos = active.m_iPosNum
        var tmpScale = this.getPosScale(activePos)
        var tmpChar = active.getCharacter()
        var tmpNonIdx = 0 // 位置不可见
        var _bullet = null//子弹
        var actionType = 1
        var hasZoom = true // 是否拽入技能场景
        var _boom = tmpChar.dwarf // 爆炸前景
        if (active.isBoss()){
            _boom = tmpChar.dwarf+"_boss"
        }
        if (this.isSkill(skillId)){//释放技能，根据技能有无弹道来判定移动
            if (this.skillConfig.special){
                hasZoom = false
                actionType = this.skillConfig.action
            }else{
                actionType = 3
            }
            if (active.isEnemy()){
                _dis = tmpChar.skill_distance
            }else{
                _dis = -tmpChar.skill_distance
            }
            tmpScale = 1
        }else{//普通攻击，根据职业属性判定移动
            if (this.actionNow.type == ConstPb.actionType.ACTION_CATTACK){
                actionType = 12//设定攻击动作为反击
            }
             _dis = tmpChar.attack_distance
            if (tmpPass && Func.isHurt(tmpPass.effect)){
                var passive = this.getSeletPos(tmpPass.pos)
                tmpScale = this.getPosScale(passive.m_iPosNum)
                tmpY = passive.node.parent.y
                if (passive.m_iPosNum > 2 && active.m_iPosNum != passive.m_iPosNum){
                    tmpNonIdx = -tmpPass.pos
                }
                if (tmpPass.effect.type == ConstPb.effectType.BE_HELP_DEFENSE){
                    for(let idx = 0;idx < this.actionNow.passive.length;idx++){
                        const pasOne = this.actionNow.passive[idx]
                        if (pasOne.effect.type != ConstPb.effectType.BE_HELP_DEFENSE){
                            tmpDef = {data:pasOne}
                            tmpDef.y = tmpY
                            if (passive.isEnemy()){
                                tmpDef.x = passive.getPartX() - DEF_WIDTH * tmpScale
                            }else{
                                tmpDef.x = passive.getPartX() + DEF_WIDTH * tmpScale
                            }
                            break
                        }
                    }
                }
                if (tmpChar.attack_distance){ // 需要移动的人
                    if (passive.isEnemy()){
                        tmpX = passive.getPartX() - _dis * tmpScale
                    }else{
                        tmpX = passive.getPartX() + _dis * tmpScale
                    }
                    if (passive.m_iPosNum > 2 && passive.m_iPosNum == activePos){
                        tmpX = null
                        tmpY = null
                    }
                }
            }
        }
        if (this.actionNow.active.effect && 
            (this.actionNow.active.effect.type == ConstPb.effectType.EFFECT_SUCK_HP || 
            this.actionNow.active.effect.type == ConstPb.effectType.EFFECT_HEAL_HP2)){
            _insertSelf = true
        }
        // console.log("tmpAtkType===:",tmpAtkType,tmpBomType,isFollow,dataPassive.effect.type)
        return {x:tmpX,y:tmpY,boom:_boom,
            follow:isFollow,dis:_dis,
            type:actionType,
            insAct:_insertSelf,
            scale:tmpScale,
            nonIdx:tmpNonIdx,
            zoom:hasZoom,
            def:tmpDef}
    },
    /////////////////
    dealZorder:function(fromEnemy,activePos,isMin){
        var top = 10
        var list = [1,4,3,0,2,5]
        for(const i in list){
            if (fromEnemy){//敌人攻击
                this.m_tHeroNode[list[i]].zIndex = i
                this.m_tEnemyNode[list[i]].zIndex = top + i
            }else{// 英雄攻击
                this.m_tHeroNode[list[i]].zIndex = top + i
                this.m_tEnemyNode[list[i]].zIndex = i
            }
        }
        if (fromEnemy){
            for(const i in this.m_tEnemyList){
                if (this.m_tEnemyList[i].m_iPosNum == activePos){
                    if (isMin){
                        this.m_tEnemyList[i].node.parent.zIndex = cc.macro.MIN_ZINDEX
                    }else{
                        this.m_tEnemyList[i].node.parent.zIndex = cc.macro.MAX_ZINDEX
                    }
                    break
                }
            }
        }else{
            for(const i in this.m_tHeroList){
                if (this.m_tHeroList[i].m_iPosNum == activePos){
                    if (isMin){
                        this.m_tHeroList[i].node.parent.zIndex = cc.macro.MIN_ZINDEX
                    }else{
                        this.m_tHeroList[i].node.parent.zIndex = cc.macro.MAX_ZINDEX
                    }
                    break
                }
            }
        }
    },
    sendBullet:function(){
        if (this.bulletList){
            var active = this.getSeletPos(this.actionNow.active.pos)
            var shoot = active.getShoot()
            var isHalf = active.isHalf()
            var tmpNum = 0
            var tmpMax = 0
            var self = this
            var tmpDone = function(name){
                tmpNum++
                if (tmpNum == tmpMax && self.bulletCall){
                    self.bulletCall()
                }
            }
            for(const i in this.bulletList){
                let passive = this.getSeletPos(this.bulletList[i].pos)
                tmpMax++
                this.doEffectAtk(this.m_oDealData.boom,{
                    follow:this.m_oDealData.follow,
                    act:shoot,
                    pas:{x:passive.getPartX(),y:passive.getPartHalfY(isHalf)},

                },tmpDone)
            }
        }
    },
    doAttack:function(){
        var buff = null
        var passList = []
        if (this.skillConfig){
            buff = this.skillConfig.buffEffect
            passList = this.skillConfig.innerAttack.split("|")
        }
        // console.log("this.m_iPassLens==:",this.m_iPassLens,passList)
        var active = this.getSeletPos(this.actionNow.active.pos)
        var self = this
        var tmpHurtList = []//{{{pos,idx,effect},{pos,idx,effect}}}
        var tmpHurtCounts = 0
        var hurtCount = 0
        var noNumber = (this.isSkill(this.actionNow.skillId) && this.m_oDealData.zoom)
        if (this.m_iPassLens > 0){
            if (passList.length > 1){//此处为多段攻击，根据策划配置
                for(const i in this.actionNow.passive){
                    this.getSeletPos(this.actionNow.passive[i].pos).setHurtCount(passList.length,noNumber)
                    var total = this.actionNow.passive[i].effect.value
                    for(var j = 0;j < passList.length;j++){
                        var data = Func.copyObj(this.actionNow.passive[i])
                        if (!tmpHurtList[j]){
                            tmpHurtList.push([])
                        }
                        data.effect.value = Math.ceil(total*Number(passList[j])/10000)
                        // console.log("passList[j]===:",passList[j],data.effect.value)
                        tmpHurtList[j].push({pos:data.pos,data:data})
                    }
                }
            }else{
                tmpHurtList[0] = []
                for(const i in this.actionNow.passive){
                    let data = this.actionNow.passive[i]
                    this.getSeletPos(data.pos).setHurtCount(1,noNumber)
                    tmpHurtList[0].push({pos:data.pos,idx:i})
                }
            }
        }
        console.log("tmpHurtList===:",tmpHurtList)
        var tmpCallBack = function(){
            if (tmpHurtList[tmpHurtCounts]){
                for(const i in tmpHurtList[tmpHurtCounts]){
                    let data = tmpHurtList[tmpHurtCounts][i].data
                    if (tmpHurtList[tmpHurtCounts][i].idx){
                        data = self.actionNow.passive[tmpHurtList[tmpHurtCounts][i].idx]
                    }
                    let passive = self.getSeletPos(tmpHurtList[tmpHurtCounts][i].pos)
                    passive.showJustBuff(buff)
                    passive.doHurt(data,noNumber)
                }
                tmpHurtCounts = tmpHurtCounts + 1
            }
            if (tmpHurtList.length == tmpHurtCounts && self.m_oDealData.insAct && !self.m_bSuckPause){
                active.m_oBuffNode.active = true
                active.showJustBuff(buff)
                active.showRecover(self.actionNow.active)
            }
        }
        if (this.skillConfig && this.skillConfig.effectType){
            var tmpNum = 0
            var tmpMax = this.m_iPassLens.length
            var tmpDone = function(){
                tmpNum++
                if (tmpNum == tmpMax){
                    tmpCallBack()
                }
            }
            var isHalf = active.isHalf()
            for(const i in tmpHurtList[tmpHurtCounts]){
                let passive = this.getSeletPos(tmpHurtList[tmpHurtCounts][i].pos)
                this.doEffectAtk(this.m_oDealData.boom,{
                    follow:this.m_oDealData.follow,
                    act:{x:passive.getPartX(),y:passive.getPartHalfY(isHalf)},
                },tmpDone)
            }
        }else{
            this.doEffectAtk(this.m_oDealData.boom,{
                follow:this.m_oDealData.follow,
                act:{x:active.getPartX(),y:active.getPartY()},
            },tmpCallBack)
        }

        if (noNumber){
            this.zoomLayer(cc.v2(0,0),active.getAtkTime(),1)
            Gm.audio.playAtk(active.skinConf.skill_sound)
        }else{
            this.bulletList = tmpHurtList[tmpHurtCounts]
            this.bulletCall = tmpCallBack
            Gm.audio.playAtk(active.skinConf.attack_sound)
        }
    },
    /////////////////
    activeNonIdx:function(isBack){
        if (this.m_oDealData.nonIdx){
            var tmpNone = this.getSeletPos(this.m_oDealData.nonIdx)
            tmpNone.activeNonIdx(isBack)
        }
    },
    resetDoneAll:function(){
    },
    attackDone:function(hero){
        // console.log("attackDone===:",this.m_iPassLens,this.m_bSkillMove)
        var active = this.getSeletPos(this.actionNow.active.pos)
        if (active.isSameOne(hero)){
            active.m_oBuffNode.active = true
            if (!this.m_oDealData.insAct){
                active.showRecover(this.actionNow.active)
            }
            this.m_bAtDone = true
            this.actionDoneAll()
        }
    },
    hurtDone:function(hero){
        // console.log("hurtDone===:",this.m_iPassLens,this.m_bSkillMove)
        if (this.actionNow.passive.length > 0){
            for(var i = 0;i < this.actionNow.passive.length;i++){
                var tmpPas = this.actionNow.passive[i].pos
                var passive = this.getSeletPos(tmpPas)
                if (passive.isSameOne(hero)){
                    this.m_iPassNums = this.m_iPassNums + 1
                    console.log("this.m_iPassNums===:",this.m_iPassNums,this.m_iPassLens)
                    if (this.m_iPassNums == this.m_iPassLens){
                        this.m_iPassNums = 0
                        this.m_bPsDone = true
                        if (this.m_bDefDone){
                            this.actionDoneAll()
                        }else{
                            var tmpPass = this.getSeletPos(this.m_oDealData.def.data.pos,true)
                            tmpPass.defenseDone()
                        }
                    }
                    break
                }
            }
        }else{
            var active = this.getSeletPos(this.actionNow.active.pos)
            if (active.isSameOne(hero)){
                this.m_bPsDone = true
                this.actionDoneAll()
            }
        }
    },
    defenseDone:function(hero){
        for(const i in this.actionNow.passive){
            let tmpPas = this.actionNow.passive[i]
            var passive = this.getSeletPos(tmpPas.pos)
            if (passive.isSameOne(hero)){
                this.m_bDefDone = true
                this.actionDoneAll()
                break
            }
        }
    },
    skillDone:function(){
        var tmpMax = 0
        var tmpNum = 0
        var self = this
        var tmpDone = function(){
            tmpNum = tmpNum + 1
            // console.log("???==skillDone==:",tmpNum,tmpMax)
            if (tmpNum == tmpMax){
                for(var i = 0;i < self.actionNow.passive.length;i++){
                    var passive = self.getSeletPos(self.actionNow.passive[i].pos)
                    passive.doHurt(self.actionNow.passive[i])
                }
                self.m_bSkillMove = true
                self.actionDoneAll()
            }
        }
        this.dealZorder(true,-1)
        this.dealZorder(false,-1)
        for(const i in this.m_tHeroList){
            if (this.m_tHeroList[i].node.active && this.m_tHeroList[i].node.opacity){
                tmpMax = tmpMax + 1
            }
            this.m_tHeroList[i].skillMove({x:0,y:0},tmpDone)
        }
        for(const i in this.m_tEnemyList){
            if (this.m_tEnemyList[i].node.active && this.m_tEnemyList[i].node.opacity){
                tmpMax = tmpMax + 1
            }
            this.m_tEnemyList[i].skillMove({x:0,y:0},tmpDone)
        }
    },
    insertAttack:function(action){
        this.cattact = action
        this.waitcattack = true
    },
    actionDoneAll:function(){
        // console.trace()
        console.log("actionDoneAll===:",this.m_bAtDone,this.m_bPsDone,this.m_bSkillMove,this.m_bDefDone,this.m_bShowEffect)
        if (this.m_bAtDone && this.m_bShowEffect && this.m_bPsDone && this.m_bSkillMove && this.m_bDefDone){
            if (this.waitcattack){
                console.log("插入反击====")
                this.waitcattack = false
                this.transferAction(this.cattact)
            }else{
                if (this.isSkill(this.actionNow.skillId)){
                    this.showSkillBg()
                    this.m_oSkillBlack.active = false
                    this.m_oUINode.active = true
                    const tmpWaitTime = Gm.config.getConst("animation_time_again_skill")
                    this.scheduleOnce(()=>{
                        this.playOnce()
                    },tmpWaitTime)
                }else{
                    this.playOnce()
                }
            }
        }else{
            if (this.m_bAtDone && this.m_bShowEffect && !this.m_bSkillMove){
                this.skillDone()
            }
        }
    },
    /////////////////
    getSeletPos:function(destPos){
        if (destPos > 0){
            return this.m_tHeroList[destPos - 1]
        }else{
            return this.m_tEnemyList[-destPos - 1]
        }
    },
    getAtkType:function(destHero){
        var tmpJob = destHero.m_iJob
        if (!tmpJob){
            tmpJob = destHero.m_oData.job
        }
        return Gm.config.getJobWithId(tmpJob).attribute
    },
    readyFight:function(){
        this.m_iReadyCounts = this.m_iReadyCounts + 1
        console.log("this.m_iReadyCounts==:",this.m_iReadyCounts,this.m_iReadyNeedCounts)
        if (this.m_iReadyCounts == this.m_iReadyNeedCounts){
            this.skipBtnActive(true)
            this.select(TYPE_PLAY)
            this.m_iReadyCounts = 0
            this.m_iRunIndex = -1
            var tmpAni = this.m_oStartEffect.getComponent(cc.Animation)
            this.m_oStartEffect.active = true
            if (this.m_bIsBoss){
                tmpAni.play("battleboss")
                Gm.audio.playEffect("music/33_boss_coming")
            }else{
                tmpAni.play("battleStart")
                Gm.audio.playEffect("music/27_battle_start")
            }
        }
    },
    select:function(type){
        if (this.selectType != type){
            // console.log(Ls.get(6011),this.selectType)
            this.selectType = type
        }
    },
    /////////////////
    getPowerMax:function(){
        return this.getBuffByName(POWER_MAX)
    },
    getJiaXue:function(){
        return this.getBuffByName(JIAXUE)
    },
    getJiaLan:function(){
        return this.getBuffByName(JIALAN)
    },
    getBuffByName:function(name){
        return this.m_tBuffFab[name]
    },
    cheackBtn:function(type,isTips){
        var tmpVip = Gm.config.getVip()
        if (type == 1){
            var tmpMap = Gm.config.getConst("double_battle_level")
            if (Gm.userInfo.mapId >= tmpMap || (tmpVip.combatMode.length >= 1)){
                return true
            }else{
                if (isTips){
                    Gm.floating(Ls.get(40017))
                }
                return false
            }
        }else{
            var tmpCan = false
            if (this.battleDestData.isRecord || this.m_bOverSix){
                tmpCan = true
            }else{
                if (this.m_oAwardData.type == ConstPb.battleType.BATTLE_PVP_ARENA){
                    var lostTime = checkint(Gm.config.getConst("jump_arean_scene"))
                    if (lostTime >= Gm.userInfo.maxMapId || Gm.userInfo.vipLevel >= 2){
                        tmpCan = true
                    }
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_TOWER){
                    // var lostTime = checkint(Gm.config.getConst("jump_tower_scene"))
                    // if (lostTime >= Gm.userInfo.maxMapId || Gm.userInfo.vipLevel >= 2){
                    //     tmpCan = true
                    // }
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_ALLIANCE_BOSS){
                    var lostTime = checkint(Gm.config.getConst("jump_guild_scene"))
                    if (lostTime >= Gm.userInfo.maxMapId || Gm.userInfo.vipLevel >= 2){
                        tmpCan = true
                    }
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_DUNGEON_ONE){
                    // if (!this.battleDestData.isStart){
                    //     tmpCan = true
                    // }
                    tmpCan = true
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_PVE_BOSS || 
                         this.m_oAwardData.type == ConstPb.battleType.BATTLE_PVE_MONSTER){
                    var tmpMap = Gm.config.getConst("skip_battle_level")
                    if (Gm.userInfo.mapId >= tmpMap || (tmpVip.combatMode.length >= 2)){
                        var map = Gm.config.getMapById(Gm.userInfo.mapId)
                        if (map.mapType != 2){
                            tmpCan = true
                        }
                    }
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_WORLD){
                    tmpCan = true
                }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_PICTURE){
                    tmpCan = true
                }
            }
            return tmpCan
        }
    },
    onJumpClick:function(){
        if(!this.cheackBtn(2,true)){
            return
        }
        this.m_iRunIndex = -2
        this.openBalanceView()
    },
    openBalanceView(){
        this.skipBtnActive(false)
        if (this.isUnionBoss() ){ //公会BOSS
            this.unionDropBox()
            if(this.isNextBattle()){
                return
            }
        }else{
            Gm.send(Events.GUIDE_RESUME)
            var self = this
            this.scheduleOnce(()=>{
                    self.refreshDungeonHead()
                    if (this.m_oAwardData.type == 0){//新手教学战斗
                        console.log("新手战斗完成")
                        Gm.send(Events.GUIDE_DONE)
                        Gm.scene.loseBattle(0)
                        Gm.scene.leaveBattle()
                    }else if(this.m_oAwardData.type == ConstPb.battleType.BATTLE_PVP_ARENA){
                        if (Gm.arenaData.m_iOwnScore){
                            Gm.ui.create("BalanceView",self.m_oAwardData)
                        }else{
                            Gm.scene.leaveBattle()
                        }
                    }else if(this.m_oAwardData.type == 99){//假战斗,type是由客户端自定义的
                        console.log("累充战斗完成")
                        Gm.scene.leaveBattle()
                    }else{
                        Gm.ui.create("BalanceView",self.m_oAwardData)
                    }
            },Gm.config.getConst("animation_time_win"))
        }
        var tmpHas = true
        var playSound = this.m_oAwardData.type > 0
        if (this.m_oAwardData.fightResult == 0){ // 输了
            for(const i in this.m_tEnemyList){
                if (this.m_tEnemyList[i].m_oData && this.m_tEnemyList[i].m_oInfoNode.active){
                    this.m_tEnemyList[i].hideInfo()
                    this.m_tEnemyList[i].changeRunType(9)
                }
            }
            for(const i in this.m_tHeroList){
                if (this.m_tHeroList[i].m_oData){
                    if (tmpHas && Func.random(0,1000)%2 == 0 && playSound){
                        Gm.audio.playDub(this.m_tHeroList[i].skinConf.voc012)
                        tmpHas = false
                    }
                    this.m_tHeroList[i].node.active = false
                }
            }
        }else{ // 赢了
            for(const i in this.m_tHeroList){
                if (this.m_tHeroList[i].m_oData && this.m_tHeroList[i].m_oInfoNode.active){
                    if (tmpHas && Func.random(0,1000)%2 == 0 && playSound){
                        Gm.audio.playDub(this.m_tHeroList[i].skinConf.voc010)
                        tmpHas = false
                    }
                    this.m_tHeroList[i].hideInfo()
                    this.m_tHeroList[i].changeRunType(9)
                }
            }
            for(const i in this.m_tEnemyList){
                if (this.m_tEnemyList[i].m_oData){
                    this.m_tEnemyList[i].node.active = false
                }
            }
        }
    },
    refreshDungeonHead(){
        if (this.isDungeonTeam()){
            this.dungeonHeads[this.battleIndex].setBattleState(this.m_oAwardData.fightResult)
        }
    },
    onTimeClick:function(){
        if(!this.cheackBtn(1,true)){
            return
        }
        this.m_iTimesNum = this.m_iTimesNum + 1
        if (this.m_iTimesNum > MAX_TIME){
            this.m_iTimesNum = 1
        }
        Gm.userData.setFightSpeed(this.m_iTimesNum)
        this.updateTimeLab()
    },
    getMaxTime:function(){

    },
    getTimeLab:function(){
        if (this.m_iTimesNum){
            return MAX_TIME - this.m_iTimesNum + 1
        }else{
            return MAX_TIME
        }
    },
    updateTimeLab:function(){
        this.m_oTimesLab.string = "x"+this.m_iTimesNum
        var tmpTime = checkint(this.m_iTimesNum)
        for(const i in this.m_tHeroList){
            this.m_tHeroList[i].m_oSkPerson.timeScale = tmpTime
        }
        for(const i in this.m_tEnemyList){
            this.m_tEnemyList[i].m_oSkPerson.timeScale = tmpTime
        }
        this.m_oSkillShow.timeScale = tmpTime
    },
    getPosScale:function(destPos){
        if (pos_scale[destPos]){
            return pos_scale[destPos]
        }
        return 1
    },
    getBoxByItemId(itemId){
        for (let index = 0; index < this.unionTopItemBases.length; index++) {
            const v = this.unionTopItemBases[index];
            if (v.data.baseId == itemId){
                return v
            }
        }
    },
    unionDropBox(){
        for(const i in this.m_tHeroList){
            if (this.m_tHeroList[i].m_oData && this.m_tHeroList[i].m_oInfoNode.active){
                this.m_tHeroList[i].changeRunType(7)
            }
        }

        if(this.m_oAwardData.fightResult == 1){
            var monsterGroupId = this.m_oAwardData.monsterGroupId
            var conf = Gm.config.getUnionBossGroup(monsterGroupId)
            var endDeadFight = this.getEndDead(true)
            var posNum = endDeadFight?endDeadFight.m_iPosNum:0
            var fightPos = this.m_tEnemyNode[posNum].position

            for (let index = 0; index < conf.dropBox.length; index++) {
                const v = conf.dropBox[index];
                var itemBase = Gm.ui.getNewItem(this.m_oUINode)
                itemBase.node.scale = 0.7
                itemBase.node.x = fightPos.x
                itemBase.node.y = fightPos.y
                itemBase.updateItem({baseId:v.id,count:0})

                this.moveBox(itemBase,this.getBoxByItemId(v.id))
            }
        }
        this.scheduleOnce(()=>{
            this.isDropBox = false
            if(this.isNextBattle()){
                this.nextBattle()
            }else{
                var list = []
                for (let i = 0; i < this.battleDestData.battleInfo.length; i++) {
                    const v = this.battleDestData.battleInfo[i];
                    if (v.fightResult == 1){
                        var conf = Gm.config.getUnionBossGroup(v.monsterGroupId)
                        for (let j = 0; j < conf.reward.length; j++) {
                            const vj = conf.reward[j];
                            list.push({itemType:vj.type,baseId:vj.id,itemCount:vj.num})
                        }
                    }
                }
                this.m_oAwardData.award = {drop:{item:list}}
                Gm.ui.create("BalanceView",this.m_oAwardData)
            }
       },1)
    },
    moveBox(itemBase,endBox){
        var endPos = this.m_oUINode.convertToNodeSpaceAR(endBox.node.convertToWorldSpaceAR(cc.v2(0,0)))
        var moveTime  = cc.v2(itemBase.node.x,itemBase.node.y).sub(endPos).mag()/1000
        var delayAc = cc.delayTime(0.1*1)
        var ac = cc.moveTo(moveTime,endPos).easing(cc.easeQuarticActionInOut())
        var func = cc.callFunc((aa)=>{
            aa.removeFromParent(true)
            aa.destroy()
            endBox.data.count = endBox.data.count + 1
            endBox.updateCount()
        });
        var acs = cc.sequence(delayAc,ac,func)
        itemBase.node.runAction(acs)
    },
    pushDead(fightHero){
        if(fightHero){
            var list = this.deadHeros
            if (fightHero.isEnemy()){
                list = this.deadEnemys
            }
            list.push(fightHero)
        }
    },
    getEndDead(isEnemy){
        var list = this.deadHeros
        if (isEnemy){
            list = this.deadEnemys
        }
        if (list.length > 0){
            return list[list.length -1]
        }
    },
    skipBtnActive(isShow){
        this.m_bSpPaused = !isShow
        if (isShow){
            isShow = this.cheackBtn(2)
        }
        this.skipBtn.active = isShow
    },
    onTeamHeroYoke:function(){
        this.updateYoke(false,true)
    },
    onTeamEnemyYoke:function(){
        this.updateYoke(true,true)
    },
    updateYoke:function(isEnmey,isView){
        if(!isView){
            var data = this.calculationEnmeyYoke(isEnmey)
            var tmpFire = []
            for(const i in data.data){
                if (data.data[i]){
                    var group = YokeFunc.calculationYokeOne(i-1).group
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
            var icon = this.m_oLightNod1
            var part = this.m_oLightNod1.getChildByName("kuang3").getComponent(cc.ParticleSystem)
            var ani = this.m_oLitAni1
            if (isEnmey){
                icon = this.m_oLightNod2
                part = this.m_oLightNod2.getChildByName("kuang3").getComponent(cc.ParticleSystem)
                ani = this.m_oLitAni2
            }
            if (tmpFire.length > 0){
                ani.play("FightTeamView_Loop")
                part.resetSystem()
                icon.getChildByName("none").active = false
                icon.getChildByName("icon").active = true
            }else{
                ani.setCurrentTime(0)
                ani.stop()
                part.stopSystem()
                icon.getChildByName("none").active = true
                icon.getChildByName("icon").active = false
            }
            for(var i = 1;i < 5;i++){
                icon.getChildByName("shan"+i).active = (i <= tmpFire.length)
            }
            return
        }
        var data = {none:true}
        if(isEnmey){//敌人
            if(YokeFunc.enemyBattleNeedCheckYoke(this.battleDestData.battleInfo[0].type)){
                data = this.calculationEnmeyYoke(isEnmey)
            }
            data.type = this.battleDestData.battleInfo[0].type
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
        var heroData = []
        for(var  i =0;i< this.battleDestData.battleInfo[0].battleData.roleInfo.length;i++){
            var hero = this.battleDestData.battleInfo[0].battleData.roleInfo[i]
             if(isEnmey){
                 if(hero.pos<0){
                     heroData.push(hero)
                 }
             }
             else{
                 if(hero.pos>0){
                    heroData.push(hero)
                 }
             }
        }
        var data = YokeFunc.calculationYokeForBattleData(heroData)
        var yokes = YokeFunc.calculationYokeShowIds(data,true)
        return {data:yokes.ids,heroData:heroData,none:yokes.none}
    },
    getBuffLab:function(person,conf){
        if (Gm.userData.battleText){
            var tmpNode = cc.instantiate(this.m_oBuffLab)
            var ttf = tmpNode.getChildByName("lay").getChildByName("lab").getComponent(cc.Label)
            ttf.node.active = true
            // console.log("添加buff===:",conf.name)
            ttf.string = conf.name
            if (conf.name_color && conf.name_color.length > 0){
                var color = conf.name_color.split("_")
                ttf.node.color = cc.color(color[0],color[1],color[2])
            }
            this.node.addChild(tmpNode,cc.macro.MAX_ZINDEX)
            tmpNode.x = person.getPartX()
            tmpNode.y = person.getPartY() + person.m_oSkPerson.node.height/2
            return tmpNode
        }
    },
    getHurtLab:function(person,destType,destValue){
        if (!EFFECT_IDX[destType]){
            return null
        }
        var tmpNode = cc.instantiate(this.m_oHurtLab)
        var ttf = tmpNode.getChildByName("lay").getChildByName("lab").getComponent(cc.Label)
        var tmpIdx = EFFECT_IDX[destType]
        if (tmpIdx.res >= 0){
            ttf.node.active = true
            if (tmpIdx.res == 2 && destType != ConstPb.effectType.EFFECT_REDUCE_HP){
                var active = this.getSeletPos(this.actionNow.active.pos,true)
                if (active.m_oData && active.m_oData.job%2 == 0){//检测伤害，2物理，4魔法
                    ttf.font = this.m_tNumRes[4]
                }else{
                    ttf.font = this.m_tNumRes[2]
                }
            }else{
                ttf.font = this.m_tNumRes[tmpIdx.res]
            }
            ttf.string = destValue
        }else{
            ttf.node.active = false
        }
        var spr = tmpNode.getChildByName("lay").getChildByName("spr").getComponent(cc.Sprite)
        if (tmpIdx.spr >= 0){
            spr.node.active = true
            spr.spriteFrame = this.m_tNumSpr[tmpIdx.spr]
        }else{
            spr.node.active = false
        }
        this.node.addChild(tmpNode,cc.macro.MAX_ZINDEX)
        tmpNode.x = person.getPartX()
        tmpNode.y = person.getPartY() + person.m_oSkPerson.node.height/2
        return tmpNode
    },
    getNewEF:function() {
        return new efList()
    },
    shakeScreen:function(){
        if (this.isSkill(this.actionNow.skillId)){
            var tmpValue = this.skillConfig.shake.split("|")
            var tmpTime = checkint(tmpValue[0])
            if (tmpTime){
                tmpTime = tmpTime / this.m_iTimesNum
                var tmpAdds = SHAKE_TIME/this.m_iTimesNum
                var tmpSk = checkint(tmpValue[1])
                var tmpWidth = 2 * tmpSk
                var tmpLostX = 0
                var tmpHeight = 2 * tmpSk
                var tmpLostY = 0
                var shakeList = new Array()
                for(var i = 0;i < tmpTime;i+=SHAKE_TIME){
                    var tmpX = Func.random(tmpLostX,tmpWidth)
                    var tmpY = Func.random(tmpLostY,tmpHeight)
                    tmpLostX = tmpWidth - tmpX
                    tmpLostY = tmpHeight - tmpY
                    shakeList.push(cc.moveTo(SHAKE_TIME/1000,cc.v2(tmpX - tmpSk,tmpY - tmpSk)))
                }
                shakeList.push(cc.callFunc( ()=>{
                    this.node.x = 0
                    this.node.y = 0
                }))
                this.node.runAction(cc.sequence(shakeList))
            }
        }
    },
    canIdle:function(active){
        if (active.m_oData.show_control == 0 && 
            Gm.userData.skillLihui && 
            // this.m_iTimesNum == 1 &&
            (!active.isEnemy())
        ){
            return true
        }
        return false
    },
    isSkill:function(skillId){
        if (!skillId){
            return false
        }
        var conf = Gm.config.getSkill(skillId)
        // console.log("isSkill===:",skillId,conf.skillType)
        if (conf && conf.skillType == 0){
            return true
        }
        return false
    },
    setUserInfoNode(){
        if(this.battleDestData.battleInfo[0].hegemonyData && this.battleDestData.battleInfo[0].hegemonyData.atkpidname){
            this.m_oUserInfoNode.active = true
            this.m_oUserInfoNode.getChildByName("atkName").getComponent(cc.Label).string = this.battleDestData.battleInfo[0].hegemonyData.atkpidname
            this.m_oUserInfoNode.getChildByName("defName").getComponent(cc.Label).string = this.battleDestData.battleInfo[0].hegemonyData.defpidname
        }
    }
});

