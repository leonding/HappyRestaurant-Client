/**
 *Bingo页面
*/
var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        godlerLab:cc.Label,
        silverLab:cc.Label,
        m_oContent:cc.Node,
        m_oBinGoitem:cc.Prefab,
        m_oRewardPanel:cc.Node,
        m_oScrollView:cc.ScrollView,
        m_oListItem:cc.Node,
        m_oselectItemNode:cc.Node,
        m_pcardVeiwBg:cc.Node,
        m_pcardVeiwBg2:cc.Node,
        m_oBingoCount1:cc.Label,
        m_oBingoCount2:cc.Label,
        m_oTurn:cc.Label,
        animation:cc.Prefab,
        m_oTips:cc.Label,
        m_oOkBtn:cc.Button,
        m_oTimeLabel:cc.Label,
    },

    onLoad(){
        this._super()

        this.initData()
        this.initView()
        this.initOpenCard()

        this.m_oTurn.string = Gm.bingoData.getCurrentTurn() 

       if(!Gm.bingoData.getCurrentSelectReward()){
            this.playOpenCardAll()
            this.playSelectAnimation()
        }else{
            this.stopSelectAnimation()
        }
        this.updateTime()
    },
    initData(){

        var selectItem = Gm.bingoData.getCurrentSelectReward()
        selectItem = selectItem  == undefined ? {minTurn:-1,index:-1}:selectItem
        this.setSelectCurrentReward(selectItem.minTurn,selectItem.index)

        var item = this.m_rewardData = Gm.config.getConst("bingo_once_cost")
        var m_costArr = Func.itemSplit(item)
        this.m_oCost = m_costArr[0].num

        this.m_openedCard = []
        this.m_oBingoItem = []
        this.m_listItem = []
        this.m_oBingoRewardItem = []
        if(selectItem.index != -1){
            this.m_currentSelectRewardIdx = Gm.bingoData.getRewardIndex(selectItem.minTurn,selectItem.index)
        }else{
            this.m_currentSelectRewardIdx = -1
        }
       
        this.m_isEnterNextTurn = false
        var node = this.node.getChildByName("reward")
        this.m_ani = node.getComponent(cc.Animation)
        var parsysNode = node.getChildByName("wuzetian_skill_39") 
        this.m_parsys = parsysNode.getComponent(cc.ParticleSystem)
        this.m_aniSprite = node.getChildByName("beigang_jinse")
     
    
        // if(Gm.bingoData.getCurrentSelectReward()){
        //     this.m_isEnterNextTurn = true
        // }
     
    },

    playShuffle(){
        for(let key in this.m_oBingoItem){
            let x = this.m_oContent.width / 2  -  this.m_oBingoItem[key].width / 2 
            let y = -(this.m_oContent.height / 2) + this.m_oBingoItem[key].height
            let pos = cc.v2(x,y)
            this.m_oBingoItem[key].getComponent("BingoCardItem").playMoveCenter(pos,key)
        }
        this.scheduleOnce(()=>{
            Gm.audio.playEffect("music/gacha/39_gacha_eqiop_10")
            for(let key in this.m_oBingoItem){
                this.m_oBingoItem[key].getComponent("BingoCardItem").playMove(key)
            }
        },this.m_oBingoItem.length * 0.03 + 0.5)
    },

    playCloseCardAll(){
        for(let key in this.m_oBingoItem){
            this.m_oBingoItem[key].getComponent("BingoCardItem").closeCard()      
            //锁定交互
            this.m_oBingoItem[key].getComponent("BingoCardItem").setEnable(false)   
        }
    
        this.scheduleOnce(()=>{
            this.playShuffle()
        },1.0)
    },

    playOpenCardAll(){
        var data = Gm.bingoData.getCurrentTurnData()
        var maxnum = data.maxNum
        data = Func.copyArr(data.hero)
        var heroData = []

        for(let index = 0; index< maxnum / 2; index++){
            heroData.push(data[index].id)
            heroData.push(data[index].id)
        }

        for(let i in heroData){
            let tidx = Func.random(heroData.length-1, 0)
            let t = heroData[i]
            heroData[i] =heroData[tidx] 
            heroData[tidx]  = t
        }

        for(let key in this.m_oBingoItem){
            let id = heroData[key]
            this.m_oBingoItem[key].getComponent("BingoCardItem").setHead(id)   
            this.m_oBingoItem[key].getComponent("BingoCardItem").setOpen(false)
   
        }
        
    },

   setSelectCurrentReward(minTurn,index){
        if(index >= 0){
            Gm.bingoData.setSeleRewardIndex(Gm.bingoData.getRewardIndex(minTurn,index))
            var item = Gm.ui.getNewItem(this.m_oselectItemNode)
            var itemData = Gm.bingoData.getRewardByIndex(index,minTurn)
            item.setData(itemData)
            item.setTips(false)
        }
    
    },

    initOpenCard(){
        var data = Gm.bingoData.getRightOpenCardIndex()
        for(let key in data){
            if(data[key] != 0){
                let script =this.getBingoCardScriptByIndex(key)
                script.setHead(data[key],0)
                script.setLight(true)
            }
        }
        this.enterNextTurn()
    },

    getBingoCardScriptByIndex(idx){
        if(this.m_oBingoItem[idx]){
            let script = this.m_oBingoItem[idx].getComponent("BingoCardItem")
            return script
        }

        return undefined
    },

    enableUpdateView:function(destData){
        if(destData){
            this.onUserInfoUpdate()
            Gm.red.refreshEventState("bingo")

        }
    },
    register(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
        this.events[Events.CLOSE_AWARDSHOWVIEW]  = this.onCloseRewardView.bind(this)
    },
    onUserInfoUpdate:function(){
        this.godlerLab.string = Func.transNumStr(Gm.userInfo.getGolden())
        this.silverLab.string = Func.transNumStr(Gm.userInfo.silver)
        this.updateBingoTicketCount()
    },


    updateBingoTicketCount(){
        this.m_bingoCount = Gm.bagData.getItemByBaseId(ConstPb.propsToolType.TOOL_BINGO_TICKET)
        var count = 0
        if(this.m_bingoCount ){
            count = Func.transNumStr(this.m_bingoCount.count)  
        } 
        this.m_oBingoCount1.string = count
        this.m_oBingoCount2.string = count + "/" + this.m_oCost
        this.m_oBingoCount2.node.color = count <= 0 ? cc.color(238,59,59,255) :cc.color(255,255,255,255)
    },

    initView(){
        var bingoData = Gm.bingoData.getCurrentTurnData()
        this.m_pcardVeiwBg.active = bingoData.maxNum <= 16
        this.m_pcardVeiwBg2.active = bingoData.maxNum > 16  

        //var itemTemp = cc.instantiate(this.m_oBinGoitem)
        bingoData.row = bingoData.row
        var maxNum = bingoData.maxNum
        // var layout = this.m_oContent.getComponent(cc.Layout)  
        // var w = layout.spacingX * (bingoData.row-1) + itemTemp.width *  bingoData.row
       // itemTemp.destroy()
        //this.m_oContent.width = w
        this.createCard(maxNum,bingoData.row)
    },

    createCard(num,row){
        var len  = this.m_oBingoItem.length
        for(let i = len; i< num; ++i){
            let item = cc.instantiate(this.m_oBinGoitem)
            item.parent = this.m_oContent
            item.x = (i % row) * item.width + (i % row) * 5
            item.y = Math.floor( (i / (row))) * item.height * -1  - Math.floor( (i / (row))) * 5
            item.getComponent("BingoCardItem").setData(this,this.m_oBingoItem.length)
            item.getComponent("BingoCardItem").setPos(cc.v2(item.x,item.y))
            this.m_oBingoItem.push(item)
        }
    },

    
    playComplete(callback){
        Gm.audio.playEffect("music/31_player_lvup")
        var ani = cc.instantiate(this.animation)
        ani.parent = this.node 
        var script = ani.getComponent("BingoCompleteAnimation")
        script.play(callback)
    },

    openSelectListView(){
        // if(!this.m_isEnterNextTurn){
        //     this.initListView()
        // }else{
        //     Gm.floating(Ls.get(7700004))
        // }
        this.initListView()
    },

    onOpenSelectViewClick(){
        Gm.audio.playEffect("music/06_page_tap")
        this.onItemClickCallBack(parseInt(Gm.bingoData.getSeleRewardIndex()) )
        this.openSelectListView()
    },

    initListView(){
        if(this.m_oScrollView.content.childrenCount == 0 ){
            var data = Gm.bingoData.getBingoConfig()
            for(let key in data){
                let item = cc.instantiate(this.m_oListItem)
                item.getComponent("BingoListItem").setData( parseInt(key) +1,data[key],this)
                this.m_listItem.push(item)
                item.active = true
                item.parent = this.m_oScrollView.content
            }
        }

        for(let key in this.m_oBingoRewardItem){
            let script = this.m_oBingoRewardItem[key].getComponent("BingoNewItem") 
            script.updateUI()
        }

        this.m_oRewardPanel.active = true 

    },

    resetListUI(){
        for(let key in this.m_listItem ){
            this.m_listItem[key].getComponent("BingoListItem").setUI()
        }
    },

    onItemClickCallBack(pidx){
        this.m_currentSelectRewardIdx  = pidx
        this.m_oOkBtn.interactable =  this.m_currentSelectRewardIdx != -1
        for(let key in this.m_oBingoRewardItem){
           let script = this.m_oBingoRewardItem[key].getComponent("BingoNewItem") 
           let idx = script.getIdx()
           script.setSelect(idx == pidx)
        }
    },

    openCard(idx){
        var card1 = this.m_openedCard[0] && this.m_openedCard[0].idx
        if(card1 == undefined && !this.checkBingoTicket()){ //检测bingo券否够用
            return 
        }

        //检测玩家是否已经选择了奖励
        if(Gm.bingoData.getSeleRewardIndex() == -1){
            Gm.floating(Ls.get(7700005))
            return 
        }

        if(!this.m_isEnterNextTurn){
            //正式进入下一轮
            this.playNextTurn()
        }

        //检测是否发送相同位置的牌
        if(this.m_openedCard.length == 1 && this.m_openedCard[0].idx == idx){
            console.log("点击了相同的牌，发送失败")
            return
        }

        if(this.m_openedCard.length < 2){
            this.m_openedCard.push({idx:idx})
            let openCardArr = []
            for(let key in this.m_openedCard){
                openCardArr.push(this.m_openedCard[key].idx)
            }
            Gm.bingoNet.openCard(openCardArr)
        } 
    },

    checkBingoTicket(){
        this.updateBingoTicketCount()
        if( this.m_bingoCount == null){
            if(Gm.bingoData.getBuyBingoCount() < Gm.config.getConst("buy_bingo_item_limit")){
                this.onBuyBingoClick()
            }else{
                Gm.floating(Ls.get(2037))
            }
            return false 
        }

        return true
    },

    isEnterNextTurn(){
        for(let key in this.m_oBingoItem){
            let script =this.getBingoCardScriptByIndex(key)
            if(!script.isOpened()){
                return false
            }
        }

        return true
    },

    onCloseSelectPageClick(){
        this.m_oRewardPanel.active =  false
        // if(this.m_currentSelectRewardIdx != -1){
        //     this.setSelectCurrentReward(this.m_currentSelectRewardIdx)
        // }
    },

    pushBingoRewardItem(item){
       var length = this.m_oBingoRewardItem.push(item)
       return length -1
    },

    onRewardClick(){
        Gm.ui.create("BingoRewardView")
    },

    onBuyBingoClick(){
        var callback = function(currentNum){
            Gm.bingoNet.buyBingoItem(currentNum)
        }
        Gm.ui.create("BingoBuyView",{callback:callback})
        Gm.audio.playEffect("music/06_page_tap")
    },

    onSetHead(args){
        
        this.m_pairReward = args.reward
        var len = args.heroQualityId.length
        if(len ==  2){
            this.m_openedCard[1].heroQualityId = args.heroQualityId[1]
        }else if(len == 1){
            this.m_openedCard[0].heroQualityId = args.heroQualityId[0]
        }
        var idx = this.m_openedCard[len-1].idx
        var script = this.getBingoCardScriptByIndex(idx)
        if(len == 2 ){
            script.setCb(this.openPair.bind(this) ) 
        }
        script.setHead(args.heroQualityId[len-1])
        Gm.audio.playEffect("music/02_popup_open")
    },

    //判断有没有翻对成功
    openPair(){
        if(this.m_openedCard.length == 2 ){
            if(this.m_openedCard[0].heroQualityId == this.m_openedCard[1].heroQualityId){
                this.openSuccess()
            }else{
                this.openFail()
            }
        }
    },

    openSuccess(){
        Gm.audio.playEffect("music/gacha/37_gacha_cha_open_special")
        Gm.bingoData.setOpenRightCard(this.m_openedCard)
        for(let key in this.m_openedCard){
            let cardIdx = this.m_openedCard[key].idx
            this.getBingoCardScriptByIndex(cardIdx).setLight(false)
            this.getBingoCardScriptByIndex(cardIdx).setCardFade()
            if( key == 1 ){
                this.getBingoCardScriptByIndex(cardIdx).playRightAni(this.onRightCallBack.bind(this))
            }else{
                this.getBingoCardScriptByIndex(cardIdx).playRightAni()
            }
        }
    },

    //正确动画播放完成回调
    onRightCallBack(){
        this.m_openedCard =  []
        this.receiveOpenSuccessReward(this.m_pairReward)
    },

    enterNextTurn(){
        if(this.isEnterNextTurn()){
            this.playComplete(()=>{
                Gm.bingoNet.receiveTurnReward(Gm.bingoData.getCurrentTurn())
            })
        }
    },

    openFail(){
        Gm.audio.playEffect("music/03_popup_close")
        //对碰失败
        for(let key in this.m_openedCard){
            let cardIdx = this.m_openedCard[key].idx
            let script = this.getBingoCardScriptByIndex(cardIdx)
            if(key == 1 ){
                script.closeCard(this.onCloseCallBack.bind(this))
            }else{
                script.closeCard()
            }
        }
       
    },


    playSelectAnimation(){
        this.m_ani.play()
        this.m_parsys.resetSystem()
        this.m_aniSprite.active = true 
        this.m_oTips.node.active = true
    },

    stopSelectAnimation(){
        this.m_ani.stop()
        this.m_parsys.stopSystem()
        this.m_aniSprite.active = false 
        this.m_oTips.node.active = false
    },

    onCloseCallBack(){
        this.m_openedCard =  []
    },

    //对碰奖励
    receiveOpenSuccessReward:function(args){
        if(args){
            var list = [args]
            Gm.ui.create("AwardShowView",{list:list})
        }
    },

    addBingoItemCount(count){
        this.m_bingoCount += count
    },

    resetCard(){
        console.log("rest")
        Gm.bingoData.clear()
        Gm.bingoData.setCurrentTurn(Gm.bingoData.getCurrentTurn() + 1)
        this.m_oTurn.string = Gm.bingoData.getCurrentTurn() 
        this.m_currentSelectRewardIdx = -1
        this.m_isEnterNextTurn = false
        Func.destroyChildren(this.m_oselectItemNode)
        for(let i =0; i<this.m_oBingoItem.length; ++i){
            let script = this.getBingoCardScriptByIndex(i)
            if(script){
                script.reset()
                script.resetAni()
            }
        }
        this.initView()
        this.resetListUI()
        this.playSelectAnimation()
        this.playOpenCardAll() 
    },

    onCloseRewardView(){
        //领奖成功检测是否进入下一轮
        this.enterNextTurn()
    },

    onOkClick(){
        if(Gm.bingoData.getSeleRewardIndex() == -1){
            this.playCloseCardAll()
        }
      //开牌前发送玩家选择的奖励
      let index = this.m_currentSelectRewardIdx 
      if(index != -1 && index!= Gm.bingoData.getSeleRewardIndex()){
         let script = this.m_oBingoRewardItem[index].getComponent("BingoNewItem") 
         let idx = script.getMinTurnIdx()
         let minturn = script.getMinTurn()
         Gm.bingoNet.selectReward(minturn, idx)
         this.setSelectCurrentReward(minturn,idx)
         this.stopSelectAnimation()
        }

        this.onCloseSelectPageClick()
    },

    //开始进入下一轮
    playNextTurn(){
        this.m_isEnterNextTurn = true
        this.resetListUI()
        this.m_oOkBtn.interactable =  false
    },


    updateRewardCount(){
        var idx = Gm.bingoData.getSeleRewardIndex()
        var data = Gm.bingoData.getReward(idx)
        var selectCount = Gm.bingoData.getSelectCountByIndex(data.minTurn,data.idx)
        selectCount++
        Gm.bingoData.setSelectCountByTurn(data.minTurn,data.idx,selectCount)
    },

    updateTime(){
        var time = EventFunc.getTime(ConstPb.EventOpenType.EVENTOP_BINGO)
        if(Gm.userData.getTime_m()<time.closeTime){
            time = Func.translateTime(time.closeTime,true)
            this.m_oTimeLabel.string = AtyFunc.timeToDayAndH(time,this.m_oTimeLabel)
        }
    },
    
    onBack(){
        this.m_oScrollView.content.removeAllChildren()
        this._super()
    }
});

