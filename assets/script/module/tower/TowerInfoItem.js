cc.Class({
    extends: cc.Component,

    properties: {
        emptyNode:cc.Node,
        infoNode:cc.Node,
        itemNode:cc.Node,
        nameLab:cc.Label,
        fightLab:cc.Label,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data
        this.emptyNode.active = false
        this.infoNode.active = true
        this.nameLab.string = this.data.info.name
        Func.newHead2(this.data.info.head,this.itemNode,null,this.data.info.level)
        this.fightLab.string = Func.transNumStr(data.info.fightValue,true)
    },
    onClick(){
        if (this.data.info.playerId != Gm.userInfo.id){
            Gm.battleNet.towerAtkHead = this.data.info.head
            Gm.battleNet.towerBattleInfo(this.owner.data.towerId,this.data.info.playerId)
        }
    },
    
});
