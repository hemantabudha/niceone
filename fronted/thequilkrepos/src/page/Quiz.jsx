import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import axios from "axios";
import "./Quiz.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendUp, faBook, faBookOpen, faBookOpenReader, faDollar, faHandPointRight, faHeart, faHome, faNewspaper, faPlus, faRightFromBracket, faThumbsUp, faThumbTack, faUpload, faUser, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet"; // Import react-helmet
import { faGolang } from "@fortawesome/free-brands-svg-icons";
export default function Quiz(){
  const navigate=useNavigate();

  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const[searchquizdata,setsearchquizdata]=useState([])
 
  const [actualquizdata, setActualquizData] = useState([]);
  const [loading, setLoading] = useState(false);
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

 
  

  // Validate the quiz before saving

  
  

  // Add a new quiz
 
 


const handleSearch = (e) => {
  setSearchQuery(e.target.value);
};
useEffect(() => {
  const fetchPosts = async () => {
  

    try {
      const response = await axios.post(`${backendurl}/quizpage`, {
        query: searchQuery
      });
      const newpost=response.data.datas;
     
      if(newpost.length===0){
        setsearchquizdata([])
      }
   setsearchquizdata(response.data.datas)
    } catch (error) {
      console.error("Error fetching posts:", error);
    } 
  };

  fetchPosts();
}, [searchQuery]);
const loadMoreQuizzes = async () => {
  setLoading(true);
  try {
    // Get only the IDs from the existing quizzes to exclude
    const excludedIds = actualquizdata.map(quiz => quiz._id);

    const res = await axios.post(`${backendurl}/get-quizzesdisplay`, {
      excludeUrls: excludedIds,  // Send the IDs to exclude
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

 const formatLikes = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
  return num.toString(); // Less than 1K, show the number as is
};
const handleImageLoad = (e) => {
  e.target.style.display = "block"; // Make the image visible as soon as it's loaded
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
const profilequiz=(e,id)=>{
  navigate(`/profile/quiz/${id}`)
}
const quizinfo=(e,id)=>{
  navigate(`/quizinfo/${id}`)
}
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
  return(
    <div className="alwaysmain">
     

  <Navbar/>
  <div className="modern">
    {questions.length<=0&&( 
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
                         <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png"  alt="" className="likeicon"/>
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
    )}

      <div className="quizsectiontodisplayallthequiz" onScroll={handleScroll}>
        <div className="addingthequizandsearchthequiz">
          <input type="text" className="addingthequizandsearchthequizinput" placeholder="searchquiz..." onChange={handleSearch} value={searchQuery}/>
        </div>
           <div className="searchdataquizandnonsearchdisplay">
         {searchquizdata && searchquizdata.length>0 ?(
          searchquizdata.map((current,index)=>{
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
         })):(
       actualquizdata&& actualquizdata.length>0 ?(
         actualquizdata.map((current,index)=>{
            return(
              <div key={index} className="realsearchdataquizandnonsearchdisplay">
                 {generateSEO(current)}
                <div className="imageandtitleforthequiz">
                  <img src={current.createdBy.profile}onLoad={handleImageLoad}  style={{ display: "none" }} onClick={(e)=>{profilequiz(e,current.createdBy._id)}}alt="" className="imageandtitleforthequizimage" />
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
           })):(<div style={{width:"100%",marginTop:"50%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"large",fontWeight:"500"}}>loading....</div>)
         )}
           </div>
      </div>




    </div>

    </div>
  )
}
