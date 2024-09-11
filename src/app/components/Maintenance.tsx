// import React from 'react';

// const Maintenance: React.FC = () => {
//     return (
//         <div>
//             <h1>メンテナンス中</h1>
//             <p>現在、メンテナンスを行っております。</p>
//             <p>ご迷惑をおかけして申し訳ありません。</p>
//         </div>
//     );
// };

// export default Maintenance;
import React from 'react';
import { AlertTriangle, Calendar, Zap } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-teal-400 flex items-center justify-center">
    {/* <div className="min-h-screen bg-[url('/error.png')] flex items-center justify-center"> */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="text-yellow-500 w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4 text-black">メンテナンス中</h1>
        <p className="text-gray-600 text-center mb-6">
          現在、システムの大規模なアップグレードを行っております。
        </p>
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="text-blue-500 w-6 h-6 mr-2" />
            <p className="text-sm text-black">10月に正式リリース予定</p>
          </div>
          <div className="flex items-center">
            <Zap className="text-green-500 w-6 h-6 mr-2" />
            <p className="text-sm text-black">様々な新機能が追加される予定です</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            ご不便をおかけして申し訳ありません。<br />
            より良いサービスを提供するため、しばらくお待ちください。
          </p>
          <a href="https://twitter.com/yuovision" className="text-blue-500 hover:underline block mt-4">最新の情報はこちらをご覧ください。</a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;