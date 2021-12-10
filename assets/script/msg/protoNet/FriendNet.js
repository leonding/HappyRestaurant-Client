var MSGCode = require("MSGCode")
MSGCode.proto[MSGCode.OP_FRIEND_INFO_C]        = "Friend.OPFriendInfo"
MSGCode.proto[MSGCode.OP_FRIEND_INFO_S]        = "Friend.OPFriendInfoRet"

MSGCode.proto[MSGCode.OP_FRIEND_SEARCH_C]        = "Friend.OPFriendSearch"
MSGCode.proto[MSGCode.OP_FRIEND_SEARCH_S]        = "Friend.OPFriendSearchRet"
MSGCode.proto[MSGCode.OP_FRIEND_APPLY_C]         = "Friend.OPFriendApply"
MSGCode.proto[MSGCode.OP_FRIEND_APPLY_S]         = "Friend.OPFriendApplyRet"
MSGCode.proto[MSGCode.OP_SYNC_FRIEND_APPLY_INFO_S] = "Friend.OPSyncFriendApplyInfo"
MSGCode.proto[MSGCode.OP_FRIEND_REPLY_APPLY_C]   = "Friend.OPFriendReplyApply"
MSGCode.proto[MSGCode.OP_FRIEND_REPLY_APPLY_S]   = "Friend.OPFriendReplyApplyRet"
MSGCode.proto[MSGCode.OP_FRIEND_DELETE_C]        = "Friend.OPFriendDelete"
MSGCode.proto[MSGCode.OP_FRIEND_DELETE_S]        = "Friend.OPFriendDeleteRet"
MSGCode.proto[MSGCode.OP_SYNC_ON_OFFLINE_S]        = "Friend.OPSyncOnOffline"
MSGCode.proto[MSGCode.OP_VIEW_AID_HERO_C]   = "Friend.OPViewAidHero"
MSGCode.proto[MSGCode.OP_VIEW_AID_HERO_S]        = "Friend.OPViewAidHeroRet"
MSGCode.proto[MSGCode.OP_EDIT_AID_HERO_C]        = "Friend.OPEditAidHero"
MSGCode.proto[MSGCode.OP_EDIT_AID_HERO_S]        = "Friend.OPEditAidHeroRet"
MSGCode.proto[MSGCode.OP_ADD_BLACKLIST_C]       = "Friend.OPAddBlacklist"
MSGCode.proto[MSGCode.OP_ADD_BLACKLIST_S]        = "Friend.OPAddBlacklistRet"
MSGCode.proto[MSGCode.OP_REMOVE_BLACKLIST_C]        = "Friend.OPRemoveBlacklist"
MSGCode.proto[MSGCode.OP_REMOVE_BLACKLIST_S]        = "Friend.OPRemoveBlacklistRet"
MSGCode.proto[MSGCode.OP_SEND_FRIENDPOINT_C]       = "Friend.OPSendFriendPoint"
MSGCode.proto[MSGCode.OP_SEND_FRIENDPOINT_S]        = "Friend.OPSendFriendPointRet"
MSGCode.proto[MSGCode.OP_COLLECT_FRIENDPOINT_C]        = "Friend.OPCollectFriendPoint"
MSGCode.proto[MSGCode.OP_COLLECT_FRIENDPOINT_S]        = "Friend.OPCollectFriendPointRet"
MSGCode.proto[MSGCode.OP_REFRESH_ONOFFLINE_C]        = "Friend.OPRefreshFriendOnOffline"
MSGCode.proto[MSGCode.OP_REFRESH_ONOFFLINE_S]        = "Friend.OPRefreshFriendOnOfflineRet"

MSGCode.proto[MSGCode.OP_HIRE_AID_INFO_C]        = "Friend.OPHireAidInfo"
MSGCode.proto[MSGCode.OP_HIRE_AID_INFO_S]        = "Friend.OPHireAidInfoRet"
MSGCode.proto[MSGCode.OP_HIRE_AID_LIST_C]        = "Friend.OPHireAidList"
MSGCode.proto[MSGCode.OP_HIRE_AID_LIST_S]        = "Friend.OPHireAidListRet"
MSGCode.proto[MSGCode.OP_HIRE_AID_APPLY_C]       = "Friend.OPHireAidApply"
MSGCode.proto[MSGCode.OP_HIRE_AID_APPLY_S]       = "Friend.OPHireAidApplyRet"
MSGCode.proto[MSGCode.OP_HIRE_AID_APPLY_REPLY_C]        = "Friend.OPHireAidApplyReply"
MSGCode.proto[MSGCode.OP_HIRE_AID_APPLY_REPLY_S]        = "Friend.OPHireAidApplyReplyRet"
MSGCode.proto[MSGCode.OP_HIRE_AID_RETURN_C]        = "Friend.OPHireAidReturn"
MSGCode.proto[MSGCode.OP_HIRE_AID_RETURN_S]        = "Friend.OPHireAidReturnRet"

cc.Class({
    properties: {
        
    },
    hireReturn(heroId){
        Gm.sendCmdHttp(MSGCode.OP_HIRE_AID_RETURN_C,{heroId:heroId})
    },
    hireApply(heroId,type){
        Gm.sendCmdHttp(MSGCode.OP_HIRE_AID_APPLY_C,{heroId:heroId,type:type})
    },
    hireReplyApply(heroId,reply,applyId){
        Gm.sendCmdHttp(MSGCode.OP_HIRE_AID_APPLY_REPLY_C,{heroId:heroId,reply:reply,applyId:applyId})
    },
    getHireInfos(){
        this.isGetCan = true
        Gm.sendCmdHttp(MSGCode.OP_HIRE_AID_INFO_C)
    },
    getCanHires(){
        Gm.sendCmdHttp(MSGCode.OP_HIRE_AID_LIST_C)
    },
    getOffOnState(module=0){
        Gm.sendCmdHttp(MSGCode.OP_REFRESH_ONOFFLINE_C,{module:module})
    },
    addBlack(id){
        Gm.sendCmdHttp(MSGCode.OP_ADD_BLACKLIST_C,{targetId:id})
    },
    removeBlack(id){
        Gm.sendCmdHttp(MSGCode.OP_REMOVE_BLACKLIST_C,{targetId:id})
    },
    sendPoint(id){
        if (id == 0 && Gm.friendData.friendList.length ==0){
            return
        }
        Gm.sendCmdHttp(MSGCode.OP_SEND_FRIENDPOINT_C,{targetId:id})
    },
    collectPoint(id){
        Gm.sendCmdHttp(MSGCode.OP_COLLECT_FRIENDPOINT_C,{targetId:id})
    },
    getAid(){
        Gm.sendCmdHttp(MSGCode.OP_VIEW_AID_HERO_C)
    },
    changeAid(list){
        this.changeAids = list
        Gm.sendCmdHttp(MSGCode.OP_EDIT_AID_HERO_C,{heroId:list})
    },
    getAll(){
        Gm.sendCmdHttp(MSGCode.OP_FRIEND_INFO_C)
    },
    search(msg){
        Gm.sendCmdHttp(MSGCode.OP_FRIEND_SEARCH_C,{content:msg})
    },
    apply(targetId){
        Gm.sendCmdHttp(MSGCode.OP_FRIEND_APPLY_C,{targetId:targetId})
    },
    replyApply(targetId,action){
        this.targetId = targetId
        Gm.sendCmdHttp(MSGCode.OP_FRIEND_REPLY_APPLY_C,{targetId:targetId,action:action})
    },
    del(targetId){
        Gm.sendCmdHttp(MSGCode.OP_FRIEND_DELETE_C,{targetId:targetId})
    },
});
