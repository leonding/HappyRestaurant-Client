// 根据英雄数据计算出阵营职业和英雄以及战力(heroData FightCell)
exports.calculationYokeData = function(heroData){
    var camps = {} //阵营
    var jobs = {}    //职业
    var heros = {}  //英雄
    var tmpTotalFight = 0 //总战力
    for(const i in heroData){
        if (!heroData[i].isLocked()){
            if (heroData[i].m_oData){
                var fight = 0
                if (heroData[i].m_oData.getAttrValue){
                    fight = heroData[i].m_oData.getAttrValue(203)
                }else{
                    fight = heroData[i].m_oData.fight || 0
                }
                var conf = Gm.config.getHero(heroData[i].m_oData.baseId,heroData[i].m_oData.qualityId)
                if(!conf){
                    if (heroData[i].m_oData.heroQualityID){
                        conf = Gm.config.getHero(0,heroData[i].m_oData.heroQualityID)
                    }else if (heroData[i].m_oData.qualityId){
                        conf = Gm.config.getHero(heroData[i].m_oData.baseId,heroData[i].m_oData.qualityId)
                    }
                }
                if (!camps[conf.camp]){
                    camps[conf.camp] = 0
                }
                camps[conf.camp]++
                if (!jobs[conf.job]){
                    jobs[conf.job] = 0
                }
                jobs[conf.job]++
                if (!heros[conf.id]){
                    heros[conf.id] = heroData[i].m_oData.heroId
                }
                tmpTotalFight = tmpTotalFight + fight
            }
        }
    }
    return {camps:camps,jobs:jobs,heros:heros,tmpTotalFight:tmpTotalFight}
}

// 根据英雄数据计算出阵营职业和英雄以及战力(heroData 数据) 战斗界面使用
exports.calculationYokeForBattleData = function(heroData){
    var camps = {} //阵营
    var jobs = {}    //职业
    var heros = {}  //英雄
    var tmpTotalFight = 0 //总战力
    for(const i in heroData){
            var conf = Gm.config.getHero(0,heroData[i].quality)
            if (!camps[conf.camp]){
                camps[conf.camp] = 0
            }
            camps[conf.camp]++
            if (!jobs[conf.job]){
                jobs[conf.job] = 0
            }
            jobs[conf.job]++
            if (!heros[conf.id]){
                heros[conf.id] = 1
            }
    }
    return {camps:camps,jobs:jobs,heros:heros,tmpTotalFight:tmpTotalFight}
}

// data就是calculationYokeData返回的参数
exports.calculationYokeShowIds = function(data,justCan) {
    var camps = data.camps
    var jobs = data.jobs
    var heros = data.heros
    var tmpList = {}
    var m_tYokeAll = this.calculationYokeAll()
    var val = -1
    if (justCan){
        val = 0
    }
    var isNone = true
    for(const i in m_tYokeAll){
        const v = m_tYokeAll[i]
        var tmpCan = 1
        var wid = m_tYokeAll[i].hero
        for(const j in m_tYokeAll[i].need){
            var value = m_tYokeAll[i].need[j]
            if(Math.abs(heros[wid]) > 0){
                if (v.type == 1){//阵营
                    if (camps[j] && camps[j] >= value){
                        m_tYokeAll[i].heroId = heros[wid]
                    }else{
                        tmpCan = val
                        break
                    }
                }else if(v.type == 2){//职业
                    if (jobs[j] && jobs[j] >= value){
                        m_tYokeAll[i].heroId = heros[wid]
                    }else{
                        tmpCan = val
                        break
                    }
                }else{// 女神
                    if (!heros[j]){//heros[j] >= value
                        tmpCan = val
                        break
                    }
                }
            }else{
                tmpCan = 0
                break
            }
        }
        var idx = checkint(i) + 1
        if (tmpCan == 1){
            isNone = false
            tmpList[idx] = true
        }else if(tmpCan == -1){
            isNone = false
            tmpList[idx] = false
        }
    }
    return {ids:tmpList,none:isNone}
}

exports.calculationYokeOne = function(idx){
    if(!this.m_tYokeAll){
        this.calculationYokeAll()
    }
    return this.m_tYokeAll[idx]
}

// 整理羁绊的数据
exports.calculationYokeAll = function(){
    if(!this.m_tYokeAll){
        this.m_tYokeAll = []
        var all = Gm.config.getFaZhenYoke()
        for(const i in all){
            var needs = {}
            for(const j in all[i].condition){
                var idx = all[i].condition[j]
                if (!needs[idx]){
                    needs[idx] = 0
                }
                needs[idx]++
            }
            this.m_tYokeAll.push({id:all[i].id,
                                  type:all[i].type,
                                  need:needs,
                                  hero:all[i].wid,//列阵羁绊需要武将id
                                  fight:all[i].combatCoefficient,
                                  group:all[i].idGroup,
                                  info:all[i].info,
                                  condition:all[i].condition,
                                  attackSkills:all[i].attackSkills,
                                  passiveSkills:all[i].passiveSkills,
                                  attribute:all[i].attribute
                              })
        }
    }
    return this.m_tYokeAll
}

const titleFrame = "share_xjb_ns"
const teamFrame = ["2_xila","2_beiou","2_riben"]
const jobFrame = [5,4,3,6]

const titleFloor = "share_img_kd"
const floorFrame = [6,5,7,11,4,3]
const team_fab = [0,1,2]
const job_fab = [3,4,2,5]
//type 1阵营2职业3本来头像
//idx teamFrame/jobFrame 下标
//sprite 加载头像节点
exports.yokeHeroFrame = function(type,idx,sprite){
    var name = null
    if (type == 1){
        name = titleFrame + teamFrame[idx]
    }else if(type == 2){
        name = titleFrame + jobFrame[idx]
    }
    if (name){
        Gm.load.loadSpriteFrame("img/heroFrame/" +name,function(sp,icon){
            icon.spriteFrame = sp
        },sprite)
    }
}

exports.yokeHeroFloor = function(type,idx,sprite){
    var name = null
    if (type == 1){
        name = titleFloor + floorFrame[team_fab[idx]]
    }else if(type == 2){
        name = titleFloor + floorFrame[job_fab[idx]]
    }
    if (name){
        Gm.load.loadSpriteFrame("img/heroFloor/" +name,function(sp,icon){
            icon.spriteFrame = sp
        },sprite)
    }
}

exports.enemyHeroNeedCheckYoke = function(type){
    if(type == ConstPb.lineHero.LINE_PVP || type == ConstPb.lineHero.LINE_ORE){
        return true
    }
    return false
}

exports.enemyBattleNeedCheckYoke = function(type){
    if(type == ConstPb.battleType.BATTLE_PVP_ARENA || type == ConstPb.battleType.BATTLE_ORE){
        return true
    }
    return false
}