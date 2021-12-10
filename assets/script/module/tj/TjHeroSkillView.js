var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        heroSkillPre: cc.Prefab,
        defNode:cc.Node,
    },
    onLoad:function(){
        this._super()
        this.skills = []
        for (let index = 0; index < 4; index++) {
            var itemNode = cc.instantiate(this.heroSkillPre)
            this.node.getChildByName("itemNode" + (index+1)).addChild(itemNode) 
            var sp = itemNode.getComponent("HeroSkillItem")
            this.skills.push(sp)
        }
    },
    enableUpdateView:function(args){
        if (args){
            this.baseId = args
            this.updateView()
        }
    },
    updateView:function(){
        var heroConf = Gm.config.getHero(this.baseId)
       
        var uSkills = Gm.config.getUnlockSkills(heroConf.quality)
        if (heroConf.default_skill != uSkills[0].awaken_skill){
            uSkills.unshift({id:0,awakenStage:0,awaken_skill:heroConf.default_skill})
        }

        for (const key in this.skills) {
            const v = this.skills[key];
            v.node.active = false
        }
        var skillConfs = []
        for (let index = 1; index <= 4; index++) {
            if (heroConf["skillId" + index] > 0 ){
                var conf = Gm.config.getSkill(heroConf["skillId" + index])
                conf.skillIndex = index
                if (conf.type == 1){
                    skillConfs.unshift(conf)
                }else{
                    skillConfs.push(conf)
                }
            }
        }
        var heroData = Gm.heroData.getHeroByBaseId(this.baseId)
        var yy = 256
        var defFlag = true
        this.defNode.active = false
        for (let index = 0; index < skillConfs.length; index++) {
            const conf = skillConfs[index];
            const item = this.skills[index];
            item.node.active = true
            item.setData(conf,this)
            var unlockConf = Func.forBy(uSkills,"awaken_skill",conf.skillIndex)
            item.setUnlock(heroData,unlockConf)
            this.node.getChildByName("itemNode" + (index+1)).y = yy
            if (defFlag && conf.type == 2){
                defFlag = false
                this.defNode.active = true
                this.defNode.y =yy+40
                yy = yy - 50
                this.node.getChildByName("itemNode" + (index+1)).y = yy
            }
            yy = yy - 130
        }
    },
});

