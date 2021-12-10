var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {
        passLab:cc.Label,
        winLoseDesc:cc.Node,
        winLoseLab:cc.Label,
        timeDesc:cc.Node,
        timeLab:cc.Label,
        itemNode1:cc.Node,
        itemNode2:cc.Node,
        infoNode:cc.Node,
        qualityLabs:{
            default: [],
            type: cc.Label,
        },
        bagFullNode:cc.Node,
        sliverItemNode:cc.Node,
    },
    onLoad(){
        this._super()
        for (let index = 1; index <= 2; index++) {
            var itemSp = Gm.ui.getNewItem(this["itemNode" +index])
            this["itemBase" + index] = itemSp
        }
        this.animNodes = []
        for (let index = 0; index < this.qualityLabs.length; index++) {
            const v = this.qualityLabs[index];
            var pp = v.node.parent.parent
            pp.getChildByName("offline_img_fz").active = false
            this.animNodes.push(pp)
        }
    },
    enableUpdateView:function(args){
        if (args){
            this.data = args
            this.updateNode()
        }
    },
    updateNode:function(){
        var mapConf = Gm.config.getMapById(this.data.mapId)
        this.passLab.string = mapConf.mapName

        var list = [0,0,0,0,0]
        var isSell = [false,false,false,false,false]
        for (var i = 0; i < this.data.award.drop.offlineItem.length; i++) {
            var v = this.data.award.drop.offlineItem[i]
            list[v.baseId-1] = v.itemCount
            if(v.itemType == ConstPb.itemType.ROLE){
                isSell[v.baseId-1] = true
            }
        }

        var con = Gm.config.getQuality()
        for (var i = 0; i < con.length; i++) {
            var v = con[i]
            var num = list[v.childType-1]
            var itemLab = this.qualityLabs[v.childType-1]
            if (isSell[v.childType-1]){
                itemLab.string = v.childTypeName + "x" + 0
            }else{
                itemLab.string = v.childTypeName + "x" + num
            }
        }

        var self = this
        this.scheduleOnce(()=>{
            var self = this
            var sliverIconPos = self.infoNode.convertToNodeSpaceAR(self.itemNode2.convertToWorldSpaceAR(cc.v2(0,0)))

            var playIndex = isSell.length -1
            var playAnim = function(){
                if (playIndex < 0 ){
                    self.animAllComplete()
                    return
                }
                if (isSell[playIndex]){
                    var beginVec = cc.v2(0, 0)
                    const v = self.animNodes[playIndex];
                    v.getChildByName("offline_img_fz").active = true
                    var anim = v.getComponent(cc.Animation)
                    anim.on('finished',function(){
                        for (let index = 0; index < 4; index++) {
                            var newItem = cc.instantiate(self.sliverItemNode)
                            newItem.active = true
                            newItem.x = beginVec.x
                            newItem.y = beginVec.y
                            self.infoNode.addChild(newItem)

                            self.moveSliver(newItem,index,sliverIconPos)
                        }
                        playIndex = playIndex-1
                        playAnim()
                    })
                    anim.play()
                    self.scheduleOnce(()=>{
                        var num = list[playIndex]
                        var itemLab = self.qualityLabs[playIndex]
                        itemLab.string = Ls.get(70010) + num
                        var silverNode = itemLab.node.getChildByName("New Sprite")
                        silverNode.active = true
                        silverNode.x = -45
                        beginVec = self.infoNode.convertToNodeSpaceAR(silverNode.convertToWorldSpaceAR(cc.v2(0, 0)));
                    },0.2)
                }else{
                    playIndex = playIndex-1
                    playAnim()
                }
            }
            playAnim()
        },0.5)
        this.bagFullNode.active = Gm.bagData.isBagSize()

        this.winLoseLab.string = Func.timeToTSFM(this.data.useTime)

        this.itemBase1.updateItem({baseId:2001,count:this.data.award.exp})
        this.itemBase2.updateItem({baseId:1002,count:this.data.award.silver})
        
        if (this.data.quick){
            this.winLoseDesc.getComponent(cc.Label).string = Ls.get(70011)
        }else{
            this.winLoseDesc.getComponent(cc.Label).string = Ls.get(70012)
        }
    },
    moveSliver(item,index,pos){
        var moveTime  = cc.v2(item.x,item.y).sub(pos).mag()/1000
        var delayAc = cc.delayTime(0.1*index)
        var ac = cc.moveTo(moveTime,pos)
        var func = cc.callFunc(function(aa){
            aa.destroy()
        });
        var acs = cc.sequence(delayAc,ac,func)
        item.runAction(acs)
    },
    animAllComplete(){

    },
});

