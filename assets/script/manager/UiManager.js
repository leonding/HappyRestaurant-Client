// [查找类型(1:cc.find/2:cc.load),目录,层级]
var LAYER_PATH = {
    // -------------- 更新 --------------//
    // UpdateView: [1,"Canvas/UpdateView",1],
    // -------------- 大厅 --------------//
    MainView:[2,"perfab/page/MainView",1],
    LotteryPageView:[2,"perfab/lottery/LotteryPageView",1],
    TeamPageView:[2,"perfab/page/TeamPageView",1],
    HomePageView:[2,"perfab/page/HomePageView",1],
    FightPageView:[2,"perfab/page/FightPageView",1],
    BagPageView:[2,"perfab/page/BagPageView",1],
    BattleView:[2,"perfab/fight/BattleView",45],
    // -------------- 登录 --------------//
    UpdateView:[2,"perfab/login/UpdateView",1],
    LoginView:[2,"perfab/login/LoginView",1],
    LogoView:[2,"perfab/login/LogoView",1],
    PlateNumberLoginView:[2,"perfab/login/PlateNumberLoginView",1],
    PlateNumberBox:[2,"perfab/login/PlateNumberBox",2],

    // -------------- 弹窗 --------------//
    CreateRole: [2,"perfab/create/CreateRole",2],
    ChangeHead: [2,"perfab/page/ChangeHead",9],
    DropTipsView: [2,"perfab/public/DropTipsView",2],
    FightTeamView: [2,"perfab/ready/FightTeamView",15],
    FightYokeView: [2,"perfab/ready/FightYokeView",48],
    FightCross: [2,"perfab/ready/FightCross",48],
    UnlockChapter: [2,"perfab/page/UnlockChapter",9],
    FightChessView: [2,"perfab/ready/FightChessView",18],
    
    ChatPageView: [2,"perfab/page/ChatPageView",9],

    SkillSetView: [2,"perfab/skill/SkillSetView",21],
    TipsBuffView: [2,"perfab/skill/TipsBuffView",63],
    MissionView: [2,"perfab/mission/MissionView",9],
    ArenaView: [2,"perfab/Arena/ArenaView",2],
    ArenaBuyFight: [2,"perfab/Arena/ArenaBuyFight",9],
    ArenaRecordView: [2,"perfab/Arena/ArenaRecordView",9],
    ArenaInfoBox: [2,"perfab/Arena/ArenaInfoBox",9],
    ArenaAwardView: [2,"perfab/Arena/ArenaAwardView",9],
    
    LotteryMain: [2,"perfab/lottery/LotteryMain",2],
    LotteryAwardStartA: [2,"perfab/lottery/LotteryAwardStartA",9],
    LotteryAwardNew: [2,"perfab/lottery/LotteryAwardNew",2],
    LotteryAwardResult:[2,"perfab/lottery/LotteryAwardResult",2],
    UnLockHero: [2,"perfab/lottery/UnLockHero",60],
    LotteryDiamondTip: [2,"perfab/lottery/LotteryDiamondTip",18],
    LotteryWishList: [2, "perfab/lottery/LotteryWishList",9],
    SuggestView:[2,"perfab/lottery/SuggestView",2],
    LotteryHelpView:[2,"perfab/lottery/LotteryHelpView",12],
    HeroDetail:[2,"perfab/lottery/HeroDetail",12],
    LotteryHeroSelect:[2,"perfab/lottery/LotteryHeroSelect",2],
    LotteryJobSelect:[2,"perfab/lottery/LotteryJobSelect",2],
    LotteryThirdInfo:[2,"perfab/lottery/LotteryThirdInfo",9],
    ItemDetailView:[2,"perfab/lottery/ItemDetailView",12],
    
    BattleLoadView: [2,"perfab/fight/BattleLoadView",48],
    LeaveBattleView: [2,"perfab/fight/LeaveBattleView",48],
    BalanceView: [2,"perfab/fight/BalanceView",48],
    BalanceStatisticView: [2,"perfab/fight/BalanceStatisticView",51],
    AccountLevelUP: [2,"perfab/userSet/AccountLevelUP",51],
    CharacterQualityUp: [2,"perfab/userSet/CharacterQualityUp",51],
    VipLevelUP: [2,"perfab/userSet/VipLevelUP",51],

    MailView: [2,"perfab/mail/MailView",2],
    MailInfoView: [2,"perfab/mail/MailInfoView",9],
    TravelView:[2,"perfab/travel/TravelView",2],
    TravelListView:[2,"perfab/travel/TravelListView",9],
    TravelAward:[2,"perfab/travel/TravelAward",9],
    TravelUsed:[2,"perfab/travel/TravelUsed",9],
    TravelOneKey:[2,"perfab/travel/TravelOneKey",9],


    ItemInfoView:[2,"perfab/equip/ItemInfoView",22],
    ChoiceBoxInfoView:[2,"perfab/equip/ChoiceBoxInfoView",22],
    GemMakeView:[2,"perfab/equip/GemMakeView",22],
    ChipMakeView:[2,"perfab/equip/ChipMakeView",22],


    EquipMainView:[2,"perfab/newEquip/EquipMainView",21],
    EquipInfo:[2,"perfab/newEquip/EquipInfo",21],
    EquipStrengthen:[2,"perfab/newEquip/EquipStrengthen",21],
    EquipGem:[2,"perfab/newEquip/EquipGem",21],
    EquipGodly:[2,"perfab/newEquip/EquipGodly",21],
    EquipRune:[2,"perfab/newEquip/EquipRune",21],
    EquipUpgrade:[2,"perfab/newEquip/EquipUpgrade",21],
    EquipUpgradeAttrView:[2,"perfab/newEquip/EquipUpgradeAttrView",21],
    EquipResolveView:[2,"perfab/newEquip/EquipResolveView",21],
    

    NewShopView:[2,"perfab/shop/NewShopView",22],
    BuyView:[2,"perfab/shop/BuyView",22],
    ActivityMainView:[2,"perfab/activity/ActivityMainView",22],
    TimePacketView:[2,"perfab/activity/TimePacketView",22],
    NormalPacketView:[2,"perfab/activity/NormalPacketView",22],
    PassMedalView:[2,"perfab/activity/PassMedalView",22],
    MonthCardView:[2,"perfab/activity/MonthCardView",22],
    PassMedalUnlockView:[2,"perfab/activity/PassMedalUnlockView",22],
    FirstPayView:[2,"perfab/activity/FirstPayView",22],
    ActivityBuyView:[2,"perfab/activity/ActivityBuyView",22],
    ActivityTimeNoobBuyView:[2,"perfab/activity/ActivityTimeNoobBuyView",22],
    PassMedalBuyExpView:[2,"perfab/activity/PassMedalBuyExpView",22],
    PassMedalOpenView:[2,"perfab/activity/PassMedalOpenView",22],
    PassMedalLvRewardView:[2,"perfab/activity/PassMedalLvRewardView",22],
    PassMedalExpFullView:[2,"perfab/activity/PassMedalExpFullView",22],
    VipView:[2,"perfab/activity/VipView",22],

    HeroInfoView: [2,"perfab/public/HeroInfoView",21],
    HeroAttributeChangeView: [2,"perfab/public/HeroAttributeChangeView",60],

    RankView:[2,"perfab/rank/RankView",9],
    SignView:[2,"perfab/sign/SignView",9],

    FriendView:[2,"perfab/friend/FriendView",9],
    ApplyListView:[2,"perfab/friend/ApplyListView",9],
    HireApplyView:[2,"perfab/friend/HireApplyView",9],
    HireMgrView:[2,"perfab/friend/HireMgrView",9],
    FriendAidHerosView:[2,"perfab/friend/FriendAidHerosView",9],

    UserInfoView:[2,"perfab/userSet/UserInfoView",9],
    NameChangeView:[2,"perfab/userSet/NameChangeView",9],
    SignChangeView:[2,"perfab/userSet/SignChangeView",9],
    UserInheritView:[2,"perfab/userSet/UserInheritView",9],
    UserHelpView:[2,"perfab/userSet/UserHelpView",9],
    UserCustomerView:[2,"perfab/userSet/UserCustomerView",9],
    UserFeedbackView:[2,"perfab/userSet/UserFeedbackView",9],
    FeedbackConfirmView:[2,"perfab/userSet/FeedbackConfirmView",9],
    UserFAQView:[2,"perfab/userSet/UserFAQView",9],
    DropDownBox:[2,"perfab/userSet/DropDownBox",9],
    CdkView:[2,"perfab/userSet/CdkView",9],
    SelectServerView:[2,"perfab/userSet/SelectServerView",12],
    RecommendServerView:[2,"perfab/userSet/RecommendServerView",12],
    AllServerView:[2,"perfab/userSet/AllServerView",12],
    UserTermsView:[2,"perfab/userSet/UserTermsView",12],
    UserTermsConfirm:[2,"perfab/userSet/UserTermsConfirm",12],

    UnionView:[2,"perfab/union/UnionView",2],
    UnionInfoView:[2,"perfab/union/UnionInfoView",2],
    
    UnionCreateView:[2,"perfab/union/UnionCreateView",9],
    UnionMgrView:[2,"perfab/union/UnionMgrView",9],
    UnionEmailView:[2,"perfab/union/UnionEmailView",9],
    UnionApplyView:[2,"perfab/union/UnionApplyView",9],
    UnionBossView:[2,"perfab/union/UnionBossView",12],
    UnionBossRankView:[2,"perfab/union/UnionBossRankView",12],

    UnionSportsView:[2,"perfab/union/UnionSportsView",9],
    SportsMissionView:[2,"perfab/union/SportsMissionView",12],
    SportsRankView:[2,"perfab/union/SportsRankView",12],
    SportsReviveView:[2,"perfab/union/SportsReviveView",12],
    IslandPreview:[2,"perfab/union/IslandPreview",12],
    SportsBagView:[2,"perfab/union/SportsBagView",12],
    MonsterTeamView:[2,"perfab/union/MonsterTeamView",12],
    SportsModelSelectView:[2,"perfab/union/SportsModelSelectView",12],
    SportsRewardAction:[2,"perfab/union/SportsRewardAction",12],
    NewChapterAction:[2,"perfab/union/NewChapterAction",12],

    DungeonView:[2,"perfab/dungeon/DungeonView",9],
    DungeonListView:[2,"perfab/dungeon/DungeonListView",12],
    DungeonActivityView:[2,"perfab/dungeon/DungeonActivityView",9],
    DungeonActivityListView:[2,"perfab/dungeon/DungeonActivityListView",9],
    DungeonMissionView:[2,"perfab/dungeon/DungeonMissionView",9],
    DungeonActivityBoxView:[2,"perfab/dungeon/DungeonActivityBoxView",9],
    //展示立绘页面
    HeroShowView: [2,"perfab/dungeon/HeroShowView",52],

    TowerEnterView:[2,"perfab/tower/TowerEnterView",2],
    TowerView:[2,"perfab/tower/TowerView",2],
    TowerInfoView:[2,"perfab/tower/TowerInfoView",9],
    TowerBoxView:[2,"perfab/tower/TowerBoxView",51],

    BossTrialView:[2,"perfab/bossTrial/BossTrialView",2],
    BossTrialTeamHelpView:[2,"perfab/bossTrial/BossTrialTeamHelpView",9],
    BossTrialHeroView:[2,"perfab/bossTrial/BossTrialHeroView",9],
    

    RelateActiveView:[2,"perfab/relate/RelateActiveView",9],

    PictureView:[2,"perfab/picture/PictureView",2],
    PictureBattleEventView:[2,"perfab/picture/PictureBattleEventView",9],
    PictureReviveView:[2,"perfab/picture/PictureReviveView",9],
    PictureChessView:[2,"perfab/picture/PictureChessView",9],
    PictureTavernView:[2,"perfab/picture/PictureTavernView",9],
    PictureHelpView:[2,"perfab/picture/PictureHelpView",9],
    ChessMakeView:[2,"perfab/picture/ChessMakeView",9],

    HeroTjView:[2,"perfab/heroTj/HeroTjView",2],
    HeroSkinView:[2,"perfab/heroTj/HeroSkinView",21],
    HeroTjSkillView:[2,"perfab/heroTj/HeroTjSkillView",21],
    HeroAccessView:[2,"perfab/heroTj/HeroAccessView",22],
    HeroBiographyView:[2,"perfab/heroTj/HeroBiographyView",24],
    

    VillaHeroView:[2,"perfab/villa/VillaHeroView",2],
    HeroFeelView:[2,"perfab/villa/HeroFeelView",2],
    FeelAddtionAllView:[2,"perfab/villa/FeelAddtionAllView",9],
    FeelAddtionView:[2,"perfab/villa/FeelAddtionView",9],
    VillaHeroActiveView:[2,"perfab/villa/VillaHeroActiveView",9],
    VillaRoomView:[2,"perfab/villa/VillaRoomView",2],
    FeelLvAddtionView:[2,"perfab/villa/FeelLvAddtionView",9],
    
    HeroFlyView:[2,"perfab/heroFly/HeroFlyView",2],
    HeroFlyUpInfoView:[2,"perfab/heroFly/HeroFlyUpInfoView",9],
    HeroFlyAutoView:[2,"perfab/heroFly/HeroFlyAutoView",9],

    EventListView:[2,"perfab/event/EventListView",2],
    EventSignView:[2,"perfab/event/EventSignView",2],
    EventTaskView:[2,"perfab/event/EventTaskView",2],
    LimitGiftView:[2,"perfab/event/LimitGiftView",51],

    TeamListView:[2,"perfab/page/TeamListView",18],
    TeamYokeView:[2,"perfab/page/TeamYokeView",21],
    HeroFlySelectView:[2,"perfab/page/HeroFlySelectView",18],
    ChapterView:[2,"perfab/page/ChapterView",12],
    
    CrystalView:[2,"perfab/crystal/CrystalView",2],
    CrystalMaxView:[2,"perfab/crystal/CrystalMaxView",15],
    CrystalLayView:[2,"perfab/crystal/CrystalLayView",15],
    HeroReLevel:[2,"perfab/crystal/HeroReLevel",18],
    HeroReLevelNew:[2,"perfab/crystal/HeroReLevelNew",18],

    StoryView:[2,"perfab/story/StoryView",9],
    StoryListView:[2,"perfab/story/StoryListView",9],
    StoryUnlockRequire:[2,"perfab/story/StoryUnlockRequire",9],
    StorySummary:[2,"perfab/story/StorySummary",9],
    StoryUnlock:[2,"perfab/story/StoryUnlock",9],
    StoryDownload:[2,"perfab/story/StoryDownload",9],
    StoryShow:[2,"perfab/story/StoryShow",9],
    StoryUpdateView:[2,"perfab/story/StoryUpdateView",9],

    WorldBossView:[2,"perfab/worldBoss/WorldBossView",2],
    WorldBossAwardView:[2,"perfab/worldBoss/WorldBossAwardView",9],
    

    AwardShowView: [2,"perfab/public/AwardShowView",51],

    MessageBox: [2,"perfab/public/MessageBox",90],
    TipsInfoView: [2,"perfab/public/TipsInfoView",51],
    AwardBox: [2,"perfab/public/AwardBox",51],
    ReceiveAward: [2,"perfab/public/ReceiveAward",51],

    HelpInfoBox: [2,"perfab/public/HelpInfoBox",63],
    ItemTipsView: [2,"perfab/public/ItemTipsView",63],

    // -------------- 新手教学 --------------//
    GuideView: [2,"perfab/guide/GuideView",87],

    // // -------------- 网络连接 --------------//
    MarqueeView: [3,"Canvas/MarqueeView",93],
    Tips: [3,"Canvas/Tips",93],
    attrItem: [3,"Canvas/attrItem",93],
    Loading: [3,"Canvas/Loading",93],
    NetMask:[3,"Canvas/NetMask",93],
    ChangeAccountView: [2,"perfab/public/ChangeAccountView",2],
    LookGoddessView:[2,"perfab/page/LookGoddessView",9],
    LookGoddessSelectView:[2,"perfab/page/LookGoddessSelectView",9],
    
    //输入年龄
    PlayerAgeView:[2,"perfab/playerAge/PlayerAgeView",51],
    AgeConfirmView:[2,"perfab/playerAge/AgeConfirmView",51],
    AgeAlertView:[2,"perfab/playerAge/AgeAlertView",51],

    //新版帐号切换
    AccountLoginView:[2,"perfab/account/AccountLoginView",23],
    AccountSwitchView:[2,"perfab/account/AccountSwitchView",23],

    AppraisalView: [2,"perfab/public/AppraisalView",2],

    //Bingo
    BingoView: [2,"perfab/bingo/BingoView",2],
    BingoRewardView: [2,"perfab/bingo/BingoRewardView",2],
    BingoBuyView: [2,"perfab/bingo/BingoBuyView",2],

    //mark
    LimitMarketView: [2,"perfab/market/LimitMarketView",2],
    LimitMarketBuyView: [2,"perfab/market/LimitMarketBuyView",2],

    //专属武器
    ExcWeaponMainView: [2,"perfab/excWeapon/ExcWeaponMainView",21],
    ExcWeaponReLevel:[2,"perfab/excWeapon/ExcWeaponReLevel",21],
    ExcWeaponYokeView:[2,"perfab/excWeapon/ExcWeaponYokeView",21],
    ExcWeaponUpgradeView:[2,"perfab/excWeapon/ExcWeaponUpgradeView",21],

    //水晶秘境
    OreMainView:[2,"perfab/ore/OreMainView",9],
    OreMainInfo:[2,"perfab/ore/OreMainInfo",9],
    OreBattleLogView:[2,"perfab/ore/OreBattleLogView",9],
    OreRankView:[2,"perfab/ore/OreRankView",9],
    OreRankRewardView:[2,"perfab/ore/OreRankRewardView",9],
    OreRoomListView:[2,"perfab/ore/OreRoomListView",9],
    OreUnionRoomList:[2,"perfab/ore/OreUnionRoomList",9],
    OreBuyView:[2,"perfab/ore/OreBuyView",9],
    OreBattleAlertView:[2,"perfab/ore/OreBattleAlertView",9],
    OreUnionAddView:[2,"perfab/ore/OreUnionAddView",9],

    ActivityListView:[2,"perfab/activityList/ActivityListView",2],


    //同盟争霸
    RoomSelectView:[2,"perfab/hegemony/RoomSelectView",3],
    HegemonyMainView:[2,"perfab/hegemony/HegemonyMainView",4],
    ArmySetView:[2,"perfab/hegemony/ArmySetView",6],
    CityInfoMainView:[2,"perfab/hegemony/CityInfoMainView",6],
    UnionScoreView:[2,"perfab/hegemony/UnionScoreView",5],
    UnionBattleStateView:[2,"perfab/hegemony/UnionBattleStateView",5],
    InspireView:[2,"perfab/hegemony/InspireView",5],
    MonsterInfoView:[2,"perfab/hegemony/MonsterInfoView",6],
    HegemonyRankView:[2,"perfab/hegemony/HegemonyRankView",5],
    ShowBattleArmyView:[2,"perfab/hegemony/ShowBattleArmyView",6],
    HegemonyRewardView:[2,"perfab/hegemony/HegemonyRewardView",5],
    RewardView:[2,"perfab/hegemony/RewardView",6],
    DayRewardView:[2,"perfab/hegemony/DayRewardView",6],
    InspireConfirm:[2,"perfab/hegemony/InspireConfirm",6],
    DeclearConfirm:[2,"perfab/hegemony/DeclearConfirm",6],

    AccumulativePayView:[2,"perfab/activity/AccumulativePayView",2],

    LotterySkinView:[2,"perfab/activity/LotterySkinView",2],

    AnniversaryRewardView:[2,"perfab/activity/AnniversaryRewardView",2],
}
var LOAD_PERFAB = {
    MainView:true,
}
var DOESNT_LIST = {
    NetMask:true,
    Loading:true,
    Tips:true,
    MarqueeView:true,
}
var SCENE_CHANGE = {
    UpdateView:true,
    BattleLoadView:true,
}
var TOP_NM = [
    "OfflineView",
    "SignView",
]
// UiManager
cc.Class({
    properties: {
        list:[],
        pop:[],
        sec:[],
    },
    ctor:function(){
        this.pre = {}
        this.list = {}
        this.atlas = {}
        this.pop = []
        this.sec = []
        this.bgm = []
        this.m_stack_List = []
        this.m_quque_list = {}
        this.m_fron_point = 0
        Gm.events.add(Events.PLAYBGM,this.onBGMIn.bind(this))
        Gm.events.add(Events.CLOSEBGM,this.onBGMOut.bind(this))
    },
    getPath:function(name){
        return LAYER_PATH[name]
    },
    setSecViewRoot:function(destView){
        this.m_oSecView = destView
    },
    setFont:function(font){
        this.m_oBaseFont = font
    },
    getFont:function(){
        return this.m_oBaseFont
    },
    setNewItem(newItem){
        Gm.load.retainFab(newItem)
        this.newItemPrefab = newItem
    },
    getNewItem(parent,isScale,width){
        var item = cc.instantiate(this.newItemPrefab)
        item.active = true
        if (parent){
            parent.addChild(item)
            if (isScale){
                item.scale = parent.width/item.width
            }
        }
        var sp = item.getComponent("NewItem")
        if (width){
            sp.newWidth = width
        }
        return sp
    },
    setProfilePictureItem(newItem){
        Gm.load.retainFab(newItem)
        this.newProfilePictureItemPrefab = newItem
    },
    getProfilePictureItem(parent,isScale){
        var item = cc.instantiate(this.newProfilePictureItemPrefab)
        item.active = true
        if (parent){
            parent.addChild(item)
            if (isScale){
                item.scale = parent.width/item.width
            }
        }
        var sp = item.getComponent("ProfilePictureItem")
        return sp
    },    
    getBaseItem(itemType){
        var item = cc.instantiate(this.baseItemList[itemType])
        var sp = item.getComponent(item.name)
        return sp
    },
    insertBaseItem(itemType,item){
        if (this.baseItemList == null){
            this.baseItemList = {}
        }
        Gm.load.retainFab(item)
        this.baseItemList[itemType] = item
    },
    setBasePopupUI(perfab){
        Gm.load.retainFab(perfab)
        this.basePopupUI = perfab
    },
    getBasePopupUI(){
        var baseUI = cc.instantiate(this.basePopupUI)
        return  baseUI.getComponent(baseUI.name)
    },
    setNewBasePopupUI(callback){
        // if (perfab){
        //     Gm.load.retainFab(perfab)
        //     this.newBasePopupUI = perfab
        // }else{
            cc.loader.loadRes("perfab/public/NewBasePopupUI",(err, prefab)=>{
                if (err == null){
                    // console.log("load prefab===="+prefab.name)
                    Gm.load.retainFab(prefab)
                    this.newBasePopupUI = prefab
                    callback()
                }
            })
        // }
    },
    getNewBasePopupUI(){
        var baseUI = cc.instantiate(this.newBasePopupUI)
        return  baseUI.getComponent("BasePopupUI")
    },
    // -----------------------------------------------
    loadLayer:function(callback){
        var self = this
        var tmpTotals = 0
        var tmpCounts = 0
        var tmpBack = function(){
            tmpCounts = tmpCounts + 1
            callback(tmpTotals,tmpCounts)
        }
        for(const i in LOAD_PERFAB){
            var tmpPath = i
            tmpTotals = tmpTotals + 1
            this.findLayer(tmpPath,function(newNode){
                tmpBack()
            },true)
        }
    },
    resetBGMAll:function(){
        this.bgm = []
        this.m_bBgmPause = true
    },
    onBGMIn:function(name){
        if (this.m_bBgmPause){
            return
        }
        var idx = LAYER_PATH[name][2]
        // console.log("onBGMIn==:",name,idx,this.bgm[idx])
        if (!this.bgm[idx]){
            this.bgm[idx] = []
        }
        for(const i in this.bgm[idx]){
            if (this.bgm[idx][i] == name){
                this.bgm[idx].splice(i,1)
                break
            }
        }
        this.bgm[idx].unshift(name)
        var bgm = this.getScript(name).m_oBGMFile
        for(const i in this.bgm){
            if (i > idx){
                bgm = this.getScript(this.bgm[i][0]).m_oBGMFile
            }
        }
        // console.log("bgm===:",bgm)
        Gm.audio.playBGM(bgm)
    },
    onBGMOut:function(name){
        if (this.m_bBgmPause){
            return
        }
        var idx = LAYER_PATH[name][2]
        // console.log("onBGMOut==:",name,idx,this.bgm[idx])
        if (this.bgm[idx]){
            for(var i = 0;i < this.bgm[idx].length;i++){
                if (this.bgm[idx][i] == name){
                    this.bgm[idx].splice(i,1)
                    break
                }
            }
            if (this.bgm[idx].length == 0){
                this.bgm.splice(idx,1)
            }
        }
        var bgm = null
        for(const i in this.bgm){
            let spt = this.getScript(this.bgm[i][0])
            if (spt && spt.m_oBGMFile){
                bgm = this.getScript(this.bgm[i][0]).m_oBGMFile
            }
        }
        // console.log("bgm===:",bgm)
        if (bgm){
            Gm.audio.playBGM(bgm)
        }
    },
    // -----------------------------------------------
    jump:function(viewId){
        console.log("viewId===:",viewId)
        if (!Func.isUnlock(viewId,true)){
            return false
        }
        var config = Gm.config.getViewById(viewId)
        if (config && config.clientDes){
            var tmpMain = this.getScript("MainView")
            var tmpMainIdx = tmpMain.cheackPage(config.clientDes)
            if (tmpMainIdx == null){
                // if (viewId >= 90000 &&  viewId <= 90100){
                //     Gm.shopNet.openSelect = config.interfaceParameter
                //     Gm.shopNet.getInfo(true)
                // }else{
                    if (viewId == 90004 && !Gm.unionData.isUnion()){
                        Gm.floating(Ls.get(2006))
                        return
                    }
                    if (viewId == 400001){//爬塔
                        TowerFunc.openTower()
                        return true
                    }
                    if (viewId == 40001){//公会boss
                        Gm.unionNet.bossInfo(true)
                        return true
                    }
                    if(viewId == 40002){//工会
                        Gm.getLogic("UnionLogic").openUnionSportsView()
                        return true
                    }
                    if(viewId == 40005){
                        Gm.getLogic("UnionLogic").openSportsModelSelectView()
                        return true
                    }
                    if(viewId == 1100001){
                        Gm.getLogic("OreLogic").oreBtnClick()
                        return true
                    }
                    var jumpIn = function(node){
                        if (config.interfaceParameter){
                            node.getComponent(config.clientDes).jumpIn(config.interfaceParameter)
                        }
                    }
                    if(config.clientDes == "LotteryMain"){
                        if(config.interfaceParameter == 2){
                             if(Gm.lotteryData.activeIsOpen()){
                                 
                             }
                             else{
                                 Gm.floating(Ls.get(5445))
                                 return false
                             }
                        }
                         var main = Gm.ui.getScript("MainView")
                         main.showLottery(null,0)
                        Gm.ui.create("LotteryMain",{page:config.interfaceParameter})
                        return true
                    }
                    var layer = Gm.ui.getLayer(config.clientDes)
                    if(layer && layer.active){
                        jumpIn(layer)
                    }else{
                        var jumpData = true
                        if (viewId == 1007){
                            if (Gm.userData.getTime_m() > Func.newConfigTime(Gm.config.getConst("picture_puzzle_end_time_all")) ){
                                Gm.floating(Ls.get(5223))
                                return
                            }
                            jumpData = {treasure:false}
                        }else if (viewId == 1008){
                            jumpData = {treasure:true}
                        }
                        this.create(config.clientDes,jumpData,function(node){
                            jumpIn(node)
                        },config.interfaceParameter)
                    }
                // }
            }else{
                tmpMain.jumpIn(tmpMainIdx,config.interfaceParameter)
            }
        }else{
            Gm.floating(Ls.get(200004))
        }
        return true
    },
    removeAllTopView(){
        for (const key in this.list) {
            if(key == "ChatPageView" || key == "GuideView" || key == "MainView" || key == "MarqueeView"){
                continue;
            }
            this.removeByName(key)
        }
    },
    getViewData:function(){
        var list = []
        for (const key in this.list){
            if (this.list[key]){
                var spt = this.list[key].getComponent(key)
                if (spt.getSceneData){
                    list.push({name:key,data:spt.getSceneData()})
                }
            }
        }
        return list
    },
    removeAllView:function(){
        var newList = {}
        for (const key in this.list) {
            if (key == "GuideView"){
                newList[key] = this.list[key]
                this.getScript("GuideView").resetAll()
            }else{
                if (DOESNT_LIST[key]){
                    newList[key] = this.list[key]
                }else{
                    this.removeByName(key)
                }
            }
            // var v = this.list[key];
            // v.active = false
        }
        this.list = newList
    },
    removeByName:function(viewName){
        viewName = this.getLoginName(viewName)
        if (this.list[viewName]){
            console.log("移除显示===:"+viewName)
            var tmpPath = LAYER_PATH[viewName]
            if (tmpPath[0] == 1){
                this.list[viewName].active = false
            }else{
                this.list[viewName].removeFromParent(true)
                this.list[viewName].destroy()
                this.list[viewName] = null
                LAYER_PATH[viewName][3] = false
                if (!LOAD_PERFAB[viewName]){
                    Gm.load.releaseFab(this.pre[viewName])
                }
                this.pre[viewName] = null
                Gm.send(Events.TOPCLOSE_VIEW,viewName)
            }
            Gm.load.cleanOwner()
        }
    },
    create:function(name,destData,destFunc,pageNum){
        if (!Func.isUnlock(name,true)){
            return
        }
        name = this.getLoginName(name)
        if (SCENE_CHANGE[name]){
            Gm.scene.changeScene(name,destData,destFunc,pageNum)
        }else{
            this.create1(name,destData,destFunc,pageNum)
        }
    },
    create1:function(name,destData,destFunc,pageNum){
        if (this.isExist(name)){
            var tmpNode = this.getLayer(name)
            // cc.log("出来吧===:"+name+" "+tmpNode)
            //已经显示,模拟创建显示
            var viewSp = tmpNode.getComponent(name)
            if (viewSp){
                if (pageNum  != null){
                    viewSp.jumpIn(pageNum)
                }
                // viewSp.enableUpdateView(destData)
            }
            tmpNode.active = true
            if (destFunc != null){
                destFunc(tmpNode)
            }
        }else{
            var tmpPath = LAYER_PATH[name]
            if (tmpPath && !LAYER_PATH[name][3]){
                var self = this
                LAYER_PATH[name][3] = true
                Gm.loading(null,true)
                this.findLayer(name,function(newNode){
                    var tmpCanDo = true
                    var tmpLen = self.pop.length
                    if (tmpLen > 0){
                        for(const i in self.pop){
                            if (self.pop[i].nm == newNode.name && i != 0){
                                LAYER_PATH[newNode.name][3] = false
                                tmpCanDo = false
                                break
                            }
                        }
                    }
                    // cc.log("name===:"+name)
                    if (tmpCanDo){
                        var viewSp = newNode.getComponent(newNode.name)
                        if (viewSp){
                            viewSp.setOpenData(destData)
                            if (pageNum  != null){
                                viewSp.jumpIn(pageNum)
                            }
                        }
                        newNode.active = true
                        newNode.zIndex = tmpPath[2]
                        self.addView(newNode.name,newNode)
                        if (tmpPath[0] != 1){
                            if (viewSp && viewSp.m_bIsSec){
                                if (self.m_oSecView){
                                    newNode.parent = self.m_oSecView
                                }else{
                                    newNode.parent = self.base
                                }
                            }else{
                                newNode.parent = self.base
                            }
                        }
                        if (destFunc != null){
                            destFunc(newNode)
                        }
                    }
                    Gm.removeLoading()
                },true)
            }
        }
    },
    getLoginName(name){
        if (name == "LoginView"){
            if (Bridge.isReview()){
                name = "PlateNumberLoginView"
            }
        }
        return name
    },
    addView:function(name,view){
        this.list[name] = view
        Gm.send(Events.TOPOPEN_VIEW,name)
    },
    isExist:function(name){
        return (this.list[name] != null)
    },
    getLayer:function(name){
        name = this.getLoginName(name)
        return this.list[name]
    },
    getScript:function(name){
        if (this.list[name]){
            return this.list[name].getComponent(name)
        }else{
            if (this.list["MainView"]){
                return this.list["MainView"].getComponent("MainView").getScript(name)
            }
        }
    },
    getLayerActive:function(name){
        var layer = this.getLayer(name)
        if(layer){
            return layer.active
        }
        return false
    },
    insertPrefab:function(name,prefab){
        this.pre[name] = prefab
    },
    releaseFab:function(name){
        if (this.pre && this.pre[name]){
            Gm.load.releaseFab(this.pre[name])
            this.pre[name] = null
        }
    },
    getPrefab:function(name){
        if (this.pre[name]){
            var tmpPath = LAYER_PATH[name]
            if (tmpPath[0] == 1){
                return this.pre[name]
            }else{
                return cc.instantiate(this.pre[name])
            }
        }
    },
    findLayer:function(name,func,save){
        if (this.isExist(name)){
            func(this.getPrefab(name))
        }else{
            var tmpPrefab = this.getPrefab(name)
            if (tmpPrefab){
                console.log("复制已拥有===:"+name)
                func(tmpPrefab)
            }else{
                console.log("读取未拥有===:"+name)
                var tmpPath = LAYER_PATH[name]
                switch(tmpPath[0]){
                    case 1:
                        this.insertPrefab(name,cc.find(tmpPath[1]))
                        func(this.getPrefab(name))
                    break
                    case 2:
                        cc.loader.loadRes(tmpPath[1],(err, prefab)=>{
                            if (err == null){
                                // console.log("load prefab===="+prefab.name)
                                Gm.load.retainFab(prefab)
                                this.insertPrefab(name,prefab)
                                func(this.getPrefab(name))
                            }else{
                                console.log("load error====="+name,err)
                            }
                        })
                    break
                    case 3:
                        this.insertPrefab(name,Gm.scene.getView(name))
                        func(this.getPrefab(name))
                    break
                }
            }
        }
    },
    // 二级界面-----根据加入队列先后依次显示-----began
    getMain(){
        if (this.getLayerActive("MainView")){
            return this.list["MainView"].getComponent("MainView")
        }
    },
    hideUnder:function(){
        if (this.getLayerActive("MainView")){
            this.list["MainView"].getComponent("MainView").hideUnder()
        }
    },
    showUnder:function(){
        if (this.getLayerActive("MainView")){
            this.list["MainView"].getComponent("MainView").showUnder()
        }
    },
    hideNowPage:function(){
        if (this.getLayerActive("MainView")){
            this.list["MainView"].getComponent("MainView").hideNowPage()
        }
    },
    showNowPage:function(){
        if (this.getLayerActive("MainView")){
            this.list["MainView"].getComponent("MainView").showNowPage()
        }
    },
    insertSec:function(viewName){
        this.sec.push({nm:viewName})
        if (this.sec.length > 0){
            this.hideNowPage()
        }
        // for(const i in this.sec){
        //     console.log("this.sec[i].nm==:",this.sec[i].nm)
        // }
    },
    removeSec:function(viewName){
        for(const i in this.sec){
            if (this.sec[i].nm == viewName && this.getLayerActive(viewName)){
                this.removeByName(viewName)
                this.sec.splice(i,1)
                break
            }
        }
        if (this.sec.length == 0){
            this.showNowPage()
        }
    },
    removeSecAll:function(){
        for(const i in this.sec){
            // console.log("this.sec[i].nm==:",this.sec[i].nm)
            this.removeByName(this.sec[i].nm)
        }
        this.sec = []
    },
    removeTopAll:function(){
        for(const i in TOP_NM){
            this.removeByName(TOP_NM[i])
        }
    },
    // 二级界面-----end-----//

    // 排序界面-----根据加入队列先后依次显示-----began
    insertPop:function(viewName,viewData,isFirst){
        if (isFirst){
            this.pop.unshift({nm:viewName,dt:viewData})
            for(var i = 0;i < this.pop.length;i++){
                if (this.getLayer(this.pop[i].nm)){
                    this.removeByName(this.pop[i].nm)
                }
            }
            this.create(this.pop[0].nm,this.pop[0].dt)
            // Gm.send(Events.POPUP_VIEW,{viewName:this.pop[0].nm,data:this.pop[0].dt})
        }else{
            this.pop.push({nm:viewName,dt:viewData})
            this.cheackPop()
        }
    },
    cheackPop:function(){
        var tmpLen = this.pop.length
        if (tmpLen > 0 && !this.getLayer(this.pop[0].nm)){
            this.create(this.pop[0].nm,this.pop[0].dt)
            // Gm.send(Events.POPUP_VIEW,{viewName:this.pop[0].nm,data:this.pop[0].dt})
        }
    },
    deletePop:function(viewName){
        for(var i = 0;i < this.pop.length;i++){
            if (this.pop[i].nm == viewName && this.getLayer(viewName)){
                this.pop.shift()
                break
            }
        }
        this.cheackPop()
    },
    // 排序界面-----end-----//

    // 资源相关-----began-----//
    setSpriteAtlas:function(spriteAtlas,atlasName){
        // console.log("setSpriteAtlas====:"+atlasName+" "+spriteAtlas)
        this.atlas[atlasName] = spriteAtlas
    },
    getFrameByName:function(spriteName,atlasName){
        // console.log("获得资源===:"+atlasName+" "+this.atlas[atlasName]+" "+spriteName)
        if (this.atlas[atlasName]){
            return this.atlas[atlasName].getSpriteFrame(spriteName)
        }
    },
    getItem:function(spriteName,callback){
        callback(this.getFrameByName(spriteName,"icon"))
    },
    getHero:function(spriteName,callback){
        callback(this.getFrameByName(spriteName,"hero"))
    },
    getItemFrame:function(name,callback){
        Gm.load.loadSpriteFrame("img/heroFrame/" +(name),callback)
    },
    getConstIcon:function(id,fb,icon){
        var path
        // if (id == ConstPb.playerAttr.GOLD){
        //     path = "img/shouye/ico_zuanshi"
        // }else if (id == ConstPb.playerAttr.SILVER){
        //     path = "img/shouye/ico_jinbi"
        // }else{
            var conf = Gm.config.getItem(id)
            if (conf){
                path = "img/items/" +conf.icon
            }
        // }
        if (path){
            Gm.load.loadSpriteFrame(path,fb,icon)
        }
    },
    // 资源相关-----end-----//
    simpleScroll:function(scroll,data,func,total){
        scroll.node.off("scrolling")
        scroll.unscheduleAllCallbacks()
        var lens = data.length
        var idx = 1
        var layout = scroll.content.getComponent(cc.Layout)
        var tWid = scroll.node.width - layout.paddingLeft - layout.paddingRight
        var tHei = scroll.node.height - layout.paddingTop - layout.paddingBottom
        var size = 0
        var wid = 0
        var hei = 0
        var pageNums = 0
        var getOne = function(index){
            if (data[index]){
                var item = func(data[index],index+1)
                if (wid == 0 || hei == 0){
                    wid = item.width + layout.spacingX
                    hei = item.height + layout.spacingY
                    if (layout.type == cc.Layout.Type.GRID){
                        pageNums = Math.ceil(tWid/wid) * Math.ceil(tHei/hei)
                    }else if(layout.type == cc.Layout.Type.HORIZONTAL){
                        pageNums = Math.ceil(tWid/wid)
                    }else if(layout.type == cc.Layout.Type.VERTICAL){
                        pageNums = Math.ceil(tHei/hei)
                    }
                }
            }
        }
        var insertOnce = function(){
            if (idx < lens){
                scroll.content.showIndex = idx
                var count = idx
                idx = idx + pageNums
                var sizeIdx = idx - 1
                if (idx > lens){
                    idx = lens
                    sizeIdx = lens
                }
                if (layout.type == cc.Layout.Type.GRID){
                    var num = Math.ceil(tWid/wid)
                    size = Math.floor(sizeIdx/num) * hei
                }else if(layout.type == cc.Layout.Type.HORIZONTAL){
                    size = sizeIdx * wid
                }else if(layout.type == cc.Layout.Type.VERTICAL){
                    size = sizeIdx * hei
                }
                for(var i = 0;i < pageNums;i++){
                    scroll.scheduleOnce(()=>{
                        getOne(count)
                        count++;
                    },i/50)
                }
            }
        }
        var onScrolling = function(sender){
            if (sender && sender.node.active){
                var tmpCan = false
                if (sender.horizontal && size - sender.content.x <= tWid/2){ // 横向
                    tmpCan = true
                }else if(sender.vertical && size - sender.content.y <= tHei/2){ // 纵向
                    tmpCan = true
                }
                if (tmpCan && idx < lens){
                    insertOnce()
                }
            }
        }
        getOne(0)
        if (total){
            pageNums = total
        }
        insertOnce()
        scroll.node.on("scrolling",onScrolling)
    },
    scrollOffset(scroll,index=0,cellNum=1,time=0){
        scroll.scheduleOnce(()=>{
            var cellHeight = scroll.content.height/Math.ceil(scroll.content.children.length/cellNum)
            var cell = Math.floor(index/cellNum)
            var nowPos = scroll.getContentPosition()
            nowPos.y = cell*cellHeight
            scroll.scrollToOffset(nowPos,time)
        },0.01)
    },
    setBtnInteractable(node,is,spr){
        var btn = node.parent.getComponent(cc.Button)
        btn.interactable = is

        var sprPath = spr || "newdialog/rw_btn_g"
        if (is){
            sprPath = spr || "newdialog/rw_btn_b"
        }

        var self = this
        Gm.load.loadSpriteFrame("texture/"+sprPath,function(sp,owner){
            owner.spriteFrame = sp
        },node.getComponent(cc.Sprite))
    },
    isCanGray(node){
        var sp = node.getComponent(cc.Sprite)
        return sp
    },
    setGray(node){
        node.color = cc.color(100,100,100)
        // if (this.isCanGray(node)){
        //     this.isCanGray(node).setState(cc.Sprite.State.GRAY)
        // }
        // if (node.children.length > 0){
        //     for (let index = 0; index < node.children.length; index++) {
        //         const v = node.children[index];
        //         this.setGray(v)
        //     }
        // }
    },
    removeGray(node){
        node.color = cc.color(255,255,255)
        // if (this.isCanGray(node)){
        //     this.isCanGray(node).setState(cc.Sprite.State.NORMAL)
        // }
        // if (node.children.length > 0){
        //     for (let index = 0; index < node.children.length; index++) {
        //         const v = node.children[index];
        //         this.removeGray(v)
        //     }
        // }
    },

    queuePush(layerName){
        this.m_stack_List.push(layerName)

        if(!this.m_quque_list[layerName]){
            this.m_quque_list[layerName] = true
        }
     
        if(this.m_stack_List.length == 1){
            let layerName = this.getQueueLayer()
            if(layerName != "noName"){
                this.create(layerName)
            }
        }
    },

    clearQueue(){
        this.m_stack_List = []
        this.m_quque_list = {}
        this.m_fron_point = 0
    },

    queuePop(name){
        if(this.isEnterQueue(name)){
            let layerName = this.getQueueLayer()
            if(layerName != "noName"){
                this.create(layerName)
            }
        }
   
    },

    getQueueLayer(){
        var layerName = "noName"
        if(this.m_fron_point < this.m_stack_List.length){
            layerName = this.m_stack_List[this.m_fron_point++]
        }else{
            this.clearQueue()
        }
        return layerName
    },

    isEnterQueue(name){
        return this.m_quque_list[name] || false
    }
});
