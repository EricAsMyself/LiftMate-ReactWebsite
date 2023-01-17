import './App.css';
import React, { useState } from 'react';
// import 'dotenv/config';
import logo from "./assests/logo.png";
import login from "./assests/login.png"
import githubLogo from "./assests/github.png"
import linkedinLogo from "./assests/linkedin.png"
import axios from 'axios'

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

const API_KEY = 'zaBw11gYNv77O6IdJXk8V4vaVEwCGSN9sZm9i7NG';


  async function getCalories(foodName){
    try {
      let response = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search?api_key='+API_KEY+'&query='+foodName);
      let calories = response.data.foods[0].foodNutrients[3].value;
      return {
        cal: calories,
        foodName: foodName
      };
    } catch (error) {
      console.log(error);
    }
  }

  
  // let {cal, foodName} = await getCalories('banana');


const intitialFoodsBrek = [
  { id: 1, name: 'Name', cal: 'Calories' , amount: 'amount'},
  // { id: 2, name: foodName, cal: cal, amount: '11'}
];
const intitialFoodsLun = [
  { id: 1, name: 'Name', cal: 'Calories' , amount: 'amount'},
];
const intitialFoodsDin = [
  { id: 1, name: 'Name', cal: 'Calories' , amount: 'amount'},
];
const intitialFoodsSnack = [
  { id: 1, name: 'Name', cal: 'Calories' , amount: 'amount'},
];



const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn(){
  const signInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider);
  }
  return(
    <button onClick={signInWithGoogle} id="user"> <img src={login} alt="google" height="50px" /></button>
  )
}

function ChatRoom(){

  return(
    <p>you are logged in </p>
  )
}

function SignInFun(){
  // const [user, loading, error] = useAuthState(auth);
  
  return(
    <SignIn />
  )
}

function Food({food_list}) {
  return(
    <div >
    {food_list.map((food) => (
      <div key={food.id} className='foodlayout'>
        <p >{food.cal}</p>
        <p>{food.name}</p>
        <p>{food.amount}</p>
      </div>
    ))}
  </div>
  )
}

function Meal(props) {
  return(
    <div className='meal'>
      <h1>{props.meal}</h1>
  <Food food_list={props.food_list} />
  {/* <Food /> */}
  </div>
)}



function Menu ({foodListBrek, foodSetBrek, foodListLun, foodSetLun, foodListDin, foodSetDin, foodListSnack, foodSetSnack}){

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

  async function handleFood(addFunction,foodToAdd) {
    let {cal, foodName} = await getCalories(foodToAdd);
    addFunction({ id: 2, name: foodName, cal: cal, amount: '11'})
  }
  
  const [inputValueBrek, setInputValueBrek] = useState("");
  const [inputValueLun, setInputValueLun] = useState("");
  const [inputValueDin, setInputValueDin] = useState("");
  const [inputValueSnack, setInputValueSnack] = useState("");
  

  return(
    <div>
      <button className='menuItem' onClick={() => handleFood(addBreakfast, inputValueBrek)}>Breakfast</button>
                <input type="text" value={inputValueBrek} 
                onChange={event => setInputValueBrek(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(addLunch, inputValueLun)}>Lunch</button>
      <input type="text" value={inputValueLun} 
                onChange={event => setInputValueLun(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(addDinner, inputValueDin)}>Dinner</button>
      <input type="text" value={inputValueDin} 
                onChange={event => setInputValueDin(event.target.value)}/>

      <button className='menuItem' onClick={() => handleFood(addSnack, inputValueSnack)}>Snack</button>
      <input type="text" value={inputValueSnack} 
                onChange={event => setInputValueSnack(event.target.value)}/>
    </div>
  )
}



function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const [foodsBrek, setFoodsBrek] = useState(intitialFoodsBrek);
  const [foodsLun, setFoodsLun] = useState(intitialFoodsLun);
  const [foodsDin, setFoodsDin] = useState(intitialFoodsDin);
  const [foodsSnack, setFoodsSnack] = useState(intitialFoodsSnack);



  return (
    <div className="App">
    <header>
            <img height="60em" src={logo} alt="logo"/>
            <h1>LiftMate</h1>
            
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
      <div >
        <Meal  meal="Breakfast" food_list={foodsBrek} />
        <Meal meal="Lunch" food_list={foodsLun}/>
        <Meal meal="Dinner" food_list={foodsDin}/>
        <Meal meal="Snacks" food_list={foodsSnack}/>
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
