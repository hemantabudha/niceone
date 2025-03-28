import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faHeart, faUsers, faThumbsUp, faArrowTrendUp, faNewspaper, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import { useState,useEffect } from 'react';
import axios from 'axios';
export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [searchClicked, setSearchClicked] = useState(false); // Track if search is clicked
  const navigate = useNavigate();
  const [page, setPage] = useState(1);  // Track the current page
  const [loading, setLoading] = useState(false);  // Track loading state
  const [postdata, setpostdata] = useState([]);
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const [isOpen, setIsOpen] = useState(false);
  const[userid,setUserid]=useState(null)
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchValue.length > 0) {
      navigate(`/search?query=${searchValue}`);
      setSearchValue("");
    }
  };

  const handleSearchClick = () => {
    if (searchValue.length > 0) {
      navigate(`/search?query=${searchValue}`);
      setSearchValue("");
    }
  };

  const handleSearchIconClick = () => {
    setSearchClicked(true); // Show search input and hide other icons
  };

  const handleHomeLogoClick = () => {
    setSearchClicked(false); // Hide search input and show other icons
  };
  const handleScroll = (e) => {
    // Check if we're near the bottom of the scroll container
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 10;
  
    // Increment page only if not already loading and if we're at the bottom
    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading) return; // Prevent multiple fetches
  
      setLoading(true);
  
      const limit = page === 1 ? 10 : 5; // First page fetches 25, others fetch 5
  
      try {
        const response = await axios.post(`${backendurl}/search`, {
          query: searchValue, // Search query
          limit,
          page
        });
  
        const newPosts = response.data.datas;
        if (newPosts.length === 0) {
          setpostdata([]); // Clear postdata if no posts found
          setPage(1)
          return; // Exit to avoid appending empty posts
        }
        if (page === 1) {
          setpostdata(newPosts); // Replace old data with fresh posts
        } else {
          setpostdata((prevData) => [...prevData, ...newPosts]); // Append for pagination
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, [page, searchValue])
  const handledetail=(e,postid)=>{
    e.stopPropagation();
    navigate(`/detail/review/${postid}`)
    setSearchValue("")
  }
  const handlesignout=(e)=>{
    localStorage.removeItem('token')
    navigate("/login")
  }
  const handletrend=(e)=>{
    navigate("/trending")
  }
  const handleyournews=(e)=>{
    const token = localStorage.getItem("token");
    if(token && userid){
      navigate(`/profile/news/${userid}`)
    }else{
      alert("login to see your news.")
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
  const handletermandcondition=(e)=>{
    navigate("/terms-and-conditions")
  }
  
  const handlefollowing=(e)=>{
    const token = localStorage.getItem("token");
    if(token && userid){
      navigate(`/follower/${userid}`)
    }else{
      alert("login to see your following user.")
    }
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
  return (
    <div className="navbarmain">
    <div className="navbar">
      <div className="start">
        {/* Home Logo */}
        <Link 
          to="/" 
          className={`link ${searchClicked ? 'show' : ''}`} 
          onClick={handleHomeLogoClick}  // Add handler for Home logo click
        > 
          <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/Untitled%2BProject-removebg.png" alt="Home Logo" className="image" />
        </Link>

        {/* Wishlist Heart Icon */}
        <Link to="/quiz" className={`link ${searchClicked ? 'hide' : ''}`}>
        <img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png"} alt="News" className="newimage" />
        </Link>
      </div>

      <div className="middle">
        {/* News Logo */}
        <Link to="/news" className={`link ${searchClicked ? 'hide' : ''}`}>
          <div className="newsdiv">
            <img src={"https://thequilkads.s3.ap-south-1.amazonaws.com/newslogo.png"} alt="News" className="newimage" />
          </div>
        </Link>

        {/* Search Input */}
        <input
          type="text"
          className={`input ${searchClicked ? 'show-input' : ''}`}
          placeholder="Search here..."
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />

        {/* Search Icon */}
        <div
          className={`searchdiv ${searchClicked ? 'show' : ''}`}
          onClick={handleSearchIconClick}
        >
          <FontAwesomeIcon icon={faSearch} className="search" onClick={handleSearchClick}/>
        </div>
      </div>

      <div className="end">
        {/* People Icon */}
        <Link to="/people" className={`link ${searchClicked ? 'hide' : ''}`}>
          <FontAwesomeIcon icon={faUsers} className="users" />
        </Link>

        {/* Profile Icon */}
        <Link to="/profile" className={`link ${searchClicked ? 'hide' : ''}`}>
          <FontAwesomeIcon icon={faUser} className="user"  onMouseEnter={() => setIsOpen(true)}  onMouseLeave={() => setIsOpen(false)}/>
        </Link>
      </div>
    </div>
   {postdata.length>0&&
   <div className="searchthing" onScroll={handleScroll}>
     {postdata.length>0&& (postdata.map((current,index)=>{
     return(
     <div className="herodiv" key={index} onClick={(e)=>{handledetail(e,current._id)}}>
      <img src={current.createdBy.profile} alt="" className='heroimage'/>
      <p className='herotitle'>{current.title}</p>
     </div>
    )
     }))}
    </div>
   } 
    {isOpen && (
        <div
          className="menu-list"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <button className="menu-item" onClick={handlewishlist}>
            <FontAwesomeIcon icon={faHeart} className="menuicon" />
            <span className='spantext'>Wishlist</span>
          </button>

          <button className="menu-item" onClick={handlelikenote}>
            <FontAwesomeIcon icon={faThumbsUp} className="menuicon" />
            <span className='spantext'>Like Notes</span>
          </button>
          
          <button className="menu-item"  onClick={handlefollowing}>
            <FontAwesomeIcon icon={faUsers} className="menuicon" />
            <span className='spantext'>Following</span>
          </button>
          <div className="menu-item" onClick={handleyourquiz}>
                  <img src="https://thequilkads.s3.ap-south-1.amazonaws.com/quiz_8940669+(1)-modified.png" alt="" className="menuicon"/>
                   <span className="spantext">Your Quiz</span>
    </div>
          <button className="menu-item" onClick={handletrend}>
            <FontAwesomeIcon icon={faArrowTrendUp} className="menuicon" />
            <span className='spantext'>Trending Notes</span>
          </button>

          <button className="menu-item" onClick={handleyournews}>
            <FontAwesomeIcon icon={faNewspaper} className="menuicon" />
            <span className='spantext'>Your News</span>
          </button>

          <button className="menu-item" onClick={handleyourdisscussion}>
            <FontAwesomeIcon icon={faUsers} className="menuicon" />
            <span className='spantext'>Your Discussions</span>
          </button>
          <button className="menu-item" onClick={handletermandcondition}>
           
            <span className='spantext'>terms and conditions</span>
          </button>

          <button className="menu-item signout" onClick={handlesignout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="menuicon" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}