cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        check:cc.Node,
    },
    setData:function(data,owner){
        this.setCheck(false)
        this.owner = owner
        this.data = data

        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
        }
        this.itemBase.updateEquip(data)

        this.showRed()
    },
    showRed(){
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.node)
        }
        this.redNode.active = this.owner.isRed(this.data)
    },
    setCheck(is){
        this.check.active = is
        if (this.owner){
            this.owner.onItemClick(this)
        }
    },
    isCheck(){
        return this.check.active
    },
    onBtn(){
        if (this.isCheck()){
            return
        }
        this.setCheck(!this.isCheck())
        // this.scheduleOnce(()=>{
        //     this.owner.onItemClick()
        // },0.01)
    },
});


