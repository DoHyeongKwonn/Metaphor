import { useState, useEffect } from "react";
function DarkMode() {
  const [dark, setDark] = useState(() => {
    // localStorage에서 저장된 값 가져오기
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark";
  });

  useEffect(() => {
    // const root = document.getElementById("root");
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      // dark 상태에 따라 data-theme 속성 설정
      // root.setAttribute("data-theme", dark ? "dark" : "retro");

      if (dark) {
        htmlElement.classList.add("dark");
        htmlElement.setAttribute("data-theme", "dark");
      } else {
        htmlElement.classList.remove("dark");
        htmlElement.setAttribute("data-theme", "retro");
      }
    }
    // dark 상태가 변경될 때마다 localStorage에 저장
    localStorage.setItem("theme", dark ? "dark" : "retro");
  }, [dark]);

  const switchTheme = () => {
    // dark 상태 토글
    setDark(!dark);
  };
  return (
    <div className="dropdown mb-4">
      <label className="flex cursor-pointer gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <input type="checkbox" checked={dark} onChange={switchTheme} className="toggle" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
    </div>
  );
}
export default DarkMode;
