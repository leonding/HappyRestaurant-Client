// HeroBase
const TYPE_HERO = 0
const TYPE_ENEY = 1
const MAX_HP = 8
const MAX_MP = 6

const ATTACK_WID = 30
const ATTACK_HEI = 15
const ACTION_TIM = 0.5

const ATK_TIM1 = 0.12//攻击前进时间
const ATK_TIM2 = 0.12//回退时间

const ZOM_TIM = 0.15

const HUT_TIM1 = 0.1//受伤后退
const HUT_TIM2 = 0.2//受伤复位

const WIT_TIM1 = 0.3//回合等待时间

const MOTION_ATK1   = 1
const MOTION_ATK2   = 2
const MOTION_SKIL   = 3
const MOTION_BUFF   = 4
const MOTION_HURT   = 5
const MOTION_DEAD   = 6
const MOTION_IDLE   = 7
const MOTION_RUN    = 8
const MOTION_WIN    = 9
const MOTION_BLOCK  = 10//格挡
const MOTION_MISS   = 11//闪避
const MOTION_CONTER = 12//反击
const MOTION_EFFECT = 13//被动技能特殊动作
const MOTION_START  = 14//开始动作

const MAX_HP_WID = 79

cc.Class({
    extends: cc.Component,

    properties: {
        m_oSkPerson:sp.Skeleton,
        m_oHMNode:cc.Node,
        m_oHPBar:cc.Node,
        m_oMPBar:cc.ProgressBar,
        m_oLvNmLab:cc.Label,
        m_oSkillLab:cc.Label,
        m_oBuffNode:cc.Node,
        m_oTeamSprite:cc.Sprite,

        m_oIconList:cc.Node,
        m_oBuffPerfab:cc.Prefab,

        m_oInfoNode:cc.Node,
        m_oNextNode:cc.Node,
    },
    onLoad(){
    },
    setOwner:function(destOwner,destType,destPos) {
        this.m_oOwner = destOwner
        this.m_iTtype = destType
        if (this.m_iTtype == TYPE_HERO){
            Gm.load.loadSpriteFrame("img/bossbattle/bossbattle_img_xt1",function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oHPBar.getChildByName("bar").getComponent(cc.Sprite))
        }else{
            Gm.load.loadSpriteFrame("img/bossbattle/bossbattle_img_xt3",function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oHPBar.getChildByName("bar").getComponent(cc.Sprite))
            this.m_oSkPerson.node.scaleX = -1
        }
        this.m_oSkPerson.setEventListener((trackEntry, event) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if (event.data.name == "hit_pause" && this.m_bCanBreak){
                this.m_oSkPerson.paused = true
            }else if(event.data.name == "shooter"){
                this.m_oOwner.sendBullet()
            }
            // if (event.data.name == "attack" || event.data.name == "attack1" || event.data.name == "attack2" || event.data.name == "skill" || event.data.name == "buff"){
            //     if (this.m_oOwner.doAttack){
            //         this.m_oOwner.doAttack()
            //     }
            // }
        })
        
        this.m_iPosNum = destPos
        if (this.m_oOwner.getPosScale){
            this.node.scale = this.m_oOwner.getPosScale(this.m_iPosNum)
        }
        this.node.active = false
        this.m_bIsAlive = false
        this.updateNext(false)
        this.m_iBuffNow = []
        this.m_tBuffFab = {}
        this.skin = 0
    },
    setMpFlash:function(value){
        this.m_bMpFlash = value
    },
    setSkinId(skin){
        this.skin = skin
        this.skinConf = Gm.config.getSkin(this.skin)
    },
    changeRunType:function(destType,callback){
        if (this.m_iRunType != destType){
            this.m_iRunType = destType
            this.m_iLoopCount = 0
            var data = Gm.config.characterMotion(destType)
            // console.trace()
            if (this.m_iTtype == TYPE_HERO){
                // console.log("changeRunType==hero==",this.m_iPosNum,data.motion,data.loop)
            }else{
                // console.log("changeRunType==enemy==",this.m_iPosNum,data.motion,data.loop)
            }
            if (destType == MOTION_IDLE && this.isBoss()){
                this.m_oSkPerson.setAnimation(0,data.motion+"_boss",data.loop)
            }else{
                this.m_oSkPerson.setAnimation(0,data.motion,data.loop)
            }
            if (destType == MOTION_WIN){
                this.m_oSkPerson.node.color = this.baseColor
                var wait = Gm.config.characterMotion(MOTION_IDLE)
                this.m_oSkPerson.addAnimation(0,wait.motion,true)
            }
            if (!data.loop){
                this.m_oSkPerson.setCompleteListener((trackEntry) => {
                    this.m_iLoopCount++
                    if (trackEntry.animation.name === data.motion && callback) {
                        callback(); // 动画结束后执行自己的逻辑
                    }
                })
            }
        }
    },
    updateConfig:function(data,destHp,destMp,destLevel){
        if (data){
            this.m_oData = data
            this.m_bPlayMax = false
            if (!this.m_oPowerMax){
                this.m_oPowerMax = new cc.Node()
                this.node.addChild(this.m_oPowerMax,-1)
                var tmpSk1 = this.m_oPowerMax.addComponent(sp.Skeleton)
                tmpSk1.skeletonData = this.m_oOwner.getPowerMax()
                this.m_oPowerMax.opacity = 0
                // tmpSk1.setAnimation(0, tmpSk1.skeletonData._name+"_1", true)
            }else{
                this.m_oPowerMax.active = true
                this.m_oPowerMax.opacity = 0
            }
            if (!this.m_oPowerMax1){
                this.m_oPowerMax1 = new cc.Node()
                this.node.addChild(this.m_oPowerMax1)
                var tmpSk2 = this.m_oPowerMax1.addComponent(sp.Skeleton)
                tmpSk2.skeletonData = this.m_oOwner.getPowerMax()
                this.m_oPowerMax1.opacity = 0
                tmpSk2.setCompleteListener((trackEntry) => {
                    if (trackEntry.animation.name == tmpSk2.skeletonData._name+"_2"){
                        this.m_oPowerMax1.opacity = 0
                        if (this.skinConf.voc011 && this.skinConf.voc011.length > 0){
                            Gm.audio.playDub(this.skinConf.voc011)
                        }
                        if (this.powerFunc){
                            this.powerFunc()
                            this.powerFunc = null
                        }
                    }
                })
                // tmpSk2.setAnimation(0, tmpSk2.skeletonData._name+"_0", true)
            }else{
                this.m_oPowerMax1.active = true
                this.m_oPowerMax1.opacity = 0
            }
            var scale = 1
            if (this.isBoss()){
                scale = this.skinConf.enlarge
            }
            this.baseColor = cc.color(255,255,255)
            if (this.skinConf.rgb.length > 0){
                var split = this.skinConf.rgb.split("_")
                this.baseColor = cc.color(checkint(split[0]),checkint(split[1]),checkint(split[2]))
            }
            this.m_oSkPerson.node.color = this.baseColor
            this.m_oSkPerson.node.scaleX = this.m_oSkPerson.node.scaleX * scale
            this.m_oSkPerson.node.scaleY = scale
            Gm.load.loadFight(this.skinConf.dwarf,function(sp,owner){
                var height = sp.skeletonJson.skeleton.height
                owner.m_oHMNode.y = (height + 10) * scale
                owner.m_oIconList.y = (height + 10) * scale + 10
                owner.m_oSkPerson.skeletonData = sp
                // owner.changeRunType(MOTION_IDLE)
                owner.showBorn()
            },this)
            var res = Gm.config.getTeamType(data.camp)
            Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
                icon.spriteFrame = sp
            },this.m_oTeamSprite)
            // Func.getHeadWithParent(data.picture,this.node)
            this.resetLevel(destLevel)
            this.resetAll(destHp,destMp)
            this.hideInfo(false)
            this.efList = this.m_oOwner.getNewEF(this)
        }
    },
    setJobId:function(baseId,destJob){
        this.m_iBaseId = baseId
        this.m_iJob = destJob || 1
    },
    resetLevel:function(destLevel){
        var tmpLevel = Gm.userInfo.level
        if (destLevel){
            tmpLevel = destLevel
        }
        // this.m_oLvNmLab.string = Ls.lv()+tmpLevel+"  "+this.m_oData.name
    },
    hideInfo:function(destValue){
        this.m_oInfoNode.active = destValue
        if (destValue){
            this.m_oBuffNode.opacity = 255
            if (this.m_bPlayMax){
                this.setPowerNum(255)
            }else{
                this.setPowerNum(0)
            }
        }else{
            this.m_oBuffNode.opacity = 0
            this.setPowerNum(0)
        }
    },
    updateSkill:function(destSkill){
        this.m_oSkillLab.string = destSkill
    },
    updateAlive:function(destValue){
        // this.node.active = destValue
        if (!destValue){
            Func.destroyChildren(this.m_oIconList)
            Func.destroyChildren(this.m_oBuffNode)
            this.m_iBuffNow = []
            this.m_tBuffFab = {}
        }
        this.m_bIsAlive = destValue
        // this.m_oIconList.active = destValue
        // this.m_oBuffNode.active = destValue
        if (this.m_oOwner){
            // this.m_oLvNmLab.node.active = destValue
            this.m_oHMNode.active = destValue
            if (this.m_oPerson && this.m_oPerson.state == ConstPb.personState.PERSON_DEAD){
                this.m_oPowerMax1.active = false
                this.m_oPowerMax.active = false
                this.m_oSkPerson.node.active = false
            }else{
                this.m_oPowerMax1.active = true
                this.m_oPowerMax.active = true
                this.m_oSkPerson.node.active = true
            }
            // var tmpActive = this.m_oSkPerson.node.active
            // this.m_oSkPerson.node.active = destValue
            // if (destValue){
            //     tmpNode.color = new cc.color(255,255,255)
            // }else{
            //     tmpNode.color = new cc.color(100,100,100)
            // }
        }
    },
    setMaxHp:function(destValue){
        if (destValue){
            this.m_iHpMax = destValue
        }else{
            this.m_iHpMax = MAX_HP
            if (this.m_iTtype == TYPE_ENEY){
                this.m_iHpMax = MAX_HP/2
            }
        }
    },
    setMaxMp:function(destValue){
        if (destValue){
            this.m_iMpMax = destValue
        }else{
            this.m_iMpMax = MAX_MP
            if (this.m_iTtype == TYPE_ENEY){
                this.m_iMpMax = MAX_MP/2
            }
        }
    },
    resetAll:function(destHp,destMp){
        this.node.active = true
        this.hideInfo(true)
        this.updateAlive(true)
        this.setMaxHp(destHp)
        this.setMaxMp(destMp)
        this.updatePerson({hp:destHp,mp:0,state:0,buffInfo:[]})
        this.updateNext(false)
    },
    updateHp:function(destValue,destDun){
        this.m_iHpNums = destValue
        this.m_iDunNums = destDun || 0
        var tmpMax = this.m_iHpNums + this.m_iDunNums
        if (tmpMax > this.m_iHpMax){
            this.m_oHPBar.getChildByName("dun").width = MAX_HP_WID * Math.min((this.m_iDunNums/tmpMax),1)
            this.m_oHPBar.getChildByName("bar").width = MAX_HP_WID * Math.min((this.m_iHpNums/tmpMax),1)
        }else{
            this.m_oHPBar.getChildByName("dun").width = MAX_HP_WID * Math.min((this.m_iDunNums/this.m_iHpMax),1)
            this.m_oHPBar.getChildByName("bar").width = MAX_HP_WID * Math.min((this.m_iHpNums/this.m_iHpMax),1)
        }
        // console.log("this.m_oPerson.state===:",this.m_oPerson.state)
        if (this.m_oPerson.state == ConstPb.personState.PERSON_FIGHT || this.m_oPerson.state == ConstPb.personState.PERSON_WILL_DEAD){
            this.updateAlive(true)
            if (this.m_iRunType == MOTION_DEAD){
                this.node.x = 0
                this.node.y = 0
                this.node.scale = this.m_oOwner.getPosScale(this.m_iPosNum)
                this.changeRunType(MOTION_IDLE)
            }
        }else{
            if (this.m_iRunType == MOTION_DEAD){
                this.m_iRunType = MOTION_IDLE
            }
            this.m_oPowerMax.opacity = 0
            this.m_oPowerMax1.opacity = 0
            this.m_oSkPerson.paused = false
            var self = this
            if (this.m_oPerson.state == ConstPb.personState.PERSON_DEAD){
                this.hideInfo(false)
                this.changeRunType(MOTION_DEAD,function(){
                    self.showDead()
                })
                var waitTime = checkint(Gm.config.getConst("death_wait_time")||1000)/1000
                this.playAction(cc.delayTime(waitTime),function(){
                    self.m_oOwner.hurtDone(self)
                })
            }else{
                this.hideInfo(true)
                this.changeRunType(MOTION_DEAD,function(){
                    self.showDead()
                    self.m_oOwner.hurtDone(self)
                })
            }
        }
    },
    updateMp:function(destValue,func){
        this.m_iMpNums = destValue
        this.m_oMPBar.progress = Math.min((this.m_iMpNums/this.m_iMpMax),1)
        if (this.m_iHpNums > 0 && this.m_iMpNums == this.m_iMpMax){
            this.m_bPlayMax = true
            if (this.m_oPowerMax.opacity == 0){
                var tmpSk1 = this.m_oPowerMax.getComponent(sp.Skeleton)
                tmpSk1.setAnimation(0, tmpSk1.skeletonData._name+"_1", true)
                if (this.m_oInfoNode.active){
                    this.m_oPowerMax.runAction(cc.fadeIn(ATK_TIM2))
                }
            }
            if (this.m_oPowerMax1.opacity == 0){
                var tmpSk2 = this.m_oPowerMax1.getComponent(sp.Skeleton)
                tmpSk2.setAnimation(0,tmpSk2.skeletonData._name+"_0", true)
                if (this.m_oInfoNode.active){
                    this.m_oPowerMax1.runAction(cc.fadeIn(ATK_TIM2))
                }
            }
        }else{
            this.m_bPlayMax = false
            if (this.m_oPowerMax.opacity != 0){
                this.m_oPowerMax.opacity = 0
                if (this.m_bMpFlash){
                    if (this.m_bMpFlash == 1){
                        Gm.audio.playAtk(Gm.config.getConst("skill_launch"))
                    }else{
                        Gm.audio.playAtk(Gm.config.getConst("skill_launch_noRol"))
                    }
                    this.m_bMpFlash = 0
                    var tmpSk2 = this.m_oPowerMax1.getComponent(sp.Skeleton)
                    tmpSk2.setAnimation(0,tmpSk2.skeletonData._name+"_2",false)
                    this.powerFunc = func
                }else{
                    this.powerFunc = null
                    this.m_oPowerMax1.opacity = 0
                }

            }else{
                if (func){
                    func()
                }
            }
        }
    },
    showDead:function(){
        this.updateAlive(false)
        if (this.m_oOwner){
            this.m_oOwner.pushDead(this)
        }
    },
    showBorn:function(){
        // if (this.m_oOwner.isUnionBossFollow() && !this.isEnemy()){
        //     self.changeRunType(MOTION_RUN)
        //     return
        // }
        var tmpFollow = -1
        if (TYPE_ENEY == this.m_iTtype){
            tmpFollow = 1
        }
        var self = this
        // this.node.x = tmpFollow*1000
        // this.playAction(cc.moveTo(ACTION_TIM,cc.v2(0,0)).easing(cc.easeOut(5)),function(){
        //     self.changeRunType(MOTION_IDLE)
        //     self.m_oOwner.readyFight()
        // })
        this.changeRunType(MOTION_START,function(){
            self.changeRunType(MOTION_IDLE)
            self.hideInfo(true)
            self.m_oOwner.readyFight()
        })
    },
    playAction:function(destAction,destFunc){
        // if (this.m_oPerson && this.m_oPerson.pos == -1){
        //     console.log("destAction===:",destAction)
        // }
        this.node.stopAllActions()
        this.node.runAction(cc.sequence(destAction,
            // cc.delayTime(this.getTimes(WIT_TIM1)),
            cc.callFunc(function(){
            if (destFunc){
                destFunc()
            }
        })))
    },
    updatePerson:function(destData){
        this.m_oPerson = destData
        this.updateHp(this.m_oPerson.hp,this.m_oPerson.shield)
        this.updateMp(this.m_oPerson.mp)
    },
    showRecover:function(destData){
        if (destData.effect){
            var tmpType = destData.effect.type
            var tmpName = null
            if (tmpType == ConstPb.effectType.EFFECT_HEAL_HP1 || tmpType == ConstPb.effectType.EFFECT_HEAL_HP2 || tmpType == ConstPb.effectType.EFFECT_SUCK_HP){
                tmpName = this.m_oOwner.getJiaXue()
            }
            if (tmpType == ConstPb.effectType.EFFECT_HEAL_MP1 || tmpType == ConstPb.effectType.EFFECT_HEAL_MP2){
                tmpName = this.m_oOwner.getJiaLan()
            }
            if (tmpName){
                // Gm.audio.playAtk(Gm.config.getConst("recover"))
                var tmpFab = new cc.Node()
                this.m_oBuffNode.addChild(tmpFab)
                var tmpSk = tmpFab.addComponent(sp.Skeleton)
                tmpSk.skeletonData = tmpName
                tmpSk.setAnimation(0,tmpSk.skeletonData._name,false)
                tmpSk.setCompleteListener((trackEntry) => {
                    tmpFab.removeFromParent(true)
                    tmpFab.destroy()
                })
            }
        }
        this.showReduce(destData)
    },
    showJustBuff:function(buffFile){
        if (buffFile && buffFile.length > 0){
            var tmpFab = new cc.Node()
            this.node.addChild(tmpFab)
            var tmpSk = tmpFab.addComponent(sp.Skeleton)
            tmpSk.skeletonData = this.m_oOwner.getBuffByName(buffFile)
            tmpSk.setAnimation(0,buffFile, false)
            tmpSk.setCompleteListener((trackEntry) => {
                // console.log("??11??",self.m_iPosNum+1,tmpSk.skeletonData)
                tmpSk.node.removeFromParent(true)
                tmpSk.node.destroy()
            })
        }
    },
    showBuff:function(destData){
        if (this.m_bIsAlive && this.m_iHpNums > 0){
            for(const j in this.m_iBuffNow){
                this.m_iBuffNow[j].updatePoint(0)
            }
            var tmpColor = -1
            var self = this
            var tmpInsert = function(conf,buff){
                var tmpFab = new cc.Node()
                var _pos = 0
                if (conf.position){
                    _pos = conf.position
                }
                tmpFab.y = _pos * self.m_oSkPerson.node.height
                self.m_oBuffNode.addChild(tmpFab)
                var tmpSk = tmpFab.addComponent(sp.Skeleton)
                tmpSk.skeletonData = self.m_oOwner.getBuffByName(conf.file)
                tmpSk.setAnimation(0, conf.add_tx, false)
                // console.log("conf====:",conf.file,conf.continue_tx)
                if (conf.continue_tx.length > 0){
                    // console.log("添加===:",self.m_iPosNum+1,conf.id,conf.file)
                    tmpSk.addAnimation(0, conf.continue_tx, true)
                    self.m_tBuffFab[conf.file] = tmpFab
                    buff.insertBuff(tmpFab)
                }else{
                    tmpSk.setCompleteListener((trackEntry) => {
                        // console.log("??11??",self.m_iPosNum+1,tmpSk.skeletonData)
                        tmpSk.node.removeFromParent(true)
                        tmpSk.node.destroy()
                    })
                }
            }
            for(const i in destData.buffInfo){
                var tmpCan = true
                for(const j in this.m_iBuffNow){
                    if (this.m_iBuffNow[j].m_oData.id == destData.buffInfo[i].buffId){
                        this.m_iBuffNow[j].updatePoint(destData.buffInfo[i].buffRound)
                        tmpCan = false
                        break
                    }
                }
                if (tmpCan){//插入新的
                    var conf = Gm.config.getBuffWithId(destData.buffInfo[i].buffId)
                    if (this.m_bPauseBuff){
                        continue;
                    }
                    if (conf && conf.icon.length > 0){
                        var tmpBuf = cc.instantiate(this.m_oBuffPerfab).getComponent("BuffBase")
                        tmpBuf.node.parent = this.m_oIconList
                        tmpBuf.updateData(conf)
                        tmpBuf.updatePoint(destData.buffInfo[i].buffRound)
                        this.m_iBuffNow.push(tmpBuf)
                        if (conf.file.length > 0){
                            if (this.m_tBuffFab[conf.file]){
                                tmpBuf.insertBuff(this.m_tBuffFab[conf.file])
                            }else{
                                tmpInsert(conf,tmpBuf)
                            }
                        }
                        if (conf.sound && conf.sound.length > 0){
                            Gm.audio.playAtk(conf.sound)
                        }
                        if (conf.name.length > 0){
                            this.efList.putLab(this.m_oOwner.getBuffLab(this,conf),conf.id)
                        }
                    }
                }
            }
            for(var i = this.m_iBuffNow.length - 1;i >= 0;i--){
                if (this.m_iBuffNow[i].m_iTimes == 0){//没有回合数了
                    // console.log("删除图标===:",this.m_iPosNum+1,this.m_iBuffNow[i].m_oData.id)
                    if (this.m_iBuffNow[i].deletBuff()){
                        var conf = this.m_iBuffNow[i].m_oData
                        // console.log("尝试===:",this.m_tBuffFab[conf.file].clubs,conf.file,this.m_tBuffFab)
                        if (this.m_tBuffFab[conf.file] && this.m_tBuffFab[conf.file].clubs.length == 0){
                            // console.log("删除===:",this.m_iPosNum+1,this.m_oBuffNode._children)
                            if (conf.disappear_tx){
                                var tmpSk = this.m_tBuffFab[conf.file].getComponent(sp.Skeleton)
                                tmpSk.setAnimation(0,conf.disappear_tx,false)
                                tmpSk.setCompleteListener((trackEntry, loopCount) => {
                                    // console.log("??22??",this.m_iPosNum+1,trackEntry.animation.name)
                                    if (tmpSk && tmpSk.node){
                                        tmpSk.node.removeFromParent(true)
                                        tmpSk.node.destroy()
                                    }
                                })
                            }else{
                                this.m_tBuffFab[conf.file].removeFromParent(true)
                                this.m_tBuffFab[conf.file].destroy()
                            }
                            delete this.m_tBuffFab[conf.file]
                        }
                    }
                    this.m_iBuffNow[i].node.removeFromParent(true)
                    this.m_iBuffNow[i].node.destroy()
                    this.m_iBuffNow.splice(i,1)
                }else{
                    if (this.m_iBuffNow[i].m_iTimes && this.m_iBuffNow[i].m_oData.color){
                        tmpColor = i
                    }
                }
            }
            if (tmpColor != -1 && this.m_iBuffNow[tmpColor]){
                var _color = this.m_iBuffNow[tmpColor].m_oData.color.split("_")
                this.m_oSkPerson.node.color = cc.color(checkint(_color[0]),
                                                       checkint(_color[1]),
                                                       checkint(_color[2]))
            }else{
                this.m_oSkPerson.node.color = this.baseColor
            }
        }
        this.m_bPauseBuff = false
        // Gm.send(Events.BATTLE_PLAY_DONE,{type:tmpType})
    },
    showReduce:function(destData){
        if (!this.m_oInfoNode.active){
            this.m_oInfoNode.active = true
        }
        if (destData.effect && !this.m_bCanBreak){
            this.effectNum(destData.effect.type,destData.effect.value)
        }
        this.updatePerson(destData)
        this.showBuff(destData)
    },
    moveFunc:function(destData,isBack,callback){
        var tmpX = 0
        var tmpY = 0
        var tmpScale = 0
        var tmpMove = null
        var scale = 1
        if (this.isBoss()){
            scale = this.skinConf.enlarge
        }
        if (isBack){
            tmpMove = cc.moveTo(this.getTimes(ATK_TIM2),cc.v2(0,0))
            tmpScale = this.m_oOwner.getPosScale(this.m_iPosNum)
            if (tmpScale != this.node.scale){
                tmpMove = cc.spawn(cc.moveTo(this.getTimes(ATK_TIM2),cc.v2(0,0)),cc.scaleTo(ATK_TIM2,tmpScale))
            }
            if (this.isEnemy()){
                this.m_oSkPerson.node.scaleX = scale
            }else{
                this.m_oSkPerson.node.scaleX = -scale
            }
        }else{
            tmpX = destData.x - this.node.parent.x
            tmpY = destData.y - this.node.parent.y
            tmpMove = cc.moveTo(this.getTimes(ATK_TIM1),cc.v2(tmpX,tmpY))
            tmpScale = this.m_oOwner.getPosScale(this.m_iPosNum)
            if (tmpScale != destData.scale){
                tmpMove = cc.spawn(cc.moveTo(this.getTimes(ATK_TIM1),cc.v2(tmpX,tmpY)),cc.scaleTo(ATK_TIM1,destData.scale))
            }
            if (this.isEnemy()){
                this.m_oSkPerson.node.scaleX = -scale
            }else{
                this.m_oSkPerson.node.scaleX = scale
            }
        }
        if (this.m_oPerson.state == ConstPb.personState.PERSON_FIGHT || this.m_oPerson.state == ConstPb.personState.PERSON_WILL_DEAD){
            this.changeRunType(MOTION_RUN)
            this.playAction(tmpMove,callback)
        }else{
            callback()
        }
    },
    doDefense:function(destData,callback){
        var self = this
        if (destData.def.x && destData.def.y){
            this.m_bHasMove = true
            this.moveFunc({x:destData.def.x,y:destData.def.y,scale:destData.scale},false,function(){
                self.changeRunType(MOTION_IDLE)
                if (callback){
                    callback()
                }
            })
        }
    },
    doAttack:function(destData){
        var self = this
        if (destData.x && destData.y){
            this.m_bHasMove = true
            this.m_oOwner.activeNonIdx()
            this.moveFunc({x:destData.x,y:destData.y,scale:destData.scale},false,function(){
                self.m_oOwner.doAttack()
                self.changeRunType(destData.type,function(){
                    // self.changeRunType(MOTION_IDLE)
                    self.attackDone()
                })
            })
        }else{
            // console.log("deAttack===:",this.m_iTtype,this.m_iPosNum,destData)
            this.m_bHasMove = false
            this.m_oOwner.doAttack()
            if (destData.type > 0){// 大于0为参与攻击
                this.changeRunType(destData.type,function(){
                    self.attackDone()
                })
            }
        }
    },
    defenseDone:function(){
        var self = this
        var scale = 1
        if (this.isBoss()){
            scale = this.skinConf.enlarge
        }
        this.moveFunc({},true,function(){
            if (self.m_iTtype == TYPE_HERO){
                self.m_oSkPerson.node.scaleX = scale
            }else{
                self.m_oSkPerson.node.scaleX = -scale
            }
            if (self.m_iRunType != MOTION_DEAD){
                self.changeRunType(MOTION_IDLE)
            }
            if (self.m_oOwner.defenseDone){
                self.m_oOwner.defenseDone(self)
            }
        })
    },
    attackDone:function(){
        if (this.m_bHasMove){
            this.m_oOwner.activeNonIdx(true)
            this.m_bHasMove = false
            var scale = 1
            if (this.isBoss()){
                scale = this.skinConf.enlarge
            }
            var self = this
            this.moveFunc({},true,function(){
                if (self.m_iTtype == TYPE_HERO){
                    self.m_oSkPerson.node.scaleX = scale
                }else{
                    self.m_oSkPerson.node.scaleX = -scale
                }
                self.changeRunType(MOTION_IDLE)
                if (self.m_oOwner.attackDone){
                    self.m_oOwner.attackDone(self)
                }
            })
        }else{
            this.changeRunType(MOTION_IDLE)
            if (this.m_oOwner.attackDone){
                this.m_oOwner.attackDone(this)
            }
        }
    },
    suckPause:function(){
        this.m_oSkPerson.paused = false
    },
    //设置普攻受伤次数
    setHurtCount:function(destNum,isSkill){
        this.m_iHurtNum = 0
        this.m_iHurtMax = destNum
        if (isSkill){
            this.m_iHurtMax = 1
        }
    },
    doHurt:function(destData,noNumber){
        var tmpFollow = -1
        if (this.isEnemy()){
            tmpFollow = 1
        }
        // if (this.m_iTtype == TYPE_HERO){
        //     console.log("doHurt==hero==",this.m_iPosNum,destData)
        // }else{
        //     console.log("doHurt==enemy==",this.m_iPosNum,destData)
        // }
        var destType = ConstPb.effectType.EFFECT_DAMAGE
        if (destData && destData.effect){
            destType = destData.effect.type
        }
        var self = this
        var checkConter = function(){
            // 判断反击
            if (destData.cattack){
                self.m_oOwner.insertAttack(destData.cattack)
            }
            self.m_iHurtNum++
            console.log("self.m_iHurtNum===:",self.m_iHurtNum,self.m_iHurtMax,noNumber)
            if (self.m_iHurtNum >= self.m_iHurtMax){
                self.m_oOwner.hurtDone(self)
            }
        }
        if (!this.m_oSkPerson.paused){
            if (this.m_iHpNums > 0){
                if (this.m_iRunType != MOTION_DEAD && this.m_iRunType != MOTION_IDLE){
                    this.m_iRunType = MOTION_IDLE
                    this.m_iHurtNum++
                }
                if (destType == ConstPb.effectType.EFFECT_DAMAGE || destType == ConstPb.effectType.EFFECT_CRITS || destType == ConstPb.effectType.EFFECT_SHIELD){
                    this.changeRunType(MOTION_HURT,function(){
                        self.changeRunType(MOTION_IDLE)
                        checkConter()
                    })
                }else if(destType == ConstPb.effectType.EFFECT_PARRY){
                    this.changeRunType(MOTION_BLOCK,function(){
                        self.changeRunType(MOTION_IDLE)
                        checkConter()
                    })
                }else if(destType == ConstPb.effectType.EFFECT_MISS){
                    this.changeRunType(MOTION_MISS,function(){
                        self.changeRunType(MOTION_IDLE)
                        checkConter()
                    })
                }else if(destType == ConstPb.effectType.BE_HELP_DEFENSE){
                    checkConter()
                }
            }else{
                this.m_iHurtNum++
            }
        }
        if (noNumber){
            this.m_bCanBreak = true
            this.m_bPauseBuff = true
            if (destData && destData.effect){
                this.effectNum(destData.effect.type,destData.effect.value)
            }
            this.showBuff(destData)
        }else{
            this.m_oSkPerson.paused = false
            this.showRecover(destData)
            this.m_bCanBreak = false
        }
    },
    effectNum:function(destType,destValue){
        if (Gm.userData.battleText){
            var tmpStr = ""
            var ttfX = 0
            if (destType == ConstPb.effectType.EFFECT_DAMAGE || destType == ConstPb.effectType.EFFECT_REDUCE_HP){
                tmpStr = "-"+destValue
            }else if(destType == ConstPb.effectType.EFFECT_CRITS){
                tmpStr = "-"+destValue
                ttfX = -20
            }else if(destType == ConstPb.effectType.EFFECT_HEAL_HP1 || destType == ConstPb.effectType.EFFECT_HEAL_HP2 || destType == ConstPb.effectType.EFFECT_SUCK_HP){
                tmpStr = "+"+destValue
            }else if(destType == ConstPb.effectType.EFFECT_HEAL_MP1 || destType == ConstPb.effectType.EFFECT_HEAL_MP2){
                tmpStr = "+"+destValue
            }else if(destType == ConstPb.effectType.EFFECT_PARRY){
                tmpStr = "-"+destValue
                ttfX = -20
            }else if(destType == ConstPb.effectType.EFFECT_REDUCE_MP){
                if (checkint(destValue) > 0){
                    tmpStr = "-"+destValue
                }else{
                    tmpStr = ""+destValue
                }
            }else if(destType == ConstPb.effectType.EFFECT_SHIELD){
                tmpStr = "-"+destValue
                ttfX = -20
            }else{
                tmpStr = ""
            }
            var tmpNode = this.m_oOwner.getHurtLab(this,destType,tmpStr)
            if (tmpNode){
                tmpNode.getChildByName("lay").getChildByName("lab").x = ttfX
            }
            this.efList.putLab(tmpNode,destType)
            if (tmpNode){
                // tmpNode.getChildByName("lay").getChildByName("lab").x = ttfX
                // tmpNode.effectType = destType
                // this.m_tEffect.push(tmpNode)
                // var self = this
                // tmpNode.getComponent(cc.Animation).on('finished',function(){
                //     if (tmpNode){
                //         for(const i in self.m_tEffect){
                //             if (self.m_tEffect[i].effectType == tmpNode.effectType){
                //                 self.m_tEffect[i].removeFromParent(true)
                //                 self.m_tEffect[i].destroy()
                //                 self.m_tEffect.splice(i,1)
                //                 break
                //             }
                //         }
                //     }
                // })
            }
        }
    },
    activeNonIdx:function(isBack){
        if (isBack){
            this.playAction(cc.fadeIn(ATK_TIM2))
        }else{
            this.playAction(cc.fadeOut(ATK_TIM1))
        }
    },
    skillMove:function(destPos,isBack,noPerson){
        if (destPos){
            var tmpX = destPos.x - this.node.parent.x
            var tmpY = destPos.y - this.node.parent.y
            this.hideInfo(false)
            var scale = 1
            if (this.m_oData && this.isBoss()){
                scale = this.skinConf.enlarge
            }
            if (isBack){
                this.m_bHasMove = false
                tmpX = 0
                tmpY = 0
                this.hideInfo(true)
                if (this.isEnemy()){
                    this.m_oSkPerson.node.scaleX = -scale
                }else{
                    this.m_oSkPerson.node.scaleX = scale
                }
            }
            if (this.node.opacity){
                var tmpScale = 0
                if (this.m_oOwner.getPosScale){
                    this.m_oOwner.activeNonIdx()
                    tmpScale = this.m_oOwner.getPosScale(this.m_iPosNum)
                }
                var tmpMove = cc.moveTo(this.getAtkTime(),cc.v2(tmpX,tmpY))
                if (isBack){
                    tmpMove = cc.spawn(cc.moveTo(this.getAtkTime(),cc.v2(tmpX,tmpY)),cc.scaleTo(this.getAtkTime(),tmpScale))
                    // this.m_oOwner.zoomLayer(cc.v2(tmpX,tmpY),this.getAtkTime())
                }else{
                    if (tmpScale && tmpScale != destPos.scale){
                        tmpMove = cc.spawn(cc.moveTo(this.getAtkTime(),cc.v2(tmpX,tmpY)),cc.scaleTo(this.getAtkTime(),destPos.scale))
                    }
                    if (noPerson && this.m_oOwner.canIdle(this)){
                        var scaleIdle = 2.5
                        this.m_oOwner.zoomLayer(cc.v2(-destPos.x * scaleIdle,destPos.y - this.node.height/2),this.getAtkTime(),scaleIdle)
                    }
                }
                this.playAction(tmpMove,isBack || noPerson)
            }else{
                this.activeNonIdx(isBack)
            }
        }else{
            this.activeNonIdx(isBack)
        }
    },
    resetNode(){
        this.node.stopAllActions()
        this.node.x = 0
        this.node.y = 0
        this.changeRunType(MOTION_IDLE)
    },
    updateNext:function(destValue){
        this.m_oNextNode.active = destValue
    },
    /////////////////////////
    /////////////////////////
    getAtkTime:function(){
        return this.getTimes(ZOM_TIM)
    },
    getTimes:function(destValue,isNone){
        if (isNone || !this.m_bIsAlive){
            return 0
        }
        var tmpTime = 1
        if (this.m_oOwner && this.m_oOwner.m_iTimesNum){
            tmpTime = this.m_oOwner.m_iTimesNum
        }
        return destValue / tmpTime
    },
    isEnemy:function(){
        return this.m_iTtype == TYPE_ENEY
    },
    isBoss:function(){
        return this.skinConf.enlarge > 0
    },
    getShoot:function(){
        var shooter = this.m_oSkPerson.findBone("shooter")
        var root = this.m_oSkPerson.findBone("root")
        var tmpX = this.node.parent.x + this.node.x
        if (this.isEnemy()){
            tmpX-=shooter.x * root.scaleX * this.m_oOwner.getPosScale(this.m_iPosNum)
        }else{
            tmpX+=shooter.x * root.scaleX * this.m_oOwner.getPosScale(this.m_iPosNum)
        }
        var tmpY = this.node.parent.y + this.node.y + shooter.y * root.scaleY * this.m_oOwner.getPosScale(this.m_iPosNum)
        return {x:tmpX,y:tmpY}
    },
    getPartX:function(){
        return this.node.parent.x + this.node.x
    },
    getPartY:function(){
        return this.node.parent.y + this.node.y
    },
    isHalf:function(){
        return (this.skinConf && this.skinConf.hit_position == 0)
    },
    getPartHalfY:function(isHalf){
        var value = this.node.parent.y + this.node.y
        if (isHalf){
            value = value + this.m_oSkPerson.node.height/2 * this.m_oOwner.getPosScale(this.m_iPosNum)
        }
        return value
    },
    getCharacter:function(){
        return this.skinConf || this.m_oData
    },
    isSameOne:function(hero){
        if (hero && this.m_iTtype == hero.m_iTtype && this.m_iPosNum == hero.m_iPosNum){
            return true
        }
        return false
    },
    update(dt){
        // var tmpBack = this.m_oHPBar.getChildByName("back")
        // var tmpBar = this.m_oHPBar.getChildByName("bar")
        // if (this.m_oBackAct){
        //     if (this.m_oBackAct > 0){
        //         if (tmpBar.width - tmpBack.width < 0){
        //             tmpBack.width = tmpBar.width
        //             this.m_oBackAct = 0
        //         }else{
        //             tmpBack.width = tmpBack.width + this.m_oBackAct * 0.1
        //         }
        //     }else{
        //         if (tmpBar.width - tmpBack.width > 0){
        //             tmpBack.width = tmpBar.width
        //             this.m_oBackAct = 0
        //         }else{
        //             tmpBack.width = tmpBack.width + this.m_oBackAct * 0.1
        //         }
        //     }
        // }else{
        //     if (tmpBar.width != tmpBack.width){
        //         this.m_oBackAct = tmpBar.width - tmpBack.width
        //     }
        // }
        if (this.m_iRunType == MOTION_WIN){
            // console.log("this.m_iLoopCount===:",this.m_iLoopCount)
            if (this.m_iLoopCount > 3){
                this.m_iRunType = MOTION_IDLE
                this.changeRunType(MOTION_WIN)
            }
        }
    },
    setPowerNum:function(value){
        if (this.m_oPowerMax){
            this.m_oPowerMax.opacity = value
        }
        if (this.m_oPowerMax1){
            this.m_oPowerMax1.opacity = value
        }
    },
});

