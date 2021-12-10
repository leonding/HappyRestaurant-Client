var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.SOCKET_OPEN]        = this.onSocketOpen.bind(this)
        this.events[MSGCode.P_WC_VISIT_EMAIL_RES] = this.onVisitEmail.bind(this)
        this.events[MSGCode.P_WC_ADD_EMAIL_RES] = this.onAddEmail.bind(this)
        this.events[MSGCode.P_WC_HAND_EMAIL_RES] = this.onHandEmail.bind(this)
        this.events[MSGCode.P_WC_DEL_READ_EMAIL_RES] = this.onDelRead.bind(this)
        this.events[MSGCode.P_WC_REVEIVE_ALL_REWARD_EMAIL_RES] = this.onReveiveAll.bind(this)
    },
    onSocketOpen(){
        Gm.mailData.clearData()
    },
    onVisitEmail:function(args){
        Gm.mailData.updateData(args)
        Gm.send(Events.MAIL_UPDATE)
        Gm.red.refreshEventState("mail")
    },
    onAddEmail:function(args){
        Gm.mailData.updateData(args)
        Gm.send(Events.MAIL_UPDATE)
        Gm.red.refreshEventState("mail")
    },
    onHandEmail:function(args){
        Gm.mailData.pushData(args)
        Gm.send(Events.MAIL_UPDATE)
        Gm.red.refreshEventState("mail")
    },
    onDelRead:function(args){
        Gm.mailData.onDelRead(args)
        Gm.send(Events.MAIL_UPDATE)
        Gm.red.refreshEventState("mail")
    },
    onReveiveAll:function(args){
        for(const i in args.emailID){
            Gm.mailData.pushData({emailID:args.emailID[i],emailType:args.emailType,emailState:1})
        }
        Gm.send(Events.MAIL_UPDATE)
        Gm.red.refreshEventState("mail")
    },
});

