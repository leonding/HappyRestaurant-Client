var BaseView = require("BaseView")
cc.Class({
    extends: BaseView,
    properties: {       
        bottomListNode:cc.Node,
        m_oTermsList:cc.ScrollView,
        m_oRichText:cc.RichText,
    },
    onLoad:function(){
        this.popupUIData = {title:""}
        this._super()

    },
    onEnable(){
       this._super()
       
    },
    register:function(){
       
    },
    // enable
    updateView(){
     
    },
    enableUpdateView(args){
        if(args){
            if(typeof(args) == "boolean"){
                console.log("enableUpdateView return")
                return
            }
            this.id = args.id
            this.data = args.list
            var pagedata = this.data[this.id]
            this.popupUI.setTitle(pagedata.title)
            var reg = /[']+/g
            if(pagedata.content.length > 0){
                pagedata.content = pagedata.content.replace(reg,"\"") //'["<color=#ffffff><size=30>利用規約</c><color=#ffffff><br/>株式会社actop（以下「当社」といいます）は、当社が運営し提供するサービス「女神降ろし」（以下、当該サービスを利用する際にインストールが必要となるアプリケーションと合わせ、「本サービス」といいます）について、以下のとおり利用規約（以下「本規約」といいます）を定めます。</color>","<color=#ffffff><size=30>第一条 定義</c><color=#ffffff><br/>本規約では以下の用語を使用します。<br/>   • 1. 「お客様」とは、本サービスの利用者の総称です。<br/>   • 2. 「アカウント」とは、当社がお客様を識別するために発行する識別子のことです。お客様が本サービスを利用する場合、必ず「アカウント」が必要になります。</color>","<color=#ffffff>        • 3. 「個別利用規約」とは、本サービスにおいて、本規約とは別に当社が定めている規約のことです。「個別利用規約」は、「規約」「ガイドライン」「ポリシー」などの名称で提示されます。<br/>    • 4. 「本コンテンツ」とは、本サービスを通して利用、閲覧、アクセスできるコンテンツのことです。「コンテンツ」とは、文章や音声</color>","<color=#ffffff>、音楽、画像、動画、ソフトウェア、プログラム、コード、ゲーム内において使用するプレイヤー名その他の情報のことです。<br/>      • 5. 「有償サービス」とは、本サービスにおいて、お客様による利用料金のお支払いが必要となるサービスやコンテンツのことです。<br/>      • 6. 「ゲーム内通貨」とは、本サービスにおいて、お客様が当社からのアイテム購入等の</color>","<color=#ffffff>対価の支払に用いることができる、本サービス内専用の支払手段をいいます。なお、別途「資金決済法に基づく表示」と題するページに前払式支払手段として表示するサービス内通貨は、資金決済法に基づき前払式支払手段として取扱われます。当該前払式支払手段以外のコンテンツ（当該前払式支払手段により購入されたその他のコンテ</color>","<color=#ffffff><size=30>第二条 規約への同意</c><color=#ffffff><br/>    • 1. お客様は、本規約および個別利用規約に同意することにより、本サービスを利用することができます。お客様は、年齢や利用環境など、当社の定める条件に応じて、当社の定める範囲内で、本サービスを利用するものとします。<br/>    • 2. お客様が本規約または個別利用規約に</color>","<color=#ffffff>同意しない場合、本サービスを利用することはできないものとし、直ちに本サービスのダウンロード、インストールまたは利用を中止するものとします。お客様が本サービスを既にインストールしている場合、そのアンインストールを行うものとします。<br/>    • 3. お客様は、本サービスの利用を、自身の所有するPC、スマートフォン、タブレットな</color>","<color=#ffffff>どの端末（以下、単に「端末」といいます）の操作によって行うものとします。<br/>    • 4. 本サービスにおいて、個別利用規約が定められている場合、お客様は本規約だけでなく、個別利用規約の定めにもしたがい、本サービスを利用するものとします。<br/>    • 5. 本規約と個別利用規約の内容が異なっている場合、個別利用規約に定める内容が優</color>","<color=#ffffff>先して適用されます。</c><color=#ffffff><size=30>第三条 規約の変更と免責</c><color=#ffffff><br/>     • 1. 当社は、本規約および個別利用規約の変更が必要であると判断する場合、あらかじめ施行時期及びその内容をお客様へのメールまたは当社ウェブサイト上での掲示その他適切な方法により周知し、本規約および個別利用規約を変更できるものとします。</color>","<color=#ffffff>        • 2. 変更後の本規約および個別利用規約は、前項に基づき周知された施行時期からその効力を生じるものとします。<br/>    • 3. 第１項に基づくお客様への周知後、本規約または個別利用規約が変更の効力が生じた時点より後にお客様が本サービスをご利用になる場合、お客様は変更後の本規約または個別利用規約のすべての記載内容に同</color>"]'//pagedata.content
                this.itemDatas = JSON.parse(pagedata.content)
                this.removeAllPoolItem(this.m_oTermsList.content)
                // this.m_oTermsList.stopAutoScroll()
                Gm.ui.simpleScroll(this.m_oTermsList,this.itemDatas,function(itemData,tmpIdx){
                    var item = this.getPoolItem()
                    item.active = true
                    this.m_oTermsList.content.addChild(item)
                    item.getComponent(cc.RichText).string = itemData
                    var layout = this.m_oTermsList.content.getComponent(cc.Layout)
                    layout._layoutDirty = true
                    layout.updateLayout()
                    return item
                }.bind(this))
                // this.m_oTermsList.scrollToTop()
            }
        }
    },
    getBasePoolItem(){
        return this.m_oRichText.node
    },
    onBack(){
        this._super()
    },
    web(sender, param){
        window.location.href = param
    },
  

});

