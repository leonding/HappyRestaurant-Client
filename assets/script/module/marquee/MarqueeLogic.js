var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        this.isMain = false
    },
    timeStart:function(){
        this.clearTime()
    },
    dungeonMarquee(){
        var passTime = Gm.userData.getDayPassTime()

        var self = this
        var playOne = function(dungeon){
            for (let index = 0; index < dungeon.openTime.length; index++) {
                const time = dungeon.openTime[index];
                for (let index = 0; index < self.dungeonsMarqueeConf.time.length; index++) {
                    const delayTime = self.dungeonsMarqueeConf.time[index];
                    if (passTime == time.time + delayTime.time){
                        var arg = self.dungeonsMarqueeConf.id+ "|" + dungeon.name
                        Gm.send(MSGCode.P_WC_SYSTEM_MARQUEE_RES,{marqueeSYN:[{marqueeId:-self.dungeonsMarqueeConf.id,contentAlias:arg}]})
                    }
                }
            }
        }
        for (let index = 0; index < this.dungeonsList.length; index++) {
            const v = this.dungeonsList[index];
            playOne(v)
        }
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    register:function(){
        this.events[Events.LOGIN_SUC]           = this.onLogin.bind(this)
        this.events[Events.SOCKET_CLOSE]       = this.onSocketClose.bind(this)
        this.events[Events.ENTER_MAIN]       = this.onEnterMain.bind(this)
        this.events[MSGCode.P_WC_SYSTEM_MARQUEE_RES]     = this.onNetMarqueeSyn.bind(this)
        this.events[MSGCode.P_WC_SYSTEM_DEL_MARQUEE_RES]     = this.onNetMarqueeDel.bind(this)
    },
    onLogin:function(){
        Gm.ui.create("MarqueeView")
        Gm.marqueeData.clearData()

        if (this.isView()){
            this.view.deleteLabel()
            this.view.node.active = false
        }
        this.timeStart()
    },
    onSocketClose(){
        this.clearTime()
        Gm.marqueeData.clearData()
        if (this.isView()){
            this.view.deleteLabel()
            this.view.node.active = false
        }
    },
    onEnterMain(){
        this.isMain = true
        this.updateView()
    },
    onNetMarqueeSyn:function(args){
        if (args.marqueeSYN){
            for (let index = 0; index < args.marqueeSYN.length; index++) {
                var v = args.marqueeSYN[index];
                Gm.marqueeData.addItem(v) 
            }
        }
        this.updateView()
    },
    updateView(){
        if (this.isMain && Gm.marqueeData.getFirstItem() && this.view.m_iRunType != 1 ){
            this.view.updateMarquee(Gm.marqueeData.getFirstItem())
        }
    },
    onNetMarqueeDel:function(args){
        var isCurr = Gm.marqueeData.delById(args.marqueeId)
        if (isCurr && this.view.m_iRunType == 1 ){
            this.view.deleteLabel()
            this.updateView()
        }
    },
    
});
