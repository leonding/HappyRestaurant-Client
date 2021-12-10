
cc.Class({
    extends: cc.Component,
    properties: {
        bg:cc.Sprite,
        descLab:cc.Label,
        timeLab:cc.Label,
        btnLab:cc.Label,
        btn:cc.Button
    },
    setData:function(data,owner){
        this.data = data
        this.owner = owner
        // this.btnLab.string = data.name
        // Gm.load.loadSpriteFrame("img/huodong/"+data.bg,function(sp,icon){
        //     icon.spriteFrame = sp
        // },this.bg)
        this.timeLab.string = Ls.get(7000006)
        this.descLab.string = data.des
        Gm.red.add(this.btn.node,"dungeonActivity",data.id,"all")
    },
    onClick(){
        cc.log("onClick1")
        if (EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_FUBEN)){
            if (DungeonFunc.isUnlock(this.data,true)){
                Gm.ui.create("DungeonActivityListView",{id:this.data.id,type:1})
            }
        }else{
            Gm.floating(7000007)
            Gm.red.refreshEventState("dungeonActivity")
        }
    },
});


