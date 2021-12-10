var BaseView = require("BaseView")

cc.Class({
    extends: BaseView,
    properties: {
        //武器名称等
        equipInfoNode:cc.Node,
        itemNode1:cc.Node,
        itemNode2:cc.Node,
        m_oExcWeaponItem:cc.Prefab,

        //攻击力防御力等
        primarysNode:cc.Node,

        //下一个等级解锁的技能
        skillNode:cc.Node,
        skillNodeSprite:cc.Node,

        //消耗
        costNode:cc.Node,
        costItemNode:cc.Node,

        upgradeBtn:cc.Node,
    },
    onLoad () {
        this._super()
    },
    register(){
        this.events[Events.UPDATE_EXCWEAPON_LEVEL] = this.updateLevel.bind(this)
    },
    enableUpdateView(args){
        if (args){
            this.hero = args.hero
            this.weaponLevel = args.weaponLevel
            Gm.red.add(this.upgradeBtn,"heroExcWeapon",this.hero.heroId)
            this.getConfig(this.hero.baseId,this.weaponLevel)

            this.setEquipInfo()
            this.setPrimarysNode()
            this.setExcSkillNode()
            this.setConstNode()

            if(this.isOther()){
                this.upgradeBtn.active = false
            }
        }
    },
    updateLevel(){
        this.weaponLevel = this.getWeaponLevel()
            
        this.getConfig(this.hero.baseId,this.weaponLevel)

        this.setEquipInfo()
        this.setPrimarysNode()
        this.setExcSkillNode()
        this.setConstNode()
    },
    getWeaponLevel(){
        if(this.isOther()){
            return Gm.friendData.getWeaponLevel(this.hero)
        }
        return Gm.heroData.getWeaponLevel(this.hero.heroId)
    },
    isOther(){
        if (this.hero && Gm.heroData.getHeroById(this.hero.heroId) == null){
            return true
        }
        return false
    },
    getConfig(heroId,level){
        this.heroConfig = Gm.config.getKeyById("HeroConfig","id",heroId)
        this.weaponDescConfig = Gm.config.getWeaponDescConfig(this.heroConfig.weaponId)
        this.weaponUpLevelConfig = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,level)
        this.equipSkillConfig = Gm.config.getSkill(this.weaponUpLevelConfig.skill[0].ID)

        var config = Gm.config.getHero(this.hero.baseId)
        var maxLevel = Gm.config.getWeaponMaxLevel()
        this.nextLevel = Math.min(maxLevel,level +1)
        this.nextLevelCostConfig = Gm.config.getWeaponCostConfig(this.nextLevel ,config.camp)
    },  
    setEquipInfo(){
        if(!this.excWeaponitemSp){
                var item = cc.instantiate(this.m_oExcWeaponItem)
                this.itemNode1.addChild(item)
                this.excWeaponitemSp = item.getComponent("ExcWeaponItem")
        }
        this.excWeaponitemSp.setUI({picture:this.weaponDescConfig.icon,level:this.weaponLevel})

        if(!this.excWeaponitemSp1){
                var item = cc.instantiate(this.m_oExcWeaponItem)
                this.itemNode2.addChild(item)
                this.excWeaponitemSp1 = item.getComponent("ExcWeaponItem")
        }
        this.excWeaponitemSp1.setUI({picture:this.weaponDescConfig.icon,level:this.nextLevel})
    },
    setPrimarysNode(){
        var config = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,this.weaponLevel+1)
        if(config){
            ExcWeaponFunc.setPrimarysNode(this.primarysNode,this.weaponUpLevelConfig.baseAttr,config.baseAttr)
        }
        else{
            ExcWeaponFunc.setPrimarysNode(this.primarysNode,this.weaponUpLevelConfig.baseAttr)
        }

          for(var i=0;i<4;i++){
             var baseNode = this.primarysNode.getChildByName("node" + (i+1))
             if(baseNode.active){
                   baseNode.getChildByName("lab2").color = new cc.Color(255,255,255)
                   baseNode.getChildByName("lab2").getChildByName("arrow").getChildByName("New Label").color = new cc.Color(0,255,0)
             }
             else{
                 var config = Gm.config.getWeaponUpLevelBaseAttrMinLevel(i+1)
                 if(config){
                      baseNode.active = true
                      var attrData =config.baseAttr[config.baseAttr.length-1]
                      baseNode.getChildByName("lab1").getComponent(cc.Label).string = EquipFunc.getBaseIdToName(attrData.id)
                      baseNode.getChildByName("lab2").getComponent(cc.Label).string =  cc.js.formatStr( Ls.get(7200031),"Lv." + config.level)
                      baseNode.getChildByName("lab2").color = new cc.Color(68,56,38)
                 }
                 else{
                      baseNode.active = false
                 }
             }
        }
    },
    setExcSkillNode(){
        var item = this.skillNode
        var array = ExcWeaponFunc.getOpenSkillLevelArray()
        var showLevel = this.weaponLevel
        if(showLevel <= array[0]){
            showLevel = array[0]
        }
        else if(showLevel <= array[1]){
            showLevel = array[1]
        }
        else if(showLevel <= array[2]){
            showLevel = array[2]
        }
        else{
            showLevel = array[3]
        }

        var config1 = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(this.heroConfig.weaponId,showLevel)
        var skillConfig1 =  Gm.config.getSkill(config1.skill[0].ID)
        item.getChildByName("titleNode").getChildByName("titleLabel").getComponent(cc.Label).string =  cc.js.formatStr( Ls.get(7200010),"Lv." +  showLevel)
        
        var key = false
        if(ExcWeaponFunc.isInArray(array,this.weaponLevel)){
             key = true
        }
        this.skillNodeSprite.active = key
        item.getChildByName("infoLabel").getComponent(cc.RichText).string = ExcWeaponFunc.getSkillDetailStr(skillConfig1,key)
    },
    getMinSkill(skillId){
        var  data = Gm.config.getConfig("WeaponUpLevelConfig")
        for(var i=0;i<data.length;i++){
            if(data[i].skill[0].ID ==skillId){
                return data[i]
            }
        }
        return null
    },
    setConstNode(){
        Func.destroyChildren(this.costNode)
        var maxLevel = Gm.config.getWeaponMaxLevel()
        if(this.weaponLevel == maxLevel){
            return
        }
        for(var i=0;i< this.nextLevelCostConfig.cost.length;i++){
            var itemData = this.nextLevelCostConfig.cost[i]
            var item = cc.instantiate(this.costItemNode)
            item.active = true
            this.costNode.addChild(item)
            var itemJs = Gm.ui.getNewItem(item.getChildByName("costItemNode"),true)
            itemJs.setData(itemData)
            itemJs.setLabStr("")

            var costLabel = item.getChildByName("costLabelNode").getChildByName("costLabel").getComponent(cc.Label)
            var totalLabel = item.getChildByName("costLabelNode").getChildByName("totalLabel").getComponent(cc.Label)
            var hasNum = 0
            if (itemData.type == ConstPb.itemType.PLAYER_ATTR){
                hasNum = Gm.userInfo.getDataBy(itemData.id)
            }else if (itemData.type == ConstPb.itemType.TOOL){
                hasNum = 0
                var pro = Gm.bagData.getItemByBaseId(itemData.id)
                if (pro != null){
                    hasNum = pro.count
                }
            }else if(itemData.type == ConstPb.itemType.ROLE){
                var heros = Gm.heroData.getHerosByQualityId(itemData.id)
                hasNum = heros.length
                item.getChildByName("costItemNode").scale = 1.05
            }
            costLabel.string = "/" + Func.transNumStr(itemData.num)
            totalLabel.string =  Func.transNumStr(hasNum)
            if(hasNum >= itemData.num){
                 costLabel.node.color = cc.color(255,255,255)
            }
            else{
                 costLabel.node.color = cc.color(255,0,0)
            }
        }
    },
    onUpGradeClick(){
        //最大
        var maxLevel = Gm.config.getWeaponMaxLevel()
        if(this.weaponLevel == maxLevel){
            Gm.floating(Ls.get(2322))
            return
        }
        //星限制
        var weaponLevel = Gm.heroData.getWeaponLevel(this.hero.heroId)
        var quality = ExcWeaponFunc.getWeaponOpenQuility()
        var q = this.hero.qualityId % 100
        var maxLevelNum = (q - quality) * 10
        if(weaponLevel == maxLevelNum){
            Gm.floating(Ls.get(7200012))
            return
        }
        //消耗材料
        for(var i=0;i<this.nextLevelCostConfig.cost.length;i++){
            var itemData = this.nextLevelCostConfig.cost[i]
            if(!Gm.userInfo.checkCurrencyNum({attrId:itemData.id,num:itemData.num})){
                return
            }
        }
        //发送消息
        Gm.heroNet.excWeaponUpgrade(this.hero.heroId)
        if(this.weaponLevel + 1 == maxLevel){
            this.onBack()
        }
    }
});