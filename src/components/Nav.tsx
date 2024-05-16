import { useEffect, useState } from "react";
import { auth } from "../firebase";
import DarkMode from "./DarkTheme";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Nav() {
  // User 타입 또는 null을 상태로 가질 수 있음을 명시
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    // 컴포넌트가 언마운트될 때 리스너 해제
    return () => unsubscribe();
  }, []);

  const LogOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 이벤트의 기본 동작 방지
    try {
      await auth.signOut(); // 로그아웃이 완료될 때까지 기다림 // 로그아웃 후 홈으로 이동
      navigate("/"); // 로그아웃 후 홈("/") 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="navbar bg-base-100 pl-40 ">
      <div>
        <a className="btn btn-ghost text-xl" href="/">
          Metaphor
        </a>
      </div>
      <div className="w-3/4 pl-20">
        <div>
          <a className="btn btn-ghost px-10">영화</a>
        </div>
        <div>
          <a href="/Board" className="btn btn-ghost px-10">
            스포 게시판
          </a>
        </div>
        <div>
          <a href="/Board" className="btn btn-ghost px-10">
            일반 게시판
          </a>
        </div>
        <div>
          <a className="btn btn-ghost px-10">내가 쓴 리뷰</a>
        </div>
      </div>
      <div className="gap-2">
        <div>
          <input type="text" placeholder="Search" className="input input-bordered w-32 md:w-auto" />
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a href="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>{!user ? <a href="/login">Log in</a> : <a onClick={LogOut}>Log out</a>}</li>
          </ul>
        </div>
        <div className="ml-20 mt-3">
          <DarkMode />
        </div>
      </div>
    </div>
  );
}
export default Nav;
