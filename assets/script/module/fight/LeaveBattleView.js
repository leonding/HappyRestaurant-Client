// LeaveBattleView
cc.Class({
    extends: require("BaseView"),
    properties: {
        byteLabel:cc.Label,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView:function(data){
        if (data){
            Gm.removeLoading()
            var str = "300|301|302|303|304|305|306|307|308|309"
            this.usefulArray = str.split("|")
            this.byteLabel.string = Ls.get(this.usefulArray[Func.random(0,this.usefulArray.length)])
        }
    },
});
