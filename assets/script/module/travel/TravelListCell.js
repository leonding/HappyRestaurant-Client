// TravelListCell

cc.Class({
    extends: cc.Component,

    properties: {
        m_oHeroPerfab:cc.Prefab,
    	m_oHeadNode:cc.Node,
    	m_oAwakLab:cc.Label,
        m_oStarLab:cc.Label,
        m_oLeveLab:cc.Label,
        m_oTiaoLab:cc.Label,
        m_oStatLab:cc.Label,
        m_oNameLab:cc.Label,
        m_oMakeBtn:cc.Button,
        m_tBtnFrame:{
            default:[],
            type:cc.SpriteFrame,
        },
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        this.m_oData = data

        var tmpConfig = Gm.config.getHero(this.m_oData.baseId)

        var tmpPage = cc.instantiate(this.m_oHeroPerfab)
        tmpPage.parent = this.m_oHeadNode
        var tmpSpt = tmpPage.getComponent("HeroBase")
        tmpSpt.setOwner(this)
        tmpSpt.updateHero(Gm.travelData.getHero(this.m_oData.heroId))

        // Func.getHeadWithParent(tmpConfig.picture,this.m_oHeadNode)
        this.m_oNameLab.string = tmpConfig.name
        if (this.m_oData.awakenStage){
            this.m_oAwakLab.string = this.m_oData.awakenStage
        }
        if (this.m_oData.trainLevel){
            this.m_oStarLab.string = this.m_oData.trainLevel
        }
        if (this.m_oData.tuneLevel){
            this.m_oLeveLab.string = this.m_oData.tuneLevel
        }
        if (this.m_oData.tuneIntimacy){
            this.m_oTiaoLab.string = this.m_oData.tuneIntimacy
        }
        this.m_iCanDo = Gm.travelData.cheackHero(data.heroId,this.m_oOwner.m_iLostTime,this.m_oOwner.m_iRunType)
        var tmpColor = new cc.Color(255,217,63)
        if (this.m_iCanDo > 0){
            if (this.m_oData.ownerName){
                this.m_oStatLab.string = Ls.get(600008)
                tmpColor = new cc.Color(255,0,0)
            }else{
                this.m_oStatLab.string = Ls.get(600009)
            }
        }else if(this.m_iCanDo == -2){
            this.m_oStatLab.string = Ls.get(600010)
        }else if(this.m_iCanDo == -3){
            this.m_oStatLab.string = Ls.get(600009)
        }else if(this.m_iCanDo == -4){
            this.m_oStatLab.string = Ls.get(600008)
        }else{
            this.m_oStatLab.string = Ls.get(600011)
        }
        this.m_oStatLab.node.color = tmpColor
        this.updateBtn(false)
    },
    updateBtn:function(destValue){
        if (this.m_iCanDo > 0){
            this.m_oMakeBtn.interactable = true
            var sprite = this.m_oMakeBtn.node.getComponent(cc.Sprite)
            if (destValue){
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600012)
                sprite.spriteFrame = this.m_tBtnFrame[1]
            }else{
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600013)
                sprite.spriteFrame = this.m_tBtnFrame[0]
            }
        }else{
            if (this.m_iCanDo == -1){
                this.m_oMakeBtn.interactable = false
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600011)
            }else if(this.m_iCanDo == -2){
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600010)
            }else if(this.m_iCanDo == -3){
                this.m_oMakeBtn.interactable = false
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600014)
            }else if(this.m_iCanDo == -4){
                this.m_oMakeBtn.interactable = false
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600015)
            }else{
                this.m_oMakeBtn.node.getChildByName("label").getComponent(cc.Label).string = Ls.get(600016)
            }
        }
    },
    onDoit:function(){
        if (this.m_iCanDo > 0){
            this.m_oOwner.onDoit(this.m_oData.heroId)
        }else if(this.m_iCanDo == -2){
            var tmpView = Gm.ui.getScript("TravelView")
            if (tmpView && tmpView.node.active){
                tmpView.select(3)
            }
            this.m_oOwner.onBack()
        }
    },
});

