//OrerankView
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        timeNode:cc.Node,
        timeLabel1:cc.Label,
        timeLabel2:cc.Label,
        contentNode:cc.Node,

        mySelfNode:cc.Node,
        mySelfRewardNode:cc.Node,

        OreRankItem:cc.Node,
        noRewrdNode:cc.Node,
        noDataLabel:cc.Label,
        m_oListScroll:cc.ScrollView,
    },
    onLoad(){
        this.popupUIData = {title:Ls.get(7500002),bgSpritePath:"img/shuijing/crystal_pattern_1"}
        this._super()
        Gm.oreNet.sendOreRankInfo()
    },
    register(){
        this.events[Events.ORE_RANK_INFO] = this.onRankInfo.bind(this)
    },
    enableUpdateView:function(args){
        if(args){
        }
    },
    onRankInfo(){
        var data = Gm.oreData.getOreRankData()
        this.crateteRankContentNode(data)
        this.createMyRankNode(data)
        this.addTimes()
    
        if(data.rankList.length == 0){
             this.noDataLabel.node.active = true
             if(OreFunc.oreIsOpen()){
                 this.noDataLabel.string = Ls.get(7500072)
             }
             else{
                  this.noDataLabel.string = Ls.get(7500071)
             }
        }
        else{
             this.noDataLabel.node.active = false
        }
    },
    crateteRankContentNode(data){
        Gm.ui.simpleScroll(this.m_oListScroll,data.rankList,function(itemData,tmpIdx){
            var item = cc.instantiate(this.OreRankItem)
            item.active = true
            this.contentNode.addChild(item)
            item.getComponent("OreRankItem").setUI(itemData,tmpIdx)
            return item
        }.bind(this))
        this.m_oListScroll.scrollToTop()
    },
    createMyRankNode(data){
        data.info.allianceName = ""
        if(Gm.unionData.info && Gm.unionData.info.name){
            data.info.allianceName = Gm.unionData.info.name
        }
        var itemJs = this.mySelfNode.getComponent("OreRankItem")
        itemJs.setUI(data,data.rank)

        this.setReardNode(data.rank)
    },
    setReardNode(rank){
        var data = Gm.config.getOreAwardConfig()
        var reward = null
        for(var i=0;i<data.length;i++){
            if(rank>= data[i].minRank && rank<=data[i].maxRank){
                reward = data[i].reward
                break
            }
        }
        if(reward){
             for(var i=0;i<reward.length;i++){
                var newItem = Gm.ui.getNewItem(this.mySelfRewardNode,false)
                newItem.setData(reward[i])
            }
            this.noRewrdNode.active = false
        }
        else{
            this.noRewrdNode.active = true
        }
    },
    onRankRewardBtnClick(){
        Gm.ui.create("OreRankRewardView")
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
        var tmpTime = (OreFunc.getEndTime() - Gm.userData.getTime_m())/1000
        if (tmpTime > 0){
            this.timeLabel1.string = Ls.get(7500053)
            this.timeLabel2.string = Func.timeToTSFM(tmpTime)
        }
        else{
            this.timeLabel1.string = Ls.get(7500069)
            var time = OreFunc.getStartTime()
            this.timeLabel2.string = OreFunc.getTimeStr(time/1000 - Func.getDay())
            if(OreFunc.istest){
                  var time = OreFunc.getStartTime1()
                  this.timeLabel2.string = OreFunc.getTimeStr(time/1000 - Func.getDay())
            }
        }
    },
});


