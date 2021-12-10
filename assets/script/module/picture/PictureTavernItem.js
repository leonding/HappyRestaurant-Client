cc.Class({
    extends: cc.Component,

    properties: {
        itemNode:cc.Node,
        fightLab:cc.Label,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        if (this.itemBase == null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.node.scale = this.itemNode.width/this.itemBase.node.width
            this.itemBase.updateHero(data)
            this.itemBase.setTips(false)
        }
        this.fightLab.string = data.fight
    },
    onOkBtn(){
        if (this.itemBase.getBaseClass().isReady()){
            this.owner.onItemClick()
            return    
        }
        this.owner.onItemClick(this)
    },
    onLookInfo(){
        var unlockLevel = Gm.config.getConst("unlock_level").split("|")
        var heroConf = Gm.config.getHero(0,this.data.qualityId)
        var unlockSkill = []
        for(const i in unlockLevel){
            if (this.data.level >= unlockLevel[i]){//没到等级
                var skillId = heroConf.passive_skills[i]
                if (Func.indexOf(heroConf.masterySkill,skillId) >=0){
                    unlockSkill.push(skillId)
                }
            }
        }

        this.data.unlockSkillList = unlockSkill
        this.data.skillList = unlockSkill
        
        Gm.ui.create("TeamListView",{isOther:true,heroData:Gm.heroData.toHeroInfo(this.data)})
        this.owner.onBack()
    },
});

