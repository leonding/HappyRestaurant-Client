// TravelOKCell

cc.Class({
    extends: cc.Component,

    properties: {
        m_oItemNode:cc.Node,
        m_oStarNode:cc.Node,
        m_oStarNod: {
            default: [],
            type: cc.Node,
        },
        m_oNameLab:cc.Label,
        m_oBtnDui:cc.Node,
        m_oTeamNode:cc.Node,
        m_oHeadNode:cc.Node,
        m_oSubCell:cc.Node,
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        this.m_tHeros = []
        this.updateData(data)
        this.m_bSend = true
    },
    updateData:function(data){
        this.m_iIndex = data.index
        this.m_oNameLab.string = data.config.name
        for(const i in data.config.reward){
            var tmpData = data.config.reward[i]
            var tmpSpt = Gm.ui.getNewItem(this.m_oItemNode)
            tmpSpt.setData(tmpData)
        }
        for(const i in this.m_oStarNod){
            this.m_oStarNod[i].getChildByName("star").active = Number(i) < data.config.star
        }
        for(const i in data.config.conditionStr){
            var qulity = data.config.conditionStr[i].type
            var total = data.config.conditionStr[i].condition
            var icon = null
            if (qulity < 7000){
                var res = Gm.config.getHeroType(qulity)
                icon = "img/travel/" +res.currencyIcon
                var item = cc.instantiate(this.m_oSubCell)
                item.scale = 1.05
                this.m_oTeamNode.addChild(item)
                var lab = item.getChildByName("lab").getComponent(cc.Label)
                lab.string = total+"/"+total
                Gm.load.loadSpriteFrame(icon,function(sp,own){
                    own.spriteFrame = sp
                },item.getComponent(cc.Sprite))
            }else{
                var res = Gm.config.getTeamType(qulity%10)
                icon = "img/jobicon/" +res.currencyIcon
                for(var j = 0;j < total;j++){
                    var item = cc.instantiate(this.m_oSubCell)
                    this.m_oTeamNode.addChild(item)
                    Gm.load.loadSpriteFrame(icon,function(sp,own){
                        own.spriteFrame = sp
                    },item.getComponent(cc.Sprite))
                }
            }
        }
    },
    pushHero:function(data,isHire){
        this.m_tHeros.push(data.heroId)
        var tmpSpt = Gm.ui.getNewItem(this.m_oHeadNode)
        tmpSpt.setMaxHeight()
        tmpSpt.updateHero(data)
    },
    onGet:function(){
        this.m_bSend = !this.m_bSend
        this.m_oBtnDui.active = this.m_bSend
    },
});

