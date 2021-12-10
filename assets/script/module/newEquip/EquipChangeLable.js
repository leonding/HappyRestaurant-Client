cc.Class({
    extends: cc.Component,
    properties: {
        lab:cc.Label,
        arrowIcon:cc.Sprite,
        changeLab:cc.Label
    },
    hideArrow(){
        this.arrowIcon.node.active = false
    },
    setNum(num,lastNum,attrId){
        this.arrowIcon.node.active = !(lastNum == num)
        if (!this.arrowIcon.node.active){
            return
        }
        var  str = ""
        var arrowStr = ""
        if (num > lastNum){
            arrowStr = "uiequip_icon_sehng"
            this.changeLab.node.color = cc.color(8,163,0)
            str = "+ "
        }else{
            arrowStr = "uiequip_icon_jiang"
            this.changeLab.node.color = cc.color(255,0,0)
            str = "- "
        }
        this.changeLab.string = str + EquipFunc.getBaseIdToNum(attrId,Math.abs(num-lastNum)) 

        // Gm.load.loadSpriteFrame("img/UIequip/" +arrowStr,(sp,owner)=>{
        //     owner.spriteFrame = sp
        // },this.arrowIcon)
    },
    setResultNum(num,lastNum,attrId){
        
    },
});


