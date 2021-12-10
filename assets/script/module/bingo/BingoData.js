cc.Class({
    properties:{

    },
    
    ctor(){
        this.clearData()
    },

    setCurrentTurn(turn){
        this.m_currTurn = turn
    },

    getCurrentTurn(){
        return this.m_currTurn || 1
    },

    getCurrentTurnData(){
        return Gm.config.getBingoDataByTurn(this.m_currTurn || 1)
    },

    getBingoConfig(){
        return Gm.config.getBingoConfig()
    },
    setSelectCount(args){
        if(args.length > 0 ){
            this.m_selectCount = args
        }
    },

    getSelectCountByIndex(trun,idx){
        var count = 0
        for(let key in this.m_selectCount){
            if (this.m_selectCount[key].minTurn == trun){
                count = this.m_selectCount[key].indexCount[idx] || 0
                break
            }
        }
       return count
    },

    setSelectCountByTurn(trun,idx,num){
        this.m_selectCount = this.m_selectCount == undefined ? []:this.m_selectCount
        var isFind = false
        for(let key in this.m_selectCount){
            if (this.m_selectCount[key].minTurn == trun){
               this.m_selectCount[key].indexCount[idx] = num
               isFind = true 
                break
            }
        }

        if(!isFind){
            let countArray = []
            countArray[idx] = num
            this.m_selectCount.push({
                minTurn:trun,
                indexCount:countArray
            })
        }
    },

    setRightOpenCardIndex(arr){
        if(arr.length > 0 ){
            this.m_openRightCardIndex = arr
        }
    },

    pushRightOpenCardIndex(index,heroId){
        this.m_openRightCardIndex[index] = heroId
    },

    setOpenRightCard(openCardList){
        for(let key in openCardList){
            let idx = openCardList[key].idx 
            let heroQualityId = openCardList[key].heroQualityId 
            this.m_openRightCardIndex[idx] = heroQualityId
        }
    },

    getRightOpenCardIndex(){
        return this.m_openRightCardIndex || []
    },

    setCurrentSelectReward(args){
        this.m_currentSelectReward = args
    },
    getCurrentSelectReward(){
        if(!this.m_currentSelectReward || this.m_currentSelectReward.length == 0){
            return undefined
        }
        return this.m_currentSelectReward
    },

    setRewardIndex(){
        var index = 0
        this.m_rewardIndex = []
        var conf = Gm.config.getBingoConfig()
        for(let k1 in conf){
            for(let k2 in conf[k1].reward){
                this.m_rewardIndex[index] = conf[k1].reward[k2]
                this.m_rewardIndex[index].idx = k2
                this.m_rewardIndex[index].minTurn = conf[k1].minTurn
                index++
            }
        }
    },

    getRewardByIndex(index,minTurn){
        if(!this.m_rewardIndex){
            this.setRewardIndex()
        }
        for(let key in this.m_rewardIndex){
            if(this.m_rewardIndex[key].idx == index && this.m_rewardIndex[key].minTurn == minTurn){
                return this.m_rewardIndex[key]
            }
        }
    },


    getReward(index){
        return this.m_rewardIndex[index]
    },

    getMinTurn(){
        var data = this.getCurrentTurnData()
        var minTurn = data.minTurn

        return minTurn
    },

    setBuyBingoCount(buyCount){
        if(buyCount > 0){
            this.m_buyBingoCouont = buyCount
        }
    },

    getBuyBingoCount(){
        return this.m_buyBingoCouont || 0
    },

    setEnterNewDay(isEnterNewDay){
        this.m_isEnterNewDay =  isEnterNewDay
    },

    getNewDay(){
        return this.m_isEnterNewDay
    },

    clear(){
        this.m_openRightCardIndex =[]
        this.m_currentSelectReward =[]
        this.m_selectRewardIndex = -1
    },
    clearData(){
        this.m_openRightCardIndex =[]
        this.m_currentSelectReward =[]
        this.m_selectCount = []
        this.m_currTurn = null
        this.m_buyBingoCouont = null
        this.m_rewardIndex = []
        this.m_selectRewardIndex = -1
    },

    setSeleRewardIndex(selectIndexReward){
        if(this.m_selectRewardIndex != selectIndexReward){
            this.m_selectRewardIndex = selectIndexReward
        }
    },

    getSeleRewardIndex(){
        return this.m_selectRewardIndex == undefined ? -1 : this.m_selectRewardIndex 
    },
    
    getRewardIndex(minturn,index){
        for(let key in this.m_rewardIndex){
            if(this.m_rewardIndex[key].idx == index &&  this.m_rewardIndex[key].minTurn == minturn){
                return key
            }
        }

    },

})