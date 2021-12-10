var BaseView = require("BaseView")
// ArenaInfoBox
cc.Class({
    extends: BaseView,
    properties: {
        userBaseInfo:cc.Prefab,

        unionRoleBtn:cc.Node,
        unionOutBtn:cc.Node,
        friendBtn:cc.Node,
        blackBtn:cc.Node,
        privateBtn:cc.Node
    },
    onLoad:function(){
        this.popupUIData = {title:1700}
        this._super()
        this.popupUI.setHeight(960)
        var userNode = cc.instantiate(this.userBaseInfo)
        this.userInfoUI = userNode.getComponent(userNode.name)
        this.popupNode.addChild(userNode,-1)
        this.userInfoUI.node.active = false
        this.userInfoUI.enterName = this.openData.enterName
    },
    register(){
        this.events[Events.UPDATE_FRIEND_MGR] = this.updateFriendBtn.bind(this)
    },
    // onEnable(){
    //     this._super()
    //     this.enableUpdateView(this.openData)
    // },
    // openActionComplete(){
        
    // },
    enableUpdateView:function(data){
        if (data){
            this.args = data
            this.callback = data.callback
            this.m_oData = data.player
            this.updateView()
            Gm.heroNet.getLineHero(this.m_oData.lineType || ConstPb.lineHero.LINE_BOSS,this.m_oData.playerId)    
        }
    },
    updateView(){
        this.userInfoUI.setData(this.m_oData)
        this.userInfoUI.node.active = true
        this.updateUnion()
        this.updateFriendBtn()
    },
    updateUnion(){
        if (Gm.unionData.info && Gm.unionData.isLeader() && this.m_oData.allianceName && Gm.unionData.getMember(this.m_oData.playerId)  ){
            var btnName = this.m_oData.role==3?Ls.get(1712):Ls.get(1713)
            this.unionRoleBtn.getChildByName("Label").getComponent(cc.Label).string = btnName
        }else{
            this.unionOutBtn.parent = null
            this.unionRoleBtn.parent = null
        }
    },
    updateFriendBtn(){
        var frientLangId = 1703
        if(Gm.friendData.getFriend(this.m_oData.playerId)){ //已是好友
            frientLangId = 1714 //"删除好友"
        }
        this.friendBtn.getChildByName("Label").getComponent(cc.Label).string = Ls.get(frientLangId)

        //黑名单关系
        var blackId = 1702
        if(Gm.friendData.getBlack(this.m_oData.playerId)){
            blackId = 1715 //"移除黑名单"
        }
        this.blackBtn.getChildByName("Label").getComponent(cc.Label).string = Ls.get(blackId)
    },
    setLineHero(args){
        this.userInfoUI.updateTeam(args)
    },
    onMessage:function(){
        if (Gm.friendData.getBlack(this.m_oData.playerId)){
            Gm.floating(7051)
            return
        }
        var main = Gm.ui.getScript("MainView")
        main.showChat(this.args)

        // var main = Gm.ui.getScript("MainView")
        // main.showChat({player:this.data.arenaFightInfo,enterName:"FriendView"})

        if (this.callback){
            this.callback(2)
        }
        this.onBack()
    },
    onBlack:function(){
        if(Gm.friendData.getBlack(this.m_oData.playerId)){
            Gm.friendNet.removeBlack(this.m_oData.playerId)
            return
        }
        Gm.friendNet.addBlack(this.m_oData.playerId)
    },
    onFriend:function(){
        if (Gm.friendData.getBlack(this.m_oData.playerId)){
            Gm.floating(1716)
            return
        }

        if (Gm.friendData.getFriend(this.m_oData.playerId)){
            Gm.friendNet.del(this.m_oData.playerId)
            return
        }
        if (Gm.friendData.isFull()){
            Gm.floating(Ls.get(2015))
            return
        }
        Gm.friendNet.apply(this.m_oData.playerId)
    },
    onRoleBtn(){
        if (this.m_oData.role==3){
            var conf = Gm.config.getUnion(Gm.unionData.info.level)
            if (Gm.unionData.getMgrNum() == conf.secLeader){
                Gm.floating(cc.js.formatStr(Ls.get(800016),conf.secLeader))
                return
            }
        }
        
        var dd = {}
        dd.manager = ConstPb.allianceRoleManager.ROLE_CHANGE
        dd.memberId = this.m_oData.playerId
        Gm.unionNet.mgrEdit(dd)

        this.onBack()
    },
    onOutBtn(){
        var str = ""
        var needExp = Gm.config.getConst("alliance_kick_cost_exp")
        if (this.m_oData.leaveTime < Gm.config.getConst("alliance_offline_days")){
            str = cc.js.formatStr(Ls.get(800017),needExp,this.m_oData.name)
        }else{
            str = cc.js.formatStr(Ls.get(800018),this.m_oData.name)
        }
        Gm.box({msg:str},(btnType)=>{
            if (btnType == 1){
                var dd = {}
                dd.manager = ConstPb.allianceRoleManager.KICK_OUT
                dd.memberId = this.m_oData.playerId
                Gm.unionNet.mgrEdit(dd)

                this.onBack()
            }
        })
    },
});

