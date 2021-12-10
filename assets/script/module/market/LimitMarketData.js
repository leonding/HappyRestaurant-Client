cc.Class({
    properties:{

    },
    
    ctor(){

    },

    setBuySuccess(isSuccess){
        this.m_buySuccess = isSuccess
    },

    getBuySuccess(){
        return this.m_buySuccess || false
    },

    setFirstOpen(){
        this.m_isFirstOpen = true 
    },

    getIsFirstOpen(){
        return this.m_isFirstOpen || false
    },
    clearData(){
        this.m_buySuccess = false
        this.m_isFirstOpen = false
    }
    

})