var BaseView = require("BaseView")
var TYPE_FIRST = 0
var compareValueKey = "compareValue_Level"
cc.Class({
    extends: BaseView,

    properties: {
        // pageNodes:{
        //     default:[],
        //     type:cc.Node,
        // },
        node201:cc.Node,
        node202:cc.Node,
        node203:cc.Node,
        node204:cc.Node,

        bottomListNode:cc.Node,

        ActivityPacketItem:cc.Prefab,
        scrollView:cc.ScrollView,

        dayTimeLab:cc.Label,
        weekTimeLab:cc.Label,
        monthTimeLab:cc.Label,

        nowLab:cc.Label,
        nextExpLab:cc.Label,
        nextgVipLv:cc.RichText,
        vipBar:cc.ProgressBar,
        vipDescNode:cc.Node,
    },
    onLoad () {
        this._super()
        this.selectType = -1

        this.listBtns = []
        for (let index =0; index <  this.bottomListNode.children.length ; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }

        this.pageNodes = {}
        //动态开启
        var eventConf = Gm.config.getEventTypeByType(2)
        for (let index = 0; index < eventConf.childType.length; index++) {
            const v = eventConf.childType[index];
            var conf = Gm.config.getEventPay(v)
            var btn = this.listBtns[index]
            btn.childType = v
            if (conf.trigger == 1){
                Gm.red.add(btn,"activity",2,v)
                btn.getChildByName("New Label").getComponent(cc.Label).string = conf.name
                // var icon = btn.getChildByName("defSpr").getComponent(cc.Sprite)
                // Gm.load.loadSpriteFrame("img/activity/"+conf.childIcon,function(sf,sp){
                //     sp.spriteFrame = sf
                // },icon)
                this.pageNodes[v] = this["node" + v]
                if(TYPE_FIRST == 0){
                    TYPE_FIRST = v
                }
            }else{
                btn.parent = null
            }
        }

        this.nowLab.node.redData = {offset:cc.v2(30,25)}
        Gm.red.add(this.nowLab.node,"activity",2,"vip")
    },
    onEnable(){
        this._super()
    },
    select(type){
        if (this.selectType != type){
            if(this.selectType != -1){
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectType = type
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = v.childType == type
                if (this.pageNodes[v.childType]){
                    this.pageNodes[v.childType].active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
                var lab = v.getChildByName("New Label")
                lab.color = isSelect?cc.color(255,248,188):cc.color(255,255,255)
                lab.getComponent(cc.LabelOutline).color = isSelect?cc.color(96,58,21):cc.color(0,0,0)
            }
            this.updateView()
        }
    },
    updateView(owner){
        if (owner){
            this.owner = owner
        }
        if(this.selectType==-1){
            this.select(TYPE_FIRST)
            return
        }
        this["updateNode" + (this.selectType)]()
        this.owner.updateTopGril(this.selectType)
    },
    updateNode202(){
        this.updateList(AtyFunc.TYPE_NORMAL_DAY)
        this.updateTime()
    },
    updateNode203(){
        this.updateList(AtyFunc.TYPE_NORMAL_WEEK)
        this.updateTime()
    },
    updateNode204(){
        this.updateList(AtyFunc.TYPE_NORMAL_MONTH)
        this.updateTime()
    },
    updateNode201(){
        this.updateList(AtyFunc.TYPE_NORMAL_DOAMIND)

        this.nowLab.string =  Gm.userInfo.vipLevel

        if( Gm.userInfo.vipLevel == 15) {
            this.vipBar.progress = 1
            this.vipDescNode.active = false
            return 
        }

        var str = Ls.get(60005)
        var exp = Gm.userInfo.vipExp
        var nextNum = Gm.config.getVip().payRmb
        this.nextExpLab.string = nextNum - exp// cc.js.formatStr(str,(nextNum - exp),Gm.userInfo.vipLevel+1)
        var forMatStr = "<color=#00FFFF><size=30><outline color=#000F width=3>VIP%s</outline></size></c><color=#FFFAFA><size=20><outline color=#000F width=3>%s</outline></size></color>"
        this.nextgVipLv.string = cc.js.formatStr(forMatStr,Gm.userInfo.vipLevel+1,Ls.get(5362))
        
        this.vipBar.progress = exp/nextNum
    },
    updateList(type){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getEventPayReward(type)//this.getPayReward(type)
        this.items = []
        Gm.ui.simpleScroll(this.scrollView,list,function(itemData,tmpIdx){
            var item = cc.instantiate(this.ActivityPacketItem)
            item.active = true
            this.scrollView.content.addChild(item)

            var sp = item.getComponent("ActivityPacketItem")
            sp.setData(itemData,this)
            this.items.push(sp)
            return item
        }.bind(this))
        // var itemHeight = 0
        // for (let index = 0; index < list.length; index++) {
        //     const itemData = list[index];
        //     var item = cc.instantiate(this.ActivityPacketItem)
        //     item.active = true
        //     itemHeight = item.height
        //     this.scrollView.content.addChild(item)

        //     var sp = item.getComponent("ActivityPacketItem")
        //     sp.setData(itemData,this)
        //     this.items.push(sp)
        // }
        // this.scrollView.content.height = (itemHeight+10)*Math.ceil((list.length))
        // this.scrollView.scrollToTop()
    },

    getPayReward(type){
        switch(type){
            case AtyFunc.TYPE_NORMAL_DAY:
               this.UpdateCompare(Gm.activityData.data.dayResetTime,type,Gm.userInfo.getMaxMapId())
                break 
            case AtyFunc.TYPE_NORMAL_WEEK:
                this.UpdateCompare(Gm.activityData.data.weekResetTime,type,Gm.userInfo.getMaxMapId())
                break
            case AtyFunc.TYPE_NORMAL_MONTH:
                this.UpdateCompare(Gm.activityData.data.monthResetTime,type,Gm.userInfo.getMaxMapId())
                break 
        }
        var list = Gm.config.getEventPayReward(type)
        if(type == AtyFunc.TYPE_NORMAL_DOAMIND){
            return list
        }else{
            let value = cc.sys.localStorage.getItem(type+compareValueKey)
            for(let key =0; key<list.length; key++){
                 if(list[key].startLevel >= value){  //数据筛选
                    list.splice(key,1)
                    key--;
                 }
            }
            return list
        }
    },

    UpdateCompare(time,type,value){
        var localTime = cc.sys.localStorage.getItem(type) || 0 
        var localCompareValue = cc.sys.localStorage.getItem(type+compareValueKey)
        if( localTime < time){ //进入下一个时间周期
            cc.sys.localStorage.setItem(type,time)
            cc.sys.localStorage.setItem(type+compareValueKey,value)
        }else if(!localCompareValue){
            cc.sys.localStorage.setItem(type+compareValueKey,value)
        }
    },

    onTopBtnClick(sender,value){
        this.select(sender.currentTarget.childType)
    },
    onVipBtn(){
        Gm.ui.create("VipView")
    },
    updateTime(){
        var time = Func.translateTime(Gm.activityData.data.dayResetTime,true)
        this.dayTimeLab.string = AtyFunc.timeToDayAndH(time,this.dayTimeLab)

        time = Func.translateTime(Gm.activityData.data.weekResetTime,true)
        this.weekTimeLab.string = AtyFunc.timeToDayAndH(time,this.weekTimeLab)

        time = Func.translateTime(Gm.activityData.data.monthResetTime,true)
        this.monthTimeLab.string = AtyFunc.timeToDayAndH(time,this.monthTimeLab)
    },
});

