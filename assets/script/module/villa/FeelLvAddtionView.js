cc.Class({
    extends: require("BaseView"),

    properties: {
        FeelLvAddtionNode:cc.Node,
        scroll:cc.ScrollView,
    },
    onLoad(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.updateView()
        }
    },
    updateView(){
        var list = Gm.config.getHeroFeelByLv(this.openData.baseId)
        for (var i = 1; i < list.length; i++) {
            var v = list[i]
            var item = cc.instantiate(this.FeelLvAddtionNode)
            item.active = true
            this.scroll.content.addChild(item)

            var lab1 = item.getChildByName("lab1").getComponent(cc.Label)
            lab1.string = Ls.lv() + v.intimateLv
            var lab2 = item.getChildByName("lab2").getComponent(cc.Label)


            var str = ""
            for (var j = 0; j < v.Property.length; j++) {
                var baseName = EquipFunc.getBaseIdToName(v.Property[j].id)
                var baseNum = EquipFunc.getBaseIdToNum(v.Property[j].id,v.Property[j].num)

                if (j == 3){
                    str = str + "\n"
                }else if (j > 0){
                    str = str + " "    
                }
                str = str + baseName + ":" + baseNum
            }
            lab2.string = str

            var color = v.intimateLv!=this.openData.lv?cc.color(0,0,0):cc.color(8,163,0)
            lab1.node.color = color
            lab2.node.color = color
            this.sizeChange(lab2.node)
        }

        if (this.openData.lv >= 7){
            this.scroll.scheduleOnce(()=>{
                this.scroll.scrollToBottom()
            },0.01)
        }
    },
    sizeChange(content){
        content.on("size-changed", ()=>{
            content.parent.height =content.height+10
        })
    },
});
