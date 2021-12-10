var BaseView = require("BaseView")
// AwardBox
cc.Class({
    extends: BaseView,
    properties: {
        itemNode:cc.Node,
        content:cc.Node,
    },
    enableUpdateView(args){
        if (args){
            this.updateView(args)
        }
    },
    updateView:function(data){
        this.itemBase = Gm.ui.getNewItem(this.itemNode,true)
        var conf = this.itemBase.setData(this.openData)
        this.popupUI.setTitle(conf.name)

        Func.destroyChildren(this.content)

        var constData = Func.itemSplit(Gm.config.getConst("suit_eat_one_exp_cost"))[0]
            
        var returnList = []
        if (conf.splitSuitReturn.length == 1){
            conf.splitSuitReturn.push({type:30000,id:5001,num:0})
        }
        var makeNum = 0
        for (var i = 0; i < conf.splitSuitReturn.length; i++) {
            var newData = {type:conf.splitSuitReturn[i].type,id:conf.splitSuitReturn[i].id,num:conf.splitSuitReturn[i].num}
            var itemConf = Gm.config.getItem(newData.id)
            if (itemConf.type == 134){
                newData.num = newData.num + this.openData.suitExp
                if (newData.num > 0){
                    returnList.push(newData)
                }
                var num = newData.num*constData.num
                returnList.push({type:constData.type,id:constData.id,num:num+ checkint(makeNum)})
            }else{
                makeNum = itemConf.chip_cost_silver
                returnList.push(newData)
            }
            
        }

        for (var i = 0; i < returnList.length; i++) {
            var tmpData = returnList[i]

            var itemSp = Gm.ui.getNewItem(this.content,null,105)
            itemSp.setData(tmpData)
        }
    },
    onOkClick:function(){
         Gm.equipNet.smelt([this.openData.equipId],[])
         this.onBack()
    },
});

