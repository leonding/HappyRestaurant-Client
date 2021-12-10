var BaseView = require("BaseView")
const fight_value = [
    [100],//HP上限
    // [101],//MP上限
    [102],//Min攻击力
    // [103,2001],//Max攻击力
    // [104,504,121],//格挡值
    // [105,505],//格穿值
    [106],//护甲值
    // [107,507,1007],//魔抗值
    // [108,508],//护穿值
    // [109,509],//法穿值
    [110],//命中值
    [111],//闪避值
    // [112,512,123],//暴击值
    // [113,513],//
    [114],//
                    ]
const other_value = [
    [515],//

    // [516,116],//
    //[117],//
    [517],//
    // [518],//
    // [519],//
    // [122],//
    // [124],//
    // [522],//
    [524],//
    // [121],
    [123],
    // [2007],//
    // [2008],//
    // [2009],//
    // [2010],//
    // [200],//
    // [201],//
    // [202],//
                    ]
// HeroInfoView
cc.Class({
    extends: BaseView,
    properties: {
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        itemfab:cc.Node,
    },
    onLoad(){
        this.popupUIData = {title:70033}
        this._super()
    },
    enableUpdateView:function(args){
        if (args){
            this.m_oData = args
            // Gm.audio.playEffect("music/02_popup_open")
            for(var i in fight_value){
                this.dealOne(fight_value[i])
            }
            for(var i in other_value){
                this.dealOne(other_value[i])
            }
        }
    },
    dealOne:function(_attrId){
        var name = null
        var value = 0
        var tmpName0 = Gm.config.getBaseAttr(_attrId[0])
        var tmpValue0 = this.m_oData.getAttrValue(_attrId[0])
        if (tmpName0){
            name = tmpName0.childTypeName
            if (tmpName0.percentage){
                value = tmpValue0/100 + "%"
            }else{
                value = tmpValue0
            }
        }else{
            name = Ls.get(5239) + _attrId[0]
            value = tmpValue0
        }
        var item = cc.instantiate(this.itemfab)
        item.active = true
        var _name = item.getChildByName("name").getComponent(cc.Label)
        _name.string = name
        var _value = item.getChildByName("value").getComponent(cc.Label)
        _value.string = value
        if (this.scrollView.content._children.length%2 == 0){
            item.getChildByName("back").active = false
        }
        this.scrollView.content.addChild(item)
    },
});

