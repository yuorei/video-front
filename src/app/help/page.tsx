import React from 'react';

// HelpPage
const HelpPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 bg-black shadow rounded">
            <h1 className="text-3xl font-bold text-center text-white mb-8">動画配信サイト ヘルプページ</h1>

            {/* 動画の視聴方法セクション */}
            <div className="my-5 p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">動画の視聴方法</h2>
                <div className="mt-2 text-gray-300">
                    <p>動画はトップページから簡単に視聴できます。</p>
                </div>
            </div>

            {/* アカウント作成とログインセクション */}
            <div className="my-5 p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">アカウント作成とログイン</h2>
                <div className="mt-2 text-gray-300">
                    <p>ログインから「アカウント作成」ボタンから簡単にアカウントを作成できます。</p>
                    <p>ログイン後は、自分の動画を投稿することができます。</p>
                </div>
            </div>

            {/* 動画の投稿方法セクション */}
            <div className="my-5 p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">動画の投稿方法</h2>
                <div className="mt-2 text-gray-300">
                    <p>動画を投稿するには、まずログインしてください。</p>
                    <p>ダッシュボードから「動画をアップロード」ボタンをクリックして、動画ファイルを選択します。</p>
                    <p>タイトル、説明を入力して、動画を公開します。</p>
                </div>
            </div>

            {/* セキュリティとプライバシー */}
            <div className="my-5 p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">セキュリティとプライバシー</h2>
                <div className="mt-2 text-gray-300">
                    <p>当サイトはユーザーのセキュリティとプライバシーを重視しています。</p>
                    <p>パスワードや個人情報は厳重に保護されています。</p>
                </div>
            </div>

            {/* よくある質問 (FAQ) セクション */}
            <div className="my-5 p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">よくある質問 (FAQ)</h2>
                <div className="mt-2 text-gray-300">
                    <p>Q: 動画の再生ができません。</p>
                    <p>A: インターネット接続を確認してください。</p>
                    <p>Q: 動画を投稿できません。</p>
                    <p>A: 現在の最大動画のファイルサイズはサムネイル画像を含めて100MBまでとなっています。ご確認ください。</p>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;
