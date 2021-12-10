cc.Class({
    extends: cc.Component,
    properties: {
        stateSpr:cc.Sprite,
        timeIcon:cc.Node,
        timeLab:cc.Label,
        awardLab1:cc.Label,
        awardlab2:cc.Label,
        dayLabLab:cc.Label,
        totalLab:cc.Label,
        btn:cc.Button,
        btnLab:cc.Label,
        grayNode:cc.Node,
    },
    onLoad(){

    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        this.awardLab1.string = data.reward[0].num
        this.awardlab2.string = AtyFunc.getVipExp(data.id)
        this.dayLabLab.string = data.battlePassReward[0].num

        var day = data.validity/24/60/60
        this.totalLab.string = data.battlePassReward[0].num*day + data.reward[0].num

        this.updateItem()
        if (this.btn.node.redNode == null){
            Gm.red.add(this.btn.node,"activity",3,this.data.id)
        }
    },
    updateItem(){
        // Gm.ui.setGray(this.node)
        var dd = Gm.activityData.getAtyId(this.data.id)
        var btnStr
        var ins = true
        if(dd){
            if (Gm.userData.getTime_m() > dd.expireTime){
                btnStr = AtyFunc.getPriceStr(this.data.id)
                Gm.ui.removeGray(this.node)
            }else{
                if (dd.status == 0){
                    btnStr = Ls.get(5311)
                }else{
                    btnStr = Ls.get(5312)
                    ins = false
                }
            }
        }else{
            btnStr = AtyFunc.getPriceStr(this.data.id)
        }
        this.btnLab.string = btnStr
        this.btn.interactable = ins

        this.updateTime()
    },
    updateTime(){
        this.grayNode.active = true
        if (this.data){
            var str
            var dd = Gm.activityData.getAtyId(this.data.id)
            this.timeIcon.active = false
            if(dd){
                if (Gm.userData.getTime_m() > dd.expireTime){
                    str = Ls.get(5313)
                }else{
                    str = AtyFunc.timeToTSFMzh(Func.translateTime(dd.expireTime))
                    this.grayNode.active = false
                }
                this.stateSpr.spriteFrame = this.owner.jhSpr
                this.timeLab.string = str
                this.timeIcon.active = true
            }else{
                this.stateSpr.spriteFrame = this.owner.wjhSpr
                this.timeLab.string = ""
            }
        }
    },
    onBtn(){
        if (this.isPay()){
            Gm.ui.create("ActivityBuyView",this.data.id)
        }else{
            Gm.activityNet.reward(this.data.id)
        }
    },
    isPay(){
        var dd = Gm.activityData.getAtyId(this.data.id)
        if (dd == null || (dd && Gm.userData.getTime_m() > dd.expireTime)){
            return true
        }
        return false
    },
});


