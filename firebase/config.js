import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDMpeDKS8W0MaYfB5_m_Zvg8fjzjd5woUw",
    authDomain: "product-hunt-77e71.firebaseapp.com",
    projectId: "product-hunt-77e71",
    storageBucket: "product-hunt-77e71.appspot.com",
    messagingSenderId: "802955208104",
    appId: "1:802955208104:web:effbad7ca7d18a914be99d"
  };

  const fb = firebase.initializeApp(firebaseConfig);
  export const storage = fb.storage();
  export default firebaseConfig;