cc.Class({
    extends: cc.Component,

    properties: {
        skillPerfab:cc.Prefab,
        skillNode:cc.Node,
        nameLab:cc.Label,
        descLab:cc.Label,
        jxLab:cc.Label,
    },
    setUnlock:function(heroData,conf){
        if (conf){
            if (heroData && heroData.awakenStage >= conf.awakenStage){
                if (this.data.type == 1){
                    this.jxLab.string = Ls.get(400001) + this.data.consumeMp
                }else{
                    this.jxLab.string = ""
                }
            }else{
                this.jxLab.string = cc.js.formatStr(Ls.get(400002),conf.awakenStage)
            }
        }else{
            this.jxLab.string = Ls.get(400003)
        }
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        this.nameLab.string = data.name
        this.descLab.string = data.detailed
        

        var tmpPage = cc.instantiate(this.skillPerfab)
        tmpPage.parent = this.m_oSBNode
        this.skillNode.addChild(tmpPage)
        var tmpSpt = tmpPage.getComponent("SkillBase")
        tmpSpt.setOwner(this,data,false)
        this.jxLab.string = ""
        
        // var self = this
        // Gm.load.loadSpriteFrame("texture/skill/"+data.picture,function(sp){
        //     self.getComponent(cc.Sprite).spriteFrame = sp
        // })
    },
    onSkillClick:function(destData){
        // console.log("点击到了",destData)
        if (this.m_oOwner && this.m_oOwner.onCellClick){
            this.m_oOwner.onCellClick(destData)
        }
    },
});

