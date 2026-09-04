# Firebase setup for ScholarBridge

This project is already prepared to run in demo mode when Firebase is not configured. To make the login, registration, and contact form fully live, follow the steps below.

## 1) Create a Firebase project

1. Open https://console.firebase.google.com/
2. Click Add project
3. Enter a project name such as `scholarbridge-app`
4. Continue through the prompts and finish project creation

## 2) Enable Firebase Authentication

1. In the Firebase Console, open Authentication
2. Click Get started
3. Select Sign-in method
4. Enable Email/Password
5. Optionally enable Google sign-in if you want to add it later

## 3) Enable Firestore Database

1. Open Firestore Database
2. Click Create database
3. Choose Start in test mode for development
4. Select a region close to your users
5. Finish the setup

## 4) Add your web app config

1. In Firebase Console, click the web icon `</>`
2. Register the app
3. Copy the config values
4. Replace the placeholder config in [js/firebase-config.js](js/firebase-config.js)

Example:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

You can also override it at runtime using:

```html
<script>
  window.__FIREBASE_CONFIG__ = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
  };
</script>
```

## 5) Firestore collections to create

Create the following collections in Firestore:

### users
Each user document should look like:

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "createdAt": "timestamp",
  "phone": "9876543210"
}
```

### contactMessages
Each contact form entry should look like:

```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "subject": "Scholarship help",
  "message": "Need help with my application.",
  "queryType": "Scholarship Help",
  "status": "new",
  "source": "website",
  "createdAt": "timestamp"
}
```

### applications
If you later add a real application flow:

```json
{
  "userId": "abc123",
  "scholarshipId": "sch001",
  "status": "under_review",
  "appliedDate": "timestamp"
}
```

## 6) Firestore rules example

Use this during development:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /contactMessages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    match /applications/{appId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 7) Final project behavior

After Firebase is configured:

- Login and register pages will use Firebase Auth
- Contact form will save to Firestore
- Demo mode is automatically disabled
- The app keeps a safe fallback if Firebase is not ready

## 8) If you want this fully live

Once you have your Firebase project credentials, update [js/firebase-config.js](js/firebase-config.js) and then reload the app.

If you want, I can next help you with the exact Firestore rules and a working real signup/login flow for this project.
