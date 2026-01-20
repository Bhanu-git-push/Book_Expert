import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../store/slices/userAuthSlice";

const IDLE_TIME = 5 * 60 * 1000; // 5 minutes

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.userAuth);

  const idleTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const deadlineRef = useRef(null);

  const logoutUser = useCallback(() => {
    console.log("Idle timeout reached — logging out");
    dispatch(LOGOUT());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  const startCountdown = () => {
    // Clear any existing countdown interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    // New deadline
    // Deadline = now + idle duration
    deadlineRef.current = Date.now() + IDLE_TIME;

    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const msLeft = deadlineRef.current - now;
      const secLeft = Math.max(Math.ceil(msLeft / 1000), 0);

      // console.log(`Idle logout in: ${secLeft}s`);

      if (msLeft <= 0) {
        clearInterval(countdownRef.current);
      }
    }, 1000);
  };

  const resetIdleTimer = useCallback(() => {
    if (!isAuth) return;

    console.log("Activity detected — reset idle timer");

    // update last activity in session storage
    const stored = sessionStorage.getItem("userAuth");
    if (stored) {
      const data = JSON.parse(stored);
      sessionStorage.setItem(
        "userAuth",
        JSON.stringify({ ...data, lastActivity: Date.now() })
      );
    }

    // Start or restart the countdown logging
    startCountdown();

    // clear existing logout timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // start a new logout timer
    idleTimerRef.current = setTimeout(() => {
      console.log(
        `Idle logout triggered — no event captured in ${
          IDLE_TIME / 1000
        } seconds`
      );

      // Stop countdown logging immediately
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      logoutUser();
    }, IDLE_TIME);
  }, [isAuth, logoutUser]);

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
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, [isAuth, resetIdleTimer]);

  return null; // No UI rendered
};

export default AuthWatcher;
