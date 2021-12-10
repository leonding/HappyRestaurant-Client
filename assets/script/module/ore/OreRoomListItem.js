//OreRoomListItem
cc.Class({
    extends: cc.Component,
    properties: {
        titleLabel:cc.Label,
        desLabel:cc.Label,
        numLabel:cc.Label,
        oreSprite:cc.Sprite,
        oreBgSprite:cc.Sprite,
    },
    setUI(data,callback){
        this.data = data
        this.callback = callback
        this.config = Gm.config.getOreConfigByType(this.data.type)
        this.setTitleLabel()
        this.setOreSprite()
        this.setNumLabel()
    },
    setTitleLabel(){
        this.titleLabel.string = this.config.name + this.data.roomIndex
    },
    setOreSprite(){
        var scale = 0.6
        if(this.data.type == 1){
            scale = 0.5
        }
        Gm.load.loadSpriteFrame("/img/shuijing/" + this.config.icon,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
                icon.node.scale = scale
            }
        },this.oreSprite)

        Gm.load.loadSpriteFrame("/img/shuijing/" + this.config.room,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.oreBgSprite)
    },
    setNumLabel(){
        var num = Gm.oreData.getRoomPlayerNum(this.data) 
        this.numLabel.string = num + "/" + this.data.oreList.length
        if(num == this.data.oreList.length){
            this.numLabel.node.color = new cc.Color(255,0,0)
        }
        else{
            this.numLabel.node.color = new cc.Color(0,255,0)
        }
        this.desLabel.string = Ls.get(7500016) + "(      )"
    },
    onItemClick(){
        if(this.callback){
            this.callback(this.data)
        }
    }
});