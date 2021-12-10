

cc.Class({
    extends: cc.Component,

    properties: {
        m_oContent:cc.Node,
        m_oBingoNewItem:cc.Node,
        m_oLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    //  onLoad () {
    //  },

    start () {

    },


    setData(turn,data,owner){
        var reward = data.reward
        var limit = data.rewardLimit
        var minTurn = data.minTurn
        var maxTurn = data.maxTurn
        this.owner = owner
        this.data = data
        this.m_newItemList = []
       for(let key in reward){
        
            this.m_oLabel.string =cc.js.formatStr(Ls.get(7700002),minTurn)  
            let bingoNewitem = cc.instantiate(this.m_oBingoNewItem) 
            bingoNewitem.active = true
            let item = Gm.ui.getNewItem(bingoNewitem.getChildByName("itemNode"))
            bingoNewitem.parent = this.m_oContent
            item.setData(reward[key])
            item.setTips(false)
            let script =  bingoNewitem.getComponent("BingoNewItem")
            let idx = this.owner.pushBingoRewardItem(bingoNewitem)
            script.setFb(this.onItemClickCallBack.bind(this))
            script.setData(reward[key],limit[key],idx,minTurn,key )
            this.m_newItemList.push(script)
       }
       
       this.setUI()
    },

    setUI(){
        var currentTurn = Gm.bingoData.getCurrentTurn()
        var isEnterCurrentTurn = currentTurn >=this.data.minTurn
        if(!isEnterCurrentTurn){
            this.m_oLabel.node.color = cc.color(164,146,136,255)
        }else{
            this.m_oLabel.node.color = cc.color(255,255,255,255)
        }

        for(let key in this.m_newItemList){
            if(!isEnterCurrentTurn){
                this.m_newItemList[key].setGray()
            }else{
                this.m_newItemList[key].setOldMaterial()
            }
        }
     
    },

    onItemClickCallBack(idx){
        this.owner.onItemClickCallBack(idx)
    },

    // onDestroy(){
    // }
    // update (dt) {},
});
