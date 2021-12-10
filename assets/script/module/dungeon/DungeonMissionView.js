var BaseView = require("BaseView")

const GIFT_NONE = 0
const GIFT_DONE = 1
const GIFT_HAVE = 2

cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab1: cc.Node,
        scrollView1: cc.ScrollView,

        cellFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        tipsNode:cc.Node,
        selectType:0,
    },
    onLoad(){
        this._super()
        this.addTimes()
    },
    enableUpdateView:function(args){
        if(args){
            //进度
            this.updateList()
            this.selectType = 0
        }
    },
    register:function(){
        this.events[Events.MISSION_UPDATE] = this.updateList.bind(this)
    },
    updateList:function(){
        var tmpList = Gm.missionData.getMisByType(7)
        if (tmpList){
            tmpList.sort(function(a,b){
                if (a.data.openLevel > Gm.userInfo.maxMapId || b.data.openLevel > Gm.userInfo.maxMapId){
                    return a.data.openLevel - b.data.openLevel
                }
                if (a.rate == a.data.rate){
                    return -1
                }
                if (a.rate == -1){
                    return 1
                }
                if (b.rate == b.data.rate){
                    return 1
                }
                if (b.rate == -1){
                    return -1
                }
                return a.data.id - b.data.id
            })
            var tmpScroll = this.scrollView1
            var tmpItem = this.itemPerfab1
                
            this.scrollView1.scrollToOffset(cc.v2(0, 0),0)
            
            var tmpTotal = tmpList.length
            if (this.items && this.items.length == tmpTotal){
                for(const i in this.items){
                    this.items[i].setOwner(this,tmpList[i].data)
                    this.items[i].updateMission(tmpList[i].rate)
                }
            }else{
                Func.destroyChildren(tmpScroll.content)
                this.items = []
                for (var i = 0; i < tmpList.length; i++) {
                    var v = tmpList[i]
                    var item = cc.instantiate(tmpItem)
                    item.active = true
                    tmpScroll.content.addChild(item)
                    var tmpSpt = item.getComponent("MissionCell")
                    tmpSpt.setOwner(this,v.data)
                    tmpSpt.updateMission(v.rate)
                    this.items.push(tmpSpt)
                }
            }
        }
        this.isAllComplete()
    },
    isAllComplete(){
        var isAll = true
        for(const i in this.items){
            if (this.items[i].m_iType != 2){
                isAll = false
                break
            }
        }
        this.tipsNode.active = isAll
    },
    getCellFrame:function(value){
        if (this.cellFrame[value]){
            return this.cellFrame[value]
        }else{
            return this.cellFrame[0]
        }
    },
    onCloseClick:function(){
        this.onBack()
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
        var tmpDaily = Gm.missionData.getDailyTime(this.selectType)
        if (tmpDaily == 0){
            Gm.missionData.dailyClearTime = 0
            Gm.taskNet.sendTaskList()
        }
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
});

