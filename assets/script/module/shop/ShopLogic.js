var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[Events.SOCKET_CLOSE]    = this.onSocketClose.bind(this)
        this.events[MSGCode.OP_SHOP_INFO_S] = this.onNetShopInfo.bind(this)
        this.events[MSGCode.OP_SHOP_BUY_ITEM_S] = this.onNetShopBuyItem.bind(this)
        this.events[MSGCode.OP_SHOP_REFRESH_ITEM_S] = this.onNetShopRefresh.bind(this)
        this.events[MSGCode.OP_SHOP_BUY_GEM_S] = this.onNetShopBuyGem.bind(this)
    },
    onLogicSuss:function(){
        Gm.shopData.clearData()
    },
    onSocketClose:function(args){
        this.clearTime()
    },
    addTimes:function(){
        this.clearTime()
        this.interval = setInterval(function(){
            var allList = Gm.shopData.dataList
            var getList = []
            for (const key in allList) {
                if (allList.hasOwnProperty(key)) {
                    const v = allList[key];
                    if (Gm.shopData.getSurplusTime(v.shopType) == 0){
                        if (v.shopType != ConstPb.ShopType.SHOP_LIMIT){
                            getList.push(v.shopType)
                        }
                    }
                }
            }
            if (getList.length > 0){
                Gm.shopNet.getInfo(getList)
            }
        }.bind(this),1000)
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    onNetShopInfo:function(args){
        for (let index = 0; index < args.shopItemMsg.length; index++) {
            const v = args.shopItemMsg[index];
            Gm.shopData.setData(v)    
        }
        if (this.isView()){
            this.view.updateView()
        }
        this.addTimes()
    },
    onNetShopBuyItem:function(args){
        if(Gm.shopNet.shopType == ConstPb.ShopType.SHOP_COMMON ){
            var shopTypeData = Gm.shopData.getData(Gm.shopNet.shopType)
            if (args.buyItems && args.buyItems.length > 0 ){
                for (let index = 0; index < args.buyItems.length; index++) {
                    const v = args.buyItems[index];
                    var data = Func.forBy(shopTypeData.shopItems,"id",v.id)
                    data.status = 1
                }
            }
            
            var ref = true
            if (args.shopItems && args.shopItems.length > 0 ){
                shopTypeData.shopItems = args.shopItems
                ref = null
            }
        }else{
            Gm.shopData.addBuyId(Gm.shopNet.shopType,Gm.shopNet.buyId,Gm.shopNet.count)
            if (this.isView()){
                this.view.commonUpdateList()
            }
        }
        if (this.isView()){
            this.view.updateView()
        }
    },
    onNetShopRefresh:function(args){
        var data = Gm.shopData.getData(Gm.shopNet.shopType)
        if(Gm.shopNet.shopType == ConstPb.ShopType.SHOP_COMMON ){
            data.shopItems = args.shopItems
            data.hasRefreshNum = data.hasRefreshNum + 1
        }else{
            data.buyShopItem = []
        }
        if (this.isView()){
            this.view.updateView()
        }
    },
    onNetShopBuyGem:function(args){
        Gm.floating(Ls.get(100005))
        if (this.isView()){
            this.view.updateView()
        }
    },
   
});
