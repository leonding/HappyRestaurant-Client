cc.Class({
    extends: cc.Component,
    properties: {
        btn:cc.Button,
        btnSpr:cc.Sprite,
        btnLab:cc.Label,
        giftNode:cc.Node,
        payGiftNode:cc.Node,
        giftStates:{
            default:[],
            type:cc.Node
        }
    },
    setData:function(data,owner,itemNumber){
        this.owner = owner
        this.data = data
        if(itemNumber){
            this.itemNumber = itemNumber
        }
        //var datastr = this.getNumRichLabelAndTipLabelStrByType(this.owner.selectType)
        //this.setNumRichLabelAndTipLabel(datastr)

        this.updateItem()
    },
    showRedItem(btnstr){
        if (this.redNode == null){
            this.redNode = Gm.red.getRedNode(this.btn.node)
        }
        this.redNode.active = (btnstr == Ls.get(5311) || btnstr == Ls.get(5315))
    },
    updateItem(){
        var data = this.getBtnInsAndBtnstrByType(this.owner.selectType)
        var btnStr =data.btnStr
        var ins = data.ins
        this.showRedItem(btnStr)
        this.btn.interactable = ins
        this.btnLab.string = btnStr

        var btnPath = "button_btn_hua2"
        if(Gm.activityData.isPlanGrow(this.owner.selectType)){
            btnPath = "button_btn_hua4"
        }

        Gm.load.loadSpriteFrame("img/button/" +btnPath,function(sp,icon){
            if (icon && icon.node && icon.node.isValid){
                icon.spriteFrame = sp    
            }
        },this.btnSpr)
        this.setGiftNode()
        this.setGiftState()
        this.setItemNumber(ins)
    },
    getRewardNum(){
        var num = 0
        for (let index = 0; index < this.data.reward.length; index++) {
            const v = this.data.reward[index];
            num = num + v.num
        }
        return num
    },
    onBtn(){
        var payType = AtyFunc.PAY_CZJI
        if(this.owner.selectType == AtyFunc.TYPE_TIME_CHAPTER){
            payType = AtyFunc.PAY_ZJLB
        }

        if(this.state ==2 || this.state == 4){
             Gm.activityNet.reward(this.data.id)
        }
        else if(this.state == 3){
            if (!Gm.activityData.isPlanGrow(this.owner.selectType)){
                Gm.ui.create("ActivityTimeNoobBuyView",{type:this.owner.selectType,activityId:payType})
            }
        }
    },
    setGiftNode:function(){
        //Func.destroyChildren(this.giftNode)
        //Func.destroyChildren(this.payGiftNode)

        if(!this.itemSp){
            if( this.data.reward && this.data.reward[0]){
                var award = this.data.reward[0]
                this.itemSp = Gm.ui.getNewItem(this.giftNode,true)
                this.itemSp.setData(award)
            }

            if(this.data.battlePassReward && this.data.battlePassReward[0]){
                var payAward = this.data.battlePassReward[0]
                var itemSp = Gm.ui.getNewItem(this.payGiftNode,true)
                itemSp.setData(payAward)
            }
        }
    },
    setGiftState(){
        //免费的
          if( this.isFinished(this.owner.selectType) ){//已完成
                if(Gm.activityData.isHasFreePlanAty(this.data.id)){
                     this.setStateSpriteState(this.giftStates[0],false,true)
                }
                else{
                     this.setStateSpriteState(this.giftStates[0],false,false)
                }
          }
          else{//未完成
                this.setStateSpriteState(this.giftStates[0],false,false)
          }

         //看收费的
         if(this.isFinished(this.owner.selectType)){//已完成
                if(Gm.activityData.isHasPayPlanAty(this.data.id)){
                     this.setStateSpriteState(this.giftStates[1],false,true)
                }
                else{
                     if(Gm.activityData.isPlanGrow(this.owner.selectType)){
                          this.setStateSpriteState(this.giftStates[1],false,false)
                     }
                     else{
                          this.setStateSpriteState(this.giftStates[1],true,false)
                     }
                    
                }
         }
          else{//未完成
                 this.setStateSpriteState(this.giftStates[1],true,false)
          }

    },
    setStateSpriteState(item,lockKey,getKey){
        item.getChildByName("lockSprite").active = lockKey
        item.getChildByName("getSprite").active = getKey
    },
    setNumRichLabelAndTipLabel(datastr){
        //datastr = datastr || {}
        //.string = datastr.numrichstr || ""
       // this.tipLab.string = datastr.tiplebalstr || ""
    },
    getNumRichLabelAndTipLabelStrByType(type){
        var data = {}
        if(type == AtyFunc.TYPE_TIME_UP){
            var lv = this.data.receiveCondition[0].num
            data.numrichstr = Func.doubleLab(Gm.userInfo.level,lv)
            data.tiplebalstr = cc.js.formatStr(Ls.get(5319),lv)
        }
        else if(type == AtyFunc.TYPE_TIME_CHAPTER){
            var needConfigData = Gm.config.getMapById(this.data.receiveCondition[0].num)
            var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
            
            data.numrichstr = Func.doubleLab(myConfigData.chapter-1,needConfigData.chapter)
            data.tiplebalstr = cc.js.formatStr(Ls.get(5418),needConfigData.chapter)
        }
        return data
    },
    getBtnInsAndBtnstrByType(type){
        var data = {}
        data.btnStr =  ""
        data.ins = true
        if(this.isFinished(type)){//已完成
                if(Gm.activityData.isHasPayPlanAty(this.data.id)){
                    data.btnStr = Ls.get(5312)//已领取
                    data.ins = false
                     this.state = 1
                }
                else{
                     if(Gm.activityData.isPlanGrow(this.owner.selectType)){//已购买
                             data.btnStr =Ls.get(5311)
                             data.ins = true
                              this.state = 2
                     }
                     else{
                           if(Gm.activityData.isHasFreePlanAty(this.data.id)){//免费的已领取
                                    data.btnStr = Ls.get(5316)
                                    data.ins = true
                                    this.state = 3
                            }
                            else{//免费未领取
                                  data.btnStr = Ls.get(5315)
                                  data.ins = true
                                  this.state = 4
                            }
                     }
                }
        }
        else{//未完成
                data.ins = false
                data.btnStr = Ls.get(5320)//未达成
                 this.state = 5
        }
        return data
    },
    isFinished(type){
        if(type == AtyFunc.TYPE_TIME_UP){
                if (this.data.receiveCondition[0].num > Gm.userInfo.level){
                    return false
                }
        }
        else if(type == AtyFunc.TYPE_TIME_CHAPTER){
                var needConfigData = Gm.config.getMapById(this.data.receiveCondition[0].num)
                var myConfigData = Gm.config.getMapById(Gm.userInfo.getMaxMapId())
                if (myConfigData.chapter-1 < needConfigData.chapter){
                    return false
                }
        }
        return true
    },
    setItemNumber(key){
        this.owner.setItemNumber( this.itemNumber,key,this.data)
    }
});


