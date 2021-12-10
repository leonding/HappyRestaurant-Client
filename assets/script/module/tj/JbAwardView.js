var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemPerfab: cc.Prefab,
        listItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        questionSpf:cc.SpriteFrame,
    },
    onLoad:function(){
        this._super()
        var cons = Gm.config.getJbAwards()
        this.heros = []
        for (let index = cons.length-1; index >=0; index--) {
            const v = cons[index];
            var itemNode = cc.instantiate(this.listItem)
            itemNode.active = true
            this.scrollView.content.addChild(itemNode)
            var nameLab = itemNode.getChildByName("nameLab").getComponent(cc.Label)
            nameLab.string = v.id + Ls.get(400004)

            var heroNode = itemNode.getChildByName("heroNode")
            var heroList = []
            for (let i = 0; i < v.id; i++) {
                var hero = this.getItem(true)
                var itemSp = hero.getComponent("ItemBase")
                heroNode.addChild(hero)
                heroList.push(itemSp)
            }
            this.heros.push({list:heroList,node:itemNode.getChildByName("completeNode")})
            var awardNode = itemNode.getChildByName("awardNode")
            for (let i = 0; i < v.sparkReward.length; i++) {
                var dd = v.sparkReward[i]
                var itemBase = this.getItem()
                awardNode.addChild(itemBase)
                var itemSp = itemBase.getComponent("ItemBase")
                if(dd.type == ConstPb.itemType.TOOL){
                    itemSp.updateItem({baseId:dd.id,count:dd.num})
                }else if (dd.type == ConstPb.itemType.EQUIP){
                    itemSp.updateEquip({baseId:dd.id})
                }
            }
        }
        this.scrollView.content.height = 20+(cons.length*270)
    },
    getItem:function(isHero){
        var item = cc.instantiate(this.itemPerfab)
        item.active = true
        item.scale = 0.65
        if (isHero){
            var node = new cc.Node()
            var sprite = node.addComponent(cc.Sprite)
            sprite.spriteFrame = this.questionSpf
            item.addChild(node,0,"question")
        }
        var itemSp = item.getComponent("ItemBase")
        itemSp.updateItem()
        return item
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },
    updateView:function(){
        for (let index = 0; index < this.heros.length; index++) {
            const v = this.heros[index];
            this.updateHeros(v)
        }
    },
    updateHeros:function(heroList){
        var list = Gm.config.getJbsByNum(heroList.list.length)
        for (let i = 0; i < list.length; i++) {
            const conf = list[i];
            heroList.node.active = false
            for (let j = 0; j < conf.sparkCondition.length; j++) {
                const heroId = conf.sparkCondition[j];
                if (Gm.heroData.getHeroByBaseId(heroId) == null){
                    return
                }
            }
            heroList.node.active = true
            for (let l = 0; l < heroList.list.length; l++) {
                const itemBase = heroList.list[l];
                var heroId = conf.sparkCondition[l]
                itemBase.updateHero({baseId:heroId})
                itemBase.node.getChildByName("question").active = false
            }
            return
        }
    },
    
});

