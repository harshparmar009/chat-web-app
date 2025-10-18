import { Mail, User } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChatRequestMutation, useCheckChatRequestMutation } from '../../features/chat/chatApi'


const ProfileContainer = () => {
  const [checkChatRequest] = useCheckChatRequestMutation();
  const [chatRequest, { isLoading, error }] = useChatRequestMutation();

  const { user } = useSelector((state) => state.auth);
  const { userProfile } = useSelector((state) => state.chat);

  const [reqSent, setReqSent] = useState(false);

  useEffect(() => {
    const checkReq = async () => {
      try {
        const res = await checkChatRequest({ senderId: user._id, receiverId: userProfile._id }).unwrap();
        setReqSent(res.success);
      } catch (err) {
        console.error(err);
      }
    };
    if (userProfile?._id) checkReq();
  }, [user._id, userProfile?._id]);

  const handleChatRequest = async () => {
    try {
      const res = await chatRequest({ senderId: user._id, receiverId: userProfile._id }).unwrap();
      if (res.success) setReqSent(true);
    } catch (err) {
      console.error('failed', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-gray-800 rounded-xl">
      <div className="rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="mt-2">User profile information</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.userName}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userProfile?.email}</p>
          </div>
        </div>

        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{userProfile.createdAt?.split('T')[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl">
          {reqSent ? (
            <button className="px-3 py-2 bg-base-300 cursor-not-allowed">
              Already Sent
            </button>
          ) : (
            <button
              onClick={handleChatRequest}
              disabled={isLoading}
              className="px-3 py-2 bg-base-300 cursor-pointer hover:bg-base-200 transition"
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
          )}
          {error && <p style={{ color: 'red' }}>{error.data?.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfileContainer;