import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Quiz.css";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faBook, faBookOpen, faShare, faCrown, faBookOpenReader, faDollar, faHandPointRight, faHeart, faHome, faNewspaper, faPlus, faRightFromBracket, faThumbsUp, faThumbTack, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
import { faGolang } from "@fortawesome/free-brands-svg-icons";
export default function Pquiz() {
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [totallikes, settotallikes] = useState(null)
  const [follow, setFollow] = useState(null);
  const [actualquizdata, setActualquizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const[userid,setUserid]=useState(null)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${backendurl}/upload/file/people/${id}`
        );

        const userInfo = response.data;

        setUser(userInfo);

      } catch (error) {
        console.log(error)
      }
    };

    fetchUserData();
  }, [id]);

  const handleprofilelink = (e) => {
    const url = `https://www.thequilk.com/profile/quiz/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' profile link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }
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
      alert("you must login to follow.")
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
  const handleImageLoad = (e) => {
    e.target.style.display = "block"; // Make the image visible as soon as it's loaded
  };
  const handlepostinfo=(e,id)=>{
    e.stopPropagation();
    navigate(`/detail/review/${id}`)
  
  }
  const handleprofile=(e,id)=>{
    e.stopPropagation();
    navigate(`/profile/info/${id}`)
  }
  const handlesignout=(e)=>{
    localStorage.removeItem('token')
    navigate("/login")
  }
  const termandcondition=(e)=>{
    navigate("/terms-and-conditions")
  }
  
  const discussion=(e)=>{
    navigate("/people")
  }
  const profilepage=(e)=>{
    navigate("/profile")
  }
  const newspage=(e)=>{
    navigate("/news")
  }
  const wishlistpage=(e)=>{
    navigate("/wishlist")
  }
  const revenue =(e)=>{
    navigate("/revenue")
  }
  const likepage=(e)=>{
  
     navigate(`/likenotes/${id}`)
   
  }
  const profile=(e)=>{
    navigate("/profile")
  }
 
  const handlehome=(e)=>{
    navigate("/")
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
 const userhome=(e)=>{

  navigate(`/userhome/${id}`)

}
  const usernews=(e)=>{
 
     navigate(`/profile/news/${id}`)

  }
  const trend=()=>{
    navigate("/trending")
  }
  const loadMoreQuizzes = async () => {
    setLoading(true);
    try {
      // Get only the IDs from the existing quizzes to exclude
      const excludedIds = actualquizdata.map(quiz => quiz._id);
  
      const res = await axios.post(`${backendurl}/get-quizzesdisplay/createdby`, {
        excludeUrls: excludedIds,
        createdById:id
          // Send the IDs to exclude
      });
     
  
      // Append the new quizzes to the existing quiz data correctly
      setActualquizData((prev) => [...prev, ...res.data.quizzes]);
  
    } catch (error) {
      console.error('Error loading more quizzes', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 10px tolerance before the right end
    if (bottom && !loading) {
      loadMoreQuizzes(); // Trigger the function that loads more quizzes
    }
  };
  
  useEffect(() => {
    // Trigger the first load when page changes
    loadMoreQuizzes();
  }, [navigate]);
  const quizinfo=(e,id)=>{
    navigate(`/quizinfo/${id}`)
  }
  const handlequiz=(e)=>{
    navigate(`/profile/quiz/${id}`)
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
  const handletrend = (e) => {
    navigate("/trending")
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

  const handlediscussion=(e)=>{
    navigate("/people")
    }
  const handlenews=(e)=>{
    navigate("/news")
  }
 
  const handlerevenue=(e)=>{
    navigate("/revenue")
  }
  
  const handletermandcondition=(e)=>{
    navigate("/terms-and-conditions")
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
  const generateSEO = (quiz) => {
    return (
      <Helmet>
        <title>{quiz.title} - Quiz on {quiz.description.substring(0, 30)} | TheQuilk</title>
        <meta
          name="description"
          content={`${quiz.title} by ${quiz.createdBy.name}. ${quiz.description}`}
        />
        <meta
          name="keywords"
          content={`${quiz.title}, quiz, educational quiz, learn ${quiz.title.toLowerCase()}`}
        />
        <meta property="og:title" content={`${quiz.title} - TheQuilk`} />
        <meta
          property="og:description"
          content={`${quiz.title} by ${quiz.createdBy.name}. Learn about ${quiz.description.substring(0, 50)}`}
        />
        <meta
          property="og:image"
          content={quiz.createdBy.profile} // Profile image of the quiz creator
        />
        <meta property="og:url" content={`https://thequilk.com/quizzes/${quiz._id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${quiz.title} - TheQuilk`} />
        <meta
          name="twitter:description"
          content={`${quiz.title} by ${quiz.createdBy.name}. ${quiz.description.substring(0, 50)}`}
        />
        <meta
          name="twitter:image"
          content={quiz.createdBy.profile} // Profile image of the quiz creator
        />
      </Helmet>
    );
  };

  return (
    <div className="alwaysmain">
     
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
        <div className="quizsectiontodisplayallthequiz" onScroll={handleScroll}>
          <div className="userprofilediv">
            {user && <img src={user.profile} alt="" className="imageprofiles" onLoad={handleImageLoad} style={{ display: "none" }} />}
            {user && <p className="usernameclasss">{user.name}</p>}
            {user && <p className="userinfotext">{user.description}</p>}
            <div className="buttons">
              <div className="upperbuttons">
                {user && <button className="buttonsclass">{user.followercounts > 2 ? <FontAwesomeIcon icon={faCrown} className="crown" /> : ""}</button>}
                {user && <button className="buttonsclass">{formatLikes(user.followercounts)}</button>}
                {totallikes !== null && totallikes !== undefined && (
                  <button className="buttonsclass">{formatLikes(totallikes)}</button>
                )}

              </div>
              <div className="lowerbuttons">
                <button onClick={handleFollow} className="followerbuttonsclass">
                  {follow === null ? "follow" : follow ? "Unfollow" : "Follow"}
                </button>
                <button className="buttonsclass">followers</button>
                <button className="buttonsclass">likes</button>
                <FontAwesomeIcon icon={faShare} className="shareclass" onClick={handleprofilelink} />
              </div>
            </div>
          </div>
          <div className="searchdataquizandnonsearchdisplay"> 
                  <div className="mobileops" style={{marginBottom:"1px"}}>
                     <div className="buttonholders" onClick={userhome}>
                                              <FontAwesomeIcon icon={faHome}/>
                                              <button className="buttonsz">User home</button>
                                            </div>
                                <div className="buttonholders" onClick={userprofile}>
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
                            
       {actualquizdata && actualquizdata.length>0?(actualquizdata.map((current,index)=>{
             return(
              <div key={index} className="realsearchdataquizandnonsearchdisplay">
              {generateSEO(current)}
              <div className="imageandtitleforthequiz">
                <img src={current.createdBy.profile} alt="" onLoad={handleImageLoad}  style={{ display: "none" }} className="imageandtitleforthequizimage" onClick={(e)=>{profilequiz(e,current.createdBy._id)}} />
                <p className="imageandtitleforthequizparagraph">{current.createdBy.name}</p>   
              </div>
              <div className="inputanddescriptionforthequiz">
                <p className="inputquiz">Title : {current.title}</p>
                <p className="descriptionquiz"> Context : {current.description}</p>
              </div>
           
              <div className="otherresultforthequiz">  
                <div className="totalsubmitted">
                  <button className="totalsubmittedbuttonone">{formatLikes(current.totalsubmitted)}</button>
                  <button className="totalsubmittedbuttontwo">totalSubmitted</button>
                </div>
                <div className="totalquizlength">
                  <button className="totalquizlengthone">{current.quizlength}</button>
                  <button className="totalquizlengthtwo">Questions</button>
                </div>
                <div className="classplay">
                                <FontAwesomeIcon icon={faGolang} className="classplaybuttonone" onClick={(e)=>{quizinfo(e,current._id)}} />
                                  <button className="classplaybuttontwo" onClick={(e)=>{quizinfo(e,current._id)}}>playQuiz</button>
                                  </div>
              </div>
            </div>
             )
       })):(<div style={{boxShadow:"none",fontSize:"large",fontWeight:"600",marginTop:'21px',display:"flex",justifyContent:"center"}}>NO quiz Uploaded by Users....</div>)}
            </div>
        </div>
      </div>
    </div>
  )
}
