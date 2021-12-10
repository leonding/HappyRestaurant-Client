var HeroInfo = require("HeroInfo")
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    isOpen(){
        if (this.unlockMapId == 0){
            this.unlockMapId = Gm.config.getViewByName("BossTrialView").openMapId
        }
        return this.unlockMapId > Gm.userInfo.maxMapId || this.closeTime > Gm.userData.getTime_m()
    },
    clearData:function(){
        this.currentMapId = []//1,4,7
        this.saveMapId = 0
        this.heros = null
        this.closeTime = 0
        this.unlockMapId = 0
    },
    setEndTime(time){
        this.closeTime = time
    },
    getSaveIndex(){
    	return Func.indexOf(this.currentMapId,this.saveMapId)
    },
    getMapIdByIndex(index){
        return this.currentMapId[index]
    },
    setData(args){
    	this.currentMapId = args.currentMapId
    	this.saveMapId = args.saveMapId || 0
    },
    initHero(list){
        if (this.heros == null){
            this.heros = []
        }
    	for (let index = 0; index < list.length; index++) {
            const v = list[index];
          	this.addHero(v)
        }
        this.updateMaxLv()
    },
    getAllHelpHero(){
        return this.heros
    },
    clearHero(){
        this.heros = null
    },
    addHero(hero){
    	if (this.heros == null){
    		return
    	}
    	var info = new HeroInfo()
        info.setData(hero)
        info.isHelpHero = true
        this.heros.push(info)
    },
    updateMaxLv(){
        // var maxLv = Gm.heroData.getMaxHeroLv()
        // for (var i = 0; i < this.heros.length; i++) {
        //     this.heros[i].level = maxLv
        // }
    },
    getMaxQuality(){
        var quality = 0
        for (var i = 0; i < this.heros.length; i++) {
            var hero =  this.heros[i]
            var conf = Gm.config.getHero(hero.baseId,hero.qualityId)
            if (conf.quality > quality){
                quality = conf.quality
            }
        }
        return quality
    },
    getHeroByBaseId(baseId){
    	return Func.forBy(this.heros,"baseId",baseId)
    },
    getHeroByHeroId(heroId){
        return Func.forBy(this.heros,"heroId",heroId)
    },
    getLocalStorageKey(bossId){
        return "bossTrialId" +bossId
    },
    redClick(bossId){
        cc.sys.localStorage.setItem(this.getLocalStorageKey(bossId),1)
        Gm.red.refreshEventState("bossTrial")
    },

});
