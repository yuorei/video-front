import React, { useState } from 'react';

interface ErrorProps {
    errorMessage: string;
}

const ErrorPage: React.FC<ErrorProps> = ({ errorMessage }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    return (
        <div className="flex h-screen">
            <div className="flex mx-auto bg-black shadow-lg rounded-lg overflow-hidden">
                <div className="w-full h-1/3 sm:w-auto sm:h-auto">
                    {/* 画像は適切なURLを指定 */}
                    <img
                        className="w-full h-full object-cover pointer-events-none"
                        src="/error.png"
                        alt="Error"
                    />
                </div>
                <div className="w-auto bg-black text-white py-8 px-6 sm:flex sm:flex-col sm:justify-center sm:items-center">
                    <h2 className="text-1xl sm:text-5xl font-semibold mb-2">Sorry<br />エラーが発生しました。</h2>
                    {/* 詳細を表示するボタン */}
                    <button
                        className="mt-4 px-4 py-2 md:text-2xl bg-white text-black rounded hover:bg-gray-200"
                        onClick={toggleDetails}
                    >
                        {showDetails ? "隠す" : "詳細"}
                    </button>
                    {/* 詳細が表示されている場合は、詳細を表示 */}
                    {showDetails && (
                        <div className="mt-4">
                            {/* 詳細内容をここに追加 */}
                            <p className='text-1xl sm:text-5xl whitespace-normal text-white'>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
