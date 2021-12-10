var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        headNode:cc.Node,
        nameLab:cc.Label,
        nameEdit:cc.EditBox,
        toggle:cc.Toggle,
        disbandBtn:cc.Button,
    },
    onLoad:function(){
        this.popupUIData = {title:800127}
        this._super()
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    register:function(){
        this.events[MSGCode.OP_SYNC_ALLIANCE_INFO_S] = this.onNetInfoSYNC.bind(this)
    },
    onNetInfoSYNC:function(args){
        if (args.type == ConstPb.allianceReqType.EDIT_NOTICE 
                || args.type == ConstPb.allianceReqType.EDIT_OPEN_BOSS
                || args.type == ConstPb.allianceReqType.EDIT_EMAIL
                || args.type == ConstPb.allianceReqType.EDIT_FIGHT){
            this.updateView()
        }
    },
    updateView(){
        var info = Gm.unionData.info
        this.nameLab.string = info.name
        Func.newHead2(Gm.config.getConst("alliance_head"),this.headNode)
        this.nameEdit.string = info.joinFight || 0

        this.toggle.isChecked = info.leaderReply

        this.disbandBtn.interactable = Gm.unionData.isLeader()
    },
    onToggle(sender){
        if (sender.isChecked != Gm.unionData.info.leaderReply){
            if (sender.isChecked){
                Gm.audio.playEffect("music/Really Useful Game Hit 04")
            }else{
                Gm.audio.playEffect("music/Really Useful Game Hit 03")
            }
            var dd = {}
            dd.manager = ConstPb.allianceRoleManager.APPLY_JOIN_SET
            dd.fight = Gm.unionData.info.joinFight
            dd.leaderReply = sender.isChecked
            Gm.unionNet.mgrEdit(dd)
        }
    },
    onDisbandClick(){
        if (Gm.unionData.isLeader()){
            Gm.box({msg:Ls.get(800086)},function(btnType){
                if (btnType == 1){
                    Gm.unionNet.disband()
                }
            })
        }
    },
    onEmailClick(){
        Gm.ui.create("UnionEmailView",{isEmail:true})
    },
    checkFight(){
        var msg
        if (typeof(this.nameEdit.string) == "number"){
            msg = this.nameEdit.string + ""
        }else{
            msg = this.nameEdit.string.replace(/(^\s*)|(\s*$)/g, "")
        }
        if (msg !=""){
            msg = Number(msg)
            if (isNaN(msg)){
                Gm.floating(Ls.get(800066))
                this.nameEdit.string = Gm.unionData.info.joinFight
                return
            }
            if (msg != Gm.unionData.info.joinFight){
                var dd = {}
                dd.manager = ConstPb.allianceRoleManager.APPLY_JOIN_SET
                dd.fight = msg
                dd.leaderReply = this.toggle.isChecked
                Gm.unionNet.mgrEdit(dd)
            }
        }
        this.nameEdit.string = Gm.unionData.info.joinFight
    },
    onEditDidEnded(sender){
        this.checkFight()
    },
    onEditRenturn(sender){
        this.checkFight()
    },
    
});

