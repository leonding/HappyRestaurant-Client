var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureTavernItem:cc.Node,
        itemNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:2337}
        this._super()
    },
    // register:function(){
    //     this.events[MSGCode.OP_REVIVEALL_PIC_S] = this.onReviveAll.bind(this)
    // },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    updateView(){
        Func.destroyChildren(this.itemNode)

        var eventData = Gm.pictureData.getEventDataByStageId(this.openData.stageId,this.openData.treasure)

        for (let index = 0; index < eventData.length; index++) {
            var item = cc.instantiate(this.PictureTavernItem)
            item.active = true
            this.itemNode.addChild(item)
            var itemSp = item.getComponent("PictureTavernItem")
            itemSp.setData(eventData[index],this)
        }
    },
    onItemClick(item){
        if (this.lastItem){
            this.lastItem.itemBase.getBaseClass().setHeroReady(false)
        }
        this.lastItem = item
        if (this.lastItem){
            this.lastItem.itemBase.getBaseClass().setHeroReady(true)
        }

    },
    onOkBtn(){
        if (this.lastItem){
            Gm.gamePlayNet.triggerEvent(this.openData.nowId,this.openData.stageId,[],this.lastItem.data.qualityId,this.openData.treasure)
        }
        this.onBack()

    },
});

