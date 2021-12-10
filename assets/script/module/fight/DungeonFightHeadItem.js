cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Node,
        winTypeSpr:cc.Sprite,
        nameLab:cc.Label,
        lvLab:cc.Label,
    },
    getMemberId(){
        return this.data?this.data.memberId:0
    },
    setData(data){
        this.data = data
        this.lvLab.string = ""
        if (this.getMemberId() == 0){
            this.nameLab.string = ""
            Gm.ui.getItemFrame("share_img_k1",(spr)=>{
                this.head.getComponent(cc.Sprite).spriteFrame = spr
            })
            return
        }
        Func.newHead2(data.head,this.head)
        this.nameLab.string = Func.itemName(data.name,3)
    },
    setBattleState(type){
        this.winTypeSpr.node.active = true
        var pathStr = ""
        if (type == 0){
            pathStr = "sl_icon_fail"
        }else if (type == 1){
            pathStr = "sl_icon_win"
        }else{
            return
        }
        Gm.load.loadSpriteFrame("texture/shilian/" + pathStr,(spr,owner)=>{
            owner.spriteFrame = spr
        },this.winTypeSpr)
    },
});

