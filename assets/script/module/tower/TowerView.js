cc.Class({
    extends: require("BaseView"),

    properties: {
        titleLab:cc.Label,
        towerItemPre:cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        boxBtn:cc.Node,
        timeLab:cc.Label,
    },
    enableUpdateView(args){
        if (args){
            this.unscheduleAllCallbacks()
            Gm.audio.playEffect("music/02_popup_open")
            this.towerConf = args
            this.titleLab.string = this.towerConf.name
            this.towerType = args.group
            this.towerData = Gm.towerData.getTowerByType(args.group)
            if (this.towerData.towerType == 0){
                this.boxBtn.active = true
                Gm.red.add(this.boxBtn,"towerBox","all")
                this.addUpdateTime()
            }
            this.updateView()
        }
    },
    updateTime(){
        if (!this.boxBtn.active){
            return
        }
        // this.timeLab.node.parent.active = Gm.towerData.isBoxCanReceive()
        this.timeLab.string = Func.timeToTSFM(Gm.userData.getDayEnd()/1000)
    },
    register:function(){
        this.events[Events.TOWER_UPDATE] = this.updateView.bind(this)
    },
    updateView:function(){
        var towerNum = this.towerData.num

        var maxNum = TowerFunc.getMaxNum()

        var minId
        var maxId
        var showBottom = false

        var showMaxNum = Math.ceil(this.scrollView.node.height/this.towerItemPre.height)
        if (towerNum ==0){
            minId = 1
            maxId = showMaxNum
            showBottom = true
        }else if (towerNum == maxNum){
            minId = Math.max(1,towerNum-2)
            maxId = maxNum
            
        }else{
            minId = Math.max(1,towerNum-1)
            maxId = Math.min(maxNum,towerNum + 3)
            if (towerNum == 1 && showMaxNum == 4){
                showBottom = true
            }
        }

        Func.destroyChildren(this.scrollView.content)
       
        var yunNum = 0

        for (let index = maxId; index >= minId; index--) {
            var item = cc.instantiate(this.towerItemPre)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("TowerItem")
            itemSp.setData(index,this.towerData.towerType)
            if (itemSp.yunNode.active){
                yunNum = yunNum + 1
            }
        }
        this.scrollView.scrollToTop()
        if (showBottom){
            this.scrollView.scrollToBottom()
        }else{
            if(yunNum == 2 && towerNum != 0){
                this.scrollView.content.y = this.towerItemPre.height
            }
        }

    },
    onRankBtn(){
        Gm.ui.jump(3002)
    },
    onBoxClick(){
        Gm.ui.create("TowerBoxView")
    },
    getSceneData:function(){
        return this.towerConf
    },
});

