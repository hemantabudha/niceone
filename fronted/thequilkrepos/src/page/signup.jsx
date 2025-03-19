import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faGlassMartiniAlt, faLock,faCamera, faUser, faHome, faHeart, faThumbsUp, faUserPlus, faBookOpenReader, faUsers, faNewspaper, faPlus, faUpload, faArrowTrendUp, faDollar, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { faGoogleScholar } from "@fortawesome/free-brands-svg-icons";
import "./Signup.css"
import { useEffect, useState } from "react"
import axios from "axios";
import { Helmet } from "react-helmet"; // Import react-helmet
import Navbar from "../component/Navbar";
export default function Signup(){
  const[profile,setprofile]=useState();
  const[name,setname]=useState();
  const[email,setemail]=useState();
  const[education,seteducation]=useState();
  const[password,setpassword]=useState();
  const[error,seterror]=useState();
  const navigate=useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);
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
  const handleprofile = (e) => {
    const file = e.target.files[0];

    if (!file) return; // If no file is selected, do nothing

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed.");
        return;
    }

    // Check if the file size exceeds 1MB (1,048,576 bytes)
    if (file.size > 1048576) {
        alert("Please select an image within 1MB.");
        return;
    }

    // Set profile image
    setprofile({ src: URL.createObjectURL(file), file });
};

  const handlename=(e)=>{
 if(e.target.value.length<25){
      setname(e.target.value)
 }
  };
 
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const handleemail = (e) => {
    const emailValue = e.target.value;
    setemail(emailValue);
  
    // Simple email validation regex
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailValue)) {
      seterror("Please enter a valid email address");
    } else {
      seterror(""); // Clear error if email is valid
    }
  };
  const uploadToS3 = async (file) => {
    const fileExtension = file.name.split('.').pop();
    const objectKey = `${Date.now()}.${fileExtension}`;
    const s3Url = `https://quilkimages.s3.ap-south-1.amazonaws.com/${objectKey}`;
  
    try {
      // Upload the file to S3 with Cache-Control header for 1-year caching
      await axios.put(s3Url, file, {
        headers: {
          "Content-Type": file.type, // Set content type for the file
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        },
      });
      
      return s3Url; // Return the public URL of the uploaded file
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };
  
  const handlesubmit = async (e) => {
    e.preventDefault(); 
    if (!isAgreed) {
      alert("You must agree to the Terms and Conditions to proceed.");
     
      return;  // Prevent submission if not agreed
    }
    if (!profile || !name || !email || !education || !password) {
      alert("Please upload your profile picture ,name ,email ,education. thank you");
     
      return;
    }
    if (error && error.length > 0) {
      alert(error); // Show error if email is invalid
     
      return;
      
    }
    setLoading(true);
    if(loading){
      alert("account is creating.please wait.")
      return;
    }
    const profileImageUrl = await uploadToS3(profile.file);
    try {
    const body={
      profile:profileImageUrl,
      name,
      email,
      education,
      password,
    }
        const response = await axios.post(`${backendurl}/upload/file/signup`, body, {
          headers: { "Content-Type": "application/json" }, 
        }
        );
  
      navigate("/login"); // Navigate to login page after successful sign-up
    } catch (error) {
      seterror(error.response.data.message);
      setname("");
      setemail("");
    }finally {
      // Set loading state to false after the process finishes
      setLoading(false);
    }
  };
  
 
 const handleeducation=(e)=>{
if(e.target.value.length<25){
    seteducation(e.target.value)
}
 };
const handlepassword = (e) => {
  const passwordValue = e.target.value;
  setpassword(passwordValue);

  // Modified regex to ensure no spaces and at least 8 characters
  const passwordPattern = /^[^\s]{8,}$/; // This ensures no spaces and at least 8 characters

  if (!passwordPattern.test(passwordValue)) {
    seterror("Password must be at least 8 characters long and cannot contain spaces.");
  } else {
    seterror(""); // Clear error if password is valid
  }
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
        <title>Sign Up - TheQuilk</title>

        {/* Description shown below the title */}
        <meta name="description" content="Create your account on TheQuilk and access study notes, quizzes, and discussions. Join now for interactive learning!" />

        {/* Keywords for SEO */}
        <meta name="keywords" content="TheQuilk signup, register, create account, study platform, quizzes, notes, learning" />

        {/* Open Graph (OG) Meta Tags for Facebook & Social Media */}
        <meta property="og:title" content="Sign Up - TheQuilk" />
        <meta property="og:description" content="Create your TheQuilk account to access exclusive study materials, quizzes, and discussions!" />
        <meta property="og:url" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content="Sign Up - TheQuilk" />
        <meta name="twitter:description" content="Join TheQuilk and start exploring educational resources, quizzes, and study materials!" />
        <meta name="twitter:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.thequilk.com/signup" />
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
  <div>
  <Link to="/login"><FontAwesomeIcon icon={faCircleLeft} className="circleleft"/></Link> 
  </div>
    <div className="photo">
                   <label htmlFor="profile">
                      {(profile?(<img src={profile.src} alt="image" className="changeimage"/>):(<img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/473228719_2496064460600488_5606142966387708656_n-modified+(1).png"} className="changeimage"/>))}
                    </label>
                    <label htmlFor="profile" className="labelicon">
                    <FontAwesomeIcon icon={faCamera} className="cameraicon"/>
                    </label>
                    <input type="file" name="" id="profile"  className="profile" onChange={handleprofile}/>
    </div>
       
    <div className="info">

    <div className="form">

      <div className="name">
      <label htmlFor="name"><FontAwesomeIcon icon={faUser} className="icon"/></label>
  <input type="text" id="name" placeholder="Enter Your Name" className="inputinfo" onChange={handlename} value={name}/>
      </div>

     <div className="phoneno">
     <label htmlFor="phone"><img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/gmaillogo.png"} alt="" className="icon" /></label>
 
     <input type="email" id="phone" placeholder="Enter your Email" className="inputinfo" onChange={handleemail} value={email}/>
     </div>

     <div className="education">
     <label htmlFor="education"><FontAwesomeIcon icon={faGoogleScholar} className="icon"/></label>
     <input type="text" id="education" placeholder="Education Qualification" className="inputinfo" value={education} onChange={handleeducation}/>
     </div>

     <div className="password">
     <label htmlFor="password"><FontAwesomeIcon icon={faLock} className="icon"/></label>
     <input type="text" id="password" placeholder="Create a Password" className="inputinfo" value={password} onChange={handlepassword}/>
     </div>
     <div className="terms" style={{display:"flex",justifyContent:"center",marginTop:"10px"}}>
              <input
                type="checkbox"
                id="terms"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
              />
              <label htmlFor="terms" className="terms-label" style={{marginLeft:"20px"}}>
                I agree to the <Link to="/terms-and-conditions" className="terms-link">Terms and Conditions</Link>
              </label>
            </div>
     {error&&error.length>10&&<div className="error">
     <p className="errorparagraph">{error}</p>
     </div>}

     <div className="submit" >
      <button  className="submitbutton" onClick={handlesubmit}>{loading ? "Uploading..." : "Signup"}</button>
     </div>

    </div>

    </div>
    </div>
  
    </div>
    </div>
    </div>
  )
}
