import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Edithome.css"
import axios from "axios";
const PlaylistComponent = ({ user, }) => {
  const [newPlaylist, setNewPlaylist] = useState([]);
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
    useEffect(() => {
      const fetchUserData = async () => {
        setLoadingpage(true);
        const initialLimit = window.innerWidth < 600 ? 9 : 12;
        const limit = page === 1 ? initialLimit : 5;
  
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          navigate('/login'); // Redirect if no token
          return;
        }
       if(loadingpage){
        return;
       }
        try {
          const response = await axios.post(`${backendurl}/playlists/playlistcreator`, {
            limit,
            excludeIds: newPlaylist.map((post) => post._id), // Exclude already fetched posts
          }, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
  
          const newPosts = response.data.datas;
          console.log(newPosts)
          if (page === 1) {
            setNewPlaylist(newPosts); // Replace old data with fresh posts
          } else {
            setNewPlaylist((prevData) => {
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
  // Open Edit Mode for a Playlist
  const editPlaylist = (index) => {
    const playlist = newPlaylist[index];
    setPlaylistTitle(playlist.title);
    setPlaylistNotes(playlist.notes);
    setPlaylistDescription(playlist.description);
    setEditIndex(index);
    setIsEditing(true);
  };

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
  
      // Make the PUT request to the backend
      const response = await axios.put(
        `${backendurl}/playlists/update/${newPlaylist[editIndex]._id}`,
        updatedPlaylist,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        const updatedPlaylists = [...newPlaylist];
        updatedPlaylists[editIndex] = { ...updatedPlaylists[editIndex], ...updatedPlaylist };
        setNewPlaylist(updatedPlaylists); // Update the state correctly
        setIsEditing(false);
      }
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
    }
  };
  
  // Get CSS class based on the note validity
  const getNoteClass = (noteId) => {
    const stringNoteId = noteId.toString();
    // Highlight invalid notes
    return invalidNotes.includes(stringNoteId) ? "invalid-note" : "note-item";
  };
  const deletePlaylist = async (e,id) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a playlist.");
        return;
      }
  
      const response = await axios.delete(`${backendurl}/playlists/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 200) {
        // Successfully deleted playlist, update the UI (remove from state)
        const updatedPlaylists = newPlaylist.filter(playlist => playlist._id !== id);
        setNewPlaylist(updatedPlaylists);
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Error deleting playlist.");
    }
  };
  
  return (
    <div className="playlist-container" onScroll={handleScroll}>
      {!isEditing ? (
        newPlaylist &&newPlaylist.length>0?
        newPlaylist.map((playlist, index) => (
          <div key={index} className="playlist">
            <div className="playlist-title">
              {user && <img src={user.profile} className="imageprofile"/>}
              <p className="playlisttitle">{playlist.title}</p>
              <button className="edit-btn" onClick={() => editPlaylist(index)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="edit-btn" onClick={(e) => deletePlaylist(e,playlist._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>

            <div className="notes-list">
              {playlist.notes.map((id, i) => (
                <div key={i} className={getNoteClass(id)}>
                   <button className="remove-btn">{id}</button>
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => editPlaylist(index)}
                  className="xmarkicon"
                />
                </div>
              ))}
            </div>

            <div className="playlist-description">
              <p className="renderdescription">{playlist.description}</p>
            </div>
          </div>
        )):(<div><p>create playlist</p></div>)
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
                <button className="remove-btn">{id}</button>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={() => removeNote(index)}
                  className="xmarkicon"
                />
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
        </div>
      )}

      
    </div>
  );
};

export default PlaylistComponent;
