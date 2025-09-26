import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'; // ✅ add Outlet
import { useLogoutMutation } from '../../features/auth/authApi';
import { logoutApi } from '../../features/auth/authSlice';
import { BsChatLeftTextFill } from "react-icons/bs";
import { FaSearch, FaRegBell, FaSignOutAlt } from "react-icons/fa";

const Layout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      const res = await logout().unwrap();
      dispatch(logoutApi());

      if (res.success) {
        console.log("user logout succefully");
        return navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-screen bg-white text-white flex p-2 gap-4">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-gray-800 p-4 flex flex-col justify-between rounded-xl">
        <div>
          <div className="flex items-center space-x-4 mb-10">
            <img
              src={user.profilePic}
              alt="User"
              className="size-8 object-cover rounded-full"
            />
            <span className="hidden md:block font-semibold">Hi, {user.userName}</span>
          </div>

          <nav className="space-y-4">
            <Link to="/inbox">
              <div
                className={`flex items-center space-x-3 text-sm cursor-pointer px-2 py-2 rounded-lg ${
                  location.pathname === "/inbox" ? "bg-gray-700 text-blue-400" : "hover:bg-gray-700"
                }`}
              >
                <BsChatLeftTextFill />
                <span className="hidden md:block">Chat</span>
              </div>
            </Link>

            <Link to="/explore">
              <div
                className={`flex items-center space-x-3 text-sm cursor-pointer px-2 py-2 rounded-lg ${
                  location.pathname === "/explore" ? "bg-gray-700 text-blue-400" : "hover:bg-gray-700"
                }`}
              >
                <FaSearch />
                <span className="hidden md:block">Explore</span>
              </div>
            </Link>

            <Link to="/notification">
              <div
                className={`flex items-center space-x-3 text-sm cursor-pointer px-2 py-2 rounded-lg ${
                  location.pathname === "/notification" ? "bg-gray-700 text-blue-400" : "hover:bg-gray-700"
                }`}
              >
                <FaRegBell />
                <span className="hidden md:block">Notification</span>
              </div>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogOut}
          className="flex cursor-pointer items-center space-x-2 mt-10 text-sm hover:text-red-400"
        >
          <FaSignOutAlt />
          <span className="hidden md:block">Log out</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-800 rounded-xl">
          <h1 className="text-2xl font-bold">
            {location.pathname === "/inbox"
              ? "Chats"
              : location.pathname === "/explore"
              ? "Explore"
              : location.pathname === "/notification"
              ? "Notifications"
              : "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
            <Link to={'/profile'}>
              <button className="cursor-pointer bg-blue-600 px-4 py-1 rounded-lg text-sm">Your Profile</button>
            </Link>
            <img
              src={user.profilePic}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* ✅ Page Content */}
        <main className="flex-1  overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
