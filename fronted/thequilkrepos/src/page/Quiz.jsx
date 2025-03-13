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
  const [user, setUser] = useState(null);
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const[addingquiz,setaddingquiz]=useState(false)
  const [questions, setQuestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const[searchquizdata,setsearchquizdata]=useState([])
  const[quiztitle,setquiztitle]=useState("");
  const[quizdesccription,setquizdescription]=useState("");
  const[quizloading,setquizloading]=useState(false);
  const [actualquizdata, setActualquizData] = useState([]);
  const [loading, setLoading] = useState(false);
  const[userid,setUserid]=useState(null);
  const [questionErrors, setQuestionErrors] = useState([]);
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
  // Handle input changes for each quiz
  const validateQuiz = (quiz) => {
    const { question, option1, option2, option3, option4, answer } = quiz;

    // Check if all required fields are filled
    if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
      return 'All required fields should filled out and see there is red color question there is error.!';
    }

    // Check if options are unique
    if (option1 === option2 || option1 === option3 || option1 === option4 ||
        option2 === option3 || option2 === option4 || option3 === option4) {
      return 'Options must be unique and see the question with red color.there is error!';
    }

    // Check if the answer matches one of the options
    if (answer !== 'option1' && answer !== 'option2' && answer !== 'option3' && answer !== 'option4') {
      return 'Answer must match one of the options and see the question with red color there is error.!';
    }

    return null;
  };
  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  
    // Validate the question
    const errors = validateQuizOnChange(updatedQuestions[index]);
  
    // Copy existing errors and update only the current question's error
    const updatedErrors = [...questionErrors];
    updatedErrors[index] = Object.keys(errors).length ? errors : null; // Set to null if no errors
  
    setQuestionErrors(updatedErrors);
  };
  
  

  // Validate the quiz before saving
  const validateQuizOnChange = (quiz) => {
    const { question, option1, option2, option3, option4, answer } = quiz;
    let errors = {};
  
    // Check if all required fields are filled
    if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
      errors.emptyFields = 'All fields (question, options, and answer) must be filled out!';
    }
  
    // Check if options are unique
    const options = [option1, option2, option3, option4];
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) {
      errors.uniqueOptions = 'Options must be unique!';
    }
  
    // Check if the answer matches one of the options
    if (!['option1', 'option2', 'option3', 'option4'].includes(answer)) {
      errors.invalidAnswer = 'Answer must be one of the options (option1, option2, option3, option4).';
    }
  
    return errors;
  };
  
  

  // Add a new quiz
  const handleAddQuiz = () => {
    if (questions.length >= 90) {
      alert('You can only create up to 90 quizzes.');
      return;
    }

    const newQuiz = {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: '',
      explanation: '', // Explanation is optional
    };

    setQuestions([...questions, newQuiz]);
  };
  const handlequizdescription = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    const newDescription = e.target.value;
    if (newDescription.length <= 420) {
      setquizdescription(newDescription);  // Update the description state
    }
  }
  const handleSubmitquiz = async (e) => {
    e.preventDefault();

    let isValid = true;
    let errorMessage = '';

    // Validate each quiz before submission
    for (let quiz of questions) {
      errorMessage = validateQuiz(quiz);  // Use your general validation function for all questions
      if (errorMessage) {
        isValid = false;
        break;
      }
    }

    // Check if there is a validation error
    if (!isValid) {
      alert(errorMessage);
      return;
    }

    if(quiztitle.length<=10){
      alert("make the title length more than 10 character.")
      return
    }
    if(quizdesccription.length<=50){
      alert("make the description length more than 50 character.")
      return
    }
    if (!quiztitle || !quizdesccription || !questions.length>0) {
      alert("Please fill out all fields and select files.");
      return;
    }
    setquizloading(true);
    if(quizloading){
      alert("file is uploading")
      return;
    }
  const body = {
  quiztitle,
  quizdesccription,
    quiz: questions.map((quiz) => ({
      question: quiz.question,
      option1: quiz.option1,
      option2: quiz.option2,
      option3: quiz.option3,
      option4: quiz.option4,
      answer: quiz.answer,
      explanation: quiz.explanation, // Include explanation in the saved data
    }))
  };
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${backendurl}/upload/file/quiz`, 
        body,
        {
          headers: {
            "Content-Type": "application/json", 
             Authorization: `Bearer ${token}`, 
          },
        }
      );
      setQuestions([])

      setquiztitle("") 
    
      setquizdescription("")
    } catch (error) {
      
      localStorage.removeItem("token"); // Remove invalid tokenc
     navigate("/login")

    }finally {
      // Set loading state to false after the process finishes
      setquizloading(false);
    }
  };
  const handlequiztitle = (e) => {
    const newtitle = e.target.value;
    if (newtitle.length <= 90) {
      setquiztitle(newtitle);
    }
  };
  const handlediscardquiz=(e)=>{
    setaddingquiz(false)
    setquiztitle("");
    setquizdescription("");
    setQuestions([])
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
        setUser(response.data.user)
    
      } catch (error) {
        localStorage.removeItem("token")
        navigate("/login");
      }
    };

    checkTokenAndFetchData();
  }, []);

const handleaddingquiz=(e)=>{
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to create a post.");
    return;
  }
  setaddingquiz(true)
}
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
          <div className="addquiztodisplayok" onClick={handleaddingquiz}>
            <FontAwesomeIcon icon={faPlus} className="addquiztodisplayokicon"/> <button className="addquiztodisplayokbutton">Add Quiz</button>
          </div>
          <input type="text" className="addingthequizandsearchthequizinput" placeholder="searchquiz..." onChange={handleSearch} value={searchQuery}/>
        </div>
      {addingquiz&&(
             <div className="quizsectionwheretodisplaytheseparatequiz">
     
          <div className="headerdivwhereinput">
           <div className="inputwhereimageandtitle">
            <img src={user.profile} alt="" className="imageofquizer"/> <input type="text" className="titleforthequiz" placeholder="add title of quiz" onChange={handlequiztitle} value={quiztitle}/>
           </div>
          </div>
          <div className="addquizdivtodisplay">
            <FontAwesomeIcon icon={faPlus} onClick={handleAddQuiz} className="plusiconforadd"/><button className="plusbuttonadd" onClick={handleAddQuiz}>add quiz</button>
          </div>
          <div className="quizbasediv">
  {questions.length > 0 && questions.map((quiz, index) => (
    <div
    className={`quizholderhamkohoni ${questionErrors[index] && Object.keys(questionErrors[index]).length ? 'error' : ''}`}
      key={index}
    >
      <div className="askingquestion">
        <FontAwesomeIcon icon={faHandPointRight} className="askingquestionicon"/>
        <input
          type="text"
          placeholder="Ask Your Question..."
          maxLength="270"
          value={quiz.question}
          onChange={(e) => handleInputChange(index, 'question', e.target.value)}
          className={`askingquestioninput ${questionErrors[index]?.emptyFields ? 'error-border' : ''}`}
        />
      </div>

      <div className="optionholderquiz">
        <input
          type="text"
          placeholder="Option 1"
          maxLength="120"
          value={quiz.option1}
          onChange={(e) => handleInputChange(index, 'option1', e.target.value)}
          className={`optionholderquizone ${questionErrors[index]?.uniqueOptions || questionErrors[index]?.emptyFields ? 'error-border' : ''}`}
        />
        <input
          type="text"
          placeholder="Option 2"
          maxLength="120"
          value={quiz.option2}
          onChange={(e) => handleInputChange(index, 'option2', e.target.value)}
          className={`optionholderquiztwo ${questionErrors[index]?.uniqueOptions || questionErrors[index]?.emptyFields ? 'error-border' : ''}`}
        />
        <input
          type="text"
          placeholder="Option 3"
          maxLength="120"
          value={quiz.option3}
          onChange={(e) => handleInputChange(index, 'option3', e.target.value)}
          className={`optionholderquiztwo ${questionErrors[index]?.uniqueOptions || questionErrors[index]?.emptyFields ? 'error-border' : ''}`}
        />
        <input
          type="text"
          placeholder="Option 4"
          maxLength="120"
          value={quiz.option4}
          onChange={(e) => handleInputChange(index, 'option4', e.target.value)}
          className={`optionholderquiztwo ${questionErrors[index]?.uniqueOptions || questionErrors[index]?.emptyFields ? 'error-border' : ''}`}
        />
        <input
          type="text"
          placeholder="Answer (option1, option2, option3, option4)"
          maxLength="50"
          value={quiz.answer}
          onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
          className={`optionholderquiztwo ${questionErrors[index]?.invalidAnswer ? 'error-border' : ''}`}
        />
      </div>

      <div className="explainationdiv">
        <input
          type="text"
          placeholder="Explanation (optional)"
          maxLength="270"
          value={quiz.explanation}
          onChange={(e) => handleInputChange(index, 'explanation', e.target.value)}
          className="explainationinput"
        />
      </div>
    </div>
  ))}
</div>

             {questions.length>0&&( <div className="inputwheredescription">
          <textarea name="" id="" onChange={handlequizdescription} placeholder="add your Description" required value={quizdesccription} className="inputwheredescriptiontext"></textarea>
           </div>)}
                  <div className="submitorcancelquiz">
                   <button className="submitquiz" onClick={handleSubmitquiz}>{quizloading ? "submitting..." : "submit"}</button> <button onClick={handlediscardquiz} className="cancelquiz">Cancel</button>
                  </div>
            </div>
           )}
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
