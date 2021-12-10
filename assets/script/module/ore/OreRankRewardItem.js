//OreRankRewardItem
cc.Class({
    extends: cc.Component,
    properties: {
        indexLabel:cc.Label,
        indexSprite:cc.Sprite,
        indexIcon:cc.Sprite,
        rewardNode:cc.Node,
        rewardItem:cc.Node,
    },
    setUI(data){
        this.data = data
        this.setIndexSprite()
        this.setRewardNode()
    },
    setIndexSprite(){
         if(this.data.minRank <=3){
            Gm.load.loadSpriteFrame("img/tower/tower_icon_hz"+this.data.minRank,function(sp,icon){
                if(icon && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.indexSprite)

            Gm.load.loadSpriteFrame("img/shuijing/crystal_icon_ph_"+this.data.minRank,function(sp,icon){
                    if(icon && icon.node.isValid){
                        icon.spriteFrame = sp
                    }
            },this.indexIcon)
            this.indexLabel.node.active = false
         }
         else{
             this.indexIcon.node.active = false
             this.indexSprite.node.active =false
             if(this.data.minRank == this.data.maxRank){
                  this.indexLabel.string = this.data.minRank
             }
             else{
                  this.indexLabel.string = this.data.minRank  + "~" + this.data.maxRank
             }
         }
    },
    setRewardNode(){
        for(var i=0;i<this.data.reward.length;i++){
            var item = cc.instantiate(this.rewardItem)
            var newItem = Gm.ui.getNewItem(item,true)
            newItem.setData(this.data.reward[i])
            this.rewardNode.addChild(item)
        }
    }
});