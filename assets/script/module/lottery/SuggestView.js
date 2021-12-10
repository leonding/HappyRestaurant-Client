var BaseView = require("BaseView")

// SuggestView
cc.Class({
    extends: BaseView,
    properties: {
        titleLabel:cc.Label,
        scrollView: cc.ScrollView,
        itemNode:cc.Node,
        heroNode:cc.Node,
        m_tTopNode:{
            default:[],
            type:cc.Node
        }
    },
    onLoad(){
        this._super()
        this.m_iSeleted = this.openData.m_iSeleted
        this.setUI()
    },
    setUI(){
        this.data = Gm.lotteryData.getSuggestData()
        this.createContentLayer()
        this.onUserInfoUpdate()
    },
    createContentLayer(){ 
        for(var i=0;i<this.data.length;i++){
             cc.log("createContentLayer",i)
             var item = cc.instantiate(this.itemNode)
             item.active = true
             var js = item.getComponent("SuggestCell")
             js.setData(this.data[i],this.m_iSeleted)
             this.scrollView.content.addChild(item)
        }
    },
     register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.BAG_UPDATE] = this.onUserInfoUpdate.bind(this)
    },
    onUserInfoUpdate(){
        var tmpData = Gm.lotteryData.getData(0)
        LotteryFunc.setTopNode(tmpData,this.m_tTopNode)
        var layerS = Gm.ui.getScript("LotteryMain")
        // if(layerS.m_iSeleted == 2){
        //      setTimeout(() => {
        //             LotteryFunc.addDrawPoint(this.m_tTopNode)
        //     }, 0.01);
        // }
    },
    onDiamondClick:function(){
        AtyFunc.openView()
    },
});

