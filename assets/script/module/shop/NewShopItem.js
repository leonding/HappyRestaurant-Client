cc.Class({
    extends: cc.Component,
    properties: {
        bgSpr:cc.Sprite,
        nameLab:cc.Label,
        itemNode:cc.Node,
        sqNode:cc.Node,//售罄
        priceIcon:cc.Sprite,
        priceLab:cc.Label,
        discountLab:cc.Label,
        limitRich:cc.RichText,
    },
    onLoad:function(){
       this.priceLab.node.on("size-changed",()=>{
            this.priceIcon.node.x = -(10+this.priceLab.node.width/2)
        })
    },
    setData:function(data,owner){//道具
        this.owner = owner
        this.data = data
        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode,true)
            this.itemBase.setTips(false)
        }
        this.sqNode.active = false

        var conf

        this.priceData = {}
        this.itemData
        var discount = 10
        if (this.owner.selectType == 0){
            this.itemData = {baseId:data.baseId,itemType:data.itemType,count:data.count}
            this.priceData = {id:data.buyType,num:this.data.buyPrice}
            discount = data.buyDiscount
            this.sqNode.active = this.isHas()
        }else if (this.owner.selectType == 1){
            this.itemData = {id:data.id,type:ConstPb.itemType.TOOL}
            this.priceData = {id:ConstPb.propsToolType.TOOL_GEM_COIN,num:data.costGemCoin}
            discount = 10
        }else{
            this.itemData = data.item[0]
            this.priceData = data.price[0]
            discount = checkint(data.discountStr)

            this.sqNode.active = this.isHas()
        }
        conf =  this.itemBase.setData(this.itemData)
        this.nameLab.string = conf.name

        this.discountLab.string = (discount*10) + "% OFF"
        this.discountLab.node.parent.active = discount != 10
        
        if(this.itemData.type == ConstPb.itemType.HERO_SKIN){
            var tmpNode = new cc.Node()
            tmpNode.anchorY = 0 
            tmpNode.anchorX = 0
            tmpNode.x = 23
            tmpNode.y = 8
            this.node.addChild(tmpNode)
            var sprite = tmpNode.addComponent(cc.Sprite)
            Gm.load.loadSpriteFrame("img/tujian/shop_pifu",function(sp,icon){
                icon.spriteFrame = sp
            },sprite)

            this.sqNode.zIndex = 1
        }

        Gm.ui.getConstIcon(this.priceData.id,(sp,icon)=>{
            icon.spriteFrame = sp
            icon.sizeMode = cc.Sprite.SizeMode.TRIMMED
        },this.priceIcon)
        this.priceLab.string = Func.transNumStr(this.priceData.num)
        if (this.priceData.id == ConstPb.playerAttr.PAY_GOLD){
            this.priceLab.string = this.priceLab.string + "("+ Ls.get(20050)+ ")"
        }


        this.priceLab.node.color = this.getColor(Gm.userInfo.getCurrencyNum(this.priceData.id)>=this.priceData.num)

        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.itemNode)
        }
        this.redNode.active = false

        var str = "arena_img_diban1"
        if (this.owner.isShopCard()){
            str = "arena_img_diban2"

            this.limitRich.node.parent.active = true
            var buyItem = Gm.shopData.getBuyShopItem(this.owner.selectType,checkint(this.data.id))

            var num = this.data.buyLimit - buyItem.count
            var colorStr = "<color=#00FF00>%s</c>"
            if (num == 0){
                colorStr = "<color=#FF0000>%s</c>"
            }
            this.limitRich.string = cc.js.formatStr(Ls.get(5304),":",cc.js.formatStr(colorStr,num))
        }
        Gm.load.loadSpriteFrame("img/shop/" + str,function(sp,icon){
            icon.spriteFrame = sp
        },this.bgSpr)
        this.showRed()
    },
    showPriceIcon(){
        
    },
    getColor(isHas){
        return isHas?cc.color(97,76,57):cc.color(227,1,47)
    },
    isHas(){
        if (this.owner.selectType == 0){
            return this.data.status == 1
        }else{
            var buyItem = Gm.shopData.getBuyShopItem(this.owner.selectType,checkint(this.data.id))
            return this.data.buyLimit==0? buyItem.count==1:buyItem.count >= this.data.buyLimit
        }
    },
    showRed(){
        if (this.isHas()){
            this.redNode.active = false
            return
        }
        if (this.itemData.type == ConstPb.itemType.EQUIP){
            this.redNode.active = (!this.isHas()) &&  Gm.shopData.getEquiRedHeros(this.itemData).length > 0
        }else{
            this.redNode.active =Gm.shopData.isEquipChipRed(this.itemData.baseId,this.itemData.count)
        }
    },
    getMax(){
        var tmpMax = 0
        if (this.owner.selectType == 0){
            tmpMax = 0
        }else{
            tmpMax = Math.floor(Gm.userInfo.getCurrencyNum(this.priceData.id)/this.priceData.num)
        }
        return tmpMax
    },
    onClickBtn:function(){
        cc.log("onEquipBtn")
        if(this.isHas()){
            return
        }

        var args = {}
        args.item = this.itemData
        args.isMore = this.owner.isShopCard()
        args.maxNum = this.getMax()
        if (args.maxNum == 0){
            args.maxNum = 1
        }
        if (args.isMore){
            var buyItem = Gm.shopData.getBuyShopItem(this.owner.selectType,checkint(this.data.id))
            args.limitNum = this.data.buyLimit - buyItem.count
            args.maxNum = Math.min(args.maxNum,args.limitNum)
        }
        args.numFunc = (destNums)=>{
            return [this.priceData.id,destNums * this.priceData.num]
        }
        args.callback = (destNums)=>{
            var sum = destNums * this.priceData.num
            if (!Gm.userInfo.checkCurrencyNum({attrId:this.priceData.id,num:sum})){
                return
            }
            if (this.itemData.itemType == ConstPb.itemType.EQUIP){
                if (Gm.bagData.isBagSize()){
                    Gm.floating(Ls.get(5013))    
                    return
                }
            }else if(this.itemData.itemType == ConstPb.itemType.HERO_CARD){
                if (Gm.heroData.isBagSize()){
                    Gm.floating(Ls.get(5793))    
                    return
                }
            }
            if (this.owner.selectType == 0){
                Gm.shopNet.buyItem(1,this.data.id,this.owner.selectType,destNums)
            }else{
                Gm.shopNet.buyItem(1,this.data.id.toString(),this.owner.selectType,destNums)
            }
            
        }
        Gm.audio.playEffect("music/02_popup_open")
        Gm.ui.create("BuyView",args)
    },
});


