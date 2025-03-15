import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faShare, faCamera, faBookOpenReader, faUpload, faDollar, faRightFromBracket, faHome, faNewspaper, faThumbsUp, faUser, faUserPlus, faCrown, faUsers, faHandPointRight, faArrowTrendUp, faHeart, faEllipsisVertical, faFileUpload, faUserEdit, faAdd, faCloudUploadAlt, faXmark, faNotesMedical, faFile, faCopy, faBook } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Profile.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { faHackerNewsSquare, faYoutube } from "@fortawesome/free-brands-svg-icons";
export default function Profile() {
  const [quiztitle, setquiztitle] = useState("");
  const [add, setadd] = useState(false);
  const [quizdesccription, setquizdescription] = useState("");
  const [image, setimage] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [postdata, setpostdata] = useState([]);
  const [thumbnail, setthumbanil] = useState();
  const [profileimage, setprofileimage] = useState();
  const [name, setname] = useState("");
  const [infodescription, setinfodescription] = useState("");
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const [post, setpost] = useState(false);
  const [totallikes, settotallikes] = useState(null)
  const [error, seterror] = useState("");
  const [profile, setprofile] = useState(false)
  const [user, setUser] = useState(null);
  const [quizloading, setquizloading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);  // Track the current page
  const [loadingpage, setLoadingpage] = useState(false);  // Track loading state  
  const navigate = useNavigate();
  const [addingquiz, setaddingquiz] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [userid, setUserid] = useState(null);
  const [youtubenotelink, setyoutubenotelink] = useState("");
  const [questionErrors, setQuestionErrors] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [postholder, setpostholder] = useState(true)
  const textareaRef = useRef([]);
  const [loadingpostquestion, setLoadingpostquestion] = useState(false);
  const [question, setquestion] = useState('');
  const [newspost, setnewspost] = useState(false);
  const [newimage, newsetimage] = useState([]);
  const [newselectedImage, newsetSelectedImage] = useState(null);
  const [newtitle, newsettitle] = useState("");
  const [newloading, newsetLoading] = useState(false);
  const [playlistIsOpen, setPlaylistIsOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistdescription, setPlaylistdescription] = useState("");
  const [playlistNotes, setPlaylistNotes] = useState([]);
  const [playlistNotesId, setPlaylistNotesId] = useState("");



  const addNote = () => {
    const trimmedId = playlistNotesId.trim();

    // Check if the ObjectId is valid and not a duplicate, and ensure the limit of 20
    if (
      trimmedId &&
      !playlistNotes.includes(trimmedId) && // Prevent duplicates
      /^[a-fA-F0-9]{24}$/.test(trimmedId) && // Validate ObjectId format
      playlistNotes.length < 21 // Limit to 20 notes
    ) {
      setPlaylistNotes([...playlistNotes, trimmedId]);
      setPlaylistNotesId(""); // Clear the input field after adding
    } else if (playlistNotes.length >= 21) {
      alert("You can only add up to 21 notes.");
    } else {
      alert("Please enter a valid ObjectId and don't repeat same notes.");
    }
  };

  const removeNote = (index) => {
    setPlaylistNotes(playlistNotes.filter((_, i) => i !== index));
  };
  const createPlaylist = () => {
    const trimmedTitle = playlistTitle.trim();
    const trimmeddescription=playlistdescription.trim();
    if (!trimmedTitle || playlistNotes.length === 0 || !trimmeddescription) {
      alert("Please enter a title , description and add at least one note.");
      return;
    }

    if (trimmedTitle.length > 90) {
      alert("The title must be less than 90 characters.");
      return;
    }
    if (trimmeddescription.length > 180) {
      alert("The description must be less than 180 characters.");
      return;
    }
    const playlistData = {
      title: playlistTitle,
      notes: playlistNotes,
      description:playlistdescription
    };

    console.log("Playlist Data:", playlistData);
    setPlaylistTitle("");
    setPlaylistNotes([]);
    setPlaylistNotesId("");
    setPlaylistdescription("")
  };

  const handleInput = (event) => {
    // Reset the height to auto to shrink if the text is deleted
    event.target.style.height = 'auto';
    // Set the height to match the scrollHeight (content height)
    event.target.style.height = `${event.target.scrollHeight}px`;
  };
 
  const handlecancel = (e) => {
    setquestion("")
    setadd(false)
    setpostholder(true)
  }
  const handleChange = (e) => {

    if (e.target.value.length <= 540) {
      setquestion(e.target.value);
    }
  };
  const handlesubmitquestion = async (e) => {
    e.preventDefault();

    if (question.length <= 10) {
      alert("Please ask a question longer than 10 characters.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }
    setLoadingpostquestion(true);
    if (loadingpost) {
      alert("question is uploading")
      return;
    }
    try {
      const body = {
        question
      }
      const response = await axios.post(`${backendurl}/posts`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setquestion("")
      textareaRef.current.style.height = '20px';

    } catch (error) {
      setquestion("")
      textareaRef.current.style.height = '20px';

    } finally {
      // Set loading state to false after the process finishes
      setLoadingpostquestion(false);
    }
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

  // Save the quiz data

  useEffect(() => {

    const checkTokenAndFetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // If no token, redirect to login page
        navigate("/login");
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
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingpage(true);
      const initialLimit = window.innerWidth < 600 ? 9 : 18;
      const limit = page === 1 ? initialLimit : 5;

      const token = localStorage.getItem('token'); // Get token from localStorage
      if (!token) {
        navigate('/login'); // Redirect if no token
        return;
      }
      try {
        const response = await axios.post(`${backendurl}/upload/file/people/profile/profiletoken`, {
          limit,
          excludeIds: postdata.map((post) => post._id), // Exclude already fetched posts
        }, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const newPosts = response.data.datas;

        if (page === 1) {
          setpostdata(newPosts); // Replace old data with fresh posts
        } else {
          setpostdata((prevData) => {
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
  }, [page, navigate]);
  const handlefilechange = (e) => {
    const files = Array.from(e.target.files);  // Convert FileList to array

    // Loop over each selected file
    files.forEach(file => {
      // Check if file type is valid
      if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {

        // Get the total file size by summing up the size of all files
        const newTotalSize = image.reduce((acc, currentImage) => acc + currentImage.file.size, 0) + file.size;

        const MAX_SIZE = 15 * 1024 * 1024;  // 15 MB in bytes

        // If the total size exceeds the limit, alert the user and stop further uploads
        if (newTotalSize > MAX_SIZE) {
          return;  // Stop here, no further action
        }

        // If size is valid, proceed with adding the file
        setimage((prev) => {
          const newImages = [...prev, { src: URL.createObjectURL(file), file }];
          if (selectedImage === null) {
            setSelectedImage(newImages[0]);
          }
          return newImages;
        });
      } else {
        alert("Only images,and PDFs are allowed.");
      }
    });

    // Clear the input field after selecting files
    e.target.value = "";
  };


  const handleImageClick = (image) => {
    setSelectedImage(image);
  };
  const handlequiztitle = (e) => {
    const newtitle = e.target.value;
    if (newtitle.length <= 90) {
      setquiztitle(newtitle);
    }
  };
  const handletitle = (e) => {
    const newtitle = e.target.value;
    if (newtitle.length <= 44) {
      settitle(newtitle);
    }
  };
  const handledescription = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    const newDescription = e.target.value;
    if (newDescription.length <= 420) {
      setdescription(newDescription);  // Update the description state
    }
  }
  const handlethumbnail = (e) => {
    const filethumbnail = e.target.files[0];
    if (!filethumbnail) return; // If no file is selected, do nothing

    // Check if the file is an image
    if (!filethumbnail.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (filethumbnail.size > 1048576) {
      alert("Please select an image within 1MB.");
      return;
    }
    if (filethumbnail && filethumbnail.type.startsWith("image/")) {
      const objecturl = URL.createObjectURL(filethumbnail);
      setthumbanil({ src: objecturl, filethumbnail });
    } else {
      alert("enter image only")
    }
  }
  const uploadToS3 = async (file) => {
    const fileExtension = file.name.split('.').pop();
    const objectKey = `${Date.now()}.${fileExtension}`;
    const s3Url = `https://quilkimages.s3.ap-south-1.amazonaws.com/${objectKey}`;

    try {
      // Upload the file to S3 with Cache-Control header for 1-year caching
      await axios.put(s3Url, file, {
        headers: {
          "Content-Type": file.type, // Set content type for the file
          "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        },
      });

      return s3Url; // Return the public URL of the uploaded file
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let errorMessage = '';

    // Validate each quiz before submission
    for (let quiz of questions) {
      errorMessage = validateQuiz(quiz);
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
    if (!title || !description || !thumbnail || image.length === 0) {
      alert("Please fill out all fields and select files.");
      return;
    }
    setLoading(true);
    if (loading) {
      alert("file is uploading")
      return;
    }
    const thumbnailUrl = await uploadToS3(thumbnail.filethumbnail);
    const imageUrls = [];
    for (let i = 0; i < image.length; i++) {
      const imageUrl = await uploadToS3(image[i].file);
      imageUrls.push(imageUrl);
    }
    const body = {
      title,
      description,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      youtubenotelink,
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
      navigate("/login"); // Redirect to login page if no token
      return;
    }

    try {
      const response = await axios.post(
        `${backendurl}/upload/file`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newpostdata = [response.data.data, ...postdata]
      setQuestions([])
      setpostdata(newpostdata); // Use spread operator with empty array as fallback
      settitle("");
      setdescription("");
      setimage([]);
      setyoutubenotelink("")
      setSelectedImage(null);
      setthumbanil(null);
    } catch (error) {
      alert(error)
      localStorage.removeItem("token"); // Remove invalid tokenc
      navigate("/login")

    } finally {
      // Set loading state to false after the process finishes
      setLoading(false);
    }
  };
  const handlecopypostid = (e, id) => {
    e.stopPropagation();
    const url = `${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
     
    setActivePost(null)
  }
  const handledeletepost = async (e, id) => {
    e.stopPropagation();
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      navigate('/login'); // Redirect if no token
      return;
    }
    try {
      const response = await axios.delete(`${backendurl}/upload/file/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const responseremaining = response.data.remainingPosts;
      const remainalso = responseremaining.reverse();
      setpostdata(remainalso)
      setActivePost(null)
    } catch (error) {
    }
  }

  
  const handleinfodiv = (e, id) => {
    e.stopPropagation();
    navigate(`/detail/review/${id}`)
  }
  const formatLikes = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
    return num.toString(); // Less than 1K, show the number as is
  };
  const handleprofilelink = (e, id) => {
    const url = `https://www.thequilk.com/profile/info/${id}`; // Construct the URL
    navigator.clipboard.writeText(url)
      .then(() => {
        alert(' profile link copied.Share it.');
      })
      .catch((error) => {
        console.error('Failed to copy the URL: ', error);
      });
  }
 
  const handleprofileimage = (e) => {
    const file = e.target.files[0];
    if (!file) return; // If no file is selected, do nothing

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > 1048576) {
      alert("Please select an image within 1MB.");
      return;
    }
    if (file.type.startsWith("image/")) {
      setprofileimage({ src: URL.createObjectURL(file), file });
    } else {
      alert("image only")
    }
  };
  const handlename = (e) => {
    if (e.target.value.length < 25) {
      setname(e.target.value)
    }
  };
  const handleinfodescription = (e) => {
    if (e.target.value.length < 100) {
      setinfodescription(e.target.value)
    }
  };
  const handlesubmitprofilechange = async (e) => {
    e.preventDefault();

    if (!profileimage || !name) {
      alert("Please fill out all profile and select names.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      navigate("/login"); // Redirect to login page if no token
      return;
    }
    const profileImageUrl = await uploadToS3(profileimage.file);
    try {
      const body = {
        profile: profileImageUrl,
        name,
        infodescription
      }
      const response = await axios.put(`${backendurl}/upload/file/update`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
      );
      setUser(response.data.user)
      setprofileimage()
      setname("")
      setinfodescription("")
    } catch (error) {
      seterror(error.response.data.message);
      setprofileimage()
      setname("")
    }
  };
  const handleclear = (e) => {
    setprofileimage()
    setname("")
    setinfodescription("")
    setprofile(false)
    setpostholder(true)
  }
  const handleScroll = (e) => {
    if(!postholder){
      return;
    };
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
    if (bottom && !loadingpage) {
      setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
    }
  };
  useEffect(() => {
    const fetchTotalLikes = async () => {
      if (!user || !user._id) return; // Ensure user is available

      try {
        const response = await axios.get(`${backendurl}/user/${user._id}/total-likes`);

        settotallikes(response.data.totalLikes);
      } catch (error) {
        console.error("Error fetching total likes:", error);
      }
    };

    fetchTotalLikes();
  }, [user,postholder,navigate]); // Runs when `user` is updated
  
  const handleImageLoad = (e) => {
    e.target.style.display = "block"; // Make the image visible as soon as it's loaded
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
  const handleyoutubenotelink = (e) => {
    const newyoutubenotelink = e.target.value;
    if (newyoutubenotelink.length <= 100) {
      setyoutubenotelink(newyoutubenotelink);  // Update the description state
    }
  }
  const handleSubmitquiz = async (e) => {
    e.preventDefault();
    let isValid = true;
    let errorMessage = '';

    // Validate each quiz before submission
    for (let quiz of questions) {
      errorMessage = validateQuiz(quiz);
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
    if (quiztitle.length < 10) {
      alert("title must be character more than 10");
      return
    }
    if (quizdesccription.length < 50) {
      alert("quizdescription must be 50 character.")
      return
    }
    if (!quiztitle || !quizdesccription || !questions.length > 0) {
      alert("Please fill out all fields and select files.");
      return;
    }
    setquizloading(true);
    if (quizloading) {
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
      navigate("/login"); // Redirect to login page if no token
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

    } finally {
      // Set loading state to false after the process finishes
      setquizloading(false);
    }
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
  const handleshowoption = (e, postId) => {
    e.stopPropagation();
    setActivePost((prev) => (prev === postId ? null : postId));
  };
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
  const handlediscardnews = (e) => {
    setnewspost(false)
    newsetimage([])
    newsetSelectedImage(null)
    newsettitle("")
    setpostholder(true)
  }
  const handleSubmitnews = async (e) => {
    e.preventDefault();

    if (!newtitle || newimage.length === 0) {
      alert("Please fill out all fields and select files.");
      return;
    }
    newsetLoading(true);
    if (newloading) {
      alert("file is uploading")
      return;
    }
    const imageUrls = [];
    for (let i = 0; i < newimage.length; i++) {
      const imageUrl = await uploadToS3(newimage[i].file); // Assuming you have the uploadToS3 function to get the S3 URL
      imageUrls.push(imageUrl);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
    
      return;
    }
    const body = {
      title:newtitle,
      images: imageUrls, // Sending array of URLs instead of files
    };
    console.log(body)
    try {
      const response = await axios.post(
        `${backendurl}/upload/file/news`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token in the headers
          },
        }
      );

      newsettitle("");
      newsetimage([]);
      newsetSelectedImage(null);
    } catch (error) {
   console.log(error)
    } finally {
      // Set loading state to false after the process finishes
      newsetLoading(false);
    }
  };
  const handlenewtitle = (e) => {
    const newtitle = e.target.value;
    if (newtitle.length <= 90) {
      newsettitle(newtitle);
    }
  };
  const handlenewchange = (e) => {
    const file = e.target.files[0];
  
    // Check if file type is valid
    if (file && (file.type.startsWith("image/"))) {
      const newTotalSize = newimage.reduce((acc, currentImage) => acc + currentImage.file.size, 0) + file.size;
  
      const MAX_SIZE = 2 * 1024 * 1024;  // 10 MB in bytes
  
      // If the total size exceeds 300MB, alert the user and stop further uploads
      if (newTotalSize > MAX_SIZE) {
          return;  // Stop here, no further action
      }
        if (newimage.length >= 2) {
          alert("this is short news section only upload two news images format.");
          return; // Stop further uploads
        }
  
        // If size is valid, proceed with adding the file
      newsetimage((prev) => {
            const newImages = [...prev, { src: URL.createObjectURL(file), file }];
            if (newselectedImage === null) {
              newsetSelectedImage(newImages[0]);
            }
            return newImages;
        });
  
        // Clear the input field after selecting a file
        e.target.value = "";
    } else {
        alert("please upload news images format.");
    }
  };
   const handleseenotes=(e)=>{
    setpostholder(true)
    setpost(false)
    setaddingquiz(false)
    setprofile(false)
    setadd(false)
    setnewspost(false)
    setPlaylistIsOpen(false);
   }
   const handlepost = (e) => {
    setpostholder(false)
    setpost(true)
    setaddingquiz(false)
    setprofile(false)
    setadd(false)
    setnewspost(false)
    setPlaylistIsOpen(false);
  }
  
  const handleseparatequiz = (e) => {
    setpostholder(false)
    setpost(false)
    setaddingquiz(true)
    setprofile(false)
    setadd(false)
    setnewspost(false)
    setPlaylistIsOpen(false);
  }
  const handleprofile = (e) => {
    setpostholder(false)
    setpost(false)
    setaddingquiz(false)
    setprofile(true)
    setadd(false)
    setnewspost(false)
    setPlaylistIsOpen(false);
  }
  const handleadd = (e) => {
    setpostholder(false)
    setpost(false)
    setaddingquiz(false)
    setprofile(false)
    setadd(true)
    setnewspost(false)
    setPlaylistIsOpen(false);
  }
  const handleaddnews=(e)=>{
    setpostholder(false)
    setpost(false)
    setaddingquiz(false)
    setprofile(false)
    setadd(false)
    setnewspost(true)
    setPlaylistIsOpen(false);
   }
  const handlediscardquiz = (e) => {
   
    setquiztitle("");
    setquizdescription("");
    setQuestions([])
   
  }
  const handlediscardpost = (e) => {
 
    settitle("");
    setdescription("");
    setimage([]);
    setyoutubenotelink("")
    setSelectedImage(null);
    setQuestions([])
    setthumbanil(null);
 
  }
  const toggleForm = () => {
    setPlaylistIsOpen(true);
    setpostholder(false)
    setpost(false)
    setaddingquiz(false)
    setprofile(false)
    setadd(false)
    setnewspost(false)
  };

  const resetForm = () => {
    setPlaylistTitle("");
    setPlaylistNotes([]);
    setPlaylistNotesId("");
    setPlaylistdescription("")
  };
  return (
    <div className="alwaysmain">
      <Helmet>
        <title>Manage Your Notes - TheQuilk</title>
        <meta name="description" content={`Manage and share notes by ${user?.name} on TheQuilk.`} />
        <meta property="og:title" content={`Manage Notes by ${user?.name}`} />
        <meta property="og:description" content={`Explore the notes uploaded by ${user?.name} on TheQuilk. Share, manage, and engage with ${user?.name}'s content.`} />
        <meta property="og:image" content={user?.profile} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={window.location.href} />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Manage Notes by ${user?.name}`} />
        <meta name="twitter:description" content={`Explore ${user?.name}'s uploaded notes, share them, or engage with their content on TheQuilk.`} />
        <meta name="twitter:image" content={user?.profile} />

        {/* SEO Keywords */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={`${user?.name} notes, ${user?.name} profile, ${user?.name} handwritten notes, ${user?.name} education , searchnotes, upload your note, uploadnotes,where can i find notes, where can i upload notes`} />
      </Helmet>
      <Navbar />
      <div className="modern">
        {questions.length <= 0 && (
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
        )}
        <div className="inputcontainterforall" onScroll={handleScroll}>
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
                <button className="followerbuttonsclass" onClick={handleprofile}>
                  Edit Profile
                </button>
                <button className="buttonsclass">followers</button>
                <button className="buttonsclass">likes</button>
                {user && <FontAwesomeIcon icon={faShare} className="shareclass" onClick={(e) => { handleprofilelink(e, user._id) }} />}
              </div>
            </div>
            <div className="mobileops">
            <div className="buttonholders" onClick={toggleForm}>
                <FontAwesomeIcon icon={faHome} />
                <button className="buttonsz">Manage Homes</button>
              </div>
            <div className="buttonholders" onClick={handleseenotes}>
                <FontAwesomeIcon icon={faBook} />
                <button className="buttonsz">Manage Notes</button>
              </div>
              <div className="buttonholders" onClick={handlepost} >
                <FontAwesomeIcon icon={faFileUpload} />
                <button className="buttonsz">Add Notes</button>
              </div>
              <div className="buttonholders" onClick={handleseparatequiz}>
                <FontAwesomeIcon icon={faPlus} />
                <button className="buttonsz">Add Quiz</button>
              </div>
              <div className="buttonholders" onClick={handleprofile}>
                <FontAwesomeIcon icon={faUserEdit} />
                <button className="buttonsz">Edit profile</button>
              </div>
              <div className="buttonholders" onClick={handleadd}>
                <FontAwesomeIcon icon={faUsers} />
                <button className="buttonsz">add disscussion</button>
              </div>
              <div className="buttonholders" onClick={handleaddnews}>
                <FontAwesomeIcon icon={faNewspaper} />
                <button className="buttonsz">Add Updates</button>
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
          {add && (<div className="bigdiv">
            <div className="imagediv">
              {user && (<img src={user.profile} alt="" className="imageprofile" onLoad={handleImageLoad} style={{ display: "none" }} />)}
              {user && (<p className="paragraph">{user.name}</p>)}
            </div>
            <textarea
              value={question}
              onChange={handleChange}
              className="auto-expand-textarea"
              onInput={handleInput}
              rows="1"
              placeholder="share your thought,question,stories and many more..."
              ref={textareaRef}
            />
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px",marginTop:"24px" }}><button className="cancel" onClick={handlecancel}>Cancel</button><button className="upload" onClick={handlesubmitquestion}>{loadingpostquestion ? "uploading..." : "upload"}</button></div>

          </div>)}
          {postholder && <div className="postholder" >
              
            {postdata.length > 0 ? (postdata && postdata.map((current, index) => {
              return (
                <div className="postdiv" key={index} onClick={(e) => { handleinfodiv(e, current._id) }}>

                  <div className="delete" onClick={(e) => handleshowoption(e, current._id)}>
                    <FontAwesomeIcon icon={faEllipsisVertical} className="trash" />
                  </div>
                  {activePost === current._id && ( // Show options only for the active post
                    <div className="showoption">
                      <button className="buttonoptionshow" onClick={(e) => { handledeletepost(e, current._id) }}>delete</button>
                      <button className="buttonoptionshow" onClick={(e) => { handlecopypostid(e, current._id) }}>copy id</button>
                    </div>
                  )}

                  <div className="show">
                    <img src={current.thumbnail} alt="Selected" className="showimage" onLoad={handleImageLoad} style={{ display: "none" }} />
                  </div>

                  <div className="title">
                    <p className="ptitle">{current.title}</p>
                  </div>

                </div>
              )
            })) : (<div><p className="wrongparagraph">Uff! Create Some Content</p></div>)}


          </div>}

          {post && (
            <div className="imagefilldiv">
              <div className="inputholder">
                <div className="inputpic">

                  {image.length > 0 ? (image.map((current, index) => (
                    <div key={index} className="divimage" onClick={() => handleImageClick(current)}>
                      {current.file.type.startsWith("image/") ? (<img src={current.src} alt="image not found" className="imageshow" />) : current.file.type.startsWith("video/") ? (<video autoPlay muted loop className="imageshow"><source src={current.src} type={current.file.type} /></video>) : (<iframe src={current.src} className="imageshow"></iframe>)}
                    </div>
                  ))) : (<div className="manager">
                    <div className="divimagetwo"><p className="uploadparagraph">Upload</p></div> <div className="divimagetwo"><p className="uploadparagraph">Upload</p></div>  <div className="divimagetwo"><p className="uploadparagraph">Upload</p></div>
                  </div>)}

                </div>
                <div className="inputselector">
                  <label htmlFor="inputid" className="label"><FontAwesomeIcon icon={faPlus} className="plus" /> </label>
                  <input type="file" name="file" id="inputid" className="inputclass" onChange={handlefilechange} required multiple />
                </div>
                <div className="showresult">
                  {selectedImage ? (
                    selectedImage.file.type.startsWith("video/") ? (
                      <video autoPlay muted loop className="bigshowvideo"  >
                        <source src={selectedImage.src} type={selectedImage.file.type} />

                      </video>
                    ) : selectedImage.file.type.startsWith("image/") ? (
                      <img src={selectedImage.src} alt="Selected" className="bigshowimage" />
                    ) : (<iframe src={selectedImage.src} allow="Selected" className="bigshowimage"></iframe>)
                  ) : (
                    <div className="showresultonly"></div>
                  )}
                  <div className="title">
                    <input type="text" className="titleinput" placeholder="Set Title" onChange={handletitle} value={title} required />
                  </div>
                </div>
              </div>
              {image.length > 0 && title.length > 4 &&
                <div className="detaildiv">
                  <div className="thumbnail">
                    <div className="uploadthumbnail">
                      {thumbnail ? <img src={thumbnail.src} alt="" className="imageclass" /> : (<div className="uploaded"><p className="paragraph">Upload Thumbnail</p> </div>)}
                    </div>
                    <div className="selectthumbnail">
                      <label htmlFor="selectthumbnail"><FontAwesomeIcon icon={faPlus} className="iconplus" /></label>
                      <input type="file" name="thumbnail" id="selectthumbnail" className="thumbnailinput" onChange={handlethumbnail} required />
                    </div>
                    <div className="description">
                      <textarea className="descriptioninput" placeholder="Set description of your notes...." onChange={handledescription} value={description} required />
                    </div>
                  </div>
                </div>
              }
              {image.length > 0 && title.length > 4 && (
                <div className="youtubelinktodisplay">
                  <FontAwesomeIcon icon={faYoutube} className="youtubeicon" /> <input type="text" value={youtubenotelink} placeholder="video link of note (optional) ..." className="youtubeinput" onChange={handleyoutubenotelink} />
                </div>
              )}
              {image.length > 0 && title.length > 4 && (
                <div className="quizbasediv">
                  <div className="addquizdiv" style={{ justifyContent: questions.length > 0 ? 'center' : 'flex-start' }}>
                    <div onClick={handleAddQuiz} className="iconquizbutton">  <FontAwesomeIcon icon={faPlus} className="iconquizdiv" />Attach Quiz</div>
                  </div>
                  {questions.length > 0 && questions.map((quiz, index) => (
                    <div
                      className={`quizholderhamkohoni ${questionErrors[index] && Object.keys(questionErrors[index]).length ? 'error' : ''}`}
                      key={index}
                    >
                      <div className="askingquestion">
                        <FontAwesomeIcon icon={faHandPointRight} className="askingquestionicon" />
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
              )}
              <div className="finish">
                <button className="button" onClick={handlediscardpost}>discard</button>
                <button className="button" onClick={handleSubmit}>{loading ? "Uploading..." : "Upload"}</button>
              </div>
            </div>)}
          {
            profile && (<div className="changediv">
              <label htmlFor="profile">
                {(profileimage ? (<img src={profileimage.src} alt="image" className="changeimage" />) : (<img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/473228719_2496064460600488_5606142966387708656_n-modified+(1).png"} className="changeimage" />))}
              </label>
              <label htmlFor="profile" className="labelicon">
                <FontAwesomeIcon icon={faCamera} className="cameraicon" />
              </label>
              <input type="file" name="" id="profile" className="profile" onChange={handleprofileimage} style={{ display: "none" }} />
              <input type="text" value={name} onChange={handlename} placeholder="newname" className="changenames" />
              <input type="text" value={infodescription} onChange={handleinfodescription} placeholder=" Set your Bio..." className="changeinfos" />
              {error && <p>{error}</p>}
              <div className="hello"> <button onClick={handlesubmitprofilechange} className="uploadbutton">upload</button> <button onClick={handleclear} className="uploadbutton">cancel</button></div>
            </div>)
          }
          {addingquiz && (
            <div className="quizsectionwheretodisplaytheseparatequiz">

              <div className="headerdivwhereinput">
                <div className="inputwhereimageandtitle">
                  <img src={user.profile} alt="" className="imageofquizer" /> <input type="text" className="titleforthequiz" placeholder="add title of quiz" onChange={handlequiztitle} value={quiztitle} />
                </div>
              </div>
              <div className="addquizdivtodisplay">
                <FontAwesomeIcon icon={faPlus} onClick={handleAddQuiz} className="plusiconforadd" /><button className="plusbuttonadd" onClick={handleAddQuiz}>add quiz</button>
              </div>
              <div className="quizbasediv">
                {questions.length > 0 && questions.map((quiz, index) => (
                  <div
                    className={`quizholderhamkohoni ${questionErrors[index] && Object.keys(questionErrors[index]).length ? 'error' : ''}`}
                    key={index}
                  >
                    <div className="askingquestion">
                      <FontAwesomeIcon icon={faHandPointRight} className="askingquestionicon" />
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
              {questions.length > 0 && (<div className="inputwheredescription">
                <textarea name="" id="" onChange={handlequizdescription} placeholder="add your Description" required value={quizdesccription} className="inputwheredescriptiontext"></textarea>
              </div>)}
              <div className="submitorcancelquiz">
                <button className="submitquiz" onClick={handleSubmitquiz}>{quizloading ? "submitting..." : "submit"}</button> <button onClick={handlediscardquiz} className="cancelquiz">Cancel</button>
              </div>
            </div>
          )}
          {newspost === true && (
           
              <div className="posting">
                <div className="inputholders">
                  <div className="inputpics">

                    {newimage.length > 0 ? (newimage.map((current, index) => (
                      <div key={index} className="divimages" onClick={() => handleImageClick(current)}>
                        {current.file.type.startsWith("image/") ? (<img src={current.src} alt="image not found" className="imageshows" />) : current.file.type.startsWith("video/") ? (<video autoPlay muted loop className="imageshows"><source src={current.src} type={current.file.type} /></video>) : (<iframe src={current.src} className="imageshows"></iframe>)}
                      </div>
                    ))) : (<div className="managers">
                      <div className="divimagetwos"><p className="uploadparagraphs">Upload</p></div> <div className="divimagetwos"><p className="uploadparagraphs">Upload</p></div>
                    </div>)}

                  </div>
                  <div className="inputselectors">
                    <label htmlFor="newid" className="label"><FontAwesomeIcon icon={faPlus} className="pluss" /> </label>
                    <input type="file" name="newsimage" id="newid" className="inputclasss" onChange={handlenewchange} required />
                  </div>
                  <div className="showresults">
                    {newselectedImage ? (
                      newselectedImage.file.type.startsWith("video/") ? (
                        <video autoPlay muted loop className="bigshowvideos"  >
                          <source src={newselectedImage.src} type={newselectedImage.file.type} />

                        </video>
                      ) : newselectedImage.file.type.startsWith("image/") ? (
                        <img src={newselectedImage.src} alt="Selected" className="bigshowimages" />
                      ) : (<iframe src={newselectedImage.src} allow="Selected" className="bigshowimages"></iframe>)
                    ) : (
                      <div className="showresultonlys"></div>
                    )}
                    <div className="titles">
                      <input type="text" className="titleinputs" placeholder="Set Title Of Updates" onChange={handlenewtitle} value={newtitle} required />
                    </div>
                  </div>
                </div>
                <div className="closeandadd">
                  <div className="close" onClick={handlediscardnews}>
                    <FontAwesomeIcon icon={faXmark} className="closeicon" />
                    <span className="discard">discard update</span>
                  </div>
                  <div className="publish" onClick={handleSubmitnews}>
                    <FontAwesomeIcon icon={faAdd} className="publishicon" />
                    <span className="publishadd">{newloading ? "publishing" : "publish update"}</span>
                  </div>
                </div>
             

            </div>
          )}
           
           {playlistIsOpen && (
        <div className="playlist">
          <div className="inputandheadingplaylist">
        {user && <img src={user.profile} alt="" className="playlistowner" />}
          <input
            type="text"
            placeholder="Playlist Title"
            value={playlistTitle}
            onChange={(e) => setPlaylistTitle(e.target.value)}
            className="inputplaylist"
            maxLength={90} 
          />
          </div>
          <div className="notes-list">
            {playlistNotes.map((id, index) => (
              <div key={index} className="note-item">
                <button className="remove-btn">
                {id}
                </button>
                <FontAwesomeIcon icon={faXmark} onClick={() => removeNote(index)} className="xmarkicon" />
              </div>
            ))}
          </div>
          <div className="notesobjectidcontainer">
            <input
              type="text"
              placeholder="Enter Note ID"
              value={playlistNotesId}
              onChange={(e) => setPlaylistNotesId(e.target.value)}
              className="objectidinput"
            />
            <button onClick={addNote} className="addbtn">
              Add
            </button>
          </div>
          <div className="inputdescriptionplaylist">
          <input type="text" 
          value={playlistdescription}
          onChange={(e) => setPlaylistdescription(e.target.value)}
          maxLength={180} 
          placeholder="description for playlist" className="descriptionplaylist"/>
          </div>
          <div className="btn-container">
            <button onClick={createPlaylist} className="save-btn">
              Save Playlist
            </button>
            <button onClick={resetForm} className="cancel-btn">
              Cancel Playlist
            </button>
          </div>
        </div>
      )}
         
        </div>
      </div>

    </div>
  )
}
