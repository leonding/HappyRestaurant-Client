var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        node101:cc.Node,
        node102:cc.Node,
        node103:cc.Node,
        node104:cc.Node,
        bottomListNode:cc.Node,

        ActivityPacketItem:cc.Prefab,
        noobScroll:cc.ScrollView,

        limitTimeScroll:cc.ScrollView,


        TimePackeUpItem:cc.Node,
        upScroll:cc.ScrollView,

        chapterScroll:cc.ScrollView,

        topNode:cc.Node,
        //upTimeDescLab:cc.Label,
        upTimeLab:cc.Label,
        limitTimeLab:cc.Label,
        buyBtn:cc.Button,
        buyBtnLab:cc.Label,

        //进度条 103
        barBaseNode:cc.Node,
        bar:cc.ProgressBar,
        numLayoutNode:cc.Node,
        numItem:cc.Node,

        //进度条 102
        barBaseLevelNode:cc.Node,
        barLevel:cc.ProgressBar,
        numLayoutLevelNode:cc.Node,
        numItemLevel:cc.Node,
    },
    onLoad () {
        this._super()
        this.selectType = -1

        this.pageNodes = {}

        this.listBtns = []
        for (let index =0; index <  this.bottomListNode.children.length ; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
            v.active = false
        }

        //动态开启 不能根据配置  得根据服务器数据
        var eventConf = Gm.activityData.data.planInfo || []//Gm.config.getEventTypeByType(1)

        //检测情人节限时礼包是否开启
        if(Gm.activityData.checkisOpenLimitGift()){
            eventConf[eventConf.length] = {}
            eventConf[eventConf.length-1].type =  AtyFunc.TYPE_TIME_LIMIT
        }

        var btnIndex = 0;
        for (let index  in eventConf) {
            const v = eventConf[index].type;
            var conf = Gm.config.getEventPay(v)
            var btn = this.bottomListNode.getChildByName("btn" + v)
            btnIndex = btnIndex+1
            btn.childType = v
            btn.active = true
            this["node" + v].active = Gm.activityData.checkIsOpen(v)
            if (conf.trigger == 1 &&  Gm.activityData.checkIsOpen(v)){//活动开关
                btn.getChildByName("New Label").getComponent(cc.Label).string = conf.name
                this.pageNodes[v] = this["node" + v]
            }else{
                btn.parent = null
            }
            if(v == AtyFunc.TYPE_TIME_UP){
                Gm.red.add(btn,"timeNoob","limitTimeShopLevel")
            }
            else if(v == AtyFunc.TYPE_TIME_CHAPTER){
                Gm.red.add(btn,"timeNoob","limitTimeShopChapter")
            }else if(v == AtyFunc.TYPE_TIME_LIMIT){
                Gm.red.add(btn,"limitNoob","all")
            }
            
        }
        if(Gm.activityData.checkisOpenLimitGift()){
            Gm.red.refreshEventState("limitNoob")
        }
    },
    select(type){
        if (this.selectType != type){
            if(this.selectType != -1) {//首次打开界面不播放音效
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = v.childType == type
                if (this.pageNodes[v.childType]){
                    this.pageNodes[v.childType].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                var lab = v.getChildByName("New Label")
                lab.color = isSelect?cc.color(255,248,188):cc.color(255,255,255)
                lab.getComponent(cc.LabelOutline).color = isSelect?cc.color(96,58,21):cc.color(0,0,0)
            }
            this.updateView()
        }
    },
    updateView(owner){
        if (owner){
            this.owner = owner
        }
        if(this.selectType==-1){
            this.setNewSelectedItem()
            return
        }

        //没有购买检测过期
        if(this.selectType == AtyFunc.TYPE_TIME_NOOB || this.selectType == AtyFunc.TYPE_TIME_UP || this.selectType == AtyFunc.TYPE_TIME_CHAPTER|| this.selectType == AtyFunc.TYPE_TIME_LIMIT){
            if(this.checkPassTime()){
                return
            }
        }
        
        //已经购买检测领取完
        if(this.selectType == AtyFunc.TYPE_TIME_UP || this.selectType == AtyFunc.TYPE_TIME_CHAPTER){
            if(this.checkGetFinished()){
                return
            }
        }

        if(this["updateNode" + (this.selectType)]){
            this["updateNode" + (this.selectType)]()
        }
        
        if(this.selectType == 103){
            this.owner.updateTopGril(102)
        }
        else{
            this.owner.updateTopGril(this.selectType)
        }
       
    },
    setNewSelectedItem(){
        for(let k=0;k< this.listBtns.length;k++){
            const btn1 = this.listBtns[k];
            if(btn1 && btn1.childType && btn1.childType != this.selectType && btn1.parent){
                this.select(btn1.childType)
                return
            }
        }
        Gm.activityData.clearPlayInfoData(AtyFunc.TYPE_TIME_NOOB)
        Gm.activityData.clearPlayInfoData(AtyFunc.TYPE_TIME_UP)
        Gm.activityData.clearPlayInfoData(AtyFunc.TYPE_TIME_CHAPTER)
        Gm.ui.removeByName("ActivityMainView")
        AtyFunc.openView()
    },
    //101、102和103调用
    checkPassTime(){
        if(this.selectType == AtyFunc.TYPE_TIME_NOOB ){
            if(Gm.activityData.getEndTime(this.selectType) <= Gm.userData.getTime_m()){
                for (let index = 0; index < this.listBtns.length; index++) {
                    const btn = this.listBtns[index];
                    if ( btn.parent && btn.childType == this.selectType){
                        Gm.activityData.clearPlayInfoData(this.selectType)
                        btn.parent = null
                        this.setNewSelectedItem()
                        break
                    }
                }
                return true
            }
            return false
        }
        if (!Gm.activityData.isPlanGrow(this.selectType)){//成长基金没有购买，检测过期
            for (let index = 0; index < this.listBtns.length; index++) {
                const btn = this.listBtns[index];
                if ( btn.parent && btn.childType == this.selectType && Gm.activityData.isPlanGrowPast(this.selectType)){
                    Gm.activityData.clearPlayInfoData(this.selectType)
                    btn.parent = null
                    this.setNewSelectedItem()
                    return true
                }
            }
        }

        if( this.selectType == AtyFunc.TYPE_TIME_LIMIT ){
            if(!Gm.activityData.checkisOpenLimitGift()){
                for (let index = 0; index < this.listBtns.length; index++) {//限时礼包过期
                    const btn = this.listBtns[index];
                    if ( btn.parent && btn.childType == this.selectType){
                        btn.parent = null
                        this.setNewSelectedItem()
                        break
                    }
                }
                return true
            }
            return false
        }

        return false
    },
    //102和103调用
    checkGetFinished(){
        if(Gm.activityData.isPlanGrow(this.selectType) && Gm.activityData.isAllReceive(this.selectType)){
            for (let index = 0; index < this.listBtns.length; index++) {
                const btn = this.listBtns[index];
                if ( btn.parent && btn.childType == this.selectType){
                    Gm.activityData.clearPlayInfoData(this.selectType)
                    btn.parent = null
                    this.setNewSelectedItem()
                    return true
                }
            }
        }
        return false
    },

    updateNode101(){
        if ( this.noobItems == null){
            this.noobScroll.content.destroyAllChildren()
            var list = Gm.config.getEventPayRewardStartLevel(AtyFunc.TYPE_TIME_NOOB,Gm.userInfo.level)
            list.sort(function(a,b){
                return  AtyFunc.getPrice(a.id) - AtyFunc.getPrice(b.id)
            })
            this.noobItems = []
            for (let index = 0; index < list.length; index++) {
                const itemData = list[index];
                var item = cc.instantiate(this.ActivityPacketItem)
                item.active = true
                this.noobScroll.content.addChild(item)

                var sp = item.getComponent("ActivityPacketItem")
                sp.setData(itemData,this)
                this.noobItems.push(sp)
            }
        }else{
            for (let index = 0; index < this.noobItems.length; index++) {
                const v = this.noobItems[index];
                v.updateItem()
            }
            this.noobScroll.content.getComponent("QueueShowAction").runQueueAction()
        }
        this.topNode.active = true
        this.buyBtn.node.active = false
        this.updateTime()
    },

    updateNode104(){
        if ( this.limitItems == null){
            this.limitTimeScroll.content.destroyAllChildren()
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_LIMIT)
            list.sort(function(a,b){
                return  AtyFunc.getPrice(a.id) - AtyFunc.getPrice(b.id)
            })
            this.limitItems = []
            for (let index = 0; index < list.length; index++) {
                const itemData = list[index];
                var item = cc.instantiate(this.ActivityPacketItem)
                item.active = true
                this.limitTimeScroll.content.addChild(item)

                var sp = item.getComponent("ActivityPacketItem")
                sp.setData(itemData,this)
                this.limitItems.push(sp)
            }
        }else{
            for (let index = 0; index < this.limitItems.length; index++) {
                const v = this.limitItems[index];
                v.updateItem()
            }
            this.limitTimeScroll.content.getComponent("QueueShowAction").runQueueAction()
        }
        Gm.activityData.openPage()
        Gm.red.refreshEventState("limitNoob")
        this.topNode.active = true
        this.buyBtn.node.active = false
        this.updateTime()
    },
    sortItems(list){
        list.sort(function(a,b){
            return a.id - b.id
        })
        return list
    },
    updateNode102(){
        var maxLevel = 1
        if (this.upItems == null){
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_UP)
            this.sortItems(list)
            this.upItems = []
            var allNum = 0

            for (let index = 0; index < list.length; index++) {
                 var itemNumber = cc.instantiate(this.numItemLevel)
                itemNumber.active = true
                itemNumber.x = 0
                this.numLayoutLevelNode.addChild(itemNumber)

                const itemData = list[index];
                var item = cc.instantiate(this.TimePackeUpItem)
                item.active = true
                this.upScroll.content.addChild(item)

                var sp = item.getComponent("TimePackeUpItem")
                sp.setData(itemData,this,itemNumber)
                this.upItems.push(sp)
                allNum = allNum + sp.getRewardNum()
            }
            this.upScroll.scrollToTop()

            this.upScroll.content.getComponent(cc.Layout).enabled = false
            this.upItems[0].node.zIndex = 1
            this.barBaseLevelNode.parent =    this.upItems[0].node
            this.barBaseLevelNode.active = true
            this.barBaseLevelNode.y = 0

            this.barLevel.totalLength = 145*(list.length-1)
            this.barLevel.node.height = 145*(list.length-1)
             this.setScrollViewContentOffset(this.upScroll,this.upItems)
        }else{
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_UP)
            this.sortItems(list)
            for (let index = 0; index < this.upItems.length; index++) {
                const v = this.upItems[index];
                v.setData(list[index],this)
            }
            //this.upScroll.scrollToTop()
            //this.upScroll.content.getComponent("QueueShowAction").runQueueAction()
        }
        Gm.activityData.checkShowRedItem()

        var sumDiamond = 0
        for (let index = 0; index < this.upItems.length; index++) {
            const v = this.upItems[index];
            sumDiamond = sumDiamond + v.getRewardNum()
        }
        
        // this.upSumLab.string = cc.js.formatStr("总计可获得%s钻石",sumDiamond)
        if (Gm.activityData.isPlanGrow(this.selectType)){
            this.buyBtnLab.string = Ls.get(5307)
           // this.upTimeLab.string = ""
           // this.upTimeDescLab.node.active = false
        }else{
            this.buyBtnLab.string = AtyFunc.getPriceStr(AtyFunc.PAY_CZJI)
            //this.updateTime()
        }
        this.topNode.active = true
        this.buyBtn.node.active = true
        
        this.barLevel.progress = (Gm.userInfo.level- list[0].receiveCondition[0].num)/(list[list.length-1].receiveCondition[0].num- list[0].receiveCondition[0].num)
    },
    updateNode103(){
        if ( this.chapterItems == null){
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_CHAPTER)
            this.sortItems(list)
            this.chapterItems = []
            var allNum = 0
            for (let index = 0; index < list.length; index++) {
                var itemNumber = cc.instantiate(this.numItem)
                itemNumber.active = true
                itemNumber.x = 0
                this.numLayoutNode.addChild(itemNumber)

                const itemData = list[index];
                var item = cc.instantiate(this.TimePackeUpItem)
                item.active = true
                this.chapterScroll.content.addChild(item)

                var sp = item.getComponent("TimePackeUpItem")
                sp.setData(itemData,this,itemNumber)
                this.chapterItems.push(sp)
                allNum = allNum + sp.getRewardNum()
            }
            this.chapterScroll.scrollToTop()

            this.chapterScroll.content.getComponent(cc.Layout).enabled = false
            this.chapterItems[0].node.zIndex = 1
            this.barBaseNode.parent =    this.chapterItems[0].node
            this.barBaseNode.active = true
            this.barBaseNode.y = 0
    
            this.bar.totalLength = 145*(list.length-1)
            this.bar.node.height = 145*(list.length-1)

             this.setScrollViewContentOffset(this.chapterScroll,this.chapterItems)   
        }else{
            var list = Gm.config.getEventPayReward(AtyFunc.TYPE_TIME_CHAPTER)
            this.sortItems(list)
            for (let index = 0; index < this.chapterItems.length; index++) {
                const v = this.chapterItems[index];
                v.setData(list[index],this)
            }
            //this.chapterScroll.scrollToTop()
            //this.chapterScroll.content.getComponent("QueueShowAction").runQueueAction()
        }
        Gm.activityData.checkShowRedItem()
        var sumDiamond = 0
        for (let index = 0; index < this.chapterItems.length; index++) {
            const v = this.chapterItems[index];
            sumDiamond = sumDiamond + v.getRewardNum()
        }
        
        // this.upSumLab.string = cc.js.formatStr("总计可获得%s钻石",sumDiamond)
        this.topNode.active = true
        this.buyBtn.node.active = true
        if (Gm.activityData.isPlanGrow(this.selectType)){
            this.buyBtnLab.string = Ls.get(5307)
            //this.upTimeLab.string = ""
            //this.upTimeDescLab.node.active = false
        }else{
            this.buyBtnLab.string = AtyFunc.getPriceStr(AtyFunc.PAY_ZJLB)
            //this.updateTime()
        }
        var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
        var maxConfigData = Gm.config.getMapById(list[list.length-1].receiveCondition[0].num)
        var minConfigData = Gm.config.getMapById(list[0].receiveCondition[0].num)
        this.bar.progress = (myConfigData.chapter - minConfigData.chapter -1) /  (maxConfigData.chapter - minConfigData.chapter)
    },
    onTopBtnClick(sender){
        this.select(sender.currentTarget.childType)
    },
    onUpBuyClick(){
        if (Gm.activityData.isPlanGrow(this.selectType)){
            Gm.floating(Ls.get(5307))
            return
        }
        if(this["onUpBuyClick" + (this.selectType)]){
            this["onUpBuyClick" + (this.selectType)]();
        }
    },
    onUpBuyClick102(){
        Gm.ui.create("ActivityTimeNoobBuyView",{type:AtyFunc.TYPE_TIME_UP,activityId:AtyFunc.PAY_CZJI})
    },
    onUpBuyClick103(){
        Gm.ui.create("ActivityTimeNoobBuyView",{type:AtyFunc.TYPE_TIME_CHAPTER,activityId:AtyFunc.PAY_ZJLB})
    },
    updateTime(){
        if(this.selectType == AtyFunc.TYPE_TIME_LIMIT ){
            this.updateLimitTime()
        }else{
            this.updateOtherTime()
        }
    },

    updateOtherTime(){
        if(!Gm.activityData.isPlanGrow(this.selectType)){
            var time = Gm.activityData.getEndTime(this.selectType) 
            if(Gm.userData.getTime_m()<time){
                time = Func.translateTime(time,true)
                this.upTimeLab.string = AtyFunc.timeToDayAndH(time,this.upTimeLab)
                // this.upTimeDescLab.node.active = true
            }else{
                //this.upTimeLab.string = Ls.get(5223)
                this.setExpired()
            }
        }
    },


    updateLimitTime(){
        if(Gm.activityData.checkisOpenLimitGift()){
            var time = Gm.activityData.getLimitGiftTime() 
            time = Func.translateTime(time,true)
            this.limitTimeLab.string = AtyFunc.timeToDayAndH(time,this.limitTimeLab)
        }else{
            this.setExpired()

        }
    },

    setExpired(){
        for (let index = 0; index < this.listBtns.length; index++) {
            const btn = this.listBtns[index];
            if ( btn.parent && btn.childType == this.selectType){
                Gm.activityData.clearPlayInfoData(this.selectType)
                btn.parent = null
                this.setNewSelectedItem()
                break
            }
        }
    }, 

    setItemNumber(item,key,data){
            if(item && this.selectType == AtyFunc.TYPE_TIME_CHAPTER ){
                var needConfigData = Gm.config.getMapById(data.receiveCondition[0].num)
                var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
                var label = item.getChildByName("New Label").getComponent(cc.Label)
                label.string = cc.js.formatStr(Ls.get(50015),needConfigData.chapter)
                this.setNumberITemStrColor(item,label,myConfigData.chapter > needConfigData.chapter)
            }
            else if(item && this.selectType == AtyFunc.TYPE_TIME_UP){
                var label = item.getChildByName("New Label").getComponent(cc.Label)
                label.string = "Lv." +  data.receiveCondition[0].num
                 this.setNumberITemStrColor(item,label,Gm.userInfo.level >= data.receiveCondition[0].num)
            }
            
    },
    setNumberITemStrColor(item,label,key){
            if(key ){
                    label.node.color = new cc.Color(255,255,255)
            }
            else{
                    label.node.color = new cc.Color(100,100,100)
            }
            item.getChildByName("pass_img_zst2").active = key
    },
    setScrollViewContentOffset(scrollView,items){
        //找到第一个可领取的item
        var item = null
        for(var i=0;i<items.length;i++){
            if(items[i].state == 2 || items[i].state == 4){
                item = items[i]
                break;
            }
        }
        // if(!item){//如果没有 找到可购买的item
        //     for(var i=0;i<items.length;i++){
        //         if(items[i].state == 3){
        //             item = items[i]
        //             break;
        //         }
        //     }
        // }
        if(!item){//如果没有 找到进行中的item
            for(var i=0;i<items.length;i++){
                if(items[i].state == 5){
                    item = items[i]
                    break;
                }
            }
        }
        if(item){//如果有 设置在顶部
            var y =  item.node.y
            scrollView.scrollToOffset(cc.v2(0,Math.abs(y+item.node.height/2)),0.5)
        }
    },
});

