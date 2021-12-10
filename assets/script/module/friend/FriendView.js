var BaseView = require("BaseView")
var TYPE_FRIEND = 0
var TYPE_HIRE =1
var TYPE_AID = 2

var textColor = "<outline color='#000000'><color=#FFF3E0>%s<color=#BBFC7A>%s</c>/%s</c></outline>"
cc.Class({
    extends: BaseView,
    properties: {
        titleLab:cc.Label,
        bottomListNode:cc.Node,
        pageNodes:{
            default:[],
            type:cc.Node,
        },
        friendItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        friendNumLab:cc.RichText,
        friendPointLab:cc.Label,
        fridnSendMaxLab:cc.RichText,
        onePointBtn:cc.Button,
        applyBtn:cc.Node,
        noFriendNode:cc.Node,

        friendAidItem:cc.Node,
        aidScroll:cc.ScrollView,
        aidLab:cc.RichText,

        HireItem:cc.Node,
        hireParent:cc.Node,
        hireScroll:cc.ScrollView,
        hireHeadItem:cc.Node,
        filterPerfab:cc.Prefab,
        filterNode:cc.Node,
        hireTimeLab:cc.Label,
        hireMgrBtn:cc.Node,
    },
    onLoad:function(){
        this._super()

        this.selectType = -1
        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length ; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }

        var tmpFilter = cc.instantiate(this.filterPerfab)
        this.m_oTeamFilter = tmpFilter.getComponent("TeamFilter")
        this.filterNode.addChild(tmpFilter)

        this.m_iFilterValue  = 0
        this.m_iJobValue  = 0

        Gm.red.add(this.listBtns[0],"friend","apply")
        Gm.red.add(this.listBtns[0],"friend","point")
        Gm.red.add(this.applyBtn,"friend","apply")

        Gm.red.add(this.listBtns[1],"friend","hireApply")
        Gm.red.add(this.hireMgrBtn,"friend","hireApply")
        

        Gm.friendNet.getOffOnState()
    },
    onEnable(){
        this._super()
        this.unlockListBtn()
        if (this.selectType == -1 ){
            this.select(TYPE_FRIEND)
        }
    },
    enableUpdateView(args){
        if (args){
            this.m_oTeamFilter.setCallBack(0,0,function(filter,job){
                if (this.m_iJobValue != job || this.m_iFilterValue != filter){
                    this.m_iFilterValue = filter
                    this.m_iJobValue = job
                    this.updateHireHead()
                }
            }.bind(this))
        }
    },
    unlockListBtn(){
        var locks = []
        var viewData = Gm.config.getViewsByName(this.node._name)
        viewData.sort((a,b)=>{
            return a.interfaceParameter - b.interfaceParameter
        })
        
        for (var i = 0; i < viewData.length; i++) {
            var v = viewData[i]
            if (v && v.openMapId && Gm.userInfo.maxMapId < v.openMapId){
                this.listBtns[i].getChildByName("suo").active = true
            }

        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = key == type
                if (this.pageNodes[key]){
                    this.pageNodes[key].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                if (isSelect){
                    this.titleLab.string = v.getChildByName("New Label").getComponent(cc.Label).string
                }
                
            }
            if (this.selectType == TYPE_HIRE){
                Gm.friendNet.getCanHires()
                return
            }
            this.updateView()
        }
    },
    register:function(){
        this.events[MSGCode.OP_HIRE_AID_RETURN_S] = this.onNetHireReturn.bind(this)
        this.events[MSGCode.OP_HIRE_AID_INFO_S] = this.onNetHireReturn.bind(this)
        this.events[MSGCode.OP_HIRE_AID_APPLY_S] = this.onNetHireReturn.bind(this)
        this.events[MSGCode.OP_HIRE_AID_LIST_S] = this.onNetHireReturn.bind(this)
        this.events[Events.LOGIN_SUC]       = this.onLogicSuss.bind(this)
    },
    onLogicSuss(){
        Gm.friendNet.getOffOnState()
        Gm.friendNet.getCanHires()
    },
    onNetHireReturn(){
        if(this.selectType == TYPE_HIRE){
            this.updateView()
        }
    },
    updateView(){
        this["updateNode" + (this.selectType)]()
    },
    updateNode0(){//好友
        Func.destroyChildren(this.scrollView.content)
        this.friendItems = []
        var list = Gm.friendData.friendList
        list.sort(function(a,b){
            if (a.collectState == 1 && b.collectState == 1){
                if ((a.leaveTime!= 0 && b.leaveTime!=0) || (a.leaveTime == b.leaveTime)){
                    return a.fightValue > b.fightValue?-1:1
                }
                if (a.leaveTime == 0 ){
                    return -1
                }
                if (b.leaveTime == 0){
                    return 1
                }
            }
            return a.collectState == 1 ?-1:1            
        })
        Gm.ui.simpleScroll(this.scrollView,list,function(v,tmpIdx){
            var item = cc.instantiate(this.friendItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("FriendItem")
            itemSp.setData(v,this)
            return item
        }.bind(this))

        // for (let index = 0; index < list.length; index++) {
        //     var v = list[index]
        //     var item = cc.instantiate(this.friendItem)
        //     item.active = true
        //     this.itemHeight = item.height
        //     this.scrollView.content.addChild(item)
        //     var itemSp = item.getComponent("FriendItem")
        //     itemSp.setData(v,this)
        // }
        // this.scrollView.content.height = 6+(this.itemHeight+14)*list.length
        this.updateFriendNum()
    },
    updateNode1(){//佣兵
        if(this.hireParent.children.length == 0){
            this.hires = []
            for (let index = 0; index < 3; index++) {
                var item = cc.instantiate(this.HireItem)
                item.active = true
                this.hireParent.addChild(item)
                this.hires.push(item.getComponent("HireItem"))
            }
        }

        for (let index = 0; index < this.hires.length; index++) {
            const v = this.hires[index];
            v.setData(Gm.friendData.hireList[index])
        }

        this.updateHireHead()

        this.hireTimeLab.node.parent.active = Gm.friendData.hireList.length > 0
        if(this.hireTimeLab.node.parent.active){
            var timeStr = AtyFunc.timeToTSFMzh(Func.translateTime(Gm.friendData.hireExpireTime))
            this.hireTimeLab.string = timeStr + Ls.get(7080)
        }
    },
    updateHireHead(){
        Func.destroyChildren(this.hireScroll.content)
        var list = Gm.friendData.getCanHireHeads(this.m_iFilterValue,this.m_iJobValue)

        var isApply = function(hireData){
            for (let index = 0; index < hireData.list.length; index++) {
                const v = hireData.list[index];
                if (v.request){
                    return true
                }
            }
            return false
        }
        list.sort((a,b)=>{
            a.list.sort((a1,b1)=>{
                return a1.qualityId - b1.qualityId
            })
            b.list.sort((a1,b1)=>{
                return a1.qualityId - b1.qualityId
            })
            // var aApply = isApply(a)
            // var bApply = isApply(b)
            // if (aApply == bApply){
                var aConf = Gm.config.getHero(0,a.list[a.list.length-1].qualityId)
                var bConf = Gm.config.getHero(0,b.list[b.list.length-1].qualityId)
                return bConf.quality-aConf.quality
            // }
            // return aApply?-1:1
        })

        Gm.ui.simpleScroll(this.hireScroll,list,function(v,tmpIdx){
            var item = cc.instantiate(this.hireHeadItem)
            item.active = true
            this.hireScroll.content.addChild(item)
            var sp = item.getComponent("HireHeadItem")
            sp.setData(v,this)
            return item
        }.bind(this))

        // for (let index = 0; index < list.length; index++) {
        //     var v = list[index]
        //     var conf = Gm.config.getHero(v.idGroup)
        //     if ((this.m_iFilterValue == 0 || this.m_iFilterValue == conf.camp)&&
        //         (this.m_iJobValue == 0 || this.m_iJobValue == conf.job)){
        //         var item = cc.instantiate(this.hireHeadItem)
        //         item.active = true
        //         this.hireScroll.content.addChild(item)
        //         var sp = item.getComponent("HireHeadItem")
        //         sp.setData(v,this)
        //     }
        // }
        this.hireScroll.scrollToTop()
    },
    updateNode2(){//外援
        this.aidLab.string = cc.js.formatStr(textColor,Ls.get(7028),Gm.friendData.aidList.length,Gm.config.getConst("friend_max_aid"))
        Func.destroyChildren(this.aidScroll.content)
        var itemHeight = 0
        cc.log(Gm.friendData.aidList)
        var sum = Math.max(Gm.friendData.aidList.length,Gm.config.getConst("friend_max_aid"))
        for (let index = 0; index < sum; index++) {
            var v = Gm.friendData.aidList[index]
            var item = cc.instantiate(this.friendAidItem)
            item.active = true
            itemHeight = item.height
            this.aidScroll.content.addChild(item)
            var sp = item.getComponent("FriendAidItem")
            sp.setData(v,this)
        }
        this.aidScroll.content.height = (itemHeight+10)*Math.ceil((sum))
        this.aidScroll.scrollToTop()
    },
    updateFriendNum(){
        this.friendPointLab.string = Gm.userInfo.getCurrencyNum(ConstPb.playerAttr.FRIEND_POINT) //cc.js.formatStr(Ls.get(7034),)

        var color = "<color=#FFF3E0>%s<color=#BBFC7A>%s</c>/%s</c>"

        this.friendNumLab.string = cc.js.formatStr(textColor,Ls.get(7012),Gm.friendData.friendList.length,Gm.config.getVip().friendNum)
        this.fridnSendMaxLab.string = cc.js.formatStr(textColor,Ls.get(7044),Gm.friendData.getRevPointNum(),Gm.config.getVip().friendPointLimit)
        this.noFriendNode.active = Gm.friendData.friendList.length ==0 
        // this.onePointBtnLab.node.parent.active = true
        // if (this.isOneSend()){
        //     this.onePointBtnLab.string = 7045//"一键发送"
        // }else if (this.isOneReceive()){
        //     this.onePointBtnLab.string = 7046//"一键收取"
        // }else{
        //     this.onePointBtnLab.node.parent.active = false
        // }

        this.onePointBtn.interactable = this.isOneSend() || this.isOneReceive()
    },
    isOneSend(){
        for (let index = 0; index < Gm.friendData.friendList.length; index++) {
            const v = Gm.friendData.friendList[index];
            if (v.sendState == 0){
                return true
            }
        }
        return false
    },
    isOneReceive(){
        if (Gm.friendData.getRevPointNum() >= Gm.config.getVip().friendPointLimit){
            return false
        }
        for (let index = 0; index < Gm.friendData.friendList.length; index++) {
            const v = Gm.friendData.friendList[index];
            if (v.collectState == 1){
                return true
            }
        }
        return false
    },
    delFriend(targetId){
        var item = this.getItem(targetId)
        if (item){
            item.node.destroy()
            var layout = this.scrollView.content.getComponent(cc.Layout)
            layout._layoutDirty = true
            layout.updateLayout()
            this.updateFriendNum()
        }
    },
    getItem(playerId){
        var list = this.scrollView.content.children
        for (let index = 0; index < list.length; index++) {
            const v = list[index].getComponent("FriendItem")
            if (v.data && v.data.playerId == playerId){
                return v
            }
        }
    },
    updateItem(friend){
         var item = this.getItem(friend.playerId)
         if (item){
             item.setData(friend,this)
         }
         this.updateFriendNum()
    },
    updateLeaveTime(){
        if (this.selectType == TYPE_FRIEND){
            var list = this.scrollView.content.children
            for (let index = 0; index < list.length; index++) {
                const v = list[index].getComponent("FriendItem")
                v.updateSign()
            }
        }
        this.updateFriendNum()
    },
    onTopBtnClick:function(sender,value){
        value = checkint(value)
        var viewData = Gm.config.getViewByName(this.node._name,value)
        if (!Func.isUnlock(viewData.viewId,true)){
            return
        }
        this.select(value)
    },
    onFriendMgrBtn(){
        Gm.ui.create("ApplyListView")
    },
    onOneBtn(){
        if (this.isOneSend()){
            Gm.friendNet.sendPoint(0)
        }
        if (this.isOneReceive()){
            Gm.friendNet.collectPoint(0)
        }
    },
    onAidBtn(){
        Gm.friendNet.getAid()
    },
    onHireBtn(){
        Gm.ui.create("HireMgrView")
    },
});

