var BaseView = require("BaseView")

const TimeType = cc.Enum({
    END: 1,
    UNLOCK: 2,
    SHOP_END: 3,
});

cc.Class({
    extends: BaseView,
    properties: {
        roleBg:cc.Sprite,
        titleLab:cc.Label,
        PictureItem:cc.Prefab,
        heroPic:cc.Sprite,
        lineNode:cc.Node,
        yunNode:cc.Node,

        timeRich:cc.RichText,
        numRich:cc.RichText,
        leftBtn:cc.Button,
        rightBtn:cc.Button,
        
        nextBtn:cc.Node,
        nextBtnLab:cc.Label,

        chessBtn:cc.Node,
        //guide
        m_oSelet1:cc.Node,
        m_oSelet2:cc.Node,
        //guide
    },
    onLoad () {
        this._super()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    onEnable(){
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.titleLab.string = Ls.get(args.treasure?10:11)

            this.leftBtn.node.active = !args.treasure
            this.rightBtn.node.active = !args.treasure

            var imgStr = args.treasure?"jigsaw_img_fanp1":"jigsaw_img_fanp"
            Gm.load.loadSpriteFrame("img/jigsaw/"+imgStr,function(sp,icon){
                icon.spriteFrame = sp
            },this.roleBg)
            
            Gm.red.add(this.chessBtn,args.treasure?"miJing":"picture","all")
            
            if (Gm.pictureData.getNowId(args.treasure) == 0){
                Gm.gamePlayNet.enter(args.treasure)
                return
            }
            this.onUpdateView()
        }
    },
    register:function(){
        // this.events[MSGCode.OP_RANK_INFO_S] = this.onRankInfo.bind(this)
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
    },
    onLogicSuss(){
        Gm.gamePlayNet.enter(this.openData.treasure)
    },
    onUpdateView(){
        this.nowId = Gm.pictureData.getNowId(this.openData.treasure)
        this.updateView()
    },
    updateView(){
        this.conf = Gm.config.getPicturePuzzle(this.nowId)
        this.groups = Gm.config.getPicturePuzzleGroup(this.conf.group)
        this.groups.sort(function(a,b){
            return a.id - b.id
        })

        this.changeLine()
        this.removeAllPoolItem(this.lineNode)

        this.nowRow = Gm.pictureData.getNowRow(this.openData.treasure,this.conf.type)


        var nowPosList = PictureFunc.getYunPos()[this.conf.type]
        for (var i = 0; i < this.yunNode.children.length; i++) {
            var yun = this.yunNode.children[i]
            if (this.nowRow >= i || i >= this.conf.type){
                yun.active = false
            }else{
                yun.y = nowPosList[i]
                yun.active = true
                yun.opacity = 255
                var str = cc.js.formatStr("img/jigsaw/img_%sx%s_yun",this.conf.type,this.conf.type)
                Gm.load.loadSpriteFrame(str,function(sp,icon){
                    icon.spriteFrame = sp
                },yun.getComponent(cc.Sprite))
                if (this.nowRow+1 == i){
                    yun.opacity = 255*0.55
                }
            }
        }

        this.lineNode.active = true
        this.posConf = Gm.config.getPuzzlePos(this.conf.type)
        for (let index = 0; index < this.posConf.length; index++) {
            const posData = this.posConf[index];
            var eventGroupId = this.conf.eventGroup[index]
            var itemData
            if (this.nowId == Gm.pictureData.getNowId(this.openData.treasure)){
                itemData = Gm.pictureData.getFloorInfoByStageId(index,this.openData.treasure)
            }
            var item =  this.getPoolItem()
            this.lineNode.addChild(item)
            var itemSp = item.getComponent("PictureItem")
            itemSp.setData(posData,eventGroupId,itemData,this,index)
            if (index == this.posConf.length - 13){//guide
                this.m_oSelet1.x = item.x
                this.m_oSelet1.y = item.y
                this.m_oSelet1.width = item.width
                this.m_oSelet1.height = item.height
                Gm.send(Events.GUIDE_ENTER_DONE,{sender:this})
            }
        }
        
        this.leftBtn.interactable = this.conf.pre != 0 && this.conf.id > Gm.pictureData.getNowId()
        this.rightBtn.interactable = this.conf.aft != 0

        this.isLock = false//是否解锁
        this.isPast = false //是否过期
        this.numRich.string = ""
        this.nextBtn.active = false
        var completeNum = this.getCompleteNum()
        // cc.log(completeNum,this.posConf.length)
        // cc.log(this.nowId,Gm.pictureData.getNowId(this.openData.treasure),"wwwwwwww",this.conf)
        if (completeNum == this.posConf.length+1){ //boss已打完-可进入下一层
            this.lineNode.active = false
            this.nextBtn.active = true
            this.nextBtnLab.string = Ls.get(2305)
            // if (this.openData.treasure){
            //     this.setTimeData()
            //     return
            // }
            if(this.conf.aft == 0){
                this.nextBtn.active = false
                this.numRich.string = Ls.get(2306)
                this.isPast = true
                this.setTimeData(TimeType.SHOP_END,Gm.config.getConst("picture_puzzle_end_time_all"))
            }else{
                var nextConf = Gm.config.getPicturePuzzle(this.conf.aft)
                if (this.conf.type != nextConf.type){
                    this.nextBtnLab.string = Ls.get(2307)
                }
                this.updateEndTime()
            }
        }else {
            var openTime = Func.newConfigTime(this.conf.openTime)
            if (openTime > Gm.userData.getTime_m() && !this.openData.treasure){ //未开启
                this.isLock = true
                this.setTimeData(TimeType.UNLOCK,this.conf.openTime)
                this.numRich.string = ""
                if (this.conf.pre != 0){
                    this.updatePreUnlock()
                }
            }else{
                if (completeNum == this.posConf.length){//普通已打完-打boss
                    this.nextBtn.active = true
                    this.nextBtnLab.string = Ls.get(2308)
                }else{
                    if (this.isNowId()){
                        var textColor = "<outline color=#000000><color=#ffffff>%s%s/%s</c></outline>"
                        var gColor = cc.js.formatStr("<color=#55FE87>%s</c>",this.getCompleteNum(true))
                        this.numRich.string = cc.js.formatStr(textColor,Ls.get(2309),gColor,this.posConf.length)
                    }else{
                        this.isLock = true
                        this.updatePreUnlock()
                    }
                }
                this.updateEndTime()
            }
        }
    },
    isNowRow(index){
        return this.nowRow >= Math.floor(index/this.conf.type)
    },
    //子类继承
    getBasePoolItem(){
        return this.PictureItem
    },
    updatePreUnlock(){
        var preConf  = Gm.config.getPicturePuzzle(this.conf.pre)
        this.numRich.string = cc.js.formatStr(Ls.get(5215),preConf.name)
    },
    getCompleteNum(isReal){
        if (!this.isNowId()){
            return 0
        }
        return Gm.pictureData.getStageCompleteNum(this.openData.treasure,isReal)
    },
    isNowId(){
        return this.nowId == Gm.pictureData.getNowId(this.openData.treasure)
    },
    updateEndTime(){
        var endTime
        var nextConf = this.getNextTypeConf()
        //后置难度开启时间。过期的话就是最终时间
        if (nextConf && Func.newConfigTime(nextConf.openTime) > Gm.userData.getTime_m()){
            endTime = nextConf.openTime
        }else{
            endTime = Gm.config.getConst("picture_puzzle_end_time_event")
            if (Gm.userData.getTime_m() > Func.newConfigTime(endTime)){
                //已过期，设置商城过期时间
                this.isPast = true
                this.setTimeData(TimeType.SHOP_END,Gm.config.getConst("picture_puzzle_end_time_all"))
                return
            }
        }
        this.setTimeData(TimeType.END,endTime)
    },
    setTimeData(type,time){
        if (this.openData.treasure){
            this.isPast = false
            this.isLock = false
            this.timeShowType = TimeType.END
            this.time = Gm.pictureData.getMiJingEndTime()
            this.updateTime()
            return
        }
        this.timeShowType = type 
        this.time = Func.newConfigTime(time)
        this.updateTime()
    },
    updateTime(){
        if (this.timeShowType){
            var str = ""
            var co = "<outline color=#000000><color=#FFF4DE>%s</c><color=#%s>%s</color></outline>"
            var timeCo = "BCFD7B"
            if (this.timeShowType == TimeType.END){
                str = 2310//"结束时间："
            }else if (this.timeShowType == TimeType.UNLOCK){
                str = 2311//"解锁时间："
                timeCo = "FF0000"
            }else if (this.timeShowType == TimeType.SHOP_END){
                str = 2312//"商城关闭时间："
            }

            var tTime = Func.translateTime(this.time,true)
            this.timeRich.string = cc.js.formatStr(co,Ls.get(str),timeCo,AtyFunc.timeToTSFMzh(tTime,true))
        }
    },
    getNextTypeConf(){
        for (let index = 0; index < this.groups.length; index++) {
            const v = this.groups[index];
            if (v.type == this.conf.type+1){
                return v
            }
        }
    },
    changeLine(){
        // var lineStr = cc.js.formatStr("jigsaw_fp_%sx%s",this.conf.type,this.conf.type)
        // Gm.load.loadSpriteFrame("img/jigsaw/"+lineStr,(sp)=>{
        //     this.lineNode.getComponent(cc.Sprite).spriteFrame = sp
        // })
    },
    onLeftBtn(){
        this.nowId = Gm.config.getPicturePuzzle(this.conf.pre).id
        this.updateView()
        // this.changeMap(2)
    },
    onRightBtn(){
        this.nowId = Gm.config.getPicturePuzzle(this.conf.aft).id
        this.updateView()
        // this.changeMap(1)

    },
    changeMap(type){
        Gm.gamePlayNet.changeMap(type,this.openData.treasure)
    },
    onNextBtn(){
        var completeNum = Gm.pictureData.getStageCompleteNum(this.openData.treasure)
        if (completeNum == this.posConf.length+1){ //boss已打完-可进入下一层
            var nextConf = Gm.config.getPicturePuzzle(this.conf.aft)
            if (this.conf.type == nextConf.type){
                this.changeMap(0)    
            }else{
                this.changeMap(1)
            }
        }else if (completeNum == this.posConf.length){//普通已打完-打boss
            PictureFunc.showEventType(Gm.pictureData.getNowId(this.openData.treasure),this.posConf.length,this.openData.treasure)
        }
    },
    onResurgenceBtn(){
        if (this.isPast){
            Gm.floating(Ls.get(5223))
            return
        }
        Gm.ui.create("PictureReviveView",{treasure:this.openData.treasure})
    },
    onResetBtn(){
        if (this.isLock){
            Gm.floating(Ls.get(2329))
            return
        }
        if (this.isPast){
            Gm.floating(Ls.get(5223))
            return
        }
        Gm.box({title:Ls.get(2313),msg:Ls.get(2314)},(btnType)=>{
            if (btnType == 1){
                Gm.gamePlayNet.resetPic(this.openData.treasure)
            }
        })
    },
    onHeChengBtn(){
        if (this.isPast){
            Gm.floating(Ls.get(5223))
            return
        }
        Gm.ui.create("PictureChessView",{treasure:this.openData.treasure})
    },
    onShopBtn(){
        Gm.ui.jump(this.openData.treasure?90006:90100)
    },
    onInfoClick(){
        Gm.ui.create("PictureHelpView",{treasure:this.openData.treasure})
    },
    onGuide:function(){
    },
    getClick:function(destName){
        if (destName == "m_oSelet1" || destName == "m_oSelet2"){
            return "onGuide"
        }
    },
    getSceneData:function(){
        return {treasure:this.openData.treasure}
    },
});

