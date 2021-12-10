cc.Class({
    extends: cc.Component,
    properties: {
        lab:cc.Label,
        itemNodes:cc.Node,
        btn:cc.Button,
        btnLab:cc.Label,
        maskNode:cc.Node,
        bar:cc.ProgressBar,
        barLab:cc.Label
    },
    setData(data,owner){
        this.data = data
        this.owner = owner

        var item = Gm.ui.getNewItem(this.itemNodes)
        item.setData(data.rewardStr[0])

        this.lab.string = data.name
        var strId = 0
        if (data.state == 3){
            this.btn.interactable = false
            strId = 1002
            item.updateLock(true)
        }else{
            if (data.state == 1){
                strId = 1001
                this.btn.interactable = true
            }else{
                strId = 6025
                this.btn.interactable = true
            }
        }
        this.btnLab.string = Ls.get(strId)
        this.bar.progress = data.nowNum/data.rate
        this.barLab.string = data.nowNum + "/" + data.rate
        this.showRed()
    },
    showRed(){
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.btn.node)
        }
        this.redNode.active = this.data.state == 1
    },
    onClick(){
        if (this.data.state == 1){
            Gm.signNet.wsReward(ConstPb.EventGroup.EVENT_SIGN_TASK,this.data.id)
        }else{
            Gm.ui.jump(this.data.intoUi)
            this.owner.onBack()
            Gm.ui.removeByName("EventListView")
        }
    },
    updateTime(){
        // if (this.data.state == 2){
        //     var time = Func.translateTime(this.starTime,true)
        //     this.btnLab.string = AtyFunc.timeToTSFMzh(time)
        // }
    },
});
