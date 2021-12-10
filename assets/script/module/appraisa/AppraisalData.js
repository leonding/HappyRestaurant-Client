cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.m_isOpened = cc.sys.localStorage.getItem("appraisalOpened") || false 
    },

    //是否完成评价
    isReceive(){
        return this.m_isReceive || false
    },

    setReceive(receive){
        this.m_isReceive = receive
    },

    //领取完成活动结束
    setAppraisalFinish(isFinish){
        this.m_isFinish = isFinish
    },


    getAppraisalFinish(){
        return this.m_isFinish
    },


    //首次进入页面
    setOpenAppraisaView(){
        if(!this.m_isFirstOpen){
            this.m_isFirstOpen = true
        }
    },

    getOpenAppraisaView(){
        return this.m_isFirstOpen || false
    },

    //弹出记录
    setIsFirstOpen(){
        if(!this.m_isOpened){
            this.m_isOpened = !this.m_isOpened
            cc.sys.localStorage.setItem("appraisalOpened",this.m_isOpened) 
        }
    },

    getIsFirstOpen(){
        return this.m_isOpened
    },

    addNewHeros(hero){
        this.setGetQuality(hero)
    },

    setFirstGetQuality(hero){
        //检测是否第一次得该品质的卡
        var unLockHeroList = Gm.heroData.getUnLockHero()
        var len = unLockHeroList.length
        var heroQualilty = {}
        for(let i = 0; i<len ; ++i){
            let heroQualiltyId = unLockHeroList[i] % 100
            heroQualilty[unLockHeroList[i]] = heroQualiltyId
        }

        var fistGetHero = Gm.config.getConst("evaluation_obtain_hero_quality")
        var firtgetQualityHero = heroQualilty[hero.qualityId] == undefined && (hero.qualityId % 100) == fistGetHero 
        if(firtgetQualityHero){
            cc.sys.localStorage.setItem("firtgetQualityHero",1)
        }
    },
 
    setGetQuality(hero){
        //先检测是否抽到指定品级的卡
        var heroCard =  Gm.config.getConst("evaluation_draw_hero_quality")
        var quality = hero[0].qualityId % 100
        var isGetQualityHero = quality == heroCard
        if(isGetQualityHero){
            cc.sys.localStorage.setItem("isGetQualityHero",1)
        }
    },

    isFirstGetQuality(){
        var firtgetQualityHero = cc.sys.localStorage.getItem("firtgetQualityHero") || 0 
        return firtgetQualityHero == 1 
    },

    isGetQuality(){
        var isGetQualityHero = cc.sys.localStorage.getItem("isGetQualityHero") || 0 
        return isGetQualityHero == 1 
    },

});