cc.Class({
    extends: cc.Component,

    properties: {
        itemNode:cc.Node,
        hpBar:cc.ProgressBar,
        mpBar:cc.ProgressBar,
        grayNode:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        if (this.itemBase == null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.node.scale = this.itemNode.width/this.itemBase.node.width
            if (data.heroId && Gm.heroData.getHeroById(data.heroId)){
                this.itemBase.updateHero(Gm.heroData.getHeroById(data.heroId))
            }else{
                this.itemBase.updateHero(data)
            }
        }
        
        if (data.hp == 0 && data.maxMp != 0){
            this.setDead(true)
        }else{
            this.setDead(false)
        }
    },
    setDead(isDead){
        if (isDead){
            this.hpBar.progress = 0
            this.mpBar.progress = 0
        }else{
            this.hpBar.progress = this.data.hp/this.data.maxHp
            this.mpBar.progress = this.data.mp/this.data.maxMp
        }
        if (this.grayNode){
            this.grayNode.active = isDead
        }
    },
});

