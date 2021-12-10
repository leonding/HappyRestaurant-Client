cc.Class({
    extends: cc.Component,

    properties: {
        topBgSpr:cc.Sprite,
        headBgSpr:cc.Sprite,
        resultSpr:cc.Sprite,
        headNode:cc.Node,
        layoutNode:cc.Node,
    },
    setData(roles,nums,result,head,owner){
        var topBgStr = result==1?"Settlement_img_slht":"Settlement_img_sbht"
        var headBgStr = result==1?"Settlement_img_slms":"Settlement_img_sbms"
        var resultStr = result==1?"Settlement_img_win":"Settlement_logo_lose"
        this.resultSpr.node.scale = result?1:0.4
        Gm.load.loadSpriteFrame("img/Settlement/" +topBgStr,function(sp,icon){
            icon.spriteFrame = sp
        },this.topBgSpr)
        Gm.load.loadSpriteFrame("img/Settlement/" +headBgStr,function(sp,icon){
            icon.spriteFrame = sp
        },this.headBgSpr)
        Gm.load.loadSpriteFrame("img/Settlement/" +resultStr,function(sp,icon){
            icon.spriteFrame = sp
        },this.resultSpr)


        // var iBase = Gm.ui.getNewItem(this.headNode,true)
        // iBase.updateHero({baseId:head || roles[0].quality})
        Func.newHead2(head || roles[0].quality,this.headNode)
        // cc.log(iBase.data)
        for (let index = 0; index < roles.length; index++) {
            const v = roles[index];
            var item = cc.instantiate(owner.roleNode)
            item.active = true
            this.layoutNode.addChild(item)

            var dd = {}
            dd.isMonster = true
            dd.baseId = v.quality
            dd.level = v.level
            
            var itemBase = Gm.ui.getNewItem(item.getChildByName("headNode"),true)
            itemBase.updateHero(dd)

            var bar1 = item.getChildByName("bar1")
            bar1.getComponent(cc.ProgressBar).progress = this.getProgress(v.sumHurt,nums.sumHurt)
            bar1.getChildByName("New Label").getComponent(cc.Label).string = Func.transNumStr(v.sumHurt,true)

            var bar2 = item.getChildByName("bar2")
            bar2.getComponent(cc.ProgressBar).progress = this.getProgress(v.sumBeHurt,nums.sumBeHurt)
            bar2.getChildByName("New Label").getComponent(cc.Label).string = Func.transNumStr(v.sumBeHurt,true)

            var bar3 = item.getChildByName("bar3")
            bar3.getComponent(cc.ProgressBar).progress = this.getProgress(v.sumBeHeal,nums.sumBeHeal)
            bar3.getChildByName("New Label").getComponent(cc.Label).string = Func.transNumStr(v.sumBeHeal,true)
        }

    },
    getProgress(num,sum){
        if (sum == 0){
            return 0
        }
        return num/sum
    },
    
});

