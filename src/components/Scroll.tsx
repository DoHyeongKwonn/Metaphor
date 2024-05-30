import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function InitailizeScroll() {
  const { pathname } = useLocation();
  const [prevPath, setPrevPath] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== prevPath) {
      window.scrollTo(0, 0); // 페이지 이동 시 스크롤을 맨 위로 이동
      setPrevPath(pathname);
    }
  }, [pathname, prevPath]);

  return null;
}

export default InitailizeScroll;
