import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit, faTrash, faThumbsUp, faComment, faQuestion, faPlay } from "@fortawesome/free-solid-svg-icons";
import "./Edithome.css"
import axios from "axios";
const PlaylistComponent = ({ user, }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistNotes, setPlaylistNotes] = useState([]);
  const [playlistNotesId, setPlaylistNotesId] = useState("");
  const [invalidNotes, setInvalidNotes] = useState([]); // New state for invalid notes
  const [playlisterror, setPlaylisterror] = useState(""); // Error state for playlist update
  const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [loadingpage, setLoadingpage] = useState(false); 
    const [page, setPage] = useState(1); 
  const[loadingchange,setloadingchange]=useState(false)
  const[playlistthumbnail,setplaylistthumbnail]=useState(null)
   const[playlistholder,setplaylistholder]=useState([])
     const[loadinganotherid,setLoadinganotherid]=useState(false)
 // Store the fetched image
   const [favoritepost, setfavoritepost] = useState(null)
    useEffect(() => {
    if (!user._id) return;

    const fetchTotalLikes = async () => {
      try {
        const response = await axios.get(`${backendurl}/favorite/${user._id}/posts`);
    
        setfavoritepost(response.data.posts[0])
      } catch (err) {
        console.error("Error fetching total likes:", err.response || err);
      }
    };

    fetchTotalLikes();
  }, [user]);
  useEffect(() => {
    if (!user._id) return;
    const fetchUserData = async () => {
      setLoadingpage(true);
  
      const limit = page === 1 ? 3 : 2;
     
     if(loadingpage){
      return;
     }
      try {
        const response = await axios.post(`${backendurl}/playlists/playlistcreator/userhome/${user._id}`, {
          limit,
          excludeIds: playlistholder.map((post) => post._id), // Exclude already fetched posts
        });
        
        const newPosts = response.data.datas;
        if (page === 1) {
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
  }, [page,user,isEditing]);
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <= 100; // 100px tolerance before bottom
    if (bottom && !loadingpage) {
      setPage((prevPage) => prevPage + 1); // Increment page number when scrolled near to the bottom
    }
  };


   
  // Open Edit Mode for a Playlist
  const editPlaylist = (index) => {
    console.log("index",index)
    const playlist = playlistholder[index];
    const activeindex=playlist._id;
    setPlaylistTitle(playlist.title);
    const playlistnotes=playlist.notes.map((current,index)=>{
      return(current._id)
    })
    setPlaylistNotes(playlistnotes);
    setPlaylistDescription(playlist.description);
    setEditIndex(activeindex);
    setIsEditing(true);
    console.log("id",playlistnotes)
    console.log("title",playlist.title)
    console.log("description",playlist.description)
    console.log("changeindex",playlist._id)
  };//clear

  // Add New Note ID
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

  // Remove Note ID
  const removeNote = (index) => {
    const removedNote = playlistNotes[index];
    const updatedNotes = playlistNotes.filter((_, i) => i !== index);
    setPlaylistNotes(updatedNotes);

    // If the removed note is invalid, update the invalid notes state
    if (invalidNotes.includes(removedNote)) {
      const updatedInvalidNotes = invalidNotes.filter(note => note !== removedNote);
      setInvalidNotes(updatedInvalidNotes);

      // If there are no more invalid notes, clear the error message
      if (updatedInvalidNotes.length === 0) {
        setPlaylisterror(""); // Clear the error message when all invalid notes are removed
      }
    }
  };

  // Cancel Editing
  const cancelUpdate = () => {
    setIsEditing(false);
    setPlaylisterror("")
    setplaylistthumbnail(null)
  };

  // Handle Playlist Update (API Request)
  const submitUpdate = async (e) => {
   e.stopPropagation();
    const trimmedTitle = playlistTitle.trim();
    const trimmedDescription = playlistDescription.trim();
  
    if (!trimmedTitle || playlistNotes.length === 0 || !trimmedDescription) {
      alert("Please enter a title, description, and add at least one note.");
      return;
    }
  
    if (trimmedTitle.length > 90) {
      alert("The title must be less than 90 characters.");
      return;
    }
  
    if (trimmedDescription.length > 180) {
      alert("The description must be less than 180 characters.");
      return;
    }
  setloadingchange(true);
  if(loadingchange){
    alert("playlist is changing.")
    return;
  }
    try {
      const updatedPlaylist = {
        title: trimmedTitle,
        description: trimmedDescription,
        notes: playlistNotes,
      };
  
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${backendurl}/playlists/update/${editIndex}`,
        updatedPlaylist,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
     
        setIsEditing(false);
        setPlaylisterror("")
      
    } catch (error) {
      if (error.response) {
        setPlaylisterror(error.response.data.message);
        if (error.response.data.invalidNotes) {
          const invalidNoteStrings = error.response.data.invalidNotes.map(note => note.toString());
          setInvalidNotes(invalidNoteStrings);
        }
      } else {
        console.error("Error without response", error);
      }
    }finally {
     setloadingchange(false);
     setplaylistthumbnail(null)
    }
  };
  
  // Get CSS class based on the note validity
  const getNoteClass = (noteId) => {
    const stringNoteId = noteId.toString();
    // Highlight invalid notes
    return invalidNotes.includes(stringNoteId) ? "invalid-note" : "note-item";
  };
  const deletePlaylist = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a playlist.");
        return;
      }
  
      const response = await axios.delete(`${backendurl}/playlists/delete/${editIndex}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedplaylistdata = playlistholder.filter(playlistholder => playlistholder._id !== id);
      setplaylistholder(updatedplaylistdata)

        // 
        setIsEditing(false)
      
    } catch (error) {
      setIsEditing(false)
    }
  };
  const handlegetthumbnail = async (e,id) => {
    e.stopPropagation();
    try {
    
  
      const response = await axios.get(`${backendurl}/playlist/show/${id}`);
  
     setplaylistthumbnail(response.data.postdata.thumbnail)
    } catch (error) {
      alert("i think this notes object id isnot valid.please check it out.");
    }
  };
  const formatLikes = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B"; // Billions
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"; // Millions
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"; // Thousands
    return num.toString(); // Less than 1K, show the number as is
  };
  const handleleftscroll = async (e,index) => {
    const rightEnd = e.target.scrollWidth - e.target.scrollLeft - e.target.clientWidth <= 10; // 10px tolerance before the right end
    if (rightEnd && !loadinganotherid) {
      setLoadinganotherid(true);
      const activePlaylist = playlistholder[index];
     
      const excludedIds = activePlaylist.notes.map((note) => note._id);
 
      try {
        const res = await axios.post(`${backendurl}/playlist/remainingid/${activePlaylist._id}`, {
          excludedId: excludedIds,  // Send already fetched image URLs
        });
        console.log(res.data)
        if (res.data.length > 0) {
          // Add new notes to the active playlist
          setplaylistholder((prev) => {
            const updatedPlaylists = [...prev];
            updatedPlaylists[index] = {
              ...updatedPlaylists[index],
              notes: [...updatedPlaylists[index].notes, ...res.data],
            };
            return updatedPlaylists;
          });
        }

      } catch (error) {
        console.error('Error loading more images', error);
      } finally {
        setLoadinganotherid(false);
      }
    }
  };
  return (
    <div className="playlist-container" onScroll={handleScroll}>
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
       
      {!isEditing ? (
      
        <div>
          {playlistholder && playlistholder.length>0 &&(
                        <div className="recommendiationdiv" style={{marginTop:"5px",display:"flex",alignItems:"center"}}>
                          <p className="recommendiationpara">Userplaylists</p>
                          <FontAwesomeIcon icon={faPlay} style={{marginLeft:"6px"}}/>
                        </div>
                      )}
          {playlistholder && playlistholder.length>0 && playlistholder.map((playlist,id)=>{
          return(
            <div key={id} className="justrandomlycoming">
            {playlist.notes && playlist.notes.length>0 &&(
              <div key={id} className="playlistholdingdiv">
         <div className="playlisttitlehomediv">
         <p className="playlisttitlehome">{playlist.title}</p>
         </div>
        
         <div className="notesofplaylistholder" onScroll={(e)=>{handleleftscroll(e,id)}}>
         {playlist.notes && playlist.notes.length>0&& playlist.notes.map((current,index)=>{
          return(
            <div key={index} className="holderofplaylistnote">
              <FontAwesomeIcon
          icon={faEdit}
          onClick={() => editPlaylist(id)}
          className="editofplaylistnoteicon"
        />
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
          </div>

      ) : (
        <div className="playlist">
          <div className="inputandheadingplaylist">
            {user && <img src={user.profile} alt="" className="playlistowner" />}
            <input
              type="text"
              placeholder="Change title"
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              className="inputplaylist"
              maxLength={90}
            />
          </div>
          <div className="notes-list">
            {playlistNotes.map((id, index) => (
              <div key={index} className={getNoteClass(id)}>
                <button className="remove-btn" onClick={(e)=>{handlegetthumbnail(e,id)}}>{id}</button>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={() => removeNote(index)}
                  className="xmark-icon"
               
                />
              </div>
            ))}
          </div>
          {playlistthumbnail && 
         <div className="thumbnailplaylistpic">
           <img src={playlistthumbnail} alt="" className="playlisthumbnailpic" />
          </div>
          } 
          <div className="notesobjectidcontainer">
            <input
              type="text"
              placeholder="Enter Note ID"
              value={playlistNotesId}
              onChange={(e) => setPlaylistNotesId(e.target.value)}
              className="objectidinput"
            />
            <button onClick={addNote} className="addbtn">Add</button>
          </div>

          <div className="inputdescriptionplaylist">
            <input
              type="text"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              maxLength={180}
              placeholder="New description for playlist"
              className="descriptionplaylist"
            />
          </div>
          {playlisterror && <div className="errorplaylist">
          <p className="perrorplaylist">{playlisterror}</p>
          </div>}
          <div className="btn-container">
            <button onClick={submitUpdate} className="save-btn">{loadingchange?"uploading":"submitUpdate"}</button>
            <button onClick={cancelUpdate} className="cancel-btn">Cancel</button>
          </div>
          <div className="orbuttonfordelete">
            <p className="porbutton">Or</p>
          </div>
          <div className="deletesection">
            <div className="deletedivplaylist" onClick={deletePlaylist}>
          <button className="delete-btn">Delete Playlist</button>
          <FontAwesomeIcon className="xmark-icon" icon={faXmark}/>  
          </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default PlaylistComponent;
