var BaseView = require("BaseView")

// VipLevelUP
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
        oldLab:cc.Label,
        nowLab:cc.Label,
        rich:cc.RichText,
        itemNodes:cc.Node,
        // vipTextUI:require("VipTextUI"),
        awardNode:cc.Node
    },
    enableUpdateView(args){
        if (args){

            this.oldLab.string = "VIP" + args.oldLv
            this.nowLab.string = "VIP" + args.nowLv
            this.titleLab.string = args.nowLv + Ls.get(5043) + Ls.get(60006)

            // var lvConf = Gm.config.getVip(args.nowLv)
            // this.rich.string = lvConf.info
            // this.vipTextUI.setVipLv(args.nowLv)
            this.awardNode.parent = null
            // this.vipTextUI.addNode(this.awardNode)

            Func.destroyChildren(this.itemNodes)

            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_VIP)
            var conf = Func.forBy(list,"id",AtyFunc.getVipActivityId(args.nowLv))
            for (let i = 0; i < conf.reward.length; i++) {
                const v = conf.reward[i];
                var itemBase = Gm.ui.getNewItem(this.itemNodes)
                itemBase.setData(v)
            }
            
            Gm.audio.playEffect("music/31_player_lvup")
        }
    }
});

