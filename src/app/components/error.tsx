"use client";
import React from "react";
import CustomLink from "./custom-link";
import { notFound } from "next/navigation";

interface ErrorProps {
  errorMessage: string;
}

const ErrorPage: React.FC<ErrorProps> = ({ errorMessage }) => {
  console.error(errorMessage);

  const reloadPage = () => {
    window.location.reload();
  };

  if (
    errorMessage ==
    "rpc error: code = Unknown desc = mongo: no documents in result"
  ) {
    notFound();
  }

  return (
    <div className="flex h-screen">
      <div className="flex mx-auto bg-black shadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-1/3 sm:w-auto sm:h-auto">
          <img
            className="w-full h-full object-cover pointer-events-none"
            src="/error.png"
            alt="Error"
          />
        </div>
        <div className="w-auto bg-black text-white py-8 px-6 sm:flex sm:flex-col sm:justify-center sm:items-center">
          <h2 className="text-2xl sm:text-7xl font-semibold mb-2">
            エラーが発生しました。
          </h2>
          <p className="text-sm sm:text-3xl mb-4">
            しばらくしてから再度お試しください。
          </p>
          <p className="text-xs sm:text-3xl mb-4">
            最新の情報はこちらをご覧ください。
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <p className="text-xs sm:text-3xl mb-4 mr-4">公式Xアカウント</p>
            <CustomLink
              href="https://twitter.com/yuovision"
              className="text-xs sm:text-3xl mb-4 mr-4 text-blue-300"
            >
              https://twitter.com/yuovision
            </CustomLink>
          </div>
          <button
            onClick={reloadPage}
            className="text-xs sm:text-3xl mb-4 bg-black border hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            再読み込み
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
