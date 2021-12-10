//OreBattleLogView
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        bottomBts:{
            default:[],
            type:cc.Node
        },
        rewardNodeItem:cc.Node,
        contentNodeReward:cc.Node,
        contentNodeRewardContent:cc.Node,
        recordNodeItem:cc.Node,
        contentNodeRecord:cc.Node,
        contentNodeRecordContent:cc.Node,
        // titleLabel:cc.Label,
    },
    onLoad(){
        this.popupUIData = {bgSpritePath:"img/shuijing/crystal_pattern_1"}
        this._super()
        this.selectIndex = -1
        Gm.oreNet.sendOreBattleLog()
        this.enterTime = Gm.userData.getTime_m()
        Gm.red.add(this.bottomBts[0],"ore","oreHasReward")
        this.titleLabel = this.popupUI.titleLab
    },
    register:function(){
        this.events[Events.ORE_BATTLELOG_INFO] = this.onCreateContentNode.bind(this)
        this.events[Events.ORE_ON_GET_REWARD]  = this.onGetReward.bind(this)//领取奖励
    },
    enableUpdateView:function(args){
        if(args){
            this.createList = []
            this.selectIndex = 1
            this.changBottonSelectSprite(1)
            // if(Gm.oreData.getMyOreId()){
            //     this.goldSpeed = Gm.oreData.getMyGoldSpeed()
            //     this.addTimes()
            // }
        }
    },
    onCreateContentNode(index){
        index = index ? index : 1
       this.data = Gm.oreData.getBattleLogData()
        if(this.data){
            if(index == 1){
                this.createBattleLogRewardNode(this.data.logs)
            }
            else{
                this.createBattleLogNode(this.data.logs)
            }
        }
    },
    createBattleLogRewardNode(data){
        this.itemJs = []
        Func.destroyChildren(this.contentNodeRewardContent)
        for(var i=0;i<this.data.receives.length;i++){
            if(this.data.receives[i].gold != 0){
                var item = cc.instantiate(this.rewardNodeItem)
                item.active = true
                var itemJ = item.getComponent("OreBattleLogRewardItem")
                itemJ.setUI(this.data.receives[i])
                this.itemJs.push(itemJ)
                this.contentNodeRewardContent.addChild(item)
            }
        }
    },
    createBattleLogNode(data){
        Func.destroyChildren(this.contentNodeRecordContent)
        for(var i=0;i<data.length;i++){
            var item = cc.instantiate(this.recordNodeItem)
            item.active = true
            item.getComponent("OreBattleLogItem").setUI(data[i])
            this.contentNodeRecordContent.addChild(item)
        }
    },
    onBotton1Click(){
        if(this.selectIndex != 0){
            this.selectIndex = 0
            this.changBottonSelectSprite(0)
            this.changContentNode(0)
        }
    },
    onBotton2Click(){
        if(this.selectIndex != 1){
            this.selectIndex = 1
            this.changBottonSelectSprite(1)
            this.changContentNode(1)
        }
    },
    changBottonSelectSprite(index){
        for(var i=0;i<this.bottomBts.length;i++){
            if(i == index){
                this.bottomBts[i].getChildByName("selectSprite").active = true
                this.bottomBts[i].getChildByName("iconSprite").active = false
            }
            else{
                this.bottomBts[i].getChildByName("selectSprite").active = false
                this.bottomBts[i].getChildByName("iconSprite").active = true
            }
        }
        var titleName = [Ls.get(7500024),Ls.get(7500025)]
        this.titleLabel.string = titleName[index]
    },
    changContentNode(index){
        if(!this.createList[index]){
            this.createList[index] = true
            this.onCreateContentNode(index+1)
        }
        if(index == 0){
            this.contentNodeReward.active = true
            this.contentNodeRecord.active = false
        }
        else if(index == 1){
            this.contentNodeReward.active = false
            this.contentNodeRecord.active = true
        }
    },
    onGetReward(data){
        for(var i=0;i<this.itemJs.length;i++){
            if(this.itemJs[i].data.roomType == data.roomType){
                this.itemJs[i].node.active = false
            }
        }
    },

     //更新结束时间
    onDestroy(){
        this.clearTime()
        this._super()
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        if(this.itemJs && this.itemJs[0] && Gm.oreData.getMyOreId()){
            var tmpTime = (Gm.userData.getTime_m() -  this.enterTime)/1000
            var num = OreFunc.getRewardNumByTime(tmpTime,this.goldSpeed)
            this.itemJs[0].updateItem(num+ this.data.count)
        }
    },
});


