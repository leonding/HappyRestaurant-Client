var BaseView = require("BaseView")
// SportsModelSelectView
cc.Class({
    extends: BaseView,

    properties: {
        bgSprite:cc.Sprite,
        titleName:cc.Label,
        boxPerfab:cc.Prefab,
        boxNode:cc.Node,
        endBoxSpirte:cc.Node,
        //上部分的进度条
        progressNode:cc.Node,
        progressItemNode:cc.Node,
        progressItemsContent:cc.Node,
        progressBar:cc.ProgressBar,
        //中间的pageView
        pageView:cc.PageView,
        pageViewItem:cc.Node,
        indictorNode:cc.Node,
        indictorNodeItem:cc.Node,
        sportsBtn:cc.Node,
        unlockChapter:cc.Prefab,
    },
    onLoad () {
        this._super()
        this.titleName.string = this.openData.name
        let self = this
        this.pageView.node.on("page-turning",function(pageView){
            var pageIndex = self.pageView.getCurrentPageIndex()
            self.onPageTurning(Math.min(pageIndex,self.maxIndex))
        })
        this.indictorArray = []
        this.progressItems = []
        this.pageItems = []
        this.config = Gm.config.getAllianceIslandsMonsterConfigByGroup(this.openData.group)
        Gm.red.add(this.sportsBtn,"union","taskFinished")
        var tmpBox = cc.instantiate(this.boxPerfab)
        this.m_oBoxing = tmpBox.getComponent(cc.Animation)
        this.boxNode.addChild(tmpBox)
        this.data = this.openData
        var islandConfig = Gm.config.getAllianceIslandsConfigById(this.data.group)
        Gm.load.loadSpriteFrame("img/bossbattle/" + islandConfig.bg,
                function(sp,icon){
                    if (icon && icon.node){
                        icon.spriteFrame = sp
                    }
                }
         ,this.bgSprite)
    },
    register(){
        this.events[Events.SPORTS_TOWER_INFO] = this.enableUpdateView.bind(this)
        this.events[Events.SPORTS_TOWER_UPDATE] = this.updateView.bind(this)
        //this.events[Events.SPORTS_UPDATE_BOX] = this.updateBox.bind(this)
        this.events[Events.SPORTS_SHOW_NEWCHAPTER] = this.showNewChapter.bind(this)
    },
    scrollToPage(page){
        page = Math.min(page,this.maxIndex)
        cc.log("scrollToPage=",page)
        var self = this
        setTimeout(() => {
            if(self.node && self.node.isValid){
                self.pageView.scrollToPage(page)
                self.onPageTurning(page)
            }
        }, 0.01);
    },
    enableUpdateView:function(data){
        var tdata = Gm.unionData.getIslandData(this.data.group)
        if(!tdata){
            Gm.unionNet.enterIslandInfo(this.data.group)
        }
        else{
            this.progressData = Gm.unionData.getProgressData(this.data.group) 
            this.maxIndex = this.getMaxPageIndex()
            this.addProgressNode()
            this.addPageView()
            if(this.data.pageIndex){
                 this.scrollToPage(this.data.pageIndex)
                 this.data.pageIndex = null
            }
            else{
                this.scrollToPage(Math.min(this.getPageIndex(),this.maxIndex ))
            }
            this.updateView()
        }
    },
    getMaxPageIndex(){
        var tempArray = []
        tempArray[0] = 0
        for(var i=0;i<this.progressData.pointsArray.length;i++){
            tempArray.push(this.progressData.pointsArray[i])
        }
        for(var i=1;i<tempArray.length-1;i++){
            if(this.progressData.currentPoints>=tempArray[i-1] && this.progressData.currentPoints<tempArray[i]){
                return i-1
            }
        }
        return tempArray.length-2
    },
    addProgressNode:function(){
        var pointsArray = this.progressData.pointsArray
        var maxValue = pointsArray[pointsArray.length-1]
        var minValue = pointsArray[0]
        var currentPoints = this.progressData.currentPoints
        var percent = this.cacluePercent(maxValue,minValue,currentPoints)
        this.progressBar.progress = percent

        var item = this.addProgressBox(currentPoints,currentPoints)
        item.x = 0
        item.y = 0
        var islandConfig = Gm.config.getAllianceIslandsConfigById(this.data.group)
        Gm.load.loadSpriteFrame("/img/items/" + islandConfig.scoreIcon,function(sf,sp){
                    if (sp && sp.node && sp.node.isValid){
                        sp.spriteFrame = sf
                        sp.node.scale = 0.8
                    }
                },item.getChildByName("selectSprite").getComponent(cc.Sprite))
        this.progressItemsContent.addChild(item)
        this.currentPointsItem = item
        for(var i=0;i<pointsArray.length;i++){
            var item = this.addProgressBox(pointsArray[i],currentPoints)
            item.x = this.progressItemsContent.width * this.cacluePercent(maxValue,minValue,pointsArray[i])
            item.getComponent("ProgressItemNode").setData({index:i,callback:this.updateBox.bind(this)})
            this.progressItemsContent.addChild(item)
            this.progressItems.push(item)
        }
    },
    addProgressBox(points,currentPoints){
        var item =  cc.instantiate(this.progressItemNode)
        item.x = 0
        item.y = 0
        item.active = true
        item.getChildByName("numLabel").getComponent(cc.Label).string = points
        return item
    },
    cacluePercent(maxValue,minValue,currentPoints){
        return currentPoints/maxValue
    },
    

    addPageView:function(){
        for(var i=0;i<this.progressData.pointsArray.length;i++){
            if(i<=this.maxIndex){
                var item = cc.instantiate(this.pageViewItem)
                item.active = true
                this.addSkeleton(item,i)
                this.pageView.addPage(item)
                this.pageItems.push(item)
            }
            this.addPageIndictor()
        }
    },
    getMonsterId(i,j){
        for(var z=0;z<this.config.length;z++){
            if(this.config[z].score == i+1 && this.config[z].earnings == j+1){
                return checkint(this.config[z].monsterId[0])
            }
        }
    },
    getSkeletonName:function(monsterId){
         var heroConfig = Gm.config.getMonster(monsterId)
         var heroData = Gm.config.getHero(0,heroConfig.heroQualityID)
         var skinConf = Gm.config.getSkin(heroData.skin_id)//(heroData && heroData.skin) || 
        return skinConf.dwarf
    },
    addSkeleton:function(item,i){
        for(var j=0;j<3;j++){
            var tconfig = Gm.config.getAllianceIslandsMonsterConfigByEarningsID(this.data.group,i+1,j+1)
            var spinNode = item.getChildByName("spinNode" + (j+1)).getComponent(sp.Skeleton)
            spinNode.node.scale = 0.85 * (tconfig.scale || 1)
            spinNode.node.x =   item.getChildByName("itemNode" + (j+1)).x  +  (tconfig.offset || 0)
            var name = this.getSkeletonName(this.getMonsterId(i,j))
            Gm.load.loadFight(name,(sp,owner)=>{
                setTimeout(() => {
                    if(owner && owner.node && owner.node.isValid){
                        owner.skeletonData = sp
                        owner.setAnimation(0, "idle", true)
                    }
                }, 0.01);
            },spinNode)
        }
    },
    addPageIndictor:function(){
        var item = cc.instantiate(this.indictorNodeItem)
        item.active = true
        this.indictorNode.addChild(item)
        this.indictorArray.push(item)
    },
    onPageTurning:function(index){
        for(var i=0;i<this.indictorArray.length;i++){
            if(i == index){
                this.showIndictorSelect(this.indictorArray[i],true,i)
            }
            else{
                this.showIndictorSelect(this.indictorArray[i],false,i)
            }
        }
    },
    showIndictorSelect(item,key,i){
        if(i<=this.maxIndex){
            if(item.getChildByName("tishiSprite3")){//播放动画
                //item.getChildByName("tishiSprite3").getComponent(cc.Animation).play("jiesuo")
                item.getChildByName("tishiSprite3").active = false
                item.getChildByName("tishiSprite1").active = !key
                item.getChildByName("tishiSprite2").active  = key
            }
            else{
                item.getChildByName("tishiSprite3").active = false
                item.getChildByName("tishiSprite1").active = !key
                item.getChildByName("tishiSprite2").active  = key
            }
        }
        else{
            item.getChildByName("tishiSprite3").active = true
            item.getChildByName("tishiSprite1").active =  false
            item.getChildByName("tishiSprite2").active  = false
        }
    },

    //更新的函数
    updateView(data){
        var tdata = Gm.unionData.getIslandData(this.data.group)
        if(!tdata){
            return
        }
        if(data){
            this.progressData = Gm.unionData.getProgressData(this.data.group) 
            var maxIndex = this.getMaxPageIndex()
            if(this.maxIndex < maxIndex){
                this.addPageItem(this.maxIndex,maxIndex)
                this.maxIndex = maxIndex
                //this.scrollToPage(this.pageView.getCurrentPageIndex())
                this.onPageTurning(this.pageView.getCurrentPageIndex())
            }
        }
        this.updatePageView()
        this.updateProgress()
        setTimeout(() => {
            if(this.node && this.node.isValid){
                var index = this.boxIndex
                if(typeof(index)!="number"){
                    index = this.pageView.getCurrentPageIndex()
                }
                this.updateBox(index)
            }
        }, 0.02);
    },
    updateBox(index){
        cc.log("updateBox=",index)
        if( typeof(index)=="number"){
             this.boxIndex = index
        }
        this.updateProgressBtnSelect(this.boxIndex )
        if(this.progressData.pointsArray[index] <= this.progressData.currentPoints){//可以领取
               if(Gm.unionData.isReciveReward(this.data.group,index+1)){//已经领取
                    this.setBox(3)
               }
               else{//没有领取
                    this.setBox(2)
               }
        }
        else{//不可以领取
            this.setBox(1)
        }
    },
    updateProgressBtnSelect(index){
        for(var i=0;i<this.progressItems.length;i++){
            var item = this.progressItems[i]
            if(i==index){
                item.getChildByName("select2Sprite").active = true
            }
            else{
                item.getChildByName("select2Sprite").active = false
            }
        }
    },
    setBox:function(type){
        if(type==1){//没有达成
            this.m_oBoxing.stop("baox_1")
            this.m_oBoxing.node.getChildByName("baox_1").active = false
            this.endBoxSpirte.active = true
            this.endBoxSpirte.scale = 1.5
            Gm.load.loadSpriteFrame("clips/boxing/baox_1",function(sf,sp){
                if (sp && sp.node && sp.node.isValid){
                    sp.spriteFrame = sf
                }
            },this.endBoxSpirte.getComponent(cc.Sprite))
        }
        else if(type == 2){//可以领取
            this.m_oBoxing.play("baox_1")
            this.endBoxSpirte.active = false
        }
        else{
            this.m_oBoxing.stop("baox_1")
            this.m_oBoxing.node.getChildByName("baox_1").active = false
            this.endBoxSpirte.active = true
            this.endBoxSpirte.scale = 1.3
            Gm.load.loadSpriteFrame("/img/league/jingji/league_img_bx1",function(sf,sp){
                if (sp && sp.node && sp.node.isValid){
                    sp.spriteFrame = sf
                }
            },this.endBoxSpirte.getComponent(cc.Sprite))
        }
    },
    addPageItem(number1,number2){
        for(var i=number1+1;i<=number2;i++){
            var item = cc.instantiate(this.pageViewItem)
            item.active = true
            this.addSkeleton(item,i)
            this.pageView.addPage(item)
            this.pageItems.push(item)
        }
    },
    //更新PageView
    updatePageView(){
        for(var i=0;i<this.pageItems.length;i++){
            var pageItem = this.pageItems[i]
            for(var j=0;j<3;j++){
                var item = pageItem.getChildByName("itemNode" + (j+1))
                var config = Gm.config.getAllianceIslandsMonsterConfigByEarningsID(this.data.group,i+1,j+1)
                if(config){
                    item.getComponent("SportsModelSelectItem").setData({pageIndex:i+1})
                    item.getChildByName("clearSprite").active = !Gm.unionData.hasFirstPassReward(config.id)
                }
            }
        }
    },
    //更新进度条
    updateProgress(){
        this.currentPointsItem.getChildByName("numLabel").getComponent(cc.Label).string = this.progressData.currentPoints
        for(var i=0;i<this.progressItems.length;i++){
            var item = this.progressItems[i]
            var points = checkint(item.getChildByName("numLabel").getComponent(cc.Label).string)
            item.getChildByName("selectSprite").active  = this.progressData.currentPoints>=points
            item.getChildByName("getSprite").active = Gm.unionData.isReciveReward(this.data.group,i+1)
            item.getChildByName("reDSprite").active = this.canRecive(i)
        }

        var pointsArray = this.progressData.pointsArray
        var maxValue = pointsArray[pointsArray.length-1]
        var minValue = pointsArray[0]
        var currentPoints = this.progressData.currentPoints
        var percent = this.cacluePercent(maxValue,minValue,currentPoints)
        this.progressBar.progress = percent
    },
    canRecive(index){
           if(this.progressData.pointsArray[index] <= this.progressData.currentPoints){//可以领取
               if(!Gm.unionData.isReciveReward(this.data.group,index+1)){//已经领取
                    return  true
               }
           }
           return false
    },

    //按钮点击
    onRankBtnClick(){
        cc.log("onRankBtnClick")
        Gm.ui.create("SportsRankView",true)
    },
    onLogBtnClick(){
        cc.log("onLogBtnClick")
    },
    onBagBtnClick(){
        Gm.ui.create("SportsBagView",true)
    },
    //联盟竞技任务
    onSportsBtnClick(){
        cc.log("onSportsBtnClick")
        Gm.ui.create("SportsMissionView",true,function(){
            // Gm.unionNet.sportsTaskInfo()
        })
    },
    onOkBtnClick(sender,model){
        var js = sender.target.getParent().getComponent("SportsModelSelectItem")
        if(js && js.getData){
            var data = js.getData()
            var index = data.pageIndex
            var config = Gm.config.getAllianceIslandsMonsterConfigByEarningsID(this.data.group,index,model)
            Gm.ui.create("MonsterTeamView",{group:this.data.group,id:config.id,floorIndex:index,model:model})
        }
    },
    getReward(){
           var temp = [] 
            var scoreConfig = Gm.config.getAllianceIslandsConfigById(this.data.group)
            for(var i=0;i<scoreConfig.scores.length;i++){
                if(!Gm.unionData.isReciveReward(this.data.group,i+1)){
                    var tconfig = Gm.config.getAllianceIslandRewardConfig(this.data.group,i+1)
                    for(var j=0;j<tconfig.reword.length;j++){
                        temp.push(tconfig.reword[j])
                    }
                    break
                }
            }
            var earnings = []
            for(var i in temp){
                earnings.push(temp[i])
            }
            return earnings
    },
    onRewardClick(){//有没有可领取的
        cc.log("onRewardClick")
         if(this.progressData.pointsArray[this.boxIndex] <= this.progressData.currentPoints){//可以领取
               if(Gm.unionData.isReciveReward(this.data.group,this.boxIndex+1)){//已经领取
                    Gm.floating(5312)
               }
               else{//没有领取
                    var config = Gm.config.getAllianceIslandRewardConfig(this.data.group,this.boxIndex+1)
                    var self = this 
                    var callback = function(){
                        Gm.unionNet.getReward(config.id)
                    }
                    Gm.ui.create("SportsRewardAction",{callback:callback})
               }
        }
        else{//不可以领取
            var config = Gm.config.getAllianceIslandRewardConfig(this.data.group,this.boxIndex+1)
            if(config.reword.length >0){
                // Gm.ui.create("IslandPreview",{name:this.data.name,earnings:config.reword})
                Gm.award({award:config.reword})
            }
        }
    },
    onBack:function(){
        this._super()
        Gm.ui.getScript("UnionSportsView").updateView()
    },
    getPageIndex(){
        var monsterConfig =  Gm.config.getAllianceIslandsMonsterConfigByGroup(this.data.group)
        for(var i=0;i<monsterConfig.length;i++){
            if(Gm.unionData.hasFirstPassReward(monsterConfig[i].id)){
                return monsterConfig[i].score - 1
            }
        }
        return 0
    },
    showNewChapter(){
        Gm.unionData.needShowNewChapter = true
        this.checkShowNewChapter()
    },
    checkShowNewChapter(){
        if( Gm.unionData.needShowNewChapter){
            if(Gm.ui.isExist("FightTeamView") ||  Gm.ui.isExist("BattleView") || Gm.ui.isExist("MonsterTeamView") || Gm.ui.isExist("BattleLoadView")){
                return
            }
            Gm.unionData.needShowNewChapter  = false
            Gm.ui.create("NewChapterAction",true)
        }
    },
    getSceneData:function(){
        this.data.pageIndex = this.pageView.getCurrentPageIndex()
        return this.data
    },
});

