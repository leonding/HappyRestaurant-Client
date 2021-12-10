//OreMainViewItem
cc.Class({
    extends: cc.Component,
    properties: {
        nameBgSprite:cc.Sprite,
        nameLabel:cc.Label,
        noNameNode:cc.Node,

        iconSpirte:cc.Sprite,
        oreNameLabel:cc.Label,
        fightValueLabel:cc.Label,

        rewardNodes:{
            default:[],
            type:cc.Node
        },
        
    },
    setUI(id,i,pos,callback,pos2){
        this.callback = callback
        this.id = id
        this.data = Gm.oreData.getOreById(this.id)
        this.node.x = pos[i].x
        this.node.y = pos[i].y
        this.iconSpirte.node.x = pos2[i].x
        this.iconSpirte.node.y = pos2[i].y + 27

        this.config = Gm.config.getOreConfigById(this.data.oreId)
        this.setNameAndHead()
        this.setOreName()
        this.setReward()
        this.setAnimation()
    },
    setNameAndHead(){

        if(this.data.info){
            this.nameLabel.node.active = true
            this.nameLabel.node.color = OreFunc.getNameTitleColor(this.data)
            var serverConfig   = Gm.config.serverById(this.data.info.serverId)
            this.nameLabel.string = serverConfig.name  +" "+ this.data.info.name
            this.fightValueLabel.string = this.data.info.fightValue || 0
            this.noNameNode.active = false
        }
        else{
            this.nameLabel.node.active = false
            this.noNameNode.active = true
        }
        var str = OreFunc.getNameBgSpriteName(this.data)
        Gm.load.loadSpriteFrame(str,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.nameBgSprite)
    },
    setOreName(){
        this.oreNameLabel.string = this.config.name
        Gm.load.loadSpriteFrame("/img/shuijing/" + this.config.icon,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.iconSpirte)

         if(!this.data.info){
             this.fightValueLabel.string = Math.floor(this.config.military)
         }

        if(this.data.oreId == 101){
            this.iconSpirte.node.scale = Gm.config.getConst("ore_shuijing_size1")
        }
        else{
            this.iconSpirte.node.scale = 1
        }
    },
    setReward(){
        this.rewardNodes[0].getChildByName("numLabel").getComponent(cc.Label).string = this.data.perScore + "/" + Ls.get(7009)
        this.rewardNodes[1].getChildByName("numLabel").getComponent(cc.Label).string = this.data.perGold + "/" + Ls.get(7009)
    },
    setAnimation(){
        var key = (this.data.info && this.data.info.playerId == Gm.userInfo.id)
        if(this.animationNode){
            this.animationNode.active = key
            return
        }
        if(key){
            var self = this
            Gm.load.loadPerfab("perfab/ui/wakuang",function(Perfab){
                if(self.node && self.node.isValid && !self.animationNode){
                    var item = cc.instantiate(Perfab)
                    item.scale = 0.7
                    item.getComponent(cc.Animation).play("wakuang")
                    self.node.addChild(item)
                    self.animationNode = item
                }
            })
        }
    },
    onItemClick(){
        if(this.callback){
            this.callback(this.data)
        }
    },
    updateItem(){
        this.data = Gm.oreData.getOreById(this.id)
        this.setNameAndHead()
        this.setOreName()
        this.setReward()
        this.setAnimation()
    }
});


