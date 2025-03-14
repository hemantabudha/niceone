import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faBook, faBookOpen, faBookOpenReader, faDollar, faHeart, faHome, faNewspaper, faPlus, faRightFromBracket, faThumbsUp, faThumbTack, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
export default function Home() {
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  
  const [page, setPage] = useState(1);  // Track the current page
  const [loading, setLoading] = useState(false);  // Track loading state
  const navigate=useNavigate();
  const [postdata, setpostdata] = useState([]);
  const [mixdata, setmixdata] = useState([]);
  const [adsdata, setadsdata] = useState([]);
  const[userid,setUserid]=useState(null)
  // Function to merge the post data and ads data
  const mixArray = (array1, array2) => {
    const result = [];
    let adIndex = 0;
    
    // Shuffle ads before using them
    const shuffledAds = [...array2].sort(() => Math.random() - 0.5); // Randomly shuffle ads
    
    for (let i = 0; i < array1.length; i++) {
      result.push(array1[i]); // Push post data item
  
      // After every 2 posts, insert an ad randomly from the shuffled ads list
      if ((i + 1) % 8 === 0 && adIndex < shuffledAds.length) {
        result.push(shuffledAds[adIndex]); // Insert ad
        adIndex = (adIndex + 1) % shuffledAds.length; // Cycle through ads
      }
    }
    return result;
  };
  

  const handledetail=(e,id)=>{
    e.stopPropagation();
    navigate(`/detail/review/${id}`)
  }
 const handleprofile=(e,id)=>{
  e.stopPropagation();
  navigate(`/profile/info/${id}`)
 }


useEffect(()=>{
  const fetchads=async ()=>{
    try{
    const response=await axios.get(`${backendurl}/homeads`);
   
    setadsdata(response.data.homeads)
    }catch(error){
      
    }
  }
  fetchads();
},[navigate])
useEffect(() => {
  const fetchPosts = async () => {
    setLoading(true);
    const initialLimit = window.innerWidth < 600 ? 9 :
    window.innerWidth > 3000 ? 35 : 25;
    const limit = page === 1 ? initialLimit : 5;
    try {
      const response = await axios.post(`${backendurl}/upload/file/home`, {
        limit,
        excludeIds: postdata.map((post) => post._id), // Send IDs of already fetched posts
      });

      const newPosts = response.data.datas;

      if (page === 1) {
        setpostdata(newPosts); // Replace old data with fresh posts
      } else {
        setpostdata((prevData) => [...prevData, ...newPosts]); // Append for pagination
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [page, navigate]); // Fetch when page changes
  // Fetch posts when the page changes

  // Once postdata is updated, merge it with adsdata and update mixdata
  useEffect(() => {
    if (postdata.length > 0 && adsdata.length>0) {
      const mixedData = mixArray(postdata, adsdata);
      setmixdata(mixedData);  // Update mixdata with merged data
    }
  }, [postdata,adsdata]);  // Run this effect when postdata changes

const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
  if (bottom && !loading) {
    setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
  }
};
const handleImageLoad = (e) => {
  e.target.style.display = "block"; // Make the image visible as soon as it's loaded
};
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
const handlemath = () => {
    navigate(`/search?query=math`);
};
const handlebiology = () => {
  navigate(`/search?query=biology`);
};
const handlephysics=()=>{
  navigate(`/search?query=physics`);
}
const handlejee=()=>{
  navigate(`/search?query=jee`);
}
const handleneet=()=>{
  navigate(`/search?query=neet`);
}
const handlechemistry=()=>{
  navigate(`/search?query=chemistry`);
}
const handlezoology=()=>{
  navigate(`/search?query=zoology`);
}
const handlebotany=()=>{
  navigate(`/search?query=botany`);
}
const handleaccount=()=>{
  navigate(`/search?query=account`);
}
const handlescience=()=>{
  navigate(`/search?query=science`);
}
const handlemanagement=()=>{
  navigate(`/search?query=management`);
}
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

  return (
    <div className="alwaysmain">
     <Helmet>
        <title>Quilk-Notesharing-website</title>
        <meta 
          name="description" 
          content="TheQuilk is a global digital library for students and educators to share high-quality notes, participate in discussions, take quizzes, and support learning. Wishlist notes, follow creators, and engage in a mini Q&A community." 
        />
        <meta 
          name="keywords" 
          content="TheQuilk, educational notes, study resources, quizzes, student discussions, note-sharing, digital library, Q&A platform, learning support, online study, academic collaboration" 
        />
        <meta name="author" content="TheQuilk Team" />
        
        {/* Open Graph for Social Media */}
        <meta property="og:title" content="TheQuilk - Share Notes, Discuss, Quiz & Learn" />
        <meta 
          property="og:description" 
          content="Join TheQuilk to explore study notes, take quizzes, engage in discussions, and connect with a global learning community." 
        />
        <meta property="og:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta property="og:url" content="https://thequilk.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheQuilk - Share Notes, Discuss, Quiz & Learn" />
        <meta 
          name="twitter:description" 
          content="TheQuilk lets you share notes, participate in discussions, take quizzes, and connect with a learning-focused community." 
        />
        <meta name="twitter:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta name="twitter:site" content="@TheQuilk" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://thequilk.com/" />
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
    <FontAwesomeIcon icon={faUserPlus} className="followicon"/> <span className="para">your following</span>
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
     <div className="postcontainer" onScroll={handleScroll}>
   
<div className="mobileops">

  <div className="buttonholders" onClick={handlebiology}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Biology Notes</button>
  </div>
  <div className="buttonholders" onClick={handlephysics}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Physics Notes</button>
  </div>
  <div className="buttonholders" onClick={handlejee}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Jee Notes</button>
  </div>
  <div className="buttonholders" onClick={handleneet}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Neet Notes</button>
  </div>
  <div className="buttonholders" onClick={handlemath}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Math Notes</button>
  </div>
  <div className="buttonholders" onClick={handletrend}>
    <FontAwesomeIcon icon={faArrowTrendUp}/>
    <button className="buttonsz">Trending Notes</button>
  </div>
  <div className="buttonholders" onClick={handlechemistry}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Chemistry</button>
  </div>
  <div className="buttonholders" onClick={handlezoology}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Zoology Notes</button>
  </div>
  <div className="buttonholders" onClick={handletrend}>
    <FontAwesomeIcon icon={faArrowTrendUp}/>
    <button className="buttonsz">Trending Notes</button>
  </div>
  <div className="buttonholders" onClick={handlebotany}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Botany Notes</button>
  </div>
  <div className="buttonholders" onClick={handleaccount}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Account Notes</button>
  </div>
  <div className="buttonholders" onClick={handlescience}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Science Notes</button>
  </div>
  <div className="buttonholders" onClick={handlemanagement}>
    <FontAwesomeIcon icon={faBookOpenReader}/>
    <button className="buttonsz">Management Notes</button>
  </div>
</div>

        {postdata.length > 0 && mixdata.length > 0 ? (
          mixdata.map((current, index) => {
            return (index + 1) % 9 === 0 ? (
                <div className="contentdivsponsored" key={index}>
                  
                    <div className="shows">
                   
                    {current.imgsrc && (
  current.imgsrc.match(/\.(mp4|webm|ogv)$/i) ? (
    <a href={current.links} target="_blanks">
       <video
      src={current.imgsrc}
      alt="Selected"
      className="showimage"
      loop
      muted
      autoPlay
      onLoad={handleImageLoad}  style={{ display: "none" }}
    />
    </a>
   
  ) : (
    <a href={current.links} target="_blanks">
        <img
      src={current.imgsrc}
      className="showimage"
      alt="Selected"
      onLoad={handleImageLoad}  style={{ display: "none" }}
    />
    </a>
  
  )
)}

                   
                  </div>
                
                  <div className="title">
                    <p className="currenttitle">{current.title}</p>
                  </div>
                  <div className="creatordiv">
                <a href={current.links} target="_blanks">
                <img
                    src={current.profileimage}
                    alt="Selected"
                    className="userimage"
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                  />
                  </a> 
                  <p className="usernames">Sponsered</p>
                  <a href={current.links} target="_blank" ><button className="showlink">Visit</button></a>
                </div>
            
              </div>
            ) : (
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
            );
          })
        ) : (
          <div className="nodiv">
            <p className="nocontent">LOADING...</p>
          </div>
        )}
      </div>
     </div>
    </div>
  );
}
