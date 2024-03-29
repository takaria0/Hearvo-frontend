import React from 'react';
import * as styles from '../../css/Home.module.css';
import i18n from "../../helpers/i18n";

const PrivacyPolicy = (props: any) => {
  return (

    <div className={styles.body}>
      <div>
      <div style={{ margin: 10 }}>
      <span style={{ color:'red',fontWeight:'bold',fontSize:'15pt',paddingBottom:'1pt',borderBottom:'1.5pt solid ' }}>{i18n.t('privacy.sorry')}</span>
      <h1>プライバシーポリシー</h1>


        <p>Hearvo（以下「当社」といいます。）は、当社の提供するサービス（以下「本サービス」といいます。）における、ユーザーについての個人情報を含む利用者情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。</p>

        <h2>1.	収集する利用者情報及び収集方法</h2>
      <p>本ポリシーにおいて、「利用者情報」とは、ユーザーの識別に係る情報、通信サービス上の行動履歴、その他ユーザーまたはユーザーの端末に関連して生成または蓄積された情報であって、本ポリシーに基づき当社が収集するものを意味するものとします。
      本サービスにおいて当社が収集する利用者情報は、その収集方法に応じて、以下のようなものとなります。</p>
      <p>(1)	ユーザーからご提供いただく情報</p >
      <p>本サービスを利用するために、または本サービスの利用を通じてユーザーからご提供いただく情報は以下のとおりです。</p >

      <p>・生年月日、性別、氏名等プロフィールに関する情報</p >
      <p>・メールアドレス等連絡先に関する情報</p >
      <p>・入力フォームその他当社が定める方法を通じてユーザーが入力または送信する情報</p >

      <p>(2)	ユーザーが本サービスの利用において、他のサービスと連携を許可することにより、当該他のサービスからご提供いただく情報</p >

      <p>ユーザーが、本サービスを利用するにあたり、ソーシャルネットワーキングサービス等の他のサービスとの連携を許可した場合には、その許可の際にご同意いただいた内容に基づき、以下の情報を当該外部サービスから収集します。</p >

      <p>・当該外部サービスでユーザーが利用するID</p >
      <p>・その他当該外部サービスのプライバシー設定によりユーザーが連携先に開示を認めた情報</p >

      <p>(3)	ユーザーが本サービスを利用するにあたって、当社が収集する情報</p >
      <p>当社は、本サービスへのアクセス状況やそのご利用方法に関する情報を収集することがあります。これには以下の情報が含まれます。</p >

      <p>・リファラ</p >
      <p>・IPアドレス</p >
      <p>・サーバーアクセスログに関する情報</p >
      <p>・Cookie、ADID、IDFAその他の識別子</p >


<h2>2.　利用目的</h2>
<p>本サービスのサービス提供にかかわる利用者情報の具体的な利用目的は以下のとおりです。</p>

    <p>(1)	本サービスに関する登録の受付、本人確認、ユーザー認証、ユーザー設定の記録</p>
      <p>(2) 本サービスにおける投票結果の可視化のため</p >
      <p>(3)	ユーザーのトラフィック測定及び行動測定のため</p >
      <p>(4)	広告の配信、表示及び効果測定のため</p >
      <p>(5)	本サービスに関するご案内、お問い合わせ等への対応のため</p >
      <p>(6)	本サービスに関する当社の規約、ポリシー等（以下「規約等」といいます。）に違反する行為に対する対応のため</p >
      <p>(7)	本サービスに関する規約等の変更などを通知するため</p >

      <h2>3.	通知・公表または同意取得の方法、利用中止要請の方法</h2>
      <p>3-1	ユーザーは、本サービスの所定の設定を行うことにより、利用者情報の全部または一部についてその収集又は利用の停止を求めることができ、この場合、当社は速やかに、当社の定めるところに従い、その利用を停止します。なお利用者情報の項目によっては、その収集または利用が本サービスの前提となるため、当社所定の方法により本サービスを退会した場合に限り、当社はその収集又は利用を停止します。</p>


      <h2>4.	外部送信、第三者提供、情報収集モジュールの有無</h2>
      <p>4-1	本サービスでは、以下の提携先が、ユーザーの端末にCookieを保存し、これを利用して利用者情報を蓄積及び利用している場合があります。</p>


      <p>4-2	本サービスではGoogle Analytics（Cookie、モバイル デバイスの識別情報（Android の広告識別子、iOS の広告識別子など） を使用し、ユーザー情報を収集しています。詳細は以下のリンク「https://www.google.com/intl/ja/policies/privacy/partners」をご確認ください。</p >


      <p>4-3 	本サービスでは、Google および第三者配信事業者が Cookie を使用して、ユーザーがそのウェブサイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。Google が広告 Cookie を使用することにより、ユーザーがそのサイトや他のサイトにアクセスした際の情報に基づいて、Google やそのパートナーが適切な広告をユーザーに表示します。ユーザーは、広告設定（https://www.google.com/settings/ads）でパーソナライズ広告を無効にできます。また、www.aboutads.info にアクセスすれば、パーソナライズ広告に使われる第三者配信事業者の Cookie を無効にできます。第三者配信による広告掲載を無効にしていない場合、広告の配信時に第三者配信事業者や広告ネットワークの Cookie が使用される可能性があります。</p>



      <h2>5.	第三者提供</h2>
      <p>当社は、利用者情報のうち、個人情報については、あらかじめユーザーの同意を得ないで、第三者（日本国外にある者を含みます。）に提供しません。但し、次に掲げる必要があり第三者（日本国外にある者を含みます。）に提供する場合はこの限りではありません。</p>

      <p>(1)	当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合</p>
      <p>(2)	合併その他の事由による事業の承継に伴って個人情報が提供される場合</p >
      <p>(3)	第4項の定めに従って、提携先または情報収集モジュール提供者へ個人情報が提供される場合</p >
      <p>(4)	国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることによって当該事務の遂行に支障を及ぼすおそれがある場合</p >
      <p>(5)	その他、個人情報の保護に関する法律（以下「個人情報保護法」といいます。）その他の法令で認められる場合</p >


      <h2>6.	個人情報の開示</h2>
      <p>当社は、ユーザーから、個人情報保護法の定めに基づき個人情報の開示を求められたときは、ユーザーご本人からのご請求であることを確認の上で、ユーザーに対し、遅滞なく開示を行います（当該個人情報が存在しないときにはその旨を通知いたします。）。但し、個人情報保護法その他の法令により、当社が開示の義務を負わない場合は、この限りではありません。なお、個人情報の開示につきましては、手数料（1件あたり1,000円）を頂戴しておりますので、あらかじめ御了承ください。</p>

      <h2>7.	個人情報の訂正及び利用停止等</h2>
      <p>7-1	当社は、ユーザーから、(1)個人情報が真実でないという理由によって個人情報保護法の定めに基づきその内容の訂正を求められた場合、及び(2)あらかじめ公表された利用目的の範囲を超えて取扱われているという理由または偽りその他不正の手段により収集されたものであるという理由により、個人情報保護法の定めに基づきその利用の停止を求められた場合には、ユーザーご本人からのご請求であることを確認の上で遅滞なく必要な調査を行い、その結果に基づき、個人情報の内容の訂正または利用停止を行い、その旨をユーザーに通知します。なお、訂正または利用停止を行わない旨の決定をしたときは、ユーザーに対しその旨を通知いたします。</p>

      <p>7-2 当社は、ユーザーから、ユーザーの個人情報について消去を求められた場合、当社が当該請求に応じる必要があると判断した場合は、ユーザーご本人からのご請求であることを確認の上で、個人情報の消去を行い、その旨をユーザーに通知します。</p>

      <p>7-3 個人情報保護法その他の法令により、当社が訂正等または利用停止等の義務を負わない場合は、8-1および8-2の規定は適用されません。</p>

      <h2>8.	お問い合わせ窓口</h2>
      <p>ご意見、ご質問、苦情のお申出その他利用者情報の取扱いに関するお問い合わせは、下記の窓口までお願いいたします。</p>
      <p>連絡先：support@hearvo.com</p>

      <h2>9.	プライバシーポリシーの変更手続</h2>
      <p>当社は、必要に応じて、本ポリシーを変更します。但し、法令上ユーザーの同意が必要となるような本ポリシーの変更を行う場合、変更後の本ポリシーは、当社所定の方法で変更に同意したユーザーに対してのみ適用されるものとします。なお、当社は、本ポリシーを変更する場合には、変更後の本ポリシーの施行時期及び内容を当社のウェブサイト上での表示その他の適切な方法により周知し、またはユーザーに通知します。</p>


      <p>【2021年2月10日制定】</p>

      <p>【2021年2月10日改定】</p>

      </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy;