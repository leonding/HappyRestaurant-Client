var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        UnionBossRankItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        selfRankItem:require("UnionBossRankItem")
    },
    onLoad:function(){
        this.popupUIData = {title:800107}
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    updateView(){
        var list = Gm.unionData.bossRankData.ranks

        var rank = 0
        var hurt = 0
        Func.destroyChildren(this.scrollView.content)
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.UnionBossRankItem)
            item.active = true
            this.scrollView.content.addChild(item)
            cc.log(item,"wwwww")
            var itemSp = item.getComponent("UnionBossRankItem")
            itemSp.setData(itemData.info,index+1,itemData.hurt)

            if (itemData.info.playerId == Gm.userInfo.id){
                rank = index + 1
                hurt = itemData.hurt
            }
        }

        this.scrollView.scrollToTop()

        var dd = {}

        dd.head = Gm.userInfo.head
        dd.name = Gm.userInfo.name
        dd.level = Gm.userInfo.level
        
        this.selfRankItem.setData(dd,rank,hurt)
        this.selfRankItem.node.active = true


        // var strColor = "<color=#673A1F>%s</c><color=#913700>%s</color>"
        // this.rankLab.string = cc.js.formatStr(strColor,Ls.get(800144),userRank>0?userRank:Ls.get(800145))
        // this.fightLab.string = cc.js.formatStr(strColor,Ls.get(800146),harm)
    },
});

