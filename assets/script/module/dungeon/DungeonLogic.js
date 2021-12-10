var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){
        
    },
    register:function(){
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
        this.events[MSGCode.OP_DUNGEON_INFO_S] = this.onNetInfo.bind(this)
        this.events[MSGCode.OP_VIEW_TEAM_MODE_S] = this.onNetTeamMode.bind(this)
        this.events[MSGCode.OP_DUNGEON_BATTLE_S] = this.onNetBattle.bind(this)
        this.events[MSGCode.OP_EDIT_DUNGEON_TEAM_S] = this.onNetEdit.bind(this)
        this.events[MSGCode.OP_RECEIVE_DUNGEON_INVITE_S] = this.onNetReceiveInvite.bind(this)
        this.events[MSGCode.OP_DUNGEON_RECORD_S] = this.onNetRecord.bind(this)

        this.events[MSGCode.OP_DUNGEON_STAR_REWARD_S] = this.onNetStarReward.bind(this)
        this.events[MSGCode.OP_DUNGEON_BUY_FIGHT_S] = this.onNetBuyFight.bind(this)

        this.events[MSGCode.OP_DUNGEON_SHENJI_RESET_S] = this.onNetDungeonReset.bind(this)
    },
    onLogicSuss:function(){
        // Gm.dungeonData.clearData()
        Gm.dungeonNet.info(Gm.dungeonData.getOpenIds())
    },
    onNetBuyFight(args){
        var dd = Gm.dungeonData.getData(Gm.dungeonNet.dungeonId)
        dd.buyFightCount = dd.buyFightCount + Gm.dungeonNet.count
        dd.fightCount = dd.fightCount + Gm.dungeonNet.count

        var dataMode = Gm.dungeonData.getDataByMode(Gm.dungeonNet.dungeonId,Gm.dungeonNet.mode)
        var dungeonType = 1
        if (dataMode && dataMode.star.length == 3){//扫荡
            Gm.dungeonNet.battle(Gm.dungeonNet.dungeonId,Gm.dungeonNet.mode,dungeonType,[])
        }else{
            Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_DUNGEON,dungeonType:dungeonType,dungeonId:Gm.dungeonNet.dungeonId,mode:Gm.dungeonNet.mode})
        }
    },
    onNetInfo(args){
        for (let index = 0; index < args.dungeonInfo.length; index++) {
            Gm.dungeonData.pushData(args.dungeonInfo[index])    
        }
        Gm.red.refreshEventState("dungeon")
        Gm.red.refreshEventState("dungeonActivity")
    },
    onNetEdit(args){
        if(args.editType == ConstPb.dungeonEditTeam.DUNGEON_INVITE){
            Gm.floating(Ls.get(1237))
            return
        }
        Gm.ui.removeByName("DungeonTeamListView")
        Gm.dungeonNet.teamMode(Gm.dungeonNet.editInfo.dungeonId,Gm.dungeonNet.editInfo.mode)
    },
    onNetTeamMode(args){
        Gm.dungeonData.teamMode = args
        if (args.pushType == 2 && !args.inTeam ){
            if (Gm.ui.getLayerActive("DungeonTeamView")){
                Gm.floating(Ls.get(1238))
                Gm.ui.removeByName("DungeonTeamView")
            }
            Gm.dungeonData.teamInfo = null
            return
        }
        if (args.inTeam){
            if(Gm.dungeonData.teamInfo && Gm.dungeonNet.teamModeInfo && Gm.dungeonData.teamInfo.mode != Gm.dungeonNet.teamModeInfo.mode){
                Gm.floating(Ls.get(1239))
            }
            Gm.dungeonData.teamInfo = args.teamInfo[0]
            if ((args.pushType == 1 || args.pushType == 3) && !Gm.ui.getLayerActive("DungeonTeamView")){
                return
            }
            Gm.ui.create("DungeonTeamView",true)
            Gm.ui.removeByName("DungeonTeamListView")
        }else{
            Gm.dungeonData.teamInfo = null
            Gm.ui.removeByName("DungeonTeamView")
            Gm.ui.create("DungeonTeamListView",Gm.dungeonNet.teamModeInfo)
        }
        Gm.dungeonNet.teamModeInfo = null
    },
    onNetBattle(args,isRecord){
        isRecord = isRecord || false
        var newArgs = {battleInfo:[],fightResult:args.fightResult}
        var battleInfo = null
        for (let index = 0; index < args.battleInfo.length; index++) {
            const v = args.battleInfo[index];
            if (v.battleInfo){
                newArgs.battleInfo[index] = v.battleInfo
            }else{
                newArgs.battleInfo[index] = {}
                var info = args.battleInfo[0].battleInfo || args.battleInfo[1].battleInfo
                newArgs.battleInfo[index].type = info.type
                newArgs.battleInfo[index].fightResult = 0
                newArgs.battleInfo[index].isEmpty = true
            }
            if (v.battleInfo){
                battleInfo = v.battleInfo
            }
        }
        if (newArgs.fightResult != null){
            if(newArgs.battleInfo.length == 0){
                if (Gm.dungeonData.teamInfo && Gm.userInfo.id == Gm.dungeonData.teamInfo.leaderId){
                    if (!Gm.ui.getLayerActive("DungeonTeamView")){
                        Gm.floating(cc.js.formatStr(Ls.get(1240),Ls.get(1241+ newArgs.fightResult)))
                    }
                }else{
                    Gm.floating(cc.js.formatStr(Ls.get(1240),Ls.get(1241+ newArgs.fightResult)))
                    Gm.ui.removeByName("DungeonTeamView")
                    if (newArgs.fightResult == 1){
                        if (args.dungeonId){
                            data = Gm.dungeonData.getData(args.dungeonId)
                            if (data){
                                data.fightCount = data.fightCount -1
                            }
                        }
                    }
                }
                return
            }
        }else{
            if (newArgs.battleInfo.length == 0 ){//扫荡
                var data = Gm.dungeonData.getData(Gm.dungeonNet.battleInfo.dungeonId)
                if(data){
                    data.fightCount = data.fightCount - 1
                    if (Gm.dungeonNet.battleInfo.allSweep){
                        data.fightCount = 0
                    }
                }
                // var info = Gm.config.getDungeonInfo(Gm.dungeonNet.battleInfo.dungeonId,Gm.dungeonNet.battleInfo.mode)
                // cc.log(args.reward.drop.item)
                // Gm.receive(args.reward.drop.item)
                return
            }
        }

        var data
        if (!isRecord){
            if (Gm.dungeonNet.battleInfo && Gm.dungeonNet.battleInfo.heros.length > 0 ){
                Gm.heroData.setLineHero({type:ConstPb.lineHero.LINE_DUNGEON,hero:Gm.dungeonNet.battleInfo.heros})
            }
    
            if (Gm.dungeonData.teamInfo == null &&  battleInfo.type ==  ConstPb.battleType.BATTLE_DUNGEON_TEAM){
                return
            }
            if (args.dungeonId && args.mode){
                Gm.dungeonData.battleData = {dungeonId:args.dungeonId,mode:args.mode}
                data = Gm.dungeonData.getData(args.dungeonId)
            }
        }

        newArgs.isStart = Gm.dungeonData.isHasInfo()
        Gm.ui.create("BattleLoadView",newArgs)
        if(battleInfo.type == ConstPb.battleType.BATTLE_DUNGEON_ONE){
            if (battleInfo.fightResult ==1 ){
                Gm.dungeonData.pushPassModes(Gm.dungeonNet.battleInfo.dungeonId,Gm.dungeonNet.battleInfo.mode,args.star)
                if(data){
                    data.fightCount = data.fightCount -1
                    Gm.red.refreshEventState("dungeon")
                    Gm.red.refreshEventState("dungeonActivity")
                }
            }
        }
    },
    onNetReceiveInvite(args){
        Gm.dungeonData.pushInvite(args)
        Gm.ui.create("DungeonInviteTipsView")
    },
    onNetRecord(args){
        if (args.fileName == null){
            return
        }
        Gm.loading(Ls.get(100))
        Gm.http.downloadFile(Globalval.videoUrl + args.fileName,(data)=>{
            Gm.removeLoading()
            var battle = Gm.netLogic.pbDecode(999,data)
            Gm.dungeonData.recodTeamInfo = battle.teamInfo
            this.onNetBattle(battle,true)
        },true)
    },
    onNetStarReward(args){
        var dd = Gm.dungeonNet.boxRewardData
        var data = Gm.dungeonData.getData(Gm.dungeonNet.boxRewardData.dungeonId)
        data.starBox.push(dd.star)
        Gm.red.refreshEventState("dungeon")
        Gm.red.refreshEventState("dungeonActivity")
    },
    onNetDungeonReset(args){
        var dd = Gm.dungeonData.getData(Gm.dungeonNet.dungeonId)
        if (dd){
            dd.starBox = []
            dd.sweepStar = []
            if (dd.freeReset > 0){
                dd.freeReset = dd.freeReset -1
            }else if (dd.freeReset == 0){
                dd.surplusReset = dd.surplusReset + 1
            }
        }
        Gm.red.refreshEventState("dungeonActivity")
    },
});
