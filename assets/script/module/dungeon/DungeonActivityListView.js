var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
        DungeonActivityListItem: cc.Node,
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        boxBtnNode:cc.Node,
        resetBtnNode:cc.Node,
        cellBgFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        cellMaskFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        cellStarFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
    },
    onLoad () {
        this._super()
    },
    onBack(){
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.dungeonConf = Gm.config.getDungeon(args.id)
            this.titleLab.string = this.dungeonConf.name
            this.updateList()
            Gm.red.add(this.boxBtnNode,"dungeonActivity",args.id,"star")
            Gm.red.add(this.resetBtnNode,"dungeonActivity",args.id,"reset")
            
            var redStr = Gm.dungeonData.getLocalStorageKey(args.id)
            cc.sys.localStorage.setItem(redStr,1)
            Gm.red.refreshEventState("dungeonActivity")
        }
    },
    register:function(){
        this.events[MSGCode.OP_DUNGEON_BATTLE_S] = this.onBattle.bind(this)
        this.events[MSGCode.OP_DUNGEON_SHENJI_RESET_S] = this.onBattle.bind(this)
    },
    onBattle:function(args){
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            v.updateStar(index == this.items.length -1)
        }
    },
    updateList:function(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getDungeonGroups(this.dungeonConf.id)
        this.items = []
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.DungeonActivityListItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("DungeonActivityListItem")
            itemData.name = this.dungeonConf.name
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
        }
    },
    onBoxClick(){
        Gm.ui.create("DungeonActivityBoxView",this.dungeonConf)
    },
    onResetClick(){
        var allSatr = Gm.dungeonData.getDungeonAllStar(this.dungeonConf.id)
        var awardConf = Gm.config.getDungeonStarRewardConfig(this.dungeonConf.id)
        for (var i = 0; i < awardConf.length; i++) {
            var v = awardConf[i]
            if (allSatr >= v.star){
                if (!Gm.dungeonData.getHasStar(this.dungeonConf.id,v.star)){
                    Gm.floating(7000008)
                    return
                }
            }
        }

        var dd = Gm.dungeonData.getData(this.dungeonConf.id)
        cc.log(dd)
        if (dd.freeReset == 0){
            var num = Gm.config.getConst(Gm.userInfo.vipLevel==0?"activity_count":"activity_max_num")
            cc.log(dd,num)
            if (dd.surplusReset < num){
                Gm.box({msg:cc.js.formatStr(Ls.get(7000001),Gm.config.buy(dd.surplusReset+1).buyActivityCost,num-dd.surplusReset)},(btnType)=>{
                    if(btnType == 1){
                        Gm.dungeonNet.reset(this.dungeonConf.id)
                    }
                })
            }else{
                Gm.floating(Ls.get(7000002 ))
            }
            return
        }else{
            Gm.box({msg:Ls.get(7000005)},(btnType)=>{
                if(btnType == 1){
                    Gm.dungeonNet.reset(this.dungeonConf.id)
                }
            })
        }
        
    },
   
});

