var ExtendsView = require("FriendItem")
cc.Class({
    extends: ExtendsView,
    properties: {
        relationLab:cc.Label,
        addBtn:cc.Node,
        passBtn:cc.Node,
        hlBtn:cc.Node,
        removeBtn:cc.Node,
    },
    setData(data,owner){ //viewType 0,黑名单1搜索，2审核列表
        this._super(data,owner)
        this.addBtn.active = this.owner.selectType == 1
        this.passBtn.active = this.owner.selectType == 2
        this.hlBtn.active = this.owner.selectType == 2
        this.removeBtn.active = this.owner.selectType == 0
        this.relationLab.string = ""
        if (data.relation == 1 || data.playerId == Gm.userInfo.id){
            this.addBtn.active = false
            this.relationLab.string = Ls.get(7001)
            if (data.playerId == Gm.userInfo.id){
                this.relationLab.string = Ls.get(7002)
            }
        }
    },
    onAddClick(){
        if (Gm.friendData.isFull()){
            Gm.floating(Ls.get(7003))
            return
        }
        this.addBtn.active = false
        Gm.friendNet.apply(this.data.playerId)
    },
    onPassClick(){
        if (Gm.friendData.getBlack(this.data.playerId)){
            Gm.floating(1716)
            this.onHlClick()
            return
        }
        if (Gm.friendData.isFull()){
            Gm.floating(Ls.get(7003))
            return
        }
        Gm.friendNet.replyApply(this.data.playerId,1)
    },
    onHlClick(){
        Gm.friendNet.replyApply(this.data.playerId,0)
    },
    onRemoveClick(){
        Gm.friendNet.removeBlack(this.data.playerId)
    },
    
});
