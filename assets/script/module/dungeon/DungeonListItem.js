
cc.Class({
    extends: cc.Component,
    properties: {
        itemParent:cc.Node,
        modeLab:cc.Label,
        btn:cc.Button,
        btnLab:cc.Label,
        diamondNode:cc.Node,
        unlockNode:cc.Node,
        unlockLab:cc.Label,
        tjNode:cc.Node,
        lastSpr:"button_btn_lv",
        startParentNode:cc.Node,
        starts:{
            default:[],
            type:cc.Sprite,
        },
        starSf:cc.SpriteFrame,
        starSf1:cc.SpriteFrame
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        this.modeLab.string = data.des
        this.modeLab.node.color = this.getModeColor()
        // this.updateBtn()

        for (let index = 0; index < data.oneReward.length; index++) {
            const v = data.oneReward[index];
            var itemBase = Gm.ui.getNewItem(this.itemParent)
            itemBase.setData(v)
            itemBase.node.scale = 100/itemBase.node.width
        }
    },
    getModeColor(){
        switch(this.data.mode){
            case 1:
                return cc.color(255,255,255)
            case 2:
                return cc.color(128,245,255)
            case 3:
                return cc.color(249,255,183)
            case 4:
                return cc.color(255,184,121)
            case 5:
                return cc.color(255,93,181)

        }
    },
    updateBtn(){
        var spr = "button_btn_lv"
        
        this.btnLab.string = Ls.get(1207)
        var dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.mode)
        this.starNum = 0
        if (dataMode){
            for (let index = 0; index < dataMode.star.length; index++) {
                if (dataMode.star[index] > 0){
                    this.starNum = this.starNum + 1
                }
            }
            for (let index = 0; index < this.starts.length; index++) {
                const v = this.starts[index];
                if (index < this.starNum){
                    v.spriteFrame = this.starSf
                }else{
                    v.spriteFrame = this.starSf1
                }
            }
            if (this.starNum == 3){
                this.btnLab.string = Ls.get(1208)
                spr = "button_btn_hua2"
            }
        }
        this.changeBtnSpr(spr)
        this.btn.interactable = true
        var dd = Gm.dungeonData.getData(this.data.dungeonId)
        if(dd.fightCount == 0){
            // this.btnLab.string = Ls.get(1007)
            var cost = Gm.config.buy(dd.buyFightCount+1).buyDungeonCost
            this.btnLab.string = cost + (this.starNum == 3?Ls.get(1208):Ls.get(1207)) 

            this.btnLab.node.x = 17
            this.diamondNode.active = true

            var config = Gm.config.getDungeon(this.data.dungeonId)
            if (!config.canBuyFight || dd.buyFightCount == Gm.config.getVip().dungeonBuyCount){
                this.btn.interactable = false
            }
        }else{
            this.diamondNode.active = false
            this.btnLab.node.x = 0
        }

        this.unlockNode.active = false
        this.unlockLab.string = ""

        if(Gm.userInfo.maxMapId >= this.data.openLevel){
            if (this.data.frontMode > 0){
                var frontConf = Gm.config.getDungeonInfo(this.data.dungeonId,this.data.frontMode)
                var dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.frontMode)
                if (dataMode == null){
                    this.unlockNode.active = true
                    this.unlockLab.string =  cc.js.formatStr( Ls.get(5279),frontConf.des)
                }
            }
        }else{
            this.unlockNode.active = true
            var mapConf = Gm.config.getMapById(this.data.openLevel)
            this.unlockLab.string =  cc.js.formatStr( Ls.get(5280),mapConf.mapName)
        }
        
        this.tjNode.active = !this.unlockNode.active
        if (this.unlockNode.active){
            this.btn.interactable = false    
        }
    },
    changeBtnSpr(spr){
        if (this.lastSpr == spr){
            return
        }
        this.lastSpr = spr
        var spt = this.btn.node.getChildByName("Background").getComponent(cc.Sprite)
        Gm.load.loadSpriteFrame("img/button/"+this.lastSpr,(sp)=>{
            spt.spriteFrame = sp
        })
    },
    onClick1(){
        cc.log("onClick1")
        var dd = Gm.dungeonData.getData(this.data.dungeonId)
        if (dd.fightCount == 0){
            var config = Gm.config.getDungeon(this.data.dungeonId)
            if (!config.canBuyFight || dd.buyFightCount == Gm.config.getVip().dungeonBuyCount){
                Gm.floating(90004)
                return
            }
            var cost = Gm.config.buy(dd.buyFightCount+1).buyDungeonCost

            if (Gm.userData.isHintDay("dungeonBuy")){
                if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:cost})){
                    Gm.dungeonNet.buyFight(this.data.dungeonId,1,this.data.mode)
                }
                return
            }
            var str = "1245"
            Gm.box({msg:cc.js.formatStr(Ls.get(str),cost),showToggle:true},(btnType,isToggle)=>{
                if (btnType == 1){
                    if (isToggle){
                        Gm.userData.setHintDay("dungeonBuy")
                    }
                    if (Gm.userInfo.checkCurrencyNum({attrId:ConstPb.playerAttr.GOLD,num:cost})){
                        Gm.dungeonNet.buyFight(this.data.dungeonId,1,this.data.mode)
                    }
                }
            })
            return
        }
       
        var dungeonType = 1
        var dataMode = Gm.dungeonData.getDataByMode(this.data.dungeonId,this.data.mode)
        if (dataMode && this.starNum == 3){
            Gm.dungeonNet.battle(this.data.dungeonId,this.data.mode,dungeonType,[])
            return
        }
        Gm.audio.playEffect("music/06_page_tap")
        Gm.ui.create("FightTeamView",{type:ConstPb.lineHero.LINE_DUNGEON,dungeonType:dungeonType,dungeonId:this.data.dungeonId,mode:this.data.mode})
    },
    onStartBtn(sender){
        DungeonFunc.starTips(this.data,sender.touch._point)
    },
});


