import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faBookOpenReader, faHeart, faPlus, faUpload, faDollar, faRightFromBracket, faHome, faNewspaper, faThumbsUp, faUser, faUserPlus, faCrown, faArrowTrendUp, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import Helmet for dynamic SEO
import "./Info.css"
const ProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [totallikes, settotallikes] = useState(null)
  const [follow, setFollow] = useState(null);
  const [page, setPage] = useState(1);  // Track the current page
  const [loading, setLoading] = useState(false);  // Track loading state 
  const [userid, setUserid] = useState(null)
  const handlepostinfo = (e, id) => {
    e.stopPropagation();
    navigate(`/detail/review/${id}`)

  }
  // Second useEffect: Fetch user data and posts
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
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const initialLimit = window.innerWidth < 600 ? 9 : 18;
      const limit = page === 1 ? initialLimit : 5;

      try {
        const response = await axios.post(`${backendurl}/upload/file/people/profile/profile/${id}`, {
          limit,
          excludeIds: userPosts.map((post) => post._id), // Exclude already fetched posts
        });

        const newPosts = response.data.datas;

        if (page === 1) {
          setUserPosts(newPosts); // Replace old data with fresh posts
        } else {
          setUserPosts((prevData) => {
            // Ensure the order is maintained by reversing the new posts before prepending
            return [...prevData, ...newPosts];
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


  const handleprofilelink = (e) => {
    const url = `https://www.thequilk.com/profile/info/${id}`; // Construct the URL
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
  const likepage = (e) => {
    navigate(`/likenotes/${id}`)

  }
  const profile = (e) => {
    navigate("/profile")
  }
  const followpage = (e) => {

    navigate(`/follower/${id}`)

  }
  const handlehome = (e) => {
    navigate("/")
  }
  const userdisscussion = (e) => {

    navigate(`/discuss/info/${id}`)

  }
  const userprofile=(e)=>{
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
  return (
    <div className="alwaysmain">
      <Helmet>

        <title> {user ? `${user.name} - Notes` : 'News - TheQuilk'}- TheQuilk</title>

        {/* Meta Description */}
        <meta
          name="description"
          content={`Explore the profile of ${user?.name} on TheQuilk!.${user?.name} has uploaded increadible handwritten notes as well as well as his question to the community along his favourite notes and his following who is he trying to follow as well as written notes on thequilk . see on thequilk`}
        />

        {/* Open Graph Tags for social media sharing */}
        <meta property="og:title" content={`${user?.name}-Notes`} />
        <meta
          property="og:description"
          content={`Explore the profile of ${user?.name} on TheQuilk! See all the notes uploaded by him.${user?.name} has uploaded increadible handwritten notes as well as well written notes on thequilk ,his favourite notes  as well as his following and his question to the community also . see on thequilk`}
        />
        <meta property="og:image" content={user?.profile} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={user?.name} />
        <meta
          name="twitter:description"
          content={`Explore the profile of ${user?.name} on TheQuilk! See all the notes uploaded by him.${user?.name} has uploaded increadible handwritten notes as well as well written notes on thequilk as well as his favourite notes as well as his follwing notes  and his question to the community also  . see on thequilk`}
        />
        <meta name="twitter:image" content={user?.profile} />


        {/* SEO Keywords for profile page */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={`${user?.name} notes, ${user?.name} profile,${user?.name}handwrittennotes ,  ${user?.name}follower, ${user?.name}question,${user?.name} farrey,notesharing,student questions, community engagement`} />
      </Helmet>
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
        <div className="infoforallthediv" onScroll={handleScroll}>
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
          <div className="userdivhola">
            <div className="mobileops">
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
                <button className="buttonsz">User News</button>
              </div>
              <div className="buttonholders" onClick={likepage}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <button className="buttonsz">Likes Notes</button>
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
            {userPosts.length > 0 ? (userPosts && userPosts.map((current, index) => {
              return (
                <div className="boxa" key={index} >
                  <img src={current.thumbnail} alt="Selected" className="thumbnailpictur" onClick={(e) => { handlepostinfo(e, current._id) }} onLoad={handleImageLoad} style={{ display: "none" }} />
                  <p className="paragraphtitl">{current.title}</p>
                </div>
              )
            })) : (<div className="nodiv"><p className="nocontent">Uff! User doesn't create Post</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );

};
export default ProfilePage;
