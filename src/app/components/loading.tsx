import React from 'react';

const LoadingPage: React.FC = () => {
    return (
        <div className="flex h-screen">
            <div className="flex mx-auto bg-black shadow-lg rounded-lg overflow-hidden ">
                <div className="w-auto bg-black text-white py-8 px-6 flex flex-col justify-center items-center">
                    {/* <div className="w-auto bg-black text-white py-8 px-6 sm:flex sm:flex-col sm:justify-center sm:items-center"> */}
                    <h2 className="text-4xl sm:text-9xl font-semibold mb-2">Now Loading</h2>
                    <div className="sm:flex sm:flex-col sm:justify-center sm:items-center h-screen">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
                    </div>
                </div>
                <div className="w-full h-1/3 sm:w-auto sm:h-auto top-0">
                    <img
                        className="w-full h-full object-cover pointer-events-none"
                        src="/loading.png"
                        alt="Loading"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingPage;
