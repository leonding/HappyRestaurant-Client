cc.Class({
    properties: {
        
    },
    ctor:function(){
        this.clearData()
    },
    clearData(){
        this.battleTime = 0
        this.firstBattleTime = 0
        this.isRed = false
    },
    setRed(red){
        if (this.isRed == red){
            return
        }
        this.isRed = red 
        Gm.red.refreshEventState("worldBoss")
    },
    getRed(){
        return this.isRed
    },
    setBattleTime(time){
        this.battleTime = time || Gm.userData.getTime_m()
    },
    setFirstBattleTime(time){
        this.firstBattleTime = time || Gm.userData.getTime_m()
    },
    getFirstBattleTime(){
        return this.firstBattleTime
    },
    getBattleTime(){
        return this.battleTime
    },
    getPlayerNowRank(){
        var rank = 10000
        if (Gm.worldBossData.playerRank){
            for (var i = 0; i < Gm.worldBossData.playerRank.infos.length; i++) {
                var v = Gm.worldBossData.playerRank.infos[i]
                if (v.info.playerId == Gm.userInfo.playerId){
                    rank = i+1
                    break
                }
            }
        }
        return rank
    },
    getNowShowData(){
        var isDebug = true
        var list = Gm.config.getWorldBossTimes()
        if (list == null || (list && list.length == 0)){
            list = Gm.config.getWorldBoss()
            isDebug = false
        }
        if (list[0].startTime == null){
            for (var i = 0; i < list.length; i++) {
                var v = list[i]
                v.startTime = Func.dealConfigTime(v.openTime,true)
                v.date = Func.dateFtt("yyyy-MM-dd hh:mm",v.startTime)
                v.closeTime = v.startTime + v.continueTime *1000
            }
            list.sort((a,b)=>{
                return a.startTime - b.startTime
            })
        }

        var nowDate = new Date(Gm.userData.getTime_m())
        var noOpens = []
        var data
        for (var i = 0; i < list.length; i++) {
            var v = list[i]
            var date = new Date(v.startTime)
            if (date.getDate() == nowDate.getDate()){
                if (v.startTime > Gm.userData.getTime_m()){//未开启
                    noOpens.push(v)
                }else if (Gm.userData.getTime_m() >= v.startTime){//已开启
                    if (v.closeTime > Gm.userData.getTime_m()){//进行中
                        data = v
                    }
                }
            }else if (date.getMonth() == nowDate.getMonth() && date.getDate() > nowDate.getDate()){
                noOpens.push(v)
            }
        }
        if (data == null){
            data = noOpens[0]
        }
        if (isDebug){
            var bossConf = Gm.config.getWorldBoss(data.WorldId)
            bossConf.startTime = data.startTime
            bossConf.closeTime = data.closeTime
            bossConf.continueTime = data.continueTime
            return bossConf
        }
        return data
    },
});
