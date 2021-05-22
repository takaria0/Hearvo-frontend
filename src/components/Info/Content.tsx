import React from "react";
import * as styles from "../../css/Home.module.css";
import Header from "../Header/Header";
import timeline from "./static/timeline.png";
import following from "./static/following.png";
import result1 from "./static/result1.png";
import result2 from "./static/result2.png";
import result3 from "./static/result3.png";
import result4 from "./static/result4.png";
import compare from "./static/compare.png";
import { Helmet } from "react-helmet";

const HowToUseContent = (props: any) => {
  return (
    <div className={styles.body}>
      <div style={{}}>
        <div style={{ margin: 10 }}>
          <h1>Hearvoとは何か</h1>
          <h1>
            投票により意見を可視化できる、新たなプラットフォームを作りました
          </h1>
          <h2>概要</h2>
          <p>
            昨今、投票により意見を可視化する機能はさまざまなプラットフォームに実装されています。有名どころでは、Twitter、YouTube、Yahoo!ニュース、Instagram、Redditなどが挙げられるでしょう。
          </p>
          <p>
            一方で、投票のみにフォーカスした大きなプラットフォームは
            <b>今のところ存在しません</b>
            。加えて、上記のサービスで実装されている投票機能は、
            <b>限られた、シンプルなもの</b>
            でした。例えば、公的統計（e-Stat）などでよく見る、年齢別、性別ごとに結果を分類して表示する機能や、投票を結びつけて、二つの投票の組み合わせを可視化する機能などは存在しません。
          </p>
          <ul>
            <li> これらのプラットフォームが存在しない</li>
            <li>
              {" "}
              多くの投票が集まり、意見を集約して綺麗に可視化できるプラットフォームが欲しい
            </li>
            <li> 数字を元に議論したい</li>
          </ul>
          <p>
            以上のようなモチベーションから、Hearvoというアプリを作りました（現在Webのみ）。Hearvoの基本機能は以下です。特に投票結果の可視化・複数結果同士の可視化が一番アツいポイントです。
          </p>
          <ul>
            <li>
              <b>投票のみ投稿できる</b>プラットフォーム
            </li>
            <li>
              <b>複数の投票結果・性別・属性を結びつけて可視化できる</b>
            </li>
            <li>
              <b>好きなトピックをフォローし、投票によって意見を表明する</b>
            </li>
            <li> アカウントを作成する必要がある（性別・生年を要求）</li>
          </ul>
          <h2>基本的な機能</h2>
          <p>
            以下に、基本的な機能を実際のスクリーンショットと共に紹介します。
          </p>
          <p>まず、タイムラインはこのような形になっています。</p>
          <br></br>
          <img
            src={timeline}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          <p>
            それぞれの投稿に対して、
            <b>最低限一つのトピックを付加する必要があります</b>
            。トピックを紐づける事によって、コンテンツをカテゴリ分けします。ユーザーは、トピックをフォローすることが出来ます。それによって、
            <b>関心のあるトピックがおすすめフィードに表示されます</b>。
          </p>
          <br></br>
          <img
            src={following}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          <p>
            誰が投稿をしたかは分かりません。また、誰が投票をしたかも分かりません。ただし、コメントをした場合には、ユーザー名が表示されます。
          </p>
          <p>
            投票をする事でのみ、結果を確認することが出来ます。ただし、投票期間が終了した投稿の結果はいつでも確認できます。
          </p>
          <p>
            投票は現在2種類あり、それぞれ<b>「通常投票」、「連続投票」</b>です。
            <b>
              通常投票は、皆さんが馴染みのある、候補の中から一つだけを選ぶ投票方法です。連続投票は、通常投票を複数連続して設定する投票です。
            </b>
            この、連続投票の結果のプロットが特に面白い事になります。
          </p>
          <h3>結果の確認</h3>
          <p>
            投票の結果は、以下のように確認できます。ここで表示される情報は、
            <b>投票結果</b>および<b>投票者の属性分布（年齢・性別）</b>
            です。各投稿にはコメントが出来ます。
          </p>
          <br></br>
          <img
            src={result1}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          <h3>比較する機能（通常投票）</h3>
          <p>
            メインの機能に、結果を<b>「比較する」</b>機能があります。
            <b>
              二つの投票・及び性別・年齢を選択する事で、二つの結果を合わせた積み上げ棒グラフが作成されます。
            </b>
            投票1、投票2、・・・、性別、年齢の候補の中から随意に二つの結果を選んで、組み合わせることが出来ます。選択の順番を変える事で、積み上げ棒グラフのレイアウトが反転します。
          </p>
          <br></br>
          <img
            src={compare}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          <p>
            上記のように、比較したい項目二つを選択することで、下の図のような、二つの結果を組み合わせたプロットが作成されます。これによって、
            <b>
              性別ごとの回答の分布や、年齢ごとの回答の分布を即座に確認できます。
            </b>
          </p>
          <br></br>
          <img
            src={result2}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          <h3>比較する機能（連続投票）</h3>
          <p>
            では、この比較する機能を、連続投票において見てみます。
            <b>
              以下の画像のように、「いずれEVはガソリン自動車を潰すと思うか」という連続投票の結果があったとしましょう。
            </b>
            この投票は、「EVはガソリン自動車のシェアを上回ると思うか」、「どの地域で先にEVが支配的になるか」、「日本はEVで勝ち馬に乗れると思うか」、「あなたは電気やエネルギー問題に関する知識を持っているか」という4つの投票から成り立っています。
          </p>
          <br></br>
          <img
            src={result3}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          このとき、
          <b>
            エネルギー問題に対する関心の程度によって、電気自動車の将来についての見立てがどのように異なるか
          </b>
          を比べましょう。すなわち、比較する機能を使って、「あなたは電気やエネルギー問題に関する知識を持っているか」と「EVはガソリン自動車のシェアを上回ると思うか」の結果を比べます。すると、以下のプロットが得られました。
          <br></br>
          <img
            src={result4}
            style={{
              width: "100%",
              height: "auto",
              marginBottom: 20,
              marginTop: 20,
            }}
          ></img>
          <br></br>
          投票者の数が少ないため、大したことは言えませんが、それでも、
          <b>
            「あなたは電気やエネルギー問題に関する知識を持っているか」に対して、より知識を持っていると答えた人の方が、電気自動車がいずれガソリン自動車にとって変わるという予想をしている
          </b>
          ことが分かります。
          <p>基本的な機能は以上です。</p>
          <h2>ぜひ試してみてください！</h2>
          <p>
            利用者が多ければ多いほど面白いプラットフォームだと思うので、ぜひアカウント作成をして、試していただければ嬉しいです！
            サーバー落ちたらごめんなさい。
          </p>
          {/* <h2>備考</h2>
          <p>コンセプト的に、日本に絞る必要もないと考えたので、Wikipediaのように、ベースのドメインに各国のサイトへのリンクを置いて、多数の国対応ができるようにしてあります。ただし、United Statesのハリボテしか用意していません。しばらく、国ごとにコンテンツを分けるために、違う国・言語での投稿は削除させていただく場合があると思いますので、よろしくお願いいたします。Quoraのようなイメージです。ベースサイトは(<a href="https://hearvo.com">https://hearvo.com</a>)です。また例えば、アメリカのHearvoは(<a href="https://us.hearvo.com">https://us.hearvo.com</a>)となります。</p> */}
          <h2>疑問・懸念</h2>
          <h3>-アカウントを作成する必要があるのか？</h3>
          あります。ユーザーネーム、メールアドレス、パスワードを入力する必要があります。また、初回ログイン時に性別と生年の入力、及び最初にフォローするトピックの選択を求めています。
          <h3>-性別と生年は必ず入力しなければならないのか？</h3>
          現在はそうなっています。これは以下のような理由からです。
          <ul>
            <li>
              アンケート調査に性別・年齢はよく聞かれる基本的な情報である。
            </li>
            <li>
              属性別の結果表示をする際に、一番基本的な情報である性別と年齢は初めに一括して聞いておいた方が楽である。
            </li>
          </ul>
          生年月日の月日以下は特に必要と考えなかったため、聞いていません。また、投票・アンケート調査においては居住地・年収・勤務状況などを聞くことも一般的ですが、手間がかかることと、印象が良くないため、性別と生年の二つに絞りました。ただし、性別は自由形式の記入が可能です。
          <h3>-プライバシーが気になる</h3>
          初回に求める情報としては、メールアドレス、パスワード、性別、生年のみなので、一般的なアカウント作成に求める情報にはなっています。ただし、投票数および投稿数が溜まってくるとそこに個人の傾向が現れ、sensitiveな情報が増えます。
          <h3>-悪いコンテンツ（悪口等）が出てきたらどうする？</h3>
          通報機能を用意しているので（ごめんなさい、鋭意実装中です）、ガンガン通報してください。ヒトの目で確認するしか出来ないのでキツイですが、バンバン非表示にします。
          <h3>
            -複数アカウントを作っていたずらしまくれる等、投票結果の信頼性がないのではないか？
          </h3>
          その通りだと思います。ただし、逆に言えば、複数アカウントを作れないほどに強固に作ろうと思うと、それこそ銀行口座・証券口座開設時のようなプロセスを経ることになってしまうので、それなりの中で楽しむのが正解かなと考えています。一方で、そのような厳格な認証を必要とせずに、投票の標本の質を上げる方法も考えているので、実装したら公開したいと考えています。
          <h3>
            -トピックをフォローしたりして投票する時点で、標本の抽出が偏っているのではないか？
          </h3>
          偏っていることが全て悪いという事ではないと思いますが、その通りだと思います。ただし、これも同様に、投票の標本の質を上げる方法を考えているので、実装したら公開したいと考えています。
          <p>作成日 2021/2/26</p>
        </div>
      </div>
    </div>
  );
};

const HowToUse = (props: any) => {
  return (
    <div>
      <Helmet>
        <title>Hearvoとは何か</title>
        <meta name="description" content="" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <Header></Header>
      <div className={styles.body}>
        <div className={styles.feed}>
          <HowToUseContent />
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
