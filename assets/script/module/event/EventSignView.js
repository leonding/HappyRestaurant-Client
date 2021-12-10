var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        EventSignItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        timeLab:cc.Label,
    },
    onLoad:function(){
        this._super()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    register:function(){
        this.events[MSGCode.OP_RECEIVE_WSREWARD_S] = this.updateView.bind(this)
        this.events[Events.WEEK_SIGN_DAY_UPDATE] = this.updateView.bind(this)
    },
    enableUpdateView(args){
        if (args){
            this.updateView(true)
        }
    },
    updateView(isFirst){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getEventSign()
        var isCanMoveScrollView = true
        var eventData = Gm.signData.getEventInfoById(ConstPb.EventGroup.EVENT_DAY_SIGN)
        this.endTime = eventData.endTime

        this.items = []
        var itemHeight = 0
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var item = cc.instantiate(this.EventSignItem)
            item.active = true
            this.scrollView.content.addChild(item)
            itemHeight = item.height
             if (Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_DAY_SIGN,v.id)){
                v.state = 3//已领取
                isCanMoveScrollView  = index == list.length-1  ? false : true
            }else{
                 if (eventData.signDay >= v.id){
                    v.state = 1 //可以领取
                    isCanMoveScrollView  = index < list.length - 1 ? false : true
                 }else{
                    v.state = 2 //未达到领取条件
                    isCanMoveScrollView = false
                 }
            }
            var sp = item.getComponent("EventSignItem")
            sp.setData(v,this,eventData.starTime)

            this.items.push(sp)
        }
        this.scrollView.content.height = itemHeight*this.items.length + 80
        if(isFirst === true && isCanMoveScrollView){ //第一次进入刷新列表
            this.scrollView.content.y += itemHeight 
        }
        this.updateTime()
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

            if (this.items){
                for (let index = 0; index < this.items.length; index++) {
                    const v = this.items[index];
                    v.updateTime()
                }
            }
        }
    }
    
});

