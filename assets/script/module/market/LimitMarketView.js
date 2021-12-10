var BaseView =require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oBtnPrefab:cc.Prefab,
        m_oTime:cc.Label,
        //m_oReamTime:cc.Label,
        m_oItemName:cc.Label,
        m_oItemIcon:cc.Sprite,
        m_oDisscountIocn:cc.Node,
        m_oDisscountLabel:cc.Label,

        m_ozsLabel:cc.RichText,
        m_oScrollview:cc.ScrollView,
        m_oButton:cc.Button,

        m_oBtnLabel:cc.Label,

        m_oGray:cc.Material,
        m_defaultMaterial:cc.Material,

        m_xiaoHaoIcon:cc.Sprite,
        m_xiaoTypeLab:cc.Label,
    },

    onLoad(){
        this._super()
        this.initData()


        this.updateTime()
        this.schedule(()=>{
            this.updateTime()
        },1, cc.macro.REPEAT_FOREVER,0)

        this.createButton()
    },

    register(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
    },
    onUserInfoUpdate:function(){
        this.updateDiamond()
    },
    enableUpdateView:function(destData){
        Gm.limitMarketNet.buyItem(1)
        Gm.limitMarketData.setFirstOpen()
    },
    initData(){
        this.m_activityTime = EventFunc.getTime(ConstPb.EventOpenType.EVENTOP_MARKET)
        this.m_day = new Date(new Date(new Date().toLocaleDateString()).getTime()+24*60*60*1000-1)
        var Time  =  Func.intervalTime(Gm.userData.getTime_m() ,this.m_day.getTime()) 
        Time = Time.split('-')
        this.m_th = Time[1]
        this.m_tm = Time[2]
        this.m_ts = 60
        this.m_itemList = []
        this.m_currentIndex = 999
        this.m_spriteFrame = []
        this.m_buySpriteFrame = []
    },

    createButton(){

        var config = Gm.config.getLimitMarketConfig()
        var totalDay =  config.length
        var currDay = new Date()
        var itemWidth = 0
        for(let i = 0; i< totalDay; ++i){
            let item = cc.instantiate(this.m_oBtnPrefab)
            itemWidth = item.width 
            this.m_itemList.push(item)
            item.parent = this.m_oScrollview.content
            let script = item.getComponent("LimitMarketButton")
            let openDay = new Date(this.m_activityTime.openTime)
            openDay.setDate(openDay.getDate() + i)
            if( openDay.getFullYear() == currDay.getFullYear() && 
                openDay.getMonth()+1 == currDay.getMonth()+1 &&
                openDay.getDate() == currDay.getDate()){
                this.m_currentIndex = i
                this.m_seleIndex =  this.m_currentIndex
            }
            let y = openDay.getFullYear();   
            let m = openDay.getMonth()+1 
            let d = openDay.getDate()
            var wd = openDay.getDay() 

            let data = Gm.config.getLimitMarketConfigById(i+1)
            script.setUI(m+"月"+d+"日"+" ("+Ls.get(40018+wd)+")",i,this.m_currentIndex,data)
            script.setCallBck(this.onClickCallBack.bind(this))
        }
        var newPos = this.m_oScrollview.getContentPosition()
        newPos.x += this.m_currentIndex * itemWidth * -1
        this.m_oScrollview.setContentPosition(newPos )
        this.onClickCallBack(this.m_currentIndex)
    },

    onClickCallBack(index,isEnable){
        for(let key in this.m_itemList){
            let script = this.m_itemList[key].getComponent("LimitMarketButton")
            script.setSelect(index != key)
        }

        this.m_oButton.interactable = !isEnable
        this.m_seleIndex = index

        this.setUI()
        this.loadReward(index)
    },
    loadReward(index){
        let script = this.m_itemList[index].getComponent("LimitMarketButton")
        let data =  script.getData()
        let buyItem = Gm.config.getItem(data.price[0].id)
        this.m_buyId = data.price[0].id

        this.m_oItemName.string = data.name
        if(!this.m_spriteFrame[index]){
            Gm.load.loadSpriteFrame("img/market/"+data.icon,(spriteframe,owner)=>{
                owner.spriteFrame = spriteframe
                this.m_spriteFrame[index] = spriteframe
            },this.m_oItemIcon)
        }else{
            this.m_oItemIcon.spriteFrame  = this.m_spriteFrame[index] 
        }

        if(!this.m_buySpriteFrame[index]){
            Gm.load.loadSpriteFrame("img/items/"+buyItem.icon,(spriteframe,owner)=>{
                owner.spriteFrame = spriteframe
                this.m_buySpriteFrame[index] = spriteframe
            },this.m_xiaoHaoIcon)
        }else{
            this.m_xiaoHaoIcon.spriteFrame  = this.m_buySpriteFrame[index] 
        }
        var buyType = 20053
        if(data.price[0].id == ConstPb.playerAttr.SILVER){ //金币 
            buyType = 2067
        }else if(data.price[0].id == ConstPb.playerAttr.PAY_GOLD){
            buyType = 20050
        }
        this.m_xiaoTypeLab.string = Ls.get(buyType)
        
        this.m_price = data.price[0].num 
        this.updateDiamond()
        this.m_oDisscountIocn.active = data.discount < 1
        this.m_oDisscountLabel.string =(data.discount * 100 ) + "%" + "OFF"
        // if(data.discount < 1){
        //     str += "</outline></c><color=#9B8C78><outline color=#000000 width=2>  "+ data.price[0].num * data.discount  + "</outline></color> "
        // }

    },

    start () {

    },

    updateDiamond(){
        var hasNum = Gm.userInfo.golden
        if(this.m_buyId == ConstPb.playerAttr.GOLD){ //无偿钻石
            hasNum = Gm.userInfo.golden + Gm.userInfo.payGolden 
        }else if(this.m_buyId == ConstPb.playerAttr.PAY_GOLD){ //付费钻石
            hasNum = Gm.userInfo.payGolden 
        }else{//金币 
            hasNum = Gm.userInfo.silver
        }
    
        var color ="<color=#ffffff>" 
        if(this.m_price > hasNum){
            color ="<color=#FF0000>" 
        }
        var price = Func.transNumStr(this.m_price)
        var num = Func.transNumStr(hasNum)
        this.m_ozsLabel.string =  color+num+"</c><color=#ffffff>/"+ price  +"</color>"
    },

    updateTime(dt){
        this.m_ts--
        if(this.m_ts == 0 ){
            this.m_tm --
        }

        if(this.m_tm == 0 ){
            this.m_th --
        }
        var timeStr = ""
        this.m_ts = this.m_ts == 0 ? 59 : this.m_ts
        this.m_tm = this.m_tm == 0 ? 59 : this.m_tm
        this.m_th = this.m_th == 0 ? 24 : this.m_th

        timeStr = this.m_th < 10 ? "0"+this.m_th+":":this.m_th+":"
        timeStr += this.m_tm < 10 ? "0"+this.m_tm+":":this.m_tm+":"
        timeStr += this.m_ts < 10 ? "0"+this.m_ts:this.m_ts

        this.m_oTime.string = timeStr
        // var time = Func.translateTime(this.m_activityTime.closeTime,true)
        // this.m_oReamTime.string = "剩余时间:"+AtyFunc.timeToDayAndH(time,this.m_oReamTime)
    },

    onItemInfoClick(){
        
    },

    onBuyClick(){
        var script = this.m_itemList[this.m_seleIndex].getComponent("LimitMarketButton")
        var data =  script.getData()
        data.string = this.m_ozsLabel.string 
    
        Gm.ui.create("LimitMarketBuyView",data)
    },

    setUI(){
        var isEnable = false 
        var languageId = 5223
        var type = 0
        if( this.m_currentIndex == this.m_seleIndex){
            isEnable  =  !Gm.limitMarketData.getBuySuccess()
            type = !Gm.limitMarketData.getBuySuccess() ? 1:0
            languageId = Gm.limitMarketData.getBuySuccess() ? 5307 : 1007
        }

        this.m_oButton.interactable = isEnable
        this.m_oBtnLabel.string = Ls.get(languageId)
        this.setGrayByType(type)

    },
    setGrayByType(type){
        var sprite = this.m_oItemIcon.node.parent.getComponentsInChildren(cc.Sprite)
        for(let i=0 ;i<sprite.length;++i){
            if(type == 0){
                sprite[i].setMaterial(0,this.m_oGray)
                this.m_oDisscountLabel.node.color = cc.color(155,140,120)
            }else{
                this.m_oDisscountLabel.node.color = cc.color(255,255,0)
                sprite[i].setMaterial(0,this.m_defaultMaterial)
            }
        }
    },  
});
