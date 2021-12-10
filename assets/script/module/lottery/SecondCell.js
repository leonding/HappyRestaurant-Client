// SecondCell
cc.Class({
    extends: cc.Component,

    properties: {
        m_oLostLay1:cc.Label,
        m_oLostLay2:cc.Label,
        m_oDeadline:cc.Label,
        m_oBtnInfo:cc.Node,
        m_oListNode:cc.Node,
        m_oBackSpr:cc.Sprite,
        m_oDeadlineNode:cc.Node,
    },
    updateView:function(owner,data){
        this.m_oOwner = owner

        if (data.config.oneCost.length > 0){ //免费一抽
            this.m_oBtnOne = owner.getFabBtn(0)
            this.m_oListNode.addChild(this.m_oBtnOne)
            this.m_oBtnOne.on('click',this.onOneClick,this)
        }

        if (data.config.tenCost.length > 0){ //免费十抽
            this.m_oBtnTenFree = owner.getFabBtn(1)
            this.m_oListNode.addChild(this.m_oBtnTenFree)
            this.m_oBtnTenFree.on('click',this.onTenFree,this)
        }

        this.updateInfo(data)
    },
    updateInfo:function(data){
        this.m_oData = data
        if (this.m_oData.data.nextFreeTime == 0){
            this.m_oBtnOne.getChildByName("free").getComponent(cc.Label).string = ""
        }
        if (this.m_oData.config.oneCost.length > 0){ //免费一抽
            this.m_oOwner.transBtn(this.m_oBtnOne,this.m_oData.config.oneCost,this.m_oData.data.nextFreeTime == 0,1)
        }
        if (this.m_oData.config.tenCost.length > 0){ //免费十抽
            this.m_oOwner.transBtn(this.m_oBtnTenFree,this.m_oData.config.tenCost,null,10)
        }
        if (this.m_oData.config.mode == 4){
            this.m_oDeadlineNode.active = true
        }
        var tmpEnsure = Gm.config.getDrawBoxReward(this.m_oData.config.mode,this.m_oData.data.boxSumCount || 0)
        if (tmpEnsure && tmpEnsure.times){
            var tmpNum = tmpEnsure.times - (this.m_oData.data.boxSumCount || 0)
            this.m_oLostLay2.string = this.m_oData.data.boxSumCount
            this.m_oLostLay1.string = tmpEnsure.times
        }
        Gm.load.loadSpriteFrame("img/chouka/"+data.config.res2,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oBackSpr)
    },
    onOneClick:function(){
        var self = this
        var viewData = Gm.config.getViewByName(this.m_oOwner.node._name, this.m_oData.data.fieldId%1000)
        if (!Func.isUnlock(viewData.viewId,true)){
            return
        }
        var tmpSend = this.m_oOwner.checkItem(this.m_oData.config.oneCost,this.m_oData.data.nextFreeTime == 0)
        if(tmpSend){
            if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
                tmpSend = this.m_oOwner.checkCostDiamond(0, this.m_oData.config.oneCost, function(data){
                    Gm.ui.create("LotteryDiamondTip",{num:1,data:data,id:self.m_oData.config.id,drawType:0,quality:self.m_oData.config.darwQuality})
                })
            }
        }        
        if (tmpSend || this.m_oData.data.nextFreeTime == 0){
            Gm.cardNet.sendDrawCard(this.m_oData.config.id,0,this.m_oData.config.darwQuality)
        }
    },
    onTenFree:function(){
        var self = this
        var viewData = Gm.config.getViewByName(this.m_oOwner.node._name, this.m_oData.data.fieldId%1000)
        if (!Func.isUnlock(viewData.viewId,true)){
            return
        }
        var tmpSend = this.m_oOwner.checkItem(this.m_oData.config.tenCost)
        if(tmpSend){
            if(Gm.getLogic("LotteryLogic").checkNoMoreRemindsToday()){
                tmpSend = this.m_oOwner.checkCostDiamond(1, this.m_oData.config.tenCost, function(data){
                    Gm.ui.create("LotteryDiamondTip",{num:1,data:data,id:self.m_oData.config.id,drawType:1,quality:self.m_oData.config.darwQuality})
                })
            }
        }        
        if (tmpSend){
            Gm.cardNet.sendDrawCard(this.m_oData.config.id,1,this.m_oData.config.darwQuality)
        }
    },
    updateRefreshTime:function(){
        if (this.m_oData.data.nextFreeTime){
            var tmpTime = (this.m_oData.data.nextFreeTime - (Gm.userData.getTime_m() - this.m_oData.data.nowTime))
            var time = this.m_oBtnOne.getChildByName("free")
            if (tmpTime < 0){
                time.getComponent(cc.Label).string = ""
                this.m_oData.data.nextFreeTime = 0
                Gm.cardNet.sendDrawCardInfo(this.m_oData.config.id)
            }else{
                time.getComponent(cc.Label).string = Func.timeEachDay(tmpTime/1000)+Ls.get(20010)
            }
        }
        if (this.m_oData.data.nextJobEquipTime && this.m_oData.config.mode == 4){
            var tmpTime = (this.m_oData.data.nextJobEquipTime - (Gm.userData.getTime_m() - this.m_oData.data.nowTime)) / 1000
            if(tmpTime < 0){
                this.m_oData.data.nextJobEquipTime = 0
                var tmp_nextid = this.m_oData.config.id + 1
                tmpTime = 0
                var tmp_EquipCycle = Gm.config.getConst("draw_equip_cycle_group")
                tmp_EquipCycle = tmp_EquipCycle.split('|')
                if (tmp_nextid > parseInt(tmp_EquipCycle[tmp_EquipCycle.length-1])){
                    tmp_nextid = parseInt(tmp_EquipCycle[0])
                }
                Gm.cardNet.sendDrawCardInfo(tmp_nextid)
            }
            this.m_oDeadline.string = Func.timeToTSFM(tmpTime)
        }
    },
    getId:function(){
        return this.m_oData.config.id
    },
    getMode:function(){
        return this.m_oData.config.mode
    },
    onTopBoxClick:function(){
        var tmpEnsure = Gm.config.getDrawBoxReward(this.m_oData.config.mode,this.m_oData.data.boxSumCount || 0)
        if (tmpEnsure && tmpEnsure.reward){
            Gm.award({award:tmpEnsure.reward})
        }
    },
});

