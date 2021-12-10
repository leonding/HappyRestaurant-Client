const tips_res = {
    1:"icon_y",
    2:"icon_j",
    3:"icon_g",
    4:"icon_z",
}
// HeroBase
cc.Class({
    extends: cc.Component,

    properties: {
    	m_oBackSpr:cc.Sprite,
        m_oHeadNode:cc.Node,
        m_oReadySpr:cc.Node,
        lockSpr:cc.Node,
        m_oTipsSpr:cc.Sprite,
        numLab:cc.Label,
        quality_res:{
            default: [],
            type: cc.SpriteFrame,
        },
        m_oQulitySpr:cc.Sprite,
        m_oJobSpr:cc.Sprite,
    },
    setQulity:function(qulity){
        var tmpHeroRes = Gm.config.getHeroType(qulity)
        Gm.load.loadSpriteFrame("img/travel/" +tmpHeroRes.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oQulitySpr)
    },
    setJobRes:function(job){
        var res = Gm.config.getTeamType(job)
        Gm.load.loadSpriteFrame("img/jobicon/" +res.currencyIcon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oJobSpr)
    },
    setOwner:function(destOwner) {
    	this.m_oOwner = destOwner
        this.setTips(false)
    	this.setHeroReady(false)
    },
    updateHero:function(data){
        if (data){
                // tmpSpt.updateHeroChip(list[i])
        	this.m_oData = data
            var conf = Gm.config.getHero(data.baseId || 0,data.qualityId)
            Func.getHeadWithParent(conf.picture,this.m_oHeadNode)
            this.m_oBackSpr.spriteFrame = this.quality_res[conf.quality-1]
            this.setLock(false)
            if (data.isHire){
                this.numLab.node.parent.active = true
                var lineType = this.m_oOwner.m_oData.type 
                var constKey
                if (lineType == ConstPb.lineHero.LINE_BOSS){
                    constKey = "aid_success_use_limit_map"
                }else if (lineType == ConstPb.lineHero.LINE_TOWER){
                    constKey = "aid_success_use_limit_tower_map"
                }
                this.numLab.string = cc.js.formatStr("%s/%s",Gm.friendData.getHireCount(lineType),Gm.config.getConst(constKey))
                this.isHireFull = Gm.friendData.getHireCount(lineType)>=Gm.config.getConst(constKey)
            }
        }
    },
    setTeamNum:function(number){
        this.m_iTeamNum = number
    },
    setHeroReady:function(destValue,destName) {
    	this.m_oReadySpr.active = destValue
        if (destValue){
            for(var i = 0;i < 2;i++){
                this.m_oReadySpr.getChildByName(i+"").active = i == destName
            }
        }
        this.updateTips()
    },
    isReady(){
        return this.m_oReadySpr.active
    },
    onHeroClick:function(){
        if (this.isHireFull){
            Gm.floating(Ls.get(5328))
            return
        }
        if (this.m_oOwner && this.m_oOwner.onHeroListClick){
            this.m_oOwner.onHeroListClick(this.m_oData,!this.m_oReadySpr.active)
        }
    },
    setTips:function(destValue){
        this.m_oTipsSpr.node.active = destValue
        this.updateTips()
    },
    updateTips:function(){
        if(this.m_oTipsSpr.node.active){
            var tmpCan = 0
            if (this.m_oData && this.m_oData.heroId){
                tmpCan = this.m_oOwner.cheackLimit(this.m_oData.heroId)
                if (tmpCan != -1 && tmpCan != 1 && tmpCan != 2 && this.m_oReadySpr.active){
                    tmpCan = 4
                }
            }
            if (tmpCan > 0){
                Gm.load.loadSpriteFrame("texture/travel/"+tips_res[tmpCan],function(sp,icon){
                    icon.spriteFrame = sp
                },this.m_oTipsSpr)
            }else{
                this.m_oTipsSpr.spriteFrame = null
            }
        }
    },
    setLock:function(destValue){
        if (destValue){
            if (!this.m_oData.heroId){//是碎片
                this.lockSpr.active = true
                if (this.m_oData.isChip){
                    Gm.load.loadPerfab("perfab/ui/kaisuo",function(sp){
                        if(this.m_oData && this.m_oData.isChip){
                            this.lockSpr.getComponent(cc.Sprite).spriteFrame = null
                            this.lockSpr.addChild(cc.instantiate(sp))
                        }
                    }.bind(this))
                }
            }
        }else{
            Func.destroyChildren(this.lockSpr)
            if (!this.m_oData.heroId){//是碎片
                this.lockSpr.active = true
            }else{
                this.lockSpr.active = false
            }
        }
    },
});

