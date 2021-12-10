var BaseView = require("BaseView")
var TYPE_FIRST = -1
cc.Class({
    extends: BaseView,

    properties: {
        selectNodes:cc.Node,
        bottomListNode:cc.Node,
        // preList:{
        //     default:[],
        //     type:cc.Prefab,
        // },
        godlerLab:cc.Label,
        silverLab:cc.Label,
        topGril:cc.Sprite,
    },
    onLoad () {
        this._super()

        this.termsData = Gm.config.getTerms()

        this.selectIndex = -1

        this.listBtns = []
        for (let index = 0; index < this.bottomListNode.children.length; index++) {
            const v = this.bottomListNode.children[index];
            this.listBtns.push(v)
        }

        var list = Gm.config.getEventType()
        var hasNum = 0
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            if (v.module == 1){
                var btn = this.listBtns[hasNum]
                btn.childType = v.type
                if (v.trigger == 1){
                    btn.getChildByName("New Label").getComponent(cc.Label).string = v.name
                    var icon = btn.getChildByName("defSpr").getComponent(cc.Sprite)
                    Gm.load.loadSpriteFrame("img/activity/"+v.icon,function(sf,sp){
                        if (sp && sp.node && sp.node.isValid){
                            sp.spriteFrame = sf
                        }
                    },icon)
                    if (TYPE_FIRST == -1){
                        TYPE_FIRST = index
                    }
                    if (v.type > 1){
                        Gm.red.add(btn,"activity",v.type,"all")
                    }
                    //显示商店
                    if(v.type == 1){
                        Gm.red.add(btn,"timeNoob","all")
                    }
                }else{
                    btn.parent = null
                }
                hasNum = hasNum + 1
            }
        }
        this.checkNeedOpenPlayInfo()
        this.bottomListNode.width = hasNum *100

        this.pageNodes = {}

        this.schedule(()=>{
            this.updateTime()
        },1)
    },
    onDisable(){
        this.unscheduleAllCallbacks()
        TYPE_FIRST = -1
    },
    enableUpdateView(args){
        if (args){
            this.setStarSelect(this.m_iDestPage || TYPE_FIRST)
            this.onUserInfoUpdate()
        }
    },
    setStarSelect(starIndex){
        if (this.listBtns && this.listBtns[starIndex]){
            this.listBtns[starIndex].zIndex = -1
        }
        this.select(starIndex)
    },
    register(){
        this.events[Events.USER_INFO_UPDATE] = this.onUserInfoUpdate.bind(this)
    },
    onUserInfoUpdate:function(){
        this.godlerLab.string = Func.transNumStr(Gm.userInfo.getGolden())
        this.silverLab.string = Func.transNumStr(Gm.userInfo.silver)
    },
    getTypeByIndex(index){
        var type = 1
        for(var i=0;i<this.listBtns.length;i++){
            if(i == index){
                type = this.listBtns[i].childType
                break
            }
        }
        return type
    },
    getIndexByType(type){
        var index = 0
        for(var i=0;i<this.listBtns.length;i++){
            if(this.listBtns[i].childType == type){
                index = i
                break
            }
        }
        return index
    },
    select(index){
        var type = this.getTypeByIndex(index)
        if (this.selectIndex != index){
            if(this.selectIndex != -1){// 初始化首次打开界面的时候不播放音效
                Gm.audio.playEffect("music/06_page_tap")
            }
            this.selectIndex = index
            this.sendBi()
            for (const key in this.listBtns) {
                const v = this.listBtns[key];
                var isSelect = v.childType == type
                var tindex = this.getIndexByType(v.childType)
                if (this.pageNodes[tindex]){
                    this.pageNodes[tindex].node.active = isSelect
                }
                v.getChildByName("selectSpr").active = isSelect
            }
            this.updateView()
        }
    },
    updateTopGril(pathStr){
        if(this.lastpathStr == pathStr){
            return
        }
        this.lastpathStr = pathStr
        
        Gm.load.loadSpriteFrame("img/activity/gift_img_" +pathStr,(sp,owner)=>{
            owner.spriteFrame = sp
        },this.topGril)
    },
    updateView(){
        if (this.pageNodes[this.selectIndex]){
            this.topGril.node.active = true
            this.pageNodes[this.selectIndex].node.active = true
            this.pageNodes[this.selectIndex].updateView(this)
        }else{
            var conf = Gm.config.getEventTypeByType( this.getTypeByIndex(this.selectIndex))
            // if (conf.viewName == "NormalPacketView" ){
            //     Gm.userInfo.passMedal = Gm.userInfo.passMedal + 100
            //     return
            // }
            if (conf.viewName){
                this.isLoad = true
                Gm.ui.findLayer(conf.viewName,(newNode)=>{
                    if (this.selectNodes && this.selectNodes.isValid){
                        this.selectNodes.addChild(newNode)
                        this.pageNodes[this.selectIndex] = newNode.getComponent(newNode.name)
                        this.updateView()
                        this.isLoad = false
                    }
                },true)
            }
        }
    },
    onTopBtnClick(sender,value){
        if (this.isLoad){
            return
        }
        this.select(this.getIndexByType(sender.currentTarget.childType))
    },
    updateTime(){
        for (const key in this.pageNodes) {
            if (this.pageNodes.hasOwnProperty(key)) {
                const v = this.pageNodes[key];
                v.updateTime()
            }
        }
    },
    onItemClick:function(sender,value){
        var tmpValue = checkint(value)
        if (tmpValue == 0){
            Gm.ui.create("ItemTipsView",{data:{baseId:1001},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
        }else if(tmpValue == 1){
            Gm.ui.create("ItemTipsView",{data:{baseId:1002},itemType:ConstPb.itemType.TOOL,pos:sender.touch._point})
        }
    },
    //101 102 103 104为空的外层的按钮不显示
    checkNeedOpenPlayInfo(){
        var isReset = false
        for (let index = 0; index < this.listBtns.length; index++) {
            const btn = this.listBtns[index];
            if(btn.childType == 1){
                if (!Gm.activityData.checkNeedOpenPlayInfo() && !Gm.activityData.checkisOpenLimitGift()){
                    btn.active = false
                    isReset = true
                }
            }else if (btn.childType == 4){
                if (Gm.activityData.data.passMedalResetTime == 0){
                    btn.active = false
                    isReset = true
                }
            }
        }
        if (isReset){
            for(let index1 = 0;index1<this.listBtns.length;index1++){
                const btn = this.listBtns[index1];
                if(btn.active){
                    TYPE_FIRST = index1
                    break
                }
            }
        }
    },

    onTermsClick(args,id){
        Gm.ui.create("UserTermsView",{list:this.termsData,id:id})
    },
   
});

