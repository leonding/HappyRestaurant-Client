var BaseView = require("BaseView")
// BossTrialTeamHelpView
cc.Class({
    extends: BaseView,
    properties: {
        infoLab:cc.Label,
        lab1:cc.Label,
        lab2:cc.Label,
        heroNode:cc.Node,
        defenseHeroListNode:cc.Node,
        tjHeroListNode1:cc.Node,
        tjHeroListNode2:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:7900007}
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateView()
        }
    },
    updateView:function(data){
        var conf = this.openData

        this.infoLab.string = conf.recommend
        this.lab1.string = conf.title
        this.lab2.string = conf.attribute

        // this.scrollView.content.removeAllChildren()
        // Func.destroyChildren(this.scrollView.content)

        var defenseList = []
        for (var i = 0; i < conf.Defense.length; i++) {
            var v = conf.Defense[i]
            defenseList.push(Gm.config.getZhenFaBossRecommendById(v.id))
        }

        var tjList = []
        for (var i = 0; i < conf.tuijian.length; i++) {
            var v = conf.tuijian[i]
            var list = []
            for (var j = 0; j < v.length; j++) {
                var v1 = v[j]
                for (var key in v1){
                    list.push(Gm.config.getZhenFaBossRecommendById(v1[key]))
                }
            }
            tjList.push(list)
        }

        this.createHeroList(this.defenseHeroListNode,defenseList,0.67)
        this.createHeroList(this.tjHeroListNode1,defenseList,0.64)
        this.createHeroList(this.tjHeroListNode2,defenseList,0.64)
    },
    createHeroList(itemNode,heroLst,scale){
        if (heroLst == null){
            itemNode.parent.active = false
            return
        }
        for (var i = 0; i < heroLst.length; i++) {
            var v = heroLst[i]
            
            var tmpHeroNode = cc.instantiate(this.heroNode)
            tmpHeroNode.active = true
            itemNode.addChild(tmpHeroNode)
            tmpHeroNode.y = 0

            var str = v.clazz==1?"chouk_img_h":v.clazz==2?"chouk_img_z":"chouk_img_l"
            Gm.load.loadSpriteFrame("img/chouka/" +str,function(sp,icon){
                icon.spriteFrame = sp
            },tmpHeroNode.getComponent(cc.Sprite))

            for (var j = 0; j < v.wid.length; j++) {
                var qualityId = v.wid[j].id

                var item =  Gm.ui.getNewItem(tmpHeroNode,true,148*scale)
                item.node.y = 0
                item.setMaxHeight()
                item.updateHero({baseId:qualityId})
                // item.setFb(this.onItemClick.bind(this))
            }
        }
    },
    onItemClick(itemData){
        cc.log(itemData)
    },
    onNoClick:function(){
        this.onBack()
    },
});

