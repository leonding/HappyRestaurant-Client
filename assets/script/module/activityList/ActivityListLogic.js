var CoreLogic = require("CoreLogic")
cc.Class({
    extends: CoreLogic,
    properties: {
        
    },
    ctor:function(){

    },
    refresh(data){
        if(data.Import == 1){
            if(this["isOpen_"+data.id]) {
                if( this["isOpen_"+data.id]() ){
                    return true 
                }
            }else if(EventFunc.isOpen(data.type)){
                return  true 
            }
        }
        return false
    },

    refreshOpen(){
        if(this.m_config == undefined){
            this.m_config = Gm.config.getConfig("EventGroupConfig")
            this.m_config.sort((a,b)=>{
                return b.sort - a.sort
            })
        }

        for(let index in this.m_config){
            let data =  Gm.config.getEventGroup(this.m_config[index].id)
            if(this.refresh(data)){
                Gm.activityListData.pushOpenPageId(data.id)
            }else{
                Gm.activityListData.spliceOpenPageId(data.id)
            }
        }
         
    },

    isOpen_1001(){
        return Gm.signData.getEventEndTime() > 0
    },

    isOpen_1002(){
        return Gm.signData.getEventEndTime() > 0
    },

    isOpen_80001(){
        return Gm.lotterySkinData.isOpen()
    },
    isOpen_5001(){
        return Gm.lotteryData.activeIsOpen()
    }

});
