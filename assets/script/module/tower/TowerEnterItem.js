cc.Class({
    extends: cc.Component,

    properties: {
        nameLab:cc.Label,
        openTimeLab:cc.RichText,
        numLab:cc.Label,
        lockNode:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        this.nameLab.string = this.data.name

        this.updateView()

        if (this.node.redNode == null){
            Gm.red.add(this.node,"tower",this.data.group)
            if (this.data.group == 0){
                Gm.red.add(this.node,"towerBox","all")
            }
        }
    },
    updateView(){
        this.lockNode.active = !this.isUnlock()

        this.numLab.string = cc.js.formatStr(Ls.get(5337),Math.min(TowerFunc.getMaxNum(),Gm.towerData.getNumByType(this.data.group)+1))

        if (this.openTimeLab == null){
            return
        }
        this.openTimeLab.string = this.data.day


        if(TowerFunc.isTimeOpen(this.data.clientOpenTime)){
            this.openTimeLab.string = Ls.get(5338)
        }else{
            // var monthStr = ""
            // if(this.data.clientOpenTime[0].type == 0){
            //     monthStr = "周"
            // }else if (this.data.clientOpenTime[0].type == 1){
            //     monthStr = "月"
            // }

            // var str = cc.js.formatStr("<color=#000000>%s%s</c>",monthStr,"%s开放")
            // var dayStr = ""
            // for (let index = 0; index < this.data.clientOpenTime.length; index++) {
            //     const v = this.data.clientOpenTime[index];
            //     if (dayStr != ""){
            //         dayStr = dayStr + "/"
            //     }
            //     dayStr = dayStr + v.arg
            // }
            // dayStr = cc.js.formatStr("<color=#ffffff>%s</c>",dayStr)
            // this.openTimeLab.string = cc.js.formatStr(str,dayStr)
        }
    },
    onClick(){
        if (!this.isUnlock(true)){
            return
        }
        if (TowerFunc.isTimeOpen(this.data.clientOpenTime)){
            Gm.towerData.redClick(this.data.group)
            Gm.ui.create("TowerView",this.data)
        }else{
            Gm.floating(Ls.get(5339))
        }
    },
    isUnlock(isPrint){
        
        if (Gm.userInfo.maxMapId > this.data.unlockCondition){
            return true
        }
        if (isPrint){
            var mapConf = Gm.config.getMapById(this.data.unlockCondition)
            Gm.floating(cc.js.formatStr( Ls.get(5340),mapConf.mapName))
        }
        return false
    },
});
