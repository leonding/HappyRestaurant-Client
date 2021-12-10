var BaseView = require("BaseView")
// OtherSkillView
cc.Class({
    extends: BaseView,
    properties: {
        heroSkillPre: cc.Prefab,
        beidong:cc.Node,
        zhudong:cc.Node,
    },
    onLoad:function(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.m_oData = args
            this.updateView()
        }
    },
    updateView:function(){
        var heroConf = Gm.config.getHero(this.m_oData.baseId)
        var skillList = []
        skillList.push({type:2,id:heroConf["skillId1"]})
       
        var uSkills = Gm.config.getUnlockSkills(heroConf.quality)
        for(const i in uSkills){
            if (uSkills[i].awaken_skill && uSkills[i].awakenStage <= this.m_oData.awakenStage){
                skillList.push({type:2,id:heroConf["skillId" + uSkills[i].awaken_skill]})
            }
        }
        for(const i in this.m_oData.skillList){
            skillList.push({type:1,id:this.m_oData.skillList[i]})
        }
        for(const i in skillList){
            var conf = Gm.config.getSkill(skillList[i].id)
            var itemNode = cc.instantiate(this.heroSkillPre)
            if (skillList[i].type == 1){
                this.zhudong.addChild(itemNode)
            }else{
                this.beidong.addChild(itemNode)
            }
            var sp = itemNode.getComponent("HeroSkillItem")
            sp.setData(conf,this)
        }

        // for (let index = 0; index < skillConfs.length; index++) {
        //     const conf = skillConfs[index];
        //     const item = this.skills[index];
        //     item.node.active = true
        //     item.setData(conf,this)
        //     var unlockConf = Func.forBy(uSkills,"awaken_skill",conf.skillIndex)
        //     item.setUnlock(heroData,unlockConf)
        //     this.node.getChildByName("itemNode" + (index+1)).y = yy
        //     if (defFlag && conf.type == 2){
        //         defFlag = false
        //         this.defNode.active = true
        //         this.defNode.y =yy+40
        //         yy = yy - 50
        //         this.node.getChildByName("itemNode" + (index+1)).y = yy
        //     }
        //     yy = yy - 130
        // }
    },
});

