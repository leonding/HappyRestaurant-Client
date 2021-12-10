var HeroInfo = require("HeroInfo")
cc.Class({
    properties: {
       
    },
    ctor:function(){
        this.clearData()
    },
    clearData:function(){
        this.friendList = []
        this.applyList = []
        this.blackList = []
        this.aidList = []

         //租借
        this.hireList = []
        this.hireLends = []
        this.hireApplys = []
 
        this.canHireAids = []
        this.hireCountList = []
    },
    setData(list,applys,blacks){
        this.friendList = list
        this.applyList = applys
        this.blackList = blacks || []

        this.collectFriendPointNum = 0

       

        this.loginTime = Gm.userData.getTime_s()
    },
    setCanHire(list){
        this.canHireAids = list
    },
    getFightTeamHire(){
        var list = []
        for (let index = 0; index < this.hireList.length; index++) {
            const v = this.hireList[index];

            var dd = {}
            dd.heroId = v.heroId
            dd.level = Gm.heroData.getMaxHeroLv()
            dd.qualityId = v.qualityId
            dd.baseId = Gm.config.getQulityHero(v.qualityId).idGroup
            dd.attribute = [{attrId:203,attrValue:100}]
            dd.ownerName = v.ownerName

            var hero = new HeroInfo()
            hero.setData(dd)
            hero.isHire = true
            list.push(hero)
        }
        return list
    },
    getHireByHeroId(heroId){
        for (let index = 0; index < this.hireList.length; index++) {
            const v = this.hireList[index];
            if (v.heroId == heroId){
                var dd = {}
                dd.heroId = v.heroId
                dd.level = Gm.heroData.getMaxHeroLv()
                dd.qualityId = v.qualityId
                dd.baseId = Gm.config.getQulityHero(v.qualityId).idGroup
                dd.attribute = [{attrId:203,attrValue:100}]
                dd.ownerName = v.ownerName

                var hero = new HeroInfo()
                hero.setData(dd)
                hero.isHire = true
                return hero
            }
        }
    },
    setHireAid(args){
        var hireList = args.hireList || []
        var lendList = args.lendList || []
        var applys = args.applyList || []
        var countList = args.countList || []

        if (args.expireTime){
            this.hireExpireTime = args.expireTime    
        }

        for (let index = 0; index < hireList.length; index++) {
            const v = hireList[index];
            this.hireList.push(v)
        }
        for (let index = 0; index < lendList.length; index++) {
            const v = lendList[index];
            var hero = Gm.heroData.getHeroById(v.heroId)
            v.qualityId = hero.qualityId
            v.fight = hero.getFight()
            this.hireLends.push(v)
        }
        for (let index = 0; index < applys.length; index++) {
            const v = applys[index];
            if (Func.forBy(this.hireApplys,"heroId",v.heroId) == null){
                var hero = Gm.heroData.getHeroById(v.heroId)
                v.qualityId = hero.qualityId
                v.fight = hero.getFight()
                this.hireApplys.push(v)
            }
        }

        for (let index = 0; index < countList.length; index++) {
            const v = countList[index];
            this.hireCountList.push(v)
        }
    },
    getTowerType(type){
        var newType = type
        if (newType == ConstPb.lineHero.LINE_TOWER1 || newType == ConstPb.lineHero.LINE_TOWER2 || newType == ConstPb.lineHero.LINE_TOWER3){
            newType = ConstPb.lineHero.LINE_TOWER
        }
        return newType
    },
    setHireCount(type){
        var newType = this.getTowerType(type)
        var data = Func.forBy(this.hireCountList,"lineType",newType)
        if(data){
            data.count = data.count +1
        }else{
            this.hireCountList.push({lineType:newType,count:1})
        }
    },
    getHireCount(type){
        var newType = this.getTowerType(type)
        var data = Func.forBy(this.hireCountList,"lineType",newType)
        cc.log(data,newType,this.hireCountList)
        if (data){
            return data.count
        }
        return 0
    },
    getCanHireHeads(filter=0,job=0){
        var list = []
        for (let index = 0; index < this.canHireAids.length; index++) {
            const v = this.canHireAids[index];
            var hero = Gm.config.getHero(0,v.qualityId)
            if ((filter == 0 || filter == hero.camp)&&(job == 0 || job == hero.job)){
                var dd = Func.forBy(list,"idGroup",hero.idGroup)
                if(dd == null){
                    dd = {idGroup:hero.idGroup,list:[]}
                    list.push(dd)
                }
                dd.list.push(v)
            }
        }
        return list
    },
    getApplyHireNum(){
        var num = 0
        for (let index = 0; index < this.canHireAids.length; index++) {
            const v = this.canHireAids[index];
            if (v.request){
                num = num + 1
            }
        }
        return num
    },
    changeOffOn(list){
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            var friend = this.getFriend(v.playerId)
            if (friend){
                friend.leaveTime = v.leaveTime
            }
        }
    },  
    isFull(num = 0){
        return this.friendList.length + num > Gm.config.getVip().friendNum
    },
    delFriend(id){
        Func.forRemove(this.friendList,"playerId",id)
    },
    delApply(id){
        Func.forRemove(this.applyList,"playerId",id)
    },
    delBlack(id){
        Func.forRemove(this.blackList,"playerId",id)
    },
    addFriend(data){
        this.friendList.unshift(data)
    },
    addApply(data){
        this.applyList.unshift(data)
    },
    addBlack(data){
        this.blackList.unshift(data)
    },
    getBlack(id){
        return Func.forBy(this.blackList,"playerId",id)
    },
    getFriend(id){
        return Func.forBy(this.friendList,"playerId",id)
    },
    getApply(id){
        return Func.forBy(this.applyList,"playerId",id)
    },
    getOnlineFriends(){
        var list = []
        for (let index = 0; index < this.friendList.length; index++) {
            const v = this.friendList[index];
            if (v.leaveTime == 0){
                list.push(v)
            }
        }
        return list
    },
    getAidByHeroId(heroId){
        return Func.forBy(this.aidList,"heroId",heroId) 
    },
    removeAid(heroId){
        return Func.forRemove(this.aidList,"heroId",heroId)
    },
    getRevPointNum(){
        return this.collectFriendPointNum
    },
     //专属武器等
    getWeaponLevel(hero){
        if(hero && hero.weaponLv){
            return hero.weaponLv
        }
        return 1
    }
});
