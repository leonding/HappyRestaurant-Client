var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,

    properties: {
        //武器名称等
        equipInfoNode:cc.Node,
        itemNode:cc.Node,
        nameLab:cc.Label,
        zyLab:cc.Label,
        scoreLab:cc.Label,
        m_oExcWeaponItem:cc.Prefab,

        //攻击力防御力等
        primarysNode:cc.Node,
        
        //专属技能
        excSkillCell:cc.Prefab,
        excSkillNode:cc.Node,

        //解锁的技能
        excSkills:cc.Node,

        upgradeBtn:cc.Node,
        yokeRedNode:cc.Node,

        resetBtn:cc.Node,
        maxLevelSprite:cc.Node,
    },
    onLoad () {
        this._super()
        var item = cc.instantiate(this.excSkillCell)
        this.excSkillNode.addChild(item)
        this.excSkillJs = item.getComponent("ExcSkillCell")
    },
    register(){
        this.events[Events.UPDATE_EXCWEAPON_LEVEL] = this.updateLevel.bind(this)
    },
    enableUpdateView(args){
        if (args){
            this.hero = args.hero
            this.backView = args.backView
            this.enterName = args.enterName
            Gm.red.add(this.yokeRedNode,"heroExcWeaponRed",this.hero.heroId)
            Gm.red.add(this.upgradeBtn,"heroExcWeapon",this.hero.heroId)
            this.weaponLevel = this.getWeaponLevel()
            this.getConfig(this.hero.baseId,this.weaponLevel)
            this.oldYokeKey = Gm.userInfo.id + "" + args.hero.heroId + "oldYokeMinLevel"
            this.setUI()
        }
    },
    updateLevel(){
        this.weaponLevel = this.getWeaponLevel()
        this.getConfig(this.hero.baseId,this.weaponLevel)
        this.setUI()
    },
    setUI(){
        this.setEquipInfo()
        this.setPrimarysNode()
        this.setExcSkillNode()
        this.setExcSkills()
        this.hideBtns()
    },
    isInArray(array,ids){
        for(var i=0;i<array.length;i++){
            if(array[i] == ids){
                return true
            }
        }
        return false
    },
    getWeaponLevel(){
        if(this.isOther()){
            return Gm.friendData.getWeaponLevel(this.hero)
        }
        return Gm.heroData.getWeaponLevel(this.hero.heroId)
    },
    getConfig(heroId,level){
        this.heroConfig = Gm.config.getKeyById("HeroConfig","id",heroId)
        this.weaponDescConfig = Gm.config.getWeaponDescConfig(this.heroConfig.weaponId)
        this.weaponUpLevelConfig = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,level)
        this.equipSkillConfig = Gm.config.getSkill(this.weaponUpLevelConfig.skill[0].ID)
        this.yokeMinLevel = ExcWeaponFunc.getYokeMinLevel(this.hero.baseId,this.hero.heroId,this.isOther(),this.hero)
        if(this.yokeMinLevel){
             this.yokeMinConfig = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,this.yokeMinLevel)
        }
    },  
    setEquipInfo(){
        this.nameLab.string = this.weaponDescConfig.name + "Lv." +this.weaponLevel
        this.zyLab.string =this.weaponDescConfig.info
        this.scoreLab.string = ExcWeaponFunc.getFightValue(this.weaponUpLevelConfig.baseAttr)

        if(!this.excWeaponitemSp){
                var item = cc.instantiate(this.m_oExcWeaponItem)
                this.itemNode.addChild(item)
                this.excWeaponitemSp = item.getComponent("ExcWeaponItem")
        }
        this.excWeaponitemSp.setUI({picture: this.weaponDescConfig.icon,level:this.weaponLevel})
    },
    setPrimarysNode(){
        for(var i=0;i<4;i++){
             var baseNode = this.primarysNode.getChildByName("node" + (i+1))
             if(this.weaponUpLevelConfig.baseAttr[i]){
                  baseNode.active = true
                  var attrData =this.weaponUpLevelConfig.baseAttr[i]
                  var nameStr = EquipFunc.getBaseIdToName(attrData.id)
                  baseNode.getChildByName("lab1").getComponent(cc.Label).string = nameStr
                  baseNode.getChildByName("lab2").getComponent(cc.Label).string = EquipFunc.getBaseIdToNum(attrData.id,attrData.vaule)
                  baseNode.getChildByName("lab2").color = new cc.Color(255,255,255)

                    if(this.yokeMinConfig){
                        var key = false
                        for(var j=0;j<this.yokeMinConfig.effect.length;j++){
                            var conf = Gm.config.getBaseAttr(this.yokeMinConfig.effect[j].id,this.yokeMinConfig.effect[j].vaule)
                            if(conf.precentToBase == attrData.id){
                                baseNode.getChildByName("lab3").getComponent(cc.Label).string = "+" + EquipFunc.getBaseIdToNum(this.yokeMinConfig.effect[j].id,this.yokeMinConfig.effect[j].vaule)
                                key = true
                            }
                        }
                        baseNode.getChildByName("lab3").active = key
                    }
                    else{
                         baseNode.getChildByName("lab3").active = false
                    }
                    if(this.isArenaView()){
                         baseNode.getChildByName("lab3").active = false
                    }
             }
             else{
                 var config = Gm.config.getWeaponUpLevelBaseAttrMinLevel(i+1)
                 if(config){
                      baseNode.active = true
                      var attrData =config.baseAttr[config.baseAttr.length-1]
                      baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.id)
                      baseNode.getChildByName("lab2").getComponent(cc.Label).string =   cc.js.formatStr( Ls.get(7200031),"Lv." + config.level)
                      baseNode.getChildByName("lab2").color = new cc.Color(68,56,38)
                      baseNode.getChildByName("lab3").active = false
                 }
                 else{
                      baseNode.active = false
                 }
             }
        }
    },
    setExcSkillNode(){
        this.excSkillJs.setUI(this.equipSkillConfig)
    },
    setExcSkills(){
        var levelArray = ExcWeaponFunc.getOpenSkillLevelArray()
        for(var i=0;i<4;i++){
            var item = this.excSkills.getChildByName("infoNode" +(i+1))
            item.getChildByName("titleNode").getChildByName("titleLabel").getComponent(cc.Label).string = cc.js.formatStr(Ls.get(7200001),levelArray[i]) 
            var key =  levelArray[i] <= this.weaponLevel
            item.getChildByName("titleNode").getChildByName("selectSprite").active =key
            var config = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,levelArray[i])
            var config1 = Gm.config.getSkill(config.skill[0].ID)
            item.getChildByName("infoLabel").getComponent(cc.RichText).string =  ExcWeaponFunc.getSkillDetailStr(config1,key)
        }
    },
    isOther(){
        if (this.hero && Gm.heroData.getHeroById(this.hero.heroId) == null || this.isArenaView()){
            return true
        }
        return false
    },
    isArenaView(){
        return this.enterName == "ArenaView"
    },
    hideBtns(){
        if(this.isOther()){
            this.upgradeBtn.active = false
            this.resetBtn.active = false
            this.maxLevelSprite.active = false
        }
        else{
             if(this.weaponLevel == 1){
                this.resetBtn.active = false
            }
            else{
                this.resetBtn.active = true
            }

            var maxLevel = Gm.config.getWeaponMaxLevel()
            if(this.weaponLevel == maxLevel){
                this.maxLevelSprite.active = true
                this.upgradeBtn.active = false
            }
            else{
                this.maxLevelSprite.active = false
                this.upgradeBtn.active = true
            }
        }
        if(this.isArenaView()){
            this.yokeRedNode.active  =false
        }
    },
    onTopBtnClick(sender,value){
        if(value == 0){
            if(this.weaponLevel>1){
                Gm.ui.create("ExcWeaponReLevel",{hero:this.hero,weaponLevel:this.weaponLevel})
            }
        }
        else if(value == 1){
             cc.sys.localStorage.setItem(this.oldYokeKey, this.yokeMinLevel || 0)
             Gm.red.refreshEventState("heroExcWeaponRed")
             Gm.ui.create("ExcWeaponYokeView",{hero:this.hero,weaponLevel:this.weaponLevel})
        }
    },
    onUpgradeClick(){
        Gm.ui.create("ExcWeaponUpgradeView",{hero:this.hero,weaponLevel:this.weaponLevel})
    },
    onBack(){
        this._super()
        if(this.backView){
            Gm.ui.create(this.backView,{baseId:this.hero.baseId})
        }
    }
});

