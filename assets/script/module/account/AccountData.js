cc.Class({
    properties:{

    },
    
    ctor(){

    },

    getBtnType(){
        if(Bridge.isAndroid()){
            this.m_btnType = 2 //开启google
          //  this.m_btnType += 4//开启twitter
        }

        if(Bridge.isIos()){
            // this.m_btnType = 2 //开启google
            // this.m_btnType += 4//开启twitter
            // this.m_btnType += 1//开启Apple
            this.m_btnType  = 1
            //this.m_btnType  += 8
        }
        
        if(!cc.sys.isNative){
            this.m_btnType = 2 //开启google
            this.m_btnType += 4//开启twitter
            this.m_btnType += 1//开启Apple
            
        }

        return this.m_btnType
    }

})