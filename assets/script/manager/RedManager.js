// RedManager
cc.Class({
    properties: {
    },
    ctor:function(){
        //一个红点对应N个事件
        this.observersNodes = [] //{eventsNames,nodeParent,redNode}
        this.states = {
            heroJob:{},//职业点 {英雄名:bool,....}
            heroSkill:{},//技能 {英雄名:bool,....}
            heroExcWeaponRed:{},//专属武器
            heroExcWeapon:{},//专属武器
            heroFlyTo:{},//进阶
            heroEquip1:{},//装备1 {英雄名:bool,....}
            heroEquip2:{},//装备2 {英雄名:bool,....}
            heroEquip3:{},//装备3 {英雄名:bool,....}
            heroEquip4:{},//装备4 {英雄名:bool,....}
            heroEquip5:{},//装备5 {英雄名:bool,....}
            heroEquip6:{},//装备6 {英雄名:bool,....}
            heroEquipUpValue1:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipUpValue2:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipUpValue3:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipUpValue4:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipUpValue5:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipUpValue6:{},//{装备部位：{英雄名:{up:bool},...}}
            heroEquipSpecial:{2:false,3:false,4:false},//装备特殊（神器，宝石，附魔）所有共用一个
            heroNew:{},//新英雄
            travel:{1:false,2:false},//游历
            mission:{1:false,2:false,3:false},//任务
            bag:{0:false},//背包，0装备
            blackShop:{all:false},
            mail:{0:false,1:false},
            fight:{gjAward:false,gjTeam:false},
            arena:{1:false},//1.记录
            sign:{month:false},
            friend:{apply:false,point:false,hireApply:false},
            unionChat:{},
            union:{sign:false,apply:false,taskFinished:false},
            weekSignAward:{0:false,1:false,2:false,3:false,4:false,5:false},
            relate:{}, //羁绊，3层结构，idGroup:{heroId:false}
            activity:{},
            firstPay:{first:false,firstPaybtn_0:false,firstPaybtn_1:false,firstPaybtn_2:false,firstPaybtn_3:false},
            accuPay:{first:false,accuPaybtn_0:false,accuPaybtn_1:false,accuPaybtn_2:false,accuPaybtn_3:false},
            eventGroup:{},
            picture:{},//拼图
            miJing:{},//秘境
            fastFight:{0:false},
            vip:{},
            //102 新手礼包
            timeNoob:{limitTimeShopLevel:false,limitTimeShopChapter:false},
            tower:{},
            dungeon:{},
            privateChat:{},
            appraisal:{},
            dungeonActivity:{},
            //抽卡
            lottery:{common:false,commonOne:false,commonTen:false,friend:false,friendOne:false,friendTen:false},
            towerBox:{},
            villa:{hero:false},//家园
            ore:{oreIsOpen:false,oreHasReward:false},//水晶秘境
            biography:{},//传记
            bingo:{},
            limitmark:{},//限时黑市
            story:{},//剧情
            bossTrial:{},//boss试炼
            worldBoss:{},//世界BOSS
            hegemony:{canDeclareWar:false},//同盟争霸
            lotterySkin:{},//周年抽皮肤活动
        }
        for (let index = 1; index <= 7; index++) {
            this.states["weekSign" + index] = [false,false,false,false]
        }


        this.valueUpKeys = {} //特殊红点（属性变更）
        for (var i = 1; i <= 6; i++) {
            this.valueUpKeys["heroEquipUpValue" + i] = true
        }
        this.valueUpKeys["heroExcWeapon"] = true
    },
    initRed(){
        
    },
    newPictureRed(stateToChange,list){
        stateToChange = {}
        for (const key in list) {
            const pageList = list[key];
            stateToChange[key] = false
            if (pageList){
                for (let i = 0; i < pageList.length-1; i++) {
                    var skillConf1 = Gm.config.getSkill(pageList[i].skillId)
                    if (skillConf1.level == 5){
                        continue
                    }
                    for (let j = i+1; j < pageList.length; j++) {
                        var skillConf2 = Gm.config.getSkill(pageList[j].skillId)
                        if (skillConf2.level == 5){
                            continue
                        }
                        if (skillConf1.level == skillConf2.level){
                            stateToChange[key] = true
                            break
                        }
                    }
                    if (stateToChange[key]){
                        break
                    }
                }
            }
        }
    },
    refreshEventState:function(event){
        var stateToChange = this.states[event]
        switch(event){
            case "worldBoss":
                stateToChange[0] = Gm.worldBossData.getRed()
                break
            case "bossTrial":
                stateToChange = {}
                var nowIndex = Gm.bossTrialData.getSaveIndex()
                for (var i = 0; i < Gm.bossTrialData.currentMapId.length; i++) {
                    var id = Gm.bossTrialData.currentMapId[i]
                    if (i == nowIndex+1){//当前可打
                        var conf =  Gm.config.getZhenFaBossById(id)
                        if (Gm.userInfo.maxMapId > conf.unlockMapId){
                            stateToChange[id] = 1 != cc.sys.localStorage.getItem(Gm.bossTrialData.getLocalStorageKey(id))
                        }
                        break
                    }
                }
                break
            case "biography":
                stateToChange = {}
                if (!HeroFunc.isBiography){
                    break
                }
                var heros = Gm.heroData.getBossLineHeros()
                for (const key in heros) {
                    const v = heros[key];
                    var hero = Gm.heroData.getHeroById(v)
                    if (hero){
                        stateToChange[hero.baseId] = cc.sys.localStorage.getItem(HeroFunc.getBiographyKey(hero.baseId)) != 1
                    }
                }
                break
            case "fastFight":
                var a = new Date(Gm.userData.getFastFight())
                a.setHours(0)
                a.setMinutes(0)
                a.setSeconds(0)
                a.setMilliseconds(0)
                var time1 = a.getTime()
                var time2 = Gm.userData.getTime_m()
                stateToChange[0] = Math.floor((time2 - time1)/86400000) > 0
            break
            case "dungeonActivity":
                stateToChange = {}
                if (!EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_FUBEN)){
                    return
                }
                stateToChange.task = {0:this.missionRed(ConstPb.EventOpenType.EVENTOP_SHENJI_TASK)}

                stateToChange.newDay = false
                var isOpen = cc.sys.localStorage.getItem(DungeonFunc.getDungeonActivityRedStr()) || 0
                if (isOpen == 0){//每一轮打开一次
                    stateToChange.newDay = true
                }
                var confList = Gm.config.getOpenDungeons(ConstPb.EventOpenType.EVENTOP_FUBEN)

                for (var i = 0; i < confList.length; i++) {
                    var v = confList[i]
                    stateToChange[v.id] = {}
                    if (DungeonFunc.isUnlock(v,false)){
                        stateToChange[v.id].open = !Gm.userData.isHintDay(Gm.dungeonData.getLocalStorageKey(v.id))
                        var allSatr = Gm.dungeonData.getDungeonAllStar(v.id)
                        var awardConf = Gm.config.getDungeonStarRewardConfig(v.id)
                        var isStar = false
                        for (let index = 0; index < awardConf.length; index++) {
                            const starData = awardConf[index];
                            if (allSatr >= starData.star && !Gm.dungeonData.getHasStar(v.id,starData.star)){
                                isStar = true
                                break
                            }
                        }
                        stateToChange[v.id].star = isStar

                        var modeData = Gm.dungeonData.getData(v.id)
                        if (modeData.freeReset > 0){
                            stateToChange[v.id].reset = DungeonFunc.isUnlockAllMode(v.id)
                        }
                    }
                }
                break
            case "dungeon":
                stateToChange = {}
                if (!Func.isUnlock("DungeonView",false)){
                    break
                }
                var confList = Gm.config.getOpenDungeons(DungeonFunc.Type.DEFAULT)

                var defaultCount = Gm.config.getConst("dungeon_common_init_count")
                for (let index = 0; index < confList.length; index++) {
                    const v = confList[index];
                    if (v.openconditions > Gm.userInfo.maxMapId){
                        continue
                    }
                    //先算奖励红点
                    var allSatr = Gm.dungeonData.getDungeonAllStar(v.id)
                    var awardConf = Gm.config.getDungeonStarRewardConfig(v.id)
                    for (let i = 0; i < awardConf.length; i++) {
                        var conf = awardConf[i]
                        var is = allSatr >= conf.star && !Gm.dungeonData.getHasStar(v.id,conf.star)
                        stateToChange[v.id] = is
                        break
                    }
                    //奖励未达成。点击红点
                    if (!stateToChange[v.id]){
                        stateToChange[v.id] = (!Gm.userData.isHintDay(Gm.dungeonData.getLocalStorageKey(v.id))) && Gm.dungeonData.getData(v.id).fightCount == defaultCount
                    }
                }
                break
            case "tower":
                stateToChange = {}
                var list = Gm.config.getTowerGroup()
                for (let index = 0; index < list.length; index++) {
                    const v = list[index];
                    stateToChange[v.group] = false
                    if (v.group > 0 && Gm.userInfo.maxMapId > v.unlockCondition){
                        var value = cc.sys.localStorage.getItem(Gm.towerData.getLocalStorageKey(v.group)) || ""
                        stateToChange[v.group] = value == "" && TowerFunc.isTimeOpen(v.clientOpenTime)
                    }
                }
                break
            case "towerBox":
                stateToChange = {0:Gm.towerData.isBoxCanReceive()}
                break
            case "vip":
                // stateToChange[0] = false
                // for (var i = 1; i <= Gm.userInfo.vipLevel; i++) {
                //     if (!Gm.activityData.isHasAty(AtyFunc.getVipActivityId(i))){
                //         stateToChange[0] = true
                //         break
                //     }
                // }
                break
            case "miJing":
                this.newPictureRed(stateToChange, Gm.pictureData.treasureChessList)
                break
            case "picture":
                this.newPictureRed(stateToChange, Gm.pictureData.chessList)
                break
            case "travel":
                stateToChange = {}
                if (!Func.isUnlock("TravelView",false)){
                    break
                }
                for (var key = 1;key < 3;key++) {
                    var isDone = false
                    var list = Gm.travelData.getData(checkint(key))
                    var lostTime = checkint(Gm.config.getConst("travel_finish_save_time"))
                    for(const i in list){
                        if (list[i].startTime){
                            var pass = Math.floor((Gm.userData.getTime_m() - list[i].startTime)/1000 )
                            var time = list[i].config.time - pass
                            if (time <= 0 || list[i].finishTime){
                                var tmpTime = Gm.userData.getTime_m()
                                if (list[i].finishTime){
                                    tmpTime = lostTime - Math.floor((tmpTime - list[i].finishTime)/1000)
                                }else{
                                    tmpTime = Math.floor((tmpTime - list[i].startTime)/1000)
                                    tmpTime = lostTime - (tmpTime - list[i].config.time)
                                }
                                if (tmpTime > 0){
                                    isDone = true
                                    break
                                }
                            }
                        }
                    }
                    stateToChange[key] = isDone
                }
                break
            case "firstPay":
                stateToChange.firstPay = Gm.firstPayData.isCanReceive(1)
                for(let i = 1; i<5; i++){
                    stateToChange["firstPaybtn_"+(i-1)] = Gm.firstPayData.isReceiveFirstActivityReward(i) == 1
                }
                break
            case "accuPay":
                stateToChange.accuPay = Gm.accumulativePayData.isCanReceive(1)
                let accuPayconf = Gm.config.getAccumulativePayConfig(AtyFunc.ACCU_PAY_TYPE)
                let accuCount = 0
                for(let key in accuPayconf){
                    stateToChange["accuPaybtn_"+(accuCount)] = Gm.accumulativePayData.isReceiveFirstActivityReward(accuPayconf[key].id) == 1
                    accuCount++
                }
                break
            case "lotterySkin":
                let lotteryIsAct = Gm.lotterySkinData.isOpen()
                stateToChange = {isRed:lotteryIsAct}
                break
            case "activity":
                stateToChange = {}
                if (!Func.isUnlock("ActivityMainView",false)){
                    break
                }
                var list = Gm.config.getEventType()
                for (let index = 0; index < list.length; index++) {
                    const v = list[index];
                    if (v.trigger == 1){
                        var toChange = {}
                        stateToChange[v.type] = toChange
                        for (let i = 0; i < v.childType.length; i++) {
                            const type = v.childType[i];
                            var rewards
                            if (v.type == 4){
                                rewards = Gm.config.getEventPayReward(type,Gm.activityData.data.passMeLv)
                            }else{
                                rewards = Gm.config.getEventPayReward(type)
                            }
                            for (var j = 0; j < rewards.length; j++) {
                                var itemConf = rewards[j]
                                if (v.type == 2){//普通礼包
                                    if (AtyFunc.getPrice(itemConf.id) == 0 && !Gm.activityData.isHasAty(itemConf.id)){
                                        toChange[type] = true
                                        break
                                    }
                                }else if (v.type == 3){//月卡
                                    var dd = Gm.activityData.getAtyId(itemConf.id)
                                    toChange[itemConf.id] = dd && dd.expireTime > Gm.userData.getTime_m() && dd.status == 0
                                }else if (v.type == 4){//赏金
                                    if(Gm.activityData.data.passMedalResetTime != 0 && Gm.userInfo.passMedal >= itemConf.receiveCondition[0].num){
                                        var dd = Gm.activityData.getAtyId(itemConf.id)
                                        if (dd == null){
                                            toChange[itemConf.id] = true
                                        }else if (dd.status == 1 && Gm.activityData.isUnlockPassMedal()){
                                            toChange[itemConf.id] = true
                                        }
                                    }
                                }
                            }
                        }
                        if (v.type == 2){
                            for (var i = 1; i <= Gm.userInfo.vipLevel; i++) {
                                if (!Gm.activityData.isHasAty(AtyFunc.getVipActivityId(i))){
                                    toChange["vip"] = true
                                    toChange[201] = true
                                    break
                                }
                            }
                        }

                    }
                }
                break
            case "relate":
                if (!Func.isUnlock(8002,false)){
                    break
                }
                var list = Gm.heroData.relateReds
                stateToChange = []
                for (let index = 0; index < list.length; index++) {
                    const v = list[index];
                    stateToChange[v.idGroup] = {}
                    for (let i = 0; i < v.heroRelate.length; i++) {
                        const v1 = v.heroRelate[i];
                        stateToChange[v.idGroup][v1.heroGroupId] = v1.state ==0
                    }
                }
                break
            case "union":
                stateToChange = {}
                if (!Func.isUnlock("UnionView",false)){
                    break
                }
                // stateToChange.sign = Gm.unionData.allianceId >0 &&  !Gm.unionData.isSign
                stateToChange.taskFinished = Gm.unionData.getSportsTaskFinish()
                stateToChange.apply = Gm.unionData.info && Gm.unionData.isMgr() && Gm.unionData.applyList && Gm.unionData.applyList.length > 0
                stateToChange.boss = Gm.unionData.bossInfo && Gm.unionData.bossInfo.status == 1 && Gm.unionData.bossInfo.battleCount < Gm.config.getVip().allianceBossChallengeNum
                if (stateToChange.boss){
                    cc.log(Gm.unionData.bossInfo,Gm.unionData.bossInfo.status,Gm.config.getVip().allianceBossChallengeNum,Gm.unionData.bossInfo.status == 1)
                }
                break
            case "unionChat":
                stateToChange = {2:Gm.chatData.unionChatRed}
                break
            case "privateChat":
                stateToChange = Gm.chatData.privateChatRed
                break
            case "friend":
                stateToChange = {}
                if (!Func.isUnlock("FriendView",false)){
                    break
                }
                stateToChange.apply = Gm.friendData.applyList.length > 0
                stateToChange.point = false
                for (let index = 0; index < Gm.friendData.friendList.length; index++) {
                    const v = Gm.friendData.friendList[index];
                    if (v.collectState == 1){
                        stateToChange.point = true
                        break
                    }
                }
                stateToChange.hireApply = Gm.friendData.hireApplys.length >0
                break
            case "sign":
                stateToChange = {}
                if (!Func.isUnlock("SignView",false)){
                    break
                }
                if (Gm.signData.monthData){
                    stateToChange.month = Gm.signData.getNowDay() >Gm.signData.getHasDay()
                    for (let index = 1; index <= 4; index++) {
                        stateToChange[index] = Gm.signData.getHasDay()>=Gm.config.getSignCount(index).day && Gm.signData.getHasCountId(index)==false
                    }
                }
                break
            case "arena":
                stateToChange = {}
                if (!Func.isUnlock("ArenaView",false)){
                    break
                }
                stateToChange[1] = Gm.red.m_bHasArena
                break
            case "fight":
                stateToChange.gjAward = Gm.userData.getPassTime(Gm.userInfo.lastGuaJiAwardTime) > 30*60 // || Gm.battleData.getCurrGjDrop().item.length > 0
                stateToChange.gjTeam = this.m_bHasLineUp
                break;
            case "mail":
                for (const key in stateToChange) {
                    var tmpList = Gm.mailData.getMisByType(key)
                    var isDone = false
                    if(tmpList){
                        for (let index = 0; index < tmpList.length; index++) {
                            const v = tmpList[index];
                            if (v.emailState == 0){
                                isDone = true
                                break
                            }
                        }
                    }
                    stateToChange[key] = isDone
                }
                break;
            case "blackShop":
                var now = Func.dateFtt("yyyy-MM-dd",Gm.userData.getTime_m())
                var last = cc.sys.localStorage.getItem("blackShopTime") || ""
                stateToChange.all = now != last
                break
            case "heroJob":
                // stateToChange = this.heroRed(event)
                break;
            case "heroSkill":
                stateToChange = this.heroRed(event)
                break;
            case "heroExcWeaponRed":
                stateToChange = this.heroRed(event)
                break;
            case "heroExcWeapon":
                stateToChange = this.heroRed(event)
                break;
            case "heroFlyTo":

                var heros = Gm.heroData.heroFlyAll()
                var isRed = false
                for (let index = 0; index < heros.length; index++) {
                    const hero = heros[index];
                    var ll = HeroFunc.getFlyList([hero],heros,{})
                    if (ll.length >0){
                        isRed = true
                        break    
                    }
                }
                stateToChange = {flyTo:isRed}
                break
            case "heroEquip1":
                stateToChange = this.heroRed(event,1)
                break;
            case "heroEquip2":
                stateToChange = this.heroRed(event,2)
                break;
            case "heroEquip3":
                stateToChange = this.heroRed(event,3)
                break;
            case "heroEquip4":
                stateToChange = this.heroRed(event,4)
                break;
            case "heroEquip5":
                stateToChange = this.heroRed(event,5)
                break;
            case "heroEquip6":
                stateToChange = this.heroRed(event,6)
                break;
            case "heroEquipUpValue1":
                stateToChange = this.heroEquipValueRed(1)
                break
            case "heroEquipUpValue2":
                stateToChange = this.heroEquipValueRed(2)
                break
            case "heroEquipUpValue3":
                stateToChange = this.heroEquipValueRed(3)
                break
            case "heroEquipUpValue4":
                stateToChange = this.heroEquipValueRed(4)
                break
            case "heroEquipUpValue5":
                stateToChange = this.heroEquipValueRed(5)
                break
            case "heroEquipUpValue6":
                stateToChange = this.heroEquipValueRed(6)
                break
            case "heroEquipSpecial":
                break
            case "heroNew":
                var list = Gm.heroData.getCanUnlockHero()
                stateToChange = {}
                for (let index = 0; index < list.length; index++) {
                    const v = list[index];
                    stateToChange[v.baseId] = true
                }
                break;
            case "mission":
                for (const key in stateToChange) {
                    stateToChange[key] = this.missionRed(key)
                }
                break;
            case "bag":
                stateToChange[0] = Gm.bagData.isBagSize() && Gm.config.getBuyBag(Gm.userInfo.openPocketCount+1)
                stateToChange[2] = false
                stateToChange[3] = false

                var sps = Gm.bagData.getAllItems()
                for (let i = 0; i < sps.length; i++) {
                    const v = sps[i];
                    var itemConf = Gm.config.getItem(v.baseId)
                    if (itemConf == null){
                        continue;
                    }
                    if (itemConf.type == ConstPb.propsType.SUIT_CHIP){
                        if (v.count >= itemConf.need_chip){
                            stateToChange[2] = true
                        }
                    }else if (itemConf.type == ConstPb.propsType.HERO_CHIP_PACKAGE){
                        if (v.count >= itemConf.need_chip){
                            stateToChange[3] = true
                        }
                    }
                    if (stateToChange[2] && stateToChange[3]){
                        break
                    }
                }
                if (!stateToChange[3]){
                    var list = Gm.heroData.heroChips
                    for (let i = 0; i < list.length; i++) {
                        const v = list[i];
                        var itemConf = Gm.config.getItem(v.baseId)
                        if (v.num >= itemConf.need_chip){
                            stateToChange[3] = true
                        }
                    }
                }
                break
            case "eventGroup":
                if (Gm.signData.getEventEndTime() <= 0){
                    stateToChange = {}
                    break
                }
                var list = EventFunc.getXsConfs()
                for (let index = 0; index < list.length; index++) {
                    const v = list[index];
                    stateToChange[v.id] = {}
                    if (v.id == ConstPb.EventGroup.EVENT_DAY_SIGN){
                        this.newEventSign(stateToChange[v.id])
                    }else if (v.id == ConstPb.EventGroup.EVENT_SIGN_TASK){
                        this.newEventTask(stateToChange[v.id])
                    }
                }
                break
            case "timeNoob":
                stateToChange = {}
                stateToChange.limitTimeShopLevel = Gm.activityData.checkTimeUpRedItem()
                stateToChange.limitTimeShopChapter = Gm.activityData.checkTimeChapterRedItem()
                break
            case "lottery":
                   stateToChange = {}
                    stateToChange.commonOne = Gm.lotteryData.checkCommonOneRed()
                    stateToChange.commonTen = Gm.lotteryData.checkCommonTenRed()
                    stateToChange.common = stateToChange.commonOne || stateToChange.commonTen
                    stateToChange.friendOne = Gm.lotteryData.checkFriendOneRed()
                    stateToChange.friendTen = Gm.lotteryData.checkFriendTenRed()
                    stateToChange.friend = stateToChange.friendOne ||  stateToChange.friendTen
                break
            case "appraisal":
                var isOpenRaisal =  Gm.appraisalData.isReceive() || !Gm.appraisalData.getOpenAppraisaView()
                stateToChange = {isRed:isOpenRaisal}
                break
            case "bingo":
                    var bingoCount = Gm.bagData.getItemByBaseId(ConstPb.propsToolType.TOOL_BINGO_TICKET)
                    var count = bingoCount == null ? 0 : bingoCount.count
                    var isActive = count > 0 && EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_BINGO)
                    stateToChange = {isRed:isActive}
                    break
            case "limitmark":
                    var islimtMarketCanBuy = !Gm.limitMarketData.getBuySuccess() && !Gm.limitMarketData.getIsFirstOpen()
                    stateToChange = {isRed:islimtMarketCanBuy}
                break 
            case "villa":
                stateToChange = {}
                if (!Func.isUnlock("VillaRoomView",false)){
                    break
                }
                let isAcitvity = Gm.villaData.isCanActivityHero()
                stateToChange = {hero:isAcitvity}
                break
            case "ore":
                let isopen = Gm.oreData.showRed()
                let hasReward = Gm.oreData.hasReward()
                stateToChange = {oreIsOpen:isopen,oreHasReward:hasReward}
                break
            case "limitNoob":
                stateToChange = {}
                let limitRed = Gm.activityData.isFirstOpenLimitPage() && !Gm.activityData.isBuyAllLimitPackage()
                stateToChange = {isRed:limitRed}
              break
            case "story":
                stateToChange = {}
                let storyRed = Gm.storyData.hasNewChapter()
                stateToChange = {isRed:storyRed}
                break
            case "hegemony":
                stateToChange = {}
                let canDeclareWar = Gm.getLogic("HegemonyLogic").canShowDeclareWar()
                stateToChange = {canDeclareWar:canDeclareWar}
                break
        }
        this.states[event] = stateToChange
        this.Judge(event)
    },
    getState(event){
        return this.states[event]
    },
    missionRed(key){
        var list = Gm.missionData.getMisByType(checkint(key))
        var isDone = false
        var tmpPowerNow = 0
        for (const taskkey in list) {
            const v = list[taskkey];
            if (v.rate == -1){
                tmpPowerNow = tmpPowerNow + v.data.active
            }
            if (v.data.rate == v.rate && Gm.userInfo.maxMapId >= v.data.openLevel){
                isDone = true
            }
        }
        if (key == 1){
            var tmpData = Gm.config.getDailyMis()
            var tmpHas = true
            for(const i in tmpData){
                if (tmpData[i].type == 1){
                    if (tmpData[i].openLevel <= Gm.userInfo.level){
                        tmpHas = true
                        if (tmpPowerNow >= tmpData[i].active){
                            if (Gm.missionData.isActiveRece(tmpData[i].id)){
                                isDone = true
                                break
                            }else{
                                tmpHas = false
                            }
                        }
                    }
                }
            }
            if (isDone && !tmpHas){
                isDone = false
            }
            if (Gm.missionData.activeAtyOpen && !isDone){
                var tmpAtyOp = Gm.config.getConst("activity_daily_task_active")
                if (tmpPowerNow >= tmpAtyOp && Gm.missionData.isActiveRece(0)){
                    isDone = true
                }
            }
        }else if(key == 2){
            var tmpData = Gm.config.getDailyMis()
            var tmpHas = true
            for(const i in tmpData){
                if (tmpData[i].type == 2){
                    tmpHas = true
                    if (tmpData[i].openLevel <= Gm.userInfo.level){
                        if (tmpPowerNow >= tmpData[i].active){
                            if (Gm.missionData.isActiveRece(tmpData[i].id)){
                                isDone = true
                                break
                            }else{
                                tmpHas = false
                            }
                        }
                    }
                }
            }
            if (isDone && !tmpHas){
                isDone = false
            }
        }
        return isDone
    },
    newEventTask(stateToChange){
        var eventData = Gm.signData.getEventInfoById(ConstPb.EventGroup.EVENT_DAY_SIGN)
        var signDay = eventData.signDay
        for (let index = 1; index <= signDay; index++) {
            var list = Gm.config.getEventTasksByDay(index)
            stateToChange[index] = false
            for (let i = 0; i < list.length; i++) {
                const taskType = list[i];
    
                var tasks = Gm.config.getEventTasksByType(taskType,index)
                tasks.sort(function(a,b){
                    return a.id - b.id
                })
    
                var nowTask = tasks[tasks.length-1]
                for (let j = 0; j < tasks.length; j++) {
                    const v = tasks[j];
                    if (!Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_SIGN_TASK,v.id)){
                        nowTask = v
                        break
                    }
                }
                if (Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_SIGN_TASK,nowTask.id)){
                    
                }else{
                    var nowNum = Gm.signData.getRateByTaskType(ConstPb.EventGroup.EVENT_SIGN_TASK,taskType)
                    if (nowTask.conditionType == 1){
                        if (nowNum >= nowTask.conditionValue){
                            nowNum = 1
                        }else{
                            nowNum = 0
                        }
                    }
                    if (nowNum >= nowTask.rate){
                        stateToChange[index] = true
                    }
                }
            }
        }
    },
    newEventSign(stateToChange){
        var list = Gm.config.getEventSign()

        var eventData = Gm.signData.getEventInfoById(ConstPb.EventGroup.EVENT_DAY_SIGN)

        stateToChange[0] = false
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            if (!Gm.signData.getReceiveTaskId(ConstPb.EventGroup.EVENT_DAY_SIGN,v.id) && eventData.signDay >= v.id){
                stateToChange[0] = true
                break
            }
        }
    },
    heroEquipValueRed(part){
        var heros = Gm.heroData.getBossLineHeros()
        var stateToChange = {}
        var maxSuitExp = Gm.bagData.getAllSuitExp()
        for (const key in heros) {
            const v = heros[key];
            var hero = Gm.heroData.getHeroById(v)
            if (hero){
                stateToChange[hero.heroId] = {}
                //装备
                var nowEquip = hero.getEquipByPart(part)
                if (nowEquip){
                    var equipConf = Gm.config.getEquip(nowEquip.baseId)
                    //强化
                    var viewData = Gm.config.getViewByName("EquipMainView",EquipFunc.EQUIP_SHT)
                    if (Func.isUnlock(viewData.viewId)){
                        if (Gm.userInfo.level > nowEquip.strength){
                            var qhConf = Gm.config.getStrengthen(nowEquip.strength+1)
                            var strength = true
                            for (let j = 0; j < qhConf.consume.length; j++) {
                                const v = qhConf.consume[j];
                                if (Gm.userInfo.getCurrencyNum(v.id) < v.num){
                                    strength = false
                                }
                            }
                            stateToChange[hero.heroId][EquipFunc.EQUIP_SHT] = strength
                        }
                    }
                    //套装升级
                    viewData = Gm.config.getViewByName("EquipMainView",EquipFunc.EQUIP_UP)
                    if (equipConf.levelUpEquip > 0 && Func.isUnlock(viewData.viewId)){
                        var needExp = equipConf.suitUpExp -  nowEquip.suitExp
                        stateToChange[hero.heroId][EquipFunc.EQUIP_UP] = equipConf.suitUpExp > 0 && maxSuitExp >= needExp
                    }
                    // cc.log(stateToChange)
                    // this.updateEquipSpecial(stateToChange,part)
                }
            }
        }
        return stateToChange
    },
    heroRed:function(event,part){
        var heros = Gm.heroData.getBossLineHeros()
        var stateToChange = {}
        for (const key in heros) {
            const v = heros[key];
            var hero = Gm.heroData.getHeroById(v)
            if (hero){
                if (event == "heroJob"){
                    stateToChange[hero.heroId] = false
                    if (Func.isUnlock("TransferView")){
                        var point = Gm.config.getPlayerLevel(Gm.userInfo.level,"point")
                        var tmpJobInfo = Gm.config.getJobInfo(hero.job,hero.jobPoint)
                        if (tmpJobInfo && tmpJobInfo.needPoint){
                            point = point - tmpJobInfo.needPoint
                        }
                        stateToChange[hero.heroId] = point > 0
                    }else{
                        stateToChange[hero.heroId] = false
                    }
                }else if (event == "heroSkill"){
                    stateToChange[hero.heroId] = false
                    var unlockLevel = Gm.config.getConst("unlock_level").split("|")
                    var tmpHeroData = Gm.config.getHero(hero.baseId,hero.qualityId)
                    var heroLevel = Func.configHeroLv(hero,tmpHeroData)
                    var tmpHas = false
                    if (heroLevel >= unlockLevel[0] && hero.skillList.length == 0){
                        tmpHas = true
                    }
                    stateToChange[hero.heroId] = tmpHas
                }
                else if(event == "heroExcWeaponRed"){
                     stateToChange[hero.heroId] = Gm.getLogic("HeroLogic").checkShowRedSprite(hero)
                }
                else if(event == "heroExcWeapon"){
                     stateToChange[hero.heroId] = Gm.getLogic("HeroLogic").checkCanUpWeapon(hero)
                }else {
                    stateToChange[hero.heroId] = false
                    var equips = Gm.bagData.getEquipsByPart(part,Gm.config.getHero(hero.baseId).job)
                    equips.sort(function(a,b){
                        return b.score - a.score
                    })
                    //装备
                    var nowEquip = hero.getEquipByPart(part)
                    if (equips.length > 0){
                        if (nowEquip == null || (nowEquip && equips[0].score > nowEquip.score)){
                            stateToChange[hero.heroId] = true
                        }
                    }
                }
            }
        }
        return stateToChange
    },
    updateEquipSpecial(stateToChange,part){
        if (part < EquipFunc.EQUIP_SHT || part >= EquipFunc.EQUIP_UP ){
            cc.log(part,EquipFunc.EQUIP_UP,"aaaaaaaaaaaa")
            return
        }
        var heroEquipSpecialState = this.states["heroEquipSpecial"]
        for (const key in stateToChange) {
            var value = stateToChange[key]
            for(const key1 in heroEquipSpecialState){
                value[key1] = heroEquipSpecialState[key1]
                if (value[key1]){
                    var hero = Gm.heroData.getHeroById(key)
                    var equip = hero.getEquipByPart(part)
                    if (equip == null){
                        value[key1] = false
                    }else{
                    }                        
                }
            }
        }
    },
    newHeroEquipSpecial(type,bool){
        var stateToChange = this.states["heroEquipSpecial"]
        stateToChange[type] = bool
        if (bool){
            var viewData = Gm.config.getViewByName("EquipMainView",type)
            if (!Func.isUnlock(viewData.viewId)){
                stateToChange[type] = false
            }
        }
        for (var i = 1; i <= 1; i++) {
            var eventName = "heroEquipUpValue" + i
            this.updateEquipSpecial(this.states[eventName],i)
            this.Judge(eventName)
        }
    },
    pushItem(item){
        var conf = Gm.config.getItem(item.baseId)
        if (conf.type == ConstPb.propsType.GEM){
            this.newHeroEquipSpecial(EquipFunc.EQUIP_GEM,true)
        }else if (conf.type == ConstPb.propsType.WS_EXP_STONE || conf.type == ConstPb.propsType.CS_EXP_STONE){
            this.newHeroEquipSpecial(EquipFunc.EQUIP_GODLY,true)
        }else if (conf.type == 126){
            this.newHeroEquipSpecial(EquipFunc.EQUIP_RUNE,true)
        }

        //背包新道具红点
        var bagState = this.states["bag"]
        if (bagState[1] != true && conf.open_type == 1){
            var itemData = Gm.bagData.getItemByBaseId(item.baseId)
            if (itemData == null){
                var items = Gm.bagData.getAllItems()
                var isHas = true
                for (var i = 0; i < items.length; i++) {
                    var itemConf = Gm.config.getItem(items[i].baseId)
                    if (itemConf && itemConf.type == conf.type){
                        isHas = false
                        break
                    }
                }
                if (isHas){
                    this.updateBagItemRed(true)
                }
            }
        }
    },
    updateBagItemRed(isRed){
        this.states["bag"][1] = isRed
        this.Judge("bag")
    },
    Judge:function(event){
        var eventState = this.states[event]
        for (let index = 0; index < this.observersNodes.length; index++) {
            const v = this.observersNodes[index];
            if (!(v.redNode && v.redNode.isValid)){
                continue;
            }
            if (v.eventNames[event]){
                var str = v.eventNames[event].str
                var toAdd = false
                if (str == "all" ){
                    for (const key in eventState) {
                        if (eventState[key]){
                            if (typeof(eventState[key]) == "object" ){
                                for (const stateKey in eventState[key]) {
                                    if (eventState[key][stateKey]){
                                        toAdd = true
                                        break
                                    }
                                }
                            }else{
                                toAdd = true
                                break
                            }
                        }
                    }
                }else{
                    if (eventState[str]){
                        if (typeof(eventState[str]) == "object"){
                            var newStr = v.eventNames[event].newStr
                            if (newStr == "all"){
                                for (const key in eventState[str]) {
                                    if (eventState[str][key]){
                                        toAdd = true
                                        break
                                    }
                                }
                            }else{
                                toAdd = eventState[str][newStr]
                            }
                        }else{
                            toAdd = true
                        }
                    }
                }
                v.eventNames[event].isActive = toAdd

                var isActive = false

                var acs = []
                for (const key in v.eventNames) {
                    const v1 = v.eventNames[key];
                    if (v1.isActive){
                        isActive = true
                        acs[this.valueUpKeys[key]?1:0] = true
                    }
                    if (acs[0] || (acs[0] && acs[1])){
                        break
                    }
                }
                v.redNode.active = isActive

                var newPath = null
                if (acs[0] != true && acs[1]){
                    newPath = "img/share/camp_icon_n2"
                }

                if (v.redNode.namePath != newPath){
                    v.redNode.namePath = newPath
                    var sprite = v.redNode.getComponent(cc.Sprite)
                    if (newPath){
                        var self = this
                        if (this.upValueHdSpf == null){
                            Gm.load.loadSpriteFrame(newPath,function(spr,icon){
                                self.upValueHdSpf = spr
                                if (v.redNode.namePath == "img/share/camp_icon_n2" && icon && icon.node && icon.isValid){
                                    icon.spriteFrame = spr     
                                }
                            },sprite)
                        }else{
                            sprite.spriteFrame = this.upValueHdSpf
                        }
                        
                    }else{
                        sprite.spriteFrame = this.hdSpf
                    }
                }
            }
        }
    },
    add:function(node,event,str,newStr,redpath){
        this.checkRemoveNode()
        var obs = this.getHasObs(node)
        if (obs == null){
            obs = {nodeParent:node,eventNames:{}}
            this.observersNodes.push(obs)
            obs.redNode = this.getRedNode(node,redpath)
            node.on(cc.Node.EventType.CHILD_REMOVED,()=>{
                cc.log("移除====")
            })
        }
        obs.eventNames[event] = {str:str,isActive:false,newStr:newStr}
        // this.refreshEventState(event)
        this.Judge(event)
    },
    checkRemoveNode(){
        for (let index = this.observersNodes.length-1; index >=0; index--) {
            const v = this.observersNodes[index];
            if (!(v.redNode && v.redNode.isValid)){
                this.observersNodes.splice(index,1)
            }
        }
    },
    getRedNode(node,redpath){
        var tmpNode = node.getChildByName("red")
        if (tmpNode == null){
            tmpNode = new cc.Node()
            tmpNode.anchorX = 1
            tmpNode.anchorY = 1
            tmpNode.x = node.width/2//+(node.width/2*0.1)
            if (node.anchorY == 1){
                tmpNode.y = 0
            }else if (node.anchorY == 0){
                tmpNode.y = node.height//-node.height*0.1
            }else{
                tmpNode.y = node.height/2//-(node.height/2*0.1)
            }

            if (node.redData){
                if(node.redData.scale){
                    tmpNode.scale = node.redData.scale
                }
                if (node.redData.offset){
                    tmpNode.x = tmpNode.x + node.redData.offset.x
                    tmpNode.y = tmpNode.y + node.redData.offset.y
                }
            }
                
            var sprite = tmpNode.addComponent(cc.Sprite)
            if (redpath){
                Gm.load.loadSpriteFrame(redpath,(spr,icon)=>{
                        icon.spriteFrame = spr
                    },sprite)
            }else{
                
                if (this.hdSpf){
                    sprite.spriteFrame = this.hdSpf    
                }else{
                    var self = this
                    Gm.load.loadSpriteFrame("img/share/camp_icon_n1",function(spr,icon){
                        self.hdSpf = spr
                        icon.spriteFrame = self.hdSpf  
                    },sprite)
                }
                sprite.spriteFrame = this.hdSpf
            }
            node.addChild(tmpNode,1,"red")
        }
        return tmpNode
    },
    getHasObs:function(node){
        for (let index = 0; index < this.observersNodes.length; index++) {
            const v = this.observersNodes[index];
            if (v.nodeParent == node){
                return v
            }
        }
        return null
    },
    remove:function(node,event,str){
        for (let index = 0; index < this.observersNodes.length; index++) {
            const v = this.observersNodes[index];
            if (v.nodeParent == node){
                if (event == null){
                    v.redNode.active = false
                    this.observersNodes.splice(index,1)
                }else{
                    if (v.eventNames[event] && v.eventNames[event].str == str){
                        v.eventNames[event] = null
                        if (tableNums(v.eventNames) == 0){
                            v.redNode.active = false
                            this.observersNodes.splice(index,1)
                        }
                    }
                }
            }
        }
    },
    refreshEquip:function(){
        for (let index = 1; index <= 6; index++) {
            this.refreshEventState("heroEquip" + index)
        }
        this.refreshEquipValue()
        this.refreshEventState("bag")
        Gm.send(Events.EQUIP_RED_CHAGNE)
    },
    refreshEquipValue(){
         for (let index = 1; index <= 6; index++) {
            this.refreshEventState("heroEquipUpValue" + index)
        }
    },
    refreshHero:function(){
        this.refreshEquip()
        this.refreshEventState("heroJob")
        this.refreshEventState("heroSkill")
        this.refreshEventState("heroExcWeaponRed")
        this.refreshEventState("heroExcWeapon")
        this.refreshEventState("biography")
    },
    isNewEquip(hero){
        if (hero){
            for (let part = 1; part <= 6; part++) {
                var heroEquipState = this.states["heroEquip" + part]
                if (heroEquipState[hero.heroId] == null){
                    var equips = Gm.bagData.getEquipsByPart(part,Gm.config.getHero(hero.baseId).job)
                    if (equips.length > 0){
                        equips.sort(function(a,b){
                            return b.score - a.score
                        })
                        //装备
                        var nowEquip = hero.getEquipByPart(part)
                        if (nowEquip == null || (nowEquip && equips[0].score > nowEquip.score)){
                            return true
                        }
                    }
                }else{
                    if (heroEquipState[hero.heroId] && heroEquipState[hero.heroId]){
                        return true
                    }
                }
            }
        }
        return false
    },
    equipRuneRed(equip){
        if (equip){
            var equipConf = Gm.config.getEquip(equip.baseId)
            var list = equipConf.rune
            for (let index = 0; index < list.length; index++) {
                const v = list[index];
                if (Func.indexOf(equip.unlockTune,v.id) < 0 ){
                    var conf = Gm.config.getSuit(v.id)
                    var flag = true
                    for (let i = 0; i < conf.costItem.length; i++) {
                        const dd = conf.costItem[i];
                        if (Gm.userInfo.getCurrencyNum(dd.id) < dd.num){
                            flag = false
                        }
                    }
                    if (flag){
                        return true
                    }
                }
            }
        }
        return false
    },
    timeNoobRuneRed(){
        this.refreshEventState("timeNoob")
    },
    refreshEventLotteryState(){
         if (!Func.isUnlock("LotteryMain",false)){
            return
        }
        Gm.red.refreshEventState("lottery")
    }
});
