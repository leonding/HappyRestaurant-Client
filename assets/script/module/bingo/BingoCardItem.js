

cc.Class({
    extends: cc.Component,

    properties: {
        m_oHedSprite:cc.Sprite,
        m_oBg:cc.Sprite,
        m_oLight:cc.Sprite,
        m_oButton:cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.m_ani = this.node.getComponent(cc.Animation)
     },

    start () {

    },


    setLight(isLight){
        this.m_oLight.node.active = isLight
    },

    setData(owner,idx){
        this.owner = owner
        this.idx = idx
    },
    onOpenCardClick(){
        this.owner.openCard(this.idx)
    },

    setHead(qualityId){
        if(!this.m_qualityId || this.m_qualityId != qualityId){
            this.m_qualityId = qualityId
            var conf = Gm.config.getQulityHero(qualityId)
            var skin = Gm.config.getSkin(conf.skin_id)
            Gm.load.loadSpriteFrame("personal/head/"+skin.picture,(spriteframe,owner)=>{
                this.m_spriteFrame = spriteframe
                this.loadSuccess()
            },this.m_oHedSprite)
        }else{
            this.loadSuccess()
        }
 
        this.setOpen(true)
        this.setEnable(false)
    },


    loadSuccess(){
        this.openCard()
        this.m_oHedSprite.spriteFrame = this.m_spriteFrame 
        this.m_oBg.node.active = false
    },

    setCb(cb){
        this.m_fb = cb
    },

    //翻开动画
    openCard(){ 
        this.playOpenAni()
    },

    //关闭动画
    closeCard(fb){
        this.setOpen(false)
        this.playCloseAni(fb)
        this.reset()
    },

    setOpen(isOpen){
        this.m_isOpend = isOpen
    },
    //是否已经翻开
    isOpened(){
        return this.m_isOpend || false
    },

    //进入下一轮重置卡牌状态
    reset(){
        this.setOpen(false)
        this.setLight(false)
        this.m_oHedSprite.spriteFrame = null
        this.m_qualityId = null
        this.m_oBg.node.active = true
        this.m_fb = null
        this.m_rightFb = null
        this.setEnable(true)
    },

    setEnable(isEnable){
        this.m_oButton.interactable = isEnable
    },

    setCardFade(){
        this.setLight(true)
        this.m_oLight.node.opacity = 0
        this.m_oLight.node.runAction(cc.fadeIn(0.3))
    },

    setPos(pos){
        this.m_pos = pos
    },

    getPos(){
        return this.m_pos
    },

    playMove(index){
        this.play(this.m_pos,index,true)
    },


    play(pos,index,isUnlock){
        var del = cc.delayTime(index * 0.03)
        var move = cc.moveTo(0.4,pos)
        move.easing(cc.easeOut(0.4))
        var seq = cc.sequence(del,move,cc.callFunc(()=>{
            this.setEnable(isUnlock) 
        }))
        this.node.runAction(seq)
    },

    playMoveCenter(pos,index){
        this.setEnable(false)
        this.play(pos,index,false)
    },

    playOpenAni(){
        this.m_ani.play("wupin_5")
    },

    playCloseAni(fb){
        this.m_closeFb = fb
        this.m_ani.play("wupin_4")
    },

    playRightAni(fb){
        this.m_rightFb = fb
        this.node.zIndex = 999
        this.m_ani.play("wupin_3")
    },
    
    kaiDone(){
        if(this.m_fb){
            this.m_fb()
        }
    },

    rightDone(){
        this.node.zIndex = 0
        if(this.m_rightFb){
            this.m_rightFb()
        }
    },

    closeDone(){
        if(this.m_closeFb){
            this.m_closeFb()
            this.m_closeFb = null
        }
    },

    resetAni(){
        this.m_ani.setCurrentTime(0,"wupin_5")
         this.m_ani.sample("wupin_5")
        this.m_ani.stop("wupin_5")
        
    }

    // update (dt) {},
});
