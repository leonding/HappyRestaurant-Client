//OreUnionRoomListItem
cc.Class({
    extends: cc.Component,
    properties: {
        oreSprite:cc.Sprite,
        roomNameLabel:cc.Label,

        unionNameLabel:cc.Label,
        numberLabel:cc.Label,
        personNumLabel:cc.Label,
        percentNumLabel:cc.Label,

        goBtn:cc.Button,
    },
    setUI(data){
        this.data = data
        this.oreRoomConfig = Gm.config.getOreConfigByType(this.data.type)
        this.setRoomNameLabel()
        this.setOreSprite()
        this.setUnoin()
    },
    setRoomNameLabel(){
        this.roomNameLabel.string =  this.oreRoomConfig.name + this.data.roomIndex
    },
    setOreSprite(){
        var scale = 0.4
        if(this.data.type == 1){
            scale = 0.3
        }
        Gm.load.loadSpriteFrame("/img/shuijing/" +  this.oreRoomConfig.icon,function(sp,icon){
            if(icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp
                icon.node.scale = scale
            }
        },this.oreSprite)
    },
    setUnoin(){
        this.unionNameLabel.string = this.data.unionName
        this.numberLabel.string = this.data.currentNum + "/" + this.data.roomData.oreList.length
        this.setLabelColor(this.numberLabel.node,this.data.currentNum ==  this.data.roomData.oreList.length)

        this.personNumLabel.string = this.data.unionNum
        if(this.data.unionNum == 1){
            this.percentNumLabel.string = "0%"
        }
        else{
            this.percentNumLabel.string = Gm.config.getOreBuffConfig(this.data.unionNum).buff /100 +"%"
        }
        this.setLabelColor(this.percentNumLabel.node,this.data.unionNum == this.data.roomData.oreList.length)
    },
    setLabelColor(node,key){
        if(key){
            node.color = new cc.Color(255,0,0)
        }
        else{
            node.color = new cc.Color(0,255,0)
        }
    },
    onGoBtnClick(){
        Gm.send(Events.ORE_ENTER_ROOM,this.data)
        Gm.ui.removeByName("OreUnionRoomList")
    },

});