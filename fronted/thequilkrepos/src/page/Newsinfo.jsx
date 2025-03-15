import Navbar from "../component/Navbar";
import "./News.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft,faChevronRight,faThumbsUp,faShare,faUsers,faNewspaper,faUserPlus,faArrowTrendUp, faUser, faBookOpenReader, faHome, faHeart, faRightFromBracket, faDollar, faPlus, faUpload} from "@fortawesome/free-solid-svg-icons"
import { useState,useEffect } from "react"
import { useNavigate ,useParams} from "react-router-dom"
import { Helmet } from "react-helmet"; // Import react-helmet
import axios from "axios"
export default function Newsinfo(){
  const navigate=useNavigate();
  const [postdata, setpostdata] = useState([]);
  const[updateddata,setupdateddata]=useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(1);  // Track the current page
  const [loading, setLoading] = useState(false);  // Track loading state  
   const { id } = useParams();
   const[totallikes,settotallikes]=useState(null)
   const backendurl=import.meta.env.VITE_BACKEND_URL;
     const [follow, setFollow] = useState(null);
     const [userid, setUserid] = useState(null)
     const [adsdata, setadsdata] = useState([]);
      const mixArray = (array1, array2) => {
       const result = [];
       let number = 0;
       for (let item = 0; item < array1.length; item++) {
         result.push(array1[item]);  // Push the post data item
         if ((item + 1) % 10 === 0 && number < array2.length) {
           result.push(array2[number]);  // Insert ads data after every 4th item
           number = (number + 1) % array2.length;
         }
       }
       return result;
     };
     useEffect(()=>{
      const fetchads=async ()=>{
        try{
        const response=await axios.get(`${backendurl}/otherads`);
        
        setadsdata(response.data.otherads)
        }catch(error){
          
        }
      }
      fetchads();
    },[navigate])
     // Modify your main component to track the current image index locally for each post
const [imageIndexes, setImageIndexes] = useState({});

const handleNextImage = (e, postId, imagesLength) => {
  e.stopPropagation(); // Prevent any unwanted bubbling
  setImageIndexes((prevIndexes) => ({
    ...prevIndexes,
    [postId]: (prevIndexes[postId] + 1 || 1) % imagesLength,
  }));
};

const handlePrevImage = (e, postId, imagesLength) => {
  e.stopPropagation(); // Prevent any unwanted bubbling
  setImageIndexes((prevIndexes) => ({
    ...prevIndexes,
    [postId]: (prevIndexes[postId] - 1 + imagesLength) % imagesLength,
  }));
};

     useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `${backendurl}/upload/file/people/${id}`
          );
        
          const userInfo = response.data;
  
          setUser(userInfo);
        
        } catch (error) {
    navigate("/")
        }
      };
  
      fetchUserData();
    }, [id,navigate]);
useEffect(() => {
  const fetchUserData = async () => {
    setLoading(true);

    const limit = page === 1 ? 9 : 3; // First page: 12, next pages: 3

    try {
      const response = await axios.post(`${backendurl}/upload/file/people/profile/news/${id}`, {
        limit,
        excludeIds: postdata.map((post) => post._id), // Exclude already fetched posts
      });

      const newPosts = response.data.datas;

      if (page === 1) {
        setpostdata(newPosts); // Replace old data with fresh posts
      } else {
        setpostdata((prevData) => {
          // Ensure the order is maintained by reversing the new posts before prepending
          return [...newPosts,...prevData];
        }); // Append for pagination
      }
    } catch (error) {
      console.error("Error fetching user news:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [id, page, navigate]);
 // Fetch when user ID or page changes
    
    
  useEffect(()=>{
    if(postdata.length>0&&adsdata.length>0){
      const report=postdata.map((current,index)=>{
        const copyimages=[...current.images];
        const updatesimages=mixArray(copyimages,adsdata);
        return({...current,images:updatesimages})
      })
     
      setupdateddata(report.reverse())
    }
    },[postdata,adsdata])
 const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
  if (bottom && !loading) {
    setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
  }
};
const handleLike = async (e, postId) => {

  e.stopPropagation();
  
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token is found, redirect to login page
    navigate('/login');
    return;
  }

  try {
    // Make the API request to like or unlike the post using Axios
    const response = await axios.post(
      `${backendurl}/like-news/${postId}`,  // Endpoint for liking/unliking the post
      {},  // No body required in the request for like/unlike action
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Attach the token in the Authorization header
        },
      }
    );
    
    const updatedPost = response.data.updatenewspost;
 
      // 🔥 If actualupdate is not empty, update that list
      setupdateddata(prevData =>
        prevData.map(post => (post._id === updatedPost._id ? updatedPost : post))
      )

    // Optionally, you can update the UI here based on the result (e.g., toggle like state, update like count)
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // The server responded with an error status code
      if (error.response.status === 403) {
        // If the token is invalid or expired, redirect to login
        alert("Token is invalid or expired. Please log in again.");
        navigate("/login");
      } else {
      }
    } else if (error.request) {
      // The request was made but no response was received
      alert("No response from the server. Please try again.");
    } else {
      // Something else caused the error
      console.error("Error:", error.message);
      alert("An error occurred. Please try again.");
    }
  }
};
useEffect(() => {
  const fetchFollowStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      
      return;
    }

    try {
      const response = await axios.get(`${backendurl}/follow/status/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.message === "You follow him") {
        setFollow(true);
      } else {
        setFollow(false);
      }
    } catch (error) {
      console.error("Error fetching follow status:", error);
    }
  };

  fetchFollowStatus();
}, [id, navigate]);
const handleFollow = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  try {
    const response = await axios.post(
      `${backendurl}/follow/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
     setUser(response.data.user)
    if (response.data.message === "Followed successfully") {
      setFollow(true);
    } else if (response.data.message === "Unfollowed successfully") {
      setFollow(false);
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
  }
};
const formatLikes = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
  return num.toString(); // Less than 1K, show the number as is
};
useEffect(() => {
  if (!id) return;

  const fetchTotalLikes = async () => {
    try {
      const response = await axios.get(`${backendurl}/user/${id}/total-likes`);
      settotallikes(response.data.totalLikes);
    } catch (err) {
      console.error("Error fetching total likes:", err.response || err);
    }
  };

  fetchTotalLikes();
}, [id]);
const handleprofilelink= (e) => {
  const url = `https://www.thequilk.com/profile/news/${id}`; // Construct the URL
  navigator.clipboard.writeText(url)
    .then(() => {
      alert(' profile link copied.Share it.');
    })
    .catch((error) => {
      console.error('Failed to copy the URL: ', error);
    });
}
  const userdisscussion=(e)=>{

     navigate(`/discuss/info/${id}`)
    
  }
  const userfollowing=(e)=>{

    navigate(`/follower/${id}`)

 }
  const userprofile=(e)=>{

    navigate(`/profile/info/${id}`)
   
 }
  const usernews=(e)=>{
  
     navigate(`/profile/news/${id}`)
    
  }
  const trend=()=>{
    navigate("/trending")
  }
  const handlequiz=(e)=>{
    navigate(`/profile/quiz/${id}`)
  }
 const followpage=(e)=>{
   
     navigate(`/follower/${id}`)
   
  }
  const likepage=(e)=>{
     navigate(`/likenotes/${id}`)
  
  }
  const handleprofile = (e, id) => {
    e.stopPropagation();
    navigate(`/profile/info/${id}`)
  }
  const handlesignout = (e) => {
    localStorage.removeItem('token')
    navigate("/login")
  }
  const termandcondition = (e) => {
    navigate("/terms-and-conditions")
  }

  const discussion = (e) => {
    navigate("/people")
  }
  const profilepage = (e) => {
    navigate("/profile")
  }
  const newspage = (e) => {
    navigate("/news")
  }
  const wishlistpage = (e) => {
    navigate("/wishlist")
  }
  const revenue = (e) => {
    navigate("/revenue")
  }
 
  const handlehome = (e) => {
    navigate("/")
  }
  
  const handleyourprofile = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate("/profile")
    } else {
      alert("login to see your profile.")
    }
  }
  const handlewishlist = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate("/wishlist")
    } else {
      alert("login to see your wishlist note.")
    }
  }
  const handlelikenote = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/likenotes/${userid}`)
    } else {
      alert("login to see your like notes")
    }
  }
  const handlefollowing = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/follower/${userid}`)
    } else {
      alert("login to see your following user.")
    }
  }
  const handleyourquiz = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/profile/quiz/${userid}`)
    } else {
      alert("login to see your quiz.")
    }
  }
  const handleyournote = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/profile/info/${userid}`)
    } else {
      alert("login to see your note.")
    }
  }
  const handleyourdisscussion = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/discuss/info/${userid}`)
    } else {
      alert("login to see your disscussion.")
    }
  }
  const handleyournews = (e) => {
    const token = localStorage.getItem("token");
    if (token && userid) {
      navigate(`/profile/news/${userid}`)
    } else {
      alert("login to see your news.")
    }
  }

  const handlediscussion = (e) => {
    navigate("/people")
  }
  const handlenews = (e) => {
    navigate("/news")
  }
  const handletrend = (e) => {
    navigate("/trending")
  }
  const handlerevenue = (e) => {
    navigate("/revenue")
  }

  const handletermandcondition = (e) => {
    navigate("/terms-and-conditions")
  }
  const handlemath = () => {
    navigate(`/search?query=math`);
  };
  const handlebiology = () => {
    navigate(`/search?query=biology`);
  };
  const handlephysics = () => {
    navigate(`/search?query=physics`);
  }
  const handlejee = () => {
    navigate(`/search?query=jee`);
  }
  const handleneet = () => {
    navigate(`/search?query=neet`);
  }
  const handlechemistry = () => {
    navigate(`/search?query=chemistry`);
  }
  const handlezoology = () => {
    navigate(`/search?query=zoology`);
  }
  const handlebotany = () => {
    navigate(`/search?query=botany`);
  }
  const handleaccount = () => {
    navigate(`/search?query=account`);
  }
  const handlescience = () => {
    navigate(`/search?query=science`);
  }
  const handlemanagement = () => {
    navigate(`/search?query=management`);
  }
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
  return(
    <div className="alwaysmain" >
       <Helmet>
        {/* Dynamic Title */}
        <title>{user ? `${user.name} - Latest News` : 'News - TheQuilk'}</title>
        
        {/* Meta Description */}
        <meta
          name="description"
          content={user ? `${user.name} shares the latest updates and news.` : 'Stay updated with the latest news on TheQuilk platform.'}
        />
        
        {/* Open Graph tags for better social media sharing */}
        <meta property="og:title" content={user ? `${user.name} - Latest News` : 'News - TheQuilk'} />
        <meta
          property="og:description"
          content={user ? `${user.name} shares the latest updates and news.` : 'Stay updated with the latest news on TheQuilk platform.'}
        />
        <meta property="og:image" content={user ? user.profile : "hello"} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta
    name="keywords"
    content={
      user? `${user.name} news, ${user.name}shortnews, ${user.name}newsreview, ${user.name}updatednew,${user.name}newsinimage,${user.name}latest news,${user.name}quicknews,${user.name}longnews,${user.name}quilknews`
        : "notes, review, TheQuilk, note sharing, completenotes, discussion platform, education, notesharing, alternativeofreddit, handwritten notes"
    }
  />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={user ? `${user.name} - Latest News` : 'News - TheQuilk'} />
        <meta
          name="twitter:description"
          content={user ? `${user.name} shares the latest updates and news.` : 'Stay updated with the latest news on TheQuilk platform.'}
        />
        <meta name="twitter:image" content={user ? user.profile : "hello"} />
      </Helmet>

    <Navbar/>
    <div className="modern">
            <div className="sidebar">
              <div className="sidediv" onClick={handlehome}>
                <FontAwesomeIcon icon={faHome} className="homeicon" /> <span className="para">Home</span>
              </div>
              <div className="sidediv" onClick={handleyourprofile}>
                <FontAwesomeIcon icon={faUser} className="homeicon" /> <span className="para">Profile</span>
              </div>
              <div className="sidediv" onClick={handlewishlist}>
                <FontAwesomeIcon icon={faHeart} className="likeicon" /> <span className="para">wishlist notes</span>
              </div>
              <div className="sidediv" onClick={handlelikenote}>
                <FontAwesomeIcon icon={faThumbsUp} className="likeicon" /> <span className="para">like notes</span>
              </div>
              <div className="sidediv" onClick={handlefollowing}>
                <FontAwesomeIcon icon={faUserPlus} className="followicon" /> <span className="para">your following</span>
              </div>
              <div className="sidediv" onClick={handleyourquiz}>
                <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon" />
                <span className="para">Your Quiz</span>
              </div>
              <div className="sidediv" onClick={handleyournote}>
                <FontAwesomeIcon icon={faBookOpenReader} className="likeicon" /> <span className="para">Your Notes</span>
              </div>
    
              <div className="sidediv" onClick={handleyourdisscussion}>
                <FontAwesomeIcon icon={faUsers} className="followicon" /> <span className="para">Your Discussion</span>
              </div>
              <div className="sidediv" onClick={handleyournews}>
                <FontAwesomeIcon icon={faNewspaper} className="trendingpersonicon" /> <span className="para">Your News</span>
              </div>
              <div className="sidediv" onClick={handlequiz}>
                <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon" />
                <span className="para">Upload Quiz</span>
              </div>
              <div className="sidediv" onClick={handlediscussion}>
                <FontAwesomeIcon icon={faPlus} className="likeicon" /> <span className="para">Upload Discussion</span>
              </div>
              <div className="sidediv" onClick={handleyourprofile}>
                <FontAwesomeIcon icon={faUpload} className="likeicon" /> <span className="para">Upload Notes</span>
              </div>
              <div className="sidediv" onClick={handlenews}>
                <FontAwesomeIcon icon={faPlus} className="likeicon" /> <span className="para">Upload News</span>
              </div>
              <div className="sidediv" onClick={handletrend}>
                <FontAwesomeIcon icon={faArrowTrendUp} className="trendingnoteicon" /> <span className="para">Trending Notes</span>
              </div>
              <div className="sidediv" onClick={handlenews}>
                <FontAwesomeIcon icon={faNewspaper} className="likeicon" /> <span className="para">Short News</span>
              </div>
              <div className="sidediv" onClick={handlediscussion}>
                <FontAwesomeIcon icon={faUser} className="likeicon" /> <span className="para">Discussion</span>
              </div>
              <div className="sidediv" onClick={handletrend}>
                <FontAwesomeIcon icon={faArrowTrendUp} className="trendingnoteicon" /> <span className="para">Trending People</span>
              </div>
              <div className="sidediv" onClick={handlerevenue}>
                <FontAwesomeIcon icon={faDollar} className="likeicon" /> <span className="para">Revenue Sharing</span>
              </div>
              <div className="sidediv" onClick={handlesignout}>
                <FontAwesomeIcon icon={faRightFromBracket} className="likeicon" /> <span className="para">Sign Out</span>
              </div>
              <div className="sidedivterm" onClick={handletermandcondition}>
                <span className="para">Terms and Condition</span>
              </div>
            </div>
    <div className="newscontainer" onScroll={handleScroll}>
      <div className="userprofilediv">
             {user&&<img src={user.profile} alt="" className="imageprofiles" onLoad={handleImageLoad}  style={{ display: "none" }} />}
            {user&&<p className="usernameclasss">{user.name}</p>}
            {user&& <p className="userinfotext">{user.description}</p>}
            <div className="buttons">
             <div className="upperbuttons">
             <button className="buttonsclass"></button>
             {user&&<button className="buttonsclass">{formatLikes(user.followercounts)}</button>} 
             {totallikes !== null && totallikes !== undefined && (
       <button className="buttonsclass">{formatLikes(totallikes)}</button>
     )}
     
             </div>
             <div className="lowerbuttons">
             <button onClick={handleFollow} className="followerbuttonsclass">
       {follow === null ? "Loading..." : follow ? "Unfollow" : "Follow"}
            </button> 
             <button className="buttonsclass">followers</button>
             <button className="buttonsclass">likes</button>
             <FontAwesomeIcon icon={faShare} className="shareclass" onClick={handleprofilelink}/>
             </div>
             </div>
             </div>
    <div className="mobileops" style={{marginBottom:"0px",marginTop:"5px"}}>
                  <div className="buttonholders"  onClick={userprofile}>
                    <FontAwesomeIcon icon={faUser} />
                    <button className="buttonsz">User Profile</button>
                  </div>
                  <div className="buttonholders" onClick={handlequiz}>
                    <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon" />
                    <button className="buttonsz">User quiz</button>
                  </div>
                  <div className="buttonholders" onClick={userdisscussion}>
                    <FontAwesomeIcon icon={faUsers} />
                    <button className="buttonsz">Discussions</button>
                  </div>
                  <div className="buttonholders" onClick={usernews}>
                    <FontAwesomeIcon icon={faNewspaper} />
                    <button className="buttonsz">Announcement</button>
                  </div>
                  <div className="buttonholders" onClick={likepage}>
                    <FontAwesomeIcon icon={faThumbsUp} />
                    <button className="buttonsz">Likes Notes</button>
                  </div>
                  <div className="buttonholders" onClick={userfollowing}>
                    <FontAwesomeIcon icon={faUserPlus} />
                    <button className="buttonsz">User following</button>
                  </div>
                  <div className="buttonholders" onClick={handletrend}>
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                    <button className="buttonsz">Trending Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handlechemistry}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Chemistry</button>
                  </div>
                  <div className="buttonholders" onClick={handlezoology}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Zoology Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handletrend}>
                    <FontAwesomeIcon icon={faArrowTrendUp} />
                    <button className="buttonsz">Trending Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handlebotany}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Botany Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handleaccount}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Account Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handlescience}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Science Notes</button>
                  </div>
                  <div className="buttonholders" onClick={handlemanagement}>
                    <FontAwesomeIcon icon={faBookOpenReader} />
                    <button className="buttonsz">Management Notes</button>
                  </div>
                </div>
            {updateddata.length>0?(<div className="actualnews">
             {updateddata.map((current,index)=>{
              const currentIndex = imageIndexes[current._id] || 0;
             return(
              <div className="container" key={index}>
                <div className="imageandcreated">
                  <div className="imageprofilediv">
                      <img src={current.createdBy.profile} alt="" className="imageprofile" onLoad={handleImageLoad}  style={{ display: "none" }}/>
                  </div>
                  <div className="createtitle">
              <p className="titlething">{current.title}---{current.createdBy.name}</p>
                  </div>
                </div>
               <div className="postingimage">
                <div className="likesdiv">
                <FontAwesomeIcon icon={faThumbsUp} onClick={(e)=>{handleLike(e,current._id)}} className="likesup"/>
                <p className="likescount">{formatLikes(current.likesCount)}</p>
                </div>
                <FontAwesomeIcon icon={faChevronLeft} className="arrowleft"  onClick={(e) => handlePrevImage(e, current._id, current.images.length)}/>
                {typeof current.images[currentIndex] === "object" ? (
              current.images[currentIndex].imgsrc ? (
                current.images[currentIndex].imgsrc.endsWith(".png") ||
                current.images[currentIndex].imgsrc.endsWith(".jpg") ||
                current.images[currentIndex].imgsrc.endsWith(".jpeg") ||
                current.images[currentIndex].imgsrc.endsWith(".gif") ||
                current.images[currentIndex].imgsrc.endsWith(".bmp") ||
                current.images[currentIndex].imgsrc.endsWith(".webp") ? (
                  // Image rendering
                  <a href={`${current.images[currentIndex].links}`} target="_blanks" className="imagesshown">
                    <img
                    src={current.images[currentIndex].imgsrc}
                    alt="Image with Link"
                    className="imagesshown"
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                  />
                  </a>
                  
                ) : current.images[currentIndex].imgsrc.endsWith(".mp4") ||
                current.images[currentIndex].imgsrc.endsWith(".webm") ||
                current.images[currentIndex].imgsrc.endsWith(".ogg") ||
                current.images[currentIndex].imgsrc.endsWith(".avi") ||
                current.images[currentIndex].imgsrc.endsWith(".mov") ||
                current.images[currentIndex].imgsrc.endsWith(".flv") ? (
                  // Video rendering
                  <a href={`${current.images[currentIndex].links}`} target="_blanks">
                    <video
                    controls
                    muted
                    autoPlay
                    className="imagesshown"
                    src={current.images[currentIndex].imgsrc}
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                  ></video>
                  </a>
                  
                ) : null
              ) : null
            ) : (
              <>
                { current.images[currentIndex].endsWith(".png") ||
                current.images[currentIndex].endsWith(".jpg") ||
                current.images[currentIndex].endsWith(".jpeg") ||
                current.images[currentIndex].endsWith(".gif") ||
                current.images[currentIndex].endsWith(".bmp") ||
                current.images[currentIndex].endsWith(".webp")  ? (
                  // Image rendering
                  <img
                    src={current.images[currentIndex]}
                    alt="Image"
                    className="imagesshown"
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                  />
                ) : current.images[currentIndex].endsWith(".mp4") ||
                current.images[currentIndex].endsWith(".webm") ||
                current.images[currentIndex].endsWith(".ogg") ||
                current.images[currentIndex].endsWith(".avi") ||
                current.images[currentIndex].endsWith(".mov") ||
                current.images[currentIndex].endsWith(".flv") ? (
                  // Video rendering
                  <video
                    controls
                    className="imagesshown"
                    src={current.images[currentIndex]}
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                  ></video>
                ) : current.images[currentIndex].endsWith(".pdf") ? (
                  // PDF rendering as link
                  <iframe src={`https://docs.google.com/viewer?url=${current.images[currentIndex]}&embedded=true`}  frameborder="0" className="imagesshown" onLoad={handleImageLoad}  style={{ display: "none" }}></iframe>
                ) : null}
              </>
            )}
               <FontAwesomeIcon icon={faChevronRight} className="arrowright"onClick={(e) => handleNextImage(e, current._id, current.images.length)}/>
               </div>
              </div>
             )
             })}
            </div>):(<div className="nothingshow" style={{marginLeft:"50%"}}>User doesn't create News</div>)}
          </div>
          </div>
    </div>
  )
}
