var BaseView =require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        m_oItemNode:cc.Node,
        m_ozsLabel:cc.RichText,
        m_oDesc:cc.Label,
        m_titleLabel:cc.Label,
        m_typeIcon:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    enableUpdateView(args){
        if(args){
            this.setUI(args)
        }
    },
    setUI(args){
        this.m_data = args

        this.m_ozsLabel.string = args.string

        var item = Gm.ui.getNewItem(this.m_oItemNode)
        item.setData(args.item[0])

        this.m_ozsLabel.string = args.string
        let conf = Gm.config.getItem(args.item[0].id)
        this.m_oDesc.string = conf.description

        
    //    this.m_oDesc.string = conf.description
        
        this.m_titleLabel.string = args.name

        let buyItem = Gm.config.getItem(this.m_data.price[0].id)
        Gm.load.loadSpriteFrame("img/items/"+buyItem.icon,(spriteframe,owner)=>{
            owner.spriteFrame = spriteframe
        },this.m_typeIcon)
    },
    onBuyClick(){
        if(this.isCanBuy(this.m_data.price[0].num)){
            Gm.limitMarketNet.buyItem(2)
        }
        this.onBack()
    },
    isCanBuy(price){
        var buyId = this.m_data.price[0].id
        var hasNum = Gm.userInfo.golden
        if(buyId == ConstPb.playerAttr.GOLD){ //无偿钻石
            hasNum = Gm.userInfo.golden + Gm.userInfo.payGolden 
        }else if(buyId== ConstPb.playerAttr.PAY_GOLD){ //付费钻石
            hasNum = Gm.userInfo.payGolden 
        }else{//金币 
            hasNum = Gm.userInfo.silver
        }

        if( buyId == ConstPb.playerAttr.GOLD && Gm.userInfo.golden < price && Gm.userInfo.payGolden > price){
            return true
        }

        if( price < hasNum){
            return true
        }else{
            Gm.floating(Ls.get(600052)) 
            Gm.ui.create("HeroAccessView",{itemType:ConstPb.itemType.TOOL,baseId:buyId})    
            return false 
        }
    }

    // update (dt) {},
});
