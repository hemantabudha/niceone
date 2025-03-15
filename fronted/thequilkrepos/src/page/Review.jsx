import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import { useEffect, useState } from "react";
import "./Review.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAward, faCrow, faCrown, faFlag, faHandPointLeft, faHandPointRight, faHeart, faMedal, faPeace, faShare, faStar, faStopwatch, faStopwatch20, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
export default function Review() {
  const { id } = useParams();
  const [creatorinfo, setcreatorinfo] = useState(null)
  const [totallikes, settotallikes] = useState(null)
  const [follow, setFollow] = useState(null);
  const [infodata, setInfodata] = useState(null);
  const [mixdata, setMixdata] = useState([]);
  const [selectedimage, setselectedimage] = useState(null);
  const [adsdata, setadsdata] = useState([]);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [quizlength, setquizlength] = useState(null)
  const [normalquiz, setnormalquiz] = useState(false);
  const [competequiz, setcompetequiz] = useState(false)
  const [imagesurl, setimagesurl] = useState([])
  const navigate = useNavigate();
  const [quizgayo, setquizgayo] = useState(false)
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(null); // Track like status
  const [quizquestion, setquizquestion] = useState([])
  const [rankhernay, setrankherny] = useState(false);
  const [rankgayo, setrankgayo] = useState(false);
  const [commenthernay, setcommenthernay] = useState(false);
  const [commentgayo, setcommentgayo] = useState(false)
  const [toprankers, settoprankers] = useState([]);
  const [submittedcount, setsubmmitedcounts] = useState(null)
  const [commenttext, setcommentext] = useState("");
  const [commentloading, setcommentloading] = useState(false);
  const [postcommentholder, setpostcommentholder] = useState([])
  // Function to merge post data and ads data
  const [userAnswers, setUserAnswers] = useState([]); // Track user answers
  // State management
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [fetchedcomment, setfetchedcomment] = useState(false)
  // Start Timer
  useEffect(() => {
    if (quizStarted && !quizFinished) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [quizStarted, quizFinished]);

  // Handle answer selection
  const handleAnswerSelection = (questionIndex, selectedAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);
  };

  // Finish the quiz
  const finishQuiz = () => {
    // Check if the total time taken exceeds 1 day (86400 seconds)

    if (timer >= 86400) {
      alert("You can only finish the quiz within one day. Please restart the quiz.");

      // Clear everything to reset the quiz
      setQuizStarted(false);
      setQuizFinished(false);
      setTimer(0);
      setAnswers([]);
      setCorrectAnswers(0);
      setIncorrectAnswers(0);
      setTotalScore(0);
      return;
    }

    // Check if all questions are answered
    if (answers.length !== quizquestion.length || answers.includes(undefined)) {
      alert("Please complete the quiz by answering all the questions.");
      return;
    }
    const token = localStorage.getItem('token');

    if (!token) {
      alert("please login to show your results")
      return;
    }
    setQuizFinished(true);

    // Calculate the number of correct answers and negative marking
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    answers.forEach((answer, index) => {
      if (answer === quizquestion[index].answer) {
        correctAnswers += 1;
      } else {
        incorrectAnswers += 1;
      }
    });

    // Negative marking: -0.5 marks for each incorrect answer
    const negativeMarks = incorrectAnswers * 0.5;

    // Total score = correct answers - negative marks
    const totalScore = correctAnswers - negativeMarks;

    setCorrectAnswers(correctAnswers);
    setIncorrectAnswers(incorrectAnswers);
    setTotalScore(totalScore);
    setrankgayo(false)
    // Prepare data to send to the backend
    const quizResults = {
      timeTaken: timer,
      correctAnswers,
      incorrectAnswers,
      negativeMarks,
      totalScore,
      postid: id
    };

    // Send results to the backend API using Axios
    axios
      .post(`${backendurl}/submit-quiz`, quizResults, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach the token in the Authorization header
        },
      })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error sending quiz results to backend:", error);
      });


  };



  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    setTimer(0);
    setAnswers([]);
    setQuizFinished(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTotalScore(0);
  };

  // Function to handle the option selection
  const handleAnswer = (questionIndex, selectedOption) => {
    const correctAnswer = quizquestion[questionIndex].answer;

    // Record the user's answer (correct or wrong)
    setUserAnswers(prevState => {
      const updatedAnswers = [...prevState];
      updatedAnswers[questionIndex] = {
        selectedOption,
        isCorrect: selectedOption === correctAnswer
      };
      return updatedAnswers;
    });
  };

  // Function to dynamically set styles for the options
  const getOptionStyle = (questionIndex, option) => {
    const answer = userAnswers[questionIndex];

    if (!answer) return {};  // No answer yet, no styles

    const correctAnswer = quizquestion[questionIndex].answer;

    // If the user selected the wrong option, highlight the correct option in green
    if (answer.selectedOption !== correctAnswer && option === correctAnswer) {
      return { color: 'green' }; // Correct option highlighted
    }

    // If the user selected this option and it's the correct answer
    if (answer.selectedOption === option && answer.isCorrect) {
      return { color: 'green' }; // Selected correct option highlighted
    }

    // If it's an incorrect option selected by the user, highlight it in red
    if (answer.selectedOption === option && !answer.isCorrect) {
      return { color: 'red' }; // Incorrect option highlighted
    }

    return {}; // Default style
  };

  const mixArray = (array1, array2) => {

    const result = [];
    let adIndex = 0;

    // Shuffle ads before using them
    const shuffledAds = [...array2].sort(() => Math.random() - 0.5); // Randomly shuffle ads

    for (let i = 0; i < array1.length; i++) {
      result.push(array1[i]); // Push post data item

      // After every 2 posts, insert an ad randomly from the shuffled ads list
      if ((i + 1) % 26 === 0 && adIndex < shuffledAds.length) {
        result.push(shuffledAds[adIndex]); // Insert ad
        adIndex = (adIndex + 1) % shuffledAds.length; // Cycle through ads
      }
    }
    return result;
  };


  useEffect(() => {
    const fetchPosts = async () => {
      const initialLimit = window.innerWidth < 600 ? 9 : 18;
      try {
        const response = await axios.get(`${backendurl}/upload/file/${id}`, {
          params: { initialLimit }, // Send `initialLimit` as a query parameter
        });
        setquizlength(response.data.quizLength)
        setInfodata(response.data.postdata);

        setcreatorinfo(response.data.postdata.createdBy)
        setimagesurl(response.data.postdata.images)
      } catch (error) {
        alert(error)
        navigate("/");
      }
    };

    fetchPosts();
  }, [id, navigate]);

  useEffect(() => {
    if (quizgayo) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${backendurl}/upload/file/quiz/${id}`);
          setquizquestion(response.data.quiz.quiz)
        } catch (error) {
          alert(error)
          navigate("/");
        }
      };

      fetchPosts();
    }
  }, [quizgayo]);
  useEffect(() => {
    const fetchads = async () => {
      try {
        const response = await axios.get(`${backendurl}/otherads`);

        setadsdata(response.data.otherads)
      } catch (error) {

      }
    }
    fetchads();
  }, [navigate])
  const handleprofile = (e, id) => {
    navigate(`/profile/info/${id}`)
  }


  useEffect(() => {
    if (imagesurl.length > 0 && adsdata.length > 0) {
      const mixedData = mixArray(imagesurl, adsdata);

      const previouslySelectedImage = mixedData.find(img => img === selectedimage);

    // If previously selected image exists in the mixed data, reselect it
    if (previouslySelectedImage) {
      setselectedimage(previouslySelectedImage);
    } else {
      // Otherwise, set the first image in the mixed data as the selected image
      setselectedimage(mixedData[0]);
    }
      setMixdata(mixedData)
    }
  }, [imagesurl, adsdata]);
  const handleselectedimage = (e, current) => {
    setselectedimage(current)
  }
  const handlewishlist = async (e, id) => {

    e.stopPropagation();

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      alert("please login to wishlist")
      return;
    }

    try {
      // Make the API request to add the post to the wishlist using Axios
      const response = await axios.post(
        `${backendurl}/upload/file/wishlist`, // Endpoint for adding to wishlist
        { postid: id }, // Body with the postid
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );

    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // The server responded with an error status code
        if (error.response.status === 400 && error.response.data.message === "Post is already in your wishlist") {

        } else if (error.response.status === 403) {
          // If the token is invalid or expired, redirect to login
          alert("Token is invalid or expired. Please log in again.");

        } else {
          // For any other errors
          alert("Error adding to wishlist.");

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
  const handlechapterlink = (e) => {
    const url = `https://www.thequilk.com/detail/review/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' Notes link copied.Now you share it!');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }
  const handleLike = async (e, postId) => {
    e.stopPropagation();

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      alert("please login to like the post")
      return;
    }

    try {
      // Make the API request to like or unlike the post using Axios
      const response = await axios.post(
        `${backendurl}/like-post/${postId}`,  // Endpoint for liking/unliking the post
        {},  // No body required in the request for like/unlike action
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Attach the token in the Authorization header
          },
        }
      );
      setInfodata(response.data.postdata)
      if (response.data.message === "you don't like it") {
        setLiked(false);
      } else {
        setLiked(true);
      }

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

      }
    }
  };
  useEffect(() => {
    const fetchLikeStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {

        return;
      }

      try {
        const response = await axios.get(`${backendurl}/like-post/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.message === "You like it") {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [id, navigate]);
  const formatLikes = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
    return num.toString(); // Less than 1K, show the number as is
  };
  const handleImageLoad = (e) => {
    e.target.style.display = "block"; // Make the image visible as soon as it's loaded
  };

  const handleScroll = async (e) => {
    const rightEnd = e.target.scrollWidth - e.target.scrollLeft - e.target.clientWidth <= 10; // 10px tolerance before the right end
    if (rightEnd && !loading) {
      setLoading(true);
      try {
        const res = await axios.post(`${backendurl}/upload/file/images/${id}`, {
          excludeUrls: imagesurl,  // Send already fetched image URLs
        });
        setimagesurl((prev) => [...prev, ...res.data.images]);  // Append new images
      } catch (error) {
        console.error('Error loading more images', error);
      } finally {
        setLoading(false);
      }
    }
  };
  const handlecompetequiz = (e) => {
    setnormalquiz(false)
    setcompetequiz(true)
    setquizgayo(true)
    setrankherny(false)
    setcommenthernay(false)
  }
  const hanldenormalquiz = (e) => {
    setQuizStarted(false);
    setQuizFinished(false);
    setTimer(0);
    setAnswers([]);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTotalScore(0);
    setcompetequiz(false);
    setnormalquiz(true)
    setquizgayo(true)
    setrankherny(false)
    setcommenthernay(false)
  }
  const handletoprank = (e) => {
    setQuizStarted(false);
    setQuizFinished(false);
    setTimer(0);
    setAnswers([]);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTotalScore(0);
    setcompetequiz(false);
    setnormalquiz(false)
    setrankherny(true)
    setrankgayo(true)
    setcommenthernay(false)
  }
  const handlecommenthernay = async (e) => {
    setQuizStarted(false);
    setQuizFinished(false);
    setTimer(0);
    setAnswers([]);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setTotalScore(0);
    setcompetequiz(false);
    setnormalquiz(false)
    setrankherny(false)
    setcommenthernay(true)
    setcommentgayo(true)

    if (fetchedcomment === false) {

      const excludeIds = postcommentholder.map(comment => comment._id);
      const response = await axios.post(`${backendurl}/getpost/comments/${id}`, { excludeIds });
      setpostcommentholder(prev => [...prev, ...response.data.comments]); // Call your function to fetch comments
      setfetchedcomment(true);  // Set this flag to true to prevent further backend calls
    }
  }
  useEffect(() => {
    if (rankgayo) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${backendurl}/topranker/${id}`);
          settoprankers(response.data.topRankers);
          setsubmmitedcounts(response.data.uniqueSubmittersCount)
        } catch (error) {
          alert(error)
          navigate("/");
        }
      };

      fetchPosts();
    }
  }, [rankgayo]);
  const handlecommenttext = (e) => {
    const commenthoni = e.target.value;

    // Ensure the length is less than 150
    if (commenthoni.length <= 150) {
      setcommentext(commenthoni);
    }
  };
  const handlesubmitcomment = async (e) => {

    e.stopPropagation();  // Optional, make sure you need this

    // Get the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      alert("Please login to comment.");
      return;
    }

    // Trim input text before checking if it's empty
    if (commenttext.trim() === "") {
      alert("Please make sure to add a comment before submitting. Thank you.");
      return;
    }

    try {
      // Make the API request to add the comment
      const response = await axios.post(
        `${backendurl}/post/add-comment/${id}`, // API endpoint
        { text: commenttext },  // Sending the comment text
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach token to header
          },
        }
      );

      // Handle successful response
      setcommentext("");
      setpostcommentholder(prev => [response.data.comment, ...prev]);

    } catch (error) {
      // Check if it's an error from the response or network error
      alert(error)
    }
  };
  const fetchComments = async () => {

    if (!commentgayo || commentloading) {

      return
    };

    setcommentloading(true);
    try {
      const excludeIds = postcommentholder.map(comment => comment._id);
      const response = await axios.post(`${backendurl}/getpost/comments/${id}`, { excludeIds });
      setpostcommentholder(prev => [...prev, ...response.data.comments]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setcommentloading(false);
  };

  // Detect scrolling to the bottom
  const handleCommentScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 10;

    if (bottom) {
      fetchComments();
    }
  };
  useEffect(() => {
    if (creatorinfo === null || !creatorinfo._id) {
      return;
    }

    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get(`${backendurl}/user/${creatorinfo._id}/total-likes`);
        settotallikes(response.data.totalLikes);
      } catch (err) {
        console.error("Error fetching total likes:", err.response || err);
      }
    };

    fetchTotalLikes();
  }, [creatorinfo]);
  useEffect(() => {
    if (creatorinfo === null || !creatorinfo._id) {
      return;
    }
    const fetchFollowStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {

        return;
      }

      try {
        const response = await axios.get(`${backendurl}/follow/status/${creatorinfo._id}`, {
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
  }, [creatorinfo, navigate]);
  const handleFollow = async () => {
    if (creatorinfo === null || !creatorinfo._id) {
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("you must login to follow")
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/follow/${creatorinfo._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setcreatorinfo(response.data.user)
      if (response.data.message === "Followed successfully") {
        setFollow(true);
      } else if (response.data.message === "Unfollowed successfully") {
        setFollow(false);
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };
  const handleprofilelink = (e) => {
    if (creatorinfo === null || !creatorinfo._id) {
      return;
    }
    const url = `https://www.thequilk.com/profile/info/${creatorinfo._id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' profile link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }
  return (
    <div className="alwaysmain">
      <Helmet>
        <title>{infodata?.title || "Loading..."}</title>
        <meta name="description" content={infodata?.description || "View and review notes"} />
        <meta property="og:title" content={infodata?.title || "TheQuilk Review"} />
        <meta
          name="keywords"
          content={
            infodata?.title
              ? `${infodata.title}, handwritten notes, review, TheQuilk, note sharing , notesharingplatform , completenotes, discussion platform, education, notesharing, alternativeofreddit`
              : "notes, review, TheQuilk, note sharing, completenotes, discussion platform, education, notesharing, alternativeofreddit, handwritten notes"
          }
        />
        <meta property="og:description" content={infodata?.description || "TheQuilk: A note-sharing platform and a disccusion platform alternative of reddit"} />
        {infodata?.images && infodata.images.length > 0 && (
          <meta property="og:image" content={infodata.images[0]} />
        )}
      </Helmet>
      <Navbar />

      <div className="detail" onScroll={handleCommentScroll}>

        <div className="detaildiv">
          <div className="bigimagediv">
            <div className="pen" onClick={(e) => { handlewishlist(e, id) }}>
              <FontAwesomeIcon icon={faHeart} className="penicon" />
            </div>
            <div className="pen3" onClick={(e) => { handleLike(e, id) }} >
              <FontAwesomeIcon icon={faThumbsUp} className={liked ? "penactiveicon3" : "penicon3"} />
              {infodata && <p className="titles">{formatLikes(infodata.likesCount)}</p>}
            </div>
            <div className="pen2" onClick={handlechapterlink}>
              <FontAwesomeIcon icon={faShare} className="penicon2" />
            </div>
            {selectedimage &&
              (typeof selectedimage === "object" && selectedimage.imgsrc ? (
                <>
                  {selectedimage.imgsrc && (
                    selectedimage.imgsrc.match(/\.(png|jpe?g|gif|bmp)$/i) ? (
                      <a href={selectedimage.links} target="_blank" rel="noreferrer">
                        <img src={selectedimage.imgsrc} alt="Ad" className="bigimagepic" onLoad={handleImageLoad} style={{ display: "none" }} />
                      </a>
                    ) : selectedimage.imgsrc.match(/\.(mp4|webm|ogv)$/i) ? (
                      <a href={selectedimage.links} target="_blank" rel="noreferrer">
                        <video controls autoPlay loop src={selectedimage.imgsrc} className="bigimagepic" onLoad={handleImageLoad} style={{ display: "none" }} ></video>
                      </a>
                    ) : null
                  )}

                </>
              ) : (
                <>
                  {selectedimage && (
                    selectedimage.match(/\.(png|jpe?g|gif|bmp|tiff|webp)$/i) ? (
                      <img
                        src={selectedimage}
                        alt="Post"
                        className="bigimagepic"
                        onClick={(e) => { handleLike(e, id) }}
                        onLoad={handleImageLoad} style={{ display: "none" }}
                      />
                    ) : selectedimage.match(/\.(mp4|webm|ogv)$/i) ? (
                      <video
                        src={selectedimage}
                        controls
                        autoPlay
                        className="bigimagepic"
                        onLoad={handleImageLoad} style={{ display: "none" }}
                      />
                    ) : selectedimage.endsWith(".pdf") ? (
                      <iframe
                        src={`https://docs.google.com/viewer?url=${selectedimage}&embedded=true`}
                        className="bigimagepic"
                        onLoad={handleImageLoad} style={{ display: "none" }}
                      ></iframe>
                    ) : null
                  )}

                </>
              ))}
          </div>
          <div className="titlesdiv">
            {infodata && <p className="titles">{infodata.title}</p>}
          </div>
          <div className="imagedivreview" onScroll={handleScroll} style={{ justifyContent: mixdata.length > 5 ? "flex-start" : "center" }}>
            {mixdata.length > 0 &&
              mixdata.map((current, index) => {

                if (current.imgsrc) {
                  // Handle images
                  if (current.imgsrc.match(/\.(png|jpe?g|gif|bmp|tiff|webp)$/i)) {
                    return (
                      <img
                        src={current.imgsrc}
                        alt="Ad"
                        className="imageprev"
                        onClick={(e) => { handleselectedimage(e, current); }}
                        onLoad={handleImageLoad} style={{ display: "none" }}
                      />
                    );
                  }
                  // Handle videos
                  else if (current.imgsrc.match(/\.(mp4|webm|ogv)$/i)) {
                    return (
                      <video
                        src={current.imgsrc}
                        autoPlay
                        muted
                        loop
                        className="imageprev"
                        onClick={(e) => { handleselectedimage(e, current); }}
                        onLoad={handleImageLoad} style={{ display: "none" }}
                      ></video>
                    );
                  }
                }
                else {
                  // Handle media items from infodata.images
                  if (current.match(/\.(png|jpe?g|gif|bmp|tiff|webp)$/i)) {
                    return (
                      <img
                        key={index}
                        src={current}
                        alt="Image"
                        className="imageprevdata"
                        onLoad={handleImageLoad} style={{ display: "none" }}
                        onClick={(e) => { handleselectedimage(e, current) }}
                      />
                    );
                  } else if (current.match(/\.(mp4|webm|ogv)$/i)) {
                    return (
                      <video key={index} autoPlay muted loop className="imageprevdata" onLoad={handleImageLoad} style={{ display: "none" }} onClick={(e) => { handleselectedimage(e, current) }}>
                        <source src={current} />
                      </video>
                    );
                  } else if (current.endsWith(".pdf")) {
                    return (
                      <button className="showbutton" onClick={e => { handleselectedimage(e, current) }}>Show Pdf</button>
                    );
                  }
                }
                return null;
              })}
          </div>

          <div className="userprofilediv" >
            {creatorinfo && <img src={creatorinfo.profile} alt="" className="imageprofiles" onLoad={handleImageLoad} style={{ display: "none", width: "120px", height: "120px" }} onClick={(e) => { handleprofile(e, creatorinfo._id) }} />}
            {creatorinfo && <p className="usernameclasss">{creatorinfo.name}</p>}
            {creatorinfo && <p className="userinfotext">{creatorinfo.description}</p>}
            <div className="buttons">
              <div className="upperbuttons">
                {creatorinfo && <button className="buttonsclass">{creatorinfo.followercounts > 2 ? <FontAwesomeIcon icon={faCrown} className="crown" /> : ""}</button>}
                {creatorinfo && <button className="buttonsclass">{formatLikes(creatorinfo.followercounts)}</button>}
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

          <div className="descriptiondiv">
            {infodata && <div> <p className="descriptiontext">*Description: {infodata.description}</p></div>}
          </div>
          <div className="buttondivholderhamkohonitesma">
          {infodata && infodata.notelink && infodata.notelink.length > 0&& <div className="youtubelinktoshow">
            <FontAwesomeIcon icon={faYoutube} className="youtubelinktoshowicon"/>
              <a href={infodata.notelink} target="_blank">
                
                <button className="youtubelinktoshowbutton">VideoLink</button>
              </a>
              </div>}
            <div className="showquizbuttonhellow">

              <button onClick={handlecommenthernay} className="showquizbutton" >comment</button>
              {quizlength > 0 ? (
                <button onClick={handlecompetequiz} className="showquizbutton" >Test Quiz</button>
              ) : (
                ""
              )}
              {quizlength > 0 ? (
                <button onClick={hanldenormalquiz} className="showquizbutton">Show Quiz</button>
              ) : (
                <button className="showquizbutton" >NO Quiz</button>
              )}
            </div>
            <div className="showquizbuttonhellowtwo">
              {quizlength > 0 ? (
                <button onClick={handletoprank} className="showquizbuttontwo">Top Rank Holder</button>
              ) : (
                ""
              )}
            </div>
          </div>

        </div>
        {normalquiz && (<div className="quizsectionwheredisplay">
          {quizquestion.map((current, index) => {
            return (
              <div className="quizholdersectionone" key={index}>
                <div className="askingquestionpeople">
                  <FontAwesomeIcon icon={faHandPointRight} className="askingquestionpeopleicon" />
                  <p className="askingquestionpeopletext">{current.question}</p>
                </div>

                {/* Show the options for each question */}
                <div className="optionholderhohaiguys">
                  <p
                    onClick={() => handleAnswer(index, 'option1')}
                    style={getOptionStyle(index, 'option1')}
                    className="optionholderhohaiguystext"
                  >
                    {current.option1}
                  </p>
                  <p
                    onClick={() => handleAnswer(index, 'option2')}
                    style={getOptionStyle(index, 'option2')}
                    className="optionholderhohaiguystext"
                  >
                    {current.option2}
                  </p>
                  <p
                    onClick={() => handleAnswer(index, 'option3')}
                    style={getOptionStyle(index, 'option3')}
                    className="optionholderhohaiguystext"
                  >
                    {current.option3}
                  </p>
                  <p
                    onClick={() => handleAnswer(index, 'option4')}
                    style={getOptionStyle(index, 'option4')}
                    className="optionholderhohaiguystext"
                  >
                    {current.option4}
                  </p>
                </div>

                {/* Show the explanation after an answer has been selected */}
                {userAnswers[index] && (
                  <div className="explanationhoniguys">
                    {current.explanation ? <p className="explanationhoniguystext">{current.explanation}</p> : <p className="explanationhoniguystext">No explanation</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>)}
        {competequiz && (
          <div className="quizsectionwheredisplay">
            {!quizFinished && (<div className="startingtiming">
              <FontAwesomeIcon icon={faStopwatch} className="stopwatch" />
              {!quizStarted && !quizFinished ? (

                <button onClick={startQuiz} className="startquiz">Start Quiz</button>
              ) : <button className="timewatch">{timer} Sec</button>}
            </div>)}

            {quizStarted && !quizFinished ? (
              <div>

                {quizquestion.map((question, index) => (
                  <div key={index} className="quizholdersectionone">
                    <div className="askingquestionpeople">
                      <FontAwesomeIcon icon={faHandPointRight} className="askingquestionpeopleicon" />
                      <p className="askingquestionpeopletext">{question.question}</p>
                    </div>
                    <div className="optionholderhohaiguys">
                      <p
                        onClick={() => handleAnswerSelection(index, "option1")}
                        className="optionholderhohaiguystext"
                        style={{
                          color: answers[index] === "option1" ? "green" : "",
                          boxShadow: answers[index] === "option1" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)" : "",
                          border: answers[index] === "option1" ? "1px solid green" : "",
                        }}
                      >
                        {question.option1}
                      </p>
                      <p
                        onClick={() => handleAnswerSelection(index, "option2")}
                        className="optionholderhohaiguystext"
                        style={{
                          color: answers[index] === "option2" ? "green" : "",
                          boxShadow: answers[index] === "option2" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)" : "",
                          border: answers[index] === "option2" ? "1px solid green" : "",
                        }}
                      >
                        {question.option2}
                      </p>
                      <p
                        onClick={() => handleAnswerSelection(index, "option3")}
                        className="optionholderhohaiguystext"
                        style={{
                          color: answers[index] === "option3" ? "green" : "",
                          boxShadow: answers[index] === "option3" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)" : "",
                          border: answers[index] === "option3" ? "1px solid green" : "",
                        }}
                      >
                        {question.option3}
                      </p>
                      <div
                        onClick={() => handleAnswerSelection(index, "option4")}
                        className="optionholderhohaiguystext"
                        style={{
                          color: answers[index] === "option4" ? "green" : "",
                          boxShadow: answers[index] === "option4" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)" : "",
                          border: answers[index] === "option4" ? "1px solid green" : "",
                        }}
                      >
                        {question.option4}
                      </div>
                    </div>
                  </div>
                ))}


                <div className="finishingquizdiv">
                  <FontAwesomeIcon icon={faFlag} className="finishingquizdivflag" />
                  <button onClick={finishQuiz} className="finishingquizdivfinish">Finish Quiz</button>
                  <FontAwesomeIcon icon={faFlag} className="finishingquizdivflag" />
                </div>
              </div>
            ) : null}

            {quizFinished && (
              <div className="quizresultsection">


                <div className="imagesection">
                  <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" className="imageiconthing" alt="" />
                </div>
                <div className="quizresultanalysis">
                  <button className="totalscoreimage">Total Score: {totalScore}</button>
                  <div className="correctincorrect">
                    <button className="correct">Correct Answers: {correctAnswers}</button>
                    <button className="correct">Incorrect Answers: {incorrectAnswers}</button>
                  </div>
                  <button className="hellonegativemark">Negative Marks: {incorrectAnswers * 0.5}</button>
                  <div className="startingtiming" style={{ border: "none", marginTop: "10px" }}>
                    <FontAwesomeIcon icon={faStopwatch} className="stopwatch" />

                    <button className="timewatch">{timer} Sec</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {rankhernay && (<div className="rankholderthatitis">
          <div className="rankholderdivnumber">
            {submittedcount != null && submittedcount >= 0 && <button className="rankholderdivnumberbutton">Total number of Submited : {formatLikes(submittedcount)}</button>}
          </div>
          <div className="actualrankholding">
            {toprankers && toprankers.length > 0 ? (toprankers.map((current, index) => {
              return (
                <div key={index} className="actualhonking">
                  {index < 3 && <FontAwesomeIcon icon={faMedal} className="awardguys" />}
                  <img src={current.submittedBy.profile} alt="" className="imagetoppers" onLoad={handleImageLoad} style={{ display: "none" }} onClick={(e) => { handleprofile(e, current.submittedBy._id) }} />
                  <div className="icontoproudholder">
                  
                    <FontAwesomeIcon icon={faStar} className="icontoproud" />
                    <FontAwesomeIcon icon={faCrown} className="crownicon" />
                    <FontAwesomeIcon icon={faStar} className="icontoproud" />
                    
                  </div>

                  <button className="nameofwinner" onClick={(e) => { handleprofile(e, current.submittedBy._id) }}>{current.submittedBy.name}</button>
                  <div className="okdoingit">
                    <FontAwesomeIcon icon={faStopwatch} className="stopwatching" />
                    <button className="secondholdering">{current.timeTaken}<span className="spaning">Sec</span></button>
                  </div>
                  <button className="showingscore">{current.totalScore} Score</button>
                </div>
              )
            })) : (<p style={{ fontSize: "large", fontWeight: "500", marginTop: "100px", color: "red" }}>Be the first One to Set the Record...</p>)}
          </div>
        </div>)}
        {commenthernay && (<div className="commentsectiondivholder" style={{ border: "none" }}>
          <div className="inputsectiontocomment">
            <input type="text" onChange={handlecommenttext} value={commenttext} placeholder="Add your comment....." className="inputtexttodisplay" />
            <button onClick={handlesubmitcomment} className="sendcomment">send</button>
          </div>
          <div className="commentholdersectionforpost">
            {postcommentholder && postcommentholder.length > 0 ? (postcommentholder.map((current, index) => {
              return (
                <div key={index} className="actualholderwhoholdcomment">

                  <img src={current.user.profile} alt="" className="imageforthecommentor" onLoad={handleImageLoad} style={{ display: "none" }} onClick={(e) => { handleprofile(e, current.user._id) }} />

                  <div className="namepluscomment">
                    <p className="usernameforcommentor">{current.user.name}</p>
                    <p className="usertextforcommentor">{current.text}</p>
                  </div>
                </div>
              )
            })

            ) : (<div style={{ display: "flex", justifyContent: "center", height: "500px" }}>
              <p style={{ fontSize: "large", fontWeight: "500", marginTop: "30px" }}>
                no comment yet be the first one...
              </p>

            </div>)}
          </div>
        </div>)}
      </div>

    </div>
  );
}
