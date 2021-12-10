var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        DropDownItem:cc.Node,
        scrollView:cc.ScrollView
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = this.openData.list

        this.items = []
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.DropDownItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("DropDownItem")
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
            if (index == list.length-1){
                itemSp.fgtIcon.active = false
            }
        }

    },
    onBack(){
        if (this.items){
            for (let index = 0; index < this.items.length; index++) {
                const v = this.items[index];
                if (v.isChecked){
                    this.openData.callback(v.data)
                }
            }
        }
        this._super()
    },
});

