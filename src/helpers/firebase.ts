  import firebase from 'firebase';
  
  // Set the configuration for your app
  // TODO: Replace with your app's config object
  const firebaseConfig = {
    apiKey: "AIzaSyDX6V29aLf1wc1D04aTpBI_Zhlwyf6NMEg",
    authDomain: "hearvo-c1393.firebaseapp.com",
    databaseURL: "https://hearvo-c1393.firebaseio.com",
    projectId: "hearvo-c1393",
    storageBucket: "hearvo-c1393.appspot.com",
    messagingSenderId: "226464882610",
    appId: "1:226464882610:web:1419cbf6314c45dd390eab",
    measurementId: "G-ZQNTE4VPD5"
  };
  
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = firebase.storage();

  export { storage };