var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oBaseFont:cc.Font,

        newItem:cc.Prefab,
        baseItem:cc.Prefab,
        baseEquip:cc.Prefab,
        baseHero:cc.Prefab,
        basePopupUI:cc.Prefab,

        loginBtn:cc.Button,
    },
    onLoad () {
        this._super()
        
        Gm.ui.setFont(this.m_oBaseFont)

        Gm.ui.setNewItem(this.newItem)
        Gm.ui.insertBaseItem(ConstPb.itemType.TOOL,this.baseItem)
        Gm.ui.insertBaseItem(ConstPb.itemType.EQUIP,this.baseEquip)
        Gm.ui.insertBaseItem(ConstPb.itemType.ROLE,this.baseHero)

        Gm.ui.setBasePopupUI(this.basePopupUI)
    },
    onLogin(){
        Gm.ui.create("PlateNumberBox",{type:1})
    },
    
});

