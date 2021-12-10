var BaseView = require("BaseView")

// TravelOneKey
cc.Class({
    extends: BaseView,
    properties: {
        m_oCellNode:cc.Node,
        m_oScroll:cc.ScrollView,
        m_oBtn:cc.Button,
        m_oNoneNode:cc.Node,
        m_oTipsLab:cc.Label,
    },
    onLoad:function(){
        this._super()
        this.popupUI.setTitle(Ls.get(600069))
    },
    enableUpdateView:function(args){
        if (args){
            this.items = []
            this.m_iType = args.type
            this.m_tSelf = this.getHeroCamps(Gm.heroData.getAll())
            this.m_tAids = []
            // console.log("args.type==:",args.type)
            if (args.type == 2){
                this.m_oTipsLab.string = Ls.get(600114)
                this.other = true
                this.m_tAids = this.getHeroCamps(Gm.travelData.m_tAidList)
            }else{
                this.m_oTipsLab.string = Ls.get(600113)
            }
            var idx = this.transData(args)
            var isNone = true
            if (this.m_tList[idx]){
                for(const i in this.m_tList[idx]){
                    // console.log("ans==:",this.m_tList[idx][i],this.m_tOther[idx][i])//
                    if (this.m_tList[idx][i].length > 0){
                        isNone = false
                        var item = cc.instantiate(this.m_oCellNode)
                        item.active = true
                        this.m_oScroll.content.addChild(item)
                        var spt = item.getComponent("TravelOKCell")
                        spt.setOwner(this,args.list[i])
                        for(const j in this.m_tList[idx][i]){
                            var hero = null
                            var isHire = false
                            if (this.m_tList[idx][i][j] == this.m_tOther[idx][i]){
                                hero = this.getHire(this.m_tList[idx][i][j])
                                isHire = true
                            }else{
                                hero = Gm.heroData.getHeroById(this.m_tList[idx][i][j])
                            }
                            spt.pushHero(hero,isHire)
                        }
                        this.items.push(spt)
                    }
                }
            }
            this.m_oNoneNode.active = isNone
        }
    },
    revertHeroId:function(heroId,hero,list){
        var pushList = function(_camp,_quality,_id){
            if (!list[_camp]){
                list[_camp] = []
            }
            if (!list[_camp][_quality]){
                list[_camp][_quality] = []
            }
            list[_camp][_quality].push(_id)
        }
        var conf = Gm.config.getHero(hero.baseId || 0,hero.qualityId)
        pushList(conf.camp,conf.quality,hero.heroId)
    },
    getHeroCamps:function(heros){
        var list = []
        var pushList = function(_camp,_quality,_id){
            if (!list[_camp]){
                list[_camp] = []
            }
            if (!list[_camp][_quality]){
                list[_camp][_quality] = []
            }
            list[_camp][_quality].push(_id)
        }
        for(const i in heros){
            var cheack = Gm.travelData.cheackHero(heros[i].heroId,this.m_iType)
            if (cheack == 1){
                var conf = Gm.config.getHero(heros[i].baseId || 0,heros[i].qualityId)
                pushList(conf.camp,conf.quality,heros[i].heroId)
            }
        }
        // for(const i in list){
        //     for(const j in list[i]){
        //         console.log("hcamp==:",i,"hquality==:",j,"list===:",list[i][j].length)
        //     }
        // }
        return list
    },
    isSameHero:function(hero,idx,pos){
        var hConf = Gm.config.getHero(hero.baseId || 0,hero.qualityId)
        for(const i in this.m_tList[idx]){
            for(var j = 0;j < this.m_tList[idx][i].length;j++){
                var jId = this.m_tList[idx][i][j]
                if (jId == hero.heroId){
                    // console.log("isSameHero==:",hero.heroId,jId)
                    return 0
                }else if(pos == j){
                    var jHero = null
                    if (jId == this.m_tOther[idx][i]){
                        jHero = this.getHire(jId)
                    }else{
                        jHero = Gm.heroData.getHeroById(jId)
                    }
                    var jConf = Gm.config.getHero(jHero.baseId || 0,jHero.qualityId)
                    if (jConf.id == hConf.id){
                        // console.log("isSameHero==:",jConf.id,hConf.id)
                        return 0
                    }
                }
            }
        }
        return hero.heroId
    },
    getHeroId:function(isHire,camp,quality,idx,pos){
        var heros = null
        if (isHire){
            heros = this.m_tAids
        }else{
            heros = this.m_tSelf
        }
        var heroId = 0
        if (heros[camp]){
            for(var i = Number(quality);i < heros[camp].length;i++){
                for(const j in heros[camp][i]){
                    var hero = null
                    if (isHire){
                        hero = this.getHire(heros[camp][i][j])
                    }else{
                        hero = Gm.heroData.getHeroById(heros[camp][i][j])
                    }
                    heroId = this.isSameHero(hero,idx,pos)
                    // console.log("heroId===:",heroId)
                    if (heroId > 0){
                        return heroId
                    }
                }
            }
        }
        return heroId
    },
    transData:function(args){
        this.m_tList = []
        this.m_tOther = []
        for(const i in args.list){
            var qualityMin = 0 // 最低品质
            var qualityNum = 0 // 最低品质数量
            var camp = []
            for(const j in args.list[i].config.conditionStr){
                var conf = args.list[i].config.conditionStr[j]
                if (conf.type < 7000){ // 品质
                    qualityMin = conf.type
                    qualityNum = conf.condition
                }else{
                    var need = conf.type % 10
                    for(var k = 0;k < conf.condition;k++){
                        camp.push(need)
                    }
                }
            }
            // console.log("====:",args.list[i].config.conditionStr)
            var need = this.checkAry(qualityMin,qualityNum,camp)
            this.checkNeed(Number(i),need)
        }
        var ret = 0
        var num = 0
        for(const i in this.m_tList){
            var rNum = 0
            var isAll = true
            for(const j in this.m_tList[i]){
                if (this.m_tList[i][j].length > 0){
                    rNum++
                }else{
                    isAll = false
                }
            }
            if (isAll){
                ret = i
                break
            }else{
                if (rNum > num){
                    num = rNum
                    ret = i
                }
            }
        }
        return ret
    },
    pushList:function(group,idx,heroId,isHire){
        if (!this.m_tList[group][idx]){
            this.m_tList[group][idx] = []
            this.m_tOther[group][idx] = 0
        }
        if (heroId > 0){
            this.m_tList[group][idx].push(heroId)
        }
        if (isHire){
            this.m_tOther[group][idx] = heroId
        }
    },
    checkNeed:function(idx,need){
        var len = this.m_tList.length
        if (need.length > 1 && len > 0){
            for(var j = 1;j < need.length;j++){
                for(var i = 0;i < len;i++){
                    this.m_tList[j*len+i] = Func.copyObj(this.m_tList[i])
                    this.m_tOther[j*len+i] = Func.copyObj(this.m_tOther[i])
                }
            }
        }
        for(var i = 0;i < need.length;i++){
            for(const j in need[i]){
                // console.log("need[i]===:",i,need[i][j])
                var camp = need[i][j].c
                var quality = need[i][j].q
                var isHire = need[i][j].h
                if (len == 0){
                    if (!this.m_tList[i]){
                        this.m_tList[i] = []
                        this.m_tOther[i] = []
                    }
                    var heroId = this.getHeroId(isHire,camp,quality,i,idx)
                    this.pushList(i,idx,heroId,isHire)
                }else{
                    for(var k = 0;k < len;k++){
                        var nIdx = i * len + k
                        var heroId = this.getHeroId(isHire,camp,quality,nIdx,idx)
                        this.pushList(nIdx,idx,heroId,isHire)
                    }
                }
            }
        }
        var nLen = need[0].length
        for(var j = 0;j < this.m_tList.length;j++){
            var tLen = this.m_tList[j][idx].length
            if (nLen > tLen){ // 未完成的清空
                this.m_tOther[j][idx] = 0
                this.m_tList[j][idx] = []
            }
        }
    },
    getHire:function(heroId){
        for(const i in Gm.travelData.m_tAidList){
            if (Gm.travelData.m_tAidList[i].heroId == heroId){
                return Gm.travelData.m_tAidList[i]
            }
        }
    },
    checkAry:function(min,num,camp){
        var ary = this.spliceTab(camp,num)
        // console.log("ary===:",num,ary)
        var ret = []
        var getQua = function(isMin){
            var group = 1
            if (isMin){
                group = min
            }
            return group
        }
        // title 特殊处理的
        var pushRet = function(i,_camp,_quality){
            if (!ret[i]){
                ret[i] = []
            }
            ret[i].push({c:_camp,q:_quality})
        }
        for(var i = 0;i < ary.length;i++){
            var max = ary[i].length
            var num = 0
            for(const k in camp){
                if (max == num){
                    pushRet(i,camp[k],getQua(false))
                }else{
                    var isMin = false
                    for(const j in ary[i]){
                        if (camp[k] == ary[i][j]){
                            isMin = true
                            break
                        }
                    }
                    if (isMin && max > num){
                        num++
                        pushRet(i,camp[k],getQua(true))
                    }else{
                        pushRet(i,camp[k],getQua(false))
                    }
                }
            }
        }
        if (this.other){
            var len = ret.length
            for(var i = 0;i < len;i++){
                var iLen = ret[i].length
                for(var j = 1;j < iLen;j++){
                    var nIdx = len + (j - 1) + i*(len - 1)
                    // console.log("nIdx===:",nIdx)
                    ret[nIdx] = Func.copyObj(ret[i])
                    ret[nIdx][j].h = true
                }
                ret[i][0].h = true
            }
        }
        return ret
    },
    // 将数组分割成len长度的不重复数组
    spliceTab:function(list,len){
        var tab = []
        var idx = []
        for(var i = 0;i < len;i++){
            idx.push(i)
        }
        var p = idx.length - 1
        while(idx[0] + len <= list.length){
            for(var i = idx[p];i < list.length;i++){
                var t = []
                for(var j = 0;j < idx.length - 1;j++){
                    t.push(list[idx[j]])
                }
                t.push(list[i])
                tab.push(t)
                idx[p] = i
            }
            var q = 0
            for(var i = idx.length - 1;i > 0;i--){
                q = i
                if (idx[i] - idx[i-1] != 1){
                    break
                }
            }
            idx[q-1]++
            for(var j = q;j < idx.length;j++){
                idx[j] = idx[j-1] + 1
            }
        }
        for(var i = tab.length;i >= 0;i--){
            var same = false
            for(var j = i - 1;j >= 0;j--){
                var isAll = true
                for(const k in tab[i]){
                    if (tab[i][k] != tab[j][k]){
                        isAll = false
                        break
                    }
                }
                if (isAll){
                    same = true
                    break
                }
            }
            if (same){
                tab.splice(i,1)
            }
        }
        return tab
    },
    onOkClick:function(){
        var list = []
        for(const i in this.items){
            if (this.items[i].m_oBtnDui.active){
                list.push({index:this.items[i].m_iIndex,heroIds:this.items[i].m_tHeros})
            }
        }
        if (list.length > 0){
            Gm.travelNet.sendTravelTaskStart(list)
        }else{
            this.onBack()
        }
    },
});

