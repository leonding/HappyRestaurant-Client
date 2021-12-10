
cc.Class({
    extends: cc.Component,

    properties: {
        lvLab:cc.Label,
        nameLab:cc.Label,
        numRich:cc.RichText,
        btn:cc.Button,
        btnLab:cc.Label,
    },
    updateData:function(data,owner){
        this.data = data
        this.owner = owner
        this.lvLab.string = Ls.lv() + data.level
        this.nameLab.string = data.name
        this.updateBtn()
    },
    updateBtn(){
        // var co = "40FE37"
        // if(this.data.memberNum == this.data.maxNum){
        //     co = "FF0000"
        // }
        // var str = "<color=#534636><color=#534636>%s/</c><color=#534636>%s</color></color>"
        this.numRich.string = cc.js.formatStr("%s%s/%s",Ls.get(800077),this.data.memberNum,this.data.maxNum)
        if (this.data.applyStatus == 0){
            this.btnLab.string = Ls.get(800069)
        }else if (this.data.applyStatus == 1){
            this.btnLab.string = Ls.get(800070)
        }else {
            this.btnLab.string = Ls.get(800071)
        }
        this.btn.interactable = this.data.applyStatus != 0
    },
    onBtnClick(){
        if ( Gm.heroData.getFightAll() < this.data.joinFight){
            Gm.floating(Ls.get(800072))
            return
        }
        if (this.data.applyStatus > 0){
            Gm.audio.playEffect("music/06_page_tap")
            Gm.unionNet.join(this.data.allianceId,"")
            return
        }
    },
    
});
