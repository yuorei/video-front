import React from "react";

const PolicyComponent: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">コンテンツガイドライン</h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">不適切なコンテンツ</li>
          <ul className="list-disc pl-4">
            <li>性的なコンテンツ、性的暴力、性的暴行、児童ポルノ</li>
            <li>暴力的なコンテンツ、暴行、虐待</li>
            <li>ヘイトスピーチ、差別、人種差別、暴力的な言語</li>
            <li>著作権侵害、不正コピー、盗作</li>
            <li>不適切な言葉遣い、スパム、詐欺、詐欺行為</li>
          </ul>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">コミュニティガイドライン</h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">
            荒らし行為、嫌がらせ、いたずら、人を傷つける行為は禁止されています。
          </li>
          <li className="mb-2">
            コミュニティメンバーに対する尊重と礼儀を守りましょう。
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">コンテンツの所有権</h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">著作権</li>
          <p>
            他人の著作権を尊重し、他人のコンテンツを無断でアップロードしないでください。
          </p>
          <li className="mb-2">自分のコンテンツ</li>
          <p>
            コンテンツ作成者は、自分のコンテンツに対する所有権を維持し、共有することができます。
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          コミュニティとフィードバック
        </h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">ポジティブなコミュニティ</li>
          <p>
            コミュニティメンバーとして、建設的でポジティブなコミュニケーションを奨励します。
          </p>
          <li className="mb-2">フィードバック</li>
          <p>
            コンテンツの報告、不適切な行動の報告、コンテンツの品質向上に対するフィードバックは歓迎します。
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">アカウントとプライバシー</h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">個人情報</li>
          <p>他人の個人情報を無断で共有しないでください。</p>
          <li className="mb-2">アカウントのセキュリティ</li>
          <p>
            アカウントのセキュリティを確保し、他人にアクセス権を与えないように注意してください。
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">
          コミュニティガイドラインの違反
        </h2>
        <ul className="list-disc pl-4">
          <li className="mb-2">違反行為</li>
          <p>
            コミュニティガイドラインに違反する行為は厳禁であり、違反行為を報告することでサイトの安全性を維持しましょう。
          </p>
          <li className="mb-2">制裁</li>
          <p>
            コミュニティガイドラインに違反した場合、適切な制裁が課せられる可能性があります。制裁は違反の種類に応じて変動します。
          </p>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">変更と更新</h2>
        <p>
          当ポリシーは変更される場合があり、最新の情報は常にウェブサイト上で提供されます。定期的に確認してください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">お問い合わせ</h2>
        <p>
          ポリシーに関する質問や懸念事項がある場合、お問い合わせフォームを通じてご連絡ください。
        </p>
      </section>

      <p className="text-lg">
        当サイトのポリシーを遵守してコミュニティを楽しんでいただけるよう、皆様にお願い申し上げます。どうぞ安全で楽しいコンテンツの共有をお楽しみください。
      </p>
    </div>
  );
};

export default PolicyComponent;
