var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        btn1:cc.Button,
        btn2:cc.Button,
        checkSpr1:cc.Sprite,
        checkSpr2:cc.Sprite,
        descLab1:cc.Label,
        descLab2:cc.Label,
        maxAutoLab:cc.Label,
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    register:function(){
        this.events[MSGCode.OP_ALLIANCE_BOSS_AUTO_S] = this.updateView.bind(this)
    },
    updateView(){
        this.descLab1.string = Ls.get(Gm.config.getConst("automatic_combat_1"))
        this.descLab2.string = Ls.get(Gm.config.getConst("automatic_combat_2"))

        this.minAuto = Gm.unionData.bossInfo.autoBattle == 1
        this.maxAuto = Gm.unionData.bossInfo.autoBattle == 2

        this.checkSpr1.node.active = this.minAuto
        this.checkSpr2.node.active = this.maxAuto
        this.maxAutoLab.string = Gm.config.getConst("alliance_automatic_combat_consume")
    },
    onBtn(sender,value){
        value = checkint(value)
        if (Gm.userInfo.vipLevel < Gm.config.getConst("automatic_combat_vip_" + value)){
            Gm.floating(Ls.get(800001))
            return
        }
        if (value == 1){
            this.minAuto = !this.minAuto
            if (this.minAuto){
                this.maxAuto = false
            }
        }else{
            this.maxAuto = !this.maxAuto
            if (this.maxAuto){
                this.minAuto = false
            }
            if (this.maxAuto && Gm.unionData.bossInfo.autoBattle != 2){
                var golden = Gm.config.getConst("alliance_automatic_combat_consume")
                if (golden>Gm.userInfo.getGolden()){
                    Gm.floating(Ls.get(800002))
                    return
                }
                Gm.floating(cc.js.formatStr(Ls.get(800003),golden))
            }
        }
        var auto =0
        if (this.minAuto){
            auto = 1
        }else if (this.maxAuto){
            auto = 2
        }
        if(Gm.unionData.bossInfo.status == 1){
            Gm.floating(Ls.get(800004))
            this.onBack()
            return
        }
        Gm.unionNet.bossAuto(auto)
    },
    
});

