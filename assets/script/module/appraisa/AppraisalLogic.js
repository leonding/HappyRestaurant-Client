var CoreLogic = require("CoreLogic")
const SUCCESS = 1
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
 
    },
    register:function(){
        this.events[Events.OPEN_APPRAISALK]     = this.openAppraisal.bind(this)
        this.events[MSGCode.OP_PLAYER_LOGIN_S]  = this.onNetLogin.bind(this)
        this.events[MSGCode.OP_APP_COMMENT_S]   = this.onAppCommentRet.bind(this)
        this.events[MSGCode.OP_PLAYER_CREATE_S] = this.onNetCreateRole.bind(this)
        this.events[MSGCode.OP_PUSH_REWARD_S]   = this.onNetReward.bind(this)
        this.events[MSGCode.OP_HERO_QUALITY_S]  = this.onNetHeroQuality.bind(this)
    },


    onNetHeroQuality:function(args){
        if(Gm.getLogic("AppraisalLogic").isCanOpenAppraisa()){
            for(let key in args.infos){
                Gm.appraisalData.setFirstGetQuality({qualityId:args.infos[key].qualityId})
            }
        }
    },

    onNetReward:function(args){
        if(Gm.getLogic("AppraisalLogic").isCanOpenAppraisa()){
            if (args.items && args.items.length > 0){//道具更改
                for (let index = 0; index < args.items.length; index++) {
                    const v = args.items[index];
                    if (v.itemType == ConstPb.itemType.HERO_CARD){
                        Gm.appraisalData.addNewHeros([v.heroInfo])
                    }
                }
            }
        }
      
    },

    openAppraisal(){
        if(this.isCanOpenAppraisa()){ //活动是否开启
            if(!Gm.appraisalData.getAppraisalFinish()){//活动未结束
                if(!Gm.appraisalData.getIsFirstOpen()){//是否首次弹出
                    let isOpen = this.isCanOpenPage()
                    if(isOpen && !Gm.appraisalData.isReceive() ){
                        Gm.ui.create("AppraisalView",true)
                        Gm.appraisalData.setIsFirstOpen()
                    }
                }
           
            }
        }
    
    },


    //活动已经开启未结束状态
    isCanOpenAppraisa(){
        var openCondition = Gm.config.getConst("evaluation_open_condition")
        return Gm.userInfo.getMaxMapId() > openCondition
    },

    //活动已经开启检测具体弹出评论的条件
    isCanOpenPage(){
        var isOpen = this.isOPenCondition() || this.isFirstGetQuality() || this.isGetQuality()
        return isOpen
    },
    
    isOPenCondition(){
        var popPageMapId = Gm.config.getConst("evaluation_eject_pass")
        return Gm.userInfo.getMaxMapId() > popPageMapId 
    },

    isFirstGetQuality(){

        return Gm.appraisalData.isFirstGetQuality()
    },

    isGetQuality(){
        return Gm.appraisalData.isGetQuality()
    },

    onNetLogin(args){
        var appComment = args.playerInfo && args.playerInfo.appComment   || 0
        Gm.appraisalData.setReceive(appComment == 1)
        Gm.appraisalData.setAppraisalFinish(appComment == 2)//2表示活动结束 
    },

    onAppCommentRet(args){
        Gm.appraisalData.setReceive(args && args.appComment == 1)
        Gm.appraisalData.setAppraisalFinish(args && args.appComment == 2)
        if(args && args.appComment == 2){
            Gm.ui.removeByName("AppraisalView")
        }
        Gm.send(Events.OPEN_APPRAISALK)
    },

    onNetCreateRole(args){
        var appComment = args.playerInfo && args.playerInfo.appComment   || 0
        Gm.appraisalData.setAppraisalFinish(appComment == 2)//2表示活动结束 
    }
});
