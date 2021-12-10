cc.Class({
    extends: cc.Component,

    properties: {
        itemPre:cc.Prefab,
        itemNode:cc.Node,
        rankSp:cc.Sprite,
        rankLab:cc.Label,
        nameLab:cc.Label,
        numLab:cc.Label,
        timeLab:cc.Label,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        Func.newHead2(data.info.head,this.itemNode)

        this.nameLab.string = cc.js.formatStr(Ls.get(5342),data.info.level,data.info.name)
        this.numLab.string = cc.js.formatStr(Ls.get(1406), data.towerId)

        this.rankLab.node.active = data.rank > 3
        this.rankSp.node.active = !this.rankLab.node.active
        if (this.rankSp.node.active){
            Gm.load.loadSpriteFrame("texture/newjjc/jjc_img_"+data.rank,function(sp,icon){
                icon.spriteFrame = sp
            },this.rankSp)
        }else{
            this.rankLab.string = data.rank
        }

        this.rankLab.string = data.rank
        this.timeLab.string = cc.js.formatStr(Ls.get(1407),Func.dateFtt("yyyy-MM-dd",new Date(data.time)))
        if (data.towerId == 0){
            this.timeLab.string = ""
        }
    },
    onHeadClick(){
        cc.log(this.data.info)
        if (this.data.info.playerId != Gm.userInfo.id){
            Gm.ui.create("ArenaInfoBox",{player:this.data.info,callback:(type)=>{
                this.owner.onBack()
            }})
        }
    },
});
