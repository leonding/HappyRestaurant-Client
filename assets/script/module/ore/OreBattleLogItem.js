//OreBattleLogItem
cc.Class({
    extends: cc.Component,
    properties: {
        headNode:cc.Node,
        nameLabel:cc.Label,
        
        headBgSprite:cc.Sprite,
        winSprite:cc.Node,

        timeLabel:cc.Label,
        battleBtn:cc.Node
    },
    setUI(data){
        this.logs = data
        this.setHeadNode()
        this.setTimeLabel()
    },
    setHeadNode(){
        if(this.logs.info){
            Func.newHead2(this.logs.info.head,this.headNode)
            this.nameLabel.string = this.logs.info.name
        }
        var picName = null
        if(this.logs.result == 1){
            this.winSprite.active = true
            this.battleBtn.active = false
            picName = "/img/shuijing/crystal_icon_victory_0"
        }
        else{
            this.winSprite.active = false
            this.battleBtn.active = true
            picName = "/img/shuijing/crystal_icon_fail_0"
        }
        Gm.load.loadSpriteFrame(picName,function(sp,icon){
            if(icon && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },this.headBgSprite)
    },
    setTimeLabel(){
        this.timeLabel.string = OreFunc.getBattleLogTimeStr((Gm.userData.getTime_m() -this.logs.time) / 1000)
    },
    onRecordBtnClick(){//播放录像
        Gm.oreNet.sendOreBattleDataLog(this.logs.key,this.logs)
    },
    onBattleBtnClick(){//挑战 进入到那个水晶的房间
        var oreData = Gm.oreData.getOreById(this.logs.id)
        if(oreData.info && oreData.info.playerId == this.logs.info.playerId){
            Gm.ui.create("OreMainInfo",{oreData:oreData})
        }
        else{
            var msg = cc.js.formatStr(Ls.get(7500074),this.logs.info.name)
            Gm.box({msg:msg},function(type){
                if(type == 1){
                    Gm.send(Events.ORE_ENTER_ROOM,oreData)
                    Gm.ui.removeByName("OreBattleLogView")
                }
            }.bind(this))
        }
    },
});