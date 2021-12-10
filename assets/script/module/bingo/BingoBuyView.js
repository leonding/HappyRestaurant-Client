var BaseView = require("BaseView")
const max_num = 100
cc.Class({
    extends: BaseView,
    properties: {
        numLab:cc.Label,
        needNumLab:cc.Label,
        itemNode:cc.Node,
        m_buyCount:cc.RichText,
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.m_cb = args.callback
            this.currNum = 0
            this.m_currBuyCount = Gm.bingoData.getBuyBingoCount() 
            this.item = Func.itemConfig({itemType:ConstPb.itemType.PLAYER_ATTR,id:1001})
            this.m_limitbuyBingo = Gm.config.getConst("buy_bingo_item_limit") 
            this.maxNum =  this.m_limitbuyBingo - this.m_currBuyCount
            this.setUI()
        }
    },
    setUI(){
        var item = Gm.ui.getNewItem(this.itemNode,true)
        item.setData({type:30000,id:ConstPb.propsToolType.TOOL_BINGO_TICKET,num:0})
        this.m_buyCount.string =cc.js.formatStr("<color=#ffffff>%s：</c><color=#0ff00>%s</color>",Ls.get(5304),this.maxNum)
        if(this.maxNum >=1){
            this.updateNum(1)
        }
        else{
            this.updateNum(0)
        }
    },
    updateNum:function(destValue){
        var buyCount = this.m_currBuyCount + destValue
        if( 0 <  buyCount && buyCount <= this.m_limitbuyBingo ){
            this.numLab.string = destValue
            this.m_buyCount.string =cc.js.formatStr("<color=#ffffff>%s：</c><color=#0ff00>%s</color>",Ls.get(5304),this.maxNum - destValue)
            let price = 0
            for(let i =this.m_currBuyCount; i < buyCount; ++i ){
                let config = Gm.config.buy(i+1)
                price += config.buyBingoItem
            }
         
            this.needNumLab.string =  price
        }
    },
    getPrice(startCount,beginCount){
        let price = 0
        for(let i =startCount; i < beginCount; ++i ){
            let config = Gm.config.buy(i+1)
            price += config.buyBingoItem
        }
        return price
    },
    onAdd:function(){
        this.currNum = this.checkNum(1)
        this.updateNum(this.currNum)
    },
    onRight:function(){
        this.currNum = this.checkNum(this.maxNum)
        this.updateNum(this.maxNum)
    },
    onJian:function(){
        this.currNum = this.checkNum(-1)
        this.updateNum(this.currNum )
    },

    checkNum(value){
        if(this.isCanBuy(this.getPrice(this.m_currBuyCount, this.m_currBuyCount + (this.currNum+value)))){
            this.currNum += value
            this.currNum = this.currNum > this.maxNum ? this.maxNum : this.currNum
            this.currNum = this.currNum < 1 ? 1: this.currNum
        }
     
        return this.currNum
    },


    onLeft:function(){
        this.currNum = this.checkNum(-this.maxNum)
        this.updateNum(this.currNum)
    },
    onOkBtn(){
        if (this.isCanBuy(parseInt( this.needNumLab.string ))){
            if(this.m_cb){
                this.m_cb( parseInt( this.numLab.string ))
            }
        }else{
            Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.TOOL,baseId:ConstPb.playerAttr.PAY_GOLD})    
        }
        this.onBack()
    },
    isCanBuy(price){
        var hasNumGolden = Gm.userInfo.golden || 0
        var payhasNumGolden = Gm.userInfo.payGolden || 0
        if( price < (hasNumGolden+payhasNumGolden)){
            return true
        }else{
            Gm.floating(Ls.get(600052)) 
            return false 
        }
    }
});

