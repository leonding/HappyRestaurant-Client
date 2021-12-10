cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        serverLab:cc.Label,
        // lvLab:cc.Label,
        nameLab:cc.Label,
        fightLab:cc.Label,
        signLab:cc.Label,
        privateBtn:cc.Node,
        sendBtn:cc.Button,
        receiveBtn:cc.Button, 
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        // this.lvLab.string = Ls.lv() + this.data.arenaFightInfo.level
        this.nameLab.string = this.data.arenaFightInfo.name
        // Func.newHead(this.data.arenaFightInfo.head,this.headNode,this.data.arenaFightInfo.head,this.data.arenaFightInfo.level)
        if(this.data.arenaFightInfo.playerId){
            Func.newHead2(this.data.arenaFightInfo.head,this.headNode) 
        }else{
            if (this.headNode.itembase == null){
                var itemBase = Gm.ui.getNewItem(this.headNode)
                itemBase.node.scale = this.headNode.width/itemBase.node.width
                itemBase.node.zIndex = -1
                itemBase.setTips(false)
                this.headNode.itemBase = itemBase
            }
            this.headNode.itemBase.updateHero({baseId:this.data.arenaFightInfo.head,qualityId:this.data.arenaFightInfo.head,level:this.data.arenaFightInfo.level})
            this.headNode.itemBase.setLabStr(Ls.lv() + this.data.arenaFightInfo.level)
            this.headNode.itemBase.setTips(false)
        }
        this.fightLab.string = Func.transNumStr(this.data.arenaFightInfo.fightValue,true)

        if (this.sendBtn){
            this.sendBtn.interactable = data.sendState==0
            this.receiveBtn.interactable = data.collectState==1

            this.sendBtn.node.getChildByName("checkSpr").active = data.sendState==1
            this.receiveBtn.node.getChildByName("checkSpr").active = data.collectState==2
        }
        if (this.data.arenaFightInfo.serverId){
            this.serverLab.string = Gm.config.serverById(this.data.arenaFightInfo.serverId).name
        }

        this.updateSign()
    },
    updateSign(){
        if(this.signLab){
            var headSpr = this.headNode.itemBase.iconSpr
            if (this.data.leaveTime==0){
                headSpr.color = cc.color(255,255,255)
                this.signLab.string = Ls.get(800022) // this.data.sign || Ls.get(7005)
            }else{
                headSpr.color = cc.color(100,100,100)
                var leaveTime = this.data.leaveTime
                if (this.data.relation == null || this.data.relation == 1){
                    leaveTime = leaveTime + Gm.userData.getLoginPassTime()
                }
                this.signLab.string = this.offlineTime(leaveTime) + Ls.get(7081)
            }
        }
    },
    offlineTime(destTime){
        var _fen = 60
        var _shi = 3600
        var _tian = 86400
        var tmpTian = Math.floor(destTime/_tian)
        if (tmpTian > 0 ){
            return tmpTian + Ls.get(7007)
        }
        var tmpShi = Math.floor((destTime%_tian)/_shi)
        if (tmpShi > 0 ){
            return tmpShi + Ls.get(7008)
        }
        var tmpFen = Math.max(1,Math.floor((destTime%_shi)/_fen))
        return tmpFen + Ls.get(7009)
    },
    onPrivateClick(){
        if (Gm.friendData.getBlack(this.data.arenaFightInfo.playerId)){
            Gm.floating(7051)
            return
        }

        var main = Gm.ui.getScript("MainView")
        main.showChat({player:this.data.arenaFightInfo,enterName:"FriendView"})
    },
    onHeadNodeClick(){
        if (this.data.arenaFightInfo.playerId == Gm.userInfo.id){
            return
        }
        Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
    },
    onSendClick(){
        Gm.friendNet.sendPoint(this.data.playerId)
    },
    onreceiveClick(){
        Gm.friendNet.collectPoint(this.data.playerId)
    },
});
