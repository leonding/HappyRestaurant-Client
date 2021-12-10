var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        PictureChessItem:cc.Prefab,
        topNode:cc.Node,
        itemsNode:cc.Node,
        addRich:cc.RichText,
        numRich:cc.RichText,
        pageButtonListPrefab:cc.Prefab,
        pageBtnNode:cc.Node,
        m_oBlankTipNode:cc.Node,//空白页提示                
    },
    onLoad:function(){
        this._super()

        var tmpPre = cc.instantiate(this.pageButtonListPrefab)
        this.pageBtnNode.addChild(tmpPre)
        this.pageBtn = tmpPre.getComponent("PageButtonList")

        

        this.items = []
        this.moveItem
        for (let index = 0; index <= 17; index++) {
            var item = cc.instantiate(this.PictureChessItem)
            item.active = true
            var itemSp = item.getComponent("PictureChessItem")
            if (index == 16){ //拖动
                this.moveItem = itemSp
                item.active = false
                this.itemsNode.addChild(item)
                item.scale = 1
            }else if (index == 17){ //顶部
                this.selectItem = itemSp 
                this.selectItem.setData(null,this)
                item.x = -234.25
                item.y = 1.25
                this.topNode.addChild(item)
            }else{
                this.itemsNode.addChild(item)
                item.scale = 1
                this.items.push(itemSp)
            }
        }
        
        this.itemsNode.on(cc.Node.EventType.TOUCH_START,(event)=>{
            this.touchBegin(event)
        })
        this.itemsNode.on(cc.Node.EventType.TOUCH_MOVE,(event)=>{
            this.touchMove(event)
        })
        this.itemsNode.on(cc.Node.EventType.TOUCH_END,(event)=>{
            this.touchEnd(event)
        })
        this.itemsNode.on(cc.Node.EventType.TOUCH_CANCEL,(event)=>{
            this.touchEnd(event)
        })
    },
    setMoveData(dd){
        this.moveItem.setData(dd,this,this.openData.treasure)
       
        if (dd){
            this.moveItem.node.active = true
            this.moveItem.select(true)
            this.updateSelectItem(dd)
        }else{
            this.moveItem.select(false)
            this.moveItem.node.active = false
        }
    },
    updateSelectItem(dd){
        for (let index = 0; index < this.items.length; index++) {
            const v = this.items[index];
            if (v.data && v.data.id == dd.id){
                Gm.audio.playEffect("music/06_page_tap")
                v.select(true)
                this.selectItem.setData(v.data,this,this.openData.treasure)
            }else{
                v.select(false)
            }
        }
        var str = cc.js.formatStr(Ls.get(2321),this.selectItem.heroConf.name,this.selectItem.skillConf.level)
        this.addRich.string = str + this.selectItem.skillConf.detailed
    },
    touchBegin(event){
        var touchData = this.getItemIndexByTouch(event)
        if (touchData.index > -1){
            var dd = this.items[touchData.index].data
            this.setMoveData(dd)
            if(dd == null){
                return
            }
            this.beginData = touchData
            this.currIndex = touchData.index
            this.items[touchData.index].node.active = false
            var item = this.getItem(this.currIndex)
            this.beganDistance = cc.v2(touchData.pos.x- item.x,touchData.pos.y - item.y)
            this.setCurrItemPos(touchData)
        }
    },
    touchMove(event){
        var touchData = this.getItemIndexByTouch(event)
        this.setCurrItemPos(touchData)
    },
    touchEnd(event){
        var touchData = this.getItemIndexByTouch(event)
        this.setMoveData(null)
        if (this.currIndex > -1){
            this.items[this.currIndex].node.active = true
            if(touchData.index > -1){
                if(this.items[touchData.index].data){//要合成
                    var item =  this.items[this.currIndex]
                    var targetItem = this.items[touchData.index]
                    if (item.skillConf.level == targetItem.skillConf.level){
                        if(item.skillConf.level ==5){
                            Gm.floating(2322)
                        }else{
                            var dd = {page:this.pageBtn.selectType,treasure:this.openData.treasure,nowData:item.data,targetData:targetItem.data}
                            Gm.ui.create("ChessMakeView",dd)
                        }
                    }else{
                        Gm.floating(2323)
                    }
                }
            }
        }
        this.currIndex = -1
    },
    setCurrItemPos(touchData){
        if (this.currIndex > -1){
            this.moveItem.node.x = touchData.pos.x - this.beganDistance.x
            this.moveItem.node.y = touchData.pos.y - this.beganDistance.y
        }
    },
    getItem(index){
        return this.items[index].node
    },
    getItemIndexByTouch(event){
        var nowPos = this.itemsNode.convertToNodeSpaceAR(event.getLocation())
        var itemIndex = -1
        for (let index = 0; index < this.items.length; index++) {
            if (index == this.currIndex){
                continue;
            }
            const v = this.items[index].node;
            var rect = v.getBoundingBox()
            if (rect.contains(nowPos)){
                itemIndex = index
                break
            }
        }
        return {pos:nowPos,index:itemIndex}
    },
    select(){
        this.updateView()
    },
    register:function(){
        this.events[MSGCode.OP_CHESSSKILL_VIEW_S] = this.onUpdateChess.bind(this)
    },
    enableUpdateView(args){
        if(args){
            Gm.audio.playEffect("music/02_popup_open")
            this.pageBtnNode.active = !this.openData.treasure
            this.maxType = Gm.config.getPicturePuzzle(Gm.pictureData.getNowId(this.openData.treasure)).type

            var strs = []
            for (let index = 3; index <= this.maxType; index++) {
                strs.push({str:(index+"x"+index),type:index})        
            }

            this.pageBtn.setData(strs,this)

            this.pageBtn.select( this.maxType)
        }
    },
    onUpdateChess(args){
        this.updateView()
        if (args.type == 1){
            this.updateSelectItem({id:Gm.gamePlayNet.chessTargetId})
        }
    },
    updateView(){
        var list = Gm.pictureData.getChessData(this.pageBtn.selectType,this.openData.treasure)
        if (list == null){
            Gm.gamePlayNet.openChess(this.pageBtn.selectType,this.openData.treasure)
            return 
        }
       for (let index = 0; index < this.items.length; index++) {
           const v = this.items[index];
            v.setData(list[index],this,this.openData.treasure)           
       }
       this.setMoveData(null)
       if (list.length > 0){
            this.updateSelectItem(list[0])
        }

       if (list.length > 16){
        var co = "<color=#593e21>%s</c><color=#64AE3F>%s</color>"
        this.numRich.string = cc.js.formatStr(co,Ls.get(2327),(list.length-16))  
        this.numRich.node.parent.active = true
       }else{
            this.numRich.string = ""
            this.numRich.node.parent.active = false
       }

       this.itemsNode.getComponent(cc.Layout).enabled = false
       this.checkBlank(list)
    },
    onBack(){
        this._super()
    },
    checkBlank:function(data){
        var isBlank = data?data.length == 0:true
        this.m_oBlankTipNode.active = isBlank
    },       
});

