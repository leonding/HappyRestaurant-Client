// TeamFilter

const TF_FIRST = 0
const TF_SECOND = 1

cc.Class({
    extends: cc.Component,

    properties: {
        firstNode:cc.Node,
        selectFilter:cc.Node,
        firstBtnNod:cc.Node,
        firstBtn:cc.Node,

        twoBtn:cc.Node,

        secondNode:cc.Node,
        selectJob:cc.Node,
        secondBtnNod:cc.Node,
        secondBtn:cc.Node,
    },
    hideBtn(show){
        if (show == null){
            return
        }
        this.isHide = show
        this.firstBtn.active = this.isHide
        this.twoBtn.active = this.isHide
    },
    setCallBack:function(filter,job,func){
        this.m_fCall = func
        this.updateType(TF_FIRST)
        this.updateSelet(filter || 0,job || 0)
    },
    updateType:function(destType){
        if (destType != this.m_iRunType){
            this.m_iRunType = destType
            this.firstNode.active = false
            this.secondNode.active = false
            this.selectJob.active = false
            this.secondBtnNod.active = false
            this.firstBtn.active = false
            this.secondBtn.active = false
            if (this.m_iRunType == TF_FIRST){
                this.node.width = this.firstNode.width
                this.firstNode.active = true
                this.firstBtn.active = true
            }else{
                this.node.width = this.secondNode.width
                this.secondNode.active = true
                this.selectJob.active = true
                this.secondBtnNod.active = true
                this.secondBtn.active = true
            }
            this.hideBtn(this.isHide)
        }
    },
    updateSelet:function(filter,job){
        var tmpCan = false
        if (filter != this.m_iFilterValue){
            this.m_iFilterValue = filter
        }
        if (job != this.m_iJobValue){
            this.m_iJobValue = job
        }
        var tmpDeal = function(tb,idx,nod){
            for(let i = 0;i < tb.children.length;i++){
                if (i == idx){
                    nod.x = tb.children[i].x + tb.x
                    break
                }
            }
        }
        tmpDeal(this.firstBtnNod,this.m_iFilterValue,this.selectFilter)
        tmpDeal(this.secondBtnNod,this.m_iJobValue,this.selectJob)
        this.m_fCall(filter,job)
    },
    onFilterClick:function(){
        Gm.audio.playEffect("music/06_page_tap")
        this.updateSelet(0,this.m_iJobValue)
    },
    onFilterType:function(sender,value){
        if (value){
            Gm.audio.playEffect("music/06_page_tap")
            this.updateSelet(parseInt(value),this.m_iJobValue)
        }
    },
    onJobClick:function(){
        Gm.audio.playEffect("music/06_page_tap")
        this.updateSelet(this.m_iFilterValue,0)
    },
    onJobType:function(sender,value){
        if (value){
            Gm.audio.playEffect("music/06_page_tap")
            this.updateSelet(this.m_iFilterValue,parseInt(value))
        }
    },
    onTypeChange:function(sender,value){
        if (value){
            Gm.audio.playEffect("music/06_page_tap")
            this.updateType(parseInt(value))
        }
    },
    setForbidden(){
        for (let index = 0; index < this.firstBtnNod.children.length; index++) {
            const v = this.firstBtnNod.children[index];
            v.getComponent(cc.Button).interactable = this.m_iFilterValue == index
        }
    },
    reset(){
        if(this.m_iRunType != TF_FIRST){
            this.updateType(TF_FIRST)
        }
        var tmpDeal = function(tb,idx,nod){
            for(let i = 0;i < tb.children.length;i++){
                if (i == idx){
                    nod.x = tb.children[i].x + tb.x
                    break
                }
            }
        }
        if(this.m_iFilterValue != 0){
            this.m_iFilterValue = 0
            tmpDeal(this.firstBtnNod,this.m_iFilterValue,this.selectFilter)
        }
        if(this.m_iJobValue != 0){
            this.m_iJobValue = 0
            tmpDeal(this.secondBtnNod,this.m_iJobValue,this.selectJob)
        }
    },
});

