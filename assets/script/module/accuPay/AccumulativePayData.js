cc.Class({
    properties:{

    },
    
    ctor(){

    },


    //返回当前首充档位是否可以领取
    //1 可以领取
    //0 未达到领取条件
    //2 已经领取
    isReceiveFirstActivityReward(id){
        var noReceive = 0
        var canReceive = 1
        var received  = 2
        var config = Gm.config.getAccumulativePayConfigById(id)
        var receiveStore = this.getReceiveStore()
        var storeAmount = this.getStoreAmount()
        if(storeAmount >= config.cost && receiveStore.indexOf(id) == -1){
            return canReceive 
        }else if(receiveStore.indexOf(id) > -1){ 
            return received
        }else if(storeAmount < config.cost){
            return noReceive
        }
          
    },

    pushNewFirstId(id){
        if(id >= 1 ){
            var receiveStore = this.getReceiveStore()
            receiveStore.push(id)
        }
    },
    isCanReceive(status){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.ACCU_PAY_TYPE)
        for(let index in config){
            if(this.isReceiveFirstActivityReward(config[index].id) == status){
                return true
            }
        }

        return false
    },


    getCanReceiveId(){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.ACCU_PAY_TYPE)
        for(let index in config){
            if(this.isReceiveFirstActivityReward(config[index].id) != 2){
                return index
            }
        }

        return -1
    },

    isReceiveAll(){
        if(EventFunc.isOpen(ConstPb.EventOpenType.EVENTOP_STORE_PAY)){
            var config = Gm.config.getAccumulativePayConfig(AtyFunc.ACCU_PAY_TYPE)
            for(let index in config){
                if(this.isReceiveFirstActivityReward(config[index].id) == 0 || this.isReceiveFirstActivityReward(config[index].id) == 1){
                    return false
                }
            }
        }else{
            return true
        }
    },

    setStoreAmount(total){
        this.m_storeAmount = total
    },

    setReceiveStore(receiveStore){
        this.m_receiveStore = receiveStore
    },

    addStoreAmount(price){
        this.m_storeAmount = this.getStoreAmount() + price
    },
    getStoreAmount(){
        return this.m_storeAmount || 0
    },

    getReceiveStore(){
        return this.m_receiveStore || []
    },

})