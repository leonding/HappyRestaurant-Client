cc.Class({
    properties:{

    },
    
    ctor(){

    },

    isReceived(){
        return this.m_isReceived ||false 
    },

    setIsReceived(isrecive){
        this.m_isReceived  = isrecive
    },
    isOpen(){
        return EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_RANDOM_SKIN) && !Gm.lotterySkinData.isReceived()
    }
})