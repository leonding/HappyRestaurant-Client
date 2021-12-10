var BaseView = require("BaseView")
var HeroInfo = require("HeroInfo")
// SuggestCell
cc.Class({
    extends: BaseView,
    properties: {
        heroNode:cc.Node,
        heroListNode:cc.Node,
        heroListPrefab:cc.Node,
        titleName:cc.Label,
        infoNode:cc.Node,
        infoLabels:{
            default:[],
            type:cc.Label
        },
        btnSprite1:cc.Node,
        btnSprite2:cc.Node,
        colorSpriteSprime:{
            default:[],
            type:cc.SpriteFrame
        }
    },
    setData(data,m_iSeleted){
        this.data = this.dealData(data)
        this.filedId =LotteryFunc.pageIndexToFiledId(m_iSeleted)
        this.setUI()
    },
    dealData(data){
        var tdata = []
        for(var i=0;i<data.length;i++){
            if(!tdata[data[i].idGroup-1]){
                tdata[data[i].idGroup-1] = []
            }
             tdata[data[i].idGroup-1].push(data[i])
        }
        return tdata
    },
    setUI(){
        this.createheroListPrefab()
        this.setInfoLabels()
        this.isSetContentBgSprite = false
        this.infoNode.active = false
    },
    createheroListPrefab(){
         Func.destroyChildren(this.heroListNode)
         for(var i=0;i<this.data.length;i++){
             var node = cc.instantiate(this.heroListPrefab)
             node.x = 0
             node.y = 0
             node.active = true
             this.heroListNode.addChild(node)
             var tdata = this.data[i]
             this.createHeroList(node,tdata)
             this.setItemBgColor(node,this.data[i][0].idGroup)
         }
    },
    createHeroList(prentNode,data){
        for(var i=0;i<data.length;i++){
                var node = cc.instantiate(this.heroNode)
                node.x = 0
                node.y = 0
                node.active = true
                var item =  Gm.ui.getNewItem(node.getChildByName("node"),true)

                var config = Gm.config.getHero(0,data[i].wid)
                config.qualityId =data[i].wid
                
                item.updateHero(config)
                item.setFb(this.onItemClick.bind(this))
                this.setItemGet(node,data[i])
                prentNode.addChild(node)
            }
    },
    setItemGet(item,tdata){
        item.getChildByName("getSprite").active = false
        item.getChildByName("nAcSprite").active = !Gm.lotteryData.isActivateHero1(this.filedId,tdata.wid)
    },
    setInfoLabels(){
        this.titleName.string = this.data[0][0].info
        this.infoLabels[0].string = this.data[0][0].title
        this.infoLabels[1].string = this.data[0][0].attribute
    },
    setItemBgColor(item,type){
        item.getComponent(cc.Sprite).spriteFrame= this.colorSpriteSprime[type-1]
    },
    onInfoBtnClick(){
        this.infoNode.active = !this.infoNode.active
        this.btnSprite1.active = !this.infoNode.active
        this.btnSprite2.active = this.infoNode.active
        if(this.infoNode.active && !this.isSetContentBgSprite){
            this.isSetContentBgSprite = true
            this.setContentBgSprite()
        }
    },
    onItemClick(data,itemType,item){
 
            var lvConf = Gm.config.getHero(0,data.qualityId)

            var dd = {}
            dd.heroId = data.heroId
            dd.level = 1
            dd.qualityId =data.qualityId
            dd.baseId = Gm.config.getQulityHero(data.qualityId).idGroup
            dd.attribute = []
            var attrList = ['hp','dodge','armor','hit','dmg','speed']
            for(var i=0;i<attrList.length;i++){
                var keyConf = Gm.config.attrKeyToId(attrList[i])
                var tmp = {}
                tmp.attrId = keyConf.childType
                tmp.attrValue = lvConf[attrList[i]]
                dd.attribute.push(tmp)
            }

            var hero = new HeroInfo()
            hero.setData(dd)

            data.item = {}
            data.item.heroInfo = hero

            Gm.ui.create("HeroTjView",data,function(view){
                var heroView = view.getComponent("HeroTjView")
                heroView.setPathBtnVisible(false)
            })
    },
    setContentBgSprite(){
        var contentNode = this.node.getChildByName("contentNode")
        var contentBgSprite = contentNode.getChildByName("bgNode").getChildByName("contentBgSprite")
        setTimeout(() => {
            if(this.node && this.node.isValid){
                contentBgSprite.height = contentNode.height
            }
        }, 100);
    },
     
});

