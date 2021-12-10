
var time = 0.2
cc.Class({
    extends: cc.Component,
    properties: {
        spriteFrame:cc.SpriteFrame,
    },
    onLoad(){
        this.isOpen = false
        this.isTouch = false
        this.touchTime = 0
        this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.isTouch = true
            this.touchTime = 0
            this.isOpen = false
            this.touchEvent = event
        })
        this.node.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.onClickEnd()
        })
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.onClickEnd()
        })
    },
    onClickEnd(){
        this.touchEvent = null
        this.isTouch = false
        this.hideSpr()
    },
    update(dt){
        if (this.isTouch && !this.isOpen){
            this.touchTime = this.touchTime + dt
            if (this.touchTime > time){
                this.isOpen = true
                this.showSpr()
            }
        }
    },
    showSpr(){
        if (this.sprite == null){
            var nn = new cc.Node()
            this.node.addChild(nn,-1)
            this.sprite = nn.addComponent(cc.Sprite)
            this.sprite.spriteFrame = this.spriteFrame
            this.sprite.node.opacity = 100
            nn.color = cc.color(0,0,0)
        }
        this.sprite.node.active = true
        this.sprite.node.width = this.node.width+6
        this.sprite.node.height = this.node.height
        // this.node.emit("show_copy","aaa")

        this.createCopy()
    },
    hideSpr(){
        if (this.sprite){
            this.sprite.node.active = false
        }
    },
    createCopy(){
        var rich = this.node.getComponent(cc.RichText)

        Gm.ui.create("ItemTipsView",{data:{str:rich.oldString,height:this.node.height/2} || rich.string,itemType:-2,pos:this.node.convertToWorldSpaceAR(cc.v2(0,0))})
    },
});


