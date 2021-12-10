var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        content:cc.Node,
        descLab:cc.Label,
        numLab:cc.Label,
        bar:cc.ProgressBar,
        consumeUI:require("ConsumeUI"),
    },
    onLoad(){
        this.popupUIData = {title:5800}
        this._super()
        this.popupUI.setHeight(900)
    },
    enableUpdateView(){
        this._super()
        this.updateView()
    },
    updateView(){
        Gm.audio.playEffect("music/02_popup_open")
        this.descLab.string = cc.js.formatStr(Ls.get(5797),Gm.userInfo.passMedal)
       

        this.allList = Gm.config.getEventPayReward(AtyFunc.TYPE_TXZ,Gm.activityData.data.passMeLv)

        this.maxExp = this.allList[this.allList.length-1].receiveCondition[0].num
        this.intervalNumExp = this.maxExp -this.allList[this.allList.length-2].receiveCondition[0].num
        this.startIndex = Math.floor(Gm.userInfo.passMedal/this.intervalNumExp)
        this.maxIndex = Math.floor(this.maxExp/this.intervalNumExp)

        this.medal_exp_cost_gold_pro = Gm.config.getConst("medal_exp_cost_gold_pro")/10000

        this.currIndex = 1
        this.currMax = this.maxIndex - this.startIndex

        this.items = []
        this.updateBar()
    },
    onAddClick(){
        this.currIndex = Math.min(this.currIndex+1,this.currMax)
        this.updateBar()
    },
    onJianClick(){
        this.currIndex = Math.max(this.currIndex-1,1)
        this.updateBar()
    },
    updateBar(){
        this.bar.progress = this.currIndex/this.currMax
        this.buyEndIndex = this.currIndex + this.startIndex
        var totalExp =this.buyEndIndex*this.intervalNumExp
        this.numLab.string = totalExp
        var needExp = totalExp - Gm.userInfo.passMedal
        this.needDiamond = Math.max(Math.ceil(needExp*this.medal_exp_cost_gold_pro),0)
        this.consumeUI.setData({id:ConstPb.playerAttr.GOLD,need:this.needDiamond})

        this.allRewards = []
        for (var i = this.startIndex; i < this.buyEndIndex; i++) {
            var v = this.allList[i]
            var rewards = v.reward.concat(v.battlePassReward)
            for (let index = 0; index < rewards.length; index++) {
                const v = rewards[index];
                this.pushAward(v)
            }
        }
        for (let index = 0; index < this.allRewards.length; index++) {
            var v = this.allRewards[index]
            var itemBase = null
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].data.id == v.id){
                    itemBase = this.items[i]
                }
            }
            if (itemBase){
                itemBase.data.count = v.count
                itemBase.data.num = v.num
                itemBase.updateCount()
            }else{
                itemBase = Gm.ui.getNewItem(this.content)
                itemBase.setData(v)   
                this.items.push(itemBase) 
            }
            
        }
    },
    pushAward(award){
        var item = Func.forBy(this.allRewards,"id",award.id)
        if (item){
            item.num = item.num + award.num
            item.count = item.num
        }else{
            this.allRewards.push(Func.dataMerge({},award))
        }
    },
    onClick(){
        if (this.needDiamond == 0){
            return
        }
        if (!Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD ,num:this.needDiamond})){
            return
        }

        Gm.activityNet.buyPassMedalExp(this.allList[(this.buyEndIndex)].id)
        this.onBack()
    },
});

