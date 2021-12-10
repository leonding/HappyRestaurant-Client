cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        jianBtn:cc.Node,
    },
    setData(data,owner){
        this.owner = owner
        this.data = data
        if (this.itemBase== null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
        }
        this.conf = this.itemBase.setData(data)
        this.setSelectNum(0)
    },
    onClick(){
        if (this.stoneNum >= this.data.count){
            Gm.floating(Ls.get(5298))
            return
        }
        this.setSelectNum(this.stoneNum + 1)
        Gm.floating(cc.js.formatStr(Ls.get(5294),this.conf.train_exp))
    },
    onJianClick(){
        this.setSelectNum(this.stoneNum-1)
    },
    setSelectNum(num){
        if (this.stoneNum == num){
            return
        }
        this.stoneNum = num
        if (this.stoneNum == 0){
            this.itemBase.setLabStr("x"+this.data.count)
        }else{
            this.itemBase.setLabStr(cc.js.formatStr("%s/%s",this.stoneNum,this.data.count))
        }
        this.jianBtn.active = num > 0
        this.owner.onItemClick(this)
    },
    getExp(){
        return this.stoneNum * this.conf.train_exp
    },
});


