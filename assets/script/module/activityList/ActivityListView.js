var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oListItem:cc.Node,
        m_oContent:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super()
        this.m_activitListScript = []
        this.m_activitListItem = []
        this.m_activitListId = []
        this.updateList()
        this.schedule(this.updateActivity.bind(this),1)
    },

    start () {

    },

    updateList(){
        Gm.getLogic("ActivityListLogic").refreshOpen()
        var list = Gm.activityListData.getOpenPageList()
        var expiredActivity = []
        var newActivity = []
        for(let index in this.m_activitListId){
           if(list.indexOf(this.m_activitListId[index]) == -1 ) { //过期
                expiredActivity.push(this.m_activitListId[index])
           }
        }        
        
        for(let index2 in list){
            if(this.m_activitListId.indexOf(list[index2]) == -1 ) { //新活动
                newActivity.push(list[index2])
            }
        }

        for(let newActIdx in newActivity){
            this.addItemById(newActivity[newActIdx])
        }

        for(let expiredIdx in expiredActivity){
            this.removeItemById(expiredActivity[expiredIdx])
        }
    },

    addItemById(activityId){
        let data =  Gm.config.getEventGroup(activityId)
        data.time = EventFunc.getTime(data.type)
        let item = cc.instantiate(this.m_oListItem)
        item.parent = this.m_oContent
        item.active = true
        let script = item.getComponent("ActivityListItem")
        script.setData(data,this)
        script.setTime()
        script.registerRed()
        script.refreshRed()
        this.m_activitListScript.push(script)
        this.m_activitListItem.push(item)
        this.m_activitListId.push(activityId)
    },

    removeItemById(activityId){
        for(let key in this.m_activitListScript){
            let data = this.m_activitListScript[key].getData()
            if(data.id == activityId){
                this.m_activitListScript.splice(key,1)
                this.m_activitListItem[key].removeFromParent()
                this.m_activitListItem.splice(key,1)
                this.m_activitListId.splice(key,1)
                break 
            }
        }
    },

    updateActivity(){
        for(let key in this.m_activitListScript){
            if(this.m_activitListScript[key]){
                this.m_activitListScript[key].updateActivity()
            }
        }

        this.updateList()

        if( this.m_activitListId.length == 0 ){
            Gm.ui.removeByName("ActivityListView")
        }
    }
});
