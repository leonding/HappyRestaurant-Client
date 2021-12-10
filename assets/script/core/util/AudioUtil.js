cc.Class({
    properties:{
        cache:null,
    },
	ctor:function(){
        this.cache={}
    },
    button:function(){
        // this.playOther({path:"audio_button_click"})
    },
    releaseAll:function(){
        cc.audioEngine.stopAllEffects()
        for(const i in this.cache){
            cc.audioEngine.uncache(this.cache[i])
            cc.loader.release(this.cache[i])
        }
        this.cache = {}
        cc.audioEngine.setMusicVolume(Gm.userData.musicValue/4)
    },
    playBGM:function(audio){
        if (Gm.userData.musicValue > 0 && audio && (this.m_RunAudio != audio.name || !cc.audioEngine.isMusicPlaying())){
            console.log("audio.name===:",audio.name)
            this.m_RunAudio = audio.name
            cc.audioEngine.playMusic(audio,true)
            cc.audioEngine.setMusicVolume(Gm.userData.musicValue/4)
        }
    },
    playDub(path,func){//配音
        if (Gm.userData.volumeValue > 0){
            this.play({path:"personal/voice/"+path,isDub:true,func:func})
        }
    },
    playAtk:function(path){//攻击特效
        if (Gm.userData.volumeValue > 0 && path && path.length > 0){
            this.play({path:"personal/"+path})
        }
    },
    playEffect:function(path,callback){
        if (Gm.userData.volumeValue > 0){
            this.play({path:path,callback:callback})
        }
    },
    playEffect1:function(audioclip, loop) {
        if (Gm.userData.volumeValue > 0){
            cc.audioEngine.playEffect(audioclip, loop || false)
        }
    },
    playMusic:function(data){
        if (Gm.userData.musicValue > 0){
            this.play(data)
        }
    },
    play:function(data){
        if(this.cache[data.path]){
            this.loadSuccess(data);
		}else{
			var self = this;
			Gm.load.loadAudio(data.path,function(audio){
                if (!data.music){
                    self.cache[data.path]=audio
                }
                self.loadSuccess(data)
            })
		}
    },
    loadSuccess:function(data){
        if (data.music){
            this.playBGM(this.cache[data.path])
            // cc.audioEngine.stopAll()
            // cc.audioEngine.play(,data.loop || false,1)
        }else if (data.isDub){//配音
            if (this.m_iDubId){
                cc.audioEngine.stop(this.m_iDubId)
            }
            this.m_iDubId = cc.audioEngine.playEffect(this.cache[data.path],data.loop || false)
            if (data.func){
                cc.audioEngine.setFinishCallback(this.m_iDubId,()=>{
                    this.m_iDubId = 0
                    data.func()
                })
            }
        }else{
            this.m_iEffectId = cc.audioEngine.playEffect(this.cache[data.path],data.loop || false)
            if(data.callback){
                data.callback(this.m_iEffectId)
            }
        }
        // Gm.userData.restoreVolume()
    },
    stopDub(){
        if(this.m_iDubId){
            this.stopEffect(this.m_iDubId)
        }
    },
    stopEffect:function(id){
        cc.audioEngine.stopEffect(id)
    },
    stopAllEffects:function(){
        cc.audioEngine.stopAllEffects()
    },
    stopMusic:function(){
        cc.audioEngine.stopMusic()
    },
    stopAll:function(){
        this.m_RunAudio = null
        cc.audioEngine.stopAll()
    },
    setVolume(value,isMusic){
        if (isMusic){
            cc.audioEngine.setMusicVolume(value)
        }else{
            cc.audioEngine.setEffectsVolume(value)
        }
    },
    getVolume(){
        return cc.audioEngine.getMusicVolume(0.5)
    }
});
