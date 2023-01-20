import './App.css';
import React, { useState, useEffect  } from 'react';
// Here we import the proper pictures
import logo from "./assests/logo.png";
import login from "./assests/login.png"
import githubLogo from "./assests/github.png"
import linkedinLogo from "./assests/linkedin.png"

// Import axios for better fetching
import axios from 'axios'

// Import Firebase for db, and authentication
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import newIcon from './assests/logo.ico';

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { addDoc, collection, getDocs, getFirestore, doc, deleteDoc, getDoc} from 'firebase/firestore';


// Keys for firestore, I need to remove
const firebaseConfig = {
  apiKey: "AIzaSyDiXBReqBDwadcBvwaCQ8_M0GDYt3nPRe0",

  authDomain: "lift-mate.firebaseapp.com",

  projectId: "lift-mate",

  storageBucket: "lift-mate.appspot.com",

  messagingSenderId: "610390467922",

  appId: "1:610390467922:web:7f7bc688f904bf7917868b",

  measurementId: "G-LP4ZMDTJB9"

}

// Keys for USDA need to remove
const API_KEY = 'zaBw11gYNv77O6IdJXk8V4vaVEwCGSN9sZm9i7NG';


// Here we initialize firebase, and get the db from firestore
const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);


// Here is where we call fetch to get the USDA calories
  async function getCalories(foodName){
    try {
      let response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search?api_key='+API_KEY+'&query='+foodName);
      let calories = response.data.foods[0].foodNutrients[3].value; // Makes json readable
      return {
        cal: calories,
        foodName: foodName
      }
    } catch (error) {
      // TODO remove this to console.log so that you don't see error, but something else.
      return {
        cal: 100,
        foodName: "Error"
      }
      // console.log(error);
    }
  }



// Initalize all of the different lists
const intitialFoodsBrek = [
  { id: 0, name: 'Loading...', cal: 'Loading...' , amount: 'Loading...'},
];
const intitialFoodsLun = [
  { id: 0, name: 'Loading...', cal: 'Loading...' , amount: 'Loading...'},
];
const intitialFoodsDin = [
  { id: 0, name: 'Loading...', cal: 'Loading...' , amount: 'Loading...'},
];
const intitialFoodsSnack = [
  { id: 0, name: 'Loading...', cal: 'Loading...' , amount: 'Loading...'},
];



// Here is how we get the authentication for firebase
const auth = firebase.auth();
const firestore = firebase.firestore();





// Sign in function will get the google authentication, and send it to the site.
function SignIn(){
  const signInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle} id="user"> <img src={login} alt="google" height="50px" className='loginimg'/></button>
  )
}




// This calls the sign in funciton
function SignInFun(){

  return(
    <SignIn />
  )
}


// Here is where we actually start getting the food, and listing it out.
function Food({food_list, meals}) {

  // Lets you delete things from the database
  // TODO add functionality to delete it from the use state too.
  const deletFood = async (id) => {
    const foodDoc = doc(db, meals, id) ;
    await deleteDoc(foodDoc) ;
  }
  
  // Returns the food in a readable way, so that you can see it in the meal
  return(
    <div >
    {food_list.map((food) => (
      <div key={food.id} className='foodlayout'>
        <p >{food.cal}</p>
        <p>{food.name}</p>
        <p>{food.amount}</p>
          <button onClick={() =>{deletFood(food.id)}}>delete</button>
      </div>
    ))}
  </div>
  )
}

// Calls the food function, and shows each of the different meals, and basic frame work.
function Meal(props) {
  return(
    <div className='meal'>
      <h1>{props.meal}</h1>
      <div className='foodlayout'>
        <p>calories</p>
        <p>name</p>
        <p>amount</p>
      </div>
  <Food food_list={props.food_list} meals={props.meals} />
  {/* <Food /> */}
  </div>
)}



// This fucntion is the drop down menu.
function Menu ({foodListBrek, foodSetBrek, foodListLun, foodSetLun, foodListDin, foodSetDin, foodListSnack, foodSetSnack}){

  // Basic functions to add the food to each of the different use states.
  const addBreakfast = (addedFood) => {
    foodSetBrek([ ...foodListBrek,  addedFood]);
  };
  const addLunch = (addedFood) => {
    foodSetLun([ ...foodListLun,  addedFood]);
  };
  const addDinner = (addedFood) => {
    foodSetDin([ ...foodListDin,  addedFood]);
  };
  const addSnack = (addedFood) => {
    foodSetSnack([ ...foodListSnack,  addedFood]);
  };

  // This is the fucntion that everything calls, so that we can add to the db, and use state.
  async function handleFood(addFunction,foodToAdd, meal,secondFunction) {
    let {cal, foodName} = await getCalories(foodToAdd); // This part goes out and gets the calories.
    addFunction({ id: 2, name: foodName, cal: cal, amount: '1'}, meal)
    secondFunction({ id: 2, name: foodName, cal: cal, amount: '1'})
  }

  // Here is where we actually add to the db, 
  const createFoods = async (addedFood, meal) => {
    const foodsCollectionRef = collection(db, meal)
    await addDoc(foodsCollectionRef, addedFood)
  }
  // Here we set the input values, so that the inputs, have something to give to the function above.
  const [inputValueBrek, setInputValueBrek] = useState("");
  const [inputValueLun, setInputValueLun] = useState("");
  const [inputValueDin, setInputValueDin] = useState("");
  const [inputValueSnack, setInputValueSnack] = useState("");
  

  return(
    <div className='menuitemholder'>
      <button className='menuItem' onClick={() => handleFood(createFoods, inputValueBrek, "brek",addBreakfast)}>Breakfast</button>
                <input className='menuInput' type="text" value={inputValueBrek} 
                onChange={event => setInputValueBrek(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(createFoods, inputValueLun, "lun",addLunch)}>Lunch</button>
      <input className='menuInput' type="text" value={inputValueLun} 
                onChange={event => setInputValueLun(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(createFoods, inputValueDin, "din",addDinner)}>Dinner</button>
      <input className='menuInput' type="text" value={inputValueDin} 
                onChange={event => setInputValueDin(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(createFoods, inputValueSnack, "snack",addSnack)}>Snack</button>
      <input className='menuInput' type="text" value={inputValueSnack} 
                onChange={event => setInputValueSnack(event.target.value)}/>
    </div>
  )
}


// This is the main function that calls everything else.
function App() {
  // This goes into the head, and adds an image to the title page.
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/ico';
  link.rel = 'shortcut icon';
  link.href = newIcon;
  document.getElementsByTagName('head')[0].appendChild(link);

  // This is code so that you can show if someone is logged in or not. It will show the user id.
  const [userId, setUserId] = useState(null);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        setUserId(user.uid);
    } else {
        setUserId(null);
    }
});

  // This is a simple use state and function to keep track of the menu, wheather open or not.
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };


  // Here we intitailize the usestates, for the food containers.
  const [foodsBrek, setFoodsBrek] = useState(intitialFoodsBrek);
  const [foodsLun, setFoodsLun] = useState(intitialFoodsLun);
  const [foodsDin, setFoodsDin] = useState(intitialFoodsDin);
  const [foodsSnack, setFoodsSnack] = useState(intitialFoodsSnack);

  // Here we initialize each different db of food, so that we can get updated, each time we start the
  // Site.
  const foodsCollectionRefBrek = collection(db, "brek")
  useEffect (() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRefBrek)
      setFoodsBrek(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getFoods()
  }, [])

  const foodsCollectionRefLun = collection(db, "lun")
  useEffect (() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRefLun)
      setFoodsLun(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getFoods()
  }, [])
  const foodsCollectionRefDin = collection(db, "din")
  useEffect (() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRefDin)
      setFoodsDin(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getFoods()
  }, [])
  const foodsCollectionRefSnack = collection(db, "snack")
  useEffect (() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRefSnack)
      setFoodsSnack(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    }
    getFoods()
  }, [])

  return (
    <div className="App">
    <header>
            <img height="60em" src={logo} alt="logo"/>
            <h1 className='disapear'>LiftMate</h1>
            
            <h1 className='date'>Today</h1>
            <SignInFun />
    </header>

    <main className="main">
      <div className="left">
      {/* onMouseLeave={handleOpen} add this to the line below to have the menut disapear */}
      <div className='hoverButton'  onMouseEnter={handleOpen} >Add Food</div> 
      {open ? <Menu foodListBrek={foodsBrek} foodSetBrek={setFoodsBrek} 
      foodListLun={foodsLun} foodSetLun={setFoodsLun}
      foodListDin={foodsDin} foodSetDin={setFoodsDin}
      foodListSnack={foodsSnack} foodSetSnack={setFoodsSnack}/> : <div></div>}
      </div>
      <div className='mealHolder'>
        <Meal  meal="Breakfast" food_list={foodsBrek} meals="brek"/>
        <Meal meal="Lunch" food_list={foodsLun} meals="lun"/>
        <Meal meal="Dinner" food_list={foodsDin} meals="din"/>
        <Meal meal="Snacks" food_list={foodsSnack} meals="snack"/>
      </div>
    </main>

    <footer>
        <nav className="footeritems"> <img height='100px' src={githubLogo} alt="Github" /></nav>
        <nav className="footeritems"><img height='37px' src={linkedinLogo} alt="LinkedIn" /></nav>
        <p className="footeritems">Copyright 2022</p>
    </footer>
    </div>
  );
}
export default App;
