var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureHeroHeadItem:cc.Prefab,
        descLab:cc.Label,
        enemyNode:cc.Node,
        awardNode:cc.Node,
        awardLab:cc.Label,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView(args){
        if(args){
            this.updateView()
        }
    },
    updateView(){
        var data = Gm.pictureData.getFloorInfoByStageId(this.openData.stageId,this.openData.treasure)
        var eventConf = Gm.config.getPictureEvent(data.eventId)
        this.popupUI.setData({title:eventConf.name})

        Func.destroyChildren(this.awardNode)
        Func.destroyChildren(this.enemyNode)
        this.descLab.string = eventConf.info
        
        var eventData = Gm.pictureData.getEventDataByStageId(this.openData.stageId,this.openData.treasure)
        // cc.log(eventData)
        for (let index = 0; index < eventData.length; index++) {
            const v = eventData[index];
            var item = cc.instantiate(this.PictureHeroHeadItem)
            item.active = true
            this.enemyNode.addChild(item)
            var itemSp = item.getComponent("PictureHeroHeadItem")
            v.isMonster = true
            itemSp.setData(v)
        }   

        if (data.isReward == 1){
            this.awardLab.node.active = true
            return
        }
        this.awardLab.node.active = false

        var mapConf = Gm.config.getPicturePuzzle(this.openData.nowId)

        var eventId
        if(mapConf.eventGroup[this.openData.stageId]){
            eventId = mapConf.eventGroup[this.openData.stageId].id
        }else{
            eventId = mapConf.endEvent
        }
        var eventGroupConf = Gm.config.getPictureEventGroup(eventId)
        for (let index = 0; index < eventGroupConf.eventReward.length; index++) {
            const v = eventGroupConf.eventReward[index];
            var itemBase = Gm.ui.getNewItem(this.awardNode)
            itemBase.node.scale = 0.85
            itemBase.setData(v)
        }
    },
    onFightBtn(){
        this.openData.type = PictureFunc.getLineHeroType(this.openData.treasure)
        Gm.ui.create("FightTeamView",this.openData)
        this.onBack()
    },
});

