// ExcSkillCell

cc.Class({
    extends: cc.Component,

    properties: {
        m_oSkillBase:cc.Node,
        m_oSkillPerfab:cc.Prefab,
        m_oSkillName:cc.Label,
        m_oActNode:cc.Node,
        m_oPasNode:cc.Node,
        m_oSkillInfo1:cc.RichText,
        m_oSkillInfo2:cc.RichText,
    },
    onLoad(){
       
    },
    setUI(data){
        this.m_oSkillName.string = data.name
        this.m_oSkillInfo1.string =  data.detailed.replace(/<color=\#[a-fA-F0-9]{6}>/,"<color=#FFFFFF>")
        if(data.rearID){
            var conf = Gm.config.getSkill(data.rearID)
            this.m_oSkillInfo2.string = cc.js.formatStr(Ls.get(417),conf.skillLevle,conf.quality,conf.detailed)
        }else{
            this.m_oSkillInfo2.string = Ls.get(418)
        }

        if (data.type == 1){
            this.m_oActNode.active = true
        }else{
            this.m_oPasNode.active = true
        }
        setTimeout(() => {
            if(this.node && this.node.isValid){
                Func.destroyChildren(this.node.parent.parent.getChildByName("headNode"))
                this.node.parent.height = this.node.height
                var tmpPage = cc.instantiate(this.m_oSkillPerfab)
                tmpPage.parent = this.node.parent.parent.getChildByName("headNode")
                tmpPage.y = this.node.height/2 + 15
                tmpPage.x = -272
                this.skillBaseJs = tmpPage.getComponent("SkillBase")
                this.skillBaseJs.setOwner(this,data,false)
                this.skillBaseJs.setSetLevel(data.skillLevle)
                this.skillBaseJs.m_oLayNode.getChildByName("need").getComponent(cc.Label).fontSize = 22
            }
        }, 0.01);
       
    },
});

