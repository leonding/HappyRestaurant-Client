var BaseView = require("BaseView")
const box_frame = [0,0,1,2,2]
cc.Class({
    extends: BaseView,
    properties: {
        DungeonActivityBoxItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        starLab:cc.Label,
        descLab:cc.Label,
        cellFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
        m_oBoxPre:cc.Prefab,
    },
    onLoad () {
        this.popupUIData = {title:7000004}
        this._super()
    },
    onBack(){
        this._super()
    },
    onEnable(){
        this._super()
    },
    register:function(){
        this.events[MSGCode.OP_DUNGEON_STAR_REWARD_S] = this.onStarReward.bind(this)
    },
    onStarReward:function(args){
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            v.updateBtn()
        }
    },
    enableUpdateView(args){
        if (args){
            this.dungeonConf = args
            this.updateList()
        }
    },
    updateList(){
        this.allSatr = Gm.dungeonData.getDungeonAllStar(this.dungeonConf.id)
        var awardConf = Gm.config.getDungeonStarRewardConfig(this.dungeonConf.id)
        this.starLab.string = this.allSatr + "/" + awardConf[awardConf.length-1].star

        Func.destroyChildren(this.scrollView.content)
        this.items = []
        for (let index = 0; index < awardConf.length; index++) {
            const itemData = awardConf[index];
            var item = cc.instantiate(this.DungeonActivityBoxItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("DungeonActivityBoxItem")
            itemData.name = this.dungeonConf.name
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
        }
    },
    getCellFrame(type){
        return this.cellFrame[type]
    }
});

