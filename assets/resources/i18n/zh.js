'use strict';

if (!window.i18n) {
    window.i18n = {};
}

if (!window.i18n.languages) {
    window.i18n.languages = {};
}

window.i18n.languages['zh'] = {
    
};

if (CC_EDITOR) {
    Editor.Profile.load('profile://project/LanguageConfig.txt', (err, profile) => {
        if (err){
            return
        }
        for (let index = 0; index < profile.data.length; index++) {
            const v = profile.data[index];
            window.i18n.languages['zh'][v.id] = v.text
        }
    });
}
window.i18n.load = function(){
    cc.loader.loadRes("config/LanguageConfig", function (err, data) {
        var list = JSON.parse(data.text)
        for (let index = 0; index < list.length; index++) {
            const v = list[index];
            window.i18n.languages['zh'][v.id] = v.text
        }
        const languageData = require('LanguageData');
        languageData.init("zh")
    })
}

