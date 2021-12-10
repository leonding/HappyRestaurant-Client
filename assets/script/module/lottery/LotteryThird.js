// LotteryFirst
cc.Class({
    extends: cc.Component,
    properties: {
        items:{
            default:[],
            type:cc.Sprite,
        },
        jobSprite:cc.Sprite,
        jobLabel:cc.Label,
        heroNode:cc.Node,
        oneBtnNode:cc.Node,
        tenBtnNode:cc.Node,
    },
    updateInfo:function(data){
        this.setMenu()
    },
    updateView:function(owner,data){
        this.m_oOwner = owner
        // this.createItems(LotteryFunc.getTaoZShowConfig())
        this.createHero()
        this.setMenu()
        this.onJobSelect(Gm.lotteryData.getTzJob())
    },
    //创建8个物品
    createItems(data){
        this.configData = data
        for(var i=0;i<this.items.length;i++){
            if(data && data[i]){
                this.createItemFunc(data,i)
            }
            else{
                this.items[i].node.active = false
            }
        }
    },
    createItemFunc(data,i){
        var self = this
        setTimeout(() => {
            if(self && self.node && self.node.isValid){
                var config = null
                if(data[i].type == 40000){
                    config = Gm.config.getEquip(data[i].id)
                }
                else{
                    config = Gm.config.getItem(data[i].id)
                }
                Gm.load.loadSpriteFrame("/img/items/" + config.icon,function(sp,icon){
                    if(icon && icon.node && icon.node.isValid){
                        icon.node.active = true
                        icon.spriteFrame = sp
                    }
                },self.items[i])
                self.items[i].node.getChildByName("percent").getComponent(cc.Label).string = (data[i].percent *100).toFixed(2) + "%"
            }
        }, i*5);
    },
    createHero(){
        var item = Gm.ui.getNewItem(this.heroNode,true)
        this.heroJs = item.getComponent("NewItem")
        this.heroJs.setTips(false)
        var id = Gm.lotteryData.getTzHero()
        if(id){
            this.onHeroSelect([id])
        }
        else{
            this.heroJs.setData()
            this.heroJs.setChoice(true)
            this.heroNode.getChildByName("percent").active = false 
        }
    },
    setMenu(){
        this.data = Gm.lotteryData.getData(this.m_oOwner.m_iSeleted)[0]
        LotteryFunc.transBtn(this.oneBtnNode,this.data.config.oneCost)
        LotteryFunc.transBtn(this.tenBtnNode,this.data.config.tenCost)
    },
    onOneBtnClick(){
        if(!this.selectedHero()){
            Gm.floating(Ls.get(7100035))
            return
        }
        var teamNum = 1
        var itemNum = 1
        var tmpSend = LotteryFunc.onBtnClick(this.data.config,this.data.config.oneCost,0,1,teamNum,itemNum,null)
        if(tmpSend){
            this.setLockNode()
        }
    },
    onTenBtnClick(){
        if(!this.selectedHero()){
            Gm.floating(Ls.get(7100035))
            return
        }
       var teamNum = 1
       var itemNum = 1
       var tmpSend = LotteryFunc.onBtnClick(this.data.config,this.data.config.tenCost,1,10,teamNum,itemNum,null)
       if(tmpSend){
            this.setLockNode()
        }
    },
    selectedHero(){
        var hero = Gm.lotteryData.getTzHero()
        if(hero){
            return true
        }
        return false
    },
    setLockNode(){
       var  lockNode = this.m_oOwner.lockNode
       lockNode.active = true
       setTimeout(() => {
           if(lockNode && lockNode.isValid){
               lockNode.active = false
           }
       }, 1000);
    },

    //两个按钮
    onHeroBtnClick(){
        var id = Gm.lotteryData.getTzHero()
        var wishInfo = []
        if(id){
            wishInfo.push({baseId:id})
        }
        Gm.ui.create("LotteryHeroSelect",{wishInfo:wishInfo,callback:this.onHeroSelect.bind(this)})
    },
    onHeroSelect(data){
        if(data[0]){
            Gm.lotteryData.setTzHero(data[0])
            var hero = Gm.config.getHero(Math.floor(data[0]/1000),data[0])
            hero.baseId = Math.floor(data[0]/1000)
            hero.qualityId = data[0]
            this.heroJs.updateHero(hero)
        }
        if(Gm.lotteryData.getTzHero()){
            this.heroNode.getChildByName("percent").active = true
            var percent = LotteryFunc.getTzHeroPercent()
            this.heroNode.getChildByName("percent").getComponent(cc.Label).string = (percent * 100).toFixed(2)  + "%"
        }
        else{
            this.heroNode.getChildByName("percent").active = false
        }
    },
    onJobBtnClick(){
        if(!this.selectedHero()){
            Gm.floating(Ls.get(7100035))
            return
        }
        Gm.ui.create("LotteryJobSelect",{callback:this.onJobSelect.bind(this)})
    },
    onJobSelect(index){
        Gm.lotteryData.setTzJob(index)
        var picArray = LotteryFunc.getJobRes()
        Gm.load.loadSpriteFrame("/img/jobicon/" + picArray[index-1],function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.jobSprite)
        this.jobLabel.string = Ls.get(1612+ parseInt(index))
        this.createItems(LotteryFunc.getTaoZShowConfig())
    },
    onConfigItemClick(sender,index){
        index = parseInt(index)
        var args = {}
        args.item = this.configData[index-1]
        if(args.item.type == 40000){
            args.item.itemType = ConstPb.itemType.EQUIP
        }
        Gm.ui.create("ItemDetailView",args)
    }
});

