var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        totalNodes:cc.Node,
        currNodes:cc.Node,
        btnLab:cc.Label,
    },
    onLoad(){
        this._super()
        this.popupUI.setHeight(640)
    },
    enableUpdateView(){
        this.updateView()
    },
    updateView(){
        this.popupUI.setData({title:Gm.config.getEventPayRewardId(this.openData.activityId).name})
        Gm.audio.playEffect("music/02_popup_open")
        var list = Gm.config.getEventPayReward(this.openData.type)

        var rewards = Func.copyArr(list[0].battlePassReward)

        var sumsAward = []
        var currAward = []

        var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var isUnlock = false
            if (this.openData.type == AtyFunc.TYPE_TIME_UP){
                isUnlock = Gm.userInfo.level >= v.receiveCondition[0].num
            }else if (this.openData.type == AtyFunc.TYPE_TIME_CHAPTER){
                var needConfigData = Gm.config.getMapById(v.receiveCondition[0].num)
                if (myConfigData.chapter-1 >= needConfigData.chapter){
                    isUnlock = true
                }
            }
            
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

            if (currAward[index]){
                var sp1 = Gm.ui.getNewItem(this.currNodes)
                sp1.updateItem(currAward[index])
            }
        }

        this.btnLab.string = AtyFunc.getPriceStr(this.openData.activityId)
    },
    onUnlockBtn(){
        AtyFunc.checkBuy(this.openData.activityId)
    },
});

