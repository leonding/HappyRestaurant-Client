// ArenaGiftCell
cc.Class({
    extends: cc.Component,

    properties: {

        m_oGiftNode:cc.Node,
        m_oNameLab:cc.Label,
        m_oCoinLab:cc.Label,
        m_oCoinSpr:cc.Node,
    },
    setOwner:function(destOwner,data){
        this.m_oData = data
        this.m_oOwner = destOwner
        Func.destroyChildren(this.m_oGiftNode)

        var itemBase = Gm.ui.getNewItem(this.m_oGiftNode)
        var conf = itemBase.updateItem({baseId:data.itemId})

        this.m_oNameLab.string = conf.name
        this.m_oCoinLab.string = data.price
        this.m_oCoinLab.node.on("size-changed", function(){
            var tmpW = this.m_oCoinLab.node.width + this.m_oCoinSpr.width
            this.m_oCoinSpr.x = this.m_oCoinSpr.width/2 - tmpW/2
            this.m_oCoinLab.node.x = tmpW/2 - this.m_oCoinLab.node.width
        }, this)
    },
    onCellClick:function(){
        var tmpMax = Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.ARENA_COIN)/this.m_oData.price
        var self = this
        Gm.ui.create("ArenaBuyFight",{
            maxNum:tmpMax,
            dealFunc:function(destNums){
                if (Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.ARENA_COIN) < destNums * self.m_oData.price){
                    Gm.floating(Ls.get(2013))
                }else{
                    Gm.arenaNet.sendArenaExchange(self.m_oData.itemId,destNums)
                }
            },
            numFunc:function(destNums){
                var tmpNums = destNums * self.m_oData.price
                return [999,tmpNums]
            },
        })
    },
});

