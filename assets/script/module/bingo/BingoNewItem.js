

cc.Class({
    extends: cc.Component,

    properties: {
        m_selectNum:cc.Label,
        m_selectSprite:cc.Node,
        m_oGray:cc.Material,
        m_oZheNode:cc.Node,
        m_oOld:cc.Material,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {
    // },

    start () {},

    setData(itemData,limit,idx,turn,key){
        this.m_turn = turn
        this.m_key = key
        this.m_limit = limit.id
        this.m_idx = idx
        this.m_itemData = itemData
        this.updateUI()
    },

    updateUI(){
        this.m_currSelecount = Gm.bingoData.getSelectCountByIndex(this.m_turn,this.m_key)
        this.m_oZheNode.active = this.m_currSelecount >= this.m_limit
        this.setBtnEnable(  this.m_turn <= Gm.bingoData.getCurrentTurn() && this.m_currSelecount < this.m_limit)
        this.m_selectNum.string = this.m_limit - this.m_currSelecount
    },

    setOldMaterial(){
        var sprite = this.node.getComponentsInChildren(cc.Sprite)
        for(let i=0 ;i<sprite.length;++i){
            sprite[i].setMaterial(0,this.m_oOld)
        }
        this.setBtnEnable(true)
    },

    setGray(){
        // var itemNode = this.node.getChildByName("itemNode")
        var sprite = this.node.getComponentsInChildren(cc.Sprite)
        for(let i=0 ;i<sprite.length;++i){
            sprite[i].setMaterial(0,this.m_oGray)
        }
        this.setBtnEnable(false)
    },

    setBtnEnable(isEnable){
        var btn = this.node.getComponent(cc.Button)
        btn.interactable = isEnable
    },

    setZhe(){

    },

    onSelectClick(){
        if(this.m_currSelecount < this.m_limit){
            this.m_fb(this.m_idx)
        }
       
    },

    getMinTurnIdx(){
        return parseInt(this.m_key ) 
    },

    getMinTurn(){
        return this.m_turn
    },

    setSelect(isSelect){
        this.m_selectSprite.active = isSelect
    },

    isSelect(){
        return this.m_selectSprite.active
    },

    setFb(fb){
        this.m_fb = fb
    },

    getIdx(){
        return this.m_idx
    },

    getItemData(){
        return this.m_itemData
    },

});
