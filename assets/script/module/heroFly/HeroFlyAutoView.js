var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        HeroFlyAutoItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
    },
    onLoad:function(){
        this.popupUIData = {title:5273}
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.updateList()
        }
    },
    updateList(){
        this.beginTime = new Date()
        var list = this.getList()
        cc.log('time',new Date()-this.beginTime)
        // cc.log(list)
        this.items = []
        for (let index = 0; index < list.length; index++) {
            var item = cc.instantiate(this.HeroFlyAutoItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("HeroFlyAutoItem")
            itemSp.setData(list[index],this)
            this.items.push(itemSp)
        }
    },
    getList(){
        var heroList = Gm.heroData.heroFlyAll()

        var newResultList = []
        var newHasIds = {}
        
        var resultList = []
        var hasIds = {}
        var hero_synthetise_list_quality = Gm.config.getConst("hero_synthetise_list_quality")
        for (var i = 0; i < heroList.length; i++) {
            var heroDataFly = heroList[i]

            var list = HeroFunc.getFlyList([heroDataFly],heroList,newHasIds,hero_synthetise_list_quality)
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                newResultList.push(v)
            }
        }
        return newResultList
    },
    onOkBtn(){
        var list = []
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i]
            if (item.isChecked()){
                list.push(item.data)
            }
        }
        if (list.length == 0){
            Gm.floating(5274)
            return
        }
        var newList = []
        for (var i = 0; i < list.length; i++) {
            var v = list[i]
            var ids = []
            for(const key in v.listId){
                ids.push(checkint(key))
            }
            newList.push({heroId:v.heroId,removeIds:ids})
        }

        var equipNum = 0
        for (var i = 0; i < newList.length; i++) {
            var v = newList[i]
            for (var j = 0; j < v.removeIds.length; j++) {
                var v1 = v.removeIds[j]
                var hero = Gm.heroData.getHeroById(v1)
                equipNum = equipNum + hero.equipInfos.length
            }
        }
        if (equipNum > Gm.bagData.getSurplusBagSize()){
            Gm.floating(5013)
            return
        }
        Gm.heroNet.sendHeroRiseQuality(newList)
    },
    
});

