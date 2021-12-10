// JobBase
cc.Class({
    extends: cc.Component,

    properties: {
        m_oSeletFab:cc.Prefab,
        m_oNumLab:cc.Label,
        m_oLockSpr:cc.Node,
    },
    onLoad(){
        this.m_oSeletSpr = cc.instantiate(this.m_oSeletFab)
        this.m_oSeletSpr.parent = this.node
        this.m_oSeletSpr.active = false
    },
    setOwner:function(destOwner,data,destPage,destNum){
    	this.m_oOwner = destOwner
    	this.m_iPageNum = destPage
    	this.m_iIndxNum = destNum
        this.updateData(data)
    	this.callSelet(false)
        this.updateLock(false)
        this.updatePoint(0)
    },
    updateData:function(data){
        this.m_oData = data
        if (this.m_oData){
            Gm.load.loadSpriteFrame("texture/jobs/"+data.icon,function(sp,owner){
                owner.spriteFrame = sp
            },this.getComponent(cc.Sprite))
        }
    },
    updatePoint:function(destNum){
        this.m_oNumLab.string = destNum || 0
    },
    callSelet:function(destValue){
    	this.m_oSeletSpr.active = destValue
    },
    onJobClick:function(){
        if (this.m_oOwner){
            if (this.m_oLockSpr.active){
                if (this.m_oOwner.onShowLock){
                    this.m_oOwner.onShowLock(this.m_iPageNum,this.m_iIndxNum)
                }
            }else{
                if (this.m_oOwner.onChooseJob){
                    this.m_oOwner.onChooseJob(this.m_iPageNum,this.m_iIndxNum)
                }
            }
        }
    },
    updateLock:function(destValue){
        this.m_oLockSpr.active = destValue
    },
});

