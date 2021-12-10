
// SportsIslandItem
cc.Class({
    extends: cc.Component,

    properties: {
        m_oBgSprite:cc.Sprite,
        m_oNameLabel:cc.Label,
        m_oFog:cc.Sprite,

        m_oCurrentSprite:cc.Node,
        rewardNode:cc.Node,
        boxPerfab:cc.Prefab,
    },
    onLoad () {
        
    },
    setData(data,openId){
        this.data = data
        this.openId = openId
        this.m_oNameLabel.string = this.data.name || ""
        this.setSpriteFrame(this.m_oBgSprite,this.data.earningsBg)
        if(data.group > openId){
            this.addFog()
        }
        else if(data.group <= openId){//可以点击
            if(Gm.userData.getUnionIslandId() != openId && data.group == openId){//没有显示过动画
                Gm.userData.setUnionIslandId(openId)
                this.addFog()
                setTimeout(() => {
                    this.fogHideAction()
                }, 1000);
            }
        }
        this.setRewardNode(data,openId)
        this.m_oBgSprite.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.onFightClick()
         })
    },
    fogHideAction(){
        if(this.m_oFog && this.m_oFog.node && this.m_oFog.node.isValid){
            this.m_oFog.node.runAction(cc.fadeOut(0.5))
        }
    },
    addFog(){
        this.m_oFog.node.active = true
    },
    setSpriteFrame(sprite,fileName){
        cc.loader.loadRes("img/league/jingji/"+fileName,cc.SpriteFrame,function(err,spf){
            if(err){
                cc.log("err=",err)
                return
            }
            if(this.node && this.node.isValid){
                sprite.spriteFrame = spf
            }
        }.bind(this))
    },
    onFightClick(){
        if(!Gm.unionData.sportsIsOpen()){
            Gm.floating(Ls.get(200016))
            return
        }
        if(this.data.group <= this.openId){
            Gm.ui.create("SportsModelSelectView",{group:this.data.group,name:this.data.name || ""})
        }
    },
    updatePercent(){
        if(this.m_oCurrentSprite.active){
            this.m_oCurrentSprite.getChildByName("percentLabel").getComponent(cc.Label).string = Gm.unionData.getIslandPercent(this.data.group) + "%"
        }
        if(this.rewardNode.active){
             if(this.getReward().length != 0){//有奖励
                this.rewardNode.getChildByName("endSprite").active = false
                this.rewardNode.getChildByName("rewardNode").active = true
                if(!this.m_oBoxing){
                    var tmpBox = cc.instantiate(this.boxPerfab)
                    this.m_oBoxing = tmpBox.getComponent(cc.Animation)
                    this.rewardNode.getChildByName("rewardNode").addChild(tmpBox)
                }
                this.m_oBoxing.play("baox_1")
            }
            else{
                this.rewardNode.getChildByName("endSprite").active = true
                this.rewardNode.getChildByName("rewardNode").active = false 
            }
        }
    },
    setRewardNode(data,openId){
        //当前岛屿标志
        if(data.group == openId){
            this.m_oCurrentSprite.active = true
            this.m_oCurrentSprite.getChildByName("percentLabel").getComponent(cc.Label).string = Gm.unionData.getIslandPercent(data.group) + "%"
        }
        else{
             this.m_oCurrentSprite.active = false
        }

        //奖励的显示
        if(data.group < openId){//这是通过的岛屿
            if(this.getReward().length != 0){//有奖励
                this.rewardNode.active = true
                this.rewardNode.getChildByName("endSprite").active = false
                this.rewardNode.getChildByName("rewardNode").active = true
                if(!this.m_oBoxing){
                    var tmpBox = cc.instantiate(this.boxPerfab)
                    this.m_oBoxing = tmpBox.getComponent(cc.Animation)
                    this.rewardNode.getChildByName("rewardNode").addChild(tmpBox)
                }
                this.m_oBoxing.play("baox_1")
            }
            else{
                this.rewardNode.active = true
                this.rewardNode.getChildByName("endSprite").active = true
                this.rewardNode.getChildByName("rewardNode").active = false 
            }
        }
        if(this.data.position){
            var array = this.data.position.split("|")
            var arrayx = array[0].split("_")
            var arrayy =  array[1].split("_")
            var arrays =  array[2].split("_")
            this.rewardNode.x = parseFloat(arrayx[1])
            this.rewardNode.y = parseFloat(arrayy[1])
            this.m_oCurrentSprite.x = parseFloat(arrayx[1])
            this.m_oCurrentSprite.y = parseFloat(arrayy[1])
            this.rewardNode.scaleX = 0.6 * parseFloat(arrays[1])
            this.rewardNode.scaleY = 0.6
        }
    },
    getReward(){
           var temp = [] 
            var scoreConfig = Gm.config.getAllianceIslandsConfigById(this.data.group)
            for(var i=0;i<scoreConfig.scores.length;i++){
                if(!Gm.unionData.isReciveReward(this.data.group,i+1)){
                    var tconfig = Gm.config.getAllianceIslandRewardConfig(this.data.group,i+1)
                    for(var j=0;j<tconfig.reword.length;j++){
                        temp.push(tconfig.reword[j])
                    }
                    break
                }
            }
            var earnings = []
            for(var i in temp){
                earnings.push(temp[i])
            }
            return earnings
    },
});

