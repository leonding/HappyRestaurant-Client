cc.Class({
    extends: cc.Component,
    properties: {
        gems:{
            default: [],
            type: cc.Sprite,
        },
    },
    setData:function(equip){
        if (equip && equip.gemInfos){
            this.node.active = true
            for (let index = 0; index < equip.gemInfos.length; index++) {
                const v = equip.gemInfos[index];
                var gemItem = this.gems[index]
                gemItem.node.active = v.gemItemId > -1
                var bgSpr = gemItem.getComponent(cc.Sprite)
                if (v.gemItemId >-1 && bgSpr.spriteFrame == null){
                    Gm.load.loadSpriteFrame("img/gem/zb_bs_1",function(sp,icon){
                        if (icon && icon.node && icon.node.isValid){
                            icon.spriteFrame = sp
                        }
                    },bgSpr)
                }
                var gemSp = gemItem.node.getChildByName("gemSp")
                gemSp.active = v.gemItemId >0
                if (v.gemItemId > 0){
                    var spr = gemSp.getComponent(cc.Sprite)
                    var conf = Gm.config.getGem(v.gemItemId)
                    if(conf){
                        Gm.load.loadSpriteFrame("img/gem/" + conf.mosaicIcon,function(sp,icon){
                            if (icon && icon.node && icon.node.isValid){
                                icon.spriteFrame = sp
                            }
                        },spr)
                    }
                }
            }
        }else{
            this.node.active = false
        }
    },
    
});

