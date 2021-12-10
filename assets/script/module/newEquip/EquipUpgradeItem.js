cc.Class({
    extends: cc.Component,
    properties: {
        itemNode:cc.Node,
        nameLab:cc.Label,
        jianBtn:cc.Node,
    },
    setData:function(data,owner){
        this.owner = owner
        this.data = data

        if(this.itemBase == null){
            this.itemBase = Gm.ui.getNewItem(this.itemNode)
            this.itemBase.setTips(false)
        }
        this.conf = this.itemBase.setData(data)
        this.itemBase.setLabStr("")
        this.stoneNum = -1
        this.setSelectNum(0)
        this.startNum = 0
        Func.longPressUpdateClick(this.itemNode,
        (num)=>{
            if (num == 1){
                this.startNum = this.stoneNum
            }
            return this.onClick()
        },
        (num)=>{
            if (this.startNum == this.stoneNum){
                return true
            }
            // if (this.owner.isAddExpFull()){
            //     return true
            // }
            // if (this.stoneNum > this.data.count){
            //     return true
            // }
            Gm.floating(cc.js.formatStr(Ls.get(5294),this.conf.train_exp*(this.stoneNum-this.startNum)))
        })

        Func.longPressUpdateClick(this.jianBtn,(num)=>{
            return this.onJianClick()
        })
    },
    onClick(){
        if (this.owner.isAddExpFull()){
            Gm.floating(8300002)
            return true
        }
        if (this.stoneNum >= this.data.count){
            Gm.floating(8300003)
            return true
        }
        this.setSelectNum(this.stoneNum + 1)
    },
    onJianClick(){
        if (this.stoneNum == 0){
            return true
        }
        this.setSelectNum(this.stoneNum-1)
    },
    getExp(){
        if (this.stoneNum == 0){
            return 0
        }
        return this.conf.train_exp*this.stoneNum
    },
    setSelectNum(num){
        if (this.stoneNum == num){
            return
        }
        this.stoneNum = num
        if (this.stoneNum == 0){
            this.nameLab.string = this.data.count
        }else{
            this.nameLab.string = cc.js.formatStr("%s/%s",this.stoneNum,this.data.count)
        }
        this.jianBtn.active = num > 0
        if (!this.jianBtn.active){
            Func.longPressStop(this.jianBtn)
        }
        this.owner.onItemClick(this)
    },
});


