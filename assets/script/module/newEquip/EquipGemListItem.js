cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        nameRich:cc.RichText,
        node1:cc.Node,
        lab1:cc.Label,
        lab2:cc.Label,
        lookSpr:cc.Node,
        tipsLab:cc.RichText,
        addBtn:cc.Node,
        infoBtn:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        this.lookSpr.active = false
        this.tipsLab.string = ""
        this.node1.active = true
        this.createItem()

        this.itemBase.updateItem(data)
        var gemCon = Gm.config.getGem(data.baseId)
        var conf = Gm.config.getItem(data.baseId)
        this.nameRich.string = conf.name
        this.lab1.string = EquipFunc.getBaseIdToName(gemCon.attrId)
        this.lab2.string = "+" + EquipFunc.getBaseIdToNum(gemCon.attrId,gemCon.value) 
        this.showInfoBtn(this.data.count >=2 && gemCon.level != 10)
        // this.descRich.string = Func.baseStr(gemCon.attrId,gemCon.value).replace("：", "\n+")
    },
    showInfoBtn(isShow){
        this.infoBtn.active = isShow
        this.infoBtn.stopAllActions()
        this.infoBtn.scale = 1
        if (isShow){
            var acList = new Array()
            var time = 0.5
            acList.push(cc.scaleTo(time,1.2))
            acList.push(cc.scaleTo(time,0.8))
            this.infoBtn.runAction(cc.repeatForever(cc.sequence(acList)))
        }
    },
    setGemData(dd,owner){
        this.gemData = dd
        this.owner = owner
        this.nameRich.string = ""
        this.lookSpr.active = false
        this.node1.active = false
        this.addBtn.active = false
        this.createItem()
        this.itemBase.setDefaultBottomFrame()
        if (dd.gemItemId == -1){
            this.lookSpr.active = true
            this.tipsLab.string = Ls.get(2329)
            this.itemBase.setHuiFrame()
            this.itemBase.setData()
        }else if (dd.gemItemId == 0){
            this.addBtn.active = true
            this.tipsLab.string = Ls.get(103)
            this.itemBase.setData()
        }else{
            // this.lab2.node.color = cc.color(255,54,0)
            this.setData({baseId:dd.gemItemId},this.owner)
        }
        this.showInfoBtn(false)
    },
    createItem(){
        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
            this.itemBase.node.scale = this.itemNode.width/this.itemBase.node.width
        }
    },
    isUnlock(){
        return this.gemData.gemItemId != -1
    },
    onBtn:function(){
        this.owner.onGemListClick(this)
    },
    onGemInfoClick(){

        Gm.ui.create("ItemInfoView",this.data)
    }
});


