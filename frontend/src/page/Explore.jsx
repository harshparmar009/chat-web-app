import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetAllUsersQuery } from '../features/chat/chatApi'
import { setUserProfile } from '../features/chat/chatSlice'
import ProfileContainer from '../components/chat/ProfileContainer';
import { useSearchQuery } from '../features/auth/authApi';
import NoExploreSelected from '../components/chat/NoExploreSelected';

const Explore = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)    
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();
  const { userProfile } = useSelector(state => state.chat);
  const { onlineUsers = [] } = useSelector(state => state.auth || {});

  // 🔹 Normal fetch all users
  const { data, isLoading, error } = useGetAllUsersQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const users = data?.users || [];

  // 🔹 Search users dynamically with RTK Query
  const { data: searchResults, isLoading: searchLoading } = useSearchQuery(query, {
    skip: !query.trim(), // don't run query if search is empty
  });

  // 🔹 Apply filters
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleUserSelect = (user) => {      
    dispatch(setUserProfile(user));
  };

  return (
    <div className='h-full flex'>
      <div className="flex flex-1 overflow-hidden gap-4 pt-4">
        {/* Sidebar */}
        <section className="w-1/3 border-r border-gray-700 bg-gray-800 rounded-xl">
          <div className="p-4">
            {/* Search bar */}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="border p-2 w-full"
            />

            <ul className="mt-2">
            {(query ? searchResults || [] : filteredUsers).map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="p-2 border-b cursor-pointer hover:bg-gray-700"
              >
                {user.userName}
              </li>
            ))}
            </ul>
          </div>
        </section>

        {/* Main Panel */}
        {userProfile ? <ProfileContainer /> : <NoExploreSelected />}
      </div>
    </div>
  );
};

export default Explore;
