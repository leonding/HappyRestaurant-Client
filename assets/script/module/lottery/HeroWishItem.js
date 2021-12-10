cc.Class({
    extends: cc.Component,

    properties: {
        itemNode:cc.Node,
        checkNode:cc.Node,
        consumeCheck:cc.Node,
        maxLab:cc.Label,
    },
    setData(data,owner){
        this.data = data
        this.owner = owner
        if (this.itemBase == null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode,true)
            this.itemBase.setTips(false)
        }
        // this.updateHero(data)
        this.consumeCheck.scale = this.itemBase.node.scale
        // this.checkNode.scale = this.itemBase.node.scale
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.itemNode)
        }
        this.isRed = false
    },
    updateHero(dd){
        this.conf = this.itemBase.updateHero(dd)
        this.data = dd
        this.node.data = dd
        this.updateMaxNode()    
        this.setGetSprite(dd.without)
        this.setNActivitySprite()
    },
    setGetSprite(key){
        this.node.getChildByName("getSprite").active = !key
    },
    setNActivitySprite(){
        this.node.getChildByName("nAcSprite").active = !Gm.lotteryData.isActivateHero(this.owner.fileId,this.data.qualityId)
    },
    updateMaxNode(){
        this.maxLab.node.active = this.isMaxQuality()
        // this.setLock(true)
        if(this.isMaxQuality()){
            this.itemBase.updateLock(true)
            this.itemBase.updateLockCheck(false)
        }
    },
    isMaxQuality(){
        var maxQuality = this.conf.qualityProcess[this.conf.qualityProcess.length-1]
        return this.data.qualityId == maxQuality || this.conf.quality == Gm.config.getConst("hero_synthetise_quality_max")
    },
    setState(state){ //0无选择状态，1，材料，2,不符合条件、当前条件人数已满足 
        this.state = state
    },
    hideRed(){
        this.redNode.active = false
    },
    recoverRed(){
        this.redNode.active = this.data.isRed
    },
    onClick(){
        if (this.isMaxQuality()){
            Gm.floating(5266)
            return
        }
        if (this.state == 2){
            if (this.isNeed){
                Gm.floating(5267)
                return
            }
            Gm.floating(5268)
            return
        }
        
        if (this.state == 1){
            var lockType = this.flyLockType()
            if(lockType == 0 || this.consumeCheck.active){
                this.changeConsume()
            }else if (lockType == 1){
                Gm.floating(5269)
            }else if (lockType == 2){
                var str = 5270
                if (Gm.heroData.isline(ConstPb.lineHero.LINE_BOSS,this.data.heroId)){
                    str = 5271
                }
                Gm.box({msg:Ls.get(str)},(btnType)=>{
                    if (btnType == 1){
                        Gm.heroNet.heroLock(this.data.heroId,false)
                    }
                })
            }else if (lockType == 3){
                // Gm.floating("关卡阵容")
                Gm.box({msg:Ls.get(5243)},(btnType)=>{
                    if (btnType == 1){
                        this.changeConsume()
                    }
                })
            }
            return
        }
        this.owner.onItemClick(this)
    },
    changeConsume(){
        this.setSelectConsume(!this.consumeCheck.active)
        this.owner.onItemConsumeClck(this,this.consumeCheck.active)
    },
    setCheck(flag){
        this.itemBase.updateLock(flag)
    },
    setSelectConsume(flag){
        this.consumeCheck.active = flag
        this.itemBase.updateLock(flag)
        this.itemBase.updateLockCheck(!flag)
        this.checkNodeActive(!flag)
    },
    checkNodeActive(isShow){
        this.checkNode.active  = isShow
        this.checkNode.stopAllActions()
        this.checkNode.scale = this.itemBase.node.scale
        if (this.checkNode.active){
            var acList = new Array()
            var time = 1.5
            acList.push(cc.scaleTo(time,this.itemBase.node.scale+0.5))
            acList.push(cc.scaleTo(time,this.itemBase.node.scale))
            this.checkNode.runAction(cc.repeatForever(cc.sequence(acList)))
        }
    },
    hideAllCheck(){
        this.setState(0)
        this.setCheck(false)
        this.setLock(false)
        this.checkNodeActive(false)
        this.consumeCheck.active = false
        this.itemBase.updateLockCheck(true)
        this.recoverRed()
        this.updateMaxNode()
    },
    setLock(lock){
        this.itemBase.getBaseClass().lockNodActive(lock)
    },
    checkConsume(needList,hasIndex){
        this.costIndex = -1
        this.isNeed = false
        if (this.isMaxQuality()){
            return
        }
        this.setLock(false)
        for (var i = 0; i < needList.length; i++) {
            if (hasIndex[i]){//过滤掉已满足的条件
                continue
            }
            var v = needList[i]
            if (v.quality > 100){//具体品质
                if (v.quality == this.data.qualityId){
                    this.costIndex  = i
                    break
                }
            }else{
                if ( v.camp == 0 ||  v.camp == this.conf.camp){
                    if (this.conf.quality == v.quality){
                        this.costIndex  = i
                        break
                    }
                }
            }
        }
        if (this.costIndex != -1){
            if (this.flyLockType()  > 0 ){//锁定
                this.setLock(true)
            }
            this.setSelectConsume(false)
            this.setState(1)
        }else{
            this.changeLock()
        }
    },
    flyLockType(){
        return HeroFunc.flyLockType(this.data)
    },
    changeLock(){
        this.setLock(true)
        this.setState(2)
        if (this.checkNode.active){
            this.checkNode.active = false
            this.isNeed = true    
        }
    },
    setLabStr(labStr){
        this.itemBase.setLabStr(labStr)
    },
    setLabelFontSize(number){
        this.itemBase.setLabelFontSize(number)
        this.itemBase.setLabeLFontPositionY(3)
        this.itemBase.setCountLabAnchorX(1)
        this.itemBase.setCountLabPositionX(-8)
    },
});
