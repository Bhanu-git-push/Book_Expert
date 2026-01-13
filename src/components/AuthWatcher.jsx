import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../store/slices/userAuthSlice";

const IDLE_TIME = 5 * 60 * 1000;// 5 minutes

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.userAuth);

  const idleTimerRef = useRef(null);

  const logoutUser = () => {
    dispatch(LOGOUT());
    navigate("/login", { replace: true });
  };

  const resetIdleTimer = () => {
    if (!isAuth) return;

    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      logoutUser();
    }, IDLE_TIME);
  };

  useEffect(() => {
    if (!isAuth) return;

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keydown",
      "touchstart",
    ];

    // Start timer on mount
    resetIdleTimer();

    // Listen for user activity
    events.forEach((event) =>
      window.addEventListener(event, resetIdleTimer)
    );

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, [isAuth]);

  return null; // No UI rendered
};

export default AuthWatcher;