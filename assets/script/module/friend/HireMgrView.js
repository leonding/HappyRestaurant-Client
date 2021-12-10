var BaseView = require("BaseView")
var TYPE_APPLY = 0
var TYPE_JC = 1
cc.Class({
    extends: BaseView,
    properties: {
        scrollWidget:cc.Widget,
        HireMgrItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        bottomListNode:cc.Node,
        oneHlBtn:cc.Node,
        onePassBtn:cc.Node,
        contentLab:cc.Label,
        pageButtonListPrefab:cc.Prefab,
        pageBtnNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:Ls.get(5290)}
        this._super()
        this.selectType = -1
       
        var tmpPre = cc.instantiate(this.pageButtonListPrefab)
        this.pageBtnNode.addChild(tmpPre)
        this.pageBtn = tmpPre.getComponent("PageButtonList")
        
        var strs = [5218,5219]
        var pageList = []
        for (let index = 0; index < strs.length; index++) {
            pageList.push({str:strs[index],type:index})        
        }
        this.pageBtn.setData(pageList,this)
    },
    onEnable(){
        this._super()
        this.pageBtn.select(TYPE_APPLY)
    },
    register(){
        this.events[MSGCode.OP_HIRE_AID_APPLY_REPLY_S] = this.onUpdateFriendList.bind(this)
        this.events[MSGCode.OP_HIRE_AID_RETURN_S] = this.onNetHireReturn.bind(this)
        this.events[MSGCode.OP_HIRE_AID_INFO_S] = this.onUpdateFriendList.bind(this)
    },
    onNetHireReturn(){
        if (this.selectType == TYPE_JC){
            this.updateView()
        }
    },
    onUpdateFriendList(args){
        this.updateView()
    },
    select:function(type){
        this.updateView()
    },
    updateView(){
        this.oneHlBtn.active = this.selectType == TYPE_APPLY
        this.onePassBtn.active = this.selectType == TYPE_APPLY
        this["updateNode" + (this.selectType)]()
    },
    updateNode0(){
        this.updateWidget(108)
        this.updateList(Gm.friendData.hireApplys)
    },
    updateNode1(){
        this.updateWidget(-20)
        this.updateList(Gm.friendData.hireLends)
    },
    updateList(list){
        list = list || []

        this.contentLab.string = Ls.get(this.selectType==0?7083:7084)
        this.contentLab.node.parent.active = list.length == 0
        Func.destroyChildren(this.scrollView.content)
        this.itemHeight= 0 
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var item = cc.instantiate(this.HireMgrItem)
            item.active = true
            this.itemHeight = item.height
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("HireMgrItem")
            itemSp.setData(v,this,this.selectType == TYPE_APPLY)
        }
        this.scrollView.content.height =(this.itemHeight+5)*list.length
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    updateWidget(bottom){
        this.scrollWidget.bottom = bottom
        this.scrollWidget.updateAlignment()
    },
    onAllPassBtn(){
        if (Gm.friendData.hireApplys.length >0){
            Gm.friendNet.hireReplyApply(0,1,0)
        }
        
    },
    onAllHlBtn(){
        if (Gm.friendData.hireApplys.length >0){
            Gm.friendNet.hireReplyApply(0,0,0)
        }
    },
});

