
exports.HeroType = cc.Enum({
    default:0,//默认
    active:1,//已激活
    up:2,//可升级
    unlock: 3,//可解锁
});

exports.getMaxExpByQuality = function(baseId,quality){
	var confs = Gm.config.getHeroFeelByLv(baseId)
	var exp = 0
	for (var i = 0; i < confs.length; i++) {
		if (quality >= confs[i].quality){
			exp = exp + confs[i].exp
		}
	}
	return exp
}