var BaseView = require("BaseView")
var btnTipsColor = "<color=#FF0000>%s</c><color=#FFFFFF>%s%s</color>"
cc.Class({
    extends: BaseView,

    properties: {
        m_oPerson:sp.Skeleton,

        lvRich:cc.RichText,
        nameLab:cc.RichText,
        gxRich:cc.RichText,
        expRich:cc.RichText,

        bar:cc.ProgressBar,
        barLab:cc.Label,

        bossTimeRich:cc.RichText,
        numRich:cc.RichText,
        hintRich:cc.RichText,
        descRich:cc.RichText,
        
        battleBtn:cc.Button,
        battleBtnLab:cc.Label,
    },
    onLoad () {
        this._super()
        Gm.red.add(this.battleBtn.node,"union","boss")
    },
    onEnable(){
        this._super()
        // if(Gm.unionData.bossInfo.monsterId== null){
        //     return
        // }
        this.updateView()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    register:function(){
        this.events[MSGCode.OP_ALLIANCE_BOSS_OPEN_S] = this.onNetUpdate.bind(this)
        this.events[MSGCode.OP_ALLIANCE_BOSS_BATTLE_S] = this.onNetUpdate.bind(this)
        this.events[MSGCode.OP_ALLIANCE_BOSS_INFO_S] = this.onNetUpdate.bind(this)
    },
    onNetUpdate(){
        this.updateView()
    },
    updateView:function(){
        this.bossConf = Gm.config.getUnionBoss(Gm.unionData.bossInfo.level)
        // var monster = Gm.config.getMonster(this.bossConf.bossId)
        var monster = Gm.config.getHero(0,Gm.config.getMonster(this.bossConf.bossId).heroQualityID)
        var skinConf = Gm.config.getSkin(monster.skin_id)
        if(this.lastRolePic != skinConf.rolePic){
            this.lastRolePic = skinConf.rolePic
            Gm.load.loadSkeleton(skinConf.rolePic,(sp,owner)=>{
                if (this && owner && owner.node.isValid){
                    owner.skeletonData = sp
                    owner.setAnimation(0, "ziran", true)
                }
            },this.m_oPerson)
        }

        this.lvRich.string = cc.js.formatStr(Ls.get(800151),this.bossConf.id)
        this.nameLab.string = cc.js.formatStr(Ls.get(800152),monster.name) 
        this.gxRich.string = cc.js.formatStr(Ls.get(800153),this.bossConf.allianceDevote)
        this.expRich.string = cc.js.formatStr(Ls.get(800154),this.bossConf.allianceExp)

        this.updateHint() 
        this.updateBattleBtn()
    },
    updateBattleBtn(){
        var btnStr = 800155
        var interactable = true
        if (Gm.unionData.bossInfo.status == 0){
            if (Gm.unionData.bossInfo.openCount == Gm.unionData.getMaxOpenNum()){
                btnStr = 800156
                interactable = false 
            }else{
                // if (Gm.unionData.isMgr()){
                //     btnStr = 800157
                // }else{
                //     btnStr = 800155
                //     interactable = false
                // }
                btnStr = 800155
                interactable = false
            }
        }else{
            if (Gm.unionData.bossInfo.battleCount == Gm.config.getVip().allianceBossChallengeNum){
                btnStr = 800156
                interactable = false
            }
        }
        this.battleBtnLab.string = Ls.get(btnStr)
        this.battleBtn.interactable = interactable
    },
    updateHint(){
        this.barLab.string = ""
        this.bar.progress = 0
        this.bar.node.active = false
        this.descRich.string = cc.js.formatStr(Ls.get(800158),this.bossConf.score)
        this.bar.node.active = true
        if(Gm.unionData.bossInfo.status == 0){
            this.barLab.string = 0
            this.bar.progress = 0
            this.bossTimeRich.string = Ls.get(800159)
            this.numRich.string = cc.js.formatStr(Ls.get(800160),Func.doubleLab(Gm.unionData.info.activity,this.bossConf.openActivity,"ffffff","00FF00","FF0000"))
            this.hintRich.string = cc.js.formatStr(Ls.get(800161),Func.doubleLab(Gm.unionData.bossInfo.openCount,Gm.unionData.getMaxOpenNum(),"ffffff","FF0000","00FF00"))
            return
        }
        
        this.barLab.string = Gm.unionData.bossInfo.source
        this.bar.progress = Gm.unionData.bossInfo.source/this.bossConf.score

        this.updateTimeRich()
        this.numRich.string = cc.js.formatStr(Ls.get(800163),Func.doubleLab(Gm.unionData.bossInfo.battleCount,Gm.config.getVip().allianceBossChallengeNum,"ffffff","FF0000","00FF00"))
        this.hintRich.string = cc.js.formatStr(Ls.get(800164),Gm.unionData.bossInfo.hurt)
    },
    updateTime(){
        if(this.bossConf && Gm.unionData.bossInfo){
            if (Gm.unionData.bossInfo.status == 1){
                this.updateTimeRich()
            }
        }
    },
    updateTimeRich(){
        var time = Gm.unionData.bossInfo.openTime+Gm.config.getConst("alliance_boss_continued_time")*1000
        var tt = Func.translateTime(time,true)
        if (tt == 0 ){
            Gm.unionData.bossInfo.status = 0
            this.updateView()
            return
        }

        var str = Func.timeToTSFM(tt)
        this.bossTimeRich.string = cc.js.formatStr("<color=#ffffff>%s</c><color=#FFD800>%s</color>",Ls.get(800038),str)
    },
    onHintRank(){
        Gm.unionNet.bossRank()
    },
    onBattle(){
        if (Gm.unionData.bossInfo.status == 0){
            var str = Ls.get(50085)
            var needActive = this.bossConf.openActivity
            var currActive = Gm.unionData.info.activity
            var hasNum = Gm.unionData.bossInfo.openCount
            var sumNum =  Gm.unionData.getMaxOpenNum()

            var newStr = cc.js.formatStr(str,currActive,needActive,hasNum,sumNum)
            Gm.box({msg:newStr,title:Ls.get(50086)},function(btnType){
                if (btnType == 1){
                    if (!Gm.userInfo.checkCurrencyNum({nowNum:currActive,num:needActive})){
                        return
                    }
                    if (hasNum >= sumNum){
                        Gm.floating(Ls.get(50088))
                        return
                    }
                    Gm.unionNet.bossOpen()           
                }
            })
        }else{
            if (Gm.unionData.bossInfo.battleCount ==Gm.config.getVip().allianceBossChallengeNum){
                Gm.floating(90007)
                return
            }
            Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.ALLIANCE_BOSS})
        }
    },
    getSceneData:function(){
        return true
    },
});

