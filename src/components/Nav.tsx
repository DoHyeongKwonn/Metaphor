import DarkMode from "./DarkTheme";

function Nav() {
  return (
    <div className="navbar bg-base-100 pl-40">
      <div>
        <a className="btn btn-ghost text-xl">Metaphor</a>
      </div>
      <div className="w-3/4 pl-20">
        <div>
          <a className="btn btn-ghost px-10">영화</a>
        </div>
        <div>
          <a className="btn btn-ghost px-10">스포 게시판</a>
        </div>
        <div>
          <a className="btn btn-ghost px-10">일반 게시판</a>
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
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
        <div className="ml-20">
          <DarkMode />
        </div>
      </div>
    </div>
  );
}
export default Nav;
