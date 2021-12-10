var BaseView = require("BaseView")
const box_frame = [0,0,1,2,2]
cc.Class({
    extends: BaseView,
    properties: {
        itemPre:cc.Prefab,
        weekSignPre: cc.Node,
        leftListBtns:{
            default: [],
            type: cc.Node,
        },
        groupBtns:{
            default: [],
            type: cc.Node,
        },
        topBoxList:{
            default: [],
            type: cc.Node,
        },
        proBar:cc.ProgressBar,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        currLab:cc.Label,
        timeLab:cc.Label,
        weekItemNode1:cc.Node,
        weekItemNode2:cc.Node,
        weekBtn:cc.Button,
        weekSpr:cc.Sprite,

        m_oBoxPre:cc.Prefab,
        m_oBoxFrame: {
            default: [],
            type: cc.SpriteFrame
        },
    },
    onLoad:function(){
        this._super()
        this.selectType = -1
        this.groupType = -1

        for (let index = 0; index < this.leftListBtns.length; index++) {
            const v = this.leftListBtns[index];
            Gm.red.add(v, "weekSign" + (index+1) ,"all")    
        }
        Gm.red.add(this.weekBtn.node,"weekSignAward",0)

        this.m_tBoxFab = []
        for(const i in this.topBoxList){
            Gm.red.add(this.topBoxList[i],"weekSignAward",checkint(i)+1)
            var tmpBox = cc.instantiate(this.m_oBoxPre)
            tmpBox.parent = this.topBoxList[i]
            // var tmpSprite = tmpBox.getChildByName("box").getComponent(cc.Sprite)
            // tmpSprite.spriteFrame = this.m_oBoxFrame[box_frame[i]]
            this.m_tBoxFab.push(tmpBox.getComponent(cc.Animation))
        }
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            if (this.selectType == -1 ){
                this.select(Gm.signData.weekSign.openSignDay-1)
            }
            this.updateBoxData()
    
            var list = Func.itemSplit( Gm.config.getConst("week_sign_reward"))
            for (let index = 0; index < 2; index++) {
                this.itemSp = Gm.ui.getNewItem(this["weekItemNode" + (index +1)])
                this.itemSp.setData(list[index])
                // var dd = list[index]
                // if(dd.type == ConstPb.itemType.EQUIP){
                //     this.itemSp.updateEquip({baseId:dd.id})
                // }else{
                //     this.itemSp.updateItem({baseId:dd.id,count:dd.num})
                // }
            }
            this.updateWekkBtnState()
            this.schedule(function(){
                this.timeLab.string = Ls.get(200015) + Gm.signData.getWeekSignTimeStr()
            },1)
        }
    },
    select:function(type){
        if (this.selectType != type){
            this.selectType = type
            Gm.audio.playEffect("music/06_page_tap")
            for (const key in this.leftListBtns) {
                const v = this.leftListBtns[key];
                var isSelect = key == type
                
                v.getChildByName("defSpr").active = !isSelect
                v.getChildByName("selectSpr").active = isSelect
            }
            this.updateGroupBtnName()
        }
    },
    updateGroupBtnName(){
        this.wsConf = Gm.config.getWeekSign(this.selectType+1)
        for (let index = 0; index < this.wsConf.groupNum.length; index++) {
            const v = this.wsConf.groupNum[index];
            var taskConf = Gm.config.getWeekSignTask(v)
            var btnLab = this.groupBtns[index].getChildByName("Label").getComponent(cc.Label)
            btnLab.string = taskConf[0].groupName
            Gm.red.remove( this.groupBtns[index])
            Gm.red.add( this.groupBtns[index], "weekSign" + (this.selectType+1) ,index)
        }
        this.selectGroup(0,true)
    },
    selectGroup:function(type,flag){
        if (this.groupType != type || flag){
            this.groupType = type
            for (const key in this.groupBtns) {
                const v = this.groupBtns[key];
                var isSelect = key == type
                v.getChildByName("defSpr").active = !isSelect
                v.getChildByName("selectSpr").active = isSelect
                if (isSelect){
                    v.getChildByName("Label").color = new cc.Color(132,22,0)
                }else{
                    v.getChildByName("Label").color = new cc.Color(255,255,255)
                }
            }
            this.updateGroup()
        }
    },
    
    updateGroup(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getWeekSignTask(this.wsConf.groupNum[this.groupType])
        var itemHeight= 0
        this.weekSigns = []
        var getTaskState = function(task){
            var state = 1
            if (Gm.signData.getReceiveTaskId(task.taskId)){
                state = 2
            }else{
                var ddKay = "rate"
                if (task.type==1){
                    ddKay = "value"
                }
                if (Gm.signData.getRateByTaskType(task.type) >= task[ddKay] || task.type == 31){
                    state = 0
                }
            }
            return state
        }
        list.sort(function(a,b){
            var aState = getTaskState(a)
            var bState = getTaskState(b)
            if (aState == bState){
                return a.taskId - b.taskId
            }
            return aState-bState
        })
        
        for (let index = 0; index < list.length; index++) {
            var item = cc.instantiate(this.weekSignPre)
            item.active = true
            itemHeight = item.height
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("WeekSignItem")
            itemSp.updateSign(list[index],this)
            this.weekSigns.push(itemSp)
        }
        this.scrollView.content.height = list.length * (itemHeight+5)
    },
    updateBoxData(){
        var conf = Gm.config.getConfig("WeekSignSpeedConfig")
        var curr = Gm.signData.weekSign.boxRate
        var sum = conf[conf.length-1].complete
        
        this.proBar.progress =curr/sum

        this.currLab.string = cc.js.formatStr(Ls.get(200014),curr,sum)  
        this.timeLab.string = Ls.get(200015) + Gm.signData.getWeekSignTimeStr()

        for (let index = 0; index < this.topBoxList.length; index++) {
            const v = this.topBoxList[index];
            var confItem = conf[index]
            var tmpAni = curr>=confItem.complete && !Gm.signData.wsReceiveBoxId(index+1)
            // if (tmpAni){
            //     this.m_tBoxFab[index].play("box_lizi")
            // }else{
            //     this.m_tBoxFab[index].play("box_none")
            // }
            // var guang = v.getChildByName("guang")
            // guang.active = 
            v.getChildByName("New Label").getComponent(cc.Label).string = confItem.complete
        }
    },
    onLeftBtnClick(sender,value){
       var value = checkint(value)
       if (value-1 > Gm.signData.weekSign.openSignDay){
           Gm.floating(Ls.get(200016))
           return
       }
        this.select(value-1)
    },
    onGroupBtnClick(sender,value){
        var value = checkint(value)
        this.selectGroup(value-1)
     },
    onTopBoxBtn:function(sender,value){
        value = checkint(value)

        if (Gm.signData.wsReceiveBoxId(value)){
            Gm.floating(Ls.get(200017))
            return
        }

        var countData = Gm.config.getWeekSignSpeed(value)
        if (Gm.signData.weekSign.boxRate >= countData.complete){
            Gm.signNet.wsReward(2,value)
            return
        }
        Gm.award({award:countData.reward})
    },
    onWeekOkBtnClick(){
        Gm.signNet.wsReward(3,0)
    },
    register:function(){
        this.events[MSGCode.OP_RECEIVE_WSREWARD_S] = this.onUpdateItem.bind(this)
        this.events[MSGCode.OP_SYNC_WEEK_SIGN_INFO_S] = this.onNetSYNCWeekSign.bind(this)
    },
    onNetSYNCWeekSign(args){
        if (this.selectType == Gm.signData.weekSign.openSignDay-1){
            this.selectType = -1
            this.select(Gm.signData.weekSign.openSignDay-1)
            this.updateWekkBtnState()
            this.updateBoxData()
        }
    },
    onUpdateItem:function(args){
        this.updateBoxData()
        this.updateGroup()
        if (args.rewardType == 3){
            this.updateWekkBtnState()
        }
    },
    updateWekkBtnState(){
        this.weekBtn.interactable = Gm.signData.getRateByTaskType(12) == 7 && !Gm.signData.weekSign.isReceive7
        var lab = this.weekSpr.node.getChildByName("Label").getComponent(cc.Label)
        var picPath = "rw_btn_g"
        lab.string = cc.js.formatStr(Ls.get(200029),Gm.signData.getRateByTaskType(12))
        if (Gm.signData.weekSign.isReceive7){
            picPath = "ck/ck_btn_sv"
            lab.string = Ls.get(200018)

        }else if (Gm.signData.getRateByTaskType(12) == 7){
            picPath = "newdialog/new_dialog_btn_4"
            lab.string = Ls.get(200010)
        }
       
        Gm.load.loadSpriteFrame("texture/" + picPath,function(sp,sf){
            sf.spriteFrame = sp
            sf.node.width = 100
            sf.node.height = 40
        },this.weekSpr)
    },
    getWeekItem(taskType){
        for (const key in this.weekSigns) {
            const v = this.weekSigns[key];
            if (v.data.type == taskType || v.data.taskId == taskType){
                return v
            }
        }
        return null
    },
    
});

