cc.Class({
    properties: {
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.clearGjData()
        this.silver_drop_value = 0
        this.experience_add_percent = 0
        this.fightSetInfo = null
    },
    setFightSetInfo(list){
        this.fightSetInfo = list
    },
    getFightSetInfoByIndex(index){
        return Func.indexOf(this.fightSetInfo,index)
    },
    clearGjData:function(){
        this.lastAward = {coin:0,exp:0}//记录切换地图之前的收益
        this.gjDrop = {treasure:[],item:[]}
    },
    //记录收益(更换地图、重置挂机时间)
    changeLastAward:function(){
        this.lastAward = this.getCurrGjAward()
    },
    getGjAward:function(){
        var gjInterval = Gm.config.getConst("map_drop_interval")
        var map = Gm.config.getMapById(Gm.userInfo.mapId)
        var time = Gm.userData.getPassTime(Gm.userInfo.lastGuaJiAwardTime)
        var num = Math.floor(time/gjInterval)
        var obj = {coin:0,exp:0}
        obj.coin = map.coinDrop * num
        obj.exp = map.expDrop * num
        return obj
    },
    //当前收益
    getCurrGjAward:function(){
        var award = this.getGjAward()
        award.coin = award.coin + this.lastAward.coin
        award.exp = award.exp + this.lastAward.exp
        return award
    },
    //挂机掉落
    getCurrGjDrop:function(){
        return this.gjDrop
    },
    //挂机战力加成
    getGjFightAdd:function(){
        var fight = Gm.heroData.getFightAll()
        var map = Gm.config.getMapById(Gm.userInfo.mapId)
        var con = Gm.config.getConfig("FightAddAwardConfig")
        var p = fight/map.combat
        for (let index = 0; index < con.length; index++) {
            const v = con[index];
            if (p >= v.fight_min && p < v.fight_max){
                return v.add_percent*100
            }
        }
        return 0
    },
    setFightTeamLocal:function(data){
        this.m_oLocalTeam = data
    },
    setFightCross:function(corss){
        this.m_bCross = corss
    },
});
