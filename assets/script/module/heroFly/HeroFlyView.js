cc.Class({
    extends: require("BaseView"),

    properties: {
        heroInfoNode:cc.Node,
        nameLab:cc.Label,
        teamSprite:cc.Sprite,
        qualitySpr:cc.Sprite,
        starNodes:cc.Node,
        skPerson:sp.Skeleton,
        btn:cc.Button,
        m_oSkEffectFab:cc.Prefab,
        effectNode:cc.Node,

        HeroFlyItem:cc.Node,
        scroll:cc.ScrollView,
        tipLab:cc.Label,

        nowNode:cc.Node,
        needParent:cc.Node,
        autoBtn:cc.Node,
        m_oFilterNode:cc.Node,
        m_oFilterPerfab:cc.Prefab,
        touchNode:cc.Node,
    },
    onLoad(){
        this._super()
        this.nowHero = Gm.ui.getNewItem(this.nowNode,true)
        this.nowHero.setTips(false)

        var tmpFilter = cc.instantiate(this.m_oFilterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.m_oFilterNode.addChild(tmpFilter)

        this.m_iJobValue = 0
        this.m_iFilterValue = 0

        this.m_oSkEffect = cc.instantiate(this.m_oSkEffectFab)
        this.effectNode.addChild(this.m_oSkEffect)

        this.lvUpAnimation = this.m_oSkEffect.getComponent(cc.Animation)
        this.lvUpAnimation.on('finished',(name,sender)=>{
            Gm.ui.create("UnLockHero",{qualityId:this.qualityId,isFly:true,heroId:this.heroId})
            this.onItemClick()
            this.updateRed()

            this.touchNode.active = false
        })
        this.touchNode.active = false
    },
    register:function(){
        this.events[MSGCode.OP_HERO_QUALITY_S] = this.onHeroRiseQuality.bind(this)
        this.events[MSGCode.OP_HERO_LOCK_S] = this.onNetHeroLock.bind(this)
    },
    onHeroRiseQuality(args){
        var isOne = false
        for (var a = 0; a < args.infos.length; a++) {
            var newData = args.infos[a]
            for (var i = 0; i < newData.consumeHeroIds.length; i++) {
                var heroId = newData.consumeHeroIds[i]

                for (var j = this.scroll.content.children.length - 1; j >= 0; j--) {
                    var item = this.scroll.content.children[j].getComponent("HeroFlyItem")
                    if (item.data.heroId == heroId){
                        item.node.parent = null
                        this.addPoolItem(item.node)
                        break
                    }
                }
            }
            if (args.infos.length == 1){
                this.qualityId = newData.qualityId
                this.heroId = newData.heroId
                isOne = true
            }
        }

        this.scheduleOnce(()=>{
            this.heroFlyAll = Gm.heroData.heroFlyAll()
            for (var i = 0; i < this.scroll.content.children.length; i++) {
                var item = this.scroll.content.children[i].getComponent("HeroFlyItem")
                item.hideAllCheck()
            }
            
            if (isOne){
                if (this.heroInfoNode.active){
                    var tmpAni = this.m_oSkEffect.getComponent(cc.Animation)
                    tmpAni.play("level_up_plus")
                    this.touchNode.active = true
                    return
                }else{
                    Gm.ui.create("UnLockHero",{qualityId:this.qualityId,isFly:true,heroId:this.heroId})
                }
            }else{
                for (var i = 0; i < this.heroFlyAll.length; i++) {
                    var v = this.heroFlyAll[i]
                    if (!this.findItem(v.heroId)){
                        this.createNodeItem(0,v)
                    }
                }
            }
            this.onItemClick()
            this.updateRed()
        },1/30)
    },
    findItem(heroId){
        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var item = this.scroll.content.children[i].getComponent("HeroFlyItem")
            if (item.data.heroId == heroId){
                return true
            }
        }
        return false
    },
    onNetHeroLock(args){
        var item = this.getItemById(args.heroId)
        item.data.lock = args.lock
        item.setLock(HeroFunc.flyLockType(item.data)!=0)
        item.changeConsume()
    },
    enableUpdateView:function(args){
        if (args){
            this.initHeroList(true)
            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job
                    this.initHeroList()
                }
            }.bind(this))
        }
    },
    initHeroList(isInit){
       
        this.heroFlyAll = Gm.heroData.heroFlyAll()
            var isRed = false
            var hero_synthetise_list_quality = Gm.config.getConst("hero_synthetise_list_quality")
            for (let index = 0; index < this.heroFlyAll.length; index++) {
                const data = this.heroFlyAll[index];
                data.isRed = HeroFunc.getFlyList([data],this.heroFlyAll,{}).length >0
                if (data.isRed && data.quality <= hero_synthetise_list_quality){
                    isRed = true
                }
            }

            if (this.redNode == null){
                this.redNode = Gm.red.getRedNode(this.autoBtn)
            }
            this.redNode.active = isRed
            this.autoBtn.active = isRed

            this.heroFlyAll.sort((a,b)=>{
                if (a.isRed == b.isRed){
                    if (b.level == a.level){
                        if (a.quality == b.quality){
                            if (a.camp == b.camp){
                                return a.baseId - b.baseId
                            }
                            return b.camp - a.camp
                        }else{
                            return b.quality - a.quality
                        }
                    }else{
                        return b.level - a.level
                    }
                }else{
                    return a.isRed?-1:1
                }
            })

        this.removeAllPoolItem(this.scroll.content)
        var index = 0
        this.unscheduleAllCallbacks()
        for (var i = 0; i < this.heroFlyAll.length; i++) {
            var v = this.heroFlyAll[i]

            var tmpConfig = Gm.config.getHero(v.baseId || 0,v.qualityId)
            if ((this.m_iFilterValue == 0 || this.m_iFilterValue == tmpConfig.camp)&&
                (this.m_iJobValue == 0 || this.m_iJobValue == tmpConfig.job)){

                this.createNodeItem(isInit?index:0,v,isInit)
                index++
            }
        }
    },
    createNodeItem(index,itemData,isInit){
        var createNode =  ()=> {
            var item = this.getPoolItem()
            this.scroll.content.addChild(item)

            var itemSp = item.getComponent("HeroFlyItem")
            item.active = true
            itemSp.setData(itemData,this)
            itemSp.isEnter = isInit
            itemSp.updateHero(itemData)
            itemSp.hideAllCheck()
            itemSp.recoverRed()
        }
        
        if (index == 0){
            createNode()
        }else{
            this.scheduleOnce(()=>{
                createNode()
            },index/30)
        }
    },
    //子类继承
    getBasePoolItem(){
        return this.HeroFlyItem
    },
    onItemConsumeClck(item,isAdd){
        var list = this.costHeros[item.costIndex]
        if (isAdd){
            list.push(item.data.heroId)
        }else{
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                if (v == item.data.heroId){
                    list.splice(index,1)    
                }
            }
        }
        this.updateItemLock()
    },
    updateItemLock(){
        var isFull = true

        var hasList = []
        for (var i = 0; i < this.needNodes.length; i++) {
            var v = this.heroConf.qualityUpCost[i]
            if (v == null){
                continue
            }
            var selectList = this.costHeros[i]
            if (v.num != selectList.length){
                isFull = false
            }
            var itemBase = this.needNodes[i].itemBase

            // itemBase.rich.getComponent(cc.RichText).string = Func.doubleLab(selectList.length,checkint(v.num),"0AE5FF","0AE5FF")

            var isHas = selectList.length < checkint(v.num)

            hasList[i] = !isHas

            var itemData = HeroFunc.getFlyFlyConsumeData(v)
            if (itemData.noHead){
                if (!isHas){
                    itemBase.updateHero({baseId:Gm.heroData.getHeroById(selectList[0]).qualityId})
                }else{
                    itemBase = HeroFunc.createFlyConsumeItem(this.needNodes[i],v)
                }
            }

            itemBase.setChoice(isHas,isHas)
            itemBase.setGray(isHas)
        }
        this.btn.interactable  = isFull

        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var v = this.scroll.content.children[i].getComponent("HeroFlyItem")
            if (this.selectItem == null || (this.selectItem && this.selectItem.data.heroId != v.data.heroId)){
                if (v.state == 1 && v.consumeCheck.active){

                }else{
                    v.checkConsume(this.heroConf.qualityUpCost,hasList) 

                }
                v.hideRed()
            }
        }
    },
    updateRed(){
        this.scroll.scrollToTop()
        var isRed = false
        var hero_synthetise_list_quality = Gm.config.getConst("hero_synthetise_list_quality")
        for (let index = 0; index < this.heroFlyAll.length; index++) {
            const data = this.heroFlyAll[index];
            data.isRed = HeroFunc.getFlyList([data],this.heroFlyAll,{}).length >0
            var item = this.getItemById(data.heroId)
            if (item){
                item.updateHero(data)
                item.recoverRed()
            }
            if (data.isRed && data.quality <= hero_synthetise_list_quality){
                isRed = true
            }
        }

        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.autoBtn)
        }
        this.redNode.active = isRed
        this.autoBtn.active = isRed


        var layout = this.scroll.content.getComponent(cc.Layout)
        layout.enabled = false
        this.scroll.content.children.sort((aNode,bNode)=>{
            var a = aNode.data
            var b = bNode.data

            if (a.isRed == b.isRed){
                if (b.level == a.level){
                    if (a.quality == b.quality){
                        if (a.camp == b.camp){
                            return a.baseId - b.baseId
                        }
                        return b.camp - a.camp
                    }else{
                        return b.quality - a.quality
                    }
                }else{
                    return b.level - a.level
                }
            }else{
                return a.isRed?-1:1
            }
        })

        layout.enabled = true
        layout._layoutDirty = true
        layout.updateLayout()
    },
    onItemClick(item){
        if (this.selectItem == item){
            if (this.selectItem){
                this.selectItem.setCheck(false)
                this.selectItem = null
                this.updateHero()
                return
            }
        }
        if(this.selectItem){
            this.selectItem.setCheck(false)
        }
        this.selectItem = item
        if (this.selectItem){
            this.selectItem.setCheck(true)
        }
        this.updateHero()
    },
    updateHero(){
        if (this.selectItem == null){
            this.tipLab.string = Ls.get(5264)
            this.heroInfoNode.active = false
            this.btn.node.active = false
            for (var i = 0; i < this.scroll.content.children.length; i++) {
                var v = this.scroll.content.children[i].getComponent("HeroFlyItem")
                v.hideAllCheck()
            }
            return
        }
        // cc.log("刷新武将==============",this.selectItem)
        this.tipLab.string = Ls.get(5265)
        this.heroInfoNode.active = true
        this.btn.node.active = true

        var heroData = this.selectItem.data
        var conf = Gm.config.getHero(0,heroData.qualityId)
        this.heroConf = conf
        this.nowHero.setData(heroData)

        this.initNeedItem()

        this.costHeros = [[],[],[]]
        this.updateItemLock()

        var star = conf.quality - HeroFunc.HERO_STAR_NUM
        for (var i = 0; i < this.starNodes.children.length; i++) {
            this.starNodes.children[i].active = star > i
        }
        
        this.nameLab.string = conf.name

        var skinConf = Gm.config.getSkin(heroData.skin)

        this.updatePerson(skinConf.dwarf)
        this.updateQuality(conf.quality)

        var res = Gm.config.getTeamType(conf.camp)
        Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.teamSprite)

        var needIndex = -1
        var lockNeedIndex = -1
        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var item = this.scroll.content.children[i]
            var sp = item.getComponent("HeroFlyItem")
            if (sp.state == 1){
                var lockType = sp.flyLockType()
                if (lockType == 0){
                    needIndex = i
                    break
                }else if (lockType >= 2){
                    if (lockNeedIndex == -1){
                        lockNeedIndex = i
                    }
                }
            }
        }
        if (needIndex == -1){
            needIndex = lockNeedIndex
        }
        if (needIndex >=0){
            var cellHeight = this.scroll.content.height/Math.ceil(this.scroll.content.children.length/4)
            var cell = Math.floor(needIndex/4)
            var nowPos = this.scroll.getContentPosition()
            nowPos.y = cell*cellHeight
            this.scroll.scrollToOffset(nowPos,1)
        }
    },
    initNeedItem(){
        Func.destroyChildren(this.needParent)
        this.needNodes = []
        for (var i = 0; i < this.heroConf.qualityUpCost.length; i++) {
            const v = this.heroConf.qualityUpCost[i]
            var nn = new cc.Node()
            nn.width = nn.height = 100
            this.needParent.addChild(nn)
            HeroFunc.createFlyConsumeItem(nn,v)
            this.needNodes.push(nn)
        }
    },
    updatePerson(rolePic){
        if (this.skPerson.skeletonData == null || this.skPerson.skeletonData._name != rolePic){
            Gm.load.loadFight(rolePic,function(sp,owner){
                if (owner && owner.node){
                    owner.skeletonData = sp
                    owner.setAnimation(0, "idle", true)
                }
            },this.skPerson)
        }
    },
    updateQuality(quality){
        Gm.load.loadSpriteFrame("img/equipLogo/ssr_quality_"+HeroFunc.ssrQuality(quality),function(sp,icon){
            icon.spriteFrame = sp
        },this.qualitySpr)
    },

    onNowHeroClick(){
        this.onItemClick()
    },
    getItemById(heroId){
        for (var i = 0; i < this.scroll.content.children.length; i++) {
            var v = this.scroll.content.children[i].getComponent("HeroFlyItem")
            if (v.data.heroId == heroId){
                return v
            }
        }
    },
    onConsumeClick(sender){
        var value
        for (var i = 0; i < this.needNodes.length; i++) {
            if (sender.target.parent == this.needNodes[i]){
                value = i
            }
        }
        if (this.costHeros[value].length == 0){
            var str = ""
            var redColor = "<color=#FE4648>%s</c>"
            var typeName = ""

            var needData = this.heroConf.qualityUpCost[value]
            if (needData.quality > 100){//具体武将
                var heroConf = Gm.config.getHero(0,needData.quality)
                typeName = Gm.config.getHeroType(heroConf.quality).childTypeName
                str = cc.js.formatStr(Ls.get(5239),cc.js.formatStr(redColor,typeName),cc.js.formatStr(redColor,heroConf.name))
            }else{
                typeName = Gm.config.getHeroType(checkint(needData.quality)).childTypeName
                if (needData.camp != 0){
                    typeName = Gm.config.getTeamType(checkint(needData.camp)).childTypeName + "阵营" + typeName
                }
                str = cc.js.formatStr(Ls.get(5240),cc.js.formatStr(redColor,typeName))
            }
            Gm.floating(cc.js.formatStr("<color=#ffffff>%s</c>",str))
            return
        }
        for (var i = 0; i < this.costHeros[value].length; i++) {
            var heroId = this.costHeros[value][i]
            this.getItemById(heroId).setSelectConsume(false)
        }
        this.costHeros[value] = []
        this.updateItemLock()
    },

    onUpClick(){
        Gm.ui.create("HeroFlyUpInfoView",{heroConf:this.heroConf,heroData:this.selectItem.data,costHeros:this.costHeros})
    },
    onAutoClick(){
        Gm.ui.create("HeroFlyAutoView")
    },  

    onBack(){
        Gm.send(Events.OPEN_APPRAISALK)
        this._super()
    }

});
