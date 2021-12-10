// LoterryTopCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oCellSpr:cc.Sprite,
        m_oSletetSpr:cc.Node,
    },
    setOwner:function(destOwner,data){
        this.m_oOwner = destOwner
        this.m_oData = data
        var self = this
        Gm.load.loadSpriteFrame("texture/ck/"+this.m_oData.data.icon,function(spr,icon){
            self.m_oCellSpr.spriteFrame = spr
        },this.m_oCellSpr)
    },
    updateSelet:function(destValue){
        this.m_oSletetSpr.active = destValue
    },
    onCellClick:function(){
        if (this.m_oOwner && this.m_oOwner.updateSeletIndex){
            this.m_oOwner.updateSeletIndex(this.m_oData.idx)
        }
    },
});

