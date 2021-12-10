cc.Class({
    extends: cc.Component,

    properties: {
        bgSpr:cc.Sprite,
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        Gm.load.loadSpriteFrame("img/nshj/"+ data.name,(sp,icon)=>{
            icon.spriteFrame = sp
            this.node.width = sp._rect.width
            this.node.height = sp._rect.height

            if (this.data.fileGroup == 4){
                Gm.red.add(this.node,"villa","hero")//家园
            }
        },this.bgSpr)

        this.node.x = data.positionX
        this.node.y = data.positionY
        this.zIndex = data.display

        if (data.effects){//特效
            Gm.load.loadPerfab(data.effects,(sp)=>{
                if(this.data && this.node.isValid){
                    this.node.addChild(cc.instantiate(sp))
                }
            })
        }
    },
    onClick(){
        cc.log(this.data)
        if (this.data.jumpId){
            Gm.ui.jump(this.data.jumpId)
            // this.owner.onBack()
        }
    },
});

