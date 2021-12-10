cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        nowSp:cc.Node,
        getNode:cc.Node,
    },
    updateSign:function(day,data,owner){
        this.day = day
        this.data = data
        this.owner = owner

        var award = data.item[0]
        this.itemSp = Gm.ui.getNewItem(this.itemNode,true)
        this.itemSp.setData(award)
        this.itemSp.setFb(this.itemClick.bind(this))
        
        this.nowSp.active = false

        if (day%5 == 0){
            var path = "task_img_m"
            if (day == 30){
                path = "task_img_h"
            }
            Gm.load.loadSpriteFrame("img/task/" +path,(sp,sf)=>{
                if (sf.node && sf.node.isValid){
                    sf.node.active = true
                    sf.spriteFrame = sp
                }
            },this.nowSp.getComponent(cc.Sprite))
        }

        this.updateCheck()
    },
    updateCheck(){
        if (this.getNode){
            this.getNode.active = false
        }
        if (Gm.signData.checkSign(this.day)){
            if (this.getNode == null){
                this.getNode = cc.instantiate(this.owner.getNode)
                this.node.addChild(this.getNode)
            }
            this.getNode.active = true
        }
        // this.itemSp.updateLock(Gm.signData.checkSign(this.day))
        this.setSelect(Gm.signData.getNowDay() >= this.day && this.day >Gm.signData.getHasDay())
    },
    itemClick(){
        return true
    },
    setSelect(show){
        if (show){
            if (this.flashNode){
                this.flashNode.active = true
                return
            }
            Gm.load.loadPerfab("perfab/ui/kuang01",(sp)=>{
                if(this.data && this.itemSp.node.isValid){
                    this.flashNode = cc.instantiate(sp)
                    this.itemSp.node.addChild(this.flashNode)
                }
            })
        }else{
            if (this.flashNode){
                this.flashNode.active = false
            }
        }
        
    }
});
