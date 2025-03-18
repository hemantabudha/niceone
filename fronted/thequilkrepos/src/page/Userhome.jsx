import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Userhome.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faBookOpenReader, faHeart, faPlus, faUpload, faDollar, faRightFromBracket, faHome, faNewspaper, faThumbsUp, faUser, faUserPlus, faCrown, faArrowTrendUp, faUsers, faComment, faVoicemail, faQuestion, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import Helmet for dynamic SEO
export default function Userhome() {
  const navigate = useNavigate();
  const { id } = useParams();
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [userid, setUserid] = useState(null)
  const [totallikes, settotallikes] = useState(null)
  const [follow, setFollow] = useState(null);
  const [favoritepost, setfavoritepost] = useState(null)
  const [loadingpage, setLoadingpage] = useState(false); 
  const [page, setPage] = useState(1); 
  const[playlistholder,setplaylistholder]=useState([])
  const[latestpost,setlatestpost]=useState([])
  const[popularpost,setpopularpost]=useState([])
  const[oldestpost,setoldestpost]=useState([])
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
    const url = `https://www.thequilk.com/userhome/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' profile link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
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
      alert("you must login to follow")
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
  useEffect(() => {
    if (!id) return;

    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get(`${backendurl}/favorite/${id}/posts`);
        console.log(response.data.posts[0])
        setfavoritepost(response.data.posts[0])
      } catch (err) {
        console.error("Error fetching total likes:", err.response || err);
      }
    };

    fetchTotalLikes();
  }, [id]);
  const likepage = (e) => {
    navigate(`/likenotes/${id}`)

  }
  const handleusergetpost=async()=>{
    try{
      const response = await axios.get(`${backendurl}/user/posts/${id}`);
      setlatestpost(response.data.latestPosts)
      setpopularpost(response.data.popularPosts)
      setoldestpost(response.data.oldestPosts)
    }catch(error){
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingpage(true);
     
      const initialLimit = window.innerWidth < 600 ? 9 : 18;
      const limit = page === 1 ? initialLimit : 5;
     
     if(loadingpage){
      return;
     }
      try {
        const response = await axios.post(`${backendurl}/playlists/playlistcreator/userhome/${id}`, {
          limit,
          excludeIds: playlistholder.map((post) => post._id), // Exclude already fetched posts
        });
         console.log(response.data.datas)
        const newPosts = response.data.datas;
       
        if (page === 1) {
          if(response.data && newPosts.length <=3){
            handleusergetpost()
          }
          setplaylistholder(newPosts); // Replace old data with fresh posts
        } else {
          setplaylistholder((prevData) => {
            // Ensure the order is maintained by reversing the new posts before prepending
            return [...prevData, ...newPosts];
          }); // Append for pagination
        }
      } catch (error) {
        console.error("Error fetching user news:", error);
      } finally {
        setLoadingpage(false);
      }
    };

    fetchUserData();
  }, [page, backendurl]);
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
    if (bottom && !loadingpage) {
      setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
    }
  };
  const handlehome = (e) => {
    navigate("/")
  }
  const userdisscussion = (e) => {

    navigate(`/discuss/info/${id}`)

  }
  const userfollowing = (e) => {

    navigate(`/follower/${id}`)

  }
  const userprofile = (e) => {
    navigate(`/profile/info/${id}`)
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
  const handlesignout = (e) => {
    localStorage.removeItem('token')
    navigate("/login")
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
  const userhome = () => {
    navigate(`/userhome/${id}`)
  }

  return (
    <div className="alwaysmain">
      <Navbar />
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
        <div className="userhome" onScroll={handleScroll}>
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
            <div className="mobileops">
              <div className="buttonholders" onClick={userhome}>
                <FontAwesomeIcon icon={faHome} />
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
          </div>
          {favoritepost && (
            <div className="favoriteshowndiv">
              <div className="recommendiationdiv">
                <p className="recommendiationpara">Recommendation</p>
              </div>
              <div className="favoriteimageandall">
                <div className="imagefavoritediv">
              <img src={favoritepost.thumbnail} alt="" className="favoriteimage" />
              </div>
              <div className="favoritedescriptiondiv">
              <p className="favoritetitle">Title : {favoritepost.title}</p>
              <p className="favoritedescription">{favoritepost.description}</p>
             <div className="likecommentandquizdiv">
              <button className="buttonfavorite"><FontAwesomeIcon icon={faThumbsUp}className="likesinfofollow"/> <span>{formatLikes(favoritepost.likesCount)}</span></button>
              <button className="buttonfavorite" ><FontAwesomeIcon icon={faComment} className="likesinfofollow"/> <span>{formatLikes(favoritepost.commentsCount)}</span></button>
              <button className="buttonfavorite" ><FontAwesomeIcon icon={faQuestion} className="likesinfofollow"/> <span>{formatLikes(favoritepost.commentsCount)}</span></button>
             </div>
              
              </div>
              </div>
            </div>)}
          {latestpost && latestpost.length>0 && (
            <div className="playlistholdingdiv">
              <div className="playlisttitlehomediv">
           <p className="playlisttitlehome">Latest Posts from {user?user.name:""} That Are Gaining Popularity</p>
           </div>
           <div className="notesofplaylistholder">
           {latestpost&& latestpost.length>0&& latestpost.map((current,index)=>{
            return(
              <div key={index} className="holderofplaylistnote">
                <img src={current.thumbnail} className="imageofplaylistnote" alt="" />
                <p className="textofplaylistnote">{current.title}</p>
              </div>
            )
           })}
           </div>
           <div className="playlistdescriptionholder" style={{ justifyContent:latestpost.length > 4 ? "center" : "start" }}>
           <p className="playlistdescriptiontext">Description:Dive into the latest playlists created by {user?user.name:""}! These newly curated playlists feature fresh, trending content that’s bound to keep you engaged. Perfect for discovering new favorites!"</p>
           </div>
            </div>
          )}
           {playlistholder && playlistholder.length>0 &&(
              <div className="recommendiationdiv" style={{marginTop:"5px",display:"flex",alignItems:"center"}}>
                <p className="recommendiationpara">Userplaylists</p>
                <FontAwesomeIcon icon={faPlay} style={{marginLeft:"6px"}}/>
              </div>
            )}
          {playlistholder && playlistholder.length>0 && playlistholder.map((playlist,id)=>{
            return(
              <div key={id}>
              {playlist.notes && playlist.notes.length>0 &&(
                <div key={id} className="playlistholdingdiv">
           <div className="playlisttitlehomediv">
           <p className="playlisttitlehome">{playlist.title}</p>
           </div>
          
           <div className="notesofplaylistholder">
           {playlist.notes && playlist.notes.length>0&& playlist.notes.map((current,index)=>{
            return(
              <div key={index} className="holderofplaylistnote">
                <img src={current.thumbnail} className="imageofplaylistnote" alt="" />
                <p className="textofplaylistnote">{current.title}</p>
              </div>
            )
           })}
           </div>
           <div className="playlistdescriptionholder" style={{ justifyContent: playlist.notes.length > 4 ? "center" : "start" }}>
           <p className="playlistdescriptiontext">Description:{playlist.description}</p>
           </div>
              </div>
            )}
              </div>
            )
          })}
            {latestpost && latestpost.length>1 && popularpost && popularpost.length>0 && (
            <div className="playlistholdingdiv">
              <div className="playlisttitlehomediv">
           <p className="playlisttitlehome">Fan Favorites The Most Popular Playlists from {user?user.name:""}</p>
           </div>
           <div className="notesofplaylistholder">
           {popularpost&& popularpost.length>0&& popularpost.map((current,index)=>{
            return(
              <div key={index} className="holderofplaylistnote">
                <img src={current.thumbnail} className="imageofplaylistnote" alt="" />
                <p className="textofplaylistnote">{current.title}</p>
              </div>
            )
           })}
           </div>
           <div className="playlistdescriptionholder" style={{ justifyContent:popularpost.length > 4 ? "center" : "start" }}>
           <p className="playlistdescriptiontext">Description:Dive into {user?user.name:""}'s most popular playlists! These collections are packed with the highest-rated and most-played tracks, showcasing the best content that everyone is enjoying right now!</p>
           </div>
            </div>
          )}
            {latestpost && latestpost.length>1 && oldestpost && oldestpost.length>0 && (
            <div className="playlistholdingdiv">
              <div className="playlisttitlehomediv">
           <p className="playlisttitlehome">Oldies But Goodies: Classic Playlists Collection from {user?user.name:""}</p>
           </div>
           <div className="notesofplaylistholder">
           {oldestpost&& oldestpost.length>0&& oldestpost.map((current,index)=>{
            return(
              <div key={index} className="holderofplaylistnote">
                <img src={current.thumbnail} className="imageofplaylistnote" alt="" />
                <p className="textofplaylistnote">{current.title}</p>
              </div>
            )
           })}
           </div>
           <div className="playlistdescriptionholder" style={{ justifyContent:oldestpost.length > 4 ? "center" : "start" }}>
           <p className="playlistdescriptiontext">Description : Discover the timeless playlists that have been part of {user?user.name:""}’s collection for the longest time. These classic playlists offer a glimpse into the journey and musical evolution, bringing you nostalgic gems from the past</p>
           </div>
            </div>
          )}
          
          <div>

          </div>
        </div>
      </div>

    </div>

  )
}