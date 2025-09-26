import { X } from "lucide-react";
import { useSelector } from "react-redux";
// import { setSelectedUser } from "../../features/chat/chatSlice";

const ChatHeader = ({selectedUser}) => {

  const { onlineUsers } = useSelector(state => state.auth);

  return (
    <div className="p-2.5 border-b border-base-300 bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.userName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        {/* <button onClick={() => setSelectedUser(null)}>
          <X />
        </button> */}
      </div>
    </div>
  );
};
export default ChatHeader;