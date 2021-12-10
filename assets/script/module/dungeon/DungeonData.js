cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.info = {}
        this.teamInfo = null
        this.invites = []
    },
    getOpenIds(){
        var list = Gm.config.getOpenDungeons()
        var idList = []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            idList.push(v.id)
        }
        return idList
    },
    isHasInfo(){
        for (const key in this.info) {
            if (this.info[key]){
                return true
            }
            
        }
        return false
    },
    pushData(data){
        this.info[data.dungeonId] = data
    },
    getData(id){
        return this.info[id]
    },
    getDataByMode(id,mode){
        var data = this.getData(id)
        if (data){
            return Func.forBy(data.sweepStar,"mode",mode)
        }
        return null
    },
    getDungeonAllStar(id){
        var star = 0
        var data = this.getData(id)
        if (data){
            for (let index = 0; index < data.sweepStar.length; index++) {
                const v = data.sweepStar[index];
                for (var i = 0; i < v.star.length; i++) {
                    var v1 = v.star[i]
                    if (v.star[i] > 0){
                        star = star + 1
                    }
                }
            }
        }
        return star
    },
    getHasStar(id,star){
        var data = this.getData(id)
        if (data){
            for (let index = 0; index < data.starBox.length; index++) {
                const v = data.starBox[index];
                if (star == v){
                    return true
                }
            }
        }
        return false
    },
    pushPassModes(id,mode,star){
        var data = this.getData(id)
        if(data){
            var dd = Func.forBy(data.sweepStar,"mode",mode)
            if (dd == null){
                dd = {}
                dd.mode = mode
                dd.star = star
                data.sweepStar.push(dd)
            }else{
                dd.star = star
                // for (let index = 0; index < star.length; index++) {
                //     const v = star[index];
                //     if (Func.indexOf(dd.star,v) == -1){
                //         dd.star.push(v)
                //     }
                // }
            }
            cc.log(data)
        }
    },
    setBattleMode(id){
        var data = this.getData(id)
        if (data){
            data.lastBattleMode = true
        }
    },
    pushInvite(data){
        this.checkInvites()

        var cacheData = Func.forBy(this.invites,"sendInviteId",data.sendInviteId)
        if (cacheData){
            cacheData.time = Gm.userData.getTime_m()
        }else{
            data.time = Gm.userData.getTime_m()
            this.invites.push(data)
        }
    },
    getInvite(index){
        return this.invites[index]
    },
    getInviteLen(){
        this.checkInvites()
        return this.invites.length
    },
    checkInvites(){
        var endTime = Gm.config.getConst("be_invited_time_deny")
        for (let index = this.invites.length-1; index >=0; index--) {
            const v = this.invites[index];
            if (Func.translateTime1(v.time,true) > endTime){
                this.invites.splice(index,1)
            }
        }
    },
    delInvites(id){
        Func.forRemove(this.invites,"sendInviteId",id)
    },
    isTeamMember(id){
        if (this.teamInfo){
            var member =Func.forBy(this.teamInfo.member,"memberId",id)
            if (member){
                return true
            }
        }
        return
    },
    isUnlock(dungeonId,mode){
        var conf = Gm.config.getDungeonInfo(dungeonId,mode)
        if (conf){
            if(Gm.userInfo.maxMapId >= conf.openLevel){
                if (conf.frontMode > 0){
                    var dataMode = this.getDataByMode(conf.dungeonId,conf.frontMode)
                    if (dataMode){
                        return true
                    }
                }else{
                    return true
                }
            }else{
                return false
            }
        }

        return false
    },
    getLocalStorageKey(id){
        return "dungeonRedId" + id
    },
    redClick(id){
        // cc.sys.localStorage.setItem(this.getLocalStorageKey(id),1)
        Gm.userData.setHintDay(this.getLocalStorageKey(id))
        Gm.red.refreshEventState("dungeon")
    },
    
});
