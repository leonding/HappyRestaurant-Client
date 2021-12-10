var BaseView = require("SecondView")
var TYPE_TJ = 1
var TYPE_JB = 2
cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab: cc.Prefab,
        tjHeroItem:cc.Prefab,
        tjItem:cc.Node,
        jbItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        scrollView1: {
        	default: null,
        	type: cc.ScrollView
        },
        equipScrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        topListBtns:{
            default:[],
            type:cc.Button,
        },
        selectNodes:{
            default:[],
            type:cc.Node,
        },
        selectType:0,
        currNode:cc.Node,
        currLab:cc.Label,
        jbCurrLab:cc.Label,
        jbBtn1:cc.Node,
        jbBtn2:cc.Node,
        jbBtn3:cc.Node,
        unlockSpf:cc.SpriteFrame
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.onUserInfoUpdate()
            this.select(this.m_iDestPage || TYPE_TJ)
        }
    },
    register:function(){
        this.events[MSGCode.OP_UNLOCK_S] = this.onNetHeroUnlock.bind(this)
    },
    onNetHeroUnlock:function(){
        Func.destroyChildren(this.scrollView.content)
        this.updateNode1()
    },
    onUserInfoUpdate:function(){
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            for (const key in this.topListBtns) {
                const v = this.topListBtns[key];
                var readKey = checkint(key)+1
                var isSelect = readKey == type
                this.selectNodes[key].active = isSelect
                v.node.getChildByName("defSpr").active = !isSelect
                v.node.getChildByName("selectSpr").active = isSelect
            }
            this["updateNode" + this.selectType]()
        }
    },
    updateNode1:function(){
        this.currNode.active = false
        this.jbBtnActive(false)
        Func.destroyChildren(this.scrollView.content)
        var sum = 0
        var yy = -10
        var sjNum = 0 
        for (let index = 5; index >0; index--) {
            var list = Gm.config.getHerosByQuality(index)
            // console.log("list==:",index,list)
            if (list.length > 0 ){
                var tjNode = cc.instantiate(this.tjItem)
                tjNode.active = true
                tjNode.y = yy
                // yy = yy -220
                this.scrollView.content.addChild(tjNode)
                var listNode = tjNode.getChildByName("listNode")
                
                var qIcon = tjNode.getChildByName("qIcon").getComponent(cc.Sprite)
                Gm.load.loadSpriteFrame("texture/ssr/ssr_hero_"+index,function(sp,icon){
                    icon.spriteFrame = sp
                },qIcon)
                var heroNum = 0 
                var sumNum = 0 
                for (let i = 0; i < list.length; i++) {
                    const v1 = list[i];
                    if (v1.use != 3){
                        sumNum = sumNum + 1
                        var hero = this.getHero(v1.idGroup)
                        listNode.addChild(hero)
                        if (Gm.heroData.getHeroByBaseId(v1.id)){
                            heroNum = heroNum + 1
                        }
                    }
                }
                sum = sum+ sumNum
                var lab = tjNode.getChildByName("numLab").getComponent(cc.Label)
                lab.string = heroNum + "/" + sumNum
                sjNum = sjNum + heroNum
                tjNode.height = tjNode.height + Math.ceil(sumNum/6-1)*140
                yy = yy - tjNode.height - 10
            }
        }
        this.scrollView.content.height = -yy
        this.currLab.string = Ls.get(400006) + sjNum + "/" + sum
    },
    getHero:function(baseId,isEquip){
        var heroNode = cc.instantiate(this.tjHeroItem)
        var itemSp = heroNode.getComponent("TjHeroItem")
        if (isEquip){
            itemSp.setEquipData(baseId,this,this.itemPerfab)
        }else{
            itemSp.setData(baseId,this,this.itemPerfab,this.onItemClick.bind(this))
        }
        return heroNode
    },
    updateNode2:function(){
        this.currNode.active = false
        this.jbBtnActive(true)
        if (this.scrollView1.content.children.length > 0){
            return
        }
        this.updateJb(0)
        this.jbCurrLab.string = Ls.get(400007) + this.sjNum + "/" + this.jbSjNum
    },
    updateNode3:function(){
        this.currNode.active = false
        this.jbBtnActive(false)

        if (this.equipScrollView.content.children.length > 0){
            return
        }
        Func.destroyChildren(this.equipScrollView.content)

        var sum = 0
        var yy = -10
        for (let index = 4; index >0; index--) {
            var list = Gm.config.getEquipByEquipClass(index)
            if (list.length > 0 ){
                var tjNode = cc.instantiate(this.tjItem)
                tjNode.active = true
                tjNode.y = yy
                this.equipScrollView.content.addChild(tjNode)
                var listNode = tjNode.getChildByName("listNode")
                var listLayout = listNode.getComponent(cc.Layout)
                cc.log(listLayout)
                listLayout.spacingX = 21
                var qIcon = tjNode.getChildByName("qIcon").getComponent(cc.Sprite)
                Gm.load.loadSpriteFrame("texture/ssr/ssr_equip_"+index,function(sp,icon){
                    icon.spriteFrame = sp
                },qIcon)
                var sumNum = 0 
                for (let i = 0; i < list.length; i++) {
                    const v1 = list[i];
                    sumNum = sumNum + 1
                    var hero = this.getHero(v1.id,true)
                    listNode.addChild(hero)
                }
                sum = sum+ sumNum
                var lab = tjNode.getChildByName("numLab").getComponent(cc.Label)
                lab.string = ""
                tjNode.height = tjNode.height + Math.ceil(sumNum/5-1)*140
                yy = yy - tjNode.height - 10
            }
        }
        this.equipScrollView.content.height = -yy
    },
    updateJb:function(childType){
        var list
        if (childType == 0 ){
            list = Gm.config.getJbs()
        }else{
            list = Gm.config.getJbByType(childType)
        }
        Func.destroyChildren(this.scrollView1.content)
        this.jbNodes = []
        var yy = -10
        var sjNum = 0 
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var jbNode = cc.instantiate(this.jbItem)
            
            jbNode.active = true
            jbNode.y = yy
            yy = yy -245
            this.scrollView1.content.addChild(jbNode)
            var listNode = jbNode.getChildByName("listNode")
            var heroNum = 0 
            for (let i = 0; i < v.sparkCondition.length; i++) {
                const v1 = v.sparkCondition[i];
                var hero = this.getHero(v1)
                listNode.addChild(hero)
                if (Gm.heroData.getHeroByBaseId(v1)){
                    heroNum = heroNum + 1
                }
            }
            var sortData = {id:v.id,num:heroNum,sum:v.sparkCondition.length}
            this.jbNodes.push({node:jbNode,sortData:sortData})

            var nameLab = jbNode.getChildByName("nameLab").getComponent(cc.Label)
            var addLab = jbNode.getChildByName("addLab").getComponent(cc.Label)
            nameLab.string = v.relateName + cc.js.formatStr("(%s/%s)",heroNum,v.sparkCondition.length)

            var str = ""
            for (let i = 0; i < v.relateProperty.length; i++) {
                const v1 = v.relateProperty[i];
                if (str != ""){
                    str = str + "  "
                }
                var baseAttrConf = Gm.config.getBaseAttr(v1.id)
                str = str + baseAttrConf.childTypeName + "+"
                if (baseAttrConf.percentage == 1){
                    str = str + (v1.vaule/100) + "%"
                }else{
                    str = str + v1.vaule
                }
            }
            addLab.string = Ls.get(400008) + str
            if (heroNum == v.sparkCondition.length){
                sjNum = sjNum+ 1
                var lockSp = jbNode.getChildByName("lockSp").getComponent(cc.Sprite)
                lockSp.spriteFrame = this.unlockSpf
            }
        }
        this.scrollView1.content.height = -yy
        if (childType == 0){
            this.sjNum = sjNum
            this.jbSjNum = list.length
        }
        this.updateJbSort(0)
    },
    updateJbSort:function(sortType){
        if (sortType == 0 ){
            this.jbNodes.sort(function(a,b){
                return a.sortData.id - b.sortData.id
            })
        }else if (sortType == 1 ){
            this.jbNodes.sort(function(a,b){
                if (a.sortData.num == b.sortData.num){
                    return a.sortData.id - b.sortData.id
                }else{
                    return b.sortData.num - a.sortData.num
                }
            })
        }else if (sortType == 2 ){
            this.jbNodes.sort(function(a,b){
                if (a.sortData.sum == b.sortData.sum){
                    return a.sortData.id - b.sortData.id
                }else{
                    return b.sortData.sum - a.sortData.sum
                }
            })
        }
        var yy = -10
        for (let index = 0; index < this.jbNodes.length; index++) {
            const v = this.jbNodes[index];
            v.node.y = yy
            yy = yy -245
        }
    },  
    jbBtnActive:function(show){
        this.jbBtn1.active = show
        this.jbBtn2.active = show
        this.jbBtn3.active = show
        this.jbCurrLab.node.active = show
        this.currLab.node.active = !show
        this.scrollView.node.active = !show
        this.scrollView1.node.active = show
    },
    onTopListBtn:function(sender,value){
        value = checkint(value)
        this.select(value)
    },
    onBtn1:function(){
        Gm.ui.create("JbChoiceView",true)
    },
    onBtn2:function(){
        Gm.ui.create("JbSortView",true)
    },
    onBtn3:function(){
        Gm.ui.create("JbAwardView",true)
    },
    onItemClick:function(data){
        Gm.ui.create("TjHeroView",data.baseId)
    },
    onRuleBtn:function(){
        console.log("onRuleBtn")
    },
});

