var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        WorldBossRankItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        myRankRich:cc.RichText,
        myHarmRich:cc.RichText,
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    updateView(){
        Func.destroyChildren(this.scrollView.content)
        var itemHeight = 0
        var list = Gm.worldBossData.rankData.ranks
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.WorldBossRankItem)
            item.active = true
            itemHeight = item.height
            this.scrollView.content.addChild(item)

            var rank = index +1

            var rankLab = item.getChildByName("rankLab").getComponent(cc.Label)
            var rankSpr = item.getChildByName("rankSpr").getComponent(cc.Sprite)
            rankSpr.node.active = false
            if (rank > 3){
                rankLab.string = rank
            }else{
                rankLab.node.active = false
                rankSpr.node.active = true
                Gm.load.loadSpriteFrame("texture/newjjc/jjc_img_"+rank,function(sp,spr){
                    spr.spriteFrame = sp
                },rankSpr)
            }

            item.getChildByName("nameLab").getComponent(cc.Label).string = itemData.name
            Func.newHead2(itemData.head,item.getChildByName("head"))
            item.getChildByName("head").itemIndex = index
            var hurtRich = item.getChildByName("harmRich").getComponent(cc.RichText)
            hurtRich.string = cc.js.formatStr("<color=#F0EFDC>%s</c><color=#FF0000>%s</color>",Ls.get(1122),Func.transNumStr(itemData.hurt,true))
        }
        this.scrollView.content.height = (itemHeight)*Math.ceil((list.length))
        this.scrollView.scrollToTop()

        var strColor = "<color=#F0EFDC>%s</c><color=#F0EFDC>%s</color>"
        var myRank = Gm.worldBossData.rankData.rank
        this.myRankRich.string = cc.js.formatStr(strColor,Ls.get(1121),myRank>0?myRank:Ls.get(800145))
        this.myHarmRich.string = cc.js.formatStr("<color=#F0EFDC>%s</c><color=#FF0000>%s</color>",Ls.get(1122),Func.transNumStr(Gm.worldBossData.rankData.hurt,true))
    },
    onHead(sender){
        var player = Gm.worldBossData.rankData.ranks[sender.currentTarget.itemIndex]
        cc.log(player)
    },
});

