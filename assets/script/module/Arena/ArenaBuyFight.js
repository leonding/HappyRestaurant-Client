var BaseView = require("BaseView")
const NIMABI = {
    999:2065,
    1001:2066,
    1002:2067,
    1008:2068,
    1010:2069,
    200104:2070,
    998:2071
}
// ArenaBuyFight
cc.Class({
    extends: BaseView,
    properties: {
        numLab:cc.Label,
        needSpr:cc.Sprite,
        needLab:cc.Label,
        itemNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:5209}
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            this.currData = args
            this.maxNum = Math.floor(this.currData.maxNum || 0)
            this.currNum = 1
            if (this.maxNum == 0){
                this.currNum = 0
            }
            if (args.item){
                this.m_oItem = Gm.ui.getNewItem(this.itemNode)
                this.m_oItem.setData({type:ConstPb.itemType.TOOL,baseId:args.item})
                if (args.needType && args.needId){
                    var item = Func.itemConfig({type:args.needType,id:args.needId})
                    Gm.load.loadSpriteFrame("img/items/" +item.con.icon,function(sp,icon){
                        icon.spriteFrame = sp
                    },this.needSpr)
                }
            }
            this.updateNum()
        }
    },
    updateNum:function(destValue){
        if (destValue){
            this.currNum = this.currNum + destValue
            if (this.currNum < 0){
                this.currNum = 0
            }
            if (this.currNum > this.maxNum && this.maxNum != -1){
                this.currNum = this.maxNum
            }
        }
        this.numLab.string = this.currNum
        var c1 = "#BABABA"
        var c2 = "#FF2F13"
        this.m_tNeedNums = this.currData.numFunc(this.currNum)
        if (this.m_tNeedNums){
            // var tmpHas = this.cheack()
            // if (tmpHas){
            //     var c2 = "#00B400"
            // }
            this.needLab.string = "x"+this.m_tNeedNums[1]
        }
    },
    
    onAdd:function(){
        this.updateNum(1)
    },
    onRight:function(){
        this.updateNum(10)
    },
    onJian:function(){
        this.updateNum(-1)
    },
    onLeft:function(){
        this.updateNum(-10)
    },
    onCancel:function(){
        this.onBack()
    },
    cheack:function(hasFloating){
        return Gm.userInfo.checkCurrencyNum({attrId:this.m_tNeedNums[0],num:this.m_tNeedNums[1]})
        
        // if (this.m_tNeedNums[0] == 1001){
        //     if (Gm.userInfo.getGolden() < this.m_tNeedNums[1]){
        //         if (hasFloating){
        //             Gm.floating(Ls.get(2001))
        //         }
        //         return false
        //     }
        // }else if(this.m_tNeedNums[0] == 1002){
        //     if (Gm.userInfo.silver < this.m_tNeedNums[1]){
        //         if (hasFloating){
        //             Gm.floating(Ls.get(2002))
        //         }
        //         return false
        //     }
        // }else if(this.m_tNeedNums[0] == 999){
        //     if (Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.ARENA_COIN) < this.m_tNeedNums[1]){
        //         if (hasFloating){
        //             Gm.floating(Ls.get(2003))
        //         }
        //         return false
        //     }
        // }else if(this.m_tNeedNums[0] == 998){
        //     if (Gm.userInfo.devote < this.m_tNeedNums[1]){
        //         if (hasFloating){
        //             Gm.floating(Ls.get(2004))
        //         }
        //         return false
        //     }
        // }
        // return true
    },
    onOk:function(){
        if (this.currNum > 0 && this.m_tNeedNums){
            if (this.cheack(true)){
                this.currData.dealFunc(this.currNum)
                this.onBack()
            }
        }
    },
    
});

