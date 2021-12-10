
cc.Class({
    extends: cc.Component,

    properties: {
        index:1,
        timeLab:cc.Label,
        hNode:cc.Node,
        mNode:cc.Node,
        hLab:cc.Label,
        mLab:cc.Label,
        btnSpr:cc.Sprite,
        btnLab:cc.Label,
    },
    setDef(){
        this.editTime =  Gm.unionData.getOpenTime(this.index-1)
        if (this.editTime > 0){
            this.editTime  = this.editTime /1000
        }
    },
    updateView(isEidt){
        this.edit = isEidt
        this.timeLab.node.active = !this.edit
        this.hNode.active = this.edit
        this.mNode.active = this.edit
        var time = this.editTime
        if (this.edit){
            this.h = 1
            this.m = 0
            if (time > 0 ){
                var dd = Func.timeToBossTime(time)
                this.h = checkint(dd.h)
                this.m = checkint(dd.m)
            }
            this.updateHm()
            this.btnLab.string = Ls.get(800005)
            this.loadBtnSpr("bt_yl4")
        }else{
            if(time > 0 ){
                var conf = Gm.config.getUnionBoss(Gm.unionData.info.level)
                this.timeLab.string = Func.timeToTSFM(time,true) + "--" + Func.timeToTSFM(time+conf.closeTime,true)
            }else{
                this.timeLab.string = Ls.get(800006)
            }
            this.btnLab.string = Ls.get(800007)
            this.loadBtnSpr("bt_yl3")
        }
    },
    loadBtnSpr(sprName){
        if (this.sprName == sprName){
            return
        }
        this.sprName = sprName
        Gm.load.loadSpriteFrame("texture/travel/"+sprName,function(sp,icon){
            icon.spriteFrame = sp
        },this.btnSpr)
    },
    upBtn(sender,value){
        if (checkint(value) == 1){
            this.h = this.h + 1
            if (this.h > 22){
                this.h = 1
            }
        }else{
            this.m = this.m + 5
            if (this.m > 55){
                this.m = 0
            }
        }
        this.updateHm()
    },
    donwBtn(sender,value){
        if (checkint(value) == 1){
            this.h = this.h - 1
            if (this.h < 1){
                this.h = 22
            }
        }else{
            this.m = this.m - 5
            if (this.m < 0){
                this.m = 55
            }
        }
        this.updateHm()
    },
    updateHm(){
        this.hLab.string = Func.addZero(this.h)
        this.mLab.string = Func.addZero(this.m)
        this.editTime = (this.h*60+this.m)*60
    },
    getEditTime(){
        return  this.editTime*1000
    },
    onBtnClick(){
        if (!this.edit){
            this.updateView(true)
        }else{
            this.editTime = 0
            this.h = 0 
            this.m = 0
            this.updateView(false)
        }
    },
});
