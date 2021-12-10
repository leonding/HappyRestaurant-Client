
cc.Class({
    extends: cc.Component,
    properties: {
        itemParent:cc.Node,
        starNumLab:cc.Label,
        btn:cc.Button,
        btnSpr:cc.Sprite,
        btnLab:cc.Label,
        boxNode:cc.Node,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner

        this.boxAnim = cc.instantiate(this.owner.m_oBoxPre)
        this.boxAnim.parent = this.boxNode

        for (let index = 0; index < data.reward.length; index++) {
            const v = data.reward[index];
            var itemBase = Gm.ui.getNewItem(this.itemParent)
            itemBase.setData(v)
        }
        this.starNumLab.string = Math.min(this.owner.allSatr,data.star) + "/" + data.star
        this.updateBtn()
    },
    updateBtn(){
        var itemAni = this.boxAnim.getComponent(cc.Animation)
        itemAni.play("box_none")

        var isHas = Gm.dungeonData.getHasStar(this.owner.dungeonConf.id,this.data.star)
        this.boxAnim.getChildByName("box").getChildByName("prop_bx_jk").active = isHas
        this.boxAnim.getChildByName("box").getChildByName("prop_bx_j").active = !isHas
        if (isHas){//已领取
            this.btnLab.string = Ls.get(40006)
            this.btnSpr.spriteFrame = this.owner.getCellFrame(0)
            this.btn.interactable = false
            this.boxAnim.getChildByName("box").getChildByName("prop_bx_jk").active = true
        }else{
            this.btn.interactable = true
            if (this.owner.allSatr >= this.data.star){
                this.btnLab.string = Ls.get(40005)
                this.btnSpr.spriteFrame = this.owner.getCellFrame(0)
                itemAni.play("box_lizi")
            }else{
                this.btnLab.string = Ls.get(40004)
                this.btnSpr.spriteFrame = this.owner.getCellFrame(1)
            }
        }
    },
    onClick(){
        cc.log("onClick1")
        if (this.owner.allSatr >= this.data.star){
            Gm.dungeonNet.boxReward(this.owner.dungeonConf.id,this.data.star)
        }else{
            this.owner.onBack()
        }
    },
    
});


