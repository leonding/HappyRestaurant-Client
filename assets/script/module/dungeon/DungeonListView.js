var BaseView = require("BaseView")
const box_frame = [0,0,1,2,2]
cc.Class({
    extends: BaseView,
    properties: {
        DungeonListItem: cc.Node,
        scrollView: {
        	default: null,
        	type: cc.ScrollView
        },
        freeNumLab:cc.RichText,
        proBar:cc.ProgressBar,
        topBoxList:{
            default: [],
            type: cc.Node,
        },
        m_oBoxPre:cc.Prefab,
        m_oBoxFrame: {
            default: [],
            type: cc.SpriteFrame
        },
        sdBtn:cc.Button,
    },
    onLoad () {
        this._super()
        this.m_tBoxFab = []
        for(const i in this.topBoxList){
            var tmpBox = cc.instantiate(this.m_oBoxPre)
            tmpBox.parent = this.topBoxList[i]
            tmpBox.zIndex = -1
            this.m_tBoxFab.push(tmpBox)
        }
    },
    onBack(){
        this._super()
    },
    onEnable(){
        this._super()
    },
    enableUpdateView(args){
        if (args){
            this.dungeonConf = Gm.config.getDungeon(args.id)
            this.type = args.type //1单人， 2组队

            this.popupUI.setData({title:this.dungeonConf.name})
            this.updateList()
            this.onBattle()
            // this.updateNumLab()
        }
    },
    register:function(){
        this.events[MSGCode.OP_DUNGEON_BATTLE_S] = this.onBattle.bind(this)
        this.events[MSGCode.OP_DUNGEON_STAR_REWARD_S] = this.onBattle.bind(this)
        this.events[MSGCode.OP_DUNGEON_BUY_FIGHT_S] = this.onBattle.bind(this)
    },
    onBattle:function(args){
        var tjIndex = 0
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            v.updateBtn()
            if (v.tjNode.active){
                if (this.items[index-1]){
                    this.items[index-1].tjNode.active = false
                }
                tjIndex = index
            }
        }
        if (tjIndex >=2){
            Gm.ui.scrollOffset(this.scrollView,1)
        }else{
            this.scrollView.scrollToTop()
        }
        this.updateNumLab()
    },
    updateNumLab(){
        var colorStr = "<outline color=#000000 width=1><color=#FFF4DE>%s<color=#%s>%s</c></c></outline>"
        var count = Gm.dungeonData.getData(this.dungeonConf.id).fightCount
        var color = count==0?"FF0000":"BBFD7A"
        this.freeNumLab.string = cc.js.formatStr(colorStr,Ls.get(800163),color,count)

        var allSatr = Gm.dungeonData.getDungeonAllStar(this.dungeonConf.id)
        var awardConf = Gm.config.getDungeonStarRewardConfig(this.dungeonConf.id)
        for (let index = 0; index < this.topBoxList.length; index++) {
            var conf = awardConf[index]
            var boxNode = this.topBoxList[index]
            var lab = boxNode.getChildByName("rw_img_hyd3").getChildByName("New Label").getComponent(cc.Label)
            lab.string = "x" + conf.star
            var tmpAni = allSatr >= conf.star && !Gm.dungeonData.getHasStar(this.dungeonConf.id,conf.star)

            var item = this.m_tBoxFab[index]
            var itemAni = item.getComponent(cc.Animation)
            if (tmpAni){
                itemAni.play("box_lizi")
            }else{
                itemAni.play("box_none")
            }
            var isHas = Gm.dungeonData.getHasStar(this.dungeonConf.id,conf.star)
            item.getChildByName("box").getChildByName("prop_bx_jk").active = isHas
            item.getChildByName("box").getChildByName("prop_bx_j").active = !isHas
            
        }
        this.proBar.progress = allSatr/awardConf[awardConf.length-1].star

        this.sdBtn.interactable = count>0 && this.getCanSdConf()
    },
    getCanSdConf(){
        var conf
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            if (v.starNum == 3){
                conf = v.data
            }
        }
        return conf
    },
    updateList:function(){
        Func.destroyChildren(this.scrollView.content)
        var list = Gm.config.getDungeonGroups(this.dungeonConf.id)
        this.items = []
        for (let index = 0; index < list.length; index++) {
            const itemData = list[index];
            var item = cc.instantiate(this.DungeonListItem)
            item.active = true
            this.scrollView.content.addChild(item)
            var itemSp = item.getComponent("DungeonListItem")
            itemData.name = this.dungeonConf.name
            itemSp.setData(itemData,this)
            this.items.push(itemSp)
        }

        if (this.items[this.items.length-1].unlockNode.active == false){
            this.scrollView.scrollToBottom()
        }else{
            this.scrollView.scrollToTop()
        }
    },
    isTeam(){
        return this.dungeonConf.type == 2 &&  this.type == 2
    },
    onRecordBtn(){
        Gm.dungeonNet.record(this.dungeonConf.id)
    },
    onAddBtn(){

    },
    onTopBoxClick(sender,value){
        value = checkint(value)
        var conf = Gm.config.getDungeonStarRewardConfig(this.dungeonConf.id,value-1)
        if (Gm.dungeonData.getHasStar(this.dungeonConf.id,conf.star)){
            Gm.floating(Ls.get(200034))
            return
        }
        var allSatr = Gm.dungeonData.getDungeonAllStar(this.dungeonConf.id)
        if (allSatr >= conf.star){
            Gm.dungeonNet.boxReward(this.dungeonConf.id,conf.star)
            return
        }
        Gm.audio.playEffect("music/02_popup_open")
        Gm.award({award:conf.reward})
    },
    onOneSdClick(){
        var conf = this.getCanSdConf()
        var count = Gm.dungeonData.getData(this.dungeonConf.id).fightCount

        if (Gm.userData.isHintDay("dungeonSd")){
            Gm.dungeonNet.battle(conf.dungeonId,conf.mode,1,[],true)
            return
        }
        Gm.box({msg:cc.js.formatStr(Ls.get(7400002),conf.des,count),showToggle:true},(btnType,isToggle)=>{
            if (btnType == 1){
                if (isToggle){
                    Gm.userData.setHintDay("dungeonSd")
                }

                Gm.dungeonNet.battle(conf.dungeonId,conf.mode,1,[],true)
            }
        })
    },
    getSceneData:function(){
        return {id:this.dungeonConf.id,type:this.type}
    },
});

