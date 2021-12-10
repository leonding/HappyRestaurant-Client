var BaseView = require("BaseView")

// LotteryJobSelect
cc.Class({
    extends: BaseView,
    properties: {
        msgLabel:cc.Label,
        selectBtns:{
            default:[],
            type:cc.Node,
        },
        selectedNode:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7100038),isClose:false}
        this._super()

        var percent = (LotteryFunc.getTzEquipPercent() * 100).toFixed(2) + "%"
        this.msgLabel.string = cc.js.formatStr(Ls.get(7100039),percent)
    },
    enableUpdateView(args){
       if(args){
           this.callBack = args.callback
           this.selectedIndex = Gm.lotteryData.getTzJob()
           this.setSelectedNode(this.selectedIndex)
       }
    },
    setSelectedNode(jobIndex){
         this.selectedNode.x = this.selectBtns[jobIndex-1].x
    },
    onJobClick(send,data){
        this.selectedIndex = data
        this.setSelectedNode(data)
    },
    onBack(){
          if(this.callBack){
           var index = Gm.lotteryData.getTzJob()
            if(this.selectedIndex && this.selectedIndex != index){
                this.callBack(this.selectedIndex)
                Gm.cardNet.sendSetHeroAndJob()
            }
        }
        this._super()
    },
});

