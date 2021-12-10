cc.Class({
    extends: cc.Component,

    properties: {
        itemPre:cc.Prefab,
        nameLab:cc.Label,
        nodeParents:{
            default: [],
            type: cc.Node,
        },
        okBtn:cc.Button,
        btnSpr:cc.Sprite,
        btnLab:cc.Label,
        buyNode:cc.Node,
        buyNowLab:cc.Label,
        buyOldLab:cc.Label,
    },
    updateSign:function(data,owner){
        this.data = data
        this.owner = owner

        this.buyNode.active = false
        this.okBtn.interactable = false
        this.btnLab.node.active = true
        var btnSp = "newdialog/rw_btn_b"
        if (this.isUnlock()){
            if (Gm.signData.getReceiveTaskId(data.taskId)){
                this.btnLab.string = Ls.get(200008)
                btnSp = "ck/ck_btn_sv"
                this.nameLab.string = data.name + " " + data.rate + "/" + data.rate
            }else{
                var ddKay = "rate"
                if (data.type==1){
                    ddKay = "value"
                    if (Gm.signData.getRateByTaskType(data.type) >= data.value){
                        this.nameLab.string = data.name + " 1/1"
                    }else{
                        this.nameLab.string = data.name + " 0/1"
                    }
                }else{
                    this.nameLab.string = data.name + " " + Gm.signData.getRateByTaskType(data.type) + "/" + data.rate
                }
                if (Gm.signData.getRateByTaskType(data.type) >= data[ddKay] || data.type == 31){
                    this.btnLab.string = Ls.get(200009)
                    this.okBtn.interactable = true
                    btnSp = "newdialog/new_dialog_btn_4"
                }else{
                    this.btnLab.string = Ls.get(200010)
                }
                //特殊处理
                if (data.type == 31 && this.okBtn.interactable){
                    this.buyNode.active = true
                    this.btnLab.node.active = false
                    this.buyNowLab.string = data.value
                    this.buyOldLab.string = data.price
                    btnSp = "newdialog/new_dialog_btn_4"
                }
            }
        }else{
            this.btnLab.string = Ls.get(200011)
            this.btnLab.fontSize = 24
            this.nameLab.string = data.name
        }
        
        Gm.load.loadSpriteFrame("texture/"+btnSp,function(sp,sf){
            sf.spriteFrame = sp
            sf.node.width = 128
            sf.node.height = 52
        },this.btnSpr)

        for (let index = 0; index < 3; index++) {
            var award = data.reward[index]
            if (award){
                
                this.itemSp = Gm.ui.getNewItem(this.nodeParents[index])
                this.itemSp.setData(award)
            }
        }
    },
    isUnlock(){
        var wss = Gm.config.getWeekSign()
        for (const key in wss) {
            const ws = wss[key];
            if (ws.day >Gm.signData.weekSign.openSignDay){
                return false
            }
            for (let index = 0; index < ws.groupNum.length; index++) {
                const v = ws.groupNum[index];
                if (this.data.groupNum == v){
                    return true
                }
            }
        }
        
        return false
    },
    onOkBtn(){
        if (!this.isUnlock()){
            Gm.floating(Ls.get(200012))
            return
        }
        if(this.data.type == 31 && this.data.value > Gm.userInfo.getGolden()){
            Gm.floating(Ls.get(200013))
            return
        }
        Gm.signNet.wsReward(1,this.data.taskId)
    },
    
});
