var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        nodes:cc.Node,
        btn:cc.Button,
        btnLab:cc.Label,
        descLab:cc.Label,
        timeLab:cc.Label,
    },
    enableUpdateView(){
        this._super()
        this.updateView()
        this.addUpdateTime()
    },
    updateTime(){
        this.timeLab.string = Func.timeToTSFM(Gm.userData.getDayEnd()/1000)
    },
    register:function(){
        this.events[MSGCode.OP_TOWER_REWARD_S] = this.updateBtn.bind(this)
    },
    updateView(){
        // var conf = Gm.config.getTower(TowerFunc.getTowerBoxId(this.openData.towerId))
        // var rewards = conf.scheduledReward
        // for (let index = 0; index < rewards.length; index++) {
        //     const v = rewards[index];
        //     var item = Gm.ui.getNewItem(this.nodes)
        //     item.setData(v)
        // }
        var towerData = Gm.towerData.getTowerByType(0)
        this.descLab.string = cc.js.formatStr(Ls.get(7000011),towerData.num,TowerFunc.getTowerBoxId(towerData.num))
        this.updateBtn()
    },
    updateBtn(){
        this.btn.interactable = Gm.towerData.isBoxCanReceive()
    },
    onClick(){
        Gm.battleNet.towerReceive(Gm.towerData.rewardIds[0])
    },
});

