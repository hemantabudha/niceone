import Navbar from "../component/Navbar";
import "./People.css"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faThumbsUp, faComment, faUser, faBookOpenReader, faThumbsDown, faHome, faUserPlus, faArrowTrendUp, faNewspaper, faUpload, faUsers, faHeart, faDownLong, faDollar, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
export default function People() {
  const navigate = useNavigate()
  const backendurl = import.meta.env.VITE_BACKEND_URL


  const [active, setactive] = useState(false)
  const [commentText, setCommentText] = useState({}); // Object to store comment text per post

  const [myquestion, setmyquestion] = useState([]);


  const [page, setPage] = useState(1);  // Track the current page
  const [loading, setLoading] = useState(false);  // Track loading state
  const [commentPage, setCommentPage] = useState({});
  const [isFetching, setIsFetching] = useState({}); // object keyed by postId
  const [mixdata, setmixdata] = useState([]);
  const [adsdata, setadsdata] = useState([]);
  const [userid, setUserid] = useState(null);
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
  useEffect(() => {
    const fetchads = async () => {
      try {
        const response = await axios.get(`${backendurl}/homeads`);

        setadsdata(response.data.homeads)
      } catch (error) {

      }
    }
    fetchads();
  }, [navigate])
  useEffect(() => {
    if (myquestion.length > 0 && adsdata.length > 0) {
      const mixedData = mixArray(myquestion, adsdata);
      setmixdata(mixedData);  // Update mixdata with merged data
    }
  }, [myquestion, adsdata]);
  const handleCommentInputChange = (postId, e) => {
    const newCommentText = e.target.value;

    // Only update if the comment length is <= 150 characters
    if (newCommentText.length <= 150) {
      setCommentText(prev => ({
        ...prev,
        [postId]: newCommentText
      }));
    }
  };






  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${backendurl}/posts/all/bits`, {
          page, // Pass page number
          excludeIds: myquestion.map((post) => post._id), // Send already fetched post IDs
        });

        const newPosts = response.data.datas;
        if (newPosts.length > 0) {
          setmyquestion((prevData) => [...prevData, ...newPosts]); // Append new posts
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, navigate]);  // Only `page` should be in dependency array
  // Depend on page, navigate, postdata, and token

  // Fetch when page changes
  const handleLike = async (e, postId) => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert("you must login to like the post.")
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/posts/likes/${postId}`,  // The backend API endpoint for like/unlike
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPost = response.data.updatedPost;


      // Update the local state with the updated post (likesCount)
      setmyquestion(prevQuestions =>
        prevQuestions.map(post =>
          post._id === updatedPost._id
            ? { ...post, likesCount: updatedPost.likesCount }  // Update the likes count of the specific post
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };
  const handledisLike = async (e, postId) => {

    const token = localStorage.getItem('token');
    if (!token) {
      alert("you must login to dislike the post.")
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/posts/dislikes/${postId}`,  // The backend API endpoint for like/unlike
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedPost = response.data.updatedPost;

      // Update the local state with the updated post (likesCount)
      setmyquestion(prevQuestions =>
        prevQuestions.map(post =>
          post._id === updatedPost._id
            ? { ...post, dislikesCount: updatedPost.dislikesCount }  // Update the likes count of the specific post
            : post
        )
      );
    } catch (error) {
      console.error("Error liking the post", error);
    }
  };
  const handlecomment = (e) => {
    setactive(true)
  }
  const handleSubmitComment = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("you must login to comment on the post.")
      return;
    }

    if (commentText[postId].length <= 10) {
      alert("Please enter a comment more than 10 character.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/posts/${postId}/comments`,
        { text: commentText[postId] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newComment = response.data;

      setmyquestion(prevQuestions =>
        prevQuestions.map(post =>
          post._id === postId
            ? {
              ...post,
              comments: [newComment, ...(post.comments || [])],  // Ensure array before spreading
              commentsCount: (post.commentsCount || 0) + 1  // Ensure count is at least 0
            }
            : post
        )
      );

      setCommentText(prev => ({
        ...prev,
        [postId]: "" // Reset the comment for the specific post
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment.");
      setCommentText(prev => ({
        ...prev,
        [postId]: "" // Reset the comment for the specific post
      }));
    }
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
    }
  };
  const handleCommentScroll = async (e, postId) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 10;
    if (!bottom) return; // Only fetch when near the bottom

    // Prevent a new request if one is already running for this post
    if (isFetching[postId]) return;


    try {
      // Mark as fetching for this post
      setIsFetching((prev) => ({ ...prev, [postId]: true }));


      // Get current page for this post
      const currentPage = commentPage[postId] || 1;

      // Get already fetched comment IDs
      const post = myquestion.find((p) => p._id === postId);
      const existingCommentIds = post?.comments.map((comment) => comment._id) || [];


      const response = await axios.post(
        `${backendurl}/question/${postId}/comment/bits`,
        {
          limit: 12,
          page: currentPage,
          excludeIds: existingCommentIds,
        }
      );

      const newComments = response.data.comments;

      if (newComments.length > 0) {
        setmyquestion((prevQuestions) =>
          prevQuestions.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, ...newComments] }
              : post
          )
        );

        // Increment page count for this post
        setCommentPage((prevPages) => ({
          ...prevPages,
          [postId]: currentPage + 1,
        }));
      }
    } catch (error) {
      console.error("Error fetching more comments:", error);
    } finally {
      // Clear the fetching flag for this post once the request is complete
      setIsFetching((prev) => ({ ...prev, [postId]: false }));
    }
  };
  const discussinfo = (e, id) => {
    navigate(`/discuss/info/${id}`)
  }
  const formatLikes = (num) => {
    // If num is not a number, return a default string like '0'
    if (typeof num !== 'number' || isNaN(num)) return '0';

    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
    return num.toString(); // Less than 1K, show the number as is
  };
  const handleImageLoad = (e) => {
    e.target.style.display = "block"; // Make the image visible as soon as it's loaded
  };
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
  const handlequiz = (e) => {
    navigate("/quiz")
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
  const handlesignout = (e) => {
    localStorage.removeItem('token')
    navigate("/login")
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
        {/* Title for the page */}
        <title>Global Discussions - Share Your Thoughts on TheQuilk</title>

        {/* Meta Description for SEO */}
        <meta
          name="description"
          content="Join the global community  Ask questions, share your thoughts, and engage with others in insightful discussions on various topics and all the user can comment like and share your thought idea."
        />

        {/* Open Graph Tags for better sharing on social media */}
        <meta property="og:title" content="Global  Discussions - TheQuilk" />
        <meta
          property="og:description"
          content="Join the global community at TheQuilk! Ask questions, share your thoughts, and engage with others in insightful discussions on various topics."
        />
        <meta property="og:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card Tags for sharing on Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Global  Discussions - TheQuilk" />
        <meta
          name="twitter:description"
          content="Join the global community at TheQuilk! Ask questions, share your thoughts, and engage with others in insightful discussions on various topics."
        />
        <meta name="twitter:image" content="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" />

        {/* Other useful SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="discussions, student questions, sharing ideas, community, forum, ask questions, interact, engage" />
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
        <div className="usercontainer" onScroll={handleScroll} style={{ width: "100%", height: "100%" }}>
          <div className="myquestion" >
            <div className="mobileops" style={{marginBottom:"0px"}} >

              <div className="buttonholders" onClick={handlebiology}>
                <FontAwesomeIcon icon={faBookOpenReader} />
                <button className="buttonsz">Biology Notes</button>
              </div>
              <div className="buttonholders" onClick={handlephysics}>
                <FontAwesomeIcon icon={faBookOpenReader} />
                <button className="buttonsz">Physics Notes</button>
              </div>
              <div className="buttonholders" onClick={handlejee}>
                <FontAwesomeIcon icon={faBookOpenReader} />
                <button className="buttonsz">Jee Notes</button>
              </div>
              <div className="buttonholders" onClick={handleneet}>
                <FontAwesomeIcon icon={faBookOpenReader} />
                <button className="buttonsz">Neet Notes</button>
              </div>
              <div className="buttonholders" onClick={handlemath}>
                <FontAwesomeIcon icon={faBookOpenReader} />
                <button className="buttonsz">Math Notes</button>
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
            {myquestion.length > 0 && mixdata.length > 0 ? (
              mixdata.map((post, index) => {
                return (index + 1) % 9 === 0 ? (
                  <div className="sponserediv" key={index}>

                    <div className="showsads">

                      {post.imgsrc && (
                        post.imgsrc.match(/\.(mp4|webm|ogv)$/i) ? (
                          <a href={current.links} target="_blanks">
                            <video
                              src={post.imgsrc}
                              alt="Selected"
                              className="showimages"
                              loop
                              muted
                              autoPlay
                              onLoad={handleImageLoad} style={{ display: "none" }}
                            />
                          </a>

                        ) : (
                          <a href={post.links} target="_blanks">
                            <img
                              src={post.imgsrc}
                              className="showimages"
                              alt="Selected"
                              onLoad={handleImageLoad} style={{ display: "none" }}
                            />
                          </a>

                        )
                      )}


                    </div>

                    <div className="titles">
                      <p className="currenttitles">{post.title}</p>
                    </div>
                    <div className="creatordivs">
                      <a href={post.links} target="_blanks">
                        <img
                          src={post.profileimage}
                          alt="Selected"
                          className="userimages"
                          onLoad={handleImageLoad} style={{ display: "none" }}
                        />
                      </a>
                      <p className="usernames">Sponsered</p>
                      <a href={post.links} target="_blank" ><button className="showlinks">Visit</button></a>
                    </div>

                  </div>
                ) : (
                  <div key={index} className="questiondiv">
                    <div className="creatordiv" onClick={(e) => { discussinfo(e, post.user._id) }}>
                      <img src={post.user.profile} alt={post.user.name} className="imagecreator" onLoad={handleImageLoad} style={{ display: "none" }} />
                      <p className="imagename">{post.user.name}</p>
                    </div>

                    <p className="question">{post.question}</p>

                    <div className="likeandcomment">
                      <div className="likes">
                        <button className="button">{formatLikes(post.likesCount)}</button>    <FontAwesomeIcon icon={faThumbsUp} className="iconthumb" onClick={(e) => handleLike(e, post._id)} />
                      </div>
                      <div className="comment">
                        <button className="button" onClick={handlecomment}>{formatLikes(post.commentsCount)}</button> <FontAwesomeIcon icon={faComment} className="iconthumb" />
                      </div>
                      <div className="dislikes">
                        <button className="button">{formatLikes(post.dislikesCount)}</button>    <FontAwesomeIcon icon={faThumbsDown} className="iconthumb" onClick={(e) => handledisLike(e, post._id)} />
                      </div>
                    </div>
                    <div className="commentshowdiv" onScroll={(e) => handleCommentScroll(e, post._id)}>
                      {post.commentsCount > 0 ? (
                        // If there are comments, map over them and render each one
                        post.comments.map((comment, index) => (
                          <div key={index} className="commentcontainer">
                            <div className="commentordiv">
                              <div onClick={(e) => { discussinfo(e, comment.user._id) }}>
                                <img src={comment.user.profile} alt="" className="commentorimage" onLoad={handleImageLoad} style={{ display: "none" }} />
                              </div>
                              <div className="textdiv">
                                <p className="text" onClick={(e) => { discussinfo(e, comment.user._id) }}>{comment.user.name}</p>
                                <p className="text">{comment.text}</p>
                              </div>

                            </div>
                          </div>
                        ))
                      ) : (
                        // If there are no comments, display a message
                        <div style={{ display: "flex", justifyContent: "center" }}><p>No comments</p></div>
                      )}



                    </div>
                    <div className="inputdiv">
                      <input
                        type="text"
                        placeholder="add your comments"
                        className="inputtext"
                        value={commentText[post._id] || ""}
                        onChange={(e) => handleCommentInputChange(post._id, e)}  // Handle comment change for this post
                      />

                      <button className="button" onClick={() => handleSubmitComment(post._id)}>send</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="nodiv">
              <p style={{boxShadow:"none",fontSize:"large",fontWeight:"600",marginTop:'21px'}}>LOADING QUESTIONS </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}