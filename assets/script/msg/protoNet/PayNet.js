var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_PAY_CREATE_PAYMENT_C]        = "Pay.OPCreatePayment"
MSGCode.proto[MSGCode.OP_PAY_CREATE_PAYMENT_S]        = "Pay.OPCreatePaymentRet"
MSGCode.proto[MSGCode.OP_PAY_PAYMENT_RESULT_C]    = "Pay.OPPaymentResult"
MSGCode.proto[MSGCode.OP_PAY_PAYMENT_RESULT_S]    = "Pay.OPPaymentResultRet"

MSGCode.proto[MSGCode.OP_BIND_PAY_ACCOUNT_C]    = "Pay.BindPayAccount"
MSGCode.proto[MSGCode.OP_BIND_PAY_ACCOUNT_S]    = "Pay.BindPayAccountRet"

MSGCode.proto[MSGCode.OP_BIND_PAY_INFO_S]       = "Pay.PayInfoRet"
MSGCode.proto[MSGCode.OP_BIND_JP_BORN_C]         = "Pay.SetJpBornDate"
MSGCode.proto[MSGCode.OP_BIND_JP_BORN_S]         = "Pay.SetJpBornDateRet"
cc.Class({
    properties: {
        
    },
    createPay:function(atyId){ //活动ID，在充值中找对应itemId
        //先检查玩家是否绑定帐号
        var item = Gm.config.getPayProductAtyId(atyId)
        this.productId = item.itemId

        Gm.sendCmdHttp(MSGCode.OP_PAY_CREATE_PAYMENT_C,{activityId:atyId})
    },
    payResult:function(dd){
        Gm.sendCmdHttp(MSGCode.OP_PAY_PAYMENT_RESULT_C,dd)
    },

    sendToken:function(playerid,toKen){
       console.log("发送token",toKen)
       var sendData = {playerId:playerid,token:toKen}

       var timeData = Gm.userInfo.getBirthDay()
       if(timeData){
            var date = new Date()
            date.setFullYear(timeData.year)
            date.setMonth(timeData.month,1)
            date.setDate(timeData.day)
            sendData.bornDate = date.getTime()
       }
       Gm.sendCmdHttp(MSGCode.OP_BIND_PAY_ACCOUNT_C,sendData)
    },
    
    sendBornDate(){
        var timeData = Gm.userInfo.getBirthDay()
        var date = new Date()
        date.setFullYear(timeData.year)
        date.setMonth(timeData.month,1)
        date.setDate(timeData.day)
        var bornDate = date.getTime()
       
        Gm.sendCmdHttp(MSGCode.OP_BIND_JP_BORN_C,{playerId:Gm.userInfo.id,bornDate:bornDate})
    }
});
