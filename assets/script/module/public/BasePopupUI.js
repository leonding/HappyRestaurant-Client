cc.Class({
    extends: cc.Component,
    properties: {
        blackBg:cc.Node,
        titleLab:cc.Label,
        titleCloseBtn:cc.Node,
        titleBg:cc.Sprite,
        baseNode:cc.Node,
        bg:cc.Sprite,
        minBgSf:cc.SpriteFrame,
        minTitleSf:cc.SpriteFrame
    },
    onLoad(){
        Gm.audio.playEffect("music/02_popup_open")
    },
    onEnable(){
        this.blackBg.scale = 2
    },
    setHeight(height){
        this.baseNode.height = height
    },
    setWidth(width){
        this.baseNode.width = width
    },
    getHeight(){
        return this.baseNode.height
    },
    setData(data){
        if (data){
            this.titleLab.string = Ls.get(data.title || "")
            this.titleCloseBtn.active = true
            if (data.isClose == false){
                this.titleCloseBtn.active = false
            }
            if(data.bgSpritePath){
                this.addBgSprite(data.bgSpritePath)
            }
        }
    },
    updateBg(isMin){
        if (isMin){
            this.titleBg.spriteFrame = this.minTitleSf
            this.bg.spriteFrame = this.minBgSf
            this.baseNode.width = this.minBgSf._originalSize.width
            this.baseNode.height = this.minBgSf._originalSize.height
            this.titleLab.node.y = 0
            this.titleCloseBtn.y = 0
            this.titleLab.fontSize = 30
        }
    },
    setTitle(string){
        this.titleLab.string = string
    },
    setTitlePositionY(y){
        this.titleLab.node.y = y
    },
    setTitleFontSize(fontSize){
        this.titleLab.fontSize = fontSize
    },
    onClose(){
        if (this.call){
            Gm.audio.playEffect("music/03_popup_close")
            this.call()
        }
    },
    setCloseFunc(call){
        this.call = call
    },
    addBgSprite(bgSpritePath){
        var node = new cc.Node()
        var icon = node.addComponent(cc.Sprite)
        Gm.load.loadSpriteFrame(bgSpritePath,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
            }
        },icon)
        this.bg.node.addChild(node)
    },
});

