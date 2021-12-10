
cc.Class({
    extends: cc.Component,

    properties: {
        rankSpr:cc.Sprite,
        rankLab:cc.Label,
        idLab:cc.Label,
        lvLab:cc.Label,
        nameLab:cc.Label,
        leaderName:cc.Label,
    },
    updateData:function(data,owner,rank){
        this.data = data
        this.owner = owner
        this.rankSpr.node.active = rank <=3
        if(this.rankSpr.node.active){
            Gm.load.loadSpriteFrame("texture/newjjc/jjc_img_"+rank,function(sp,icon){
                icon.spriteFrame = sp
            },this.rankSpr)
        }
        this.rankLab.node.active = !this.rankSpr.node.active
        this.rankLab.string = rank
        this.idLab.string = data.allianceId
        this.leaderName.string = data.leaderName
        this.nameLab.string = data.name
        this.lvLab.string = Ls.lv() + data.level
    },
    onBtnClick(){
    },
    
});
