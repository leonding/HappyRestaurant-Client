cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        rich:cc.RichText,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.node.scale = this.itemNode.width/this.itemBase.node.width
        }
        var count = data.num
        data.num = null
        this.itemBase.setData(data)
        cc.log(count,"gggggggggggggggg")
        this.rich.string = count + "wwwwwwwww"
        // this.itemBase.updateItem({baseId:data.id,count:Gm.bagData.getNum(data.id)})
    },
    
});


