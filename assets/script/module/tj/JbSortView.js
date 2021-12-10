var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        btnList:{
            default: [],
            type: cc.Sprite,
        },
        defSpf:cc.SpriteFrame,
        selSpf:cc.SpriteFrame,
    },
    onLoad(){
        this.selectType = 0
    },
    onBtn:function(sender,value){
        value = checkint(value)
        if (this.selectType == value){
            return
        }
        this.setBtnSpf(this.selectType,this.defSpf)
        this.selectType = value
        this.setBtnSpf(this.selectType,this.selSpf)
    },
    setBtnSpf:function(index,spf){
        this.btnList[index].spriteFrame = spf
    },
    onCancelBtn:function(){
        this.onBack()
    },
    onOkBtn:function(){
        var sp = Gm.ui.getScript("TjView")
        sp.updateJbSort(this.selectType)
        this.onBack()
    },
});

