// SkillBase
cc.Class({
    extends: cc.Component,

    properties: {
        m_oBackSpr:cc.Sprite,
        m_oBackSpr1:cc.Sprite,
        m_oIconSpr:cc.Sprite,
        m_oAddSpr:cc.Node,
        m_oChooseSpr:cc.Node,
        m_oLockSpr:cc.Node,
        m_oLayNode:cc.Node,
        m_oAddNode:cc.Node,
    },
    setOwner:function(destOwner,data,destLock){
        this.m_oLockSpr.active = destLock
        if (destLock){
            this.m_oIconSpr.node.color = cc.color(80,80,80)
        }else{
            this.m_oIconSpr.node.color = cc.color(255,255,255)
        }
        this.m_oOwner = destOwner
        this.m_oAddSpr.active = false
        this.m_oIconSpr.spriteFrame = null
        this.m_oLayNode.active = false
        this.updateData(data)
    },
    setSetLevel:function(levelNow){
        this.m_oLayNode.active = true
        var labNeed = this.m_oLayNode.getChildByName("need")
        var labUsed = this.m_oLayNode.getChildByName("used")
        var jian = this.m_oLayNode.getChildByName("jian")
        labNeed.getComponent(cc.Label).string = levelNow
        jian.active = false
        labUsed.active = false
    },
    setLevelInfo:function(levelNow,levelMax){
        this.m_oLayNode.active = true
        var labNeed = this.m_oLayNode.getChildByName("need")
        var labUsed = this.m_oLayNode.getChildByName("used")
        var jian = this.m_oLayNode.getChildByName("jian")
        if (levelMax){
            labNeed.getComponent(cc.Label).string = levelNow
            labUsed.getComponent(cc.Label).string = levelMax
        }else{
            labNeed.getComponent(cc.Label).string = "Lv.Max"
            jian.active = false
            labUsed.active = false
        }
        // if (tmpIt.num < tmpHeroUp.consume[i].num){
        //     labNeed.color = cc.color(255,0,0)
        // }else{
        //     labNeed.color = cc.color(117,80,48)
        // }
    },
    setChooseCell:function(destValue){
        this.m_oChooseSpr.active = destValue
    },
    updateData:function(data){
        if (data){
            this.m_oData = data
            Gm.load.loadSpriteFrame("personal/skillicon/"+data.picture,function(sf,sp){
                sp.spriteFrame = sf
            },this.m_oIconSpr)
        }else{
            if (!this.m_oLockSpr.active){
                this.m_oAddSpr.active = true
            }
            this.m_oData = null
        }
    },
    hideAddSpr(){
        this.m_oAddSpr.active = false
    },
    onSkillClick:function(sender){
        console.log("点击到了",this.m_oData)
        if (this.m_oOwner && this.m_oOwner.onSkillClick){
            this.m_oOwner.onSkillClick(this.m_oData,sender)
        }
    },
    setAddNode(key){
        this.m_oAddNode.active = key
        var add = this.m_oAddNode.getChildByName("camp_skill_bg1")
        add.stopAllActions()
        add.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1),cc.fadeIn(1))))
    },
    setBackSprite(){
        this.m_oBackSpr.node.active = false
        this.m_oBackSpr1.node.active = true
    }
});

