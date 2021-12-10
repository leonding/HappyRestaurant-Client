var BaseView = require("BaseView")
// HomePageView
cc.Class({
    extends: BaseView,

    properties: {
        zzNode:cc.Node,
        noUnionNode:cc.Node,
        UnionListItem:cc.Node,
        noUnionScroll: {
        	default: null,
        	type: cc.ScrollView
        },
        quitTips:cc.Label,
        unionEdit:{
            default:null,
            type:cc.EditBox
        },
        unionNode:cc.Node,
        hallBtn:cc.Node,
        bossBtn:cc.Node,
        lvLab:cc.Label,
        nameLab:cc.Label,
        memberNumLabl:cc.Label,
        //guide
        m_oSelet1:cc.Node,
        m_oSelet2:cc.Node,
        //guide
        m_oBlankTipNode:cc.Node,//空白页提示
        sportsBtn:cc.Node,
    },
    onLoad () {
        this._super()
        Gm.red.add(this.hallBtn,"union","apply")
        Gm.red.add(this.bossBtn,"union","boss")
        Gm.red.add(this.sportsBtn,"union","taskFinished")
    },
    onEnable(){
        this._super()
        this.updateView()
    },
    // Events.UNION_INFO_UPDATE
    register:function(){
        this.events[Events.UNION_INFO_UPDATE] = this.onUnionInfoUpdate.bind(this)
    },
    onUnionInfoUpdate:function(){
       if (!this.node.active || Gm.unionData.info == null){
           return
       }
       this.unionUpdate()
    },
    updateView(){
        if (Gm.unionData.id == 0){
            if (Gm.unionData.reList == null){
                Gm.unionNet.recommendList()
                return
            }else{
                this.noUnionView()
            }
            this.checkBlank(Gm.unionData.reList)
        }else{
            if(Gm.unionData.info == null){
                if (Gm.unionData.isSign){
                    Gm.unionNet.show(Gm.unionData.id)
                }else{
                    Gm.unionNet.sign()
                }
            }else{
                if (Gm.unionData.isSign){
                    this.unionUpdate()
                }else{
                    Gm.unionNet.sign()
                }
            }
            this.checkBlank(Gm.unionData.info)
        }
    },
    noUnionView(){
        this.noUnionNode.active = true
        this.unionNode.active = false
        this.zzNode.active = this.noUnionNode.active
        Func.destroyChildren(this.noUnionScroll.content)
        var list = Gm.unionData.reList
        Gm.ui.simpleScroll(this.noUnionScroll,list,function(tmpData,tmpIdx){
            var item = cc.instantiate(this.UnionListItem)
            item.active = true
            this.noUnionScroll.content.addChild(item)
            var itemSp = item.getComponent("UnionListItem")
            itemSp.updateData(tmpData,this)
            return item
        }.bind(this))
        // var itemHeight = 0
        // for (let index = 0; index < list.length; index++) {
        //     const itemData = list[index];
        //     var item = cc.instantiate(this.UnionListItem)
        //     item.active = true
        //     itemHeight = item.height
        //     this.noUnionScroll.content.addChild(item)
        //     var itemSp = item.getComponent("UnionListItem")
        //     itemSp.updateData(itemData,this)
        // }
        // this.noUnionScroll.content.height = 5+(itemHeight + 5)*Math.ceil((list.length))
        this.noUnionScroll.scrollToTop()

        this.unscheduleAllCallbacks()

        this.quitTips.string = ""
        if (Gm.unionData.lastQuitTime){
            var self = this
            var updateTime = function() {
                var time = Func.translateTime1(Gm.unionData.lastQuitTime)
                var allDay = 24*60*60
                if (time < allDay){
                    self.quitTips.string = cc.js.formatStr(Ls.get(5833),Func.timeToTSFM(allDay-time))
                }else{
                    self.quitTips.string = ""
                }
            }
            updateTime()
            this.schedule(()=>{
                updateTime()
            },1)
        }
        
    },
    unionUpdate(){
        this.noUnionNode.active = false
        this.unionNode.active = true
        this.zzNode.active = this.noUnionNode.active

        var info = Gm.unionData.info
        this.lvLab.string = Ls.lv() + info.level
        this.nameLab.string = info.name
        this.memberNumLabl.string = Ls.get(800012) + "：" + info.memberNum+"/"+info.maxNum
    },
    onFindBtn(){
        var msg = this.unionEdit.string.replace(/(^\s*)|(\s*$)/g, "")
        if (msg == ""){
            Gm.floating(Ls.get(50081))
            return
        }
        Gm.unionNet.search(msg)
    },
    onUpdateBtn(){
        this.clickTime = this.clickTime || 0 
        var sub = Gm.userData.getTime_s() - this.clickTime
        if (sub < Gm.config.getConst("alliance_list_refresh")){
            Gm.floating(Ls.get(50082))
            return
        }
        this.clickTime = Gm.userData.getTime_s()
        Gm.unionNet.recommendList()
    },
    onCraeteBtn(){
        Gm.ui.create("UnionCreateView")
    },
    onRankBtn(){
        Gm.unionNet.rank()
    },
    onShopBtn(){
        // Gm.ui.create("UnionShopView",true)
        Gm.ui.jump(90004)
    },
    onBossBtn(){
        
        Gm.unionNet.bossInfo(true)
    },
    onHallBtn(){
        Gm.friendNet.getOffOnState(1)
        // Gm.ui.create("UnionInfoView")
    },
    onTeamBattle(){

    },

    onMgrBtn(){
        Gm.ui.create("UnionMgrView",true)
    },
    
    onMemberBtn(){
        Gm.ui.create("UnionMemberView",true)
    },
    onBossSetBtn(){
        if(Gm.unionData.bossInfo.status == 1){
            Gm.floating(Ls.get(50083))
            return
        }
        Gm.ui.create("BossAutoSetView")
    },
    onBossRankBtn(){
        Gm.unionNet.bossRank()
    },
    onBossLookBtn(){
        if (Gm.unionData.bossInfo.status == 1){//已开启
            Gm.ui.create("UnionBossView")
            return
        }   
        if (!Gm.unionData.isMgr()){
            Gm.floating(Ls.get(50084))
            return
        }
        var bossConf = Gm.config.getUnionBoss(Gm.unionData.bossInfo.level)

        var str = Ls.get(50085)
        var needActive = bossConf.openActivity
        var currActive = Gm.unionData.info.activity
        var hasNum = Gm.unionData.bossInfo.openCount
        var sumNum = Math.floor(Gm.unionData.info.level/5)+2

        var newStr = cc.js.formatStr(str,currActive,needActive,hasNum,sumNum)
        Gm.box({msg:newStr,title:Ls.get(50086)},function(btnType){
            if (btnType == 1){
                if (currActive < needActive){
                    Gm.floating(Ls.get(50087))
                    return
                }
                if (hasNum >= sumNum){
                    Gm.floating(Ls.get(50088))
                    return
                }
                Gm.unionNet.bossOpen()                 
            }
        })

    },
    onGuide:function(){
    },
    getClick:function(destName){
        if (destName == "m_oSelet1" || destName == "m_oSelet2"){
            return "onGuide"
        }
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },
    onSportsBtn(){
        Gm.getLogic("UnionLogic").openUnionSportsView()
    },
    onBack(){
        Gm.unionData.reList = null
        this._super()
    },
    getSceneData:function(){
        return true
    },
    onHegemonyBtnClick(){
        Gm.getLogic("HegemonyLogic").openHegemony()
    }
});

