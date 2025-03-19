import Navbar from "../component/Navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAdd, faPlus, faTrash, faX ,faArrowLeft,faArrowRight, faThumbsUp,faShare, faHome, faUser, faHeart, faUserPlus, faBookOpenReader, faUsers, faNewspaper, faUpload, faArrowTrendUp, faDollar, faRightFromBracket} from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import "./News.css"
import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Helmet } from "react-helmet"; // Import react-helmet
export default function News(){
  const navigate=useNavigate();
 
 const [searchQuery, setSearchQuery] = useState("");

 
 const[chunkdata,setchunkdata]=useState([]);
 const[realchunkdata,setrealchunkdata]=useState([])
 const [page, setPage] = useState(1);  // Track the current page
 const [loading, setLoading] = useState(false);  // Track loading state
 const [postdata, setpostdata] = useState([]);
 const[actualupdate,setactualupdate]=useState([]);

 const backendurl=import.meta.env.VITE_BACKEND_URL;
  const [userid, setUserid] = useState(null)
  const [adsdata, setadsdata] =useState([]);
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
   const mixArray = (array1, array2) => {
    const result = [];
    let number = 0;
    for (let item = 0; item < array1.length; item++) {
      result.push(array1[item]);  // Push the post data item
      if ((item + 1) % 9 === 0 && number < array2.length) {
        result.push(array2[number]);  // Insert ads data after every 4th item
        number = (number + 1) % array2.length;
      }
    }
    return result;
  };

 const handleSearch = (e) => {
  setSearchQuery(e.target.value);
};
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
  const fetchPosts = async () => {
    setLoading(true);

    // Set the limit based on the current page
    const limit = page === 1 ? 9 : 3;  // Fetch 9 on the first page, 3 on subsequent pages

    try {
      const response = await axios.post(
        `${backendurl}/upload/file/news/bit`, 
        {
          limit,
          excludeIds: chunkdata.map((post) => post._id), // Send IDs of already fetched posts
        }
      );

      const newPosts = response.data.datas;
    
      if (newPosts.length > 0) {
        setchunkdata((prevData) => [...prevData, ...newPosts]); // Append new posts to existing ones
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPosts();
}, [page, navigate]);  // Fetch when page changes

const handleScroll = (e) => {
  const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
  if (bottom && !loading) {
    setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
  }
};
useEffect(()=>{
if(postdata.length>0 &&adsdata.length>0){
  const report=postdata.map((current,index)=>{
    const copyimages=[...current.images];
    const updatesimages=mixArray(copyimages,adsdata);
  
    return({...current,images:updatesimages})
  })
  
  setactualupdate(report)
}
},[postdata,adsdata])
useEffect(()=>{
  if(chunkdata.length>0 &&adsdata.length>0){
    const report=chunkdata.map((current,index)=>{
      const copyimages=[...current.images];
      const updatesimages=mixArray(copyimages,adsdata);
    
      return({...current,images:updatesimages})
    })
    
    setrealchunkdata(report)
  }
  },[chunkdata,adsdata])






const handleLike = async (e, postId) => {
  e.stopPropagation();
  
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  if (!token) {
   alert("you must login to like the news")
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
      setactualupdate(prevData =>
        prevData.map(post => (post._id === updatedPost._id ? updatedPost : post))
      );

      // 🔥 Otherwise, update realchunkdata
      setrealchunkdata(prevData =>
        prevData.map(post => (post._id === updatedPost._id ? updatedPost : post))
      );

    // Optionally, you can update the UI here based on the result (e.g., toggle like state, update like count)
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // The server responded with an error status code
      if (error.response.status === 403) {
        // If the token is invalid or expired, redirect to login
        alert("Token is invalid or expired. Please log in again.");
     
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
const formatLikes = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
    return num.toString(); // Less than 1K, show the number as is
  };
  const handleprofilelink= (e,id) => {
    const url = `https://www.thequilk.com/profile/news/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' profile link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }

  useEffect(() => {
    const fetchPosts = async () => {
    
  
      try {
        const response = await axios.post(`${backendurl}/searchnews`, {
          query: searchQuery
        });
        const newpost=response.data.datas;
        if(newpost.length===0){
          setactualupdate([])
        }
     setpostdata(response.data.datas)
      } catch (error) {
        console.error("Error fetching posts:", error);
      } 
    };
  
    fetchPosts();
  }, [searchQuery]);
  const handleImageLoad = (e) => {
    e.target.style.display = "block"; // Make the image visible as soon as it's loaded
  };
  const handlehome = (e) => {
    navigate("/")
  }
  const userdisscussion = (e) => {

    navigate(`/discuss/info/${id}`)

  }
  const usernews = (e) => {

    navigate(`/profile/news/${id}`)

  }
  const trend = () => {
    navigate("/trending")
  }
  const handlequiz = (e) => {
    navigate(`/profile/quiz/${id}`)
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
    setSearchQuery("canada")
  };
  const handlebiology = () => {
    setSearchQuery("usa")
  };
  const handlephysics = () => {
    setSearchQuery("donald")
  }
  const handlejee = () => {
    setSearchQuery("tariff")
  }
  const handleneet = () => {
    setSearchQuery("result")
  }
  const handlechemistry = () => {
    setSearchQuery("latest")
  }
  const handlezoology = () => {
    setSearchQuery("result")
  }
  const handlebotany = () => {
    setSearchQuery("startup")
  }
  const handleaccount = () => {
    setSearchQuery("bussiness")
  }
  const handlescience = () => {
    setSearchQuery("india")
  }
  const handlemanagement = () => {
    setSearchQuery("china")
  }
  const handlenewsinfo=(e,id)=>{
    navigate(`/profile/news/${id}`)
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
  const handlesignout = (e) => {
    localStorage.removeItem('token')
    navigate("/login")
  }
  const homepageforother=(e,id)=>{
  
    navigate(`/userhome/${id}`)
  }
  return(
    <div className="alwaysmain">
      <Helmet>
        <meta 
          name="description" 
          content="Stay updated with the latest news in a concise and easy-to-read format. Explore short summaries of important events, perfect for students looking to catch up quickly." 
        />
        <meta 
          name="keywords" 
          content="news, short news, news summaries,quik news,shortestnews,reviewnews,longnewsintoshortnews,under10secondnews student news, quick updates, news for students,imagenews,quicknews,quilknews" 
        />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="og:title" content="latest news in short " />
        <meta
          property="og:description"
          content={'Stay updated with the latest news on TheQuilk platform. get all the news in short format , read the news in image format and news summaries and quick updates of news and you get news under 10 second ,short format news'}
        />
        <meta property="og:title" content="TheQuilk | shortnews" />
     
        <meta
          property="og:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
        <meta property="og:url" content="https://thequilk.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TheQuilk | shortnews" />
        <meta
          name="twitter:description"
          content="Join TheQuilk to share and view notes, news in short form and more from creators worldwide."
        />
        <meta
          name="twitter:image"
          content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png"
        />
        <title>Latest News - TheQuilk</title>
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
                  <FontAwesomeIcon icon={faUserPlus} className="followicon" /> <span className="para">following</span>
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
                  <FontAwesomeIcon icon={faUsers} className="likeicon" /> <span className="para">Discussion</span>
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
      <div className="mobileops" style={{marginBottom:"0px"}}>

<div className="buttonholders" onClick={handlebiology}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">USA</button>
</div>
<div className="buttonholders" onClick={handlephysics}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Donald Trump</button>
</div>
<div className="buttonholdersss">
<input type="text" name="" id="" value={searchQuery} className="newssearch" placeholder="search update..." onChange={handleSearch}/>
</div>
<div className="buttonholders" onClick={handlejee}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">tariff</button>
</div>
<div className="buttonholders" onClick={handleneet}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Result</button>
</div>
<div className="buttonholdersss">
<input type="text" name="" id=""value={searchQuery} className="newssearch" placeholder="search update..." onChange={handleSearch}/>
</div>
<div className="buttonholders" onClick={handlemath}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Canada</button>
</div>
<div className="buttonholders" onClick={handlechemistry}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Latest news</button>
</div>
<div className="buttonholdersss">
<input type="text" name="" id="" className="newssearch" placeholder="search update..." onChange={handleSearch} value={searchQuery}/>
</div>
<div className="buttonholders" onClick={handlezoology}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Result</button>
</div>
<div className="buttonholders" onClick={handletrend}>
  <FontAwesomeIcon icon={faArrowTrendUp}/>
  <button className="buttonsz">Trending Notes</button>
</div>
<div className="buttonholdersss">
<input type="text" name="" id="" className="newssearch" placeholder="search update..." onChange={handleSearch} value={searchQuery}/>
</div>
<div className="buttonholders" onClick={handlebotany}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Startup</button>
</div>
<div className="buttonholders" onClick={handleaccount}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">Bussiness</button>
</div>
<div className="buttonholdersss">
<input type="text" name="" id="" className="newssearch" placeholder="search update..." onChange={handleSearch} value={searchQuery}/>
</div>
<div className="buttonholders" onClick={handlescience}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">India</button>
</div>
<div className="buttonholders" onClick={handlemanagement}>
  <FontAwesomeIcon icon={faBookOpenReader}/>
  <button className="buttonsz">China</button>
</div>
</div>

       
        {actualupdate.length>0?(<div className="actualnews">
         {actualupdate.map((current,index)=>{
          const currentIndex = imageIndexes[current._id] || 0;
         return(
          <div className="container" key={index}>
            <div className="imageandcreated">
              <div className="imageprofilediv">
                  <img src={current.createdBy.profile} alt="" className="imageprofile" onLoad={handleImageLoad}  style={{ display: "none" }} onClick={(e)=>{homepageforother(e,current.createdBy._id)}}/>
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
                <div className="sharesdiv">
                <FontAwesomeIcon icon={faShare} className="sharenews" onClick={(e)=>{handleprofilelink(e,current.createdBy._id)}}/>
                                </div>
                <FontAwesomeIcon icon={faArrowLeft} className="arrowleft"  onClick={(e) => handlePrevImage(e, current._id, current.images.length)}/>
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
                    src={`${current.images[currentIndex].imgsrc}`}
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
                  <iframe src={`https://docs.google.com/viewer?url=${current.images[currentIndex]}&embedded=true`} frameborder="0" className="imagesshown" onLoad={handleImageLoad}  style={{ display: "none" }}></iframe>
                ) : null}
              </>
            )}
               <FontAwesomeIcon icon={faArrowRight} className="arrowright"onClick={(e) => handleNextImage(e, current._id, current.images.length)}/>
               </div>
          </div>
         )
         })}
        </div>):(<div className="actualnews">
         {realchunkdata.map((current,index)=>{
          const currentIndex = imageIndexes[current._id] || 0;
         return(
          <div className="container" key={index}>
            <div className="imageandcreated">
              <div className="imageprofilediv">
                  <img src={current.createdBy.profile} alt="" className="imageprofile" onLoad={handleImageLoad}  style={{ display: "none" }} onClick={(e)=>{homepageforother(e,current.createdBy._id)}}/>
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
                <div className="sharesdiv">
                                  <FontAwesomeIcon icon={faShare} className="sharenews" onClick={(e)=>{handleprofilelink(e,current.createdBy._id)}}/>
                                </div>
                <FontAwesomeIcon icon={faArrowLeft} className="arrowleft"  onClick={(e) => handlePrevImage(e, current._id, current.images.length)}/>
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
                    src={`${current.images[currentIndex].imgsrc}`}
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
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                    src={`${current.images[currentIndex].imgsrc}`}
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
                    onLoad={handleImageLoad}  style={{ display: "none" }}
                    className="imagesshown"
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
                  <iframe src={`https://docs.google.com/viewer?url=${current.images[currentIndex]}&embedded=true`} frameborder="0" className="imagesshown" onLoad={handleImageLoad}  style={{ display: "none" }}></iframe>
                ) : null}
              </>
            )}
               <FontAwesomeIcon icon={faArrowRight} className="arrowright"onClick={(e) => handleNextImage(e, current._id, current.images.length)}/>
               </div>
          </div>
         )
         })}
        </div>)}
      </div>
      </div>
    </div>
  )
}