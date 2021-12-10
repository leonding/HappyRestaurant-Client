var MSGCode = require("MSGCode")

//水晶秘境列表
MSGCode.proto[MSGCode.OP_ORE_ROOM_LIST_C]                   = "Ore.OPOreRoomListInfo"
//水晶秘境列表返回
MSGCode.proto[MSGCode.OP_ORE_ROOM_LIST_S]                   = "Ore.OPOreRoomListInfoRet"
//水晶秘境战斗
MSGCode.proto[MSGCode.OP_ORE_BATTLE_C]                          = "Ore.OPOreBattle"
//水晶秘境战斗返回
MSGCode.proto[MSGCode.OP_ORE_BATTLE_S]                          = "Ore.OPOreBattleRet"
//水晶秘境占领提示
MSGCode.proto[MSGCode.OP_ORE_OCCUPIED_S]                     = "Ore.OPOreOccupiedRet"
//水晶秘境领取奖励
MSGCode.proto[MSGCode.OP_ORE_RECEIVE_C]                         = "Ore.OPOreReceive"
//水晶秘境领取奖励返回
MSGCode.proto[MSGCode.OP_ORE_RECEIVE_S]                         = "Ore.OPOreReceiveRet"
//水晶秘境战斗日志
MSGCode.proto[MSGCode.OP_ORE_BATTLE_LOG_C]                  = "Ore.OPOreBattleLog"
//水晶秘境战斗日志返回
MSGCode.proto[MSGCode.OP_ORE_BATTLE_LOG_S]                  = "Ore.OPOreBattleLogRet"

//水晶秘境战斗日志数据
MSGCode.proto[MSGCode.OP_ORE_BATTLE_LOG_DATA_C]       = "Ore.OPOreBattleDataLog"
//水晶秘境战斗日志数据返回
MSGCode.proto[MSGCode.OP_ORE_BATTLE_LOG_DATA_S]       = "Ore.OPOreBattleLogDataRet"
//水晶秘境排行榜
MSGCode.proto[MSGCode.OP_ORE_RANK_C]                             = "Ore.OPOreRankInfo"
//水晶秘境排行榜返回
MSGCode.proto[MSGCode.OP_ORE_RANK_S]                             = "Ore.OPOreRankInfoRet"
//水晶秘境防守阵容
MSGCode.proto[MSGCode.OP_ORE_DEFENDER_C]                     = "Ore.OreDefender"
MSGCode.proto[MSGCode.OP_ORE_DEFENDER_S]                     = "Ore.OreDefenderRet"
//水晶秘境房间
MSGCode.proto[MSGCode.OP_ORE_ROOM_C]                           = "Ore.OPOreRoomInfo"
MSGCode.proto[MSGCode.OP_ORE_ROOM_S]                           = "Ore.OreRoomInfoRet"
//水晶秘境 购买挑战次数
MSGCode.proto[MSGCode.OP_ORE_BUY_COUNT_C]                 = "Ore.OPOreBuyCount"
MSGCode.proto[MSGCode.OP_ORE_BUY_COUNT_S]                 = "Ore.OPOreBuyCountRet"
cc.Class({
    properties: {
        
    },
    sendOreRoomListInfo(){
        if(OreFunc.oreIsOpen()){
            Gm.sendCmdHttp(MSGCode.OP_ORE_ROOM_LIST_C)
        }
    },
    sendOreBattle(id,lineHero){
        Gm.sendCmdHttp(MSGCode.OP_ORE_BATTLE_C,{id:id,lineHero:lineHero})
    },
    sendOreReceive(id,roomType){
        Gm.sendCmdHttp(MSGCode.OP_ORE_RECEIVE_C,{id:id,roomType:roomType})
    },
    sendOreBattleLog(){ 
        if(OreFunc.oreIsOpen()){
            Gm.sendCmdHttp(MSGCode.OP_ORE_BATTLE_LOG_C)
        }
    },
    sendOreBattleDataLog(key,data){
        this.battleLogInfo = data
        Gm.sendCmdHttp(MSGCode.OP_ORE_BATTLE_LOG_DATA_C,{key:key})
    },
    sendOreRankInfo(){
        Gm.sendCmdHttp(MSGCode.OP_ORE_RANK_C)
    },
    sendOreDeffender(id){
        Gm.sendCmdHttp(MSGCode.OP_ORE_DEFENDER_C,{setting:false,id:id})
    },
    sendOreSetHeros(id,heros){
        this.settingHeros = heros
        var tHeros = []
        for(var i=0;i<heros.length;i++){
            if(heros[i]!=0){
                var hero = Gm.heroData.getHeroById(heros[i])
                hero.position = i+1
                tHeros.push(hero)
            }
        }
        Gm.oreData.myHeros = tHeros
        Gm.sendCmdHttp(MSGCode.OP_ORE_DEFENDER_C,{setting:true,id:id,lineHero:heros})
    },
    sendOreRoomInfo(index){
        if(OreFunc.oreIsOpen()){
            Gm.sendCmdHttp(MSGCode.OP_ORE_ROOM_C,{index:index}) 
        }
    },
    sendOreBuyCount(count){
        if(OreFunc.oreIsOpen()){
            this.buyCount = count
            Gm.sendCmdHttp(MSGCode.OP_ORE_BUY_COUNT_C,{count:count})
        }
    },
});
