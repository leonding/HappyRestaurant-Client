// TravelRob

cc.Class({
    extends: cc.Component,

    properties: {
    	m_oHeadNode:cc.Node,
    	m_oLvNmLab:cc.Label,
    	m_oFightLab:cc.RichText,
    	m_oLineLab:cc.RichText,
    	m_oRatLab:cc.RichText,
    	m_oMakeBtn:cc.Button,
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        this.m_oData = data
        this.updateInfo()
    },
    updateInfo:function(){
    	var c1 = "#A88964"
    	var c2 = "#43E034"
    	var c3 = "#EBD2A0"
    	var c4 = "#FFD93F"
        Func.newHead2(this.m_oData.head,this.m_oHeadNode)
    	this.m_oLvNmLab.string = Ls.lv()+this.m_oData.level+" "+this.m_oData.name

    	this.m_oFightLab.string = cc.js.formatStr(Ls.get(600040),c1)
    			+ cc.js.formatStr("<color=%s>%s</c>",c2,this.m_oData.fightValue)

    	this.m_oLineLab.string = cc.js.formatStr(Ls.get(600041),c1)
    			+ cc.js.formatStr("<color=%s>%s</c>",c3,this.m_oData.heroCount)

        var tmpCaptrue = Gm.config.getCapture(this.m_oData.fightValue)
    	this.m_oRatLab.string = cc.js.formatStr(Ls.get(600042),c1)
    			+ cc.js.formatStr("<color=%s>%s</c>",c4,tmpCaptrue.description)
    },
    onDoit:function(){
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
        Gm.travelNet.sendCaptureBattle(this.m_oData.playerId,tmpLine.hero)
        Gm.travelNet.sendCaptureRefresh()
        // Gm.ui.create("FightTeamView",{type:,playerId:})
    },
});

