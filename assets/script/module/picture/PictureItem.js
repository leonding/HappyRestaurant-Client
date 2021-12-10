cc.Class({
    extends: cc.Component,

    properties: {
        iconSpr:cc.Sprite,
        eventIconSpr:cc.Sprite,
        bar:cc.ProgressBar,
        barLab:cc.Label,
    },
    setData:function(posData,eventGroupId,data,owner,posIndex){
        this.posIndex = posIndex
        this.node.active = true
        this.owner = owner
        this.posData = posData
        this.eventGroupId = eventGroupId
        this.data = data

        this.node.width = posData.pictureW
        this.node.height = posData.pictureH
        this.node.x = posData.pictureX
        this.node.y = posData.pictureY
        this.iconSpr.node.active = true

        this.loadBg(posData.iconFile)

        this.bar.node.scale = posData.pictureW/210

        if (this.owner.conf.type == 3){
            this.bar.node.y = -70
            this.barLab.node.y = -46
            this.barLab.node.x = -79
        }else if (this.owner.conf.type == 4){
            this.bar.node.y = -70
            this.barLab.node.y = -46
            this.barLab.node.x = -59
        }else if (this.owner.conf.type == 5){
            this.bar.node.y = -47
            this.barLab.node.y = -25
            this.barLab.node.x = -47
        }

        this.iconSpr.node.opacity = 255
        this.bar.node.active = false
        this.barLab.string = ""

        if (data == null){
            this.eventIconSpr.node.active = false
            return
        }
        
        this.eventIconSpr.node.active = true
        this.eventConf = Gm.config.getPictureEvent(this.data.eventId)
        Gm.load.loadSpriteFrame("img/jigsaw/"+ this.eventConf.icon,(sp,sf)=>{
            sf.spriteFrame = sp
        },this.eventIconSpr)
        if(this.eventConf.type == 1 && data.heroInfo.length > 0){
            var hp = 0
            var totalHp = 0
            for (let index = 0; index < data.heroInfo.length; index++) {
                const v = data.heroInfo[index];
                hp = hp + v.hp
                totalHp = totalHp + v.maxHp
            }
            
            var p = 100
            if (totalHp != 0){
                p = Math.ceil(hp/totalHp*100)
            }
            if (p != 100){
                this.iconSpr.node.opacity = 255*0.7
                this.bar.node.active = true
                this.bar.progress = (100-p)/100
                this.barLab.string = 100-p + "%"
            }
        }

        this.node.active = this.data.isFinish == 0
    },
    loadBg(iconFile){
        if (this.lastIconFile == iconFile){
            return
        }
        this.lastIconFile = iconFile
        Gm.load.loadSpriteFrame("img/jigsaw/"+iconFile,(sp,sf)=>{
            sf.spriteFrame = sp
            sf.node.x = this.posData.iconX
            sf.node.y = this.posData.iconY
        },this.iconSpr)
    },
    onClick(){
        if (this.owner.isPast){
            Gm.floating(Ls.get(5223))
            return
        }
        if (this.owner.isLock){
            Gm.floating(2329)
            return
        }
        if (this.data.isFinish == 1){
            Gm.floating(2328)
            return
        }
        if (!this.owner.isNowRow(this.posIndex)){
             Gm.floating(2338)
            return
        }
        PictureFunc.showEventType(Gm.pictureData.getNowId(this.owner.openData.treasure),this.data.stageId,this.owner.openData.treasure)
    },

});

