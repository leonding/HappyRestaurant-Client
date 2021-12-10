var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        DungeonItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
    },
    onLoad(){
        this._super()
    },
    onBack(){
        this._super()
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
    updateList:function(confList){
        Func.destroyChildren(this.scrollView.content)
        var confList = Gm.config.getOpenDungeons(DungeonFunc.Type.DEFAULT)
        this.items = []
        for (let index = 0; index < confList.length; index++) {
            const itemData = confList[index];
            var item = cc.instantiate(this.DungeonItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("DungeonItem")
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
        }
    },
    onTopListBtn:function(sender,value){
        value = checkint(value)
        this.select(value)
    },
    getSceneData:function(){
        return true
    },
   
});

