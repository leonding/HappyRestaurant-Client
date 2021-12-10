cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        nameLab:cc.Label,
        checkSp:cc.Node
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
        }
        this.itemBase.updateHero({baseId:data.heroGroupId,qualityId:data.qualityId})
        // var conf = Gm.config.getEquip(data.baseId)
        this.nameLab.string = data.name

        var heroRelate = Gm.heroData.getRelateByGroupId(owner.data.idGroup).heroRelate
        if(Func.forBy2(heroRelate,"playerId",data.playerId,"heroGroupId",data.heroGroupId)){
            this.owner.onItemClick(this)
        }
    },
    onBtn(){
        if (this.isCheck()){
            this.setCheck(false)
            return
        }
        this.owner.onItemClick(this)
    },
    setCheck(show){
        this.checkSp.active = show
    },
    isCheck(){
        return this.checkSp.active
    }
});


