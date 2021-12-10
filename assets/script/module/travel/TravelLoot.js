// TravelLoot
const c1 = "#EBD2A0"
const c2 = "#5CEA45"
cc.Class({
    extends: cc.Component,

    properties: {
        m_oHeroPerfab:cc.Prefab,
    	m_oHeadNode:cc.Node,
    	m_oNameLab:cc.Label,
    	m_oJobsLab:cc.Label,
        m_oTeamLab:cc.RichText,
        m_oLostLab:cc.RichText,

        m_oBtnGreen:cc.Button,
        m_oBtnBlue:cc.Button,
        m_oBtnYellow:cc.Button,
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        this.m_oData = data
        this.updatBtn()
    },
    updatBtn:function(){
        this.m_iCanDo = Gm.travelData.cheackHero(this.m_oData.heroId)
        this.m_oBtnBlue.node.active = true
        this.m_oBtnYellow.node.active = true
        this.m_oBtnGreen.node.active = true
        this.m_oBtnBlue.interactable = true
        this.m_oBtnYellow.interactable = true
        this.m_oBtnGreen.interactable = true
        if (this.m_oData.baseId){
            this.m_oBtnBlue.node.active = true
            if (this.m_iCanDo > 0){
                this.m_oBtnGreen.node.active = false
            }else{
                this.m_oBtnBlue.interactable = false
                this.m_oBtnYellow.node.active = false
            }
            this.m_oBtnGreen.node.getChildByName("lab").getComponent(cc.Label).string = Ls.get(600028)
            this.m_oBtnBlue.node.getChildByName("lab").getComponent(cc.Label).string = Ls.get(600029)
            var tmpConfig = Gm.config.getHero(this.m_oData.baseId)
           
            var tmpSpt = Gm.ui.getNewItem(this.m_oHeadNode)
            tmpSpt.updateHero({baseId:this.m_oData.baseId})

            this.m_oNameLab.string = tmpConfig.name
            var tmpJobNum = this.m_oData.job
            if (!tmpJobNum){
                tmpJobNum = tmpConfig.job
            }
            this.m_oJobsLab.string = Ls.get(600030)+Gm.config.getJobWithId(tmpJobNum).name

            this.m_oTeamLab.string = cc.js.formatStr(Ls.get(600031),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,this.m_oData.ownerName)
            var tmpLost = Math.floor((this.m_oData.liberateTime - Gm.userData.getTime_m())/1000)
            this.m_oLostLab.string = cc.js.formatStr(Ls.get(600032),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,Func.timeToTSFM(tmpLost))
        }else{
            this.m_oBtnYellow.node.active = false
            var tmpHero = Gm.heroData.getHeroById(this.m_oData.heroId)

            var tmpSpt = Gm.ui.getNewItem(this.m_oHeadNode)
            tmpSpt.updateHero({baseId:tmpHero.baseId})
            
            // Func.getHeadWithParent(tmpConfig.picture,this.m_oHeadNode)
            this.m_oNameLab.string = tmpConfig.name

            this.m_oJobsLab.string = Ls.get(600033)+this.m_oData.captureName
            this.m_oLostLab.string = cc.js.formatStr(Ls.get(600034),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,tmpHero.tuneIntimacy)
            var tmpLost = Math.floor((this.m_oData.liberateTime - Gm.userData.getTime_m())/1000)
            this.m_oTeamLab.string = cc.js.formatStr(Ls.get(600035),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,Func.timeToTSFM(tmpLost))
            var tmpPass = Math.floor((Gm.userData.getTime_m() - this.m_oData.captureTime)/1000)
            var tmpConst = Gm.config.getConst("capture_time_no_ransom")
            if (tmpPass < tmpConst){
                this.m_UpdateTime = true
                this.m_oBtnGreen.node.active = false
                this.m_oBtnBlue.interactable = false
                this.m_oBtnBlue.node.y = 0
                this.m_oBtnBlue.node.getChildByName("lab").getComponent(cc.Label).string = Func.timeToTSFM(tmpConst - tmpPass)
            }else{
                this.m_oBtnGreen.node.active = true
                this.m_oBtnBlue.interactable = true
                this.m_oBtnBlue.node.y = -30
                this.m_oBtnGreen.node.getChildByName("lab").getComponent(cc.Label).string = Ls.get(600036)
                this.m_oBtnBlue.node.getChildByName("lab").getComponent(cc.Label).string = Ls.get(600037)
            }
        }
    },
    updateTime:function(){
        var tmpLost = Math.floor((this.m_oData.liberateTime - Gm.userData.getTime_m())/1000)
        if (this.m_oData.baseId){
            this.m_oLostLab.string = cc.js.formatStr(Ls.get(600038),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,Func.timeToTSFM(tmpLost))
        }else{
            this.m_oTeamLab.string = cc.js.formatStr(Ls.get(600039),c1) + cc.js.formatStr("<color=%s>%s</c>",c2,Func.timeToTSFM(tmpLost))
            if (this.m_UpdateTime){
                var tmpPass = Math.floor((Gm.userData.getTime_m() - this.m_oData.captureTime)/1000)
                var tmpConst = Gm.config.getConst("capture_time_no_ransom")
                if (tmpPass < tmpConst){
                    this.m_oBtnBlue.node.getChildByName("lab").getComponent(cc.Label).string = Func.timeToTSFM(tmpConst - tmpPass)
                }else{
                    this.m_UpdateTime = null
                    this.updatBtn()
                }
            }
        }
    },
    onGreen:function(){
        if (this.m_oData.baseId){
        }else{
            Gm.travelNet.sendRansomHeroState(this.m_oData.heroId)
        }
    },
    onBlue:function(){
        if (this.m_oData.baseId){
            Gm.travelNet.sendTravelLiberate(this.m_oData.playerId,this.m_oData.heroId)
        }else{
            var tmpLine = Gm.heroData.getLineWithLimit(ConstPb.lineHero.LINE_TRAVEL_CAPTURE)
            var tmpNone = true
            for(const i in tmpLine.hero){
                if (tmpLine.hero[i] != 0){
                    tmpNone = false
                    break
                }
            }
            if (tmpNone){
                Gm.floating(Ls.get(2072))
                return
            }
            Gm.travelNet.sendRansomBattle(tmpLine.hero,this.m_oData.heroId)
            // Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_TRAVEL_RANSOM,heroId:this.m_oData.heroId})
        }
    },
    onYellow:function(){
        this.m_oOwner.select(0)
    },
});

