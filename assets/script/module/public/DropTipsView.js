var BaseView = require("BaseView")
const BASE_EXP = 2001
const BASE_ITEM = 2010
const BASE_GOLD = 1002

const TYPE_DROP = 0
const TYPE_FAST = 1
// DropTipsView
cc.Class({
    extends: BaseView,

    properties: {
        m_oBtnList: {
            default: [],
            type: cc.Button
        },
        // 掉落节点
        m_oDropNode:cc.Node,
        m_oTimeLab:cc.Label,
        m_oExpLab:cc.Label,
        m_oExpSpr:cc.Sprite,
        m_oItemLab:cc.Label,
        m_oItemSpr:cc.Sprite,
        m_oGoldLab:cc.Label,
        m_oGoldSpr:cc.Sprite,
        m_oHeadNode:cc.Node,
        m_oExpBar:cc.ProgressBar,
        m_oLvLabel:cc.Label,
        m_oExpLabel:cc.RichText,
        m_oItemScroll:cc.ScrollView,
        m_oBlankTipNode:cc.Node,//空白页提示

        // 快速战斗节点
        m_oFastNode:cc.Node,
        m_oContentLab:cc.RichText,
        m_oResetLabel:cc.RichText,
        m_oNumberLab:cc.RichText,
        m_oBtnOk:cc.Node,
        m_oPayNode:cc.Node,
        m_oPayLabel:cc.Label,
    },
    onLoad(){
        this.popupUIData = {title:70016}
        this._super()
        this.addTimes()
        var exp = Func.itemConfig({type:ConstPb.itemType.TOOL,id:BASE_EXP})
        Gm.load.loadSpriteFrame("img/items/" +exp.con.icon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oExpSpr)

        var item = Func.itemConfig({type:ConstPb.itemType.TOOL,id:BASE_ITEM})
        Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oItemSpr)

        var gold = Func.itemConfig({type:ConstPb.itemType.TOOL,id:BASE_GOLD})
        Gm.load.loadSpriteFrame("img/items/" +gold.con.icon,function(sp,icon){
            icon.spriteFrame = sp
        },this.m_oGoldSpr)

        Gm.red.add(this.m_oBtnList[1].node,"fastFight","all")
    },
    onDestroy:function(){
        Gm.showLevelUp()
        this.clearTime()
        this._super()
    },
    clearTime:function(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    onDropClick:function(){
        this.select(TYPE_DROP)
    },
    onFastClick:function(){
        this.select(TYPE_FAST)
    },
    select:function(type){
        if (this.selectType != type){
            if(this.selectType != undefined){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            
            for (const key in this.m_oBtnList) {
                const v = this.m_oBtnList[key];
                var isSelect = key == type
                this.m_oBtnList[key].node.getChildByName("selectSpr").active = isSelect
            }
            this.m_oDropNode.active = false
            this.m_oFastNode.active = false
            if (this.selectType == TYPE_DROP){
                this.m_oDropNode.active = true
                this.updateDrop()
            }else if(this.selectType == TYPE_FAST){
                Gm.userData.reSetFastFight()
                Gm.red.refreshEventState("fastFight")
                this.m_oFastNode.active = true
                this.updateFast()
            }
            this.updateRefreshTime()
        }
    },
    enableUpdateView:function(data){
        if (data){
            // Gm.audio.playEffect("music/02_popup_open")
            this.m_oData = data
            // this.updateDrop()
            this.updateUserInfo()
            this.select(TYPE_DROP)
        }
    },
    updateUserInfo(){
        var tmpExp = Gm.config.getPlayerLevel(Gm.userInfo.level,"exp")
        this.m_oExpBar.progress = Gm.userInfo.exp/tmpExp.exp
        this.m_oLvLabel.string = "Lv."+Gm.userInfo.level
        var forMatStr = "<color=#ffe42e><outline color='#3e2d1e' width=2>%s</outline></c><color=#fff7d8><outline color='#3e2d1e' width=2>%s</outline></color>"
        this.m_oExpLabel.string = cc.js.formatStr(forMatStr,Gm.userInfo.exp+"/",tmpExp.exp)
        Func.newHead2(Gm.userInfo.head,this.m_oHeadNode)
    },
    register:function(){
        this.events[Events.DROP_TIPS_UPDATE] = this.onUpdateView.bind(this)
    },
    onUpdateView:function(args){
        if (args.item){
            this.updateDropItem()
        }
        this.updateGjAward()
    },
    updateDrop:function(){
        this.updateDropItem()
        this.updateGjAward()
    },
    isActiveOpen(){
        var times = Gm.config.getConst("act_drop_open_time")
        var cotime = Gm.config.getConst("act_drop_continue_time") * 1000
        var time = Func.dealConfigTime(times)
        return Gm.userData.getTime_m()>=time && Gm.userData.getTime_m()<=time+cotime
    },
    updateGjAward:function(){
        this.m_iMaxTime = Gm.config.getVip().offlineMaxAwardTime + Gm.config.getConst("offline_max_award_time")
        this.m_iInterval = Gm.config.getConst("map_drop_interval")
        var tmpCount = 60/this.m_iInterval
        var map = Gm.config.getMapById(Gm.userInfo.mapId)
        this.m_oExpLab.string = map.expDrop * tmpCount + "/m"
        var key = 1
        if(this.isActiveOpen()){
            var reard_up = Gm.config.getConst("act_drop_reward_up")
            key = (1+reard_up/10000)
        }
        
        this.m_oGoldLab.string = Math.floor(map.coinDrop * tmpCount  * key) + "/m"
        this.m_oItemLab.string = Math.floor(map.heroExpDrop * tmpCount * key) + "/m"
        
        this.m_iPassTime = Gm.userData.getPassTime(Gm.userInfo.lastGuaJiAwardTime)
        var tmpNum = Math.floor(this.m_iPassTime/this.m_iInterval)
        var hasExp = tmpNum * map.expDrop
        var hasHeroExp = Math.floor(tmpNum * map.heroExpDrop * key)
        var hasCoin =  Math.floor(tmpNum * map.coinDrop *key)
        if (this.m_oData && this.m_oData.award){
            hasExp = hasExp + this.m_oData.award.exp
            hasHeroExp = hasHeroExp + this.m_oData.award.heroExp
            hasCoin = hasCoin + this.m_oData.award.silver
        }
        if (this.m_oExpCell == null){
            return
        }
        if (hasExp > 0){
            this.m_oExpCell.node.active = true
            this.m_oExpCell.data.count = hasExp
            this.m_oExpCell.updateCount()
        }else{
            this.m_oExpCell.node.active = false
        }
        if (hasHeroExp > 0){
            this.m_oItemCell.node.active = true
            this.m_oItemCell.data.count = hasHeroExp
            this.m_oItemCell.updateCount()
        }else{
            this.m_oItemCell.node.active = false
        }
        if (hasCoin > 0){
            this.m_oGoldCell.node.active = true
            this.m_oGoldCell.data.count = hasCoin
            this.m_oGoldCell.updateCount()
        }else{
            this.m_oGoldCell.node.active = false
        }
        this.setBlankTip(!(hasExp || hasHeroExp || hasCoin))
    },
    insertDropItem:function(v){
        var itemSp = Gm.ui.getNewItem(this.m_oItemScroll.content,null,90)
        itemSp.setData(v)
        return itemSp
    },
    clearDrop:function(){
        console.log("this.m_oData===:",this.m_oData)
        if (this.m_oData.awardTime > 0){
            this.m_oData.awardTime = 0
            this.m_oData.award.exp = 0
            this.m_oData.award.heroExp = 0
            this.m_oData.award.silver = 0
            this.m_oData.award.drop.item = []
            this.m_oData.award.drop.offlineItem = []
            this.m_oData.award.drop.treasure = []

            if (this.m_oExpCell && this.m_oExpCell.node.active){
                ActionFunc.moveItems({nodes:this.m_oItemScroll.content.children})
            }
            this.m_oExpCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_EXP,itemCount:0})
            this.m_oExpCell.node.active = false
            this.m_oItemCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_ITEM,itemCount:0})
            this.m_oItemCell.node.active = false
            this.m_oGoldCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_GOLD,itemCount:0})
            this.m_oGoldCell.node.active = false
            this.updateRefreshTime()
            this.checkBlank(this.m_oData.award)
        }
    },
    updateDropItem:function(){
        Func.destroyChildren(this.m_oItemScroll.content)
        this.m_oExpCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_EXP,itemCount:0})
        this.m_oItemCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_ITEM,itemCount:0})
        this.m_oGoldCell = this.insertDropItem({itemType:ConstPb.itemType.TOOL,baseId:BASE_GOLD,itemCount:0})
        if (this.m_oData.award){
            var drops = this.m_oData.award.drop
            for (let index = 0; index < drops.item.length; index++) {
                const v = drops.item[index];
                this.insertDropItem(v)
            }
        }
        this.checkBlank(this.m_oData.award)
    },
    updateFast:function(){
        var con = Gm.config.getVip()
        this.m_oContentLab.string = Ls.get(50120) + Gm.config.getConst("fast_fighting_time")/60/60 +Ls.get(50121)
        this.m_oResetLabel.string = "<color=#fffc00>"+Ls.get(50116)+"</c><color=#00ff00></color>"

        this.m_oNumberLab.string = "<color=#47372f>"+Ls.get(50024)+"</c><color=#47372f>" + (con.fastBattleCount-Gm.userInfo.fastFightTimes)+ "</color><color=#000000>" + Ls.get(50025) + "</color>"

        var btnLab = this.m_oBtnOk.getChildByName("Label").getComponent(cc.Label)
        if (Gm.userInfo.fastFightTimes > 0){
            btnLab.string = Ls.get(70049)
        }else{
            btnLab.string = Ls.get(5315)
        }
        if (con.fastBattleCount > Gm.userInfo.fastFightTimes){
            this.m_oBtnOk.getComponent(cc.Button).interactable = true
            var need = Gm.config.buy(Gm.userInfo.fastFightTimes+1).fastBattlecost
            if (need == 0){
                this.m_oPayNode.active = false
            }else{
                this.m_oPayNode.active = true
                this.m_oPayLabel.string = "x"+need
            }
            // this.m_oFreeBtn.getChildByName("Label").getComponent(cc.Label).string = Ls.get(70049)
            // this.m_oFreeBtn.active = true
            // this.m_oGoldBtn.active = false
        }else{
            this.m_oBtnOk.getComponent(cc.Button).interactable = false
            this.m_oPayNode.active = false
            // this.m_oFreeBtn.getChildByName("Label").getComponent(cc.Label).string = Ls.get(70057)
            // var tmplab = this.m_oGoldBtn.getChildByName("Label").getComponent(cc.Label)
            // tmplab.string = Gm.config.buy(Gm.userInfo.fastFightTimes+1).fastBattlecost
            // this.m_oFreeBtn.active = false
            // this.m_oGoldBtn.active = true
        }
    },
    onFreeClick:function(){
        if (Gm.bagData.checkEquip(Gm.config.getConst("drop_bag_size_limit"))){
            var group = 1
            if (Gm.guideData.checkBranch(group)){
                this.onBack()
                Gm.send(Events.BRANCH_ENTER,{group:group})
            }else{
                Gm.box({msg:Ls.get(70054),ok:Ls.get(70055),cancel:Ls.get(70056),onlyBtn:true},(btnType)=>{
                    if (btnType == 1){
                        Gm.battleNet.quickFight()
                    }else{
                        this.onBack()
                        Gm.ui.getScript("MainView").showBag()
                    }
                })
            }
        }else{
            Gm.battleNet.quickFight()
        }
    },
    onOkClick:function(){
        if (this.selectType == TYPE_DROP){
            var time = Gm.userData.getPassTime(Gm.userInfo.lastGuaJiAwardTime)
            if (time < this.m_iInterval || time >= this.m_iMaxTime){
                this.clearDrop()
            }else{
                Gm.battleNet.gjAward()
            }
        }else{
            var con = Gm.config.getVip()
            if (con.fastBattleCount > Gm.userInfo.fastFightTimes){
                var need = Gm.config.buy(Gm.userInfo.fastFightTimes+1).fastBattlecost

                if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:need})){
                    this.onFreeClick()
                }
            }
        }
    },
    onNoClick:function(){
        if (this.selectType == TYPE_DROP){
            this.onOkClick()
        }else{
            this.onBack()
        }
    },
    onBack(){
        if (this.m_oData.awardTime > 0 && this.m_oExpCell && this.m_oExpCell.node){
            ActionFunc.moveItems({nodes:this.m_oItemScroll.content.children})
        }
        this.clearTime()
        this._super()
    },
    updateRefreshTime:function(){
        if (this.selectType == TYPE_DROP){
            var time = Gm.userData.getPassTime(Gm.userInfo.lastGuaJiAwardTime)
            if (this.m_iInterval){
                if (time % this.m_iInterval == 0){
                    this.updateGjAward()
                }
            }
            if (this.m_oData && this.m_oData.awardTime){
                time = time + this.m_oData.awardTime
            }
            if (time > this.m_iMaxTime){
                time = this.m_iMaxTime
            }
            this.m_oTimeLab.string = Func.timeToTSFM(time)
        }else{
            var time = Func.translateTime(Gm.missionData.dailyClearTime,true)
            if (time >= 0){
                this.m_oResetLabel.string = "<color=#fffc00><outline color=#000000 width=3>"+Ls.get(50116)+"</outline></c><color=#00ff00><outline color=#000000 width=3>"+Func.timeToTSFM(time)+"</outline></color>"
            }
        }
    },
    checkBlank:function(data){
        var isBlank = data?data.drop.item.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },    
    setBlankTip:function(isVisible){
        if(this.m_oBlankTipNode){
            this.m_oBlankTipNode.active = isVisible
        }
    }
});

