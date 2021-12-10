var BaseView = require("BaseView")
const max_num = 100
cc.Class({
    extends: BaseView,
    properties: {
        numLab:cc.Label,
        needNumLab:cc.Label,
        itemNode:cc.Node,
        limitRich:cc.RichText,
    },
    onLoad:function(){
        this.popupUIData = {title:Ls.get(7500030)}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.currNum = 0
            this.currData = args
            this.price = OreFunc.getOreBattleCardPrice()
            this.item = Func.itemConfig({itemType:ConstPb.itemType.PLAYER_ATTR,id:1001})
            this.maxNum =   Math.min(Math.floor(this.item.num / this.price),Gm.oreData.getBuyMaxNum())

            var num = Gm.oreData.getBuyMaxNum()
            var colorStr = "<color=#00FF00>%s</c>"
            this.limitRich.string = cc.js.formatStr(Ls.get(5304),":",cc.js.formatStr(colorStr,num))
            this.setUI()
        }
    },
    setUI(){
        var item = Gm.ui.getNewItem(this.itemNode,true)
        item.setData({type:30000,id:OreFunc.getOreBattleCardId(),num:0})
        if(this.maxNum >=1){
            this.updateNum(1)
        }
        else{
            this.updateNum(0)
        }
    },
    updateNum:function(destValue){
        this.currNum = this.currNum + destValue
        if (this.currNum < 0){
            this.currNum = 0
        }
        if (this.currNum > this.maxNum && this.maxNum != -1){
            this.currNum = this.maxNum
        }

        this.numLab.string = this.currNum
        this.m_tNeedNums = this.currNum * this.price
        this.needNumLab.string = this.m_tNeedNums
    },
    onAdd:function(){
        this.updateNum(1)
    },
    onRight:function(){
        this.updateNum(max_num)
    },
    onJian:function(){
        this.updateNum(-1)
    },
    onLeft:function(){
        this.updateNum(-max_num)
    },
    onOkBtn(){
        if (this.currNum > 0 && this.m_tNeedNums){
            this.currData.callback(this.currNum)
            this.onBack()
        }
    }
});

