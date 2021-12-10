cc.Class({
    extends: require("BaseView"),

    properties: {
        HeroFlyItem:cc.Node,
        scroll:cc.ScrollView,

        m_addNodes:{
            default:[],
            type:cc.Node
        },
        
        m_oFilterNode:cc.Node,
        m_oFilterPerfab:cc.Prefab,
        m_oPercentLabel:cc.Label,
    },

    onLoad(){
        this._super()

        this.fileId = 1008
        this.m_iJobValue = 0
        this.m_iFilterValue = 0

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        var tmpFilterJs = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)
        tmpFilterJs.setCallBack(0,0,function(filter,job){
            if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                this.m_iFilterValue = filter
                this.m_iJobValue = job
                this.initHeroList()
            }
        }.bind(this))

        this.heroAddNodes = []
        for (let index = 0; index < 1; index++) {
            var itemSp1 = Gm.ui.getNewItem(this.m_addNodes[index], true)
            itemSp1.setChoice(true)
            itemSp1.setTips(false)
            this.heroAddNodes.push(itemSp1)
        }
        this.selectHeroIds = [0]

        var percent = (LotteryFunc.getTzHeroPercent() * 100).toFixed(2) + "%"
        this.m_oPercentLabel.string = cc.js.formatStr(Ls.get(7100034),percent)
    },

    register:function(){
        
    },

    enableUpdateView:function(args){
        if (args){
            this.data = args
            if(this.data.wishInfo.length > 0){
                for(var i = 0; i < this.data.wishInfo.length; i++){
                    if(this.selectHeroIds[i] == 0){
                        this.selectHeroIds[i] = this.data.wishInfo[i].baseId
                    }
                }
            }
            this.initHeroList()
        }
    },

    //子类继承
    getBasePoolItem(){
        return this.HeroFlyItem
    },

    initHeroList(){
        var data = Gm.config.getCanUseHeros()
        this.heroFlyAll = []
        for(var i=0;i<data.length;i++){
            var v = data[i]
            var tmpConfig = Gm.config.getHero(v.baseId || 0,v.qualityId)
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.camp)&&
            (this.m_iJobValue == 0 || this.m_iJobValue == tmpConfig.job)){
                this.heroFlyAll.push(v)
            }
        }

        for(var i=0;i<this.heroFlyAll.length;i++){
            this.heroFlyAll[i].qualityId = this.heroFlyAll[i].id + "105"
            this.heroFlyAll[i].baseId = this.heroFlyAll[i].id
        }

        this.removeAllPoolItem(this.scroll.content)
        var self = this
        Gm.ui.simpleScroll(this.scroll,this.heroFlyAll,function(v,index) {
            var tmpConfig = Gm.config.getHero(v.baseId || 0,v.qualityId)
            var item = self.getPoolItem()
            item.active = true
            self.scroll.content.addChild(item)

            var itemSp = item.getComponent("HeroWishItem")
            itemSp.setData(v,self)
            v.isRed = false
            itemSp.updateHero(v)

            itemSp.hideAllCheck()
            itemSp.setLabelFontSize(14)
            var percent = LotteryFunc.getTzHeroPercent()
            itemSp.setLabStr((percent * 100).toFixed(2) + "%")
            itemSp.setCheck(v.qualityId == self.selectHeroIds[0])

            return item
        })
  
        var selectHero = []
        for(var i = 0; i < this.selectHeroIds.length; i++){
            selectHero["id"] = this.selectHeroIds[i]
            selectHero["index"] = i
            selectHero["state"] = this.selectHeroIds[i] != 0 ? 1: 0
            this.updateSelectHero(selectHero) 
        }
    },

    onIconButtonClick:function(sender,index){
        // if(this.selectHeroIds[index] != 0)
        // {
        //     var selectHero = []
        //     selectHero["id"] = this.selectHeroIds[index]
        //     this.selectHeroIds[index] = 0
        //     selectHero["index"] = index
        //     selectHero["state"] = 0
        //     this.updateSelectHero(selectHero)
        // }
    },

    onItemClick(item){
        if(!Gm.lotteryData.isActivateHero(this.fileId,item.data.qualityId)){
            Gm.floating(Ls.get(5831))
            return
        }
        var herostate = -1
        var heroindex = -1
        var length = this.selectHeroIds.length
        var index = this.selectHeroIds.indexOf(item.data.qualityId)
        if(index == -1){
            if(this.selectHeroIds[0]){
                for (var i = 0; i < this.scroll.content.children.length; i++) {
                     var v = this.scroll.content.children[i].getComponent("HeroWishItem")
                     if(v.data.qualityId == this.selectHeroIds[0]){
                         v.setCheck(false)
                     }
                }
            }
            this.selectHeroIds[0] = item.data.qualityId
            herostate = 1
            heroindex = 0
             var selectHero = []
            selectHero["id"] = item.data.qualityId
            selectHero["index"] = heroindex
            selectHero["state"] = herostate
            this.updateSelectHero(selectHero)
        }
    },

    updateSelectHero(selectHero){
        var heroData = null
        var selectItem = null
        for (var i = 0; i < this.heroFlyAll.length; i++) {
            var v = this.heroFlyAll[i]
            if(v.qualityId == selectHero.id){
                heroData = v
                break
            }
        }
        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var v = this.scroll.content.children[i].getComponent("HeroWishItem")
            if(v.data.qualityId == selectHero.id){
                selectItem = v
                break
            }
        }
        
        var conf = Gm.config.getHero(0,selectHero.id)
        this.heroConf = conf
        if(selectHero.state == 1){
            if(heroData){
                this.heroAddNodes[selectHero.index].updateHero(heroData)
            }
            if(selectItem){
                selectItem.setCheck(true)
            }
            this.m_addNodes[selectHero.index].getChildByName("New Label").getComponent(cc.Label).string = conf.name
        }else{
            this.heroAddNodes[selectHero.index].setData()
            if(selectItem){
                selectItem.setCheck(false)
            }
            this.heroAddNodes[selectHero.index].setChoice(true)
            this.m_addNodes[selectHero.index].getChildByName("New Label").getComponent(cc.Label).string = ""
        }  
    },

    onBack(){
        if(this.data.callback){
            this.data.callback(this.selectHeroIds)
            if(this.selectHeroIds && this.selectHeroIds[0]){
                if(this.data.wishInfo[0] && this.data.wishInfo[0].baseId && this.data.wishInfo[0].baseId == this.selectHeroIds[0]){
                    this._super()
                    return
                }
                Gm.cardNet.sendSetHeroAndJob()
            }
        }
        this._super()
    },
});
