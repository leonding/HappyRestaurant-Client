//OreRankItem
cc.Class({
    extends: cc.Component,
    properties: {
        indexLabel:cc.Label,
        indexSprite:cc.Sprite,
        indexIcon:cc.Sprite,

        headNode:cc.Node,
        serverName:cc.Label,
        unionName:cc.Label,
        nameLabel:cc.Label,
        dnumLabel:cc.Label,
    },
    setUI(data,rank){
        this.data = data
        this.rank = rank
        this.setHeadNode()
        this.setRank()
    },
    setHeadNode(){
        Func.newHead2(this.data.info.head,this.headNode)
        this.nameLabel.string = this.data.info.name
        this.unionName.string = this.data.info.allianceName || "" 
        var serverConfig   = Gm.config.serverById(this.data.info.serverId)
        this.serverName.string = serverConfig.name
        this.dnumLabel.string = this.data.score
    },
    setRank(){
         if(this.rank <=3){
            if(this.indexSprite){
                Gm.load.loadSpriteFrame("img/tower/tower_icon_hz"+this.rank,function(sp,icon){
                    if(icon && icon.node.isValid){
                        icon.spriteFrame = sp
                    }
                },this.indexSprite)
                Gm.load.loadSpriteFrame("img/shuijing/crystal_icon_ph_"+this.rank,function(sp,icon){
                        if(icon && icon.node.isValid){
                            icon.spriteFrame = sp
                        }
                },this.indexIcon)
                this.indexLabel.node.active = false
            }
            else{
                 this.indexLabel.node.active = true
                var str = this.rank
                if(this.rank == null){
                    str = Ls.get(7500052)
                }
                this.indexLabel.string =  str
            }
         }
         else{
            if(this.indexSprite){
                this.indexIcon.node.active = false
                this.indexSprite.node.active =false
            }
            var str = this.rank
            if(this.rank == null){
                str = Ls.get(7500052)
            }
            this.indexLabel.string =  str
         }
    }
});