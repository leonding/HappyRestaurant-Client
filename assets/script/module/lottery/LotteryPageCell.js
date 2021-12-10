var BaseView = require("PageView")
// LotteryPageCell
cc.Class({
    extends: BaseView,

    properties: {
        iconSprite:cc.Sprite,
        titleBg:cc.Node,
        titleName:cc.Sprite,
        iconSpriteFrame:{
            default:[],
            type:cc.SpriteFrame,
        },
         m_otitleSprite:{
            default:[],
            type:cc.SpriteFrame
        },
    },
    setData(data){
        this.data = data
        this.setUI()
    },
    setUI(){
        if(this.data.index){
            if( this.iconSpriteFrame[this.data.index-1]){
                this.iconSprite.spriteFrame = this.iconSpriteFrame[this.data.index-1]
            }
            if(this.m_otitleSprite[this.data.index-1]){
                this.titleName.spriteFrame =this.m_otitleSprite[this.data.index-1]
            }
        }
        else{
            Gm.load.loadSpriteFrame("img/chouka/chouk_img_wkq",function(sp,icon){
                if(icon && icon.node && icon.node.isValid){
                    icon.spriteFrame = sp
                }
            },this.iconSprite)
            this.titleBg.active = false
        }
    },
    onItemClick(){
        if(this.data.index && this.data.index !=0){
            Gm.ui.create("LotteryMain",{page:this.data.index-1})
        }
    },
});

