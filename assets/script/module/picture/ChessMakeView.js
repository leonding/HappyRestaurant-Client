var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        makeNode:cc.Node,
        sucNode:cc.Node,

        item1:require("PictureChessItem"),
        item2:require("PictureChessItem"),
        item3:require("PictureChessItem"),
    },
    onLoad:function(){
        this._super()
    },
    register:function(){
        this.events[MSGCode.OP_CHESSSKILL_VIEW_S] = this.onUpdateChess.bind(this)
    },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    onUpdateChess(args){
        if (args){
            cc.log(args,Gm.gamePlayNet.chessTargetId)
            this.nodeState(false)

            this.item3.setData(Func.forBy(args.chessList,"id",Gm.gamePlayNet.chessTargetId) ,this,args.treasure)
            this.item3.select(true)
        }
    },
    updateView(){
        this.nodeState(true)
        this.item1.setData(this.openData.nowData,this,this.openData.treasure)
        this.item1.select(true)
        this.item2.setData(this.openData.targetData,this,this.openData.treasure)
        this.item2.select(true)
    },
    nodeState(show){
        this.makeNode.active = show
        this.sucNode.active = !show
    },
    onOkClick(){
        // Gm.box({title:Ls.get(2324),msg:Ls.get(2325),ok:Ls.get(2326)},(btnType)=>{
        //     if (btnType == 1){
        //         Gm.gamePlayNet.mergeChess(this.openData.nowData.id,this.openData.targetData.id,this.openData.page,this.openData.treasure)
        //     }
        // })
        Gm.gamePlayNet.mergeChess(this.openData.nowData.id,this.openData.targetData.id,this.openData.page,this.openData.treasure)
        // Gm.gamePlayNet.chessTargetId = this.openData.nowData.id
        
        // this.onUpdateChess({treasure:true,page:4,type:1,chessList:Gm.pictureData.getChessData(4,this.openData.treasure)})
    },

});

