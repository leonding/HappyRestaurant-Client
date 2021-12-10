var BaseView = require("BaseView")
const ACTIVE_ID = 3001
// SportsMissionView

const GIFT_NONE = 0
const GIFT_DONE = 1
const GIFT_HAVE = 2
const REDUCEVALUE = 0
cc.Class({
    extends: BaseView,

    properties: {
        itemPerfab1: cc.Prefab,
        scrollView1: cc.ScrollView,

        m_oTravelTime:cc.Label,
        m_oActiveNode:cc.Node,
        m_oGiftPerFab:cc.Node,
        m_oDailyBar:cc.ProgressBar,
        m_oDailyBox:cc.Node,
        m_oPowerLab:cc.Label,

        m_oBoxPre:cc.Prefab,

        selectType:0,
        cellFrame:{
            default: [],
            type: cc.SpriteFrame,
        },
    },
    onLoad(){
        this._super()
    },
    createDaily(){
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

        var tmpData = Gm.config.getAllianceTaskActiveConfig()
        this.m_tGiftSub = []
        this.m_iDailyMax = 0
        this.m_iWeekyMax = 0
        for(const i in tmpData){
            if(tmpData[i].type == 3){
                var tmpIdx = tmpData[i].id
                var item = cc.instantiate(this.m_oGiftPerFab)
                var tmpBox = cc.instantiate(this.m_oBoxPre)
                tmpBox.parent = item
                item.groupIndex = tmpIdx

                
                this.m_oDailyBox.addChild(item)
                if (tmpData[i].active > this.m_iDailyMax){
                    this.m_iDailyMax = tmpData[i].active
                }
                
                this.m_tGiftSub[tmpIdx] = {node:item,ani:tmpBox,data:tmpData[i],has:false}
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
        if(args){
            //进度
            this.createDaily()
            this.selectType = 0
            this.data = {}

            Gm.unionNet.sportsTaskInfo()
        }
    },
    register:function(){
        this.events[Events.SPORTS_MISSION_UPDATE] = this.updateList.bind(this)
    },
    updateList:function(){
        var tmpList = Gm.unionData.getSportsMissionData()
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
            var tmpScroll = this.scrollView1
            var tmpItem = this.itemPerfab1
                
            this.updateDaily(tmpList)
            this.scrollView1.scrollToOffset(cc.v2(0, 0),0)
            
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
                    item.scale = 0
                    tmpScroll.content.addChild(item)
                    var tmpSpt = item.getComponent("SportsMissionCell")
                    tmpSpt.setOwner(this,tmpData.data)
                    tmpSpt.updateMission(tmpData.rate)
                    this.items.push(tmpSpt)
                    return item
                }.bind(this))
            }
        }
        //时间
        // this.data.time = Gm.unionData.getSportsMissionTime()
        // this.addTimes();
    },
    updateDaily:function(data){
        if (data){
            this.m_oDailyBar.node.active = true
            this.updateRefreshTime()
            var tmpTotal = 0
            var tmpPowerNow = Gm.unionData.getSportsMissionPoints()
            // for(const i in data){
            //     if (data[i].rate == -1){
            //         tmpPowerNow = tmpPowerNow + data[i].data.active
            //     }
            // }
            var tmpBarWid = 0
           
            tmpTotal = this.m_iDailyMax
            tmpBarWid = this.m_oDailyBox.width
            this.m_oDailyBox.active = true
            

          
            for(const i in this.m_tGiftSub){
                var tmpOne = this.m_tGiftSub[i]
                tmpOne.node.active = true
                if (tmpOne.data.isActive){
                    if (!Gm.unionData.activeAtyOpen){
                        tmpOne.node.active = false
                        tmpOne.has = GIFT_NONE
                        break
                    }
                }
                var tmpActive = tmpOne.data.active
                tmpOne.node.x = ((tmpActive-REDUCEVALUE)/(tmpTotal-REDUCEVALUE))*tmpBarWid
                if (tmpPowerNow >= tmpActive){
                    if (Gm.unionData.isActiveRece(tmpOne.data.id)){
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
            this.m_oDailyBar.progress = (tmpPowerNow-REDUCEVALUE)/(tmpTotal-REDUCEVALUE)
            var tmpNow = checkint(this.m_oPowerLab.string)
            this.m_oPowerLab.string = ""+tmpPowerNow
            if (Gm.unionNet.m_iGetId){
                this.giftAnimate()
            }
        }
        else{
            this.m_oDailyBar.node.active = false
        }
    },
    giftAnimate:function(){
        var pos = null
        if (Gm.unionNet.m_iGetId){
            for(const i in this.items){
                if (this.items[i].m_oData.id == Gm.unionNet.m_iGetId){
                    pos = this.m_oActiveNode.convertToNodeSpaceAR(this.items[i].m_oGiftNode.convertToWorldSpaceAR(cc.v2(0,0)))
                    break
                }
            }
            Gm.unionNet.m_iGetId = null
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
    onCloseClick:function(){
        this.onBack()
    },
    onHeroChange:function(sender){
        var tmpData = this.m_tGiftSub[sender.target.groupIndex]
        if (tmpData.data.isActive){
        }else{
            if (tmpData.has == GIFT_DONE){
                Gm.unionNet.sportsTaskActiveReward(tmpData.data.id)
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
        // if (this.interval != null){
        //     clearInterval(this.interval)
        //     this.interval = null
        // }
    },
    addTimes:function(){
        // this.clearTime()
        // this.updateRefreshTime()
        // this.interval = setInterval(function(){
        //     this.updateRefreshTime()
        // }.bind(this),1000)
    },
    updateRefreshTime:function(){
        // if (this.m_oTimeNode.active){
        //     var tmpDaily = (this.data.time - Gm.userData.getTime_m())/1000
        //     if (tmpDaily == 0){
        //         this.m_oTravelTime.string = Func.timeToTSFM(0)
        //         Gm.unionData.dailyClearTime = 0
        //         Gm.unionNet.sportsTaskInfo()
        //     }else if(tmpDaily > 0){
        //         this.m_oTravelTime.string = Func.timeToTSFM(tmpDaily)
        //     }
        // }
    },
    onDestroy(){
        this.clearTime()
        this._super()
    },
});

