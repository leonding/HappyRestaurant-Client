cc.Class({
    extends: cc.Component,
    properties: {
        itemParent:cc.Node,
        nameLab:cc.Label,
        numRich:cc.RichText,
        numNode:cc.Node
    },
    onLoad:function(){

    },
    setData:function(data,owner,itemPre,itemFb){
        this.data = data
        this.owner = owner
        var conf = Gm.config.getHero(data)
      
        var item = cc.instantiate(itemPre)
        item.active = true
        this.itemParent.addChild(item)
        this.itemBase = item.getComponent("ItemBase")
        this.itemBase.updateHero({baseId:data})
        if (Gm.heroData.getHeroByBaseId(data)){
            this.numNode.active = false
            this.numRich.node.active = false
            this.itemBase.m_oIconSpr.node.color = new cc.Color(255,255,255)
        }else{
            this.numRich.string = Gm.heroData.getChipNum(data) + "/" + conf.hero_chip_num
            this.itemBase.m_oIconSpr.node.color = new cc.Color(100,100,100)
        }
        this.nameLab.string = conf.name
        
        if (itemFb){
            this.itemBase.setFb(itemFb)
        }
    },
    setEquipData(data,owner,itemPre){
        this.data = data
        this.owner = owner
        var conf = Gm.config.getEquip(data)
      
        var item = cc.instantiate(itemPre)
        item.active = true
        this.itemParent.addChild(item)
        this.itemBase = item.getComponent("ItemBase")
        this.itemBase.updateEquip({baseId:data})
        this.numNode.active = false
        this.numRich.node.active = false
        this.nameLab.string = conf.name
        
        // this.itemBase.setFb(itemFb)
    },
});

