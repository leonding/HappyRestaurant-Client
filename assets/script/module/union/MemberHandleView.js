var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        headNode:cc.Node,
        lvLab:cc.Label,
        roleRich:cc.RichText,
        fightRich:cc.RichText,
        gxzRich:cc.RichText,
        leftBtnLab:cc.Label,
        leftBtn:cc.Button,
        rightBtn:cc.Button,
    },
    onLoad:function(){
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.memberId = args
            this.updateView()
        }
    },
    register:function(){
        this.events[MSGCode.OP_SYNC_ALLIANCE_INFO_S] = this.onNetInfoSYNC.bind(this)
    },
    onNetInfoSYNC:function(args){
        if (args.type == ConstPb.allianceReqType.EDIT_SEC_LEADER){
            this.updateView()
        }else if (args.type == ConstPb.allianceReqType.EDIT_KICK_OUT){
            this.onBack()
        }
    },
    updateView(){
        this.data = Gm.unionData.getMember(this.memberId)
        this.lvLab.string = this.data.arenaFightInfo.name + "  Lv." + this.data.arenaFightInfo.level
        Func.newHead2(this.data.arenaFightInfo.head,this.headNode)
        var btnName = this.data.arenaFightInfo.role==3?Ls.get(800008):Ls.get(800009)
        this.leftBtnLab.string = btnName
        var roleName =this.data.arenaFightInfo.role==1?Ls.get(800010):this.data.arenaFightInfo.role==2?Ls.get(800011):Ls.get(800012)
        this.roleRich.string = cc.js.formatStr("<color=#F0E3DC>%s</c><color=#F663FF>%s</color>",Ls.get(800013),roleName)
        this.fightRich.string = cc.js.formatStr("<color=#F0E3DC>%s</c><color=#6977D6>%s</color>",Ls.get(800014),this.data.arenaFightInfo.fight)
        this.gxzRich.string = cc.js.formatStr("<color=#F0E3DC>%s</c><color=#4BB846>%s</color>",Ls.get(800015),this.data.arenaFightInfo.devote)

        this.leftBtn.interactable = Gm.unionData.isLeader()
        this.rightBtn.interactable = Gm.unionData.isMgr() && !Gm.unionData.isLeader(this.memberId)
    },
    onLeftBtn(){
        if (this.data.role==3){
            var conf = Gm.config.getUnion(Gm.unionData.info.level)
            if (Gm.unionData.getMgrNum() == conf.secLeader){
                Gm.floating(cc.js.formatStr(Ls.get(800016),conf.secLeader))
                return
            }
        }
        
        var dd = {}
        dd.manager = ConstPb.allianceRoleManager.ROLE_CHANGE
        dd.memberId = this.data.arenaFightInfo.playerId
        Gm.unionNet.mgrEdit(dd)
    },
    onCenterBtn(){
        Gm.ui.create("ArenaInfoBox",{player:this.data.arenaFightInfo})
    },
    onRightBtn(){
        var str = ""
        var needExp = Gm.config.getConst("alliance_kick_cost_exp")
        if (this.data.arenaFightInfo.leaveTime < Gm.config.getConst("alliance_offline_days")){
            str = cc.js.formatStr(Ls.get(800017),needExp,this.data.name)
        }else{
            str = cc.js.formatStr(Ls.get(800018),this.data.arenaFightInfo.name)
        }
        Gm.box({msg:str},function(btnType){
            if (btnType == 1){
                var dd = {}
                dd.manager = ConstPb.allianceRoleManager.KICK_OUT
                dd.memberId = this.data.arenaFightInfo.playerId
                Gm.unionNet.mgrEdit(dd)
            }
        }.bind(this))
    },
});

