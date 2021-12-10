
cc.Class({
    extends: cc.Component,

    properties: {
        headNode:cc.Node,
        fightRich:cc.RichText,
        gxzRich:cc.RichText,
        signLab:cc.Label,
        btn1:cc.Button,
        btn2:cc.Button,
    },
    updateData:function(data,owner){
        this.data = data
        this.owner = owner
        // this.nameLab.string = data.name
        Func.newHead2(data.arenaFightInfo.head,this.headNode)
        this.btn1.interactable = Gm.unionData.isMgr()
        this.btn2.interactable = Gm.unionData.isMgr()

        this.fightRich.string = cc.js.formatStr("<outline color='#000000' width=2><color=#ffffff>%s</c><color=#17ed0c>%s %s</color></outline>",Ls.lv(),data.arenaFightInfo.level,data.arenaFightInfo.name)
        this.gxzRich.string = cc.js.formatStr("<outline color='#000000' width=2><color=#ffffff>%s</c><color=#17ed0c>%s</color></outline>",Ls.get(800023),data.arenaFightInfo.fightValue)
        this.signLab.string = data.applyMessage || ""
    },
    onHeadClick(){
        Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
    },
    onBtn1Click(){
        Gm.unionNet.replyApply(this.data.arenaFightInfo.playerId,1)
    },
    onBtn2Click(){
        Gm.unionNet.replyApply(this.data.arenaFightInfo.playerId,0)
    },
});
