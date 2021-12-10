cc.Class({
    extends: cc.Component,

    properties: {
        headNode:cc.Node,
        nameLab:cc.Label,
        jobLab:cc.Label,
        offlineRich:cc.RichText,
        devoteLab:cc.Label,
    },
    updateData:function(data,owner){
        data.arenaFightInfo.head =  data.arenaFightInfo.playerId == Gm.userInfo.playerId ? Gm.userInfo.head :  data.arenaFightInfo.head 
        data.arenaFightInfo.name =  data.arenaFightInfo.playerId == Gm.userInfo.playerId ? Gm.userInfo.name :  data.arenaFightInfo.name
        this.data = data
        this.owner = owner
        this.nameLab.string = data.arenaFightInfo.name + " Lv." + data.arenaFightInfo.level
        Func.newHead2(data.arenaFightInfo.head,this.headNode,null,data.arenaFightInfo.level)

        var bgPath = this.data.arenaFightInfo.playerId == Gm.userInfo.id?"share_img_db3sl":"share_img_db3"
        // if (this.data.arenaFightInfo.playerId == Gm.userInfo.id){
        //     this.node.getComponent(cc.Sprite).spriteFrame = this.userSprFrame
        // }else{
        //     this.node.getComponent(cc.Sprite).spriteFrame = this.otherSprFrame
        // }
        this.loadBg(bgPath)

        var roleStr = Gm.unionData.roleStr(data.arenaFightInfo.role)
        this.jobLab.string = cc.js.formatStr(Ls.get(800013),roleStr)
        this.offlineRich.node.active = false
        if (Gm.config.getConst("show_offline_time") == 1 ){
            this.offlineRich.node.active = true
            if(this.data.arenaFightInfo.leaveTime > 0 ){
                this.offlineRich.string = cc.js.formatStr(Ls.get(800021),Func.timeToHmsAgo(this.data.arenaFightInfo.leaveTime))
                this.offlineRich.color = cc.color(79,91,157)
            }else{
                this.offlineRich.color = cc.color(10,140,14)
                this.offlineRich.string = Ls.get(800170)
            }
        }
        this.devoteLab.string = data.devote
    },
    loadBg(path){
        if(this.lastPath == path){
            return
        }
        this.lastPath = path
        
        Gm.load.loadSpriteFrame("img/share/" +path,(sp,owner)=>{
            if (this.node && this.node.isValid){
                owner.spriteFrame = sp
            }
        },this.node.getComponent(cc.Sprite))
    },
    onHeadClick(){
        if (this.data.arenaFightInfo.playerId == Gm.userInfo.id){
            return
        }
        Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
    },
    onNodeClick(){
        if (this.data.arenaFightInfo.playerId == Gm.userInfo.id){
            return
        }
        
        Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
    },
});
