var BaseView = require("BaseView")
// HomePageView
cc.Class({
    extends: BaseView,

    properties: {
        UnionInfoItem:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
       
        
        idLab:cc.Label,
        nameLab:cc.Label,
        leaderLab:cc.Label,
        lvLab:cc.Label,
        devoteLab:cc.Label,
        noticeLab:cc.Label,
        memberLab:cc.Label,

        devoteIcon:cc.Sprite,

        expBar:cc.ProgressBar,
        expLab:cc.Label,

        applyBtn:cc.Button,
    },
    onLoad () {
        this._super()
        Gm.ui.getConstIcon(ConstPb.allianceAttr.ALLIANCE_ACTIVITY,(sp)=>{
            this.devoteIcon.spriteFrame = sp
        })
        Gm.red.add(this.applyBtn.node,"union","apply")
    },
    enableUpdateView(args){
        args && this.updateView()
    },
    register:function(){
        this.events[Events.UNION_INFO_UPDATE] = this.onUnionInfoUpdate.bind(this)
        this.events[MSGCode.OP_SYNC_ALLIANCE_INFO_S] = this.onNetInfoSYNC.bind(this)
    },
    onUnionInfoUpdate:function(){
       if (!this.node.active || Gm.unionData.info == null){
           return
       }
    },
    onNetInfoSYNC(args){
        if (args.type == ConstPb.allianceReqType.EDIT_NOTICE){
            this.noticeLab.string = Gm.unionData.info.notice
        }else if (args.type == ConstPb.allianceReqType.APPLY_JOIN ){
            this.updateView()
        }else if (args.type == ConstPb.allianceReqType.OUT ){
            this.updateView()
        }else if (args.type == ConstPb.allianceReqType.EDIT_SEC_LEADER ){
            this.updateView()
        }else if (args.type == ConstPb.allianceReqType.EDIT_KICK_OUT ){
            this.updateView()
        }else if (args.type == null){
            this.updateView()
        }
    },
    updateView(){
        if (Gm.unionData.info == null){
            this.onBack()
            return 
        }
        var info = Gm.unionData.info
        this.idLab.string = "ID:" + info.allianceId 
        this.nameLab.string = cc.js.formatStr(Ls.get(1709),info.name)
        this.leaderLab.string = cc.js.formatStr(Ls.get(800010),"：",info.leaderName)
        this.lvLab.string = cc.js.formatStr(Ls.get(800138),"：",info.level)
        this.devoteLab.string = info.activity
        this.noticeLab.string = info.notice
        this.memberLab.string = Ls.get(800012) + "：" + info.memberNum+"/"+info.maxNum

        var unionConf = Gm.config.getUnion(info.level)

        this.expBar.progress =info.exp/unionConf.maxExp
        this.expLab.string = info.exp+"/"+unionConf.maxExp


        this.removeAllPoolItem(this.scrollView.content)
       
        var list = info.memberInfos
        list.sort(function(a,b){
            if (a.arenaFightInfo.playerId == Gm.userInfo.id){
                return -1
            }
            if (b.arenaFightInfo.playerId == Gm.userInfo.id){
                return 1
            }
            if ((a.arenaFightInfo.leaveTime > 0 && b.arenaFightInfo.leaveTime > 0) || a.arenaFightInfo.leaveTime < 0 && b.arenaFightInfo.leaveTime < 0){
                //同时在线或离线
                return b.devote - a.devote
            }else{
                return a.arenaFightInfo.leaveTime>0?-1:1
            }
            // if (a.arenaFightInfo.role == b.arenaFightInfo.role){
            //     return a.arenaFightInfo.fightValue > b.arenaFightInfo.fightValue?-1:1
            // }
            // return a.arenaFightInfo.role - b.arenaFightInfo.role
        })

        Gm.ui.simpleScroll(this.scrollView,list,function(itemData,tmpIdx){
            var item = this.getPoolItem()
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("UnionInfoItem")
            itemSp.updateData(itemData,this)
            return item
        }.bind(this))
        this.scrollView.scrollToTop()

        // for (var i = 0; i < list.length; i++) {
        //     var v = list[i]
        //     var item = this.getPoolItem()
        //     item.active = true
        //     this.scrollView.content.addChild(item)
        //     var itemSp = item.getComponent("UnionInfoItem")
        //     itemSp.updateData(v,this)
        // }
        // this.scrollView.scrollToTop()


        this.updateRote()
    },
    updateRote(){
        // this.disbandBtn.node.active = Gm.unionData.isLeader()

        this.applyBtn.interactable = Gm.unionData.isMgr()
    },
    //子类继承
    getBasePoolItem(){
        return this.UnionInfoItem
    },
    onEditNoticeBtn(){
        if (!Gm.unionData.isMgr()){
            Gm.floating(Ls.get(800128))
        }else{
            Gm.ui.create("UnionEmailView",{isSign:true})
        }
    },
    onApplyBtn(){
        if (Gm.unionData.applyList.length ==0){
            Gm.floating(Ls.get(800082))
            return
        }
        Gm.ui.create("UnionApplyView",true)
    },
    onRankBtn(){
        Gm.unionNet.rank()
    },
    onSetBtn(){
        if (!Gm.unionData.isMgr()){
            Gm.floating(Ls.get(800171))
            return
        }
        Gm.ui.create("UnionMgrView",true)
    },
    onDisbandBtn(){
        if (Gm.unionData.isLeader()){
            Gm.box({msg:Ls.get(800086)},function(btnType){
                if (btnType == 1){
                    Gm.unionNet.disband()
                }
            })
        }
    },
    onOutBtn(){
        var str = ""
        if(Gm.unionData.isLeader()){
            if(Gm.unionData.info.memberInfos.length == 1){
                str = Ls.get(800078)
            }else{
                str = Ls.get(800079)
            }
        }else{
            str = Ls.get(800080)
        }
        if(Gm.userInfo.level >= Gm.config.getConst("alliance_out_cd_level")){
            str = str + cc.js.formatStr(Ls.get(800081),Gm.config.getConst("alliance_out_cd")/60/60)
        }
        Gm.box({msg:str},function(btnType){
            if (btnType ==1){
                Gm.unionNet.out()
            }
        })
    },
});

