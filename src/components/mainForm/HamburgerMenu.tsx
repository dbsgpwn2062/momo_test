import React, { useState } from "react";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 햄버거 버튼 */}
      <button
        onClick={toggleMenu}
        className="absolute top-4 right-4 z-50 p-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ☰
      </button>

      {/* 오른쪽 5/1 영역에 메뉴 */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-1/5 bg-white z-40 shadow-lg border-l">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold">메뉴</h2>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="text-lg font-medium hover:text-blue-500">
                <a href="#">Login</a>
              </li>
              <li className="text-lg font-medium hover:text-blue-500">
                <a href="#">MyPage</a>
              </li>
              <li className="text-lg font-medium hover:text-blue-500">
                <a href="#">Calendar</a>
              </li>
              {/* 추가 메뉴 항목 */}
              <li className="text-lg font-medium hover:text-blue-500">
                <a href="#">서비스 소개</a>
              </li>
              <li className="text-lg font-medium hover:text-blue-500">
                <a href="#">이용 안내</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default HamburgerMenu;
