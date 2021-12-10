var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        EquipStrengthenNeedItem:cc.Node,
        onePrimarysNode:cc.Node,
        tenPrimarysNode:cc.Node,

        oneNeedNode:cc.Node,
        tenNeedNode:cc.Node,
        maxTipsNode:cc.Node,
        // guide
        btn1:cc.Node,
    },
    onLoad () {
        this._super()
    },
    onEnable(){
        this._super()
    },
    updateView(owner){
        this.owner = owner

        Func.destroyChildren(this.oneNeedNode)
        Func.destroyChildren(this.tenNeedNode)

        this.maxTipsNode.active = this.owner.equip.strength == Gm.userInfo.level

        this.updateStrengthen()
        this.updateStrengthen(true)
    },
    updateStrengthen(isTen){
        var primarys = EquipFunc.getEquipPrimarys(this.owner.equip)

        var primarysNode = isTen?this.tenPrimarysNode:this.onePrimarysNode
        
        var num = isTen?10:1
        for (let index = 0; index < 6; index++) {
            var baseNode = primarysNode.getChildByName("node" +(index+1))
            var lab1 = baseNode.getChildByName("lab1").getComponent(cc.Label)
            var lab2 = baseNode.getChildByName("lab2").getComponent(cc.Label)
            var equipChangeLable = baseNode.getChildByName("lab2").getComponent("EquipChangeLable")
            baseNode.active = true
            if (index == 0){
                lab1.string = Ls.get(1525)
                lab2.string = this.owner.equip.strength
                equipChangeLable.setNum(Math.min(this.owner.equip.strength+num,Gm.userInfo.level),this.owner.equip.strength)
            }else if (index == 1){
                baseNode.active = false
            }else{
                var primarysIndex = index-2
                if (primarys[primarysIndex] == null){
                    baseNode.active = false
                    continue
                }
                var attrData = primarys[primarysIndex].attrData;
                lab1.string =  EquipFunc.getBaseIdToName(attrData.attrId)
                lab2.string = EquipFunc.getBaseIdToNum(attrData.attrId,attrData.attrValue) 

                var nextAdd = 0
                for (let i = 0; i < num; i++) {
                    nextAdd = nextAdd + this.getAddNum(this.owner.equip.strength+i,attrData.attrId)
                }

                equipChangeLable.setNum(attrData.attrValue+nextAdd,attrData.attrValue)
            }
        }

        if (this.owner.equip.strength == Gm.userInfo.level){
            return
        }

        var needList = []
        for (let i = this.owner.equip.strength+1; i <= this.owner.equip.strength+num; i++) {
            if (i > Gm.userInfo.level){
                break
            }
            var qhConf = Gm.config.getStrengthen(i)
            for (let j = 0; j < qhConf.consume.length; j++) {
                const v = qhConf.consume[j];
                this.pushList(needList,v)
            }
        }

        var needNode = isTen?this.tenNeedNode:this.oneNeedNode
        for (let index = 0; index < needList.length; index++) {
            const itemData = needList[index];
            var item = cc.instantiate(this.EquipStrengthenNeedItem)
            item.active = true
            needNode.addChild(item)

            var itemNode = item.getChildByName("item")
            var itemBase = Gm.ui.getNewItem(itemNode)
            itemBase.node.scale = itemNode.width/itemBase.node.width
            var count = itemData.num
            itemData.num = null
            itemBase.setData(itemData)
            itemBase.setShowAccess(true)


            var hasNum = 0
            if (itemData.type == ConstPb.itemType.PLAYER_ATTR){
                hasNum = Gm.userInfo.getDataBy(itemData.id)
            }else if (itemData.type == ConstPb.itemType.TOOL){
                hasNum = 0
                var pro = Gm.bagData.getItemByBaseId(itemData.id)
                if (pro != null){
                    hasNum = pro.count
                }
            }
            var rich = item.getChildByName("rich").getComponent(cc.RichText)
            rich.string = Func.doubleLab(hasNum,count,"ffffff","ffffff")
        }
    },
    pushList(list,data){
        var item = Func.forBy(list,"id",data.id)
        if (item){
            item.num = item.num + data.num
        }else{
            list.push(Func.copyData(data))
        }
    },
    getAddNum(lv,attrId){
        if (lv >= Gm.userInfo.level){
            return 0
        }
        var currNum = this.getEquipLvNum(lv,attrId)
        var nextNum = this.getEquipLvNum(lv+1,attrId)

        return nextNum - currNum
    },
    getEquipLvNum(lv,attrId){
        if (lv == 0){
            return 0
        }
        var qhConf = Gm.config.getStrengthen(lv)
        var baseAttr = Gm.config.getBaseAttr(attrId)
        var value = qhConf[baseAttr.systemName]
        return Math.floor(value*Gm.config.getStrengthenPro(this.owner.conf.level).proportion/10000)
    },
    isCanQh:function(){
        if (Gm.userInfo.level <= this.owner.equip.strength){
            Gm.floating(Ls.get(1529))
            return false
        }
        if (this.owner.equip.strength == Gm.userInfo.level){
            Gm.floating(Ls.get(1526))
            return
        }
        var qhConf = Gm.config.getStrengthen(this.owner.equip.strength+1)
        for (let index = 0; index < qhConf.consume.length; index++) {
            const data = qhConf.consume[index];
            if (data.num > 0 ){
                if (!Gm.userInfo.checkCurrencyNum({attrId:data.id,num:data.num})){
                    return false
                }
                // if (data.type == ConstPb.itemType.PLAYER_ATTR){
                //     if (Gm.userInfo.getDataBy(data.id) < data.num){
                //         Gm.floating(Ls.get(1527))
                //         return false
                //     }
                // }else if (data.type == ConstPb.itemType.TOOL){
                //     var item = Gm.bagData.getItemByBaseId(data.id)
                //     if (item== null || (item && item.count < data.num)){
                //         Gm.floating(Ls.get(1528))
                //         return false
                //     }
                // }
            }
        }
        return true
    },
    onQh1Btn(){
        console.log("onQh1Btn")
        if (this.isCanQh()){
            Gm.equipNet.qh(this.owner.currData.hero,this.owner.equip.equipId,0)
        }
    },
    onQh10Btn(){
        console.log("onQh10Btn")
        if (this.isCanQh()){
            Gm.equipNet.qh(this.owner.currData.hero,this.owner.equip.equipId,1)
        }
    },
});

