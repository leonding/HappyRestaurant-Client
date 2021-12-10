var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,

    properties: {
        m_oBtnSkip:cc.Node,
        m_oBtnAuto:cc.Node,
        m_oBtnStop:cc.Node,
        m_oBtnRecord:cc.Node,
        m_oBtnShow:cc.Node,
        m_oMenuNode:cc.Node,

        m_oRoleNamePanel:cc.Label,//姓名板
        m_oTalkLabel:cc.Label,
        m_oTalkDownNode:cc.Node,//对话面板
        m_oTalkPanel:cc.Sprite,//对话底板

        m_oPerson1:sp.Skeleton,
        m_oPerson2:sp.Skeleton,
        m_oPerson3:sp.Skeleton,// 只有一个人 居中

        m_oBranchLayout: cc.Node,
        m_oBranchOptions:{
            default:[],
            type:cc.Node,
        },
        m_oBranchNode:cc.Node,
        m_oHideUINode:cc.Node,

        m_oAutoIconTipSpr:cc.Node,
        m_oStopIconTipSpr:cc.Node,

        m_oRecordNode:cc.Node,
        m_oRecordScroll:cc.ScrollView,
        m_oRecordListItem:cc.Prefab,
        m_oTalkPanelSpriteFrames:{
            default:[],
            type:cc.SpriteFrame
        },
        m_oTalkPlay:cc.Node,
        m_oTalkSkip:cc.Node,
        m_nAutoTalkInterval:2,//自动对话间隔 默认2秒
        m_oTalkBG:cc.Sprite,
        m_oEffect:sp.Skeleton,
        m_oFadeBg:cc.Node, // 淡入淡出背景
    },
    
    ctor(){
        this.m_nSceneStep = 0//当前场景索引
        this.m_nSceneStepStatus = 0 //0开始 1完成
        this.m_arrBranchIds = [] //分支选项ID
        this.m_bAutoPlay = false //自动播放
        this.m_arrRecordSteps = [] //记录列表步骤
        this.m_strBgm = ''
        this.m_bEffectPlaying = false // 特效是否播放中 
        this.m_bAniPlaying = false // 动画是否播放中
    },
    
    onLoad () {
        this._super()

    },
    
    enableUpdateView:function(data){
        if (data){
           Gm.audio.stopDub();
           Gm.audio.stopMusic();
           this.data = data
           if(this.data[this.m_nSceneStep].animation == "fadein"){
                this.setBackground(this.data[this.m_nSceneStep].background)
                this.playFadeInAction()
           }else{
                this.showSceneStep(this.data[this.m_nSceneStep])    
           }
           this.updateAutoBtn()

           Gm.ui.hideNowPage()
        }
    },
    
    showSceneStep:function(step){
        this.m_nSceneStepStatus = 0
        this.setBackground(step.background)
        this.playBgMusic(step.bgm)
        this.playEffect(step.effect,step.sound)
        this.playSound(step.sound, step.sound_rule, step.lines)
        var shakeCfg = step.shake.split("|")
        if(shakeCfg.length > 1){
            this.shakeScreen(parseInt(shakeCfg[0]), parseInt(shakeCfg[1]))
        }
        if(step.show == 1){//玩家自己
            this.showTalk(Gm.userInfo.name,step.lines,step.dialog,this.showTalkComplete.bind(this),step.voice)
            this.clearPerson()
        }else{//游戏女神
            this.showRole(step.character1,step.character2,step.character_name,step.lines,step.dialog,this.showRoleComplete.bind(this),step.phiz,step.voice)
        }
    },
    
    setBackground:function(filename){
        if(filename.length > 0){
            Gm.load.loadSpriteFrame(filename,function(sp, icon){
                icon.spriteFrame = sp
            },this.m_oTalkBG)
        }else{
            this.m_oTalkBG.spriteFrame = null
        }
    },
    
    playBgMusic:function(bgm){
        if(bgm.length > 0 && this.m_strBgm != bgm){
            this.m_strBgm = bgm
            var audioclip = Gm.getLogic("StoryLogic").getAudioClip(bgm)
            Gm.audio.stopMusic()
            if(audioclip) {
                Gm.audio.playBGM(audioclip)
            }else{
                // Gm.audio.playMusic({music:false,path:"music/"+bgm})
                Gm.load.loadAudio("music/"+bgm,function(audio){
                    Gm.audio.playBGM(audio)
                })
            }
        }
    },

    playEffect:function(effect,sound){
        if(effect) {
            var self = this
            this.onShowClick(null, 0)
            this.m_bEffectPlaying = true
            var effectArr = effect.split('|')
            var effectNameArr = effectArr[0].split('/')
            var aniName = effectArr[1]?effectArr[1]:effectArr[0]
            var effectName = effectNameArr[effectNameArr.length-1]
            var effectSp = Gm.getLogic("StoryLogic").getLoadSkeleton(effectName)
            this.m_oEffect.skeletonData = effectSp
            this.m_oEffect.node.active = true
            this.m_oEffect.setAnimation(0, aniName, false)
            this.m_oEffect.setCompleteListener((trackEntry) => {
                self.m_bEffectPlaying = false
                self.m_oEffect.node.active = false
                self.m_nSceneStepStatus = 1
                if(!sound || sound.length == 0) {
                    // self.m_nSceneStep++
                    self.onShowClick(null, 1)
                    self.processNextStep()
                }
            })
        }
    },

    playSound:function(sound, rule, lines){
        if(rule == 0) {
            return
        }
        var self = this
        if(sound && sound.length > 0 ) {
            var soundList = sound.split("|")
            var sound_length = soundList.length
            var sound_time = []
            var sound_path = []
            var max_time = 0
            for(let i = 0; i < sound_length; i++){
                var tmp_sound = soundList[i].split("#")
                sound_path.push(tmp_sound[0])
                sound_time.push(tmp_sound[1])
                if(tmp_sound[1] > max_time) {
                    max_time = tmp_sound[1]
                }
            }
            if(rule == 1) {
                for(let i = 0; i < sound_length; i++){
                    var audioclip = Gm.getLogic("StoryLogic").getAudioClip(sound_path[i])
                    if(audioclip){
                        Gm.audio.playEffect1(audioclip, false)
                    }else{
                        Gm.audio.playEffect(sound_path[i])
                    }
                }
                if(lines.length == 0) {
                    setTimeout(() => {
                        self.m_nSceneStep++
                        self.m_nSceneStepStatus = 1
                        self.onShowClick(null, 1)
                        self.processNextStep()
                    }, max_time * 1000);
                }
            } else if(rule == 2) {
                var index = 0
                function playCallback(){
                    if(index >= sound_path.length && lines.length == 0) {
                        self.m_nSceneStep++
                        self.m_nSceneStepStatus = 1
                        self.onShowClick(null, 1)
                        self.processNextStep()
                    }else{
                        var audioclip = Gm.getLogic("StoryLogic").getAudioClip(sound_path[index])
                        if(audioclip){
                            Gm.audio.playEffect1(audioclip, false)
                        }else{
                            Gm.audio.playEffect(sound_path[index])
                        }
                        setTimeout(()=>{
                            index++
                            playCallback()
                        },sound_time[index]*1000)
                    }
                }
                playCallback()
            }
        }
    },

    playVoice:function(voice){
        if(voice.length > 0) {
            var audioclip = Gm.getLogic("StoryLogic").getAudioClip(voice)
            if(audioclip){
                Gm.audio.playEffect1(audioclip)
            }
        }
    },

    playFadeInAction:function(){
        if(!this.m_oFadeBg.active){
            this.m_oFadeBg.active = true
        }
        var animate = this.node.getComponent(cc.Animation)
        animate.play("fadein")
    },
    
    onFadeInCompleted:function(){
        this.m_oFadeBg.active = false
        this.showSceneStep(this.data[this.m_nSceneStep])
        // this.m_nSceneStep++
        // this.checkBranchStep()
        // this.processNextStep()
        this.m_bAniPlaying = false
    },

    playFadeOutAction:function(){
        this.m_bAniPlaying = true
        this.m_oFadeBg.active = true
        var animate = this.node.getComponent(cc.Animation)
        animate.play("fadeout")
    },
    
    onFadeOutCompleted:function(){
        this.m_oPerson1.node.active = false//skeletonData = null
        this.m_oPerson2.node.active = false//skeletonData = null
        this.m_oPerson3.node.active = false//skeletonData = null
        this.m_oRoleNamePanel.string = ""
        this.m_oTalkLabel.string = ""
        var step = this.data[this.m_nSceneStep]
        if(step && step.animation == "fadein"){
            this.playFadeInAction()
        }
        if(this.m_nSceneStep >= this.data.length-1){
            this.finishStory()
        }
    },

    showSceneStepComplete:function(){
        this.unscheduleAllCallbacks()
        this.m_oTalkLabel.string = this.data[this.m_nSceneStep].lines
        
        this.showTalkComplete()
    },

    showRole:function(character1, character2, character_name, lines, dialog, func, phiz, voice){//播放角色入场
        var sp1 = Gm.getLogic("StoryLogic").getLoadSkeleton(character1)
        var sp2 = Gm.getLogic("StoryLogic").getLoadSkeleton(character2)
        var allShow = (character_name.split("&").length > 1)
        if(this.m_oPerson1.skeletonData && this.m_oPerson2.skeletonData && (this.m_oPerson1.skeletonData == sp2 &&  this.m_oPerson2.skeletonData == sp1) 
        || (this.m_oPerson1.skeletonData == sp1 &&  this.m_oPerson2.skeletonData == sp2)) {
            var objList = [this.m_oPerson1, this.m_oPerson2]
            var phizList = phiz.split("|")
            for(let i = 0; i < 2; i++) {
                if(objList[i].skeletonData) {
                    if(objList[i].skeletonData._name == character1){
                        if(objList[i].timeScale == 0) {
                            if(phizList.length > 1) {
                                objList[i].setAnimation(0, phizList[i], true)
                            }else{
                                objList[i].setAnimation(0, phizList[0], true)
                            }
                            objList[i].node.zIndex = 1
                            objList[i].timeScale = 1
                            objList[i].node.color = new cc.Color(255, 255, 255)  
                        }
                    }else{
                        if(allShow){
                            if(phizList.length > 1) {
                                objList[i].setAnimation(0, phizList[i], true)
                            }else{
                                objList[i].setAnimation(0, phizList[0], true)
                            }
                            objList[i].timeScale = 1
                            objList[i].node.color = new cc.Color(255, 255, 255)   
                        }else{
                            objList[i].setAnimation(0, "ziran", true)
                            objList[i].timeScale = 0
                            objList[i].node.color = new cc.Color(118, 118, 118)   
                        }
                        objList[i].node.zIndex = -1
                    }
                    objList[i].node.active = true
                }
            } 
            if(this.m_oPerson3.skeletonData) {
                this.m_oPerson3.node.active = false
            }
        }else{
            if( character1.length > 0 && character2.length == 0 || character1.length == 0 && character2.length > 0 ) {
                var sp = character1.length > 0 ? sp1 : sp2
                this.m_oPerson1.node.active = false
                this.m_oPerson2.node.active = false
                if(this.m_oPerson3.skeletonData != sp || !this.m_oPerson3.node.active) {
                    if(sp == undefined){
                        this.m_oPerson3.node.active = false
                    }else{
                        this.m_oPerson3.skeletonData = sp
                        this.m_oPerson3.setAnimation(0, phiz, true)
                        this.m_oPerson3.node.zIndex = 1
                        // this.m_oPerson3.node.opacity = 0
                        // this.m_oPerson3.node.runAction(cc.fadeIn(1))
                        if(this.m_oPerson3.timeScale == 0) {
                            this.m_oPerson3.timeScale = 1
                        }
                        this.m_oPerson3.node.color = new cc.Color(255,255,255)
                        this.m_oPerson3.node.active = true
                    }
                }
            }else{
                this.m_oPerson3.node.active = false
                if(this.m_oPerson1.skeletonData != sp1 || !this.m_oPerson1.node.active) {
                    if(sp1 == undefined){
                        this.m_oPerson1.node.active = false
                    }else{
                        this.m_oPerson1.skeletonData = sp1
                        this.m_oPerson1.setAnimation(0, phiz, true)
                        this.m_oPerson1.node.zIndex = 1
                        // this.m_oPerson1.node.opacity = 0
                        // this.m_oPerson1.node.runAction(cc.fadeIn(1))
                        if(this.m_oPerson1.timeScale == 0) {
                            this.m_oPerson1.timeScale = 1
                        }
                        this.m_oPerson1.node.color = new cc.Color(255,255,255)
                        this.m_oPerson1.node.active = true
                    }
                }
                if(sp2 == undefined) {
                    this.m_oPerson2.node.active = false
                }else{
                    this.m_oPerson2.skeletonData = sp2
                    this.m_oPerson2.node.active = true
                }
                this.m_oPerson2.node.zIndex = -1
                if(allShow) {
                    this.m_oPerson2.setAnimation(0, phiz, true)
                    this.m_oPerson2.timeScale = 1
                    this.m_oPerson2.node.color = new cc.Color(255,255,255)
                }else{
                    this.m_oPerson2.setAnimation(0, "ziran", true)
                    this.m_oPerson2.timeScale = 0
                    this.m_oPerson2.node.color = new cc.Color(118, 118, 118)   
                }
            }
            
         } 

        func(character_name, lines, dialog, this.showTalkComplete.bind(this),voice)
    },

    showRoleComplete:function(character_name, lines, dialog, func, voice){//显示角色回调
        this.showTalk(character_name, lines, dialog, func, voice)
    },
    
    showTalk:function(rolename, lines, dialog, func, voice){//播放对话
        this.m_oRoleNamePanel.string = rolename
        var wordsIndex = 0
        var word = ""
        var self = this
        this.m_oTalkLabel.string = ""
        self.playfunc = function(){
            word = lines[wordsIndex]?lines[wordsIndex]:''
            this.m_oTalkLabel.string += word
            wordsIndex++;
            if(wordsIndex == lines.length){
                if(func){
                    func()
                }
            }
        }
        this.schedule(self.playfunc, 0.05, lines.length-1)
        if(dialog.length == 0) {
            this.m_oTalkDownNode.active = false
        } else {
            this.m_oTalkDownNode.active = true
            // let texture = Gm.storyData.getSpriteTexture(dialog)
            // if(texture){
            //     this.m_oTalkPanel.spriteFrame =new cc.SpriteFrame(texture) 
            // }else{
                for(var i = 0; i < this.m_oTalkPanelSpriteFrames.length; i++){
                    if(this.m_oTalkPanel.spriteFrame._name != dialog && dialog == this.m_oTalkPanelSpriteFrames[i]._name){
                        this.m_oTalkPanel.spriteFrame = this.m_oTalkPanelSpriteFrames[i]
                    }
                }
            // }
        }
        this.playVoice(voice)
    },

    showTalkComplete:function(){//显示对话回调
        // console.log("当前对话完成！")
        this.m_nSceneStepStatus = 1
        // this.m_arrRecordSteps.push(this.m_nSceneStep+1)
        // var step = this.data[this.m_nSceneStep]
        // if(this.m_nSceneStep == this.data.length-1){//整个场景对话结束
        //     if(step.animation == "fadeout" && this.m_bAutoPlay){
        //         setTimeout(()=>{
        //             this.playFadeOutAction()
        //             // this.m_nSceneStep++
        //         },this.m_nAutoTalkInterval*1000)
        //     }else{
        //         if (this.m_bAutoPlay) {
        //             setTimeout(()=>{
        //                 this.finishStory()
        //             },this.m_nAutoTalkInterval*1000)
        //         }else{
        //             // this.m_nSceneStep++
        //         }
        //     }
        // }else{
            // if(step.animation == "fadeout" && this.m_bAutoPlay){
            //     this.playFadeOutAction()
                // this.m_nSceneStep++
            // }else{
                // this.m_nSceneStep++
                if(this.m_bAutoPlay){
                    setTimeout(()=>{
                        this.processNextStep()
                    },this.m_nAutoTalkInterval*1000)
                }
                this.checkBranchStep()
            // }
        // }
    },

    clearPerson:function(){
        if(this.m_oPerson1.skeletonData){
            this.m_oPerson1.node.active = false//skeletonData = null
        }
        if(this.m_oPerson2.skeletonData){
            this.m_oPerson2.node.active = false //skeletonData = null
        }
        if(this.m_oPerson3.skeletonData){
            this.m_oPerson3.node.active = false //skeletonData = null
        }
    },

    updateUpSideDown:function(destValue){
        const tmpTb = ["m_oBtnSkip","m_oBtnAuto","m_oBtnStop","m_oBtnRecord","m_oBtnShow"]
        for(const i in tmpTb){
            this[tmpTb[i]].active = destValue
        }
        if(destValue){
            this.m_oBtnAuto.active = !this.m_bAutoPlay
            this.m_oBtnStop.active = this.m_bAutoPlay
        }
        this.m_oMenuNode.getComponent(cc.Sprite).enabled = destValue
    },
    onUpSideDown:function(){
        this.updateUpSideDown(!this.m_oBtnSkip.active)
    },
    onSkipCilck(event, data){
        Gm.ui.create("StorySummary",{owner:this, step:this.m_nSceneStep})
    },
    onAutoClick(event, data){
        var isAuto = !this.m_bAutoPlay //Boolean(parseInt(data))
        this.m_bAutoPlay = isAuto
        this.m_oBtnAuto.active = !isAuto
        this.m_oBtnStop.active = isAuto
        this.m_oAutoIconTipSpr.active = !isAuto
        this.m_oStopIconTipSpr.active = isAuto
        if(!this.m_oBranchNode.active && this.m_nSceneStepStatus == 1){
            this.processNextStep()
        }
        this.updateAutoBtn()
    },
    onRecordClick(event, data){
        var visible = Boolean(parseInt(data))
        this.m_oRecordNode.active = visible
        if(visible){
            this.initRecordList()
        }
    },
    onShowClick(event, data){
        var visible = Boolean(parseInt(data))
        // this.m_oMenuNode.active = visible
        this.m_oTalkDownNode.active = visible
        this.m_oTalkPlay.active = visible
        this.m_oTalkSkip.active = visible
        // this.m_oHideUINode.active = !visible
    },

    onNextStepClick(event, data){
        if(this.m_bAutoPlay){
            return
        }
        if(this.m_bEffectPlaying){
            return
        }
        if(this.m_bAniPlaying){
            return
        }
        // if(this.m_nSceneStep >= this.data.length){
        //     if(this.data[this.data.length-1].animation == "fadeout" && !this.m_oFadeBg.active){
        //         this.playFadeOutAction()
        //         this.m_nSceneStep++
        //         return
        //     }
        // }else{
        //     var lines = this.m_nSceneStep == 0 ? this.data[this.m_nSceneStep].lines : this.data[this.m_nSceneStep-1].lines
        //     var lastTalkStep = this.m_arrRecordSteps[this.m_arrRecordSteps.length - 1]
        //     if(lines.length > 0 && lastTalkStep == this.m_nSceneStep) {
        //         if(this.data[this.m_nSceneStep-1] && this.data[this.m_nSceneStep-1].animation == "fadeout" && !this.m_oFadeBg.active){
        //             this.playFadeOutAction()
        //             return   
        //         }
        //     }
        //     if(this.data[this.m_nSceneStep] && this.data[this.m_nSceneStep].animation == "fadein") {
        //         if(this.m_nSceneStep != 0){
        //             this.playFadeInAction()    
        //         }
        //     }
        // }
        if(this.m_oTalkDownNode.active == false){
            this.onShowClick(null, 1)
        }
        this.processNextStep()
    },

    processNextStep(){
        if(!cc.isValid(this.data)){
            return
        }
        if(this.m_nSceneStepStatus == 1){
            if(this.data[this.m_nSceneStep].animation == "fadeout"){
                this.playFadeOutAction()
                this.m_nSceneStep++
            }else{
                this.m_nSceneStep++
                var step = this.data[this.m_nSceneStep]
                if(step){
                    if(step.options.length > 0){
                        this.initBranchOption(step.options)
                    }else{
                        this.showSceneStep(step)
                    }
                }else{
                    this.finishStory()
                }
            }
        }else{
            this.showSceneStepComplete()
        }   
    },

    finishStory(){
        Gm.ui.create("StoryUpdateView",{type:3})
        var storyLogic = Gm.getLogic("StoryLogic")

        //统计剧情完整看完后领取剧情奖励的人数
        //正经观看该话剧情的次数
        var chapterInfo = storyLogic.getBaseChapterInfo()
        var actionType = 3
        if(chapterInfo.new){
            actionType = 2
        }
        storyLogic.sendBi(-10000, actionType, chapterInfo.id, this.m_nSceneStep)

        storyLogic.setHaveRead()//设置已经阅读

        Gm.audio.stopMusic()

        this.onBack()

        Gm.ui.showNowPage()       
    },

    checkBranchStep(){
        if(this.m_arrBranchIds.length == 0){
            return
        }
        var found = false
        for(var i = this.m_nSceneStep; i < this.data.length; i++){
            for(var j = 0; j < this.m_arrBranchIds; j++){
                var branch = parseInt(this.data[i].branch)
                if(branch == 0 || branch == this.m_arrBranchIds[j]){
                    this.m_nSceneStep = i
                    found = true
                    break
                }
            }
            if(found){
                break
            }
        }
    },

    initBranchOption(options){
        var options_title = options.split("_")
        for(var i in options_title){
            var option = cc.instantiate(this.m_oBranchOptions[i%2])
            option.active = true
            var button = option.getComponent(cc.Button)
            button.clickEvents[0].customEventData = parseInt(i)+1//分支索引从1开始
            option.getChildByName("Background").getChildByName("Label").getComponent(cc.Label).string = options_title[i]
            this.m_oBranchLayout.addChild(option)
        }
        this.m_oBranchNode.active = true
    },

    onSelectBranchClick(sender, data){
        this.m_arrBranchIds.push(data)
        this.m_oBranchNode.active = false

        // this.m_nSceneStep++
        this.checkBranchStep()

        this.processNextStep()
    },

    initRecordList(){
        this.removeAllPoolItem(this.m_oRecordScroll.content)
        this.m_oRecordScroll.stopAutoScroll()

        Gm.ui.simpleScroll(this.m_oRecordScroll,this.m_arrRecordSteps,function(itemData,tmpIdx){
            var item = this.getPoolItem()
            this.m_oRecordScroll.content.addChild(item)
            var itemSp = item.getComponent("StoryRecordListItem")
            var herolist = Gm.config.getAllQulityHero()
            var heroid = null
            var heroname = null
            if(this.data[itemData-1].show == 1){
                heroid = Gm.userInfo.head
                heroname = Gm.userInfo.name
            }else{
                for(var i in herolist){
                    if(herolist[i].name == this.data[itemData-1].character_name){
                        heroid = herolist[i].id
                        break
                    }
                }
                heroname = this.data[itemData-1].character_name
            }
            var data = {}
            data.heroid = heroid
            data.name = heroname
            data.talk = this.data[itemData-1].lines
            itemSp.setData(data)
            return item
        }.bind(this))
        this.m_oRecordScroll.scrollToTop()
    },
    updateAutoBtn:function(){
        var lab = this.m_oTalkPlay.getChildByName("Label").getComponent(cc.Label)
        if (this.m_bAutoPlay){
            lab.string = Ls.get(5351)
        }else{
            lab.string = Ls.get(5352)
        }
    },
    //子类继承
    getBasePoolItem(){
        var node = cc.instantiate(this.m_oRecordListItem)
        return node
    },

    shakeScreen:function(time, sk){
        // var tmpValue = [5,10]
        var tmpTimes = time/50
        var tmpTime = 50//checkint(tmpValue[0])
        if (tmpTime){
            // tmpTime = tmpTime
            // var tmpAdds = time
            var tmpSk = sk//checkint(tmpValue[1])
            var tmpWidth = tmpSk
            var tmpLostX = 0
            var tmpHeight = tmpSk
            var tmpLostY = 0
            var shakeList = new Array()
            for(var i = 0;i < tmpTimes;i++){
                var tmpX = Func.random(tmpLostX,tmpWidth)
                var tmpY = Func.random(tmpLostY,tmpHeight)
                tmpLostX = tmpWidth - tmpX
                tmpLostY = tmpHeight - tmpY
                shakeList.push(cc.moveTo(tmpTime/1000,cc.v2(tmpX - tmpSk,tmpY - tmpSk)))
            }
            shakeList.push(cc.callFunc( ()=>{
                this.node.x = 0
                this.node.y = 0
            }))
            this.node.runAction(cc.sequence(shakeList))
        }
    },

    onBack(){
        this._super()

        Gm.ui.showNowPage()
    },

});

