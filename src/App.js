import logo from './img/logo.png';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDiXBReqBDwadcBvwaCQ8_M0GDYt3nPRe0",

  authDomain: "lift-mate.firebaseapp.com",

  projectId: "lift-mate",

  storageBucket: "lift-mate.appspot.com",

  messagingSenderId: "610390467922",

  appId: "1:610390467922:web:7f7bc688f904bf7917868b",

  measurementId: "G-LP4ZMDTJB9"

})

const auth = firebase.auth();
const firestore = firebase.firestore();





function SignIn(){
  const signInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle} id="user"> <img src="https://assets.stickpng.com/images/5847f9cbcef1014c0b5e48c8.png" alt="google" height="50px" /></button>
  )
}

function ChatRoom(){

  return(
    <p>you are logged in </p>
  )
}

function SignInFun(){
  // const [user] = useAuthState(auth);
  
  return(
    <SignIn />

  )
}

function App() {
  


  return (
    <div className="App">
    <header>
            <img height="60em" src={logo} alt="logo"/>
            <h1>LiftMate</h1>
            <SignInFun />
    </header>
    <main>
      
    
        
    </main>
    <footer>
        <nav class="footeritems">Github</nav>
        <nav class="footeritems">Linkedin</nav>
        <p class="footeritems">copyright</p>
    </footer>
    </div>
  );
}

export default App;
