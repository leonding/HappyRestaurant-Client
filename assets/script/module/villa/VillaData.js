cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.vHeros = {}
    },
    setData(heros){
        for (var i = 0; i < heros.length; i++) {
            var v = heros[i]
            this.vHeros[v.baseId] = v
            v.units.sort(function(a,b){
                return a.qualityId - b.qualityId
            })
            this.addExp(v.baseId,0)
            this.updateState(v)
        }
    },
    getVillaHeroData(baseId){
        var data = this.vHeros[baseId]
        if (data){
            return data
        }
    },
    addExp(baseId,exp){
        var vheroData = this.getVillaHeroData(baseId)
        vheroData.upPoints = vheroData.upPoints + exp
        if (vheroData.lv == null){
            vheroData.lv = 0
        }

        var resultData = {lastLv:vheroData.lv}

        var maxActiveQualityId = 0
        for (var i = 0; i < vheroData.units.length; i++) {
            if (vheroData.units[i].activation){
                maxActiveQualityId = vheroData.units[i].qualityId
            }
        }
        var heroConf = Gm.config.getHero(baseId,maxActiveQualityId)

        var tmpExp = vheroData.upPoints
        var confs = Gm.config.getHeroFeelByLv(baseId)
        for (var i = 0; i < confs.length; i++) {
            var v = confs[i]
            if (heroConf.quality >= v.quality){
                vheroData.lv = v.intimateLv
                vheroData.nowExp = tmpExp

                if (tmpExp - v.exp >= 0){
                    tmpExp = tmpExp - v.exp
                }else{
                    break
                }
            }
            
        }
        resultData.lv = vheroData.lv

        var maxData = confs[confs.length-1]
        vheroData.isMax = false
        if (vheroData.lv == maxData.intimateLv && vheroData.nowExp >= v.exp){
            vheroData.nowExp = v.exp
            vheroData.isMax = true
        }

        return resultData
    },
    addVillaQualityId(baseId,qualityId){
        var data = this.getVillaHeroData(baseId)
        if (data == null){
            data = {baseId:baseId,upPoints:0,units:[]}
            this.vHeros[baseId] = data
            this.addExp(baseId,0)
        }
        if (Func.forBy(data.units,"qualityId",qualityId) == null){
            var isActive = false
            for (var i = 0; i < data.units.length; i++) {
                if (data.units[i].activation && data.units[i].qualityId > qualityId){
                    isActive = true
                }
            }
            data.units.push({qualityId:qualityId,activation:isActive})
        }
        data.units.sort(function(a,b){
            return a.qualityId - b.qualityId
        })

        this.updateState(data)
    },
    getActiveQualityIds(showHeroList){
        var list = []
        for (var key in this.vHeros){
            var v = this.vHeros[key]

            var conf = Func.forBy(showHeroList,"id",v.baseId)
            if (conf && v.state == VillaFunc.HeroType.active){
                var qualityId = 0
                for (var i = 0; i < v.units.length; i++) {
                    if (v.units[i].activation && v.units[i].qualityId > qualityId){
                        qualityId = v.units[i].qualityId
                    }
                }
                if (qualityId > 0){
                    list.push({sort:conf.sort,qualityId:qualityId})
                }
            }
        }
        // list.sort((a,b)=>{
        //     return a.sort - b.sort
        // })
        return list
    },

    isCanActivityHero(){
        for(let i in this.vHeros){
            if (this.vHeros[i].state > 1){
                return true
            }
        }
        return false
    },

    getAllQuality(){
        var list = {}
        for (var key in this.vHeros){
            var v = this.vHeros[key]
            for (var i = 0; i < v.units.length; i++) {
                if (v.units[i].activation){
                    var heroConf = Gm.config.getHero(v.baseId,v.units[i].qualityId)
                    if (list[heroConf.quality] == null){
                        list[heroConf.quality] = 0
                    }
                    list[heroConf.quality] = list[heroConf.quality] + 1
                }
            }
        }
        return list
    },
    updateState(vHeroData){
        var nowQualityData = null
        var activeQualityId = 0
        if (vHeroData){
            for (var i = 0; i < vHeroData.units.length; i++) {
                var v = vHeroData.units[i]
                nowQualityData = v
                if (!v.activation){
                    break
                }
                if (v.activation && v.qualityId > activeQualityId){
                    activeQualityId = nowQualityData.qualityId
                }
            }
        }

        vHeroData.qualityId = nowQualityData.qualityId
        vHeroData.showQualityId = vHeroData.qualityId
        if (activeQualityId){
            vHeroData.showQualityId = activeQualityId
        }
        vHeroData.quality = Gm.config.getQulityHero(vHeroData.showQualityId).quality


        vHeroData.state = VillaFunc.HeroType.active

        if (nowQualityData && !nowQualityData.activation){
            if (nowQualityData && activeQualityId != 0 && nowQualityData.qualityId > activeQualityId){//再次激活
                vHeroData.state = VillaFunc.HeroType.up
            }else{//可激活(首次激活)
                vHeroData.state = VillaFunc.HeroType.unlock
            }
        }
    },
});
