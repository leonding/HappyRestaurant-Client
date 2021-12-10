//OreUnionAddView
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
         dLabel:cc.Label,
         gLabel:cc.Label,
         pNumB:cc.Label,
         penCNumLabel:cc.Label,

         dNLabel:cc.Label,
         gNLabel:cc.Label,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7500060)}
        this._super()
    },
    enableUpdateView:function(args){
        if(args){
            this.num = args.num
            this.config = args.config
            this.data = args.data
            this.setUI()
        }
    },
    setUI(){
        this.dLabel.string = this.data.perScore// + "/" + Ls.get(7009)
        this.gLabel.string = this.data.perGold// + "/" + Ls.get(7009)
        this.pNumB.string = this.num

        var percent = Gm.config.getOreBuffConfig(this.num).buff / 10000
        this.penCNumLabel.string = "  " + (percent  * 100) + "%"
        this.dNLabel.string = Math.floor(this.data.perScore* (1+percent))// + "/"  + Ls.get(7009)
        this.gNLabel.string = Math.floor(this.data.perGold* (1+percent) )// + "/" + Ls.get(7009)
    },
});


