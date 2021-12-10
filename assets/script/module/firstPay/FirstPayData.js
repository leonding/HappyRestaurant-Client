cc.Class({
    properties:{

    },
    
    ctor(){

    },

    //返回当前充值金额在几档
    getCurrntIndex(){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.FIRS_PAY_TYPE)
        var id = 0
        for(let index in config){
            if( Gm.userInfo.getFirstPayTotal() >=  config[index].cost ){
                id++
            }else{
                break
            }
        }
        return id
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
        var newFirstPay = Gm.userInfo.payInfo.newFirstPay
        if(Gm.userInfo.getFirstPayTotal() >= config.cost && newFirstPay.indexOf(id) == -1){
            return canReceive 
        }else if(newFirstPay.indexOf(id) > -1){ 
            return received
        }else if(Gm.userInfo.getFirstPayTotal() < config.cost){
            return noReceive
        }
          
    },

    pushNewFirstId(id){
        if(id >= 1 ){
            Gm.userInfo.payInfo.newFirstPay.push(id)
        }
    },
    isCanReceive(status){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.FIRS_PAY_TYPE)
        for(let index in config){
            if(this.isReceiveFirstActivityReward(config[index].id) == status){
                return true
            }
        }

        return false
    },


    getCanReceiveId(){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.FIRS_PAY_TYPE)
        for(let index in config){
            if(this.isReceiveFirstActivityReward(config[index].id) != 2){
                return index
            }
        }

        return -1
    },

    isReceiveAll(){
        var config = Gm.config.getAccumulativePayConfig(AtyFunc.FIRS_PAY_TYPE)
        for(let index in config){
            if(this.isReceiveFirstActivityReward(config[index].id) == 0 || this.isReceiveFirstActivityReward(config[index].id) == 1){
                return false
            }
        }

        return true
    }
})