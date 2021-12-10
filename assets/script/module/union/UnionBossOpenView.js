var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        times:{
            default: [],
            type: require("BossOpenItem"),
        },
    },
    onLoad:function(){
        this._super()
        
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    register:function(){
        // this.events[MSGCode.OP_SYNC_ALLIANCE_INFO_S] = this.onNetInfoSYNC.bind(this)
    },
    onNetInfoSYNC:function(args){
        // this.updateView()
    },
    updateView(){
        for (let index = 0; index < this.times.length; index++) {
            const v = this.times[index];
            v.setDef()
            v.updateView(false)
        }
    },
    onCancelBtn(){
       
    },
    onOkBtn(){
        var list = []
        for (let index = 0; index < this.times.length; index++) {
            const v = this.times[index];
            list.push(v.getEditTime())
        }
        list.sort(function(a,b){
            return a-b
        })
        var conf = Gm.config.getUnionBoss(Gm.unionData.info.level)
        for (let index = 0; index <= 1; index++) {
            if (list[index] != 0  && list[index+1] != 0 ){
                if (list[index] + conf.closeTime*1000 > list[index+1]){
                    Gm.floating(Ls.get(800024))
                    return
                }
            }
        }
        var dd = {}
        dd.manager = ConstPb.allianceRoleManager.BOSS_OPEN
        dd.bossOpenTime = list
        Gm.unionNet.mgrEdit(dd)
        this.onBack()
    },
});

