var ActivityListBase = require("ActivityListBase")
cc.Class({
    extends: ActivityListBase,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super()
    },

    start () {

    },

    setTime(){
        switch(this.m_data.id){
            case ConstPb.EventGroup.EVENT_DAY_SIGN: 
            case ConstPb.EventGroup.EVENT_SIGN_TASK:
                this.setEventTime()
                break 

            default:
                this._super()
        }
      
    },

    registerRed(){
        switch(this.m_data.type){
            case ConstPb.EventOpenType.EVENTOP_DAY_SIGN: 
                Gm.red.add(this.redNode,this.redName[ConstPb.EventOpenType.EVENTOP_DAY_SIGN],this.m_data.id,"all")
                break 
            case ConstPb.EventOpenType.EVENTOP_SIGN_TASK:
                Gm.red.add(this.redNode,this.redName[ConstPb.EventOpenType.EVENTOP_SIGN_TASK],this.m_data.id,"all")
                break 
            default:
                this._super()
        }

    },
    updateActivity(){
        this._super()
        this.updateTime()
    },

    updateTime(){
        switch(this.m_data.type){
            case ConstPb.EventOpenType.EVENTOP_SHOP: 
                this.updateCountdown()
                break
            case ConstPb.EventOpenType.EVENTOP_DAY_SIGN:  
            case ConstPb.EventOpenType.EVENTOP_SIGN_TASK:  
                this.setEventTime()
                break
        }
    },

    updateCountdown(){
        var time = Func.translateTime(this.m_data.time.closeTime,true)
        if (time < 24*60*60){
            this.m_oTime.string = Func.timeToTSFM(time)
        }
    },

    setEventTime(){
        this.richColor = cc.js.formatStr("<color=#%s><outline color=#%s width=2>%s</outline></c>",this.m_data.color,this.m_data.outline)
        var eventData = Gm.signData.getEventInfoById(this.m_data.id)
        var time = Func.translateTime(eventData.endTime,true)
        this.m_oTime.string = cc.js.formatStr(this.richColor,cc.js.formatStr(Ls.get(5229),AtyFunc.timeToTSFMzh(time)) ) 
    },

    callOpen_1001(data){

        var eventData = Gm.signData.getEventInfoById(data.id)
        if (Func.translateTime(eventData.endTime,true) <=0){
            Gm.floating(5223)
            return
        }
        Gm.ui.create("EventSignView")
    },

    callOpen_1002(data){
        var eventData = Gm.signData.getEventInfoById(data.id)
        if (Func.translateTime(eventData.endTime,true) <=0){
            Gm.floating(5223)
            return
        }
        Gm.ui.create("EventTaskView")
    },

    callOpen_20001(){
        Gm.ui.create("BingoView")
    },

    callOpen_101(){
        Gm.ui.create("DungeonActivityView")
    },

    callOpen_40001(){
        Gm.ui.create("LimitMarketView")
    },

    callOpen_80001(){
        Gm.ui.create("LotterySkinView")
    },

    callOpen_5001(){
        Gm.ui.create("LotteryMain",{page:2})
    },

    // update (dt) {},
});
