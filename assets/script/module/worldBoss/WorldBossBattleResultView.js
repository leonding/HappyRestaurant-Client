var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        hurtLab:cc.Label,
        totalHurtLab:cc.Label,
        rankLab:cc.Label,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.hurtLab.string = Func.transNumStr(args.hurt,true)
            this.totalHurtLab.string = Func.transNumStr(args.totalHurt,true)
            this.rankLab.string = args.rank
        }
    },
});

