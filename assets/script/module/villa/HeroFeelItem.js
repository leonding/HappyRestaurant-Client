cc.Class({
    extends: cc.Component,

    properties: {
        bgSpr:cc.Sprite,
        itemNode:cc.Node,
        numLab:cc.Label,
        heartNode:cc.Node,
        nameLab:cc.Label,
        rich:cc.RichText,
    },
    setData:function(itemConf,owner){
        this.itemConf = itemConf
        this.owner = owner

        this.newItem = Gm.ui.getNewItem(this.itemNode)
        this.newItem.node.scale = this.itemNode.width/this.newItem.node.width
        this.newItem.updateItem({baseId:itemConf.id})
        this.newItem.setTips(false)

        this.nameLab.string = this.itemConf.name

        this.updateItemCount()
        this.setCheck(false)
        this.setLove(false)
    },
    updateItemCount(){
        this.newItem.updateCount()
        this.reladCount = Gm.bagData.getNum(this.itemConf.id)
        this.updateChoiceCount(0)
    },
    updateChoiceCount(count){
        this.choiceCount = count
        if (this.choiceCount >= this.reladCount){
            this.choiceCount = this.reladCount
        }
        this.updateCount()
    },
    updateCount(){
        this.numLab.string = "x" + (this.reladCount - this.choiceCount)
    },
    setLove(love){
        this.isLove = love
        this.heartNode.active = this.isLove
        this.updateAddValue()
    },
    updateAddValue(){
        var newStr = cc.js.formatStr("<color=#ffffff>%s</c><color=#FFFF00>%s</c>",Ls.get(5839),this.itemConf.train_exp)//好感度
        if (this.isLove){
            newStr = newStr + cc.js.formatStr("<color=#00FF00>(+%s)</c>",Gm.config.getConst("hero_other_intimate_" + this.itemConf.quality))
        }
        this.rich.string = cc.js.formatStr("<outline color='#000000' width=2>%s</outline>",newStr)
    },
    setCheck(is){
        this.bgSpr.spriteFrame = this.owner.itemBgSpf[is?1:0]
    },
    onItemClick(){
        this.owner.onItemClick(this)
    },
});

