import { useGetMeQuery } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setAuthChecked, setCredential } from "../features/auth/authSlice";
import { useEffect } from "react";

const AuthLoader = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");

  const {
    data,
    error,
    isLoading,
    isSuccess,
    isError,
    isUninitialized
  } = useGetMeQuery(undefined, {
    skip: !token, // prevent API call if no token
  });

  useEffect(() => {
    // If successful, store user
    if (isSuccess && data?.user) {
      dispatch(setCredential({
        user: data.user,
        accessToken: token,
      }));
    }

    // ✅ Always set authChecked = true once we know the query finished (success or failure or skipped)
    if (!isLoading && (!token || isSuccess || isError || isUninitialized)) {
      dispatch(setAuthChecked(true));
    }

  }, [isSuccess, isError, isLoading, isUninitialized]);

  if (!token && !isLoading) {
    // no token, skip calling getMe, still ready to render
    return children;
  }

  if (isLoading) {
    return <div className="text-center mt-20 text-lg">Checking authentication...</div>;
  }

  return children;
};

export default AuthLoader;
