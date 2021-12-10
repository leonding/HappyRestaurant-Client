var BaseView = require("BaseView")
const TYPE_TUNE = 0
const TYPE_PLAY = 1
// TuneView
cc.Class({
    extends: BaseView,

    properties: {
        m_oPerson:sp.Skeleton,

        m_oShowBack:cc.Node,
        m_oShowNode:cc.Node,
        m_oInfoItem:cc.Node,
        m_oInfoNode:cc.Node,
        m_oBefore:cc.ScrollView,
        m_oAfter:cc.ScrollView,
        m_oLevelLab:cc.Label,
        m_oLoveBar:cc.ProgressBar,
        m_oLoveLab:cc.Label,
        m_oItemSpr: {
            default: [],
            type: cc.Sprite,
        },
        m_oItemLab: {
            default: [],
            type: cc.RichText,
        },
        m_oBtnTune:cc.Button,

        m_oRateBack:cc.Node,
        m_oRateNode:cc.Node,
        m_oPlayBar:cc.ProgressBar,
        m_oPlayLab:cc.Label,

        m_oTipsNode:cc.Node,
        m_oFlashFab:cc.Prefab,
        m_oPlayItem:cc.Node,
        m_oPlayFrame: {
            default: [],
            type: cc.SpriteFrame,
        },
    },
    onLoad(){
        this._super()
        var items = Gm.config.getItemsByType(120)
        for(const i in items){
            if (this.m_oItemSpr[i]){
                this["loadBtn"+i](items[i].id)
            }
        }
        const bet_width = 200
        var getAngleByPoint = function(x,y){
            return y>0 ? Math.acos(x/Math.sqrt(x*x+y*y)) : 2*Math.PI-Math.acos(x/Math.sqrt(x*x+y*y))
        }
        this.m_oRateNode.on(cc.Node.EventType.TOUCH_END,function  (event) {
            // this.onPlayClick()
            if (!this.m_oPlayVec){
                this.onPlayClick()
            }
        }.bind(this))
        this.m_oRateNode.on(cc.Node.EventType.TOUCH_MOVE,function  (event) {
            var tmpX = this.m_oPlayPt.x - event.touch._point.x
            var tmpY = this.m_oPlayPt.y - event.touch._point.y
            var tmpVector = {x:0,y:0}
            var tmpCan = false
            if (Math.abs(tmpX) > bet_width || Math.abs(tmpY) > bet_width){
                tmpCan = true
                tmpVector.x = tmpX
                this.m_oPlayPt.x = event.touch._point.x
                tmpVector.y = tmpY
                this.m_oPlayPt.y = event.touch._point.y
            }
            if (tmpCan){
                if (this.m_oPlayVec){
                    var kVector = getAngleByPoint(tmpVector.x,tmpVector.y)
                    var kPlayer = getAngleByPoint(this.m_oPlayVec.x,this.m_oPlayVec.y)
                    // console.log("kVector==:",kVector,kPlayer)
                    if (Math.abs(kVector - kPlayer) > 0.3){
                        this.onPlayClick()
                    }
                    this.m_oPlayVec = tmpVector
                }else{
                    this.m_oPlayVec = tmpVector
                    this.onPlayClick()
                }
            }
        }.bind(this))
        this.m_oRateNode.on(cc.Node.EventType.TOUCH_START,function  (event) {
            this.m_oPlayPt = {x:event.touch._point.x,y:event.touch._point.y}
            this.m_oPlayVec = null
        }.bind(this))
    },
    onEnable:function(){
        this._super()
    },
    enableUpdateView:function(args){
    	if (args){
            this.m_oData = args
            var tmpHeroData = Gm.config.getHero(this.m_oData.baseId)
            this.m_iQuality = tmpHeroData.quality
            Gm.load.loadSkeleton(tmpHeroData.rolePic,function(sp,owner){
                // console.log("fashi===:",owner)
                owner.skeletonData = sp
                owner.setAnimation(0, "ziran", true)
            },this.m_oPerson)
            this.updateView(this.m_oData)
        }
    },
    updateView:function(args){
        this.m_oData = args
        if (this.m_oData.tuneRate != -1){
            this.updateRunType(TYPE_PLAY)
        }else{
            this.updateRunType(TYPE_TUNE)
        }
    },
    updateTune:function(){
        var tmpMaxInt = Gm.config.getConst("max_intimacy")
        var tmpLevel = this.m_oData.tuneLevel || 0

        var tmpIntimacy = this.m_oData.tuneIntimacy || 0
        this.m_oLoveLab.string = "X"+tmpIntimacy

        this.m_oLoveBar.progress = tmpIntimacy/tmpMaxInt

        var tmpCan = true
        var need = Gm.config.getTuneByTwo(tmpLevel+1,this.m_iQuality)
        Func.destroyChildren(this.m_oBefore.content)
        Func.destroyChildren(this.m_oAfter.content)
        if (need){
            this.m_oInfoNode.active = true
            for(const i in need.attributeStr){
                var tmpId = need.attributeStr[i].id
                var tmpName0 = Gm.config.getBaseAttr(tmpId)
                var tmpValue = this.m_oData.getAttrValue(tmpId)

                var item1 = cc.instantiate(this.m_oInfoItem)
                var item2 = cc.instantiate(this.m_oInfoItem)
                item1.active = true
                item2.active = true

                item1.getChildByName("lab1").getComponent(cc.Label).string = tmpName0.childTypeName
                item2.getChildByName("lab1").getComponent(cc.Label).string = tmpName0.childTypeName
                item1.getChildByName("lab1").color = new cc.Color(13,232,0)

                item1.getChildByName("lab2").getComponent(cc.Label).string = tmpValue+need.attributeStr[i].num
                item2.getChildByName("lab2").getComponent(cc.Label).string = tmpValue
                item1.getChildByName("lab2").color = new cc.Color(13,232,0)


                this.m_oBefore.content.addChild(item2)
                this.m_oAfter.content.addChild(item1)
            }
        }else{
            tmpLevel = "max"
            tmpCan = false
            this.m_oInfoNode.active = false
        }
        this.m_oLevelLab.string = Ls.lv()+tmpLevel

        var items = Gm.config.getItemsByType(120)
        var tmpBiTb = []
        for(const i in items){
            var item = Gm.bagData.getItemByBaseId(items[i].id)
            var needCk = 0
            if (need){
                for(const j in need.itemStr){
                    if (need.itemStr[j].id == items[i].id){
                        needCk = need.itemStr[j].num
                        break
                    }
                }
            }
            var tmpHas = false
            var tmpStr = ""

            var count1  = 0 
            var count2 = 0
            if (item && item.count){
                if (needCk <= item.count){
                    tmpHas = true
                }
                tmpStr = item.count + "/"+ needCk
                count1 = item.count 
                count2 = needCk
            }else{
                if (needCk == 0){
                    tmpHas = true
                }else{
                    tmpStr = needCk+"/0"
                    count1 = needCk
                }
            }
            if (needCk == 0){
                this.m_oItemSpr[i].node.active = false
                this.m_oItemLab[i].node.active = false
            }else{
                this.m_oItemLab[i].string = Func.doubleLab(count1,count2)
                this.m_oItemSpr[i].node.active = true
                this.m_oItemLab[i].node.active = true
                tmpBiTb.push(i)
            }
            if (tmpHas){
                // this.m_oItemLab[i].node.color = new cc.Color(255,255,255)
            }else{
                tmpCan = false
                // this.m_oItemLab[i].node.color = new cc.Color(252,21,0)
            }
        }
        const widwdi = 200
        this.m_oBtnTune.interactable = tmpCan
        var tmpLens = tmpBiTb.length
        var tmpBgn = -tmpLens/2 * widwdi + 40
        for(var i = 0;i < tmpLens;i++){
            var tmpX = tmpBgn + i * widwdi
            this.m_oItemSpr[tmpBiTb[i]].node.x = tmpX
            this.m_oItemLab[tmpBiTb[i]].node.x = tmpX + 40
        }
    },
    updatePlay:function(){
        var tmpMax = 100
        this.m_oPlayBar.progress = this.m_oData.tuneRate/tmpMax
        this.m_oPlayLab.string = this.m_oData.tuneRate+"%"
        var tmpMaxInt = Gm.config.getConst("tune_text")
        if (this.m_bWait && this.m_oData.tuneRate % tmpMaxInt == 0){
            var tmpRet = Gm.config.getTuneByRandom(this.m_oData.baseId)
            this.insertText(tmpRet,this.m_oPlayPt)

            var item = cc.instantiate(this.m_oFlashFab)
            var animation = item.getComponent(cc.Animation)
            animation.on('finished',function(){
                item.destroy()
            })
            this.m_oTipsNode.addChild(item)
            item.x = this.m_oPlayPt.x - this.m_oTipsNode.width/2
            item.y = this.m_oPlayPt.y - this.m_oTipsNode.height/2
        }
        this.m_bWait = false
    },
    updateRunType:function(destType){
        if (this.m_iRunType != destType){
            this.m_iRunType = destType
            if (TYPE_TUNE == this.m_iRunType){
                this.m_oShowBack.active = true
                this.m_oRateBack.active = false
                this.m_oShowNode.active = true
                this.m_oRateNode.active = false
                this.updateTune()
            }else{
                this.m_oShowBack.active = false
                this.m_oRateBack.active = true
                this.m_oShowNode.active = false
                this.m_oRateNode.active = true
                this.updatePlay()
            }
        }else{
            if (TYPE_TUNE == this.m_iRunType){
                this.updateTune()
            }else{
                this.updatePlay()
            }
        }
    },
    onPlayClick:function(){
        if (this.m_oData.tuneRate >= 0 && this.m_oData.tuneRate <= 100 && !this.m_bWait){
            this.m_bWait = true
            Gm.heroNet.sendTune(this.m_oData.heroId,1)
        }
    },
    insertText:function(args,point){
        if (!this.m_tTextTb){
            this.m_tTextTb = []
        }
        var item = cc.instantiate(this.m_oPlayItem)
        item.active = true
        this.m_oTipsNode.addChild(item)
        var label = item.getChildByName("label")
        label.getComponent(cc.Label).string = args.text
        var tmpIdx = Func.random(0,this.m_oPlayFrame.length)
        item.getComponent(cc.Sprite).spriteFrame = this.m_oPlayFrame[tmpIdx]
        item.x = point.x - this.m_oTipsNode.width/2
        item.y = point.y - this.m_oTipsNode.height/2
        var delayAc = cc.delayTime(1.5)
        var ac = cc.fadeOut(3)
        var func = cc.callFunc(function(){
            item.destroy()
        }, this);
        // var func = cc.destroySelf()
        var acs = cc.sequence(delayAc,ac,func)
        item.runAction(acs)
        label.on("size-changed", function(){
            var label = item.getChildByName("label")
            item.width = label.width + 20
        }, item)
    },
    onTuneClick:function(){
        var tmpLevel = this.m_oData.tuneLevel || 0
        var need = Gm.config.getTuneByTwo(tmpLevel+1,this.m_iQuality)
        var items = Gm.config.getItemsByType(120)
        var tmpCan = true
        if (need){
            for(const i in items){
                var item = Gm.bagData.getItemByBaseId(items[i].id)
                var needCk = 0
                if (need){
                    for(const j in need.itemStr){
                        if (need.itemStr[j].id == items[i].id){
                            needCk = need.itemStr[j].num
                            break
                        }
                    }
                }
                if (item && item.count){
                    if (needCk && needCk > item.count){
                        tmpCan = false
                    }
                }else{
                    if (needCk != 0){
                        tmpCan = false
                    }
                }
            }
        }else{
            tmpCan = false
        }
        if (tmpCan){
            Gm.heroNet.sendTune(this.m_oData.heroId,0)
        }else{
            Gm.floating(Ls.get(700001))
        }
    },
    onCloseClick:function(){
    	this.onBack()
    },
    loadBtn0:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            this.m_oItemSpr[0].spriteFrame = sp
        }.bind(this))
    },
    loadBtn1:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            this.m_oItemSpr[1].spriteFrame = sp
        }.bind(this))
    },
    loadBtn2:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            this.m_oItemSpr[2].spriteFrame = sp
        }.bind(this))
    },
    loadBtn3:function(tmpId){
        Gm.ui.getConstIcon(tmpId,function(sp){
            this.m_oItemSpr[3].spriteFrame = sp
        }.bind(this))
    },
});

