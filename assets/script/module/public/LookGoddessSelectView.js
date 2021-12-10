var BaseView = require("PageView")

const FIRST_TJ = 1

// TeamPageView
cc.Class({
    extends: BaseView,

    properties: {
        TeamPageTjItem:cc.Prefab,
        // 开场页
        m_oTjScroll:cc.ScrollView,
        m_oFilterPerfab:cc.Prefab,
        m_oFilterNode:cc.Node,
        m_oMagicSpr:cc.Node,
      
    },
    onLoad () {
        this._super()

        this.firstType = null

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)

        this.m_iJobValue = 0
        this.m_iFilterValue = 0
    },
    onEnable(){
        this.updateFirstType(100)
        this._super()
    },
    enableUpdateView:function(args){
        // Gm.heroNet.relateRed()
        this.m_iRunType = null
        this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
            if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                this.m_iFilterValue = filter
                this.m_iJobValue = job
                if (this.firstType == FIRST_TJ){
                    this.updateTjList()
                }
            }
        }.bind(this))
        this.updateFirstType(FIRST_TJ)
    },
    register:function(){


    },

    updateFirstType(type){
        if (this.firstType != type){
            if (this.firstType != null){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.firstType = type
            this.m_iFilterValue = 0
            this.m_iJobValue = 0
            this.m_oTeamFilter.reset()
            this.updateFirstView()
        }
    },
    updateFirstView(){
       if (this.firstType == FIRST_TJ){
            this.updateTjList()
        }
    },
  
    getBasePoolItem(){
        var node = cc.instantiate(Gm.ui.newItemPrefab)
        node.active = true
        return node
    },
    updateTjList(){
        this.m_oTjScroll.node.active = true
        this.m_oFilterNode.active = true

        Func.destroyChildren(this.m_oTjScroll.content)

        // var teamTypes = Gm.config.getTeamType()

        var allHeros =  Gm.config.getHeroAll()
        allHeros.sort((a,b)=>{
            return a.sort - b.sort
        })

        var hero_quality_show = Gm.config.getConst("hero_synthetise_quality_max")
        this.tjList = []
        for (let index = 0; index < allHeros.length; index++) {
            const v = allHeros[index];
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == v.camp)
                && (this.m_iJobValue == 0 || this.m_iJobValue == v.job )){
                var tmpPage = cc.instantiate(this.TeamPageTjItem)
                tmpPage.parent = this.m_oTjScroll.content
                var tmpSpt = tmpPage.getComponent("TeamPageTjItem")
                tmpSpt.setFb(this.onTjItemClick.bind(this))
                for (var j = 0; j < v.qualityProcess.length; j++) {
                    var qualityId = v.qualityProcess[j]
                    if (qualityId%(v.id*1000+100) == hero_quality_show){
                        tmpSpt.setData(qualityId,this,1)
                    }
                }
                this.tjList.push(tmpSpt)
            }
        }
    },

    onTjItemClick(qualityId,idGroup){
        var heroConf = Gm.config.getHero(0,qualityId)
        var heros = Gm.heroData.getHerosByBaseId(heroConf.idGroup)
        heros.sort((a,b)=>{
            return b.qualityId - a.qualityId
        })
        
        var unlockHeroId = Gm.heroData.queryUnlockHeroByBaseId(parseInt(qualityId/1000))
        Gm.ui.create("HeroSkinView",{qualityId:heros[0] && heros[0].qualityId || unlockHeroId,opt:1})
        Gm.ui.removeByName("LookGoddessSelectView")
    }
});

