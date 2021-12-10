
cc.Class({
    extends: cc.Component,
    properties: {
        bgSpr:cc.Sprite,
        nameLab:cc.Label,
        lockNode:cc.Node,
        starts:{
            default:[],
            type:cc.Sprite,
        },
        maskNode:cc.Sprite,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        this.nameLab.string = data.des

        this.isBoss = data.mode%3==0?1:0
        this.bgSpr.spriteFrame = this.owner.cellBgFrame[this.isBoss]
        this.maskNode.spriteFrame = this.owner.cellMaskFrame[this.isBoss]
        this.updateStar()
    },
    updateStar(isEnd){
        var dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.mode)

        this.starNum = 0
        if (dataMode){
            for (var i = 0; i < dataMode.star.length; i++) {
                if (dataMode.star[i] > 0){
                    this.starNum = this.starNum + 1
                }
            }
        }
        
        for (let index = 0; index < this.starts.length; index++) {
            const v = this.starts[index];
            var i = (index < this.starNum)?1:0
            v.spriteFrame = this.owner.cellStarFrame[i]
            v.node.active = true
        }
        if (isEnd && this.starNum > 0){
            Gm.dungeonData.setBattleMode(this.owner.dungeonConf.id)
        }
        this.lockNode.active = false
        if (this.data.frontMode > 0){
            var frontConf = Gm.config.getDungeonInfo(this.data.dungeonId,this.data.frontMode)
            dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.frontMode)
            if (dataMode == null){
                this.lockNode.active = true
            }
        }
        this.maskNode.node.active = this.lockNode.active
    },
    updateBattleMode(){

    },
    onClick1(){
        cc.log("onClick1",this.data)
        if (this.lockNode.active){
            cc.log(Gm.config.getDungeonInfo(this.data.dungeonId,this.data.frontMode))
            Gm.floating(cc.js.formatStr( Ls.get(5279),Gm.config.getDungeonInfo(this.data.dungeonId,this.data.frontMode).des))
            return
        }
       
        var dungeonType = 1
        var dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.mode)
        if (dataMode && this.starNum == 3){
            return
        }
        Gm.audio.playEffect("music/06_page_tap")
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_DUNGEON,dungeonType:dungeonType,dungeonId:this.data.dungeonId,mode:this.data.mode})
    },
    onStartBtn(sender){
        DungeonFunc.starTips(this.data,sender.touch._point)
    },
});


