cc.Class({
    extends: cc.Component,
    properties: {
        iconSprite:cc.Sprite,
        levelLabel:cc.Label,
        lockNode:cc.Node,
        redSprite:cc.Node,
        button:cc.Node,
    },
    setUI(data){
        this.setIconSprite(data.picture)
        this.setLevelLabel(data.level)
    },
    setIconSprite(picname){
        Gm.load.loadSpriteFrame("/img/items/" + picname,function(sp,icon){
             if (icon && icon.node){
                icon.spriteFrame = sp
            }
        },this.iconSprite)
    },
    setLevelLabel(str){
        this.levelLabel.string = "Lv." + str
    },
    setLock(key){
        this.lockNode.active = key
    },
    setRed(key){
        this.redSprite.active = key
    },
    onClick(){
        if(this.callback){
            this.callback(this.baseId)
        }
    },
    setCallback(callback,baseId){
        this.button.active = true
        this.callback = callback
        this.baseId = baseId
    }
});