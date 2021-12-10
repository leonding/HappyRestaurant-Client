cc.Class({
    extends: cc.Component,
    properties: {
        musicSlider:cc.Slider,
        effectSlider:cc.Slider,

        pushBtns:{
            default:[],
            type:cc.Toggle,
        },
        battleBtns:{
            default:[],
            type:cc.Toggle,
        }
    },
    onEnable(){
        this.updateView()
    },
    updateView(){
        this.updateSliderProgress(this.musicSlider,Gm.userData.musicValue)
        this.updateSliderProgress(this.effectSlider,Gm.userData.volumeValue)
        this.updateBattleSet()

    },
    updateBattleSet(){
        this.battleBtns[0].isChecked = Boolean(Gm.userData.skillLihui)//立绘
        this.battleBtns[1].isChecked = Boolean(Gm.userData.battleText)//战斗文字
        this.battleBtns[2].isChecked = Boolean(Gm.userData.teamyoketip)//羁绊
        this.battleBtns[3].isChecked = Boolean(Gm.userData.showHeroLine)//阵容
        
        for(var i=0; i<this.battleBtns.length;i++){
            this.battleBtns[i].node.getChildByName("icon").x = this.battleBtns[i].isChecked?34:-34
        }
        this.pushBtns[0].isChecked = Boolean(Gm.userData.pushswitch)
        // this.pushBtns[1].isChecked = Boolean(Gm.userData.lotteryAwardGuide)
        // this.pushBtns[1].isChecked = Boolean(Gm.userData.arenaRank)
        // this.pushBtns[2].isChecked = Boolean(Gm.userData.sociatyBoss)
        // this.pushBtns[3].isChecked = Boolean(Gm.userData.privatechat)        
        for(var i=0; i<this.pushBtns.length;i++){
            this.pushBtns[i].node.getChildByName("icon").x = this.pushBtns[i].isChecked?34:-34
        }
    },
    onMusicBtn(sender){
        Gm.userData.updateMusic(sender.isChecked?1:0)
        if (sender.isChecked){
            Gm.audio.playEffect("music/Really Useful Game Hit 04")
        }
    },
    updateSliderProgress(slider,progress){
        slider.progress = progress
        var sliderWidth = this.musicSlider.node.width
        slider.node.getChildByName("Background").width = progress*sliderWidth
    },
    onSliderUpdate(sender,value){
        this.updateSliderProgress(sender,sender.progress)
        if (checkint(value) == 0){ //音乐
            Gm.userData.updateMusic(this.getFloat(sender.progress))
        }else if (checkint(value) == 1){//音效
            Gm.userData.updateVolume(this.getFloat(sender.progress))
        }
    },
    getFloat(num){
        return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
    },
    onToggleClick(sender,value){
        var icon = sender.node.getChildByName("icon")
        icon.x = sender.isChecked?34:-34
        if (sender.isChecked){
            Gm.audio.playEffect("music/03_popup_close")
        }else{
            Gm.audio.playEffect("music/02_popup_open")
        }
    },

    onSwitchServer(sender,value){
        Gm.ui.create("SelectServerView")
    },


    onSkillLiHuiClick(sender,value){
        Gm.userData.setSkillLihui(Number(sender.isChecked))
    },
    onBattleTextClick(sender,value){
        Gm.userData.setBattleText(Number(sender.isChecked))
    },
    onYokeTipsClick(sender,value){
        Gm.userData.setYokeTips(Number(sender.isChecked))
    },
    onShowHeroLineClick(sender,value){
        Gm.userData.setShowHeroLine(sender.isChecked)
    },
    onHangupAwardClick(sender,value){
        Gm.userData.setHangupAward(Number(sender.isChecked))
    },
    onArenaRankClick(sender,value){
        Gm.userData.setArenaRank(Number(sender.isChecked))
    },
    onSociatyBossClick(sender,value){
        Gm.userData.setSociatyBoss(Number(sender.isChecked))
    },
    onPrivateChatClick(sender,value){
        Gm.userData.setPrivateChat(Number(sender.isChecked))
    },
    onPushSwitchClick(sender,value){
        Gm.userData.setPushSwitch(sender.isChecked)

    },
    onLotteryAwardBtnClick(sender,value){
        Gm.userData.setLotteryAwardGuide(Number(sender.isChecked))
    },
    onSwitchAccount(){
        Gm.ui.create("AccountSwitchView",true)
    },
    onFixedGameClick(){
        var tips = {}
        tips.title = Ls.get(500048)
        tips.msg = Ls.get(1000066)
        Gm.box(tips, (btnType)=>{
            if(btnType == 1){
                if(cc.sys.isNative){
                    // cc.audioEngine.stopAll();
                    // Gm.netLogic.clearData()
                    // Gm.ui.removeAllView()
                    // Gm.send(Events.MSG_CLOSE,{quit:true})
                    // jsb.fileUitls.removeDirectory((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'newUpdate')
                    // cc.game.restart()
                }
            }
        })
    },

});

