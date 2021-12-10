var BaseView = require("BaseView")
var btnTipsColor = "<color=#FF0000>%s</c><color=#FFFFFF>%s</color>"
cc.Class({
    extends: BaseView,

    properties: {
        timeRich:cc.RichText,
        bar:cc.ProgressBar,
        barSpr:cc.Sprite,

        toggleContainerNode:cc.Node,
        unionToggle:cc.Toggle,
        playerToggle:cc.Toggle,

        unionTitleNode:cc.Node, 
        unionItemNode:cc.Node,
        unionUserNode:cc.Node,

        playerTitleNode:cc.Node, 
        playerItemNode:cc.Node,
        playerUserNode:cc.Node,

        scroll:cc.ScrollView,

        awardListNode:cc.Node,
        awardScroll:cc.ScrollView,
        rankNode:cc.Node,
        awardNode:cc.Node,
        playerAwardToggle:cc.Toggle,




        fightBtn:cc.Button,
        fightLab:cc.Label,

        barBgFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        typeNodes:{
            default: [],
            type: cc.Node,
        },
    },
    onLoad () {
        this._super()
        this.openType = null
        this.ranls = {}

        this.battleCDtime = Math.abs(Gm.config.getConst("world_boss_cooling_time"))/1000
        this.world_boss_battle_time = Math.abs(Gm.config.getConst("world_boss_battle_time"))
    },
    onEnable(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.unscheduleAllCallbacks()
            this.updateView()
            if (this.isGetRank){
                this.onAwardChangeClick()
            }
            if (!Gm.unionData.isUnion()){
                this.playerToggle.isChecked = true
            }
            
            this.schedule(()=>{
                this.updateTime()
            },1)
        }
    },
    updateWorldData(){
        this.worldBoss = Gm.worldBossData.getNowShowData()
        this.updateTime()
        Gm.worldBossNet.bossRank(0)
    },
    updateTime(){
        this.isGetRank = false
        this.battleIng = false
        this.surplusTime = 0
        var openType = false
        if (this.worldBoss.startTime > Gm.userData.getTime_m()){//未开启
            var sTime = Func.translateTime(this.worldBoss.startTime)
            if (sTime < 60*60){
                this.timeRich.string = cc.js.formatStr("<color=#ffffff>%s </c><color=#fcff00>%s</c>",Ls.get(7100017),Func.timeToFM(sTime))
                if (Gm.worldBossData.allianceRank){
                    Gm.worldBossData.allianceRank = null
                    Gm.worldBossData.playerRank = null
                    this.updateNowToggle()
                }
            }else{
                this.isGetRank = true
                this.timeRich.string = cc.js.formatStr("<color=#fcff00>%s </c><color=#ffffff>%s</c>",Func.dateFtt("hh:mm:ss",this.worldBoss.startTime),Ls.get(7100018))//"开启")    
            }
        }else if (Gm.userData.getTime_m() >= this.worldBoss.startTime){//已开启
            if (this.worldBoss.closeTime > Gm.userData.getTime_m()){//进行中
                openType = true
                var fristTime = Gm.worldBossData.getFirstBattleTime()
                var strId = 0
                var strTime = Func.timeToTSFM(Func.translateTime(this.worldBoss.closeTime,true))
                if (fristTime > this.worldBoss.startTime){//战斗持续时间
                    var battleCloseTime = fristTime + checkint(this.world_boss_battle_time)
                    this.surplusTime = Func.translateTime(battleCloseTime,true)
                    if (this.surplusTime >0){
                        this.battleIng = true
                        strId = 7100016
                        if (this.surplusTime > Func.translateTime(this.worldBoss.closeTime,true)){
                            this.surplusTime = Func.translateTime(this.worldBoss.closeTime,true)
                        }
                        strTime = Func.timeToTSFM(this.surplusTime)
                    }else{
                        strId = 7100027//"结算"
                    }
                }else{
                    this.battleIng = true
                    strId = 7100026 //"可挑战："
                }
                this.timeRich.string = cc.js.formatStr("<color=#ffffff>%s </c><color=#fcff00>%s</c>",Ls.get(strId),strTime)
            }else{//已结束
                Gm.worldBossData.allianceRank = null
                Gm.worldBossData.playerRank = null
                this.fightLab.string = Ls.get(7100010)
                this.updateWorldData()
            }
        }
        this.setOpenType(openType)

        if (openType){//战斗按钮状态
            var cdTime = Func.translateTime1(Gm.worldBossData.getBattleTime())
            if (cdTime > this.battleCDtime){
                this.isBattleType = 3
                this.fightLab.string = Ls.get(7100010)
            }else{
                this.fightLab.string =cc.js.formatStr( "CD %sS",(this.battleCDtime - cdTime))
                this.isBattleType = 2
            }
            if (this.surplusTime > 0){
                var p = (this.surplusTime*1000)/this.world_boss_battle_time

                if (p < 0.33){
                    this.changeBarType(3)
                }else if (p < 0.66){
                    this.changeBarType(2)
                }else{
                    this.changeBarType(1)
                }

                this.bar.progress = p
            }else{
                this.changeBarType(1)
                this.bar.progress = this.battleIng?1:0
            }
            
        }
    },
    setOpenType(type){
        if (this.openType == type){
            return
        }
        this.openType = type
        if (this.openType){
            
        }else{
            this.changeBarType(1)
            this.bar.progress = 1
            this.isBattleType = 1
        }
    },
    updateView:function(){
        this.updateWorldData()
    },
    changeBarType(type){
        if (this.barType == type){
            return
        }
        this.barType = type
        this.barSpr.spriteFrame = this.barBgFrame[type-1]
        this.bar.progress = this.bar.progress
        for (var i = 0; i < this.typeNodes.length; i++) {
            this.typeNodes[i].active = i+1 == type
        }
    },
    updateRank(rankName){
        var userData = {}
        var dd

        var scrollItem
        if (rankName == "union"){
            dd = Gm.worldBossData.allianceRank

            if (Gm.unionData.isUnion()){
                userData.allianceName = Gm.unionData.info.name
            }else{
                userData.allianceName = Ls.get(7100015)//"无"
            }
            scrollItem = this.unionItemNode
        }else{
            this.unionTitleNode.active = false
            this.playerTitleNode.active = true
            dd = Gm.worldBossData.playerRank
            userData.info = {name:Gm.userInfo.name,serverId:Gm.loginData.getServerNowId()}
            scrollItem = this.playerItemNode
        }
        this.unionTitleNode.active = rankName == "union"
        this.playerTitleNode.active = !this.unionTitleNode.active

        this.unionUserNode.active = this.unionTitleNode.active
        this.playerUserNode.active = this.playerTitleNode.active

        var destFunc = (node,rank,data)=>{
            node.active = true
            var strs = [rank]

            var name
            var serverId
            if (rankName == "union"){
                name = data.allianceName
            }else{
                name = data.info.name
                strs.push(Gm.config.serverById(data.info.serverId).name)
            }
            strs.push(name)
            strs.push(data.score)

            for (var i = 1; i <= strs.length; i++) {
                node.getChildByName("lab" + i).getComponent(cc.Label).string = strs[i-1]
            }
            if (rank <= 3){
                Gm.load.loadSpriteFrame("img/Settlement/wordboss_no" + rank,(spf,icon)=>{
                    icon.spriteFrame = spf
                },node.getChildByName("wordboss_no1").getComponent(cc.Sprite))
            }
            if (rank == 10000){
                node.getChildByName("lab" + 1).getComponent(cc.Label).string = Ls.get(7100011)// "未上榜"
            }
        }   

        Func.destroyChildren(this.scroll.content)

        if (dd == null){
            userData.score = 0
            destFunc(this[rankName+"UserNode"],10000,userData)
            return
        }
        userData.score = dd.score

        var flag = true


        Gm.ui.simpleScroll(this.scroll,dd.infos,function(tmpData,tmpIdx){
            var item = cc.instantiate(this[rankName+"ItemNode"])
            item.active = true
            this.scroll.content.addChild(item)
            destFunc(item,tmpIdx,tmpData)
            
            return item
        }.bind(this))


        for (var i = 0; i < dd.infos.length; i++) {
            var v = dd.infos[i]
            if(rankName == "union"){
                if (v.allianceId == Gm.unionData.id){
                    flag = false
                    destFunc(this.unionUserNode,i+1,v)
                }
            }else{
                if (v.info.playerId == Gm.userInfo.playerId){
                    flag = false
                    destFunc(this.playerUserNode,i+1,v)
                }
            }
        }
        if (flag){
            destFunc(this[rankName+"UserNode"],10000,userData)
        }
    },
    onToggleBtn(sender){
        this.updateRank(sender.node._name)
    },
    updateNowToggle(){
        if (!this.rankNode.active){
            return
        }
        this.updateRank(this.unionToggle.isChecked?"union":"player")
    },
    onBattleClick(){
        if (this.isBattleType == 1){
            Gm.floating(7100012) //"未开启"
        }else if (this.isBattleType == 2){
            Gm.floating(7100013)//"CD中"
        }else if (this.isBattleType == 3){
            if (!this.battleIng){
                Gm.floating(7100028)//"等待结算")
                return 
            }
            Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_WORLD_BOSS,worldBoss:this.worldBoss})   
        }
    },
    updateAward(awardName){
        var list = Gm.config.getWorldBossRankAward()
        if (Func.forBy(list,"rank",0)){
            Func.forBy(list,"rank",0).rank = 50    
        }
        list.sort(function(a,b){
            return a.rank - b.rank
        })
        Func.destroyChildren(this.awardScroll.content)

        var key
        if (awardName == "union"){
            key = "guildReward"
        }else{
            key = "personalReward"
        }

       var destFunc = (node,dd,nextDd)=>{
            var lab = node.getChildByName("lab1").getComponent(cc.Label)
            if(nextDd){
                if (dd.rank == nextDd.rank -1){
                    lab.string = dd.rank
                }else{
                    lab.string = dd.rank + "~" + (nextDd.rank==50?nextDd.rank:nextDd.rank-1)
                }
            }else{
                lab.string = dd.rank + Ls.get(7100024)
            }

            var rankBg = "worldboss_normal"
            if (dd.rank <= 3){
                rankBg = "wordboss_no" + dd.rank
            }

            Gm.load.loadSpriteFrame("img/Settlement/" + rankBg,(spf,icon)=>{
                    icon.spriteFrame = spf
            },node.getChildByName("wordboss_no1").getComponent(cc.Sprite))


            var aNode = node.getChildByName("New Node")
            for (var i = 0; i < dd[key].length; i++) {
                var v = dd[key][i]
                var item = Gm.ui.getNewItem(aNode)
                item.setData(v)
                item.node.scale = 65/item.node.width
                item.node.width = item.node.height = 65
            }
        }

        Gm.ui.simpleScroll(this.awardScroll,list,function(tmpData,tmpIdx){
            var item = cc.instantiate(this.awardListNode)
            item.active = true
            this.awardScroll.content.addChild(item)

            destFunc(item,tmpData,list[tmpIdx])
            return item
        }.bind(this))
        
        // for (var i = 0; i < list.length; i++) {
        //     var v = list[i]
        //     var item = cc.instantiate(this.awardListNode)
        //     item.active = true
        //     this.awardScroll.content.addChild(item)

        //     destFunc(item,v,list[i+1])
        // }
    },
    onAwardToggleBtn(sender){
        this.updateAward(sender.node._name)
    },
    onAwardChangeClick(){
        this.rankNode.active = !this.rankNode.active
        this.awardNode.active = !this.awardNode.active

        Func.destroyChildren(this.scroll.content)
        Func.destroyChildren(this.awardScroll.content)
        if (this.awardNode.active){
            this.updateAward(this.playerAwardToggle.isChecked?"player":"union")
        }else{
            this.updateNowToggle()
        }
    },
    getSceneData:function(){
        return true
    },
});

