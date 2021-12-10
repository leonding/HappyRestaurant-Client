var BaseView = require("BaseView")
const NEED_TB = [["player","crystal"],["fight"]]
const ID_TB = {
    player:1751,
    crystal:1752,
    fight:1753,
}
// AccountLevelUP
cc.Class({
    extends: BaseView,
    properties: {
        infoList: {
            default: [],
            type: cc.Node,
        },
        awardArea:cc.Node,
        itemNodes:cc.Node,
    },
    onLoad:function(){
        this._super()
        Gm.send(Events.GUIDE_PAUSE)
    },
    enableUpdateView(args){
        if (args){
            var hasGift = false
            for(var i in this.infoList){
                var node = this.infoList[i]
                var value = null
                for(var j in NEED_TB[i]){
                    if (args[NEED_TB[i][j]]){
                        value = NEED_TB[i][j]
                        break
                    }
                }
                if (value){
                    node.active = true
                    var title = node.getChildByName("title")
                    title.getComponent(cc.Label).string = Ls.get(ID_TB[value])
                    var _new = node.getChildByName("lay").getChildByName("new")
                    _new.getComponent(cc.Label).string = args[NEED_TB[i][j]][1]
                    var _old = node.getChildByName("lay").getChildByName("old")
                    _old.getComponent(cc.Label).string = args[NEED_TB[i][j]][0]
                    if (1751 == ID_TB[value]){
                        hasGift = true
                    }
                }else{
                    node.active = false
                }
            }
            if (hasGift){
                this.awardArea.active = true
                var show = []
                for(var i = args.player[0] + 1;i <= args.player[1];i++){
                    var list = Gm.config.getPlayerLevel(i).award
                    for(var j in list){
                        var tmpHas = -1
                        for(var o in show){
                            if (show[o].id == list[j].id && show[o].type == list[j].type){
                                tmpHas = o
                                break
                            }
                        }
                        if (tmpHas == -1){
                            show.push(list[j])
                        }else{
                            show[tmpHas].num+=list[j].num
                        }
                    }
                }
                for (let index = 0; index < show.length; index++) {
                    const v = show[index];
                    var itemSp = Gm.ui.getNewItem(this.itemNodes)
                    itemSp.node.scale = 0.85
                    itemSp.setData(v)
                }
            }else{
                this.awardArea.active = false
            }
            Gm.audio.playEffect("music/31_player_lvup")
        }
    },
    onDestroy(){
        Gm.userInfo.m_iDestLv = 0
        Gm.send(Events.GUIDE_RESUME)
        this._super()
    },
    onBack(){
        Gm.activityData.showLimitGift()
        this._super()
    }
});

