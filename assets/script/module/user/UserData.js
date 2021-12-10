cc.Class({
    properties: {
        fightSpeed:1,
        musicValue:0,
        soundValue:0,
        serverTime:0,
        skillLihui:1,//显示技能立绘
        battleText:1,//显示战斗文本
        hangupAward:1,//挂机奖励到达上限
        arenaRank:1,//竞技场排名降低
        sociatyBoss:1,//公会boss开启
        privatechat:1,//私聊信息
        teamyoketip:1,//上阵羁绊展示
    },
    ctor:function(){
        this.fightSpeed = cc.sys.localStorage.getItem("fight_speed") || 1
        this.musicValue = cc.sys.localStorage.getItem("music_value") || 1
        Gm.audio.setVolume(this.musicValue/4,true)
        this.volumeValue = cc.sys.localStorage.getItem("volume_value") || 1//Gm.audio.getVolume()
        Gm.audio.setVolume(this.volumeValue)
        this.interval = null
        this.skillLihui = parseInt(cc.sys.localStorage.getItem("skillLihui") || 1)
        this.battleText = parseInt(cc.sys.localStorage.getItem("battleText") || 1)
        this.hangupAward = parseInt(cc.sys.localStorage.getItem("hangupAward") || 1)
        this.arenaRank = parseInt(cc.sys.localStorage.getItem("arenaRank") || 1)
        this.sociatyBoss = parseInt(cc.sys.localStorage.getItem("sociatyBoss") || 1)
        this.privatechat = parseInt(cc.sys.localStorage.getItem("privatechat") || 1)
        this.teamyoketip = parseInt(cc.sys.localStorage.getItem("teamyoketip") || 1)
        this.pushswitch = true
        this.unionIslandId = parseInt(cc.sys.localStorage.getItem("unionIslandId") || 0)//工会竞技开放的岛屿Id
        this.fastFight = parseInt(cc.sys.localStorage.getItem("fastFight") || 0)//工会竞技开放的岛屿Id
        this.oreFullRoomShow = parseInt(cc.sys.localStorage.getItem("oreFullRoomShow") || 0)
        this.lotteryAwardGuide = parseInt(cc.sys.localStorage.getItem("lotteryAwardGuide") || 1) //抽卡结果页面是否显示引导
        this.showHeroLine = true
    },
    setFightSpeed:function(destValue){
        this.fightSpeed = destValue
        cc.sys.localStorage.setItem("fight_speed", destValue)
    },
    timeStart:function(){
        this.clearTime()
        this.interval = setInterval(function(){
            this.gainTime(100)
        }.bind(this),100)
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    getDayEnd:function(){
        if (this.dayEndTime){
            return this.dayEndTime - this.serverTime
        }
        var b = new Date(this.serverTime)
        b.setDate(b.getDate() + 1)
        b.setHours(0)
        b.setMinutes(0)
        b.setSeconds(0)
        b.setMilliseconds(0)
        this.dayEndTime = b.getTime() 
        return this.dayEndTime - this.serverTime
    },
    getTime_s:function(){
        return Math.floor(this.serverTime/1000)
    },
    getTime_m:function(){
        return this.serverTime
    },
    setServerTime:function(time){
        this.serverTime = time
        this.timeStart()
    },
    gainTime:function(dt){
        if(this.serverTime == 0){
            return
        }
        this.serverTime = this.serverTime + dt
        Gm.userInfo.setOnlineTime(dt)
    },
    //当前已经过的时间-秒
    getDayPassTime(){
        return this.getTime_s() - Func.getDay()
    },
    setLoginTime(time){
        this.loginTime = time
        this.setServerTime(this.loginTime)
    },
    getLoginPassTime(){
        return this.getPassTime(this.loginTime)
    },
    getPassTime:function(time){
        return Math.floor((this.serverTime-time)/1000)
    },
    timeIng:function(startTime,endTime,isAddBegin){
        if (isAddBegin){
            startTime = startTime + Func.getDay()
            endTime = endTime + Func.getDay()
        }
        if(this.getTime_s() >= startTime && this.getTime_s() <= endTime){
            return true
        }
        return false
    },
    updateMusic:function(destValue){
        this.musicValue = destValue
        cc.sys.localStorage.setItem("music_value", destValue)
        Gm.audio.setVolume(destValue/4,true)
        if(destValue > 0){
            Gm.audio.playBGM(Gm.ui.getMain().getBgmPlay())
        }else{
            Gm.audio.stopMusic()
        }
    },
    updateVolume:function(destValue){
        this.volumeValue = destValue
        cc.sys.localStorage.setItem("volume_value", destValue)
        Gm.audio.setVolume(destValue)
    },
    restoreVolume(){
        this.updateVolume(this.volumeValue)
    },
    setHintDay(type){
        cc.sys.localStorage.setItem(type, Func.dateFtt("MM-dd",this.getTime_m()))
    },
    isHintDay(type){
        var day = cc.sys.localStorage.getItem(type)
        if (day == Func.dateFtt("MM-dd",this.getTime_m())){
            return true
        }
        return false
    },
    setSkillLihui(isChecked){
        this.skillLihui = isChecked
        cc.sys.localStorage.setItem("skillLihui", isChecked)
    },
    setBattleText(isChecked){
        this.battleText = isChecked
        cc.sys.localStorage.setItem("battleText", isChecked)
    },
    setHangupAward(isChecked){
        this.hangupAward = isChecked
        cc.sys.localStorage.setItem("hangupAward", isChecked)        
    },
    setArenaRank(isChecked){
        this.arenaRank = isChecked
        cc.sys.localStorage.setItem("arenaRank", isChecked)        
    },
    setSociatyBoss(isChecked){
        this.sociatyBoss = isChecked
        cc.sys.localStorage.setItem("sociatyBoss", isChecked)        
    },    
    setPrivateChat(isChecked){
        this.privatechat = isChecked
        cc.sys.localStorage.setItem("privatechat", isChecked)        
    },
    setLotteryAwardGuide(isChecked){
        this.lotteryAwardGuide = isChecked
        cc.sys.localStorage.setItem("lotteryAwardGuide", isChecked)        
    },
    setYokeTips:function(isChecked){
        this.teamyoketip = isChecked
        cc.sys.localStorage.setItem("teamyoketip", isChecked)     
    },
    setPushSwitch:function(isChecked){
        this.pushswitch = isChecked
    },
    setShowHeroLine(isChecked){
        this.showHeroLine = isChecked
    },
    setUnionIslandId(id){
        this.unionIslandId = id
        cc.sys.localStorage.setItem("unionIslandId", id)     
    },
    getUnionIslandId(){
        return this.unionIslandId
    },
    reSetFastFight:function(){
        this.fastFight = this.serverTime
        cc.sys.localStorage.setItem("fastFight", this.fastFight)
    },
    getFastFight:function(){
        return this.fastFight
    },
    setOreFullRoomShow(key){
        if(key){
            this.oreFullRoomShow = 0
        }
        else{
            this.oreFullRoomShow = 1
        }
        cc.sys.localStorage.setItem("oreFullRoomShow",this.oreFullRoomShow)
    },
    isShowOreFullRoom(){
        var key = this.oreFullRoomShow  == 0
        return key
    }
});
