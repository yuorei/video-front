"use client";
import { useState } from "react";
import { MainNav } from "./main-nav";
import UploadVideo from "./upload-video";
import Login from "./login";
import CustomLink from "./custom-link";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNavigation = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="sticky flex justify-center border-b z-50">
      <div className="flex items-center justify-between w-full h-16 px-4 mx-auto sm:px-6">
        <div className="text-center">
          <button type="button" onClick={toggleNavigation}>
            <img src="/menu.svg" alt="menu" width={20} />
          </button>
        </div>

        {isNavOpen && (
          <div
            id="drawer-navigation"
            className="fixed top-0 left-0 z-50 h-screen p-4 overflow-y-auto transition-transform  w-64 bg-gray-800" //-translate-x-full
            tabIndex={-1}
            aria-labelledby="drawer-navigation-label"
          >
            <button
              onClick={toggleNavigation}
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <h5
                id="drawer-navigation-label"
                className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400"
              >
                Menu
              </h5>
            </button>

            <button
              type="button"
              data-drawer-hide="drawer-navigation"
              aria-controls="drawer-navigation"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={toggleNavigation}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close menu</span>
            </button>
            <div className="py-4 overflow-y-auto">
              <ul className="space-y-2 font-medium">
                <li>
                  <CustomLink href="/">
                    <button onClick={toggleNavigation}>
                      <div className="flex items-center p-2 rounded-lg hover:bg-gray-700 group">
                        <img
                          src="/home.svg"
                          alt="Home"
                          className="w-6 h-6 rounded-full "
                        />
                        <span className="ml-2 text-white font-bold">
                          ホーム
                        </span>
                      </div>
                    </button>
                  </CustomLink>
                </li>
                <li>
                  <button onClick={toggleNavigation}>
                    <UploadVideo />
                  </button>
                </li>
                <li>
                  <button onClick={toggleNavigation}>
                    <Login />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <MainNav />
        <Login />
      </div>
    </header>
  );
}
