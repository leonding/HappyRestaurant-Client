cc.Class({
    extends: cc.Component,
    properties: {
        tipLab:cc.Label,
        numLab:cc.Label,
        priceLab:cc.Label,
        itemNodes:cc.Node,
        ylcIcon:cc.Node,
        discountLab:cc.Label,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        this.tipLab.string = data.name
        this.numLab.string = cc.js.formatStr(Ls.get(5304),data.quota)
        this.priceLab.string = AtyFunc.getPriceStr(data.id)

        var discount  = this.data.discount/100
        if (discount != 0){
            this.discountLab.string = (100-discount) + "%"
            this.discountLab.node.parent.active = true
        }else{
            this.discountLab.node.parent.active = false
        }
        

        for (let index = 0; index < this.data.reward.length; index++) {
            const v = this.data.reward[index];
            var sp = Gm.ui.getNewItem(this.itemNodes)
            sp.setData(v)
            sp.setTips(false)
            sp.node.scale = 0.4
        }
        this.itemNodes.width = (107*0.4*this.data.reward.length) + (this.data.reward.length-1)*5

        this.updateItem()
    },
    updateItem(){
        this.ylcIcon.active = Gm.activityData.isHasAty(this.data.id)
        this.numLab.node.active = !this.ylcIcon.active
        this.priceLab.node.active = !this.ylcIcon.active
    },
    onBtn(){
        if(Gm.activityData.isHasAty(this.data.id)){
            return
        }
        Gm.ui.create("ActivityBuyView",this.data.id)
    },
});


