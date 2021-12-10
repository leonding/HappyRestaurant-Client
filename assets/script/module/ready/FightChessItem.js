
var textColor = "<outline color='#152F40'><color=#CCE8FF>%s</c><color=#FE4648>%s</c></outline>"
cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        richs:{
            default: [],
            type: cc.RichText,
        },
        descNode:cc.Node,
    },
    setData:function(heroId,skills,owner){
        this.heroId = heroId
        this.owner = owner
        this.skills = skills

        this.heroData = Gm.pictureData.getHero(heroId,this.owner.openData.treasure)

        Func.newHead2(this.heroData.baseId,this.headNode,this.heroData.qualityId)
        //,this.heroData.level

        skills.sort(function(a,b){
            return a-b
        })
        for (let index = 0; index < this.richs.length; index++) {
            const v = this.richs[index];
            var skillId = skills[index]

            if (skillId){
                var skillConf = Gm.config.getSkill(skillId)
                v.string = skillConf.detailed
            }else{
                v.string = ""
            }
        }
        this.descNode.active = skills.length == 0
    },
    onHelpClick(){
        if(this.skills.length ==0){
            return
        }
        this.owner.openTips(this.heroData,this.skills)
    },
});


