var BaseView = require("BaseView")
var TYPE_BALCK = 0
var TYPE_ADD = 1
var TYPE_APPLY =2
var textColor = "<outline color='#000000'><color=#FCF1DC>%s<color=#B9FA79>%s/%s</c></c></outline>"
cc.Class({
    extends: BaseView,
    properties: {
        scrollWidget:cc.Widget,
        friendItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        friendNumLab:cc.RichText,
        fireNode:cc.Node,

        maxApplyNumLab:cc.RichText,
        bottomListNode:cc.Node,
        pageNodes:{
            default:[],
            type:cc.Node,
        },
        searchEditBox:{
            default:null,
            type:cc.EditBox
        },
        m_oBlankTipNode:cc.Node,//空白页提示     
        pageButtonListPrefab:cc.Prefab,
        pageBtnNode:cc.Node,
    },
    onLoad:function(){
        this.popupUIData = {title:7043}
        this._super()
        this.selectType = -1
       
        var tmpPre = cc.instantiate(this.pageButtonListPrefab)
        this.pageBtnNode.addChild(tmpPre)
        this.pageBtn = tmpPre.getComponent("PageButtonList")
        
        var strs = [7050,7049,7048]
        var pageList = []
        for (let index = 0; index < strs.length; index++) {
            pageList.push({str:strs[index],type:index})        
        }
        this.pageBtn.setData(pageList,this,165)

        Gm.red.add(this.pageBtn.listBtns[2],"friend","apply")
    },
    onEnable(){
        this._super()
        this.pageBtn.select(TYPE_APPLY)
    },
    register(){
        this.events[Events.UPDATE_FRIEND_MGR] = this.onUpdateFriendList.bind(this)
    },
    onUpdateFriendList(args){
        // if (args.targetId){

        // }else{
        //     this.updateView()
        // }
        this.updateView()
    },
    select:function(type){
        // if (this.selectType != type){
        //     this.selectType = type
            // for (const key in this.listBtns) {
            //     const v = this.listBtns[key];
            //     var isSelect = key == type
            //     if (this.pageNodes[key]){
            //         this.pageNodes[key].active = isSelect
            //     }
            //     v.getChildByName("selectSpr").active = isSelect
            //     v.getChildByName("New Label").color = Func.getPageColor(isSelect)
            // }
        //     this.updateView()
        // }

        for (var i = 0; i < this.pageNodes.length; i++) {
            this.pageNodes[i].active = this.selectType == i
        }
        Gm.audio.playEffect("music/06_page_tap")
        this.sendBi()
        this.updateView()
    },
    updateView(){
        cc.log(this.selectType)
        this["updateNode" + (this.selectType)]()
    },
    updateNode0(){
        this.updateWidget(15)
        this.updateList(Gm.friendData.blackList)
        this.checkBlank(Gm.friendData.blackList, 5409)
    },
    updateNode1(){
        this.updateWidget(208)
        this.updateList(Gm.friendData.searchs)
        this.checkBlank(Gm.friendData.searchs, 5408)
    },
    updateNode2(){
        this.updateWidget(208)
        this.updateList(Gm.friendData.applyList)
        this.setBlankTip(false)
    },
    updateList(list){
        list = list || []
        Func.destroyChildren(this.scrollView.content)
        this.fireNode.active = list.length ==0
        for (let index = 0; index < list.length; index++) {
            var v = list[index]
            var item = cc.instantiate(this.friendItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("ApplyItem")
            itemSp.setData(v,this)
        }
        if (this.selectType == TYPE_BALCK){
            this.friendNumLab.string = cc.js.formatStr(textColor,Ls.get(7047),list.length,Gm.config.getConst("blacklist_max"))
        }else{
            this.friendNumLab.string = cc.js.formatStr(textColor,Ls.get(7012),Gm.friendData.friendList.length,Gm.config.getVip().friendNum)
        }
        this.maxApplyNumLab.string = cc.js.formatStr(textColor,Ls.get(7082),list.length,Gm.config.getConst("friend_apply_limit"))
    },
    onTopBtnClick:function(sender,value){
        this.select(checkint(value))
    },
    updateWidget(bottom){
        this.scrollWidget.bottom = bottom
        this.scrollWidget.updateAlignment()
    },
    onAllPassBtn(){
        if (Gm.friendData.applyList.length == 0){
            return
        }
        if (Gm.friendData.isFull(Gm.friendData.applyList.length)){
            Gm.floating(Ls.get(5443))
            return
        }
        Gm.friendNet.replyApply(0,1)
    },
    onAllHlBtn(){
        if (Gm.friendData.applyList.length == 0){
            return
        }
        Gm.friendNet.replyApply(0,0)
    },
    onSearchClick(){
        var msg = this.searchEditBox.string.replace(/(^\s*)|(\s*$)/g, "")
        if (msg == ""){
            this.searchEditBox.string = ""
            return
        }
        Gm.friendNet.search(msg)
    },
    delFriend(targetId){
        var list = this.scrollView.content.children
        for (let index = 0; index < list.length; index++) {
            const v = list[index].getComponent("ApplyItem")
            if (v.data && v.data.arenaFightInfo.playerId == targetId){
                v.node.destroy()
                break
            }
        }
        var layout = this.scrollView.content.getComponent(cc.Layout)
        layout._layoutDirty = true
        layout.updateLayout()
    },
    onBack(){
        Gm.friendData.searchs = null
        this._super()
    },
    checkBlank:function(data, tip){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
        if(isBlank){
            this.m_oBlankTipNode.getChildByName("friendTipsLab").getComponent(cc.Label).string = Ls.get(tip)
        }
    },
    setBlankTip:function(isVisible){
        if(this.m_oBlankTipNode){
            this.m_oBlankTipNode.active = isVisible
        }
    }
});

