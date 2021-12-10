var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        m_oLabel1:cc.Node,
        m_oLabel2:cc.Label,
        m_oLabel3:cc.Label,
        m_oLayout1:cc.Node,
        m_oDiamondIcon:cc.Node,
        m_oTicketBaseIcon:cc.Node,
        m_oTicketHighIcon:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:""}

        this._super()
    },
   
    enableUpdateView:function(args){
        if(args){
            this.data = args
            this.popupUI.setTitle(Ls.get(8009))
            if(args.data.ticket > 0){//初级抽奖券
                this.m_oDiamondIcon.active = false
                this.m_oTicketHighIcon.active = false
                this.m_oLayout1.active = false
                this.m_oLabel2.string = Ls.get(5158)
                this.m_oLabel3.string = cc.js.formatStr(Ls.get(20062),args.data.ticket,args.num)                
            }else if(args.data.ticket_high > 0){
                this.m_oDiamondIcon.active = false
                this.m_oTicketBaseIcon.active = false
                this.m_oLayout1.active = false
                this.m_oLabel2.string = Ls.get(5158)
                this.m_oLabel3.string = cc.js.formatStr(Ls.get(20062),args.data.ticket_high,args.num)                
            }else if(args.drawType == 2){//付费钻
                    this.m_oTicketBaseIcon.active = false
                    this.m_oTicketHighIcon.active = false
                    this.m_oLayout1.active = false
                    this.m_oLabel2.string = Ls.get(20066)
                    this.m_oLabel3.string = cc.js.formatStr(Ls.get(20062),args.data.gold_pay,args.num)
            }else{//免费钻
                this.m_oTicketBaseIcon.active = false
                this.m_oTicketHighIcon.active = false
                if(args.data.gold_pay > 0){
                    this.m_oLabel1.active = true
                    this.m_oLabel2.string = Ls.get(20066)
                    this.m_oLabel3.string = cc.js.formatStr(Ls.get(20062),args.data.gold_pay,args.num)
                }else{
                    this.m_oLabel2.string = Ls.get(20061)
                    this.m_oLabel3.string = cc.js.formatStr(Ls.get(20062),args.data.gold,args.num)
                }
            }   
        }
    },
    onCancelClick(){
        this.onBack()
    },
    onConfirmClick(){
        Gm.cardNet.sendDrawCard(this.data.id,this.data.drawType,this.data.quality)
        if(this.data.callback){
            this.data.callback()
            // this.data.callback = null
        }
        this.onBack()
    },
    onNoMoreRemindsTodayClick(sender, value){
        var isOpen = sender.isChecked
        Gm.getLogic("LotteryLogic").setNoMoreRemindsToday(isOpen)
    },

});

