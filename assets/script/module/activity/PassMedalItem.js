cc.Class({
    extends: cc.Component,
    properties: {
        itemNodes:{
            default: [],
            type: cc.Node,
        },
        btn:cc.Button,
        btnSpr:cc.Sprite,
        btnLab:cc.Label,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        this.items = []
        
        var rewards = this.data.reward.concat(this.data.battlePassReward)
        for (let index = 0; index < rewards.length; index++) {
            const v = rewards[index];
            
            var item = Gm.ui.getNewItem(this.itemNodes[index])
            item.setData(v)
            item.node.zIndex = -1
            this.items[index] = item
        }

        this.updateItem()
    },
    updateItem(){
        var btnStr = Ls.get(5311)
        var ins = false
        var btnPath = "button_btn_hua2"
        
        this.canLq = false
        var dd = Gm.activityData.getAtyId(this.data.id)
        if (Gm.userInfo.passMedal >= this.data.receiveCondition[0].num){
            if (dd == null){
                btnStr = Ls.get(5315)
                ins = true
                btnPath = "button_btn_hua4"
                this.canLq = true
            }else if (dd.status == 1){
                if (Gm.activityData.isUnlockPassMedal()){
                    btnStr = Ls.get(5311)
                    ins = true
                    btnPath = "button_btn_hua4"
                    this.canLq = true
                }else{
                    btnStr = Ls.get(5316)
                    ins = true
                }
            }else {
                btnStr = Ls.get(5312)
            }
        }

        Gm.load.loadSpriteFrame("img/button/" +btnPath,function(sp,icon){
            icon.spriteFrame = sp
        },this.btnSpr)

        this.btn.interactable = ins
        this.btnLab.string = btnStr

        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            var lqIcon = this.itemNodes[index].getChildByName("lqIcon")
            lqIcon.active = false
            if (index == 0){
                if (dd && (dd.status == 1 || dd.status == 2)){
                    // lqIcon.active = true
                    v.showGetIcon()
                }
            }else{
                var lockNode = this.itemNodes[index].getChildByName("lockNode")
                lockNode.active = !Gm.activityData.isUnlockPassMedal()
                // if (Gm.activityData.isUnlockPassMedal()){
                //     v.setGray(false)
                // }else{
                //     v.setGray(true)
                // }
                if (dd && dd.status == 2){
                    // lqIcon.active = true
                    v.showGetIcon()
                }
            }
        }
    },
    onBtn(){
        var dd = Gm.activityData.getAtyId(this.data.id)
        if (dd && dd.status == 1 && !Gm.activityData.isUnlockPassMedal()){
            Gm.ui.create("PassMedalUnlockView")
            return
        }
        Gm.activityNet.reward(this.data.id)
    },
});


