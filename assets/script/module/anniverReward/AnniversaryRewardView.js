var BaseView = require("PageView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oPerson:sp.Skeleton,
        heroBackSpr:cc.Sprite,
        m_itemNode:cc.Node,
        m_oItem:cc.Node,
        m_oBottomNode:cc.Node,
        m_row_1:cc.Integer,
        m_offsetX_2:cc.Integer,
        m_space_x:cc.Integer, 
        m_space_y:cc.Integer,
    },

    onLoad(){
        this._super()
        this.m_scriptArr = []
        this.m_oBottomNode.active =false
    },


    onUserUpdate:function(){
        this.m_SenderHeroHomeId = Gm.userInfo.homeHero || Gm.userInfo.head
        if (this.node.active){
            var heroData = Gm.config.getQulityHero(this.m_SenderHeroHomeId)
            var skinId
            if (heroData){
                skinId = heroData.skin_id
            }
            var skinConf = Gm.config.getSkin(skinId)

            Gm.load.loadSpriteFrame("img/bg/"+skinConf.background,function(sp,icon){
                icon.spriteFrame = sp
            },this.heroBackSpr)
            
            Gm.load.loadSkeleton(skinConf.rolePic,function(sp,owner){
                owner.skeletonData = sp
                owner.setAnimation(0, "ziran", true)
            },this.m_oPerson)
        }
    },


    enableUpdateView:function(args){
        this.onUserUpdate()
        this.initUI()
    },

    initUI(){
       var reward = Gm.config.getConst("act_login_sign_reward")
       var rewardSplit = Func.itemSplit(reward)
       var time = EventFunc.getTime(ConstPb.EventOpenType.EVENTOP_LOGIN_SIGN)
        for(let key in rewardSplit){
            let index = parseInt(key)
            let anniverNewitem = cc.instantiate(this.m_oItem) 
            let script = anniverNewitem.getComponent("AnniverItem")
            anniverNewitem.active = true
            anniverNewitem.parent = this.m_itemNode
            let startDate = new Date(time.openTime)
            startDate.setDate(startDate.getDate()+index)
            script.setData(index+1,rewardSplit[key],startDate)
            this.m_scriptArr.push(script)


            if(index < this.m_row_1){
                anniverNewitem.x = index * anniverNewitem.width + index *this.m_space_x
                anniverNewitem.y = 0
            }else{
                anniverNewitem.x = parseInt(key % this.m_row_1) * anniverNewitem.width + (index *this.m_space_x) + this.m_offsetX_2
                anniverNewitem.y = anniverNewitem.width * -1 + this.m_space_y
            }


         
        }
        this.updateItem()
    },

    updateItem(){
        for(let key in this.m_scriptArr){
            this.m_scriptArr[key].updateStatus()
        }
    },

    onReceiveClick(){
        if(!Gm.anniversaryRewardData.isThatDayReceived()){
            Gm.activityNet.anniversary(AtyFunc.ANNIVER_SIGN_TYPE)
        }
    },

    showBottom(){
        this.m_oBottomNode.active = true
    }
});

