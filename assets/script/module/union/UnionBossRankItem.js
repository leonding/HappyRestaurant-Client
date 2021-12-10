cc.Class({
    extends: cc.Component,
    properties: {
        rankSpr:cc.Sprite,
        rankLab:cc.Label,
        headNode:cc.Node,
        nameLab:cc.Label,
        fightLab:cc.Label,
    },
    setData:function(data,rank,hurt){
        this.data = data

        
        Func.newHead2(this.data.head,this.headNode,null,this.data.level)
        this.nameLab.string = this.data.name

        this.fightLab.string  = hurt


        if (rank == 0){
            this.rankLab.node.parent.active = true
            this.rankSpr.node.active = false
            this.rankLab.string = Ls.get(800026)
            // this.rankLab.node.color = cc.color(235,83,12)
        }else{
            this.rankLab.node.parent.active = rank > 3
            this.rankSpr.node.active = !(rank > 3)
            if (this.rankSpr.node.active){
                Gm.load.loadSpriteFrame("img/tower/tower_icon_hz"+rank,function(sp,icon){
                    icon.spriteFrame = sp
                },this.rankSpr)
            }else{
                this.rankLab.string = rank
                this.rankLab.node.color = cc.color(235,83,12)
            }
        }
    },
   
});


