



cc.Class({
    extends: cc.Component,

    properties: {

        m_oActivitySpr:cc.Sprite,
        m_oTime:cc.RichText,
        redNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.redName = {}
        this.redName[ConstPb.EventOpenType.EVENTOP_DAY_SIGN] = "eventGroup" //每日签到
        this.redName[ConstPb.EventOpenType.EVENTOP_SIGN_TASK] = "eventGroup" //新手任务
        this.redName[ConstPb.EventOpenType.EVENTOP_SHENJI_TASK] = "dungeonActivity" 
        this.redName[ConstPb.EventOpenType.EVENTOP_BINGO] = "bingo" 
        this.redName[ConstPb.EventOpenType.EVENTOP_MARKET] = "limitmark" 
        this.redName[ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN] = "lotterySkin" 

        
    },

    start () {

    },

    getData(){
        return this.m_data
    },

    setData(data,owner){
        this.m_data = data
        this.m_owner = owner
        Gm.load.loadSpriteFrame("img/activityList/"+data.list,(spriteframe,owner)=>{
            owner.spriteFrame = spriteframe
        },this.m_oActivitySpr)
    },

    updateActivity(){

    },

    registerRed(){
        if(this.redName[this.m_data.type]){
            Gm.red.add(this.redNode,this.redName[this.m_data.type],"all")
        }
    },

    refreshRed(){
        if(this.redName[this.m_data.type]){
            Gm.red.refreshEventState(this.redName[this.m_data.type])
        }
    },

    onBtnClick(){
        if(this["callOpen_"+this.m_data.id]){
            if(Gm.getLogic("ActivityListLogic").refresh(this.m_data)){
                this["callOpen_"+this.m_data.id](this.m_data)
                this.refreshRed()
            }else{
                Gm.floating(Ls.get(5445))
            }
        }
    },

    setTime(){
        var time = EventFunc.getTime(this.m_data.type)
        var dateStar = new Date(time.openTime)
        var dateEnd = new Date(time.closeTime)
        var startTimeStr = dateStar.getFullYear() + "-" + (dateStar.getMonth()+1) + "-" + dateStar.getDate()
        var endTimeStr = dateEnd.getFullYear() + "-" + (dateEnd.getMonth()+1) + "-" + dateEnd.getDate()


        this.m_oTime.string =  cc.js.formatStr("<color=#%s><outline color=#%s width=2>%s ~ %s</outline></c>",this.m_data.color,this.m_data.outline,startTimeStr,endTimeStr)

    },
});
