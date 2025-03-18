import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { useEffect, useState } from "react";
import "./Quizinfo.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faAward, faBookOpenReader, faCrow, faCrown, faDollar, faFlag, faHandPointLeft, faHandPointRight, faHeart, faHome, faMedal, faNewspaper, faPeace, faPlus, faRightFromBracket, faShare, faStar, faStopwatch, faStopwatch20, faThumbsUp, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
import { faGolang } from "@fortawesome/free-brands-svg-icons";
export default function Quizinfo() {
  const { id } = useParams();
  const[rankhernay,setrankherny]=useState(false);
  const[rankgayo,setrankgayo]=useState(false);
  const[toprankers,settoprankers]=useState([]);
  const [creatorinfo, setcreatorinfo] = useState(null)
  const [quizquestion, setquizquestion] = useState([]);
  const [totalsubmitted, settotalsubmitted] = useState(null)
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [totallikes, settotallikes] = useState(null)
  const [follow, setFollow] = useState(null);
  const[normalquiz,setnormalquiz]=useState(true);
  const [userAnswers, setUserAnswers] = useState([]); // Track user answers
  const[competequiz,setcompetequiz]=useState(false)
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const[userid,setUserid]=useState(null)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendurl}/get-quiz-details/${id}`);
    
        setquizquestion(response.data.quiz.quiz)
    
        setcreatorinfo(response.data.quiz.createdBy)
    
        settotalsubmitted(response.data.quiz.totalsubmitted)
       
      
        settitle(response.data.quiz.title)
        setdescription(response.data.quiz.description)
      } catch (error) {
        alert(error)
        navigate("/");
      }
    };

    fetchPosts();
  }, [id, navigate]);
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
    const url = `https://www.thequilk.com/quizinfo/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' quiz link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }
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
      postid:id
    };
  
    // Send results to the backend API using Axios
    axios
      .post(`${backendurl}/submit-quiz-with-update`, quizResults, {
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
    return {  color: 'green' }; // Selected correct option highlighted
  }

  // If it's an incorrect option selected by the user, highlight it in red
  if (answer.selectedOption === option && !answer.isCorrect) {
    return {  color: 'red' }; // Incorrect option highlighted
  }

  return {}; // Default style
};
const handlecompetequiz=(e)=>{
  setnormalquiz(false)
  setcompetequiz(true)
  setrankherny(false)
 }
 const hanldenormalquiz=(e)=>{
  setQuizStarted(false);
  setQuizFinished(false);
  setTimer(0);
  setAnswers([]);
  setCorrectAnswers(0);
  setIncorrectAnswers(0);
  setTotalScore(0);
  setcompetequiz(false);
  setnormalquiz(true)
  setrankherny(false)
 }
 const handletoprank=(e)=>{
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
 }
 useEffect(() => {
  if(rankgayo){
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${backendurl}/topranker/${id}`);
        settoprankers(response.data.topRankers);
       settotalsubmitted(response.data.uniqueSubmittersCount)
      } catch (error) {
        alert(error)
        navigate("/");
      }
    };

    fetchPosts();
  }
}, [rankgayo]);
const handleprofile=(e,id)=>{
  navigate(`/profile/info/${id}`)
}
const generateSEO = () => {
  return (
    <Helmet>
      <title>{title} | TheQuilk - Educational Quiz Platform</title>
      <meta name="description" content={`Take this quiz titled "${title}" created by ${creatorinfo?.name}. Total submissions: ${totalsubmitted}.`} />
      <meta name="keywords" content={`quiz, ${title}, educational,quiz,notesharing,earnasstudent,sellnote,noteattachquiz,${creatorinfo?.name}, learn`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={`Explore the quiz titled "${title}" "${description}"created by ${creatorinfo?.name}. Total submissions: ${totalsubmitted}.`} />
      <meta name="og:image" content={creatorinfo?.profile || 'default-profile-image-url.jpg'} />
      <meta property="og:url" content={`https://thequilk.com/quiz/${id}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={`Explore the quiz titled "${title}" created by ${creatorinfo?.name}.`} />
      <meta name="twitter:image" content={creatorinfo?.profile || 'default-profile-image-url.jpg'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://thequilk.com/quiz/${id}`} />
      
      {/* Schema.org structured data for Rich Snippets */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "Quiz",
            "name": "${title}",
            "description": "${description}",
            "author": {
              "@type": "Person",
              "name": "${creatorinfo?.name}",
              "url": "${creatorinfo?.profile}"
            },
            "dateCreated": "${new Date().toISOString()}",
            "url": "https://thequilk.com/quiz/${id}",
            "image": "${creatorinfo?.profile || ''}",
            "mainEntityOfPage": "https://thequilk.com/quiz/${id}"
          }
        `}
      </script>
    </Helmet>
  );
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
const handleuserlikenote=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/likenotes/${creatorinfo._id}`)
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
const handleuserquiz=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/profile/quiz/${creatorinfo._id}`)
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
const handleuserdisscussion=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/discuss/info/${creatorinfo._id}`)
  }else{
    alert("login to see your disscussion.")
  }
}
const handleuserfollowing=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/follower/${creatorinfo._id}`)
   
  }else{
    alert("login to see your disscussion.")
  }
}

const handleuserprofile=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/profile/info/${creatorinfo._id}`)
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
const handleusernews=(e)=>{
  const token = localStorage.getItem("token");
  if(token && creatorinfo && creatorinfo._id){
    navigate(`/profile/news/${creatorinfo._id}`)
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

const userprofile=(e)=>{

  navigate(`/profile/info/${id}`)
 
}
const userhome=(e)=>{

  navigate(`/userhome/${creatorinfo._id}`)

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

const usernews = (e) => {

  navigate(`/profile/news/${id}`)

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
        {generateSEO()}
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
      <div className="quizinfodiv">
        <div className="userprofilediv">
          {creatorinfo && <img src={creatorinfo.profile} alt="" className="imageprofiles" onLoad={handleImageLoad} style={{ display: "none" }} />}
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
          <div className="mobileops">
             <div className="buttonholders" onClick={userhome}>
                                      <FontAwesomeIcon icon={faHome}/>
                                      <button className="buttonsz">User home</button>
                                    </div>
              <div className="buttonholders" onClick={handleuserprofile}>
                <FontAwesomeIcon icon={faUser} />
                <button className="buttonsz">User Profile</button>
              </div>
              <div className="buttonholders" onClick={handleuserquiz}>
                <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="likeicon" />
                <button className="buttonsz">User quiz</button>
              </div>
              <div className="buttonholders" onClick={handleuserdisscussion}>
                <FontAwesomeIcon icon={faUsers} />
                <button className="buttonsz">Discussions</button>
              </div>
              <div className="buttonholders" onClick={handleusernews}>
                <FontAwesomeIcon icon={faNewspaper} />
                <button className="buttonsz">Announcement</button>
              </div>
              <div className="buttonholders" onClick={handleuserlikenote}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <button className="buttonsz">Likes Notes</button>
              </div>
              <div className="buttonholders" onClick={handleuserfollowing}>
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
        <div className="inputanddescriptionforthequiz" style={{ marginTop: "10px"}}>
          <p className="inputquiz">Title : {title}</p>
          <p className="descriptionquiz"> Context : {description}</p>
        </div>
        <div className="topandshowandcompete">
          <div className="justplace">
            <button className="buttononetwice"></button>
          <button className="buttononeonce" onClick={hanldenormalquiz}>
            showQuiz
          </button>
          </div>
          
          <div className="justplace">
         <FontAwesomeIcon icon={faGolang} className="golangicon"/>
          <button className="buttontwoonce" onClick={handlecompetequiz}>testQuiz</button>
          </div>
          
        <div className="justplace">
          <button className="buttononetwice"></button>
        <button className="buttonthreeonce" onClick={handletoprank}>topRankHolder</button>
        </div>
        
        </div>
        {normalquiz &&(<div className="quizsectionwheredisplay">
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
              {current.explanation?<p className="explanationhoniguystext">{current.explanation}</p>:<p className="explanationhoniguystext">No explanation</p>}  
              </div>
            )}
          </div>
        );
      })}
    </div>)}  
    {competequiz && (
        <div className="quizsectionwheredisplay">
        {!quizFinished &&( <div className="startingtiming">
          <FontAwesomeIcon icon={faStopwatch} className="stopwatch"/>
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
                       boxShadow: answers[index] === "option3" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)": "",
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
                       boxShadow: answers[index] === "option4" ? "10px 10px 10px rgba(185, 178, 178, 0.3),inset -10px -10px 10px rgba(160, 152, 152, 0.4)": "",
                       border: answers[index] === "option4" ? "1px solid green" : "",
                    }}
                  >
                    {question.option4}
                  </div>
           </div>
                </div>
              ))}
           
  
            <div className="finishingquizdiv">
              <FontAwesomeIcon icon={faFlag} className="finishingquizdivflag"/>
              <button onClick={finishQuiz} className="finishingquizdivfinish">Finish Quiz</button>
              <FontAwesomeIcon icon={faFlag} className="finishingquizdivflag"/>
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
            <div className="startingtiming" style={{border:"none",marginTop:"10px"}}>
          <FontAwesomeIcon icon={faStopwatch} className="stopwatch"/>
 
         <button className="timewatch">{timer} Sec</button>
         </div>
            </div>
          </div>
        )}
      </div>
      )} 
       {rankhernay&&(<div className="rankholderthatitis">
    <div className="rankholderdivnumber">
   {totalsubmitted != null && totalsubmitted >=0 && <button className="rankholderdivnumberbutton">Total number of Submited : {formatLikes(totalsubmitted)}</button>}
   </div>
   <div className="actualrankholding">
   {toprankers && toprankers.length>0?(toprankers.map((current,index)=>{
    return(
      <div key={index} className="actualhonking">
        {index<3 && <FontAwesomeIcon icon={faMedal} className="awardguys"/>}
        <img src={current.submittedBy.profile} alt="" className="imagetoppers"onLoad={handleImageLoad}  style={{ display: "none" }} onClick={(e)=>{handleprofile(e,current.submittedBy._id)}}/>
        <div className="icontoproudholder">
        
        <FontAwesomeIcon icon={faStar} className="icontoproud"/>
        <FontAwesomeIcon icon={faCrown} className="crownicon"/>
        <FontAwesomeIcon icon={faStar} className="icontoproud"/>
        
        </div>
    
        <button className="nameofwinner" onClick={(e)=>{handleprofile(e,current.submittedBy._id)}}>{current.submittedBy.name}</button>
        <div className="okdoingit">
          <FontAwesomeIcon icon={faStopwatch} className="stopwatching"/>
          <button className="secondholdering">{current.timeTaken}<span className="spaning">Sec</span></button>
        </div>
        <button className="showingscore">{current.totalScore} Score</button>
        </div>
    )
   })):(<p style={{fontSize:"large",fontWeight:"500",marginTop:"100px",color:"red"}}>Be the first One to Set the Record...</p>)}
   </div>
   </div>)}
      </div>
      </div>
    </div>
  )
}