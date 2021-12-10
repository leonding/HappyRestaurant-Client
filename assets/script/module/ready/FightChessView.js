var BaseView = require("BaseView")
// FightYokeView
cc.Class({
    extends: BaseView,

    properties: {
        FightChessItem:cc.Node,
        itemNode:cc.Node,

        tipsNode:cc.Node,
        tipsNameLab:cc.Label,
        tipsLabNode:cc.Node,
        tipsRich:cc.RichText
    },
    register:function(){
        this.events[MSGCode.OP_CHESSSKILL_VIEW_S] = this.onUpdateChess.bind(this)
    },
    enableUpdateView:function(data){
        if (data){
            Func.destroyChildren(this.itemNode)
            this.selectType = Gm.config.getPicturePuzzle(Gm.pictureData.getNowId(this.openData.treasure)).type
            this.updateView()
        }
    },
    onUpdateChess(args){
        this.updateView()
        if (args.type == 1){
            this.updateSelectItem({id:Gm.gamePlayNet.chessTargetId})
        }
    },
    updateView(){
        var list = Gm.pictureData.getChessData(this.selectType,this.openData.treasure)
        if (list == null){
            Gm.gamePlayNet.openChess(this.selectType,this.openData.treasure)
            return 
        }
        var newList = []
        for (let index = 0; index < this.openData.readyList.length; index++) {
            const heroId = this.openData.readyList[index];
            newList[heroId] = []
        }
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (newList[v.heroId]){
                newList[v.heroId].push(v.skillId)
            }
        }

        for (const key in newList) {
            var item = cc.instantiate(this.FightChessItem)
            item.active = true
            this.itemNode.addChild(item)
            var itemSp = item.getComponent("FightChessItem")
            itemSp.setData(key,newList[key],this)
        }
    },
    openTips(hero,skills){
        // Func.destroyChildren(this.tipsLabNode)
        this.tipsNode.active = true
        var heroConf = Gm.config.getHero(hero.baseId)
        this.tipsNameLab.string = heroConf.name + Ls.get(5330)

        this.tipsRich.string = ""
        var str = ""
        for (let index = 0; index < skills.length; index++) {
            var skillConf = Gm.config.getSkill(skills[index])
            // var nn = new cc.Node()
            // nn.anchorX = 0
            // nn.addComponent(cc.RichText)
            // var rich = nn.getComponent(cc.RichText)
            // rich.fontSize = 26
            // rich.maxWidth = 420
            // rich.string = skillConf.detailed

            // this.tipsLabNode.addChild(nn)
            if (str != ""){
                str = str + "\n"
            }
            str = str + skillConf.detailed
        }
        this.tipsRich.string = str

        this.tipsNode.height = Math.abs(this.tipsLabNode.y) + this.tipsRich.node.height +30
    },
    onBack(){
        if (this.tipsNode.active){
            this.tipsNode.active = false
            return
        }
        this._super()
    }
});

