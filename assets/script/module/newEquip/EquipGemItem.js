cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        lookSpr:cc.Node,
        tipsNode:cc.Node,
        descRich:cc.RichText,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setChoice(true)
        }

        this.lookSpr.active = data.gemItemId == -1
        this.tipsNode.active = this.lookSpr.active
        this.descRich.node.active = data.gemItemId > 0
        if (data.gemItemId == 0){
            this.itemBase.setChoice(true)
            this.itemBase.setData()
        }else if (data.gemItemId > 0){
            var itemConf = this.itemBase.updateItem({baseId:data.gemItemId})
            var str = itemConf.name + "\n"
            var gemCon = Gm.config.getGem(data.gemItemId)
            var baseStr = Func.baseStr(gemCon.attrId,gemCon.value).replace("：", "\n+")
            this.descRich.string = baseStr
        }else{
            this.itemBase.setChoice(false)
            this.itemBase.setData()
        }
    },
    onBtn:function(){
        this.owner.onGemItemClick(this.data)
    },
    isUnlock(){
        return this.data.gemItemId != -1
    },
});


