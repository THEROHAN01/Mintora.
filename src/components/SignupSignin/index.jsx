import React, { useState } from 'react';
import "./style.css";
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword, signInWithPopup , GoogleAuthProvider } from "firebase/auth";
import { auth, db, provider } from '../../firebase';
import { doc,setDoc } from '../../firebase';
import { getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name,setName] = useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  

  function signupWithEmail(){
    setLoading(true);

    if(name!="" && email!="" && password!="" && confirmPassword!=""){
    if(password==confirmPassword){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("User>>>>", user);
      toast.success("User Created!");
      setLoading(false);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      createDoc(user);
      navigate("/dashboard");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      setLoading(false);
      // ..
    });
      }else{
        toast.error("Password and ConfirmPassword don't match!")
        setLoading(false);
      }
    
  }else{
    toast.error("All fields are mandatory!");
    setLoading(false);
  }

  }
 
  function loginUsingEmail(){
    console.log("Email", email );
    console.log("password",password);
    setLoading(true);

    if(email!="" && password!="" ){

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("User Logged in!");
        console.log("User logged in ", user);
        navigate("/dashboard");
        setLoading(false);




        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);


      });
    }else{
      toast.error("All fields are mandatory!")
      setLoading(false);
    }
  }


  async function createDoc(user){
    setLoading(true);


  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userData = await getDoc(userRef);


  if (!userData.exists()){ 

    try{
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName ? user.displayName : name,
      email: user.email,
      photoURL : user.photoURL ? user.photoURL : "",
      createdAt : new Date(),

    });
    toast.success("doc created!");
    setLoading(false);
       }
        catch(e){
        toast.error(e.message);
        setLoading(false);
       }
  }else{
    toast.error("Doc already exists");
    setLoading(false);

  }



    // create a doc 
    //make shure that the doc with the uid doesnt exist 
  }


  function googleAuth(){
    setLoading(true);
   try{
   signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("user>>", user)
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    createDoc(user);
    toast.success("User Authenticated");
    setLoading(false);
    navigate("/dashboard");
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    toast.error(errorMessage);
    setLoading(false)
  });}
  catch(e){
    toast.error(e.message);
    setLoading(false);

  }
  }

  return (

    <>
  {loginForm ? (<div className='signup-wrapper'>
      <h2 className='title' >Login to <span style={{color:"var(--theme)",fontWeight:700 }}>Mintora.</span></h2>
      <form>
       

        <Input 
        type="email"
        label={"Email"} 
        state={email} 
        setState={setEmail}  
        placeholder={"tonystark@gmail.com"} />

        <Input 
        type="password"
        label={"Password"} 
        state={password} 
        setState={setPassword}  
        placeholder={"XyeRP@#$PIOnt"} />

       
      
        <Button disabled={loading}  text={loading? "loading..." : "Login Using Email and Password"} onClick={loginUsingEmail}/>
        <h4 style={{textAlign:'center', fontSize:'0.9rem',fontWeight:500,margin:0}}>or</h4>
        <Button onClick={googleAuth} text={loading? "loading..." : "Login With Google"}  blue = {true} />
        <p style={{ textAlign:"center", margin:0, fontWeight:350, fontSize:'0.8rem', cursor:'pointer'}} onClick={() => setLoginForm(!loginForm)} > Or Don't Have An Acccount? Click Here</p>
      
      </form>


    </div> 
  ):(
    <div className='signup-wrapper'>
      <h2 className='title' >Sign Up on <span style={{color:"var(--theme)",fontWeight:700 }}>Mintora.</span></h2>
      <form>
        <Input 
        label={"Full Name"} 
        state={name} 
        setState={setName}  
        placeholder={"Tony Stark"} />

        <Input 
        type="email"
        label={"Email"} 
        state={email} 
        setState={setEmail}  
        placeholder={"tonystark@gmail.com"} />

        <Input 
        type="password"
        label={"Password"} 
        state={password} 
        setState={setPassword}  
        placeholder={"XyeRP@#$PIOnt"} />

        <Input 
        type="password"
        label={"Confirm Password"} 
        state={confirmPassword} 
        setState={setConfirmPassword}  
        placeholder={"XyeRP@#$PIOnt"} />
      
        <Button disabled={loading}  text={loading? "loading..." : "Signup Using Email and Password"} onClick={signupWithEmail}/>
        <h4 style={{textAlign:'center', fontSize:'0.9rem',fontWeight:500,margin:0}}>or</h4>
        <Button onClick={googleAuth} text={loading? "loading..." : "Signup With Google"}  blue = {true} />
        <p style={{ textAlign:"center", margin:0, fontWeight:350, fontSize:'0.8rem', cursor:'pointer'}} onClick={() => setLoginForm(!loginForm)}> Or Have An Acccount Already? Click Here</p>

      </form>


    </div>)
    }
    
    </>
  )
}

export default SignupSigninComponent;
// const [user, loading , error] = ureAuthState(auto,options);