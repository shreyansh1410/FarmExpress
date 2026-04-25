import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser, removeUser } from "../utils/userSlice";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [checkingSession, setCheckingSession] = useState(!user);

  useEffect(() => {
    if (user) {
      setCheckingSession(false);
      return;
    }

    let isMounted = true;

    const validateSession = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        if (isMounted) {
          dispatch(addUser(res.data));
        }
      } catch (_err) {
        if (isMounted) {
          dispatch(removeUser());
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch, user]);

  if (checkingSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

export default ProtectedRoute;
