//BossTrialView
cc.Class({
    extends: require("BaseView"),

    properties: {
        BossTrialItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        timeLab:cc.Label,
        boxSpriteFrames:{
            default: [],
            type: cc.SpriteFrame,
        },
        btnSpriteFrames:{
            default: [],
            type: cc.SpriteFrame,
        },
    },
    onLoad(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            if (Gm.bossTrialData.currentMapId.length == 0){
                Gm.bossTrialNet.showZhenFa()
                Gm.bossTrialNet.enterZhenFa()
                return
            }
            Gm.bossTrialNet.enterZhenFa()
            this.updateView()
        }
    },
    onDestroy(){
        this._super()
        Gm.bossTrialData.clearHero()
    },
    register:function(){
        this.events[MSGCode.OP_BATTLE_ZHENFA_BOSS_S] = this.onNetBattle.bind(this)
        this.events[MSGCode.OP_SHOW_ZHENFA_BOSS_S] = this.updateView.bind(this)
    },
    onNetBattle(args){
        if (args.battleInfo.fightResult == 1){
            for (var i = 0; i < this.itemList.length; i++) {
                this.itemList[i].updateState()
            }
        }
    },
    updateTime(){
        var time = Func.translateTime(Gm.bossTrialData.closeTime,true)
        if (time == 0){
            this.timeLab.string = Ls.get(5313)
        }else{
            this.timeLab.string = Ls.get(2310) +AtyFunc.timeToDayAndH(time)
        }
    },
    updateView:function(){
        this.unscheduleAllCallbacks()

        this.addUpdateTime()

        var list = Gm.bossTrialData.currentMapId

        this.itemList = []
        for (let index = list.length-1; index >= 0; index--) {
            var item = cc.instantiate(this.BossTrialItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("BossTrialItem")
            itemSp.setData(list[index],index,this)
            this.itemList.push(itemSp)
        }
        this.scrollView.scrollToTop()
    },
    onHeroHelpClick(){
        Gm.ui.create("BossTrialHeroView")
         // Gm.ui.jump(3002)
    },
    getBoxSf(index){
        return this.boxSpriteFrames[index]
    },
    getBtnSf(index){
        return this.btnSpriteFrames[index]
    },
    getSceneData:function(){
        return true
    },
});

