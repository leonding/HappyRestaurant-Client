var BaseView = require("BaseView")

var ListName = ["EquipInfo","EquipStrengthen","EquipGodly","EquipGem","EquipRune","EquipUpgrade"]
cc.Class({
    extends: BaseView,

    properties: {
        equipInfoNode:cc.Node,
        noEquipNode:cc.Node,
        itemNode:cc.Node,
        nameLab:cc.Label,
        zyLab:cc.Label,
        scoreLab:cc.Label,
        leftBtn:cc.Node,
        rightBtn:cc.Node,

        scrollViewNode:cc.Node,
        bottomListNode:cc.Node,
        selectNodes:cc.Node,
        equipWearPerfab:cc.Prefab,
        lockSp:cc.Node,

        m_oHeroScroll:cc.ScrollView
    },
    onLoad () {
        this.lockSp.parent = null
        this._super()
        this.selectType = -1

        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }

        this.pageNodes = []

        var tmpPage = cc.instantiate(this.equipWearPerfab);
        tmpPage.active = false
        tmpPage.parent = this.selectNodes
        this.equipWear = tmpPage.getComponent(tmpPage._name);

        this.itemSp = Gm.ui.getNewItem(this.itemNode)
        this.itemSp.setTips(false)

        this.m_oHeroScroll.node.on("touch-up",this.onHeroChange,this)
    },
    onDestroy(){
        for(const i in ListName){
            Gm.ui.releaseFab(ListName[i])
        }
        this._super()
    },
    onHeroChange:function(sender,value){
        if (this.hero){
            var tmpPot = this.m_oHeroScroll.getContentPosition()
            if (this.node.width/6 < Math.abs(tmpPot.x)){
                var lastPart = this.part
                this.checkChangePart(tmpPot.x<0?1:-1)
                if (lastPart != this.part){
                    var xx = tmpPot.x<0?this.m_oHeroScroll.node.width*2:-this.m_oHeroScroll.node.width*2
                    var tmpPot = this.m_oHeroScroll.getContentPosition()
                    this.m_oHeroScroll.setContentPosition(cc.v2(xx,tmpPot.y))
                }
            }
        }
    },
    checkPage(num){
        this.select(this.selectType + num)
    },
    onEnable(){
        this._super()
        this.unlockListBtn()
    },
    isOther(){
        if (this.hero && Gm.heroData.getHeroById(this.hero.heroId) == null){
            return true
        }
        return false
    },
    enableUpdateView(args){
        if (args){
            this.hero = args.hero
            cc.log(args.hero)
            this.equip = args.equip
            EquipFunc.godlySort(this.equip)
            this.currData = args
            this.m_bIsOther = args.other
            this.isWear  = this.isWear || false

            if (this.isOther()){
                this.bottomListNode.active = false
            }else{
                this.updateRuneRed()
            }
            if (this.equip){
                this.topUpdateEquip()
            }else{
                if (args.part){
                    this.part = args.part
                }
                this.updateNoEquip()
                return
            }
            
            if (this.currData.isWear){
                if (this.isWear == false){
                    this.select(EquipFunc.EQUIP_BASE)
                    this.onWearClick()
                }else{
                    this.isWear = true
                    this.equipWear.updateView(this)
                }
            }else{
                this.select(this.currData.selectIndex || EquipFunc.EQUIP_BASE)
            }
            this.currData.isWear = false
            this.currData.selectIndex = 0
        }
    },
    isAddRed(){
        if (this.hero && this.equip && Gm.heroData.isBossLineByheroId(this.hero.heroId)){
            return true
        }
        return false
    },
    addRed(){
        Gm.red.remove(this.listBtns[EquipFunc.EQUIP_SHT])
        Gm.red.remove(this.listBtns[EquipFunc.EQUIP_GODLY])
        Gm.red.remove(this.listBtns[EquipFunc.EQUIP_GEM])
        Gm.red.remove(this.listBtns[EquipFunc.EQUIP_RUNE])
        Gm.red.remove(this.listBtns[EquipFunc.EQUIP_UP])
        if (this.isAddRed()){
            Gm.red.add(this.listBtns[EquipFunc.EQUIP_SHT],"heroEquipUpValue" + this.part,this.hero.heroId,EquipFunc.EQUIP_SHT)
            Gm.red.add(this.listBtns[EquipFunc.EQUIP_GODLY],"heroEquipUpValue" + this.part,this.hero.heroId,EquipFunc.EQUIP_GODLY)
            Gm.red.add(this.listBtns[EquipFunc.EQUIP_GEM],"heroEquipUpValue" + this.part,this.hero.heroId,EquipFunc.EQUIP_GEM)
            Gm.red.add(this.listBtns[EquipFunc.EQUIP_RUNE],"heroEquipUpValue" + this.part,this.hero.heroId,EquipFunc.EQUIP_RUNE)
            Gm.red.add(this.listBtns[EquipFunc.EQUIP_UP],"heroEquipUpValue" + this.part,this.hero.heroId,EquipFunc.EQUIP_UP)
        }
    },
    visibleNode(show){
        this.equipInfoNode.active = show
        this.noEquipNode.active = !show
        this.bottomListNode.active = show
        if (this.isOther()){
            this.bottomListNode.active = false
        }
    },
    updateNoEquip(){
        this.visibleNode(false)
        for (const key in this.listBtns) {
            const v = this.listBtns[key];
            v.getChildByName("selectSpr").active = false
        }

        this.onWearClick()
    },
    topUpdateEquip(){
        this.visibleNode(true)

        var isHero = this.hero?true:false
        this.leftBtn.active = isHero
        this.rightBtn.active = isHero

        this.conf = Gm.config.getEquip(this.equip.baseId)

        this.part = this.conf.part
        
        this.itemSp.updateEquip(this.equip)
        this.nameLab.string = this.conf.name
        // this.nameLab.node.color = Func.colorByquality(this.conf.quality)

        this.zyLab.string = Gm.config.getJobType(this.conf.jobLimit).childTypeName//cc.js.formatStr(Ls.get(1511),Gm.config.getJobType(this.conf.jobLimit).childTypeName)
        this.scoreLab.string = this.equip.score//cc.js.formatStr(Ls.get(1512),this.equip.score) 

        var isRune = this.equip.runeId > 0
        if (isRune){
            if (this.listBtns[EquipFunc.EQUIP_RUNE].parent== null){
                this.listBtns[EquipFunc.EQUIP_RUNE].parent = this.listBtns[0].parent
                this.listBtns[EquipFunc.EQUIP_UP].parent = this.listBtns[0].parent
            }
        }else{
            this.listBtns[EquipFunc.EQUIP_RUNE].parent = null
            this.listBtns[EquipFunc.EQUIP_UP].parent = null
        }

        // this.listBtns[EquipFunc.EQUIP_RUNE].getComponent(cc.Button).interactable = isRune
        // this.listBtns[EquipFunc.EQUIP_UP].getComponent(cc.Button).interactable = isRune

        this.addRed()
    },
    register(){
        this.events[Events.UPDATE_EQUIP] = this.onUpdateEquip.bind(this)
        this.events[MSGCode.OP_WEAR_EQUIP_S] = this.onNetWearEquip.bind(this)
        this.events[MSGCode.OP_PROPS_USE_S] = this.updateView.bind(this)
    },
    onMessageUpdate(){
        cc.log("onMessageUpdate")
        this.topUpdateEquip()
        this.updateView()
    },
    onNetWearEquip(args){
        this.currData.hero = Gm.heroData.getHeroById(args.heroId)
        this.currData.equip = this.currData.hero.getEquip(args.equipId[0])
        this.currData.isWear = true
        this.enableUpdateView(this.currData)
    },
    onUpdateEquip(args){
        if (this.equip){
            if (this.equip.equipId == args.equipId){
                this.equip = args
                this.currData.equip = args
                EquipFunc.godlySort(this.equip)
                this.onMessageUpdate()
            }
        }else if (this.nextEquip){
            if (this.nextEquip.equipId == args.equipId){
                this.currData.equip = this.nextEquip
                this.enableUpdateView(this.currData)
            }
        }
        this.updateRuneRed()
    },
    select(type){
        if (this.selectType != type){
            Gm.audio.playEffect("music/06_page_tap")
            this.selectType = type
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                if (this.pageNodes[key]){
                    this.pageNodes[key].node.active = false
                }
                v.getChildByName("selectSpr").active = isSelect
            }
            this.updateView()
            if (this.isAddRed() && this.selectType > EquipFunc.EQUIP_SHT){
                Gm.red.newHeroEquipSpecial(this.selectType,false)
            }
        }
    },
    updateRuneRed(){
        if (this.isOther()){
            return
        }
        var runeBtn = this.listBtns[EquipFunc.EQUIP_RUNE]
        if (runeBtn.redNode == null){
            runeBtn.redNode = Gm.red.getRedNode(runeBtn)
        }
        runeBtn.redNode.active = Gm.red.equipRuneRed(this.equip)
    },
    updateView(){
        if(this.isWear){
            return
        }
        this.equipWear.node.active = false
        // this.changeBtnLab.string = Ls.get(1506)
        if (this.pageNodes[this.selectType]){
            this.pageNodes[this.selectType].node.active = true
            this.pageNodes[this.selectType].updateView(this)
        }else{
            var viewName = ListName[this.selectType]
            if (viewName == null){
                Gm.floating("制作中。。。")
                return
            }
            this.isLoad = true
            Gm.ui.findLayer(viewName,(newNode)=>{
                this.selectNodes.addChild(newNode)
                newNode.active = false
                this.pageNodes[this.selectType] = newNode.getComponent(newNode.name)
                this.updateView()
                this.isLoad = false
            },true)
        }
    },
    onTopBtnClick(sender,value){
        if (this.isLoad){
            return
        }
        value = checkint(value)
        var viewData = Gm.config.getViewByName(this.node._name,value)
        if (!Func.isUnlock(viewData.viewId,true)){
            return
        }
        if (this.equip == null){
            Gm.floating(Ls.get(1513))
            return
        }
        this.isWear = false
        this.select(value)
    },
    unlockListBtn(){
        var locks = []
        var viewData = Gm.config.getViewsByName(this.node._name)
        // guide check
        var guideCheck = 0
        for (let index = 0; index < viewData.length; index++) {
            var v = viewData[index]
            if (v.openMapId && Gm.userInfo.maxMapId < v.openMapId){
                locks.push(v)
            }else{
                if (!guideCheck){
                    var group = v.interfaceParameter + 2
                    if ((v.interfaceParameter > 0 && v.interfaceParameter < 4) && Gm.guideData.checkBranch(group)){
                        guideCheck = group
                    }
                }
            }
        }
        if (guideCheck){
            Gm.send(Events.BRANCH_ENTER,{group:guideCheck})
        }
        locks.sort((a,b)=>{
            return a.interfaceParameter - b.interfaceParameter
        })
        for (let index = locks.length-1; index > 0; index--) {
            const v = locks[index];
            this.listBtns[v.interfaceParameter].parent = null
        }

        this.scrollViewNode.width = Math.min((this.listBtns.length - locks.length+1)*136,580)
        if( this.lockSp.parent == null){
            if (locks.length){
                this.listBtns[locks[0].interfaceParameter].addChild(this.lockSp)
                this.lockSp.active = true
                this.lockSp.y = 65
            }
        }
        
    },
    onLeftBtn(){
        cc.log("onLeftBtn")
        // this.part = this.part - 1
        // if (this.part == 0){
        //     this.part = 6
        // }
        // this.equip = this.hero.getEquipByPart(this.part)
        // this.updatePart()
        this.checkChangePart(-1)
    },
    onRightBtn(){
        cc.log("onRightBtn")
        this.checkChangePart(1)
    },
    checkChangePart(num){
        this.part = this.part + num
        if (this.part == 7){
            this.part = 1
        }
        if (this.part == 0){
            this.part = 6
        }
        this.equip = this.hero.getEquipByPart(this.part)
        if(this.equip == null){
            if (this.isOther()){
                this.checkChangePart(num)
                return
            }

            var items = Gm.bagData.getEquipsByPart(this.part,Gm.config.getHero(this.hero.baseId).job)
            items.sort(function(a,b){
                return b.score - a.score
            })
            if (items.length == 0){
                this.checkChangePart(num)
                return
            }
        }
        this.updatePart()
    },
    updatePart(){
        this.currData.equip = null
        this.currData.part = this.part
        if (this.isWear){
            this.isWear = false
        }
        if (this.hero){
            this.currData.equip = this.hero.getEquipByPart(this.part)
        }

        var selectIndex = this.selectType
        if ( selectIndex >= EquipFunc.EQUIP_RUNE){
            if(this.currData.equip){
                if (!(this.currData.equip.runeId)){
                    selectIndex = 0
                }
            }else{
                selectIndex = 0
            }
        }
        this.currData.isWear = this.equipWear.node.active
        this.currData.selectIndex = selectIndex

        this.selectType = -1
        this.enableUpdateView(this.currData)
    },
    onWearClick(){
        console.log("onWearClick",this.isWear)
        this.isWear = !this.isWear
        if (this.isWear){

            var items = Gm.bagData.getEquipsByPart(this.part,Gm.config.getHero(this.hero.baseId).job)
            if (items.length == 0){
                this.isWear = false
                Gm.floating(Ls.get(5299))
                return
            }
            
            // this.changeBtnLab.string = Ls.get(1507)
            for (let index = 0; index < this.pageNodes.length; index++) {
                const v = this.pageNodes[index];
                if (v){
                    v.node.active = false
                }
            }
            this.equipWear.node.active = true
            this.equipWear.updateView(this)
        }else{
            if (this.selectType == -1){
                this.select(EquipFunc.EQUIP_BASE)
            }else{
                this.updateView()    
            }
        }
    },
    onUnwearClick(){
        console.log("onUnwearBtn")
        Gm.equipNet.unWear(this.hero,[this.equip.equipId])
        this.onBack()
    },
    onSmeltClick(){
        if (this.equip.runeId > 0){
            Gm.ui.create("EquipResolveView",this.equip)
        }else{
            Gm.equipNet.smelt([this.equip.equipId],[])
        }
    },
    getGuide:function(destName){
        if (destName == "listBtns1"){
            return this.listBtns[1]
        }else if(destName == "listBtns2"){
            return this.listBtns[2]
        }else if(destName == "listBtns3"){
            return this.listBtns[3]
        }
    },
    getClick:function(destName){
        if (destName == "listBtns1"){
            return "onGuide1"
        }else if(destName == "listBtns2"){
            return "onGuide2"
        }else if(destName == "listBtns3"){
            return "onGuide3"
        }
    },
    onGuide1:function(){
        this.onTopBtnClick(this.listBtns[1],1)
    },
    onGuide2:function(){
        this.onTopBtnClick(this.listBtns[2],2)
    },
    onGuide3:function(){
        this.onTopBtnClick(this.listBtns[3],3)
    },
});

