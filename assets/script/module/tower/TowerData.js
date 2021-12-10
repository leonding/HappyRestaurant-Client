cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.data = []
        this.rewardIds = []
        var list = Gm.config.getTowerGroup()
        if (list){
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                this.data.push({towerType:v.group,towerId:v.group*TowerFunc.TYPE_BASE_NUM,num:0})
            }
        }
    },
    isBoxCanReceive(){
        return this.rewardIds.length > 0
    },
    addRewardId(rewardId){
        this.rewardIds.push(rewardId)
    },
    removeRewardId(rewardId){
        for (let index = 0; index < this.rewardIds.length; index++) {
            const v = this.rewardIds[index];
            if (v == rewardId){
                this.rewardIds.splice(index,1)
                break
            }
        }
    },
    setData(list,rewardIds){
        this.rewardIds = rewardIds || []
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var towerType = TowerFunc.towerIdToType(v.towerId)
            var dd = this.getTowerByType(towerType)
            dd.towerId = v.towerId
            dd.num = TowerFunc.towerIdToNum(dd.towerId,towerType)
            dd.towerTime = v.towerTime
            dd.layer = v.layer
        }
    },
    getTowerByType(towerType){
        for (let index = 0; index < this.data.length; index++) {
            const v = this.data[index];
            if ( v.towerType == towerType){
                return v
            }
        }
    },
    getId(towerType){
        return this.getTowerByType(towerType).towerId
    },
    getNumByType(towerType){
        return this.getTowerByType(towerType).num
    },
    getNextNumByType(towerType){
        return this.getNumByType(towerType)+1
    },
    enterNextTower(towerType){
        var dd = this.getTowerByType(towerType)
        dd.num = Math.min(dd.num + 1,TowerFunc.getMaxNum())
        dd.towerId = TowerFunc.towerNumToId(dd.towerType,dd.num)
        dd.towerTime = Gm.userData.getTime_m()
        return dd
    },
    getLocalStorageKey(group) {
        return "towerGroupRed" + group
    },
    redClick(group){
        cc.sys.localStorage.setItem(this.getLocalStorageKey(group),1)
        Gm.red.refreshEventState("tower")
    },
});
