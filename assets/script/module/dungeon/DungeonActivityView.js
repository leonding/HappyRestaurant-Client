var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        listItems:{
            default: [],
            type: require("DungeonActivityItem"),
        },
        taskBtnNode:cc.Node,
    },
    onLoad(){
        this._super()
        for (var i = 0; i < this.listItems.length; i++) {
            var v = this.listItems[i]
            v.node.active = false
        }
        Gm.red.add(this.taskBtnNode,"dungeonActivity","task","all")

        cc.sys.localStorage.setItem(DungeonFunc.getDungeonActivityRedStr(),1)
        Gm.red.refreshEventState("dungeonActivity")
    },
    enableUpdateView(args){
        if (args){
            if (Gm.dungeonData.isHasInfo()){
                this.updateList()
            }else{
                Gm.dungeonNet.info(Gm.dungeonData.getOpenIds())
            }
        }
    },
    register:function(){
        this.events[MSGCode.OP_DUNGEON_BATTLE_S] = this.onNetBattle.bind(this)
        this.events[MSGCode.OP_DUNGEON_INFO_S] = this.updateList.bind(this)
        this.events[MSGCode.OP_DUNGEON_BUY_FIGHT_S] = this.onNetBattle.bind(this)
    },
    onNetBattle(){
        if (this.items){
            for (let index = 0; index < this.items.length; index++) {
                const v = this.items[index];
                v.updateStar()
            }
        }
    },
    updateList:function(){
        var confList = Gm.config.getOpenDungeons(ConstPb.EventOpenType.EVENTOP_FUBEN)
        confList.sort(function(a,b){
            return a.id - b.id
        })
        for (var i = 0; i < this.listItems.length; i++) {
            var v = this.listItems[i]
            v.setData(confList[i])
            v.node.active = true
        }
    },
    onShopClick(){
        Gm.ui.jump(90101)
        // this.onBack()
    },
    onTaskClick(){
        Gm.ui.create("DungeonMissionView")
    },
    getSceneData:function(){
        return true
    },
});

