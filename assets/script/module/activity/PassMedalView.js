var BaseView = require("BaseView")
// PassMedalView
cc.Class({
    extends: BaseView,

    properties: {
        passMedalItem:cc.Node,
        scrollView:cc.ScrollView,
        qsNumLab:cc.RichText,
        timeLab:cc.RichText,
        lvLab:cc.RichText,
        unlockBtn:cc.Node,
        openSpr:cc.Node,
        tipsSpr:cc.Node,
        tipsRich:cc.RichText,

        //进度条
        barBaseNode:cc.Node,
        bar:cc.ProgressBar,
        numLayoutNode:cc.Node,
        numItem:cc.Node,
        pass_icom_jstxz:cc.SpriteFrame,
        pass_icom_jstxz1:cc.SpriteFrame,
    },
    onLoad () {
        this._super()
        if (Gm.activityData.data.passMeLv != 1){
            var lastPassLv = cc.sys.localStorage.getItem("lastPassLv") || 0
            if (lastPassLv != Gm.activityData.data.passMeLv){//等级变更打开一次
                cc.sys.localStorage.setItem("lastPassLv",Gm.activityData.data.passMeLv)
                Gm.ui.create("PassMedalLvRewardView")
            }else if (Gm.activityData.data.passMeLv == 5){
                var dateStr = Func.dateFtt("yyyy-MM-dd hh:mm",Gm.activityData.data.passMedalResetTime)
                dateStr = dateStr + "passMedalMax"
                var isOpen = cc.sys.localStorage.getItem(dateStr) || 0
                if (isOpen == 0){//每一轮打开一次
                    cc.sys.localStorage.setItem(dateStr,1)
                    Gm.box({msg:Ls.get(5812)})
                }
            }
        }
    },
    onEnable(){
        this._super()
    },
    register(){
        this.events[MSGCode.OP_BUY_PASSMEDAL_EXP_S] = this.onNetBuyPassMedalExp.bind(this)
    },
    onNetBuyPassMedalExp(){
        this.updateView()
    },
    updateView(owner){
        if (owner){
            this.owner = owner
        }
        this.owner.updateTopGril(401)
        if(this.items == null){
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TXZ,Gm.activityData.data.passMeLv)
            var itemHeight = 0
            this.items = []
            this.numItems = []
            this.maxNum = 0

            var nowIndex = -1

            for (let index = 0; index < list.length; index++) {
                const itemData = list[index];
                var dd = Gm.activityData.getAtyId(itemData.id)
                if (Gm.userInfo.passMedal >= itemData.receiveCondition[0].num 
                    && dd == null && Gm.activityData.isUnlockPassMedal()
                    && nowIndex == -1){
                    nowIndex = index
                }
                this.maxNum = itemData.receiveCondition[0].num
            }
            Gm.ui.simpleScroll(this.scrollView,list,function(itemData,index){
                var item = cc.instantiate(this.passMedalItem)
                item.active = true
                itemHeight = item.height
                this.scrollView.content.addChild(item)
                item.y = (itemHeight+5)*(0.5 - index)

                if (index == 1){
                    item.zIndex = 1
                    this.barBaseNode.parent = item
                    this.barBaseNode.active = true
                    this.barBaseNode.y = 0
                }

                var sp = item.getComponent("PassMedalItem")
                sp.setData(itemData,this)
                sp.updateItem()
                this.items.push(sp)

                var item1 = cc.instantiate(this.numItem)
                item1.active = true
                item1.x = 0
                this.numLayoutNode.addChild(item1)
                item1.data = itemData
                item1.getChildByName("New Label").getComponent(cc.Label).string = itemData.receiveCondition[0].num
                item1.activeIcon = item1.getChildByName("activeIcon")
                item1.activeIcon.active = Gm.userInfo.passMedal >= itemData.receiveCondition[0].num
                this.numItems.push(item1)
                return item
            }.bind(this))
            this.scrollView.content.height = (itemHeight+5)*Math.ceil((list.length))
            // this.scrollView.scrollToTop()

            this.scrollView.scheduleOnce(()=>{
                var nowPos = this.scrollView.getContentPosition()
                nowPos.y = (itemHeight+5)*(nowIndex)
                this.scrollView.scrollToOffset(nowPos,0.1)
            },0.01)

            // Gm.ui.scrollOffset(this.scrollView,nowIndex,list.length)
            
            this.bar.totalLength = 147*(list.length-1)
            this.bar.node.height = 147*(list.length-1)
        }else{
            for (let index = 0; index < this.items.length; index++) {
                const v = this.items[index];
                v.updateItem()
            }
            for (let index = 0; index < this.numItems.length; index++) {
                const v = this.numItems[index];
                v.activeIcon.active = Gm.userInfo.passMedal >= v.data.receiveCondition[0].num
            }
            // this.barBaseNode.active = false
            // this.scrollView.content.getComponent("QueueShowAction").runQueueAction()
            // this.items[0].node.
            // this.items[0].node.opacity = 255
            // this.items[0].node.scale = 1
        }
        this.bar.progress = Gm.userInfo.passMedal/this.maxNum

        this.qsNumLab.string = Ls.get(5317) + Gm.userInfo.passMedal
        this.lvLab.string = Ls.get(5811) + Gm.activityData.data.passMeLv

        this.openSpr.active = !Gm.activityData.isUnlockPassMedal()
        this.tipsSpr.active = false

        this.unlockBtn.getComponent(cc.Sprite).spriteFrame = Gm.activityData.isUnlockPassMedal()?this.pass_icom_jstxz:this.pass_icom_jstxz1

        if (this.unlockRedNode == null){
            this.unlockRedNode = Gm.red.getRedNode(this.unlockBtn)
        }
        this.unlockRedNode.active = false//Gm.activityData.isUnlockPassMedal() && Gm.config.getConst("buy_medal_exp_time") > time && !this.isPassMedalExp()
        if (this.isPassMedalExp()){
            this.tipsSpr.active = true
            this.tipsRich.string = cc.js.formatStr(Ls.get(5809))
        }
        this.updateTime()
    },
    onUnlockBtn(){
        if (Gm.activityData.isUnlockPassMedal()){
            cc.log(Gm.userInfo.passMedal,this.maxNum)
            if (this.isPassMedalExp()){//经验已满
                Gm.ui.create("PassMedalExpFullView")
            }else{
                var time = Func.translateTime(Gm.activityData.data.passMedalResetTime,true)
                if (time < Gm.config.getConst("buy_medal_exp_time")){
                    Gm.ui.create("PassMedalBuyExpView")
                    return
                }
            }
            return
        }
        
        Gm.ui.create("PassMedalUnlockView")
    },
    onSkipBtn(){
        Gm.ui.jump(6001)
        Gm.ui.removeByName("ActivityMainView")
    },
    isPassMedalExp(){
        return Gm.userInfo.passMedal >= this.maxNum
    },
    updateTime(){
        var time = Func.translateTime(Gm.activityData.data.passMedalResetTime,true)
        this.timeLab.string = cc.js.formatStr(Ls.get(5318),AtyFunc.timeToTSFMzh(time))
        if(time == 0){
            Gm.activityData.data.passMedalResetTime = 0
            this.owner.checkNeedOpenPlayInfo()
        }else{
            if (Gm.config.getConst("buy_medal_exp_time") > time ){
                if (Gm.activityData.isUnlockPassMedal()){
                    this.unlockRedNode.active = !this.isPassMedalExp()
                }else{
                    if (!Gm.activityData.isUnlockPassMedal()){
                        this.tipsSpr.active = true
                        this.tipsRich.string = Ls.get(5810)
                    }
                }
            }
            
        }
    },
});

