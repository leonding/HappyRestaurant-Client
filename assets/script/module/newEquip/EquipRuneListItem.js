cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        checkSp:cc.Node,
        rich:cc.RichText,
        lockNode:cc.Node,
        hasNode:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
        }
        var conf = this.itemBase.updateItem({baseId:data.id})
        this.hasNode.active = this.owner.isNowRuleId(this.data.id)
        // this.setCheck(this.owner.isNowRuleId(data.id))
        this.setCheck(false)
        this.updateLock()
    },
    updateLock(){
        this.lockNode.active = !this.owner.isUnlock(this.data.id)

        var str = 5252
        var color = "<color=#1FFD34>%s/%s</c>"
        if (this.lockNode.active){
            str = 5253
            color = "<color=#FFFFFF>%s/%s</c>"
        }

        var allNum = this.owner.getOtherEquipNum(this.data.id)
        allNum = allNum + (this.owner.isNowRuleId(this.data.id)?1:0)

        this.rich.string = cc.js.formatStr("%s %s",Ls.get(str),cc.js.formatStr(color,allNum,6))
    },
    onBtn(){
        if(this.owner.isNowRuleId(this.data.id)){
            return
        }
        this.owner.onRuneItemClick(this.checkSp.active?null:this)
    },
    setCheck(show){
        this.checkSp.active = show
    },
});


