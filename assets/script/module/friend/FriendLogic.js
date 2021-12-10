
var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
    },
    register:function(){
        this.events[Events.LOGIN_SUC] = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_FRIEND_INFO_S] = this.onNetFriendInfos.bind(this)
        this.events[MSGCode.OP_FRIEND_SEARCH_S] = this.onNetFriendSearch.bind(this)
        this.events[MSGCode.OP_FRIEND_APPLY_S] = this.onNetFriendApply.bind(this)
        this.events[MSGCode.OP_SYNC_FRIEND_APPLY_INFO_S] = this.onNetFriendChange.bind(this)
        this.events[MSGCode.OP_FRIEND_REPLY_APPLY_S] = this.onNetFriendReplaApply.bind(this)
        this.events[MSGCode.OP_FRIEND_DELETE_S] = this.onNetFriendDel.bind(this)
        this.events[MSGCode.OP_SYNC_ON_OFFLINE_S] = this.onNetFriendOnOffline.bind(this)
        this.events[MSGCode.OP_VIEW_AID_HERO_S] = this.onNetAllAid.bind(this)
        this.events[MSGCode.OP_EDIT_AID_HERO_S] = this.onNetChangeAid.bind(this)

        this.events[MSGCode.OP_ADD_BLACKLIST_S] = this.onNetAddBlack.bind(this)
        this.events[MSGCode.OP_REMOVE_BLACKLIST_S] = this.onNetRemoveBlack.bind(this)
        this.events[MSGCode.OP_SEND_FRIENDPOINT_S] = this.onNetSendPoint.bind(this)
        this.events[MSGCode.OP_COLLECT_FRIENDPOINT_S] = this.onNetcollectPoint.bind(this)

        this.events[MSGCode.OP_REFRESH_ONOFFLINE_S] = this.onNetOnOff.bind(this)

        this.events[MSGCode.OP_ERROR_CODE_INFO_S] = this.onNetErrorCode.bind(this)

        this.events[MSGCode.OP_HIRE_AID_INFO_S] = this.onNetHireInfos.bind(this)
        this.events[MSGCode.OP_HIRE_AID_LIST_S] = this.onNetHireCanList.bind(this)
        this.events[MSGCode.OP_HIRE_AID_APPLY_S] = this.onNetHireApply.bind(this)
        this.events[MSGCode.OP_HIRE_AID_APPLY_REPLY_S] = this.onNetHireApplyReply.bind(this)
        this.events[MSGCode.OP_HIRE_AID_RETURN_S] = this.onNetHireReturn.bind(this)

        this.events[MSGCode.OP_PUSH_BATTLE_INFO_S]= this.onNetBattleInfo.bind(this)
    },
    onNetHireInfos(args){
        Gm.friendData.setHireAid(args)
        Gm.red.refreshEventState("friend")
        if (Gm.friendNet.isGetCan){
            Gm.friendNet.isGetCan = false
            return
        }
        Gm.friendNet.getCanHires()
    },
    onNetHireCanList(args){
        Gm.friendData.setCanHire(args.list || [])
    },
    onNetHireApply(args){
        var aid = Func.forBy(Gm.friendData.canHireAids,"heroId",args.heroId)
        aid.request = args.type == 0
        cc.log(aid)
    },
    onNetHireApplyReply(args){
        if (args.heroId == 0){
            if (args.reply == 1 && args.applyList){
                for (var i = 0; i < args.applyList.length; i++) {
                    var heroId = args.applyList[i]
                    this.onNetHireApplyReply({reply:args.reply,heroId:heroId,applyId:args.applyId})
                }
            }else{
                Gm.friendData.hireApplys = []    
            }
        }else{
            var aid = Func.forBy2(Gm.friendData.hireApplys,"heroId",args.heroId,"applyId",args.applyId)
            if (aid){
                if (args.reply == 1){
                    Gm.friendData.hireLends.push(aid)    
                }
                cc.log(Gm.friendData.hireLends)
            }
            Func.forRemove(Gm.friendData.hireApplys,"heroId",args.heroId)
            // Func.forRemove(Gm.friendData.canHireAids,"heroId",args.heroId)
        }
        Gm.red.refreshEventState("friend")
    },
    onNetHireReturn(args){
        var hero = Gm.heroData.getHeroById(args.heroId)
        if (hero){//自己的
            Func.forRemove(Gm.friendData.hireLends,"heroId",args.heroId)
        }else{
            Func.forRemove(Gm.friendData.hireList,"heroId",args.heroId)
            Gm.friendNet.getCanHires()
        }
    },
    onNetOnOff(args){
        if (args.module !=0){
            return
        }
        Gm.friendData.collectFriendPointNum = args.collectFriendPointNum
        Gm.friendData.changeOffOn(args.friendInfo || [])
        if (this.isView()){
            this.view.updateLeaveTime()
        }
    },
    onNetAllAid(args){
        Gm.friendData.aidList = args.aidInfo
    },
    onNetChangeAid(args){
        var lastList = Func.copyArr(Gm.friendNet.aidList)
        var list = []
        for (let index = 0; index < Gm.friendNet.changeAids.length; index++) {
            const v = Gm.friendNet.changeAids[index];
            var data = Func.forBy(lastList,"heroId",v)
            if (data == null){
                data = {heroId:v,remainTime:0,aidFriName:null}
            }
            list.push(data)
        }
        Gm.friendData.aidList = list
        Gm.ui.removeByName("FriendAidHerosView")
        if (this.isView()){
            this.view.updateView()
        }
    },
    onLogicSuss(){
        Gm.friendData.clearData()
        Gm.friendNet.getAll()
        Gm.friendNet.getAid()
        Gm.friendNet.getHireInfos()
    },
    onNetFriendInfos(args){
        Gm.friendData.setData(args.friendInfo,args.applyInfo,args.blacklistInfo)
        Gm.red.refreshEventState("friend")
    },
    onNetFriendSearch(args){
        Gm.friendData.searchs = args.friendInfo || []
        if(Gm.friendData.searchs.length == 0 ){
            Gm.floating(Ls.get(7010))
            return
        }
        Gm.send(Events.UPDATE_FRIEND_MGR)
    },
    onNetFriendApply(args){
        Gm.floating(Ls.get(7011))
    },
    onNetFriendChange(args){
        for (let index = 0; index < args.friendInfo.length; index++) {
            const v = args.friendInfo[index];
            if (args.type == 2){
                Gm.friendData.addFriend(v)
                this.onNetFriendReplaApply({targetId:v.playerId})
            }else{
                Gm.friendData.addApply(v)
            }
        }
        if (args.type == 2){
            if (this.isView()){
                this.view.updateView()
            }
        }else{
            Gm.send(Events.UPDATE_FRIEND_MGR)
        }
        Gm.red.refreshEventState("friend")
    },
    onNetFriendReplaApply(args){
        if(args.targetId ==0){
            Gm.friendData.applyList = []
        }else{
            Gm.friendData.delApply(args.targetId)
        }
        Gm.red.refreshEventState("friend")
        Gm.send(Events.UPDATE_FRIEND_MGR)
    },
    onNetErrorCode(args){
        if (args.opCode == MSGCode.OP_FRIEND_REPLY_APPLY_S){
            if (Gm.friendNet.targetId){
                this.onNetFriendReplaApply({targetId:Gm.friendNet.targetId})
                Gm.friendNet.targetId  = 0
            }
        }
    },
    onNetFriendDel(args){
        Gm.friendData.delFriend(args.targetId)
        if(this.isView()){
            this.view.delFriend(args.targetId)
        }
        Gm.red.refreshEventState("friend")
        Gm.send(Events.UPDATE_FRIEND_MGR)
    },
    onNetFriendOnOffline(args){
        var friend = Gm.friendData.getFriend(args.targetId)
        if (friend){
            if (args.type == 0){
                friend.leaveTime = 1
            }else{
                friend.leaveTime = 0
            }
            if (this.isView()){
                this.view.updateItem(friend)
            }
        }
    },
    onNetAddBlack(args){
        Gm.friendData.addBlack(args.blacklistInfo)
        this.onNetFriendDel({targetId:args.blacklistInfo.playerId})
        Gm.send(Events.UPDATE_FRIEND_MGR)
    },
    onNetRemoveBlack(args){
        Gm.friendData.delBlack(args.targetId)
        Gm.send(Events.UPDATE_FRIEND_MGR)
    },
    onNetSendPoint(args){
        var friend
        if (args.sendPlayerId == Gm.userInfo.id){
            var changeState = (id)=>{
                var data = Gm.friendData.getFriend(id)
                data.sendState = 1
                if (this.isView()){
                    this.view.updateItem(data)
                }
            }
            if (args.targetId == 0){
                for (let index = 0; index < Gm.friendData.friendList.length; index++) {
                    const v = Gm.friendData.friendList[index];
                    changeState(v.playerId)
                }
            }else{
                changeState(args.targetId)
            }
        }else{
            friend = Gm.friendData.getFriend(args.sendPlayerId)
            friend.collectState = 1
            if (this.isView()){
                this.view.updateItem(friend)
            }
        }
        Gm.red.refreshEventState("friend")
    },
    onNetcollectPoint(args){
        Gm.userInfo.setGameCoin(ConstPb.playerAttr.FRIEND_POINT,args.friendPoint)
        for (let index = 0; index < args.targetId.length; index++) {
            var friend = Gm.friendData.getFriend( args.targetId[index])
            friend.collectState = 2
            Gm.friendData.collectFriendPointNum = Gm.friendData.collectFriendPointNum + 1
            if (this.isView()){
                this.view.updateItem(friend)
            }
        }
        Gm.red.refreshEventState("friend")
    },

    onNetBattleInfo(args){
        if(args.battleInfo && args.battleInfo[0] && args.battleInfo[0].type == ConstPb.battleType.BATTLE_PVE_BOSS){
            if (args.battleInfo[0].fightResult ==1){
                var viewConf = Gm.config.getViewByName("FriendView",2)
                if (args.mapId == viewConf.openMapId){//解锁
                    var allHero = Gm.heroData.heros
                    allHero.sort((a,b)=>{
                        return b.fight - a.fight
                    })

                    var heroIds = []

                    for (var i = 0; i < allHero.length; i++) {
                        heroIds.push(allHero[i].heroId)
                        if (heroIds.length == 6){
                            break
                        }
                    }
                    Gm.friendNet.changeAid(heroIds)
                }
            }
        }

    }
});
