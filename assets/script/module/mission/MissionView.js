var BaseView = require("BaseView")
const ACTIVE_ID = 3001
// MissionView
const MISS_MAIN = 2
const MISS_DAIY = 0
const MISS_DONE = 1

const GIFT_NONE = 0
const GIFT_DONE = 1
const GIFT_HAVE = 2

cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab1: cc.Prefab,
        itemPerfab2: cc.Prefab,
        scrollView1: cc.ScrollView,
        scrollView2: cc.ScrollView,
        m_oBtnList: {
            default: [],
            type: cc.Button
        },
        m_oTimeNode:cc.Node,
        m_oTravelTime:cc.Label,
        m_oActiveNode:cc.Node,
        m_oGiftPerFab:cc.Node,
        m_oDailyBar:cc.ProgressBar,
        m_oDailyBox:cc.Node,
        m_oWeekyBox:cc.Node,
        m_oPowerLab:cc.Label,

        m_oBoxPre:cc.Prefab,

        selectType:-1,
        cellFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
    },
    onLoad(){
        this._super()

        this.popupUI.setTitle(Ls.get(3))
        Gm.red.add(this.m_oBtnList[0].node,"mission",1)
        Gm.red.add(this.m_oBtnList[1].node,"mission",2)
        Gm.red.add(this.m_oBtnList[2].node,"mission",3)
        this.addTimes()

        var tmpConfig = Gm.config.getItem(ACTIVE_ID)
        this.m_tAnimate = []
        Gm.load.loadSpriteFrame("img/items/" +tmpConfig.icon,function(sp,icon){
            icon.spriteFrame = sp
            icon.node.parent.getChildByName("animate0").getComponent(cc.Sprite).spriteFrame = sp
            icon.node.parent.getChildByName("animate1").getComponent(cc.Sprite).spriteFrame = sp
            icon.node.parent.getChildByName("animate2").getComponent(cc.Sprite).spriteFrame = sp
        },this.m_oActiveNode.getChildByName("spr").getComponent(cc.Sprite))
        this.m_tAnimate.push(this.m_oActiveNode.getChildByName("animate0"))
        this.m_tAnimate.push(this.m_oActiveNode.getChildByName("animate1"))
        this.m_tAnimate.push(this.m_oActiveNode.getChildByName("animate2"))

        var tmpData = Gm.config.getDailyMis()
        this.m_tGiftSub = {}
        this.m_iDailyMax = 0
        this.m_iWeekyMax = 0
        for(const i in tmpData){
             if (tmpData[i].type == 1 || tmpData[i].type == 2){
                var tmpIdx = (tmpData[i].id % 100)-1
                var item = cc.instantiate(this.m_oGiftPerFab)
                var tmpBox = cc.instantiate(this.m_oBoxPre)
                tmpBox.parent = item
                item.groupIndex = tmpIdx
                item.groupType = tmpData[i].type
                if (tmpData[i].type == 1){
                    this.m_oDailyBox.addChild(item)
                    if (tmpData[i].active > this.m_iDailyMax){
                        this.m_iDailyMax = tmpData[i].active
                    }
                }else{
                    this.m_oWeekyBox.addChild(item)
                    if (tmpData[i].active > this.m_iWeekyMax){
                        this.m_iWeekyMax = tmpData[i].active
                    }
                }
                if (!this.m_tGiftSub[tmpData[i].type]){
                    this.m_tGiftSub[tmpData[i].type] = []
                }
                this.m_tGiftSub[tmpData[i].type].push({node:item,ani:tmpBox,data:tmpData[i],has:false})
             }
        }
    },
    dealBox:function(node,idx,isOpen){
        var tmpIdx = idx % 10
        let box = node.getChildByName("box").getChildByName("box")
        let j = box.getChildByName("prop_bx_j")
        j.active = false
        let jk = box.getChildByName("prop_bx_jk")
        jk.active = false
        let t = box.getChildByName("prop_bx_t")
        t.active = false
        let tk = box.getChildByName("prop_bx_tk")
        tk.active = false
        let y = box.getChildByName("prop_bx_y")
        y.active = false
        let yk = box.getChildByName("prop_bx_yk")
        yk.active = false
        if (tmpIdx <= 1){
            if (isOpen){
                tk.active = true
            }else{
                t.active = true
            }
        }else if(tmpIdx > 1 && tmpIdx < 4){
            if (isOpen){
                yk.active = true
            }else{
                y.active = true
            }
        }else{
            if (isOpen){
                jk.active = true
            }else{
                j.active = true
            }
        }
    },
    enableUpdateView:function(args){
        if (args){
            // Gm.audio.playEffect("music/02_popup_open")
            if (Gm.missionData.dailyClearTime <= Gm.userData.getTime_m()){
                Gm.taskNet.sendTaskList()
            }
            var tmpEnter = this.m_iDestPage || MISS_DAIY
            if (!this.m_iDestPage){
                var tmpAll = true
                for(const i in Gm.red.states.mission){
                    if (!Gm.red.states.mission[i]){
                        tmpAll = false
                        break
                    }
                }
                if (tmpAll){
                    tmpEnter = MISS_DAIY
                }else{
                    for(const i in Gm.red.states.mission){
                        if (Gm.red.states.mission[i]){
                            tmpEnter = checkint(i) - 1
                            break
                        }
                    }
                }
            }
            this.select(tmpEnter)
        }
    },
    register:function(){
        this.events[Events.MISSION_UPDATE] = this.updateList.bind(this)
    },
    updateList:function(){
        var tmpList = Gm.missionData.getMisByType(this.selectType+1)
        if (tmpList){
            tmpList.sort(function(a,b){
                if (a.data.openLevel > Gm.userInfo.maxMapId || b.data.openLevel > Gm.userInfo.maxMapId){
                    return a.data.openLevel - b.data.openLevel
                }
                if (a.rate == a.data.rate){
                    return -1
                }
                if (a.rate == -1){
                    return 1
                }
                if (b.rate == b.data.rate){
                    return 1
                }
                if (b.rate == -1){
                    return -1
                }
                return a.data.id - b.data.id
            })
            var tmpScroll = null
            var tmpItem = null
            if (this.selectType != MISS_MAIN){
                this.scrollView1.node.active = true
                this.scrollView2.node.active = false
                this.updateDaily(tmpList)
                this.scrollView1.scrollToOffset(cc.v2(0, 0),0)
                tmpScroll = this.scrollView1
                tmpItem = this.itemPerfab1
            }else{
                this.scrollView1.node.active = false
                this.scrollView2.node.active = true
                this.updateDaily()
                this.scrollView2.scrollToOffset(cc.v2(0, 0),0)
                tmpScroll = this.scrollView2
                tmpItem = this.itemPerfab2
            }
            var tmpTotal = tmpList.length
            if (this.items && this.items.length == tmpTotal){
                for(const i in this.items){
                    this.items[i].setOwner(this,tmpList[i].data)
                    this.items[i].updateMission(tmpList[i].rate)
                }
            }else{
                Func.destroyChildren(tmpScroll.content)
                this.items = []
                Gm.ui.simpleScroll(tmpScroll,tmpList,function(tmpData,tmpIdx){
                    var item = cc.instantiate(tmpItem)
                    // item.scale = 0
                    tmpScroll.content.addChild(item)
                    var tmpSpt = item.getComponent("MissionCell")
                    tmpSpt.setOwner(this,tmpData.data)
                    tmpSpt.updateMission(tmpData.rate)
                    this.items.push(tmpSpt)
                    return item
                }.bind(this))
            }
        }else{
            this.updateDaily()
        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            this.items = []
            for (const key in this.m_oBtnList) {
                const v = this.m_oBtnList[key];
                var isSelect = key == type
                this.m_oBtnList[key].node.getChildByName("selectSpr").active = isSelect
            }
            if (Gm.missionData.getMisByType(this.selectType+1)){
                this.updateList()
            }
        }
    },
    updateDaily:function(data){
        if (data){
            this.m_oTimeNode.active = true
            this.m_oDailyBar.node.active = true
            this.updateRefreshTime()
            var tmpTotal = 0
            var tmpPowerNow = 0
            for(const i in data){
                if (data[i].rate == -1){
                    tmpPowerNow = tmpPowerNow + data[i].data.active
                }
            }
            var tmpBarWid = 0
            if (this.selectType == MISS_DAIY){
                tmpTotal = this.m_iDailyMax
                tmpBarWid = this.m_oDailyBox.width
                this.m_oDailyBox.active = true
                this.m_oWeekyBox.active = false
            }else{
                tmpTotal = this.m_iWeekyMax
                tmpBarWid = this.m_oWeekyBox.width
                this.m_oDailyBox.active = false
                this.m_oWeekyBox.active = true
            }

            // console.log("==updateDaily==:",tmpPowerNow,tmpTotal)
            // tmpOne.data.openLevel > Gm.userInfo.getMaxMapId()
            var tmpType = this.selectType + 1 // 1是日常，2是周常
            for(const i in this.m_tGiftSub[tmpType]){
                var tmpOne = this.m_tGiftSub[tmpType][i]
                tmpOne.node.active = true
                if (tmpOne.data.isActive){
                    if (!Gm.missionData.activeAtyOpen){
                        tmpOne.node.active = false
                        tmpOne.has = GIFT_NONE
                        break
                    }
                }
                var tmpActive = tmpOne.data.active
                // if (tmpType == 1){
                //     tmpActive = tmpOne.data.active
                // }else{
                //     tmpActive = tmpOne.data.allianceActive
                // }
                tmpOne.node.x = (tmpActive/tmpTotal)*tmpBarWid
                if (tmpPowerNow >= tmpActive){
                    if (Gm.missionData.isActiveRece(tmpOne.data.id)){
                        tmpOne.has = GIFT_DONE
                    }else{
                        tmpOne.has = GIFT_HAVE
                    }
                }else{
                    tmpOne.has = GIFT_NONE
                }
                if (tmpOne.has == GIFT_DONE){
                    tmpOne.ani.getComponent(cc.Animation).play("box_lizi")
                    this.dealBox(tmpOne.node,tmpOne.data.id,false)
                }else{
                    tmpOne.ani.getComponent(cc.Animation).play("box_none")
                    if (tmpOne.has == GIFT_NONE){
                        this.dealBox(tmpOne.node,tmpOne.data.id,false)
                    }else{
                        this.dealBox(tmpOne.node,tmpOne.data.id,true)
                    }
                }
                var tmpNums = tmpOne.node.getChildByName("nums")
                tmpNums.getComponent(cc.Label).string = ""+tmpActive
            }
            this.m_oDailyBar.progress = tmpPowerNow/tmpTotal
            var tmpNow = checkint(this.m_oPowerLab.string)
            this.m_oPowerLab.string = ""+tmpPowerNow
            if (Gm.taskNet.m_iGetId){
                this.giftAnimate()
            }
        }else{
            this.m_oTimeNode.active = false
            this.m_oDailyBar.node.active = false
        }
    },
    giftAnimate:function(){
        var pos = null
        if (Gm.taskNet.m_iGetId){
            for(const i in this.items){
                if (this.items[i].m_oData.id == Gm.taskNet.m_iGetId){
                    pos = this.m_oActiveNode.convertToNodeSpaceAR(this.items[i].m_oGiftNode.convertToWorldSpaceAR(cc.v2(0,0)))
                    break
                }
            }
            Gm.taskNet.m_iGetId = null
        }
        if (pos){
            for(const i in this.m_tAnimate){
                this.m_tAnimate[i].active = true
                this.m_tAnimate[i].x = pos.x
                this.m_tAnimate[i].y = pos.y
                var acList = new Array()
                acList.push(cc.delayTime(i*0.2))
                acList.push(cc.moveTo(0.2,cc.v2(0,-8)))
                acList.push(cc.callFunc((sender)=>{
                    sender.active = false
                }))
                this.m_tAnimate[i].runAction(cc.sequence(acList))
            }
        }
    },
    onMain:function(){
        this.select(MISS_MAIN)
    },
    onDaiy:function(){
        this.select(MISS_DAIY)
    },
    onDone:function(){
        this.select(MISS_DONE)
    },
    onCloseClick:function(){
        this.onBack()
    },
    onHeroChange:function(sender){
        var tmpData = this.m_tGiftSub[sender.target.groupType][sender.target.groupIndex]
        if (tmpData.data.isActive){
        }else{
            if (tmpData.has == GIFT_DONE){
                Gm.taskNet.sendTaskActiveReceive(tmpData.data.id)
            }else if(tmpData.has == GIFT_NONE){
                Gm.award({award:tmpData.data.reward})
            }else{
                Gm.floating(Ls.get(40007))
            }
        }
    },
    getCellFrame:function(value){
        if (this.cellFrame[value]){
            return this.cellFrame[value]
        }else{
            return this.cellFrame[0]
        }
    },
    clearTime(){
        if (this.interval != null){
            clearInterval(this.interval)
            this.interval = null
        }
    },
    addTimes:function(){
        this.clearTime()
        this.updateRefreshTime()
        this.interval = setInterval(function(){
            this.updateRefreshTime()
        }.bind(this),1000)
    },
    updateRefreshTime:function(){
        if (this.m_oTimeNode.active){
            var tmpDaily = Gm.missionData.getDailyTime(this.selectType)
            if (tmpDaily == 0){
                this.m_oTravelTime.string = Func.timeToTSFM(0)
                Gm.missionData.dailyClearTime = 0
                Gm.taskNet.sendTaskList()
            }else if(tmpDaily > 0){
                this.m_oTravelTime.string = Func.timeToTSFM(tmpDaily)
            }
        }
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
});

