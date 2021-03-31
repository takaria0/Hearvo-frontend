import i18next from 'i18next';

const LANGUAGE = process.env.REACT_APP_COUNTRY;

i18next
  // .use(initReactI18next)
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: LANGUAGE, // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      jp: {
        translation: {
          header: {
            title: 'Hearvo',
            subtitle: 'あなたの声を届けよう',
            search: '検索'
          },
          sidebar: {
            trending: '人気のトピック',
            tos: '利用規約',
            privacy: 'プライバシーポリシー',
            relatedPosts: '関連投稿',
            noContent: '該当なし',
          },
          login: {
            login: 'ログイン',
            email: 'メールアドレス',
            password: 'パスワード',
            createAccount: 'アカウント作成',
            successToLogin: 'ログインしました',
            failedToLogin: 'ログインに失敗しました',
            confirmText1: '続行することによって',
            confirmText2: '利用規約',
            confirmText3: 'と',
            confirmText4: 'プライバシーポリシー',
            confirmText5: 'に同意します。',
          },
          signup: {
            passwordLength: 'パスワードは8文字以上に設定してください',
            passwordDiffer: 'パスワードが異なっています',
            useAlphabet: 'ユーザーネームには英数字を使用してください',
            enterUserName: 'ユーザーネームを入力してください',
            userNameInUse: 'ユーザーネームを入力してください',
            createdAccount: 'アカウントを作成しました',
            createAccount: 'アカウント作成',
            userName: 'ユーザーネーム',
            email: 'メールアドレス',
            password: 'パスワード',
            confirmPassword: 'パスワード確認',
            confirmText1: 'アカウントを作成することによって',
            confirmText2: '利用規約',
            confirmText3: 'と',
            confirmText4: 'プライバシーポリシー',
            confirmText5: 'に同意します。',
            login: 'ログイン',
          },
          settingBar: {
            profile: 'プロフィール',
            groupList: 'グループ一覧',
            groupCreate: 'グループ作成',
            tos: '利用規約',
            privacy: 'プライバシーポリシー',
            settings: '設定',
            logout: 'ログアウト',
            login: 'ログイン',
            signup: 'アカウント作成',
            help: 'ヘルプ'
          },
          topicFollow: {
            follow: 'フォロー',
            unfollow: 'フォロー解除'
          },
          profile: {
            following: 'フォロー',
            numOfVotes: '投票数',
            voteRecord: '投票履歴',
            myPost: '投稿',
            joined: '作成日',
            topicFollowings: 'フォロー',
            topicPosts: '投稿数'
          },
          compare: {
            age: '年齢',
            gender: '性別',
            male: '男性',
            female: '女性',
            other: 'どちらでもない',
            selectTwo: '比較対象を二つ選択してください',
            cancel: '戻る',
            description: '以下の選択肢から、比較したい結果を二つ選んでください。二つの結果の積み上げ棒グラフが作成されます。',
            compare: '比較する'
          },
          feed: {
            posts: '投稿数',
            following: 'フォロー',
            popular: '人気',
            latest: '最新',
            recommend: 'おすすめ',
            now: '今',
            today: '今日',
            thisWeek: '今週',
            thisMonth: '今月',
            selectThreeTopics: '3つ以上のトピックを選択してください',
            confirmContent: '内容を確認してください',
            chooseTopic: 'トピックの選択',
            save: '保存',
            enterGender: '性別を入力してください',
            enterAge: '年齢を入力してください',
            birthYear: '生年',
            year: '年',
            inputUserInfo: 'ユーザー情報の入力',
            gender: '性別',
            male: '男性',
            female: '女性',
            other: 'どちらでもない',
            freeForm: '自由入力',
            done: '完了',
            groupDoesntExist: '<このグループは存在しません>',
            topic: 'トピック',
            group: 'グループ　',
            searchResult: 'の検索結果',
            noContent: '該当なし',
            followMore: 'トピックをたくさんフォローしよう！',
            more: 'さらに見る',
            required: '* 必須',
          },
          newPost: {
            post: '投稿',
            add: '追加',
            title: 'タイトル',
            content: '内容',
            cancel: '戻る',
            groupPost: 'グループに投稿する',
            targetPost: '投稿先',
            voteType: '投票タイプ',
            normalVote: '通常投票',
            continuasVote: '連続投票',
            matrixVote: 'マトリックス投票',
            failedToPost: '投稿に失敗しました',
            end: '終了',
            hourLater: '時間後',
            topic: 'トピック',
            topicDescription: '一つ以上、読点で区切って入力',
            topicPlaceholder: 'トピック1、トピック2、・・・',
            vote: '投票',
            titlePlaceholder: 'タイトルを入力',
            contentPlaceholder: '本文を入力',
            voteCandidate: '投票候補',
            parentTitle: '表題',
            MatrixNum: '回答の種類',
            MatrixAnswer: '回答',
          },
          group: {
            groupCreateTitle1: '新たなグループ、「',
            groupCreateTitle2: '」を作成しました！',
            groupCreateDescription: 'グループに参加した人だけが投票を見ることができ、グループ内だけでの投票が出来るようになります。以下の招待リンクをコピーして、友達を誘ってみましょう！',
            groupLinkCopy: '招待リンクをコピー',
            enterGroupName: 'グループ名を入力してください',
            createdGroup: 'グループを作成しました',
            failedToCreateGroup: 'グループの作成に失敗しました',
            createGroup: 'グループ作成',
            createGroupDesc: 'グループを作成すると、グループに参加した人だけが閲覧・投票出来る機能が利用できます。グループを作成すると招待リンクが発行され、メンバーを招待することが可能になります。招待リンクは、グループ一覧ページからも確認できます。',
            create: '作成',
            joined: '参加しました',
            failedToJoin: '参加できませんでした',
            joinGroup: 'グループに参加する',
            group: 'グループ',
            join: '参加する',
            alreadyJoined: '既にこのグループに参加しています',
            groupList: 'グループ一覧',
            usersNum: 'ユーザー数',
            postsNum: '投稿数',
            left: '退出する'
          },
          eachPost: {
            yearLater: '年後に投票終了',
            monthLater: 'ヶ月後に投票終了',
            weekLater: '週間後に投票終了',
            dayLater: '日後に投票終了',
            hourLater: '時間後に投票終了',
            minuteLater: '分後に投票終了',
            secondLater: '秒後に投票終了',
            voteEnd: '投票終了',
            yearBefore: '年前',
            monthBefore: 'ヶ月前',
            weekBefore: '週間前',
            dayBefore: '日前',
            hourBefore: '時間前',
            minuteBefore: '分前',
            secondBefore: '秒前',
            compareButton: '比較する',
            votersAttributes: '投票者の属性',
            candidate: '候補',
            totalVote: '合計票数',
            gender: '性別',
            age: '年齢',
            male: '男性',
            female: '女性',
            others: 'どちらでもない',
            cancel: 'キャンセル',
            compareDescription: '以下の選択肢から、比較したい結果を二つ選んでください。二つの結果の積み上げ棒グラフが作成されます。',
            commentButton: 'コメントする',
            commentPlaceholder: 'あなたの意見は？',
            reply: '返信する',
            seeResult: '結果を見る',
            startContinuasVote: '連続投票を開始',
            selectAllCandidate: '全ての候補に投票して下さい',
            report: '報告する',
            reportAnIssue: '問題を報告する',
            tellUsDetail: 'この投稿について、問題の詳細をお知らせください。',
            notInterested: '内容に興味がない',
            suspiciousOrSpam: '不審な内容またはスパムである',
            abusiveOrHarmful: '不適切または攻撃的な内容を含んでいる',
            selfharmOrSuicide: '自傷行為や自殺の意思をほのめかしている',
          },
          settings: {
            settings: '設定',
            enterPassword: 'パスワードを入力してください',
            passwordLength: 'パスワードは8文字以上です',
            deletedAccount: 'アカウントを削除しました',
            failedToDelete: 'アカウントを削除できませんでした',
            deleteDesc1: 'Hearvoのアカウントを削除します。',
            deleteDesc2: '削除されたアカウントは、二度と復旧することができません。',
            deleteAccount: 'アカウントを削除する',
            deleteAccountNoun: 'アカウント削除',
            confirmPassword: '確認のためにパスワードを入力してください。',
            confirmMessage: '本当にアカウントを削除しますか？二度と復旧は出来ません。',
            yes: 'はい',
            no: 'いいえ',
          },
          tos: {
            sorry:'',
          },
          privacy:{
            sorry:'',
          },
        },
      },



















      us: {
        translation: {
          header: {
            title: 'Hearvo',
            subtitle: 'Your voice must be heard',
            search: 'Search'
          },
          sidebar: {
            relatedPosts: 'Related polls',
            noContent: 'No content',
            trending: 'Trending',
            tos: 'Terms of Service',
            privacy: 'Privacy Policy'
          },
          login: {
            login: 'Log in',
            email: 'Email',
            password: 'Password',
            createAccount: 'Signup',
            successToLogin: 'Logged in',
            failedToLogin: 'Failed to Log in',
            confirmText1: 'By continuing, you agree to our ',
            confirmText2: 'Terms of Service',
            confirmText3: ' and ',
            confirmText4: 'Privacy Policy',
            confirmText5: '.',
          },
          signup: {
            passwordLength: 'Password length must be 8 characters or more',
            passwordDiffer: "Password doesn't match",
            useAlphabet: 'Use alphabet and numbers for your user name',
            enterUserName: 'Enter user name',
            userNameInUse: 'Enter user name',
            createdAccount: 'Created your Hearvo account',
            createAccount: 'Create your Hearvo account',
            userName: 'Username',
            email: 'Email',
            password: 'Password',
            confirmPassword: 'Confirm password',
            confirmText1: 'By continuing, you agree to our ',
            confirmText2: 'Terms of Service',
            confirmText3: ' and ',
            confirmText4: 'Privacy Policy',
            confirmText5: '.',
            login: 'Log in',
          },
          settingBar: {
            help: 'Help',
            profile: 'Profile',
            groupList: 'Group List',
            groupCreate: 'Create Group',
            tos: 'Terms of Service',
            privacy: 'Privacy Policy',
            settings: 'Settings',
            logout: 'Log out',
            login: 'Log in',
            signup: 'Sign up'
          },
          topicFollow: {
            follow: 'Follow',
            unfollow: 'Unfollow'
          },
          profile: {
            following: 'Following',
            numOfVotes: 'Votes',
            voteRecord: 'Votes',
            myPost: 'Posts',
            joined: 'Joined',
            topicFollowings: 'Following',
            topicPosts: 'Posts'
          },
          compare: {
            age: 'Age',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            selectTwo: 'Select two results to compare',
            cancel: 'Cancel',
            description: 'Plot a stacked bar chart of the results. Select two results to compare. ',
            compare: 'Compare'
          },
          feed: {
            posts: 'Post',
            following: 'Following',
            recommend: 'Recommend',
            popular: 'Popular',
            latest: 'Latest',
            now: 'Now',
            today: 'Today',
            thisWeek: 'This week',
            thisMonth: 'This month',
            selectThreeTopics: 'Select at least three topics',
            confirmContent: 'Confirm the content',
            chooseTopic: 'Select topics',
            save: 'Save',
            enterGender: 'Select your gender',
            enterAge: 'Select your age',
            birthYear: 'Birth year',
            year: '',
            inputUserInfo: 'Enter user infomation',
            gender: 'Gender',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            freeForm: 'Specify',
            done: 'Done',
            groupDoesntExist: "<This group doesn't exist>",
            topic: 'Topic',
            group: 'Group　',
            searchResult: ' results',
            noContent: 'No content',
            more: 'More',
            followMore: 'Follow more topics!',
            required: 'required *'
          },
          newPost: {
            post: 'Post',
            cancel: 'Cancel',
            groupPost: 'Submit to a group',
            targetPost: 'Group',
            voteType: 'Vote type',
            normalVote: 'Normal Vote',
            continuasVote: 'Multiple Vote',
            matrixVote: 'Matrix Vote',
            failedToPost: 'Failed to submit',
            end: 'End',
            hourLater: 'hours later',
            topic: 'Topic',
            topicDescription: 'Enter at least one topic, separate topics with a comma',
            topicPlaceholder: 'Topic 1, Topic 2, ...',
            vote: 'Poll',
            titlePlaceholder: 'Enter title',
            contentPlaceholder: 'Enter content',
            voteCandidate: 'Vote option',
            parentTitle: 'Heading',
            MatrixNum: 'Answer Option',
            MatrixAnswer: 'Answer',
          },
          group: {
            groupCreateTitle1: 'Created a new group "',
            groupCreateTitle2: '"！',
            groupCreateDescription: 'Invite your friends into your group!',
            groupLinkCopy: 'Copy the invite link',
            enterGroupName: 'Enter group name',
            createdGroup: 'Created a new group',
            failedToCreateGroup: 'Failed to create a group',
            createGroup: 'Create a group',
            createGroupDesc: "Group feature allows you to hear specific people's opinion in the group. Only people in the group can see the posts. You can invite them by the invite link.",
            create: 'Create',
            joined: 'Joined',
            failedToJoin: 'Failed to join',
            joinGroup: 'Join a group',
            group: 'Group',
            join: 'Join',
            alreadyJoined: 'You have already joined the group',
            groupList: 'Group List',
            usersNum: 'Users ',
            postsNum: 'Votes ',
            left: 'Left the group'
          },
          eachPost: {
            yearLater: ' years left',
            monthLater: ' months left',
            weekLater: ' weeks left',
            dayLater: ' days left',
            hourLater: ' hours left',
            minuteLater: ' minutes left',
            secondLater: ' seconds left',
            voteEnd: 'Final results',
            yearBefore: ' years ago',
            monthBefore: ' months ago',
            weekBefore: ' weeks ago',
            dayBefore: ' days ago',
            hourBefore: ' hours ago',
            minuteBefore: ' minutes ago',
            secondBefore: ' seconds ago',
            compareButton: ' Compare',
            votersAttributes: 'Voter Demographics',
            candidate: 'Options',
            totalVote: 'Total Votes',
            gender: 'Gender',
            age: 'Age',
            male: 'Male',
            female: 'Female',
            other: 'Other',
            cancel: 'Cancel',
            compareDescription: 'Plot a stacked bar chart of the results. Select two results to compare. ',
            commentButton: 'Comment',
            reply: 'Reply',
            seeResult: 'See the result',
            startContinuasVote: 'Start Vote',
            selectAllCandidate: 'Vote all options',
          },
          settings: {
            settings: 'Settings',
            enterPassword: 'Enter your password',
            passwordLength: 'Enter at least 8 characters for your password',
            deletedAccount: 'Deleted your account',
            failedToDelete: 'Failed to delete your account',
            deleteDesc1: 'Delete your Hearvo account. ',
            deleteDesc2: "Once you delete your account, you can't restore it",
            deleteAccount: 'Delete',
            deleteAccountNoun: 'Delete your account',
            confirmPassword: 'Enter your password to proceed',
            confirmMessage: 'Are you sure?',
            yes: 'Yes',
            no: 'No',
          },
          tos: {
            sorry:'An English version of Terms of Service and Privacy Policy is currently unavailable. Please check a Japanese version. Sorry for inconvenience.',
          },
          privacy:{
            sorry:'An English version of Terms of Service and Privacy Policy is currently unavailable. Please check a Japanese version. Sorry for inconvenience.',
          },
        },
      },























      uk: {
        translation: {
          age: { label: 'Años', },
          home: { label: 'Casa', },
          name: { label: 'Nombre', },
        },
      },
    },
  })

export default i18next