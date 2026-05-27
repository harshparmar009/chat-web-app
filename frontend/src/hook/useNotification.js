import { getMessaging, getToken } from "firebase/messaging";
// import app from "../firebase.js";
import app from "../firebase.js";
// import messaging from "../firebase.js";

const messaging = getMessaging(app);

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

let swRegistration = null;

export const registerToken = async () => {
  try {
    // browser support check
    if (
      !("Notification" in window) ||
      !("serviceWorker" in navigator)
    ) {
      console.warn("Notifications or SW not supported");

      return {
        permission: "unsupported",
        token: null,
      };
    }

    // register SW once
    if (!swRegistration) {
      swRegistration =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );

      console.log("SW registered ✅");
    }

    await navigator.serviceWorker.ready;

    // notification permission
    let permission = Notification.permission;

    if (permission === "default") {
      permission =
        await Notification.requestPermission();
    }

    // denied
    if (permission !== "granted") {
      console.warn("Permission denied:", permission);

      return {
        permission,
        token: null,
      };
    }

    // generate token
    const fcmToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (!fcmToken) {
      console.warn("No FCM token");

      return {
        permission,
        token: null,
      };
    }

    console.log("FCM Token Generated ✅");

    return {
      permission,
      token: fcmToken,
    };
  } catch (err) {
    console.error(
      "Notification setup failed:",
      err.message
    );

    return {
      permission: "error",
      token: null,
    };
  }
};