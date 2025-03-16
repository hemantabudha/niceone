import Navbar from "../component/Navbar";
import "./Wishlist.css"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faXmark,faShare, faBookOpen, faBookOpenReader, faDollar, faHeart, faHome, faNewspaper, faPlus, faRightFromBracket, faThumbsUp, faThumbTack, faUpload, faUser, faUserPlus, faUsers, faArrowUp, faArrowTrendUp  } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Helmet } from "react-helmet"; // Import react-helmet
import { useState,useEffect } from "react";
export default function Wishlist(){

  const[wishlistdata,setwishlistdata]=useState([]);
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const[totallikes,settotallikes]=useState(null)
   const [user, setUser] = useState(null);
 const[noofpost,setnoofpost]=useState(null)
 const [page, setPage] = useState(1);  // Track the current page
 const [loadingpage, setLoadingpage] = useState(false);  // Track loading state  
  const navigate=useNavigate();
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
  useEffect(() => {
    
    const checkTokenAndFetchData = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) {
        // If no token, redirect to login page
        navigate("/login");
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

        setUser(response.data.user)
    
      } catch (error) {
        localStorage.removeItem("token")
        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, []);
  useEffect(() => {
    const fetchTotalLikes = async () => {
      if (!user || !user._id) return; // Ensure user is available

      try {
        const response = await axios.get(`${backendurl}/user/${user._id}/total-likes`);
     
        settotallikes(response.data.totalLikes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };

    fetchTotalLikes();
  }, [user,navigate]);
  const handledeletepost = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }
    try {
      const response = await axios.delete(`${backendurl}/upload/file/wishlist/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const updatedwishlistdata = wishlistdata.filter(wishlistdata => wishlistdata._id !== id);
      setwishlistdata(updatedwishlistdata)
    } catch (error) {
      
    }
  }
const handlepostinfo=(e,id)=>{
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
const formatLikes = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
  return num.toString(); // Less than 1K, show the number as is
};
useEffect(() => {
  const fetchUserData = async () => {
    setLoadingpage(true);
    const initialLimit = window.innerWidth < 600 ? 9 :18;
    const limit = page === 1 ? initialLimit : 5;
    const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }
   
    try {
      const response = await axios.post(`${backendurl}/upload/file/people/profile/wishlistwala`, {
        limit,
        excludeIds: wishlistdata.map((post) => post.postId), // Exclude already fetched posts
    },{
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
       setnoofpost(response.data.totalCount)
      const newPosts = response.data.datas;
      if (page === 1) {
        setwishlistdata(newPosts); // Replace old data with fresh posts
      } else {
        setwishlistdata((prevData) => {
          // Ensure the order is maintained by reversing the new posts before prepending
          return [...prevData,...newPosts];
        }); // Append for pagination
      }
    } catch (error) {
      console.error("Error fetching user news:", error);
    } finally {
      setLoadingpage(false);
    }
  };

  fetchUserData();
}, [page, navigate]);
const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
  if (bottom && !loadingpage) {
    setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
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
  return(
    <div className="alwaysmain">
  <Helmet>
        <title>Your Wishlist | TheQuilk</title>
        <meta
          name="description"
          content="user can wishlist any note and user wishlist notes are stored here in your wishlist page. Easily access all your favorite notes and other studymaterial and wishlist any content you enjoy!"
        />
        <meta
          name="keywords"
          content="note sharing, wishlist notes, favorite notes, note storage,wishlistanynote,savedanynote, wishlist feature, TheQuilk notes, saved notes, wishlist your favorite notes, TheQuilk, note-sharing platform"
        />
        <meta name="author" content="TheQuilk" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="TheQuilk | wishlist" />
        <meta
          property="og:description"
          content="Explore TheQuilk's wide range of educational notes, news, and videos and wishlist it . Follow teachers and stay updated with new content."
        />
        <meta
          property="og:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
        <meta property="og:url" content="https://thequilk.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheQuilk | wishlist" />
        <meta
          name="twitter:description"
          content="Join TheQuilk to share and view notes, news, and more more like wishlist the notes from creators worldwide."
        />
        <meta
          name="twitter:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
      </Helmet>
<Navbar/>
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
  <div className="sidediv" onClick={handlequiz}>
                  <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon"/>
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
      <div className="infoforallthediv" onScroll={handleScroll}>
<div className="userpro">
        {user&&<img src={user.profile} alt="" className="imagepr" onLoad={handleImageLoad}  style={{ display: "none" }} />}
       {user&&<p className="userna">{user.name}</p>}
       {user&& <p className="userinfotext">{user.description}</p>}
       <div className="butto">
        <div className="upperbutto">
       {noofpost&&<button className="buttoclass">{formatLikes(noofpost)}</button>} 
        {user&&<button className="buttoclass">{formatLikes(user.followercounts)}</button>} 
        {totallikes !== null && totallikes !== undefined && (
  <button className="buttoclass">{formatLikes(totallikes)}</button>
)}

        </div>
        <div className="lowerbutto">
       <button className="buttoclass">wishlist</button>
        <button className="buttoclass">followers</button>
        <button className="buttoclass">likes</button>
        </div>
        </div>
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
        </div>
        <div className="wishlistdiv">
            { Array.isArray(wishlistdata)&& wishlistdata.length > 0 ? (wishlistdata &&wishlistdata.map((current, index) => {
              return (
                <div className="con" key={index} >

                    <div className="remv">
                      <FontAwesomeIcon icon={faTrash} className="tra" onClick={(e) => { handledeletepost(e, current._id) }} />
                    </div>
                    <div className="thumb">
                      <img src={current.thumbnail} alt="Selected" className="thumbna" onClick={(e)=>{handlepostinfo(e,current.postId)}} onLoad={handleImageLoad}  style={{ display: "none" }} />
                    </div>
                  <div className="titled">
                    <p className="ptitl">{current.title.length>44?current.title.slice(0,45)+"...":current.title}</p>
                  </div>
                  <div className="creatord">
                  <img src={current.createdBy.profile} alt="Selected" className="creatorima" onClick={(e)=>{handleprofile(e,current.createdBy.id)}} onLoad={handleImageLoad}  style={{ display: "none" }} />
                  <p className="creatorna" onClick={(e)=>{handleprofile(e,current.createdBy.id)}}>{current.createdBy.name}</p>
                  </div>

                </div>
              )
            })) : (<div className="nodiv"><p className="nocontent">Uff! Create Some wishlist</p></div>)}
  </div>
  </div>
  </div>
</div>
  )
}