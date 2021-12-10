cc.Class({
    extends: cc.Component,
    properties: {
        bgSpr:cc.Sprite,
        rich:cc.RichText,
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        
        Gm.load.loadSpriteFrame("img/hd/" + data.list,(sp)=>{
            this.bgSpr.spriteFrame = sp
        })
        this.eventData = Gm.signData.getEventInfoById(data.id)

        this.richColor = cc.js.formatStr("<color=#%s><outline color=#%s width=2>%s</outline></c>",data.color,data.outline)

        this.updateTime()
        Gm.red.add(this.node,"eventGroup",this.data.id,"all")
    },
   
    onClick(){
        if (Func.translateTime(this.eventData.endTime,true) <=0){
            Gm.floating(5223)
            return
        }

        var viewName
        if (this.data.id == ConstPb.EventGroup.EVENT_DAY_SIGN){
            viewName = "EventSignView"
        }else if (this.data.id == ConstPb.EventGroup.EVENT_SIGN_TASK){
            viewName = "EventTaskView"
        }
        Gm.audio.playEffect("music/06_page_tap")
        Gm.ui.create(viewName)
    },
    updateTime(){
        var time = Func.translateTime(this.eventData.endTime,true)
        this.rich.string = cc.js.formatStr(this.richColor,cc.js.formatStr(Ls.get(5229),AtyFunc.timeToTSFMzh(time)) ) 
    },
});
