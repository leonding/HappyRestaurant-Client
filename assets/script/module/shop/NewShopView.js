var BaseView = require("BaseView")
var SHOP_ZHP = 0
var SHOP_AREN = 3
var SHOP_UNION = 4
var SHOP_MYSTERY = 6
var SHOP_HOME = 7
var SHOP_ORE = 8

var SHOP_PIC = 100
var SHOP_DUNGEON = 101
//废弃
var SHOP_GEM = 1
var SHOP_GODLY = 2
var SHOP_HERO = 5
cc.Class({
    extends: BaseView,

    properties: {
        titleLab:cc.Label,
        refreshNode:cc.Node,
        refreshBtn:cc.Node,
        shopItemPre:cc.Node,
        bottomListNode:cc.Node,
        pageNodes:{
            default:[],
            type:cc.Node,
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        //货币
        currency:{
            default:[],
            type:cc.Node,
        },
        atyNode:cc.Node,
        atyCurrency:{
            default:[],
            type:cc.Node,
        },
        //倒计时
        refTimeLab:cc.RichText,
        syTimeLab:cc.RichText,

        lockSp:cc.Node,
        scrollViewNode:cc.Node,
    },

    onLoad () {
        this._super()
        this.bottomListNode.active = false
        this.lockSp.parent = null
        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns[checkint(v._name.substring(3))] = v
        }
        this.selectType = -1
    },
    onEnable(){
        this._super()
        this.unlockListBtn()
        this.addTimes()
    },
    onBack:function(){
        this._super()
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    updateRefreshTime:function(){
        if (this.selectType == SHOP_GEM){
            this.refreshNode.active = false
        }else{
            this.refreshNode.active = true
            this.refreshBtn.active = true
            if (this.isShopCard() || this.selectType == SHOP_HOME){
                this.refreshBtn.active = false
            }
            if(this.selectType == SHOP_ORE){
                this.refreshBtn.active = true
            }
            var data = Gm.shopData.getData(this.selectType)
            if (data){
                this.refTimeLab.string = Ls.get(this.isShopCard()?200015:100010) +Func.timeToTSFM(Gm.shopData.getSurplusTime(this.selectType))
            }
        }
    },
    enableUpdateView:function(args){
        if (args != null){
            this.setStarSelect(this.m_iDestPage || SHOP_ZHP)
            // this.onUserInfoUpdate()
        }
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.BAG_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
    },
    onLogicSuss(){
        if (this.selectType != SHOP_GEM && Gm.shopData.getData(this.selectType) == null){
            Gm.shopNet.getInfo([this.selectType])
            return
        }
    },
    oncurrencyClick:function(sender,value){
        var tmpValue = checkint(value)
        Gm.ui.create("ItemTipsView",{data:{baseId:this.currencysId[tmpValue]},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
    },
    onUserInfoUpdate:function(){
        this.currencysId = []
        this.currencysId.push(ConstPb.playerAttr.GOLD)
        this.currencysId.push(ConstPb.playerAttr.SILVER)

        var nodes = this.currency
        if (this.selectType == SHOP_ZHP){
            this.currencysId.push(ConstPb.playerAttr.SMELT_VALUE)
            // this.currencysId.push(ConstPb.playerAttr.EQUIP_COIN)
        }else if (this.selectType == SHOP_GEM){
            this.currencysId.push(ConstPb.propsToolType.TOOL_GEM_COIN)
        }else if (this.selectType == SHOP_GODLY){
            this.currencysId.push(ConstPb.playerAttr.SMELT_VALUE)
        }else if (this.selectType == SHOP_AREN){
            this.currencysId.push(ConstPb.playerAttr.ARENA_COIN)
        }else if (this.selectType == SHOP_UNION){
            this.currencysId.push(ConstPb.playerAttr.DEVOTE)
        }else if (this.selectType == SHOP_HERO){
            this.currencysId.push(ConstPb.propsToolType.TOOL_HERO_CHANGE_COIN)
        }else if (this.selectType == SHOP_MYSTERY){
            this.currencysId.push(ConstPb.playerAttr.MYSTERY_COIN)
        }else if (this.selectType == SHOP_PIC){
            this.currencysId.push(ConstPb.playerAttr.PICTURE_COIN)
        }else if (this.selectType == SHOP_DUNGEON){
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].active = false
            }

            this.currencysId = []
            this.currencysId.push(ConstPb.playerAttr.GOLD)
            this.currencysId.push(ConstPb.playerAttr.PAY_GOLD)
            this.currencysId.push(ConstPb.playerAttr.DRAW_POINT)
            this.atyNode.active = true
            nodes = this.atyCurrency
        }else if (this.selectType == SHOP_HOME){
            this.currencysId.push(ConstPb.playerAttr.VILLA_COIN)
        }else if (this.selectType == SHOP_ORE){
            this.currencysId.push(ConstPb.playerAttr.ORE_COIN)
        }
        
        for (let index = 0; index < nodes.length; index++) {
            const v = nodes[index];
            if(this.currencysId[index]){
                v.active = true

                var lab
                var sp

                if (this.selectType == SHOP_DUNGEON){
                    lab = v.getChildByName("node").getChildByName("lab").getComponent(cc.Label)
                    sp = v.getChildByName("node").getChildByName("spr").getComponent(cc.Sprite)
                }else{
                    lab = v.getChildByName("lab").getComponent(cc.Label)
                    sp = v.getChildByName("sp").getComponent(cc.Sprite)
                    v.getChildByName("addBtn").active = this.currencysId[index] == ConstPb.playerAttr.GOLD
                }
                lab.string = Func.transNumStr(Gm.userInfo.getCurrencyNum(this.currencysId[index]))
                if (this.selectType == SHOP_DUNGEON){
                    if (ConstPb.playerAttr.GOLD == this.currencysId[index]){
                        lab.string = Func.transNumStr(Gm.userInfo.golden)
                    }else if (ConstPb.playerAttr.PAY_GOLD == this.currencysId[index]){
                        lab.string = Func.transNumStr(Gm.userInfo.payGolden)
                    }
                }
                Gm.ui.getConstIcon(this.currencysId[index],function(sp,icon){
                    icon.spriteFrame = sp
                    icon.sizeMode = cc.Sprite.SizeMode.TRIMMED
                }.bind(this),sp)
            }else{
                v.active = false
            }
        }
    },
    onAddBtn(){
        AtyFunc.openView()
    },
    select:function(type){
        if (type == SHOP_UNION){
            if (!Gm.unionData.isUnion()){
                Gm.floating(Ls.get(2006))
                return
            }
        }
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                if (this.pageNodes[key]){
                    this.pageNodes[key].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                if (isSelect){
                    this.titleLab.string = Ls.get(v.getChildByName("New Label").getComponent(cc.Label).string)
                }
            }
            this.updateView()
        }
    },
    updateView:function(){
        this.onUserInfoUpdate()
        this.syTimeLab.string = ""
        if (this.selectType == SHOP_GEM){
            this.refreshNode.active = false
        }
        this.bottomListNode.active = this.selectType < SHOP_PIC
        if (this.selectType != SHOP_GEM && Gm.shopData.getData(this.selectType) == null){
            Gm.shopNet.getInfo([this.selectType])
            return
        }
        this.updateRefreshTime()
        this.shopData = Gm.shopData.getData(this.selectType)
        this["updateNode" + (this.selectType)]()
    },
    updateNode0:function(){ //杂货铺
        this.updateList(this.shopData.shopItems)
        var num = this.shopData.hasRefreshNum - Gm.config.getVip().shopFreeRefresh
        if (num >=0){
            var cost = Gm.config.buy(num+1).shopRefreshCost
            this.syTimeLab.string = Ls.get(100011) +cost + Ls.get(100012)
        }else{
            // this.syTimeLab.string = Ls.get(100013) + Math.max(0,(Gm.config.getVip().shopFreeRefresh - this.shopData.hasRefreshNum))
            this.syTimeLab.string = ""
        }
    },
    updateNode1:function(){//宝石
        var list = Gm.config.getGemShop()
        this.updateList(list)
    },
    updateNode2:function(){//神器
        this.commonUpdateList()
    },
    updateNode3:function(){//武动商店
        this.commonUpdateList()
    },
    updateNode4:function(){//公会贡献商店
        this.commonUpdateList()
    },
    updateNode5:function(){//武将碎片商店
        this.commonUpdateList()
    },
    updateNode6:function(){//秘境商店
        this.commonUpdateList()
    },
    updateNode7:function(){//家园商店
        this.commonUpdateList()
    },
    updateNode8:function(){
        this.commonUpdateList()
    },
    updateNode100:function(){//拼图商店
        this.picEndTime = Func.newConfigTime(Gm.config.getConst("picture_puzzle_end_time_all"))
        this.commonUpdateList()
        this.scrollViewNode.active = false  
    },
    updateNode101:function(){//神迹商店
        this.commonUpdateList()
    },
    commonUpdateList(){
        // this.syTimeLab.string = Ls.get(100011) +Gm.config.getConst("module_shop_refresh_cost") + Ls.get(100012)

        var list = Gm.config.getModuleShop(this.selectType)
        if (this.selectType == 100){//拼图商店特殊处理
            var picList = []
            var pictureId = Gm.pictureData.getPictureId()
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                if (v.pictureId == pictureId){
                    picList.push(v)
                }
            }
            list = picList
        }
        list.sort(function(a,b){
            return a.index - b.index
        })
        this.updateList(list)
    },
    updateList:function(list,noToTop){
        Func.destroyChildren(this.scrollView.content)
        var itemHeight = 0
        this.bagItems = []
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.shopItemPre)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("NewShopItem")
            itemSp.setData(itemData,this)
            itemHeight = item.height
        }
        this.scrollView.content.height = (itemHeight)*Math.ceil(list.length/3)+100
        // if (noToTop == null){
        //     this.scrollView.scrollToTop()
        // }
    },
    onTopBtnClick:function(sender,value){
        value = checkint(value)
        var viewData = Gm.config.getViewByName(this.node._name,value)
        if (viewData && !Func.isUnlock(viewData.viewId,true)){
            return
        }
        this.select(value)
    },
    
    unlockListBtn(){
        var locks = []
        var viewData = Gm.config.getViewsByName(this.node._name)
        for (let index = 0; index < viewData.length; index++) {
            var v = viewData[index]
            if (v.interfaceParameter == SHOP_GEM || v.interfaceParameter == SHOP_GODLY ||  v.interfaceParameter == SHOP_HERO || v.interfaceParameter == SHOP_PIC || v.interfaceParameter == SHOP_DUNGEON){
                continue
            }
            if(v.interfaceParameter == SHOP_ORE && v.level > Gm.userInfo.level){
                 locks.push(v)
                 continue
            }
            if (v.openMapId && Gm.userInfo.maxMapId < v.openMapId){
                locks.push(v)
            }
        }
        locks.sort((a,b)=>{
            return a.openMapId - b.openMapId
        })
        cc.log(locks)
        for (let index = locks.length-1; index > 0; index--) {
            const v = locks[index];
            if (this.listBtns[v.interfaceParameter]){
                this.listBtns[v.interfaceParameter].parent = null
            }
        }

        var activeNum = 0
        for (var i = 0; i < this.listBtns.length; i++) {
            if (this.listBtns[i] && this.listBtns[i].parent && this.listBtns[i].active){
                activeNum = activeNum + 1
            }
        }

        var num = 0
        if (locks.length > 0){
            num = 1
        }
        cc.log((4 - locks.length+num)*136,4 - locks.length+num,activeNum)
        this.scrollViewNode.width = Math.min((activeNum)*136,578)
        if( this.lockSp.parent == null){
            if (locks.length){
                this.listBtns[locks[0].interfaceParameter].addChild(this.lockSp)
                this.lockSp.active = true
                this.lockSp.y = 65
            }
        }
    },
    isShopCard(){
        return this.selectType == ConstPb.ShopType.SHOP_LIMIT || this.selectType == ConstPb.ShopType.SHOP_ORE
    },
    onTjBtn:function(){
        console.log("onOneSell")
    },
    onAllBuyBtn:function(){
        console.log("onAllBuyBtn")
        if (this.selectType == SHOP_ZHP){
            var consts = {}
            for (let index = 0; index < this.shopData.shopItems.length; index++) {
                const v = this.shopData.shopItems[index];
                if (v.status == 0){
                    if (consts[v.buyType] == null){
                        consts[v.buyType] = 0 
                    }
                    consts[v.buyType] = consts[v.buyType] + v.buyPrice
                }
            }
            Gm.box({msg:Ls.get(100017),btnNum:2,title:Ls.get(100018)},function(btnType){
                if (btnType== 1){
                    Gm.shopNet.buyItem(0,"")
                }
            })
        }else{
            
        }
    },
    onRefBtn:function(){
        console.log("onRefBtn")
        var refresh_cost = 0
        if (this.selectType == SHOP_ZHP){
            var num = this.shopData.hasRefreshNum - Gm.config.getVip().shopFreeRefresh
            if (num >=0){
                refresh_cost = Gm.config.buy(num+1).shopRefreshCost
            }
        }else{
            refresh_cost = Gm.config.getConst("module_shop_refresh_cost")
        }
        if (refresh_cost != 0){
            Gm.box({msg:cc.js.formatStr(Ls.get(50129),refresh_cost)}, (btnType)=> {
                if (btnType == 1 ){
                    if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:Gm.config.getConst("refresh_equip_consume")})){
                        Gm.shopNet.refreshItem(this.selectType)
                    }
                }
            })
            return
        }
        Gm.shopNet.refreshItem(this.selectType)
    },
    onSkipClick(){
        if (this.selectType == SHOP_GODLY){
            Gm.ui.jump(10000)
            this.onBack()
        }else if (this.selectType == SHOP_AREN){
            if(Func.isUnlock(4000,true)){
                 Gm.ui.jump(4000)
                this.onBack()
            }
        }else if (this.selectType == SHOP_UNION){
            if(Func.isUnlock(40000,true)){
                 Gm.ui.jump(40000)
                this.onBack()
            }
        }
    },
    onGodlyRefBtn(){
        
    },
});

