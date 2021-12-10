//OreBattleLogRewardItem
cc.Class({
    extends: cc.Component,
    properties: {
        rewardNode:cc.Node,
        getBtn:cc.Node,
        timeLabel:cc.Label,
        typeSprite:cc.Sprite,
        typeLabel:cc.Label,
    },
    setUI(data){
        this.data = data
        this.setRewardNode()
        Gm.red.add(this.getBtn,"ore","oreHasReward")
    }, 
    setRewardNode(){
        this.itemJs = Gm.ui.getNewItem(this.rewardNode,true)
        this.itemJs.setData({type:30000,id:1002,num:this.data.gold})
        this.timeLabel.string = OreFunc.timeToDayAndH(this.data.time/1000)
        Gm.load.loadSpriteFrame("/img/shuijing/crystal_icon_jb_" + this.data.roomType,function(sp,icon){
            if(icon && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.typeSprite)
        this.typeLabel.string = Ls.get(7500063+this.data.roomType)
    },
    onGetBtnClick(){
        Gm.oreNet.sendOreReceive(0,this.data.roomType)//领取别占领遗留金币
    },
    updateItem(count){
        // this.itemJs.setLabStr("x" + Func.transNumStr(count))
        // this.label2.string = this.getTimeStr(Math.floor((Gm.userData.getTime_m() - this.data.time)/1000))
    },
});


