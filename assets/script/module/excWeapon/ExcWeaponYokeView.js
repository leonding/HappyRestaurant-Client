var BaseView = require("BaseView")


cc.Class({
    extends: BaseView,
     properties: {
         //头部
         heroNode:cc.Node,
         weaponNode:cc.Node,

        //中间
        contentNode1:cc.Node,

        //底部
        titleLabel:cc.Label,
        infoNode:cc.Node,

        weaponItem:cc.Prefab,
     },
     onLoad(){
         this.popupUIData = {title:5196}
         this._super()
     },
    enableUpdateView(args){
        if (args){
            this.hero = args.hero
            this.weaponLevel = args.weaponLevel
            this.yokeConfig = Gm.config.getFaZhenYokeByWid(this.hero.baseId)
            this.setTopNode()
            this.setContentNode()
            this.setSkillNode()
        }
    },
    setTopNode(){
        this.setHeroNode(this.heroNode,this.hero)
        this.setWeaponNode(this.weaponNode,this.hero.baseId,this.weaponLevel)
    },
    setHeroNode(node,data,flag){
        var itemJs = Gm.ui.getNewItem(node,true)
        itemJs.updateHero(data)
        if(this.yokeConfig.type == 2){
            var config = Gm.config.getHero(data.baseId)
            itemJs.getBaseClass().showJob(config.job)
        }
        if(flag !=null){
            itemJs.setGray(flag)
        }
    },
    setWeaponNode(parent,baseId,level,flag){
        var item = cc.instantiate(this.weaponItem)
        item.scale = parent.width / item.width
        parent.addChild(item)
        item.getComponent("ExcWeaponItem").setUI(ExcWeaponFunc.getExcWeaponIconInfo(baseId,level))
         if(flag !=null){
            item.getComponent("ExcWeaponItem").setLock(flag)
            var heroConfig = Gm.config.getKeyById("HeroConfig","id",baseId)
            if(!heroConfig.weaponId){
                item.getComponent("ExcWeaponItem").setCallback(this.onWeaponClick.bind(this),baseId)
            }
        }
    },
    onWeaponClick(baseId){
        var heroConfig = Gm.config.getKeyById("HeroConfig","id",baseId)
        Gm.floating(cc.js.formatStr(Ls.get(7200029),heroConfig.name))
    },
    getYokeData(){
        var yokeConfig = Gm.config.getFaZhenYoke()
        var config = null
        for(var i=0;i<yokeConfig.length;i++){
            if(yokeConfig[i].wid == this.hero.baseId && yokeConfig[i].type == 3){
                return yokeConfig[i].condition
            }
        }
       return null
    },
    getHero(baseId){
        var heros = Gm.heroData.getHerosByBaseId(baseId)
        if(heros.length>0){
            heros.sort(function(a,b){
                return b.qualityId - a.qualityId
            })
            return {hero:heros[0],flag:false}
        }
        var hero = {}
        hero.baseId=baseId
        hero.qualityId = parseInt(baseId + "111")
        hero.level = 240
        return {hero:hero,flag:true}
    },
    setContentNode(){
        var heros = ExcWeaponFunc.getYokeHerosNew(this.hero.baseId,this.hero.heroId)
         var theroConfig =Gm.config.getHero(this.hero.baseId)
         var nameStr = "[" + theroConfig.name + "]"
          for(var i=0;i<2;i++){
                var item = this.contentNode1.getChildByName("itemNode" + (i+1))
                if(heros && heros[i]){
                    item.active = true

                    this.setHeroNode(item.getChildByName("heroNode"),heros[i],!heros[i].hasFlag)
                    if(heros[i].hasFlag){//有英雄
                        var hasWeapon = Gm.heroData.hasWeapon(heros[i].heroId)
                        var level = 1
                        if(hasWeapon){
                            level = Gm.heroData.getWeaponLevel(heros[i].heroId)
                        }
                        this.setWeaponNode(item.getChildByName("weaponNode"),heros[i].baseId,heros[i].weaponLv || 1,!hasWeapon)
                    }
                    else{//没有英雄
                        this.setWeaponNode(item.getChildByName("weaponNode"),heros[i].baseId,heros[i].weaponLv || 1,true)
                    }

                    var config = Gm.config.getHero(heros[i].baseId)
                    nameStr = nameStr + "[" + config.name + "]"
                }
                else{
                    item.active = false
                }
          }
        
        var str = ""
        if(this.yokeConfig.type == 1){
            str = Ls.get(7200027)
        }
        else if(this.yokeConfig.type == 2){
            str = Ls.get(7200028)
        }
        else if(this.yokeConfig.type == 3){
            str = cc.js.formatStr( Ls.get(7200009),nameStr)
        } 
        this.contentNode1.getChildByName("titleLabel").getComponent(cc.Label).string =  str
    },
    setSkillNode(){
        var levelArray = ExcWeaponFunc.getOpenYokeLevelArray()
        var minLevel = ExcWeaponFunc.getYokeMinLevel(this.hero.baseId,this.hero.heroId,this.isOther(),this.hero)
        for(var i=0;i<3;i++){
            var item = this.infoNode.getChildByName("infoNode" +(i+1))
            item.getChildByName("titleNode").getChildByName("titleLabel").getComponent(cc.Label).string =  cc.js.formatStr(Ls.get(7200010),"Lv." + levelArray[i])
            var key = minLevel>= levelArray[i]
            item.getChildByName("titleNode").getChildByName("selectSprite").active = key
            var config = Gm.config.getKeyById("HeroConfig","id",this.hero.baseId)
            var config = Gm.config.getWeaponUpLevelConfigByWeaponAndLevel(config.weaponId,levelArray[i])
            item.getChildByName("infoLabel").getComponent(cc.Label).string = config.desc
            item.getChildByName("infoLabel").color = ExcWeaponFunc.getOpenYokeStrColor(key)
        }
    },
    isOther(){
        if (this.hero && Gm.heroData.getHeroById(this.hero.heroId) == null){
            return true
        }
        return false
    },
});