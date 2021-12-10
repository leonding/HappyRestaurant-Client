var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        EventTaskItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        timeLab:cc.Label,
        descRich:cc.Label,
        bottomListNode:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.selectType = -1
        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
            v.getChildByName("New Label").getComponent(cc.Label).string = cc.js.formatStr(Ls.get(5232),index+1)
            Gm.red.add(v,"eventGroup",ConstPb.EventGroup.EVENT_SIGN_TASK,index+1)
        }

        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    register:function(){
        this.events[MSGCode.OP_RECEIVE_WSREWARD_S] = this.updateList.bind(this)
        this.events[Events.WEEK_SIGN_DAY_UPDATE] = this.updateBtnList.bind(this)
    },
    updateBtnList(){
        var starType = Math.min(5,Gm.signData.getEventInfoById(ConstPb.EventGroup.EVENT_SIGN_TASK).signDay)-1
        for (let index = 0; index < this.listBtns.length; index++) {
            const v = this.listBtns[index];
            v.getChildByName("lookSpr").active = starType < index
            v.getComponent(cc.Button).interactable = !v.getChildByName("lookSpr").active
        }
        return starType
    },
    enableUpdateView(args){
        if (args){
            var starType = this.updateBtnList()

            for (let index = 0; index < this.bottomListNode.children.length; index++) {
                const v = this.bottomListNode.children[index];
                var redNode = v.getChildByName("red")
                if (redNode && redNode.active){
                    starType = index
                    break
                }
            }
            this.select(starType)
        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                v.getChildByName("selectSpr").active = isSelect
            }
            this.updateList()
        }
    },
    updateList(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getEventTasksByDay(this.selectType +1)
        var newList = []
        for (let i = 0; i < list.length; i++) {
            const taskType = list[i];

            var tasks = Gm.config.getEventTasksByType(taskType,this.selectType +1)
            tasks.sort(function(a,b){
                return a.id - b.id
            })
            var nowTask = tasks[tasks.length-1]
            for (let j = 0; j < tasks.length; j++) {
                const v = tasks[j];
                if (!Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_SIGN_TASK,v.id)){
                    nowTask = v
                    break
                }
            }
            if (Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_SIGN_TASK,nowTask.id)){
                nowTask.state = 3//已领取
                nowTask.nowNum = nowTask.rate
            }else{
                nowTask.nowNum = Gm.signData.getRateByTaskType(ConstPb.EventGroup.EVENT_SIGN_TASK,taskType)
                if (nowTask.conditionType == 1){
                    if (nowTask.nowNum >= nowTask.conditionValue){
                        nowTask.nowNum = 1
                    }else{
                        nowTask.nowNum = 0
                    }
                }
                if (nowTask.nowNum >= nowTask.rate){
                    nowTask.state = 1 //可领取
                }else{
                    nowTask.state = 2//未达成
                }
            }
            newList.push(nowTask)
        }

        newList.sort(function(a,b){
            if (a.state == b.state){
                return a.id - b.id
            }
            return a.state - b.state
        })

        var eventData = Gm.signData.getEventInfoById(ConstPb.EventGroup.EVENT_SIGN_TASK)

        this.endTime = eventData.endTime

        this.items = []
        var itemHeight = 0
        for (let index = 0; index < newList.length; index++) {
            var item = cc.instantiate(this.EventTaskItem)
            item.active = true
            this.scrollView.content.addChild(item)
            itemHeight = item.height
            var sp = item.getComponent("EventTaskItem")
            sp.setData(newList[index],this)
            this.items.push(sp)
        }
        this.scrollView.content.height = itemHeight*this.items.length + 80
        this.updateTime()
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    updateTime(){
        if (this.endTime){
            var time = Func.translateTime(this.endTime,true)
            if (time <=0){
                Gm.floating(5223)
                this.onBack()
                return
            }
            this.timeLab.string = cc.js.formatStr(Ls.get(5229),AtyFunc.timeToTSFMzh(time)) 
        }
    },
});

