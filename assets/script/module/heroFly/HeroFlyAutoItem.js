cc.Class({
    extends: cc.Component,
    properties: {
        nowHero:cc.Node,
        nextHero:cc.Node,
        needParent:cc.Node,
        toggle:cc.Toggle,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        
        var heroData = Gm.heroData.getHeroById(data.heroId)

        this.updateHero(heroData.qualityId,this.nowHero)

        var heroConf = Gm.config.getHero(heroData.baseId,heroData.qualityId)
        var nextHeroId = 0
        for (var i = 0; i < heroConf.qualityProcess.length; i++) {
            if (heroConf.qualityProcess[i] == heroData.qualityId){
                nextHeroId = heroConf.qualityProcess[i+1]
                break
            }
        }
        if (nextHeroId == 0){
            cc.error(Ls.get(5324),heroData.qualityId,heroConf.qualityProcess)
            return
        }
        this.updateHero(nextHeroId,this.nextHero)


        Func.destroyChildren(this.needParent)
        

        var index = 0
        for(const key in data.listId){
            var itemNode = new cc.Node()
            itemNode.width = itemNode.height = 95
            this.needParent.addChild(itemNode)

            var itemBase = Gm.ui.getNewItem(itemNode,true)
            itemBase.updateHero(Gm.heroData.getHeroById(key))
            index = index + 1
        }
    },
    updateHero(qualityId,itemNode){
        var itemBase = Gm.ui.getNewItem(itemNode,true)
        itemBase.updateHero({baseId:qualityId})
    },
    isChecked(){
        return this.toggle.isChecked
    },
    onClick(){
    },
});


