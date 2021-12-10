cc.Class({
    properties:{
  
    },
    
    ctor(){
    },

    //判断当天是否领取
    isThatDayReceived(){
        var innerTime = this.getDiffTime()
        var signData = this.getSignData()

        var isRecived = signData.length == 0 || signData.indexOf(innerTime) == -1
        return !isRecived
    },

    //获取玩家当前登录的时间和上次领取奖励的时间差
    getDiffTime(){
        var time = EventFunc.getTime(ConstPb.EventOpenType.EVENTOP_LOGIN_SIGN)

        var date = new Date(new Date(time.openTime).toLocaleDateString() )
        var date2 =new Date( new Date().toLocaleDateString())

        var innerTime = (date2 - date )/(1*24*60*60*1000)+1

        return innerTime
    },
    getRewardIsReceived(index){
        var innerTime = this.getDiffTime()
        var canReceive = 1//可以领取
        var received  = 2//已经领取
        var notReceived = 3//不可以领取 
        var isExist = this.getSignData().indexOf(index) != -1
        if(index <= innerTime &&  !isExist){
            return canReceive
        }else if(index <= innerTime && isExist){
            return received
        }else if(index > innerTime){
            return notReceived
        }
    },

    setIsReceived(isReceived){
        this.m_isReceived = isReceived
    },

    setSignData(signData){
        this.m_signDays = signData
    },
    

    getSignData(){
        return this.m_signDays || []
    }
})