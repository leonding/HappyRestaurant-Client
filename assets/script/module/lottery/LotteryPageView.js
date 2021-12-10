var BaseView = require("PageView")

// LotteryMainPage
cc.Class({
    extends: BaseView,

    properties: {
        m_tTopNode:{
            default: [],
            type: cc.Node,
        },
        m_oItemCell:cc.Node,
        m_oScrollView:cc.ScrollView,
        //guide
        m_oSelet1:cc.Node,
        //guide
    },
    onLoad(){
        this._super()
    },
    onEnable:function(){
        this._super()
        Gm.audio.stopDub();
        Gm.getLogic("LotteryLogic").checkNextFreeTime()
    },
    onDisable:function(){
        Gm.ui.removeByName("LotteryMain")
        Gm.ui.removeByName("LotteryAwardNew")
    },
    register:function(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.BAG_UPDATE] = this.onUserInfoUpdate.bind(this)
    },
    enableUpdateView:function(args){
        Func.destroyChildren(this.m_oScrollView.content)
        
        if(Gm.lotteryData.activeIsOpen()){
            this.addItemCell(3)
        }
        this.addItemCell(1)
        if(Gm.lotteryData.choukTZIsOpen()){
            this.addItemCell(5)
        }
         this.addItemCell(2)
        this.addLastItemCell()
        this.onUserInfoUpdate()
        Gm.red.refreshEventLotteryState()
    },
    addItemCell(index){
        var item = cc.instantiate(this.m_oItemCell)
        if(index==1){
            Gm.red.add(item,"lottery","common")//抽卡
            setTimeout(() => {
                if(this.m_oSelet1 && this.m_oSelet1.isValid && item && item.isValid){
                    var pos = item.convertToWorldSpaceAR(cc.v2(0,0))
                    pos = this.m_oScrollView.node.convertToNodeSpaceAR(pos)
                    this.m_oSelet1.y = pos.y
                }
            }, 0.02);
        }
        else if(index==2){
            Gm.red.add(item,"lottery","friend")//抽卡
        }
        this.setItemCell(item,index)
        this.m_oScrollView.content.addChild(item)
    },
    addLastItemCell(){
        var item = cc.instantiate(this.m_oItemCell)
        this.setItemCell(item)
        this.m_oScrollView.content.addChild(item)
    },
    setItemCell(item,index){
        item.active = true
        item.getComponent("LotteryPageCell").setData({index:index})
    },
    onUserInfoUpdate(){
        var tmpData = Gm.lotteryData.getData(0)
        LotteryFunc.setTopNode(tmpData,this.m_tTopNode)
        this.m_tTopNode[2].active = false
    },
    getClick:function(destName){
        if (destName == "m_oSelet1"){
            return "onGuide1"
        }
    },
    onGuide1:function(){
        // console.log("点到我了==：",this.m_tListData[0])
        Gm.ui.create("LotteryMain",{page:0})
    },
    onDiamondClick:function(){
        AtyFunc.openView()
    },
});

