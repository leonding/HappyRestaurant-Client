// SkillSetCell
const base_hei = 123
cc.Class({
    extends: cc.Component,

    properties: {
        m_oSBNode:cc.Node,
        m_oNameLab:cc.Label,
        m_oInfoBack:cc.Node,
        m_oInfoLab:cc.RichText,
        m_oFixNode:cc.Node,

        m_oLevelBack:cc.Node,
        m_oLevelLab:cc.RichText,

        m_oActNode:cc.Node,
        m_oPasNode:cc.Node,

        m_oNoneBack:cc.Node,

        m_oSkillPerfab:cc.Prefab,
    },
    onLoad(){
        Func.destroyChildren(this.m_oSBNode)
        var tmpPage = cc.instantiate(this.m_oSkillPerfab)
        tmpPage.parent = this.m_oSBNode
        this.m_oPageSpt = tmpPage.getComponent("SkillBase")
        
    },
    setIdx:function(idx){
        this.m_iGroupIdx = idx
        if (this.m_oFixNode && !idx){
            this.m_iInfoLabHei = 0
            this.m_iLevelLabHei = 0
        }
    },
    setOwner:function(destOwner,data){
        // this.m_oLockSpr.active = (data == null)
        this.m_oOwner = destOwner
        this.m_oData = data
        if (data){
            if (this.m_oInfoBack){
                this.m_oInfoBack.active = true
            }
            this.m_oNoneBack.active = false
            this.m_oNameLab.string = data.name
            this.m_oInfoLab.string = data.detailed
            // this.m_oLevelLab.string = data.skillLevle

            this.m_oPageSpt.setOwner(this,data,false)
            if (!this.m_iGroupIdx){
                if (data.type == 1){
                    this.m_oActNode.active = true
                    this.m_oActNode.width = this.m_oActNode.getChildByName("m_oActLab").width
                    var uniqueSkillSpr = this.m_oActNode.parent.getChildByName("unique_skill")
                    if(uniqueSkillSpr){
                        uniqueSkillSpr.active = true
                    }
                }else{
                    this.m_oPasNode.active = true
                    this.m_oPasNode.width = this.m_oPasNode.getChildByName("m_oPasLab").width
                }
                this.m_oPageSpt.setSetLevel(data.skillLevle)
                if (data.rearID){
                    var conf = Gm.config.getSkill(data.rearID)
                    this.m_oLevelLab.string = cc.js.formatStr(Ls.get(417),conf.skillLevle,conf.quality,conf.detailed)
                }else{
                    this.m_oLevelLab.string = Ls.get(418)
                }
            }
        }else{
            this.m_oPageSpt.setOwner(this)
            this.m_oNameLab.string = ""
            if (this.m_oInfoBack){
                this.m_oInfoBack.active = false
            }
            this.m_oNoneBack.active = true
        }
    },
    onAdds:function(){
        if (this.m_oOwner && this.m_oOwner.onCellClick){
            this.m_oOwner.onCellClick(this.m_oData)
        }
    },
    onJian:function(){
        if (this.m_oOwner && this.m_oOwner.onSkillClick){
            this.m_oOwner.onSkillClick(this.m_oData)
        }
    },
    onSkillClick:function(destData){
    },
    dealSkillIcon:function(){
        if (this.m_iInfoLabHei && this.m_iLevelLabHei){
            let value = base_hei - (this.m_iInfoLabHei + this.m_iLevelLabHei)
            if (value < 0){
                this.m_oSBNode.y = -(base_hei-value)/2
                this.m_oFixNode.height = 0
            }else{
                this.m_oFixNode.height = value
                this.m_oSBNode.y = -base_hei/2
            }
        }
    },
    update(dt){
        if (!this.m_iGroupIdx){
            if (this.m_iInfoLabHei != this.m_oInfoLab.node.height){
                this.m_iInfoLabHei = this.m_oInfoLab.node.height
                this.dealSkillIcon()
            }
            if (this.m_iLevelLabHei != this.m_oLevelLab.node.height){
                this.m_iLevelLabHei = this.m_oLevelLab.node.height
                this.dealSkillIcon()
            }
        }
    },
});

