cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        applyIcon:cc.Node,
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.headNode)
            this.itemBase.setTips(false)
            this.itemBase.node.scale = this.node.width/(125)
        }
        data.list.sort((a,b)=>{
            return a.qualityId - b.qualityId
        })

        this.itemBase.updateHero({qualityId:data.list[data.list.length-1].qualityId})

        var hasApply = false
        for (let index = 0; index < data.list.length; index++) {
            const v = data.list[index];
            if (v.request){
                hasApply = true
                break
            }
        }

        this.applyIcon.active = hasApply
    },
    onClick(){
        // if (Gm.friendData.hireList && Gm.friendData.hireList.length == 3){
        //     Gm.floating("您当前的租借数量已达上限！")
        //     return
        // }
        Gm.ui.create("HireApplyView",this.data)
    },
});
