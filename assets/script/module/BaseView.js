cc.Class({
    extends: cc.Component,

    properties: {
        isAddBaseUI:false,//加入弹窗基础
        isMinPopup:false,//小弹窗
        newAddBaseUI:false,//新的弹窗基础
        titleId:0,
        popupNode:cc.Node,
        openActons:{
            default: [],
            type: require("ViewAction"),
        },
        m_oBackGround:cc.Node,
        logic: null,
        logicName:"",
        m_oBGMFile:{
            type: cc.AudioClip,
            default:null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.x = 0
        this.node.y = 0
        if (this.m_oBackGround){
            this.m_oBackGround.scale = cc.fixBgScale
        }
        this.pools = []
        // this.popupNode = false
        if (this.popupNode){
            if (this.isAddBaseUI || this.newAddBaseUI){
                if (this.newAddBaseUI){
                    this.popupUI = Gm.ui.getNewBasePopupUI()
                    this.tipsNode = this.popupNode.getChildByName("TipsBase")
                    if(this.tipsNode){
                        this.popupUI.setHeight(this.tipsNode.height)
                    }
                }else{
                    this.popupUI = Gm.ui.getBasePopupUI()
                    if (this.isMinPopup){
                        this.popupUI.updateBg(this.isMinPopup)
                    }
                }
                
                this.popupNode.addChild(this.popupUI.node,-2)
                this.popupUI.setData(this.popupUIData)
                if (this.titleId){
                    this.popupUI.setTitle(Ls.get(this.titleId))
                }
                this.popupUI.setCloseFunc(()=>{
                    this.onBack()
                })
            }
            this.tipNodeActive(false)
            var ac = this.popupNode.addComponent(require("ViewAction"))
            this.openActons.push(ac)
            ac.defaultStr = "to_scale_0.7"
            var obj = {type:"sequence",action:[{acName:"scaleTo",time:0.15,arg1:1,easing:"easeBackOut"}]}
            ac.actionList.push(JSON.stringify(obj))
        }
        if (this.logicName == ""){
            var index = this.node._name.indexOf("View")
            if(Number(index) > 0){
                this.logicName = this.node._name.slice(0,index)
                if (this.logicName == null || this.logicName == undefined){
                    this.logicName = ""
                }
            }
        }
        if (this.logicName != ""){
            this.logic = Gm.getLogic(this.logicName + "Logic")
            if(this.logic){
                this.logic.setView(this)
            }
        }
        if (this.logic == null){
            console.log("没有logic" + this.node._name)
        }
        this.init()
    },
    tipNodeActive(isShow){
        if (this.popupNode && (this.isAddBaseUI || this.newAddBaseUI)){
            if(this.tipsNode){
                this.tipsNode.active = isShow
            }
        }
    },
    lateUpdate:function(dt){
        if (this.nums > 0){
            this.nums = this.nums - dt
            if (this.nums < 0){
               
            }
        }
    },
    setOpenData(openData){
        this.openData = openData
    },
    onEnable(){
        this.nums = 0

        this.runOpenAction()
        // Gm.bi.ui(this.node._name)
        this.sendBi()
        if (this.m_oBGMFile && !(Gm.guideData.m_iGuideStep <= 2 && Gm.userInfo.name)){
            Gm.send(Events.PLAYBGM,this.node._name)
        }
    },
    runOpenAction(){
        if(this.openActons.length > 0){
            this.node.opacity = 0
            this.scheduleOnce(()=>{
                this.node.opacity = 255
                for (let index = 0; index < this.openActons.length; index++) {
                    const v = this.openActons[index];
                    if (v){
                        v.starAction(index == this.openActons.length-1?this.openActionComplete.bind(this):null)
                    }
                }
            },0.03)
        }else{
            this.openActionComplete()
        }
    },
    openActionComplete(){
        this.scheduleOnce(()=>{
            this.nums = 1
            this.tipNodeActive(true)
            this.enableUpdateView(this.openData || true)
        },0.01)
    },
    onBack(){
        if (this.popupNode){
            var ac = cc.scaleTo(0.15,0).easing(cc.easeBackIn())
            var acs = cc.sequence(ac,cc.callFunc(()=>{
                this.onCloseActionComplete()
            }))
            this.popupNode.runAction(acs)
        }else{
            this.onCloseActionComplete()
        }
    },
    onCloseActionComplete(){
        Gm.ui.deletePop(this.node._name)
        Gm.ui.removeByName(this.node._name)
        Gm.ui.queuePop(this.node._name)
    },
    onDestroy(){
        if (this.m_oBGMFile && !(Gm.guideData.m_iGuideStep <= 2 && Gm.userInfo.name)){
            Gm.send(Events.CLOSEBGM,this.node._name)
        }
        this.removeEvent()
        if (this.logic){
            this.logic.setView(null)
        }
    },
    //主要处理active=true时，直接更新界面
    enableUpdateView:function(){
        // Gm.audio.playEffect("music/02_popup_open")
    },
    updateView(){

    },
    init:function(){
        this.events = {}
        this.register()
        this.addEvnet()
        
        // console.log(this.node.name+"-init")
    },
    register:function(){
    },
    addEvnet:function(){
        for (const key in this.events) {
            Gm.events.add(key,this.events[key])
        }
    },
    removeEvent:function(){
        if (this.events){
            for (const key in this.events) {
                Gm.events.remove(key,this.events[key])
            }
        }
    },
    getHelp:function(){
        cc.log(this.node._name,this.selectType)
        var config = Gm.config.getViewByName(this.node._name,Math.max(0,this.selectType))
        if (config){
            console.log("getHelp==viewId==:",config.viewId)
        }
        if (config && config.helpText){
            return config.helpText
        }
        return " "
    },
    jumpIn:function(pageNum){
        this.m_iDestPage = pageNum
    },
    onInfoClick:function(){
        Gm.ui.create("HelpInfoBox",{content:this.getHelp(),title:Ls.get(70046)})
    },
    getGuide:function(destName){
        return this[destName]
    },
    getClick:function(destName){
        return null
    },
    sendBi(){
        var config = Gm.config.getViewByName(this.node._name)
        if (config){
            var systemId = config.viewId
            if (this.selectType >= 0){
                systemId = systemId + this.selectType
            }
            Gm.http.sendBi(systemId)
        }
    },
    //对象池
    addPoolItem(item){
        item.parent = null
        this.pools.push(item)
    },
    getPoolItem(){
        var len = this.pools.length
        if (len > 0 ){
            var item = this.pools[len-1]
            this.pools.splice(len-1,1)
            return item
        }
        return cc.instantiate(this.getBasePoolItem())
    },
    removeAllPoolItem(node){
        for (let index = node.children.length-1; index >=0; index--) {
            const v = node.children[index];
            v.parent = null
            this.addPoolItem(v)
        }
    },
    //子类继承
    getBasePoolItem(){

    },
    playSound:function(sender,filePath){
        Gm.audio.playEffect("music/"+filePath)
    },
    setStarSelect(starIndex){
        if (this.listBtns && this.listBtns[starIndex]){
            this.listBtns[starIndex].zIndex = -1
        }
        this.select(starIndex)
    },
    addUpdateTime(){
        this.unscheduleAllCallbacks()
        this.updateTime()
        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    updateTime(){

    },
});
