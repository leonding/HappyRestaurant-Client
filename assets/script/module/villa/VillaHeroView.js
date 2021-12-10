var BaseView = require("PageView")

const FIRST_HEROS = 0
const FIRST_TJ = 1
const FIRST_RELATE = 2

// TeamPageView
cc.Class({
    extends: BaseView,

    properties: {
        VillaHeroItem:cc.Node,
        scroll:cc.ScrollView,

        m_oFilterPerfab:cc.Prefab,
        m_oFilterNode:cc.Node,
        
        bgNode:cc.Node,
    },
    onLoad () {
        this._super()

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oTeamFilter.hideBtn(false)
        this.m_oFilterNode.addChild(tmpFilter)

        this.m_iJobValue = -1
        this.m_iFilterValue = -1

        Gm.audio.playEffect("music/06_page_tap")
    },
    enableUpdateView:function(args){
        if (args){
            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job

                    this.updateTjList()
                }
            }.bind(this))
            this.fitBg()
        }
    },
    fitBg(){
        if (this.bgNode.children.length > 1){
            return
        }
        var height = this.bgNode.children[0].height

        var cell = Math.floor(this.bgNode.height/height)
        for (var i = 0; i < cell; i++) {
            var v = cc.instantiate(this.bgNode.children[0])
            this.bgNode.addChild(v)
        }
    },
    register:function(){
        // this.events[Events.FLYTO_HERO] = this.onNetHeroUnlock.bind(this)
        this.events[MSGCode.OP_VILLA_ACT_S] = this.onNetVillaAct.bind(this)
        this.events[MSGCode.OP_VILLA_FEEL_S] = this.onNetVillaFeel.bind(this)
    },
    onNetVillaAct(args){
        for (var i = 0; i < this.tjList.length; i++) {
            var v = this.tjList[i]
            if (v.data.id == args.baseId){
                v.playUnlockAnim()
            }
        }
    },
    onNetVillaFeel(args){
        for (var i = 0; i < this.tjList.length; i++) {
            var v = this.tjList[i]
            if (v.data.id == args.baseId){
                v.updateLv()
            }
        }
    },
    updateTjList(){
        this.removeAllPoolItem(this.scroll.content)

        var allHeros =  Gm.config.getHeroAll()
        
        this.showHeroList = []
        for (let index = 0; index < allHeros.length; index++) {
            const v = allHeros[index];
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == v.camp)
                && (this.m_iJobValue == 0 || this.m_iJobValue == v.job )){
                this.showHeroList.push(v)
            }
        }
        this.showHeroList.sort((a,b)=>{
            var vheroDataA = Gm.villaData.getVillaHeroData(a.id)
            var vheroDataB = Gm.villaData.getVillaHeroData(b.id)

            var statea = vheroDataA?vheroDataA.state:1
            var stateb = vheroDataB?vheroDataB.state:1
            if (statea == stateb){
                var qualityA = vheroDataA?vheroDataA.quality:Gm.config.getQulityHero(a.qualityProcess[0]).quality
                var qualityB = vheroDataB?vheroDataB.quality:Gm.config.getQulityHero(b.qualityProcess[0]).quality
                if (qualityA == qualityB){
                    return a.sort - b.sort
                }
                return qualityB - qualityA
            }else{
                return stateb - statea
            }
        })

        this.tjList = []
        Gm.ui.simpleScroll(this.scroll,this.showHeroList,function(itemData,tmpIdx){
            var tmpPage = this.getPoolItem()
            tmpPage.active = true
            tmpPage.parent = this.scroll.content

            var tmpSpt = tmpPage.getComponent("VillaHeroItem")
            tmpSpt.setData(itemData,this)
            this.tjList.push(tmpSpt)
            return tmpPage
        }.bind(this))
        this.scroll.scrollToTop()
    },
    getBasePoolItem(){
        return this.VillaHeroItem
    },
    onBtnClick(){
        Gm.ui.create("VillaHeroActiveView")
    },  
    onBtnClick1(){
        Gm.ui.create("FeelAddtionAllView",{m_iFilterValue:this.m_iFilterValue})
    },
    onItemClick(qualityId){
        Gm.ui.create("HeroFeelView",{list:Gm.villaData.getActiveQualityIds(this.showHeroList),qualityId:qualityId})
    },

});

