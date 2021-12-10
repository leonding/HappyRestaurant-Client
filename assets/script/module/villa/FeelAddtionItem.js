cc.Class({
    extends: cc.Component,

    properties: {
        node1:cc.Node,
        node2:cc.Node,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner

        for (var index = 0; index < data.length; index++) {
            var v = data[index]
            var nodeName = "node" + (index+1)
            if (v){
                this[nodeName].active = true
                var spr = this[nodeName].getChildByName("New Sprite").getComponent(cc.Sprite)

                var path = "ad_zhongfang"

                var conf = Gm.config.getBaseAttr(v.id)
                Gm.load.loadSpriteFrame("personal/bufficon/"+ conf.currencyIcon,function(sp,icon){
                    icon.spriteFrame = sp
                },spr)

                var rich = this[nodeName].getChildByName("New RichText").getComponent(cc.RichText)

                var baseName = EquipFunc.getBaseIdToName(v.id)
                var baseNum = EquipFunc.getBaseIdToNum(v.id,v.num)
                rich.string = cc.js.formatStr("<outline color='#000000' width=3><color=#ffffff>%s</c><color=#00ff00>+%s</color></outline>",baseName,baseNum)
            }else{
                this[nodeName].active = false
            }
        }

    },
    
});

