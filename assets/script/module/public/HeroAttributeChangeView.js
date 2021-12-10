var BaseView = require("BaseView")
var MOVE_TIME = 0.3
cc.Class({
    extends: BaseView,
    properties: {
        fightNode:cc.Node,
        content:cc.Node,
        changeItem:cc.Node,
        fightLab:cc.Label,
        lastFightLab:cc.Label,
        upFont:cc.Font,
        downFont:cc.Font
    },
    enableUpdateView(args){
        if (args){
            this.updateView(args,true)
        }
    },
    updateView(data,isPlay){
        this.node.stopAllActions()
        this.content.stopAllActions()
        this.addNum = 0

        this.openData = data
        this.fightLab.string = this.openData.lastFight
        this.lastFightLab.string = this.openData.fight-this.openData.lastFight

        if (this.openData.lastFight >= this.openData.fight){
            this.fightNode.active = false
        }else{
            this.fightNode.active = true
        }

        Func.destroyChildren(this.content)
        this.content.parent.height = this.openData.attrList.length*49

        var num = 0
        for (var i = 0; i < this.openData.attrList.length; i++) {
            var v = this.openData.attrList[i]
            var tmpName0 = Gm.config.getBaseAttr(v.attrId)
            if (tmpName0 == null){
                continue
            }
            var tmpNode = cc.instantiate(this.changeItem)
            tmpNode.active = true
            this.content.addChild(tmpNode)
            var attrLab = tmpNode.getChildByName("attrLab").getComponent(cc.Label)
            var valueLab = tmpNode.getChildByName("valueLab").getComponent(cc.Label)

            var showValue = v.attrValue
            if(tmpName0.percentage == 1){
                showValue = v.attrValue/100 + "%"
            }
            if (v.attrValue > 0){
                valueLab.font = this.upFont
                showValue = "+" + showValue
            }else{
                valueLab.font = this.downFont
                showValue = showValue
            }

            attrLab.string = tmpName0.childTypeName
            valueLab.string = showValue
            num = num + 1
        }
        if(data.weaponNewSkill){
             var tmpNode = cc.instantiate(this.changeItem)
            tmpNode.active = true
            this.content.addChild(tmpNode)
            var attrLab = tmpNode.getChildByName("attrLab").getComponent(cc.Label)
            var valueLab = tmpNode.getChildByName("valueLab").getComponent(cc.Label)
            attrLab.string = Ls.get(7200026)
            attrLab.node.anchorX = 0.5
            attrLab.node.x = 0
            this.content.parent.height  = this.content.parent.height  + 49
        }

        if (isPlay){
            this.fightNode.getComponent(cc.Animation).play("tanban")
            this.content.y = num*49

            var acList = new Array()
            acList.push(cc.moveTo(MOVE_TIME,cc.v2(0,0)))
            acList.push(cc.callFunc(()=>{
                this.numPlay()
            }))
            this.content.runAction(cc.sequence(acList))
        }else{
            this.content.y = 0
            this.numPlay()
        }
    },
    numPlay(){
        var fight = this.openData.fight-this.openData.lastFight
        if (fight > 0){
            this.isMin = true
        }
        this.addNum = Math.ceil(fight/(60*MOVE_TIME))
        this.nowShowNum = this.openData.lastFight

        var acList = new Array()
        acList.push(cc.delayTime(1))
        acList.push(cc.callFunc(()=>{
            this.onBack()
        }))
        this.node.runAction(cc.sequence(acList))
    },
    update(){
        if (this.addNum){
            if (this.isMin){
                if (this.nowShowNum >= this.openData.fight){
                    this.addNum = 0
                    this.nowShowNum = this.openData.fight
                }
            }else{
                if (this.nowShowNum <= this.openData.fight){
                    this.addNum = 0
                    this.nowShowNum = this.openData.fight
                }
            }
            if (this.addNum > 0){
                this.nowShowNum = Math.min(this.nowShowNum + this.addNum,this.openData.fight)
            }else{
                this.nowShowNum = Math.max(this.nowShowNum + this.addNum,this.openData.fight)
            }

            this.fightLab.string = this.nowShowNum
        }
    },
});

