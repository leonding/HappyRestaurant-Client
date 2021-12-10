var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        EventListItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
    },
    onLoad:function(){
        this._super()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var list = EventFunc.getXsConfs()
        this.items = []
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var item = cc.instantiate(this.EventListItem)
            item.active = true
            this.scrollView.content.addChild(item)

            var sp = item.getComponent("EventListItem")
            sp.setData(v,this)
            this.items.push(sp)
        }
        this.updateTime()
    },
    updateTime(){
        if (this.items){
            for (let index = 0; index < this.items.length; index++) {
                const v = this.items[index];
                v.updateTime()
            }
        }
    },
    
});

