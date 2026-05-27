// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// Same config as your React app
firebase.initializeApp({
 apiKey: "AIzaSyCCmJKRLWgNTQzaKGYHolQL0U1bCu_kKtM",
  authDomain: "chatty-web-app.firebaseapp.com",
  projectId: "chatty-web-app",
  storageBucket: "chatty-web-app.firebasestorage.app",
  messagingSenderId: "735934269088",
  appId: "1:735934269088:web:a98d6ccd662eca9a6dabc5",
  measurementId: "G-C533644GGN"
});

const messaging = firebase.messaging();

// Background messages (app is minimized or tab not active)
messaging.onBackgroundMessage((payload) => {
  console.log("Background message:", payload);

  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, {
    body: body,
    icon: icon || "/logo192.png",
    badge: "/logo192.png",
    data: payload.data  // pass any extra data
  });
});

// Optional: handle notification click
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then((clientList) => {
//         // If app tab already open → focus it
//         for (const client of clientList) {
//           if (client.url.includes("localhost:5173") && "focus" in client) {
//             return client.focus();
//           }
//         }
//         // Otherwise open new tab
//         return clients.openWindow("http://localhost:5173");
//       })
//   );
// });