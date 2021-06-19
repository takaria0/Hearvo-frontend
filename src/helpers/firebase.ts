  import firebase from 'firebase';
  
  // Set the configuration for your app
  // TODO: Replace with your app's config object

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "hearvo-c1393.firebaseapp.com",
    databaseURL: "https://hearvo-c1393.firebaseio.com",
    projectId: "hearvo-c1393",
    storageBucket: "hearvo-c1393.appspot.com",
    messagingSenderId: "226464882610",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-5WMWVJ5MQD"
  };

  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = firebase.storage();

  export { storage };