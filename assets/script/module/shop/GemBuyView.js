var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        itemPre:cc.Prefab,
        itemNode:cc.Node,
        nameLab:cc.Label,
        lvLab:cc.Label,
        attrNameLab:cc.Label,
        attrValueLab:cc.Label,
        toggles:cc.ToggleContainer,
        numLab:cc.Label,
        consumeUI1:require("ConsumeUI"),
        consumeUI2:require("ConsumeUI")
    },
    onLoad:function(){
        this._super()
        this.itemBase = Gm.ui.getNewItem(this.itemNode)
        this.setCurrToggle(1)
    },
    enableUpdateView:function(args){
        if (args){
            Gm.audio.playEffect("music/02_popup_open")
            this.currData = args
            this.baseId = args.baseId
            this.currNum = 1
            this.maxNum = 100
            this.updateNode()
        }
    },
    updateNode:function(){
        if (this.baseId==null){
            return
        }
        var bId = this.baseId+this.currIndex-1
        this.baseConfig = this.itemBase.updateItem({baseId:bId})
        this.nameLab.string = this.baseConfig.name

        var gemCon = Gm.config.getGem(bId)
        this.lvLab.string = Ls.lv()+ gemCon.level
        this.attrNameLab.string = EquipFunc.getBaseIdToName(gemCon.attrId)
        this.attrValueLab.string = EquipFunc.getBaseIdToNum(gemCon.attrId,gemCon.value) 
        this.updateNum()
    },
    updateNum:function(){
        this.numLab.string = this.currNum
        this.updateNeed()
    },
    onToggle:function(sender){
        this.setCurrToggle(checkint(sender.node.name.substring(6)))
    },
    setCurrToggle:function(index){
        this.currIndex = index
        this.gemBuyConf = Gm.config.getGemBuy(this.currIndex)
        this.updateNode()
        // this.updateNeed()
    },
    updateNeed:function(){
        var gemCoin = this.gemBuyConf.costGemCoin*(this.currNum || 0)
        var costSilver = this.gemBuyConf.costSilver*(this.currNum || 0)
        this.consumeUI1.setData({id:ConstPb.playerAttr.SILVER ,need:costSilver})
        this.consumeUI2.setData({id:ConstPb.propsToolType.TOOL_GEM_COIN ,need:gemCoin})
    },
    onLeftBtn:function(){
        cc.log("onLeftBtn")
        this.currNum = Math.max(0,this.currNum - 10)
        this.updateNum()
    },
    onJian:function(){
        cc.log("onJian")
        this.currNum = Math.max(0,this.currNum - 1)
        this.updateNum()
    },
    onRightBtn:function(){
        cc.log("onRightBtn")
        this.currNum = Math.min(this.maxNum,this.currNum + 10)
        this.updateNum()
    },
    onAdd:function(){
        cc.log("onAdd")
        this.currNum = Math.min(this.maxNum,this.currNum + 1)
        this.updateNum()
    },
    onOk:function(){
        cc.log("onOk")
        if (this.currNum>0){
            var gemCoin = this.gemBuyConf.costGemCoin*this.currNum
            var costSilver = this.gemBuyConf.costSilver*this.currNum
            if (Gm.userInfo.silver < costSilver){
                Gm.floating(Ls.get(100001))
                return
            }
            if (Gm.bagData.getNum(ConstPb.propsToolType.TOOL_GEM_COIN) < gemCoin){
                Gm.floating(Ls.get(100002))
                return
            }

            Gm.shopNet.buyGem(this.baseId+this.currIndex-1,this.currNum)
        }
    },
    
});


