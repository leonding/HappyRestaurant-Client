cc.Class({
    extends: cc.Component,
    properties: {
        lab:cc.Label,
        itemNodes:cc.Node,
        btn:cc.Button,
        btnLab:cc.Label,
        maskNode:cc.Node,
    },
    setData(data,owner,starTime){
        this.data = data
        this.owner = owner
        this.starTime = starTime + (data.id-1)*24*60*60*1000
        
        this.lab.string = cc.js.formatStr(Ls.get(5232),data.id)

        for (let index = 0; index < data.item.length; index++) {
            const v = data.item[index];
            var item = Gm.ui.getNewItem(this.itemNodes)
            //item.node.scale = 85/item.node.width
            item.setData(v)
            item.updateLock( v.state == 3 )
        }

        var strId = 0
        this.node.opacity = 255
        this.maskNode.active = false
        if (data.state == 3){
            this.btn.interactable = false
            strId = 1002
        }else{
            if (data.state == 1){
                strId = 1001
                this.btn.interactable = true
            }else{
                strId = 1008
                this.btn.interactable = false
                this.maskNode.active = true
            }
        }
        this.btnLab.string = Ls.get(strId)
        this.updateTime()
        this.showRed()
    },
    showRed(){
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.btn.node)
        }
        this.redNode.active = this.data.state == 1
    },
    onClick(){
        if(this.data.state == 1){
            Gm.signNet.wsReward(ConstPb.EventGroup.EVENT_DAY_SIGN,this.data.id)
        }
    },
    updateTime(){
        if (this.data.state == 2){
            var time = Func.translateTime(this.starTime,true)
            this.btnLab.string = AtyFunc.timeToTSFMzh(time)+ (time>24*60*60?Ls.get(5230):"")
        }
    },
});
