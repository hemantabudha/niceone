import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faBookOpen, faBookOpenReader, faCrown, faDollar, faHeart, faHome, faNewspaper, faPlus, faRightFromBracket, faStar, faThumbsUp, faThumbTack, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Trending.css"
export default function Trending(){
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const[userid,setUserid]=useState(null)
  const[trendingnotes,settrendingnotes]=useState([]);
  const[trendingpeople,setrendingpeople]=useState([])
  const navigate=useNavigate();
  const handlesignout=(e)=>{
    localStorage.removeItem('token')
    navigate("/login")
  }

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
  const handlehome=(e)=>{
    navigate("/")
  }
  useEffect(()=>{
    const fetchads=async ()=>{
      try{
      const response=await axios.get(`${backendurl}/trendingpeople`);

      setrendingpeople(response.data)
      }catch(error){
        
      }
    }
    fetchads();
  },[navigate])
  useEffect(()=>{
    const fetchads=async ()=>{
      try{
      const response=await axios.get(`${backendurl}/trendingnotes`);

      settrendingnotes(response.data)
      }catch(error){
        
      }
    }
    fetchads();
  },[navigate])
  const handledetail=(e,id)=>{
    e.stopPropagation();
    navigate(`/detail/review/${id}`)
  }
 const handleprofile=(e,id)=>{
  e.stopPropagation();
  navigate(`/profile/info/${id}`)
 }
 const handleImageLoad = (e) => {
  e.target.style.display = "block"; // Make the image visible as soon as it's loaded
};

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
const handletermandcondition=(e)=>{
  navigate("/terms-and-conditions")
}
    return(
    <div className="alwaysmain">
       <Helmet>
        <title>Trending - TheQuilk</title>
        <meta
          name="description"
          content="TheQuilk is your one-stop platform for notesharing platform and now contain the top trending notesharer and trending people on thequilk. for sharing and viewing notes, news, and educational content. Follow your favorite creators, like posts, and explore new ideas."
        />
        <meta
          name="keywords"
          content="TheQuilk, trending,notesharing,education,disccussion,studentnote,sellyournote,note sharing, educational platform, news, learning, videos, teachers, students"
        />
        <meta property="og:title" content="TheQuilk | Trending" />
        <meta
          property="og:description"
          content="Explore TheQuilk's wide range of educational notes, news, and videos. Follow teachers and stay updated with new content also you can see the trending people and notes."
        />
        <meta
          property="og:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
        <meta property="og:url" content="https://thequilk.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheQuilk | Home" />
        <meta
          name="twitter:description"
          content="Join TheQuilk to share and view notes, news, and more from creators worldwide."
        />
        <meta
          name="twitter:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
      </Helmet>
      <Navbar />
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
                  <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt=""  className="likeicon"/>
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
  <div className="sidediv" onClick={handlequiz}>
                  <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png"  alt="" className="likeicon"/>
                   <span className="para">Upload Quiz</span>
    </div>
    <div className="sidediv" onClick={handlediscussion}>
    <FontAwesomeIcon icon={faPlus} className="likeicon"/> <span className="para">Upload Discussion</span>
  </div>
  <div className="sidediv" onClick={handleyourprofile}>
    <FontAwesomeIcon icon={faUpload} className="likeicon"/> <span className="para">Upload Notes</span>
  </div>
  <div className="sidediv" onClick={handlenews}>
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
      <div className="viralpersonandnotes">
        <div className="viralperson">
              <div className="trendingpersondiv">
                <FontAwesomeIcon icon={faArrowTrendUp} className="trendicon"/> <span className="trendingparagraph">Person Of the Day</span> 
              </div>
              <div className="trendholder">
              {trendingpeople&&trendingpeople.length>0&&trendingpeople.map((current,index)=>{
                return(
                  <div className="trenddiv" key={index} style={{marginBottom:"10px"}}>
                  
                  <img src={current.profile} alt={current.name} className="sizephoto" onClick={(e)=>{handleprofile(e,current._id)}} onLoad={handleImageLoad}  style={{ display: "none" }}/>
                  <div className="icontoproudholder" style={{marginBottom:"5px",marginTop:"5px"}}>
                  <FontAwesomeIcon icon={faStar} className="icontoproud"/>
                  <FontAwesomeIcon icon={faCrown} className="crownicon"/>
                  <FontAwesomeIcon icon={faStar} className="icontoproud"/>
                  </div>
                  <p className="photoname" style={{height:"21px",overflow:"hidden"}}>{current.name}</p>
                </div>
                )
              })}
                 </div>
        </div>
        <div className="viralnotes">
        <div className="trendingpersondiv">
                <FontAwesomeIcon icon={faArrowTrendUp} className="trendicon"/> <span className="trendingparagraph">Trending Notes</span>   
                <FontAwesomeIcon icon={faArrowTrendUp} className="trendicon" style={{marginLeft:"20px"}}/> <span className="trendingparagraph">Trending Notes</span>
              </div>
              <div className="noteholder">
              {trendingnotes&&trendingnotes.length>0&&trendingnotes.map((current,index)=>{
                return(
                  <div className="containe" key={index} >
                  <div className="thumbnaildi">
                    <img src={current.thumbnail} alt={current.title} className="thumbnai" onClick={(e)=>{handledetail(e,current._id)}} onLoad={handleImageLoad}  style={{ display: "none" }} />
                  </div>
                <div className="titledi">
                  <p className="ptitl">{current.title.length>44?current.title.slice(0,45)+"...":current.title}</p>
                </div>
                <div className="creatordi">
                <img src={current.createdBy.profile} alt={current.title} className="creatorima" onClick={(e)=>{handleprofile(e,current.createdBy._id)}} onLoad={handleImageLoad}  style={{ display: "none" }} />
                <p className="creatornam" onClick={(e)=>{handleprofile(e,current.createdBy._id)}}>{current.createdBy.name}</p>
                </div>
    
              </div>
                )
              })}
              </div>
        </div>
      </div>
     </div>
    </div>
  )
}