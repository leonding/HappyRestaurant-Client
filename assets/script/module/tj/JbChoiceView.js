var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        btnNode:cc.Node,
        atkNode:cc.Node,
        defNode:cc.Node,
        selSpf:cc.SpriteFrame,
        defSpf:cc.SpriteFrame
    },
    onLoad:function(){
        this._super()
        this.configs = Gm.config.getJbType()
        this.buttons = []
        this.childType = 0 
        // this.configs.push({childTypeName:"全装备",type:10})
        for (let index = 0; index <  this.configs.length; index++) {
            const v =  this.configs[index];
            var con = Gm.config.getJbByType(v.childType)[0]
            var btnParentNode = null
            if (con){ 
                if (con.propertyType == 2){
                    btnParentNode = this.defNode
                }else if (con.propertyType == 1){
                    btnParentNode = this.atkNode
                }
            }
            if (btnParentNode){
                var btn = cc.instantiate(this.btnNode)
                btn.active = true
                var lab = btn.getChildByName("Background").getChildByName("Label").getComponent(cc.Label)
                lab.string = v.childTypeName
                
                btnParentNode.addChild(btn)
                btn.childType = v.childType
                this.buttons.push(btn)
            }
        }
    },
    onEnable:function(){
        
    },
    onCelllClick:function(sender){
        var childType = checkint(sender.target.childType)
        this.setChildType(childType)
    },
    setChildType:function(childType){
        if (this.childType == childType){
            return
        }
        this.setCellBtnSpf(this.childType,this.defSpf)
        this.childType = childType
        this.setCellBtnSpf(this.childType,this.selSpf)
    },
    setCellBtnSpf:function(childType,spf){
        for (let index = 0; index < this.buttons.length; index++) {
            const v = this.buttons[index];
            if (v.childType == childType){
                var sp = v.getChildByName("Background").getComponent(cc.Sprite)
                sp.spriteFrame = spf
            }
        }
    },
    onBtn1:function(){
        this.onBack()
    },
    onBtn2:function(){
        this.setChildType(0)
    },
    onBtn3:function(){
        var sp = Gm.ui.getScript("TjView")
        sp.updateJb(this.childType)
        this.onBack()
    },
});

