var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        totalNodes:cc.Node,
        currNodes:cc.Node,
        btnLab:cc.Label,
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    updateView(){
        Gm.audio.playEffect("music/02_popup_open")
        var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TXZ,Gm.activityData.data.passMeLv)

        var sums = [0,0]
        var currSums = [0,0]
        var rewards = Func.copyArr(list[0].battlePassReward)

        var sumsAward = []
        var currAward = []
        
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var isUnlock = Gm.userInfo.passMedal >= v.receiveCondition[0].num
            for (let i = 0; i < v.battlePassReward.length; i++) {
                const v1 = v.battlePassReward[i];
                var dd = Func.forBy(sumsAward,"id",v1.id)
                if (dd == null){
                    dd = {}
                    dd.id = v1.id
                    dd.type = v1.type
                    dd.num = v1.num
                    sumsAward.push(dd)
                }else{
                    dd.num = dd.num + v1.num
                }
                if (isUnlock){
                    var dd1 = Func.forBy(currAward,"id",v1.id)
                    if (dd1 == null){
                        dd1 = {}
                        dd1.id = v1.id
                        dd1.type = v1.type
                        dd1.num = v1.num
                        currAward.push(dd1)
                    }else{
                        dd1.num = dd1.num + v1.num
                    }
                }
            }
        }
        for (let index = 0; index < sumsAward.length; index++) {
            var sp = Gm.ui.getNewItem(this.totalNodes)
            sp.updateItem(sumsAward[index])
            sp.node.scale = 0.85

            if (currAward[index]){
                var sp1 = Gm.ui.getNewItem(this.currNodes)
                sp1.updateItem(currAward[index])
                sp1.node.scale = 0.85
            }
        }

        this.totalNodes.width = 125*sumsAward.length
        this.currNodes.width = 125*currAward.length


        this.btnLab.string = AtyFunc.getPriceStr(AtyFunc.PAY_TXZ)
    },
    onUnlockBtn(){
        var time = Func.translateTime(Gm.activityData.data.passMedalResetTime,true)
        if (Gm.config.getConst("buy_medal_last_time")  > time){
            Gm.box({msg:cc.js.formatStr(Ls.get(5813),Gm.config.getConst("buy_medal_last_time")/60/60)},(btnType)=>{
                if (btnType == 1){
                    Gm.payNet.createPay(AtyFunc.PAY_TXZ)
                    this.onBack()
                }
            })
            return
        }
        Gm.payNet.createPay(AtyFunc.PAY_TXZ)
        this.onBack()
    },
});

