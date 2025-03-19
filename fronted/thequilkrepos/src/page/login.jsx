import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet"; // Import react-helmet
import { faArrowTrendUp, faBookOpenReader, faDollar, faHeart, faHome, faLock, faNewspaper, faPhone, faPlus, faRightFromBracket, faThumbsUp, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useNavigate,Link} from "react-router-dom";
import "./Signup.css"
import { useEffect, useState } from "react"
import axios from "axios";
import Navbar from "../component/Navbar";
export default function Signup(){
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const[error,seterror]=useState("");
  const navigate=useNavigate();
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const[userid,setUserid]=useState(null);
  useEffect(() => {
    
    const checkTokenAndFetchData = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        return;
      }
  
      try {
        // Send the token to backend for validation
        const response = await axios.post(
          `${backendurl}/upload/file/verifytoken`,
          {}, 
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
       
        setUserid(response.data.user._id)
    
      } catch (error) {
    
      }
    };
  
    checkTokenAndFetchData();
  }, []);
 const handleemail=(e)=>{
  setemail(e.target.value)
 };
 
 const handlepassword=(e)=>{
  setpassword(e.target.value)
 }
 const handlesubmit = async (e) => {
  e.preventDefault();
  
  // Simple email regex validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email || !password) {
    alert("Please fill out all fields");
    return;
  }

  if (!emailRegex.test(email)) {
    seterror("Please enter a valid email address.");
    return;
  }

  try {
    const data = { email, password };
    const response = await axios.post(`${backendurl}/upload/file/login`, data);
    if (response && response.data) {
      localStorage.setItem("token", response.data.token);
      navigate("/profile");
    }
  } catch (error) {
    seterror(error.response.data.message);
  }
};
const handleImageLoad = (e) => {
  e.target.style.display = "block"; // Make the image visible as soon as it's loaded
};
const handlehome=(e)=>{
  navigate("/")
}
const handleyourprofile=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate("/profile")
  }else{
    alert("login to see your profile.")
  }
}
const handlewishlist=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate("/wishlist")
  }else{
    alert("login to see your wishlist note.")
  }
}
const handlelikenote=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/likenotes/${userid}`)
  }else{
    alert("login to see your like notes")
  }
}
const handlefollowing=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/follower/${userid}`)
  }else{
    alert("login to see your following user.")
  }
}
const handleyourquiz=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/profile/quiz/${userid}`)
  }else{
    alert("login to see your quiz.")
  }
}
const handleyournote=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/profile/info/${userid}`)
  }else{
    alert("login to see your note.")
  }
}
const handleyourdisscussion=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/discuss/info/${userid}`)
  }else{
    alert("login to see your disscussion.")
  }
}
const handleyournews=(e)=>{
  const token = localStorage.getItem("token");
  if(token && userid){
    navigate(`/profile/news/${userid}`)
  }else{
    alert("login to see your news.")
  }
}
const handlequiz=(e)=>{
navigate("/quiz")
}
const handlediscussion=(e)=>{
  navigate("/people")
  }
const handlenews=(e)=>{
  navigate("/news")
}
const handletrend=(e)=>{
  navigate("/trending")
}
const handlerevenue=(e)=>{
  navigate("/revenue")
}
const handlesignout=(e)=>{
  localStorage.removeItem('token')
  navigate("/login")
}
const handletermandcondition=(e)=>{
  navigate("/terms-and-conditions")
}
  return(
    <div className="alwaysmain">
       <Navbar/>
           <Helmet>
        {/* Title shown in search results */}
        <title>Login - TheQuilk</title>

        {/* Description shown below the title */}
        <meta name="description" content="Login to TheQuilk and access your notes, quizzes, and learning resources. Join now for an engaging educational experience!" />

        {/* Keywords for SEO (not very important for Google, but good for other search engines) */}
        <meta name="keywords" content="TheQuilk login, study platform, quizzes, educational notes, student learning" />

        {/* Open Graph (OG) Meta Tags for Facebook & Social Media */}
        <meta property="og:title" content="Login - TheQuilk" />
        <meta property="og:description" content="Access your study materials, quizzes, and discussions on TheQuilk. Sign in now!" />
        <meta property="og:url" content="https://www.thequilk.com/login" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />

        {/* Twitter Card Meta Tags for Better Sharing */}
        <meta name="twitter:title" content="Login - TheQuilk" />
        <meta name="twitter:description" content="Sign in to TheQuilk and continue learning with quizzes, notes, and discussions!" />
        <meta name="twitter:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical URL to avoid duplicate SEO issues */}
        <link rel="canonical" href="https://www.thequilk.com/login" />
      </Helmet>
        <div className="modern">
             <div className="sidebar">
         <div className="sidediv" onClick={handlehome}>
           <FontAwesomeIcon icon={faHome} className="homeicon"/> <span className="para">Home</span>
         </div>
         <div className="sidediv" onClick={handleyourprofile}>
           <FontAwesomeIcon icon={faUser} className="homeicon"/> <span className="para">Profile</span>
         </div>
         <div className="sidediv" onClick={handlewishlist}>
           <FontAwesomeIcon icon={faHeart} className="likeicon"/> <span className="para">wishlist notes</span>
         </div>
         <div className="sidediv" onClick={handlelikenote}>
           <FontAwesomeIcon icon={faThumbsUp} className="likeicon"/> <span className="para">like notes</span>
         </div>
         <div className="sidediv" onClick={handlefollowing}>
           <FontAwesomeIcon icon={faUserPlus} className="followicon"/> <span className="para">following</span>
         </div>
         <div className="sidediv" onClick={handleyourquiz}>
                         <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon"/>
                          <span className="para">Your Quiz</span>
           </div>
           <div className="sidediv" onClick={handleyournote}>
           <FontAwesomeIcon icon={faBookOpenReader} className="likeicon"/> <span className="para">Your Notes</span>
         </div>
         
         <div className="sidediv" onClick={handleyourdisscussion}>
           <FontAwesomeIcon icon={faUsers} className="followicon"/> <span className="para">Your Discussion</span>
         </div>
         <div className="sidediv" onClick={handleyournews}>
           <FontAwesomeIcon icon={faNewspaper} className="trendingpersonicon"/> <span className="para">Your News</span>
         </div>
         <div className="sidediv" onClick={handleyourprofile}>
                         <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png"  alt="" className="likeicon"/>
                          <span className="para">Upload Quiz</span>
           </div>
           <div className="sidediv" onClick={handleyourprofile}>
           <FontAwesomeIcon icon={faPlus} className="likeicon"/> <span className="para">Upload Discussion</span>
         </div>
         <div className="sidediv" onClick={handleyourprofile}>
           <FontAwesomeIcon icon={faUpload} className="likeicon"/> <span className="para">Upload Notes</span>
         </div>
         <div className="sidediv" onClick={handleyourprofile}>
           <FontAwesomeIcon icon={faPlus} className="likeicon"/> <span className="para">Upload News</span>
         </div>
         <div className="sidediv" onClick={handletrend}>
           <FontAwesomeIcon icon={faArrowTrendUp} className="trendingnoteicon"/> <span className="para">Trending Notes</span>
         </div>
         <div className="sidediv" onClick={handlenews}>
           <FontAwesomeIcon icon={faNewspaper} className="likeicon"/> <span className="para">Short News</span>
         </div>
         <div className="sidediv" onClick={handlediscussion}>
           <FontAwesomeIcon icon={faUsers} className="likeicon"/> <span className="para">Discussion</span>
         </div>
         <div className="sidediv" onClick={handletrend}>
           <FontAwesomeIcon icon={faArrowTrendUp} className="trendingnoteicon"/> <span className="para">Trending People</span>
         </div>
         <div className="sidediv" onClick={handlerevenue}>
           <FontAwesomeIcon icon={faDollar} className="likeicon"/> <span className="para">Revenue Sharing</span>
         </div>
         <div className="sidediv" onClick={handlesignout}>
           <FontAwesomeIcon icon={faRightFromBracket} className="likeicon"/> <span className="para">Sign Out</span>
         </div>
         <div className="sidedivterm" onClick={handletermandcondition}>
          <span className="para">Terms and Condition</span> 
         </div>
             </div>
    <div className="signup">
   <div class="info-box">
    <h2>Welcome to TheQuilk</h2>
    <p>📚 Share & discover notes, test your knowledge with quizzes, and engage with a community of learners!</p>
    <ul>
        <li>✅ Share & Discover High-Quality Study Materials</li>
        <li>✅ Test Yourself with Engaging Quizzes & Explanations</li>
        <li>✅ Watch Video Explanations Along with Notes</li>
        <li>✅ Compete for a Spot on the Leaderboard</li>
        <li>✅ Save Your Favorite Lessons & Notes to Wishlist</li>
        <li>✅ Join Discussions to Ask Questions & Share Insights</li>
    </ul>
    <p class="cta">Join now and explore limitless learning opportunities!</p>
</div>
<div className="signupcontainer">
    <div className="photo">
    
        <img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"} alt="image" className="profilerealimage" onLoad={handleImageLoad}  style={{ display: "none" }}/>
     
    </div>
    <div className="info">

    <div className="form">

     <div className="phoneno">
     <label htmlFor="email"><FontAwesomeIcon icon={faUser} className="icon"/></label>
     <input type="email" id="email" placeholder="Enter email" className="inputinfo" value={email} onChange={handleemail} />
     </div>

     
     <div className="password">
     <label htmlFor="password"><FontAwesomeIcon icon={faLock} className="icon"/></label>
     <input type="text" id="password" placeholder="Enter Password" className="inputinfo" value={password} onChange={handlepassword}/>
     </div>

     {error&&error.length>10&&<div className="error">
     <p className="errorparagraph">{error}</p>
     </div>}

     <div className="submit" >
      <button  className="submitbutton" onClick={handlesubmit}>SignIn</button>
     </div>
    <div className="or">
      <button className="orbutton">Or</button>
    </div>
    <div className="create">
            <Link to="/signup"><button className="createbutton">Create a Account</button></Link>
    </div>
    </div>

    </div>
    </div>

    </div>
    </div>
    </div>
  )
}
