var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    register:function(){
        this.events[Events.LOGIN_SUC]        = this.onLoginSuc.bind(this)
        this.events[MSGCode.OP_VILLA_BOOKS_S] = this.onNetVillaBooks.bind(this)
        this.events[MSGCode.OP_VILLA_FEEL_S] = this.onNetVillaFeel.bind(this)
        this.events[MSGCode.OP_VILLA_ACT_S] = this.onNetVillaAct.bind(this)
    },
    onNewDay(){
    },
    onLoginSuc:function(args){
        Gm.villaData.clearData()
        Gm.villaNet.get()
    },
    onNetVillaBooks:function(args){
        // Gm.red.refreshEventState("towerBox")
        Gm.villaData.setData(args.heroBooks)
        Gm.red.refreshEventState("villa")
    },
    onNetVillaFeel:function(args){
        args.baseId = Gm.villaNet.baseId
        args.itemId = Gm.villaNet.itemId

       

        var vHeroData = Gm.villaData.getVillaHeroData(args.baseId)
        var heroConf = Gm.config.getHero(args.baseId,vHeroData.showQualityId)
        var itemConf = Gm.config.getItem(args.itemId)

        var addExp = itemConf.train_exp

        if (Func.forBy(heroConf.likesItems,"id",args.itemId)){
            addExp = addExp + Gm.config.getConst("hero_other_intimate_" + itemConf.quality)
        }
        
        var feelConf = Gm.config.getHeroFeelByLv(args.baseId,vHeroData.lv)

        var maxExp = VillaFunc.getMaxExpByQuality(heroConf.idGroup,heroConf.quality)
        if (vHeroData.upPoints +  addExp > maxExp){
            addExp = maxExp - vHeroData.upPoints
        }

        var lvData = Gm.villaData.addExp(args.baseId,addExp)
        if (lvData.lastLv != lvData.lv){
            var lastConf = Gm.config.getHeroFeelByLv(args.baseId,lvData.lastLv)
            var conf = Gm.config.getHeroFeelByLv(args.baseId,lvData.lv)

            this.showHeroAttr(conf.Property,lastConf.Property)
        }
    },
    showHeroAttr(nowList,lastList){
        var attrList = []
        for (var i = 0; i < nowList.length; i++) {
            var v = nowList[i]
            var lastAttr = Func.forBy(lastList,"id",v.id)
            var dd = {attrId:v.id,attrValue:v.num}
            if (lastAttr){
                dd.attrValue = dd.attrValue - lastAttr.num
            }
            if (dd.attrValue > 0){
                attrList.push(dd)
            }
        }
        if (attrList.length > 0){
            Gm.showHeroAttr({fight:0,lastFight:0,attrList:attrList})
        }
    },
    onNetVillaAct:function(args){
        var conf = Gm.config.getQulityHero(args.qualityId)
        args.baseId = conf.idGroup
        var vHeroData = Gm.villaData.getVillaHeroData(args.baseId)

        var lastQualityId = 0
        for (var i = 0; i < vHeroData.units.length; i++) {
            var v = vHeroData.units[i]
            if (v.activation){
                lastQualityId = v.qualityId
            }
        }
        var vQualityData = Func.forBy(vHeroData.units,"qualityId",args.qualityId)
        vQualityData.activation = true

        var lastList = []
        if (lastQualityId){
            lastList = Gm.config.getHero(vHeroData.baseId,lastQualityId).activationProperty
        }
        var nowList = Gm.config.getHero(vHeroData.baseId,args.qualityId).activationProperty

        this.showHeroAttr(nowList,lastList)

        Gm.villaData.updateState(vHeroData)

         Gm.red.refreshEventState("villa")
    },

});
