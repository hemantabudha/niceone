import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"
import validator from 'validator';
import awsServerlessExpress from 'aws-serverless-express';
const app = express();
dotenv.config()
const allowedOrigin = 'https://www.thequilk.com';
app.use(cors({}));
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (origin && origin === allowedOrigin) {
//     // Allow the request to pass through to the CORS middleware
//     res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   } else {
//     // Reject requests from other origins
//     return res.status(403).json({ error: 'Forbidden' });
//   }
//   next();
// });
app.use(express.urlencoded({extended:false}));
app.use(express.json());
const dbURI = 'mongodb+srv://budhahemanta03:budhahemanta03password@cluster0.5fy1w.mongodb.net/myDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
})
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });
//database
const homeads=[
  {
    imgsrc: "https://thequilkads.s3.ap-south-1.amazonaws.com/Screenshot+(124).png",  // Use the static path
    title: "if you want to put ads on these website then contact above.",
    profileimage: "https://thequilkads.s3.ap-south-1.amazonaws.com/Screenshot+(124).png",  // Use the static path
    links: "https://www.thequilk.com/",
  }
];
 const otherads= [
    {
      imgsrc: "https://thequilkads.s3.ap-south-1.amazonaws.com/Screenshot+(124).png",
      links:"https://www.thequilk.com/"
    }
   ];
 //schema

 const newSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [String],  
    required: true,  
  },likesCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user',  
    required: true,
  },
}, { timestamps: true });
const newmodel=mongoose.model("news",newSchema);
const QuizResultsSchema = new mongoose.Schema({
  timeTaken: {
    type: Number, // in seconds
    required: true
  },
  correctAnswers: {
    type: Number, // total number of correct answers
    required: true
  },
  incorrectAnswers: {
    type: Number, // total number of incorrect answers
    required: true
  },
  negativeMarks: {
    type: Number, // total negative marks for wrong answers
    required: true
  },
  totalScore: {
    type: Number, // total score calculated after applying negative marks
    required: true
  },
  postid:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"post"
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // assuming User is the model for the user collection
    required: true
  }
}, { timestamps: true }); // to track creation and update timestamps
const quizresultmodel=mongoose.model("quizresult",QuizResultsSchema);
 const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,  
  },
  notelink:{
    type: String
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,  // Count of comments on the post
  },
  quiz: [{
    question: {
      type: String,
      required: true,
    },
    option1: {
      type: String,
      required: true,
    },
    option2: {
      type: String,
      required: true,
    },
    option3: {
      type: String,
      required: true,
    },
    option4: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: false,
    }
  }],
  images: {
    type: [String],  
    required: true,  
  },createdBy: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user',  
    required: true,
  },
}, { timestamps: true });
const postmodel=mongoose.model("post",postSchema);
const realquizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  totalsubmitted: {
    type: Number,
    default: 0,
  },
  quizlength: {
    type: Number,
    default: 0,
  },
  quiz: [{
    question: {
      type: String,
      required: true,
    },
    option1: {
      type: String,
      required: true,
    },
    option2: {
      type: String,
      required: true,
    },
    option3: {
      type: String,
      required: true,
    },
    option4: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: false,
    }
  }],
 createdBy: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user',  
    required: true,
  },
}, { timestamps: true });
const realquizmodel=mongoose.model("realquiz",realquizSchema);
const postcommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // Reference to the user who commented
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",  // Reference to the post being commented on
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const postcommentmodel=mongoose.model("postcomment",postcommentSchema)
const userSchema=new mongoose.Schema({
  profile:{
    type: String,
    required: true,
  },
  name:{
    type:String,
    required:true,
  },
  description:{
   type:String
  },
  email:{
    type:String,
    required:true
  },
  education:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  followercounts: {
    type: Number,
    default: 0,
  }
},{timestamps:true})
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      // Hash the password with bcrypt
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
const usermodel=mongoose.model("user",userSchema)
const wishlistSchema=new mongoose.Schema({
wishlistby:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"user"
},
postid:{
  type:mongoose.Schema.Types.ObjectId,
  required:true,
  ref:"post"
}
},{timestamps:true})
const wishlistmodel=mongoose.model("wishlist",wishlistSchema)

const newslikeschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // Reference to the user who liked the news
    required: true,
  },
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'news',  // Reference to the news article
    required: true,
  },
}, { timestamps: true });

const newslikemodel = mongoose.model('newslike', newslikeschema)
const postlikeschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  // Reference to the user who liked the post
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',  // Reference to the post
    required: true,
  },
}, { timestamps: true });
const followerSchema = new mongoose.Schema({
  followerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // The user who is following
    required: true,
  },
  followingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // The user who is being followed
    required: true,
  },
}, { timestamps: true });

const followermodel = mongoose.model("Follower", followerSchema);
const postlikemodel = mongoose.model('postlike', postlikeschema);
//multer
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // Reference to the user who posted the question
    required: true,
  },
  likesCount: {
    type: Number,
    default: 0,  // Count of likes on the post
  },
  dislikesCount: {
    type: Number,
    default: 0,  // Count of dislikes on the post
  },
  commentsCount: {
    type: Number,
    default: 0,  // Count of comments on the post
  },
}, { timestamps: true });

const questionmodel=mongoose.model("question",questionSchema)
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // Reference to the user who commented
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question",  // Reference to the post being commented on
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });
const commentmodel=mongoose.model("comment",commentSchema)
const likequestion= new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // Reference to the user who liked
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question",  // Reference to the post that was liked
    required: true,
  },
}, { timestamps: true });
const likequestionmodel=mongoose.model("likequestion",likequestion)
const dislikequestion= new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",  // Reference to the user who liked
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "question",  // Reference to the post that was liked
    required: true,
  },
}, { timestamps: true });
const dislikequestionmodel=mongoose.model("dislikequestion",dislikequestion)

app.post('/posts', async (req, res) => {
   const { question} = req.body;
   
  const token = req.headers["authorization"]?.split(" ")[1];  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;  
  try {
    const newPost = new questionmodel({
      question,
      user: userId,  // User who is posting the question
    });

    await newPost.save();
    // Populate the user field to include name and profile
    const populatedPost = await questionmodel.findById(newPost._id)
      .populate("user", "name profile _id");
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
});
// Route to get comments for multiple questions
// Route to get comments for a specific post with pagination
app.post('/question/:id/comment/bits', async (req, res) => {
  const { id } = req.params;
  let { limit = 12, page = 1 } = req.body;

  try {
    limit = Number(limit);
    page = Number(page);
    const comments = await commentmodel.aggregate([
      {
        $match: {
          post: new mongoose.Types.ObjectId(id), // Match comments for the specific post
        },
      },
      { $sort: { createdAt: -1 } }, // Sort newest first
      { $skip: (page - 1) * limit }, // Skip comments based on the current page
      { $limit: limit }, // Limit the number of comments per request
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Unwind the user array
      {
        $project: {
          _id: 1,
          text: 1,
          createdAt: 1,
          user: { name: 1, profile: 1,_id:1}, // Project only necessary fields
        },
      },
    ]);



    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Error fetching comments" });
  }
});




app.post('/posts/:postId/comments', async (req, res) => {
  const { text } = req.body;
  const { postId } = req.params;

  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);  // Replace with your secret key
    const userId = decoded.userId;  // Assuming you store userId in the token

    // Create the new comment
    const newComment = new commentmodel({
      text,
      user: userId,  // Associate the comment with the userId
      post: postId,  // Link the comment to the post
    });

    await newComment.save();
    const populatedComment = await commentmodel.findById(newComment._id).populate('user', 'name profile _id');
    // Use findByIdAndUpdate to update the post with the new comment and increment the comment count
    const updatedPost = await questionmodel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment._id },  // Add the new comment's ID to the comments array
        $inc: { commentsCount: 1 },  // Increment the comment count
      },
      { new: true }  // Return the updated post
    );

    res.status(201).json(populatedComment);  // Respond with the new comment
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error posting comment', error });
  }
});

app.post("/posts/user/bits/:fetchid", async (req, res) => {
  const userId  =req.params.fetchid;

  try {
    const page = parseInt(req.body.page) || 1; // Default page 1
    const limit = page === 1 ? 12 : 3; // Fetch 6 posts first, then 3 per request
    const excludeIds = req.body.excludeIds ? req.body.excludeIds.map(id => new mongoose.Types.ObjectId(id)) : []; // Exclude already fetched posts

    const posts = await questionmodel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId), // Match only user's posts
          _id: { $nin: excludeIds } // Exclude already sent posts
        }
      },
      { $sort: { createdAt: -1 } }, // Sort by newest first
      { $limit: limit }, // Fetch only required number of posts
      {
        $lookup: {
          from: "users", // Fetch user details
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, // Flatten user details
      {
        $lookup: {
          from: "comments", // Fetch related comments
          localField: "_id",
          foreignField: "post",
          as: "comments"
        }
      },
      {
        $lookup: {
          from: "users", // Fetch commenter details
          localField: "comments.user",
          foreignField: "_id",
          as: "commentUsers"
        }
      },
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$commentUsers",
                        as: "cu",
                        cond: { $eq: ["$$cu._id", "$$comment.user"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          question: 1,
          likesCount: 1,
          dislikesCount: 1,
          commentsCount: { $size: "$comments" },
          user: { name: 1, profile: 1, _id: 1 }, // Only include name, profile, and _id
          createdAt: 1,
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: { name: "$$comment.user.name", profile: "$$comment.user.profile", _id: "$$comment.user._id" } // Exclude sensitive fields
              }
            }
          }
        }
      }
    ]);

    res.json({
      datas: posts,
      message: "User posts with comments fetched successfully",
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.post("/posts/all/bits", async (req, res) => {
  

  try {
 

    // Pagination: Page 1 fetches 6 posts, subsequent pages fetch 3 posts each.
    const page = parseInt(req.body.page) || 1;
    const limit = page === 1 ? 12 : 3;
    // Convert any already-fetched post IDs to ObjectIds
    const excludeIds = req.body.excludeIds
      ? req.body.excludeIds.map(id => new mongoose.Types.ObjectId(id))
      : [];

    // Aggregation pipeline:
    const posts = await questionmodel.aggregate([
      // Match all posts while excluding any that the client already has
      {
        $match: {
          _id: { $nin: excludeIds }
        }
      },
      // Add a random field to each document
      {
        $addFields: { random: { $rand: {} } }
      },
      // Sort by the random field so that the order is randomized each time
      {
        $sort: { random: 1 }
      },
      // Limit the number of posts for pagination
      { $limit: limit },
      // Lookup user details for each post
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      // Lookup related comments for each post
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "post",
          as: "comments"
        }
      },
      // Lookup details for each comment's user
      {
        $lookup: {
          from: "users",
          localField: "comments.user",
          foreignField: "_id",
          as: "commentUsers"
        }
      },
      // Restructure the comments to include the commenter's details
      {
        $addFields: {
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$commentUsers",
                        as: "cu",
                        cond: { $eq: ["$$cu._id", "$$comment.user"] }
                      }
                    },
                    0
                  ]
                }
              }
            }
          }
        }
      },
      // Project only the fields you want to send back
      {
        $project: {
          _id: 1,
          question: 1,
          likesCount: 1,
          dislikesCount: 1,
          commentsCount: { $size: "$comments" },
          user: { name: 1, profile: 1, _id: 1 }, // Only include name, profile, and _id
          createdAt: 1,
          comments: {
            $map: {
              input: "$comments",
              as: "comment",
              in: {
                _id: "$$comment._id",
                text: "$$comment.text",
                createdAt: "$$comment.createdAt",
                user: { name: "$$comment.user.name", profile: "$$comment.user.profile", _id: "$$comment.user._id" } // Exclude sensitive fields
              }
            }
          }
        }
      }
    ]);

    res.json({
      datas: posts,
      message: "All posts fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Error fetching posts" });
  }
});



app.post('/posts/likes/:postId', async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  const session = await mongoose.startSession();  // Start a Mongoose session
  session.startTransaction(); 

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decoded.userId; 
    const post = req.params.postId;


    // Check if the user has already liked this post
    const existingLike = await likequestionmodel.findOne({ user, post }).session(session);
   
    if (existingLike) {
      // If the user has liked the post, "unlike" it
      await likequestionmodel.findOneAndDelete({ user, post }).session(session);

      // Decrement the likes count of the post
      const updatedPost = await questionmodel.findByIdAndUpdate(post, { $inc: { likesCount: -1 } }, { new: true, session })
        .populate("user", "profile name");  // Populate user information
      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully unliked the post", updatedPost });
    } else {
      // If the user has not liked the post yet, "like" it
      const like = new likequestionmodel({ user, post });
      
      await like.save({ session });

      // Increment the likes count of the post
      const updatedPost = await questionmodel.findByIdAndUpdate(post, { $inc: { likesCount: 1 } }, { new: true, session })
        .populate("user", "profile name");  // Populate user information

      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully liked the post", updatedPost });
    }
  } catch (error) {
    await session.abortTransaction();  // Rollback if there's an error
    
    res.status(500).json({ error: 'An error occurred while toggling like on the post.', details: error.message });
  } finally {
    session.endSession();  // End the session
  }
});
app.post('/posts/dislikes/:postId', async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  const session = await mongoose.startSession();  // Start a Mongoose session
  session.startTransaction(); 

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = decoded.userId; 
    const post = req.params.postId;


    // Check if the user has already liked this post
    const existingLike = await dislikequestionmodel.findOne({ user, post }).session(session);
   
    if (existingLike) {
      // If the user has liked the post, "unlike" it
      await dislikequestionmodel.findOneAndDelete({ user, post }).session(session);

      // Decrement the likes count of the post
      const updatedPost = await questionmodel.findByIdAndUpdate(post, { $inc: { dislikesCount: -1 } }, { new: true, session })
        .populate("user", "profile name");  // Populate user information
      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully unliked the post", updatedPost });
    } else {
      // If the user has not liked the post yet, "like" it
      const like = new dislikequestionmodel({ user, post });
      
      await like.save({ session });

      // Increment the likes count of the post
      const updatedPost = await questionmodel.findByIdAndUpdate(post, { $inc: { dislikesCount: 1 } }, { new: true, session })
        .populate("user", "profile name");  // Populate user information

      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully liked the post", updatedPost });
    }
  } catch (error) {
    await session.abortTransaction();  // Rollback if there's an error
    
    res.status(500).json({ error: 'An error occurred while toggling like on the post.', details: error.message });
  } finally {
    session.endSession();  // End the session
  }
});
app.post("/follow/:userId", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  const session = await mongoose.startSession();  // Start a Mongoose session
  session.startTransaction(); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const followerId = decoded.userId;  
    const followingId = req.params.userId;  

    // Prevent users from following themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if the user already follows the other user
    const existingFollow = await followermodel.findOne({ followerId, followingId }).session(session);

    if (existingFollow) {
      // If already following, unfollow the user
      await followermodel.findOneAndDelete({ followerId, followingId }).session(session);

      // Decrease the follower count
      const user = await usermodel.findByIdAndUpdate(followingId, { $inc: { followercounts: -1 } }, { new: true, session }).select('_id name profile followercounts description');

      // Commit the transaction after everything is successful
      await session.commitTransaction();

      return res.status(200).json({ user, message: "Unfollowed successfully" });
    } else {
      // If not following, follow the user
      const follow = new followermodel({ followerId, followingId });
      await follow.save({ session });

      // Increase the follower count
      const user = await usermodel.findByIdAndUpdate(followingId, { $inc: { followercounts: 1 } }, { new: true, session }).select('_id name profile followercounts description');

      // Commit the transaction after everything is successful
      await session.commitTransaction();

      return res.status(200).json({ user, message: "Followed successfully" });
    }
  } catch (error) {
    // If something goes wrong, abort the transaction
    await session.abortTransaction();
    console.error(error);  // Optional: Log the error for debugging

    return res.status(500).json({ message: "Error processing follow/unfollow", error: error.message });
  } finally {
    // End the session after committing or aborting the transaction
    session.endSession();  
  }
});

app.put("/upload/file/update", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }


    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
  const  id  = decoded.userId;  
  const { name, profile ,infodescription} = req.body; // Extract new name and profile

  try {
    // Find the user by ID
    const user = await usermodel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if at least 1 month (30 days) has passed since last update
 

    // Check if the new name already exists (excluding the current user)
    const existingUserByName = await usermodel.findOne({ name });
    if (existingUserByName && existingUserByName._id.toString() !== id) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const lastUpdated = new Date(user.updatedAt);
    const oneWeekAgo = new Date(); // Create a new date object
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 1); // Subtract 7 days
    
    if (lastUpdated > oneWeekAgo) {
      return res.status(400).json({ message: "You can update your profile after 1 week." });
    }
    
    // Update only the name and profile while keeping other fields unchanged
    const updatedUser = await usermodel.findByIdAndUpdate(
      id,
      { name, profile , description:infodescription }, // Only updating name and profile
      { new: true } // Return the updated user
    ).select('_id name profile followercounts description');

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});
app.get("/user/:userId/total-likes", async (req, res) => {
  try {
    const { userId } = req.params;

    // Aggregate total likes from news created by the user
    const newsLikes = await newmodel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    // Aggregate total likes from posts created by the user
    const postLikes = await postmodel.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    // Aggregate total likes from questions created by the user
    const questionLikes = await questionmodel.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalLikes: { $sum: "$likesCount" } } },
    ]);

    // Extract like counts, defaulting to 0 if no documents are found
    const newsTotalLikes = newsLikes.length > 0 ? newsLikes[0].totalLikes : 0;
    const postTotalLikes = postLikes.length > 0 ? postLikes[0].totalLikes : 0;
    const questionTotalLikes = questionLikes.length > 0 ? questionLikes[0].totalLikes : 0;

    // Sum all like counts
    const totalLikes = newsTotalLikes + postTotalLikes + questionTotalLikes;
    
    res.json({ userId, totalLikes });
  } catch (error) {
    console.error("Error fetching total likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/follow/status/:userId", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const followerId = decoded.userId;
    const followingId = req.params.userId;

    const existingFollow = await followermodel.findOne({ followerId, followingId });
    if (existingFollow) {
      return res.status(200).json({ message: "You follow him" });
    } else {
      return res.status(200).json({ message: "You don't followhim" });
    }
    
  } catch (error) {
    res.status(500).json({ message: "Error checking follow status", error });
  }
});
app.post('/like-news/:newsId', async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  const session = await mongoose.startSession();  // Start a Mongoose session
  session.startTransaction(); 

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId; 
    const newsId = req.params.newsId;

    // Check if the user has already liked this news article
    const existingLike = await newslikemodel.findOne({ userId, newsId }).session(session);

    if (existingLike) {
      // If the user has liked the news article, "unlike" it
      await newslikemodel.findOneAndDelete({ userId, newsId }).session(session);

      // Decrement the likes count of the news article
      const updatenewspost = await newmodel.findByIdAndUpdate(newsId, { $inc: { likesCount: -1 } }, { new: true, session })
        .populate("createdBy", "profile name");

      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully unliked the news article", updatenewspost });
    } else {
      // If the user has not liked the news article yet, "like" it
      const like = new newslikemodel({ userId, newsId });
      await like.save({ session });

      // Increment the likes count of the news article
      const updatenewspost = await newmodel.findByIdAndUpdate(newsId, { $inc: { likesCount: 1 } }, { new: true, session })
        .populate("createdBy", "profile name");

      await session.commitTransaction();
      return res.status(200).json({ message: "Successfully liked the news article", updatenewspost });
    }
  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({ error: 'An error occurred while toggling like on the news article.', details: error.message });
  }
});


// Toggle Like on a Post (Like or Unlike)



app.post('/like-post/:postId', async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  const session = await mongoose.startSession();  // Start a Mongoose session
  session.startTransaction();  // Begin transaction
  
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;  // From JWT token (authenticated user)
    const postId = req.params.postId;

    // Check if the user has already liked this post
    const existingLike = await postlikemodel.findOne({ userId, postId }).session(session);

    if (existingLike) {
      // If the user has liked the post, "unlike" it
      await postlikemodel.findOneAndDelete({ userId, postId }).session(session);

      // Decrement the likes count of the post
      const postdata = await postmodel.findByIdAndUpdate(postId, { 
        $inc: { likesCount: -1 } 
      }, { new: true, session }).populate("createdBy", "profile name followercounts").select("-quiz -images");

      await session.commitTransaction();  // Commit transaction if all operations are successful

      return res.json({
        postdata: postdata.toObject(),
        message:"you don't like it"
      });
    } else {
      // If the user has not liked the post yet, "like" it
      const like = new postlikemodel({ userId, postId });
      await like.save({ session });  // Save with session

      // Increment the likes count of the post
      const postdata = await postmodel.findByIdAndUpdate(postId, { 
        $inc: { likesCount: 1 } 
      }, { new: true, session }).populate("createdBy", "profile name followercounts").select("-quiz -images");

      await session.commitTransaction();  // Commit transaction if all operations are successful

      return res.json({
        postdata: postdata.toObject(),
       message:"you like"
      });
    }
  } catch (error) {
    await session.abortTransaction();  // Rollback transaction in case of an error
    res.status(500).json({ error: 'An error occurred while toggling like on the post.' });
  } finally {
    session.endSession();  // End the session
  }
});
// Check if user has liked the post
app.get('/like-post/status/:postId', async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    
    const userId = decoded.userId;
    const postId = req.params.postId;

    // Check if the user has already liked this post
    const existingLike = await postlikemodel.findOne({ userId, postId });
    
    if (existingLike) {
      return res.status(200).json({ message: "You like it" });
    } else {
      return res.status(200).json({ message: "You don't like it" });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while checking like status for the post.' });
  }
});
app.post("/upload/file/signup",  async (req, res) => {
  const { name, email, education, password, profile } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUserByName = await usermodel.findOne({ name });
    const existingUserByemail = await usermodel.findOne({ email });

    if (existingUserByName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (existingUserByemail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const userentry = new usermodel({
      name,
      email,
      education,
      password,
      profile
    });

    await userentry.save();
    res.send("Your account has been created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});
app.get("/upload/file/people", async (req, res) => {
  try {
    // Default page is 1 and limit is 15
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 25;  
    const skip = (page - 1) * limit;

    // Fetch paginated posts and populate the 'createdBy' field with 'name' and 'profile'
    const data = await usermodel.find({})
      .skip(skip)  // Skip the posts that have already been fetched
      .limit(limit)  // Limit the number of posts fetched (15 in this case)
      .sort({ createdAt: -1 })
      .select('_id name profile followercounts')

    // Send the data back to the client
    res.json({
data  // The fetched data
    });
  } catch (error) {
    
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.get("/upload/file/peoples",async(req,res)=>{
  try{
const data=await usermodel.find({}).select('_id name profile followercounts');
res.json({data})
  }catch(error){
 
  }
})
app.get("/upload/file/people/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userdata = await usermodel.findById(id).select('_id name profile followercounts description');
    
    // Check if user exists
    if (!userdata) {
      return res.status(404).json({ message: "User doesn't exist" }); // Return here to stop further execution
    }

    // If user exists, send user data
    res.json(userdata);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" }); // Handle unexpected errors
  }
});

app.post("/upload/file/login", async (req, res) => {
  const { email, password } = req.body;
 const userexist = await usermodel.findOne({ email });
  if (!userexist) {
    return res.status(400).json({ message: "Email or password doesn't match" });
  }



  // Await the password comparison, since bcrypt.compare is async
  const passwordMatch = await bcrypt.compare(password, userexist.password);



  if (!passwordMatch) {
    return res.status(400).json({ message: "Email or Password doesn't match" });
  }

  const token = jwt.sign(
    { userId: userexist._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    token,
  });
});

app.post("/upload/file/verifytoken", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];  // Extract token from header
  if (!token) {
    return res.status(403).json({ message: "Token is required" });  // Token is missing
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // decoded will contain { userId: <user_id> } if the token is valid

    // Check if the user exists in the database
    const user = await usermodel.findById(decoded.userId).select('_id name profile followercounts description');  // Find user by the userId decoded from the token
  
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });  // User not found in the database
    }

    // If the user exists, return the userId
    res.json({
      userId: decoded.userId,
      user
    });
  } catch (error) {
    // If there's any error with token verification, return a 403 error
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});


// POST endpoint for creating a post
app.post("/upload/file", async (req, res) => {
  const { title, description,thumbnail,images,quiz,youtubenotelink } = req.body;;


  // Extract the userId from the JWT token sent in the headers
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token and get the decoded userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "yourSecretKey");
    const userId = decoded.userId;

    // Create a new post with the createdBy field set to the user's ID
    const postEntry = new postmodel({
      title,
      description,
      thumbnail,
      images,
      notelink: youtubenotelink || "",
      createdBy: userId, 
      quiz: quiz || [], // This should be a valid user ID
    });

    // Check if the user exists before saving
    const userExist = await usermodel.findById(userId);
    if (!userExist) {
      return res.status(400).json({ message: "User not found for the given post" });
    }
    
  
    
    const savedPost = await postEntry.save();

    // Fetch the saved post again, excluding `quiz` and `images`
    const postWithoutQuizAndImages = await postmodel
      .findById(savedPost._id)
      .select("-quiz -images -description")
      .lean(); // Convert to plain object for better performance

    res.json({
      data: postWithoutQuizAndImages,
    });
   
  } catch (error) {
    console.log("Error in post creation:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});
app.post("/upload/file/quiz", async (req, res) => {
  const {quiztitle,quizdesccription,quiz} = req.body;
  const quizlength=quiz.length;
  // Extract the userId from the JWT token sent in the headers
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token and get the decoded userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "yourSecretKey");
    const userId = decoded.userId;

    // Create a new post with the createdBy field set to the user's ID
    const postEntry = new realquizmodel({
      title: quiztitle,
      description: quizdesccription,
      createdBy: userId, 
      quiz: quiz,
      quizlength // This should be a valid user ID
    });
    
    // Check if the user exists before saving
    const userExist = await usermodel.findById(userId);
    if (!userExist) {
      return res.status(400).json({ message: "User not found for the given post" });
    }
    
  
    
    const savedPost = await postEntry.save();
  
// Convert to plain object for better performance

    res.json({
      message:"all the quiz data record successfully.",
    });
   
  } catch (error) {
    console.log("Error in post creation:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});
app.post("/upload/file/news",async (req, res) => {
  const { title ,images } = req.body;
  // Extract the userId from the JWT token sent in the headers
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token and get the decoded userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    // Create a new post with the createdBy field set to the user's ID
    const postEntry = new newmodel({
      title,
      images,
      createdBy: userId,  // This should be a valid user ID
    });
    
    // Check if the user exists before saving
    const userExist = await usermodel.findById(userId);
    if (!userExist) {
      return res.status(400).json({ message: "User not found for the given post" });
    }
    
    const postSave = await postEntry.save();
    

    res.json({
      data: postSave.toObject(),
    });
  } catch (error) {
    console.log("Error in post creation:", error);
    res.status(500).json({ message: "Error creating post" });
  }
});
app.post("/upload/file/wishlist", async (req, res) => {
  const { postid } = req.body;
  
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token and extract userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
    const userId = decoded.userId;

    // Check if the post already exists in the user's wishlist
    const existingWishlist = await wishlistmodel.findOne({
      wishlistby: userId,
      postid: postid,
    });

    if (existingWishlist) {
      // If the post is already in the wishlist, return a message
      return res.status(400).json({ message: "Post is already in your wishlist" });
    }

    // If not, create a new wishlist entry
    const wishlistEntry = new wishlistmodel({
      wishlistby: userId,
      postid: postid,
    });

    await wishlistEntry.save();

    return res.status(200).json({ message: "Post added to your wishlist successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding to wishlist" });
  }
});
// Fetch wishlist
app.get("/upload/file/wishlist", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    // Fetch wishlist and populate the post and the creator
    const wishlistItems = await wishlistmodel
    .find({ wishlistby: userId })
    .populate({
      path: 'postid', // Populate the postid field
      populate: {
        path: 'createdBy', // Inside postid, populate createdBy
        select: 'name profile _id' // Select only the name and profile fields from user
      }
    });
   
       // Populate the creator's name and profile

    // Return the populated wishlist items
    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});
app.get("/upload/file/people/profile/:id", async (req, res) => {
  const id = req.params.id;

  try {
   

    const posts = await postmodel
      .find({ createdBy: id })
      .select("-quiz -images -description")
      .populate("createdBy", "name profile _id"); // Populate user info

    

    res.status(200).json(posts); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching posts" });
  }
});
app.get("/upload/file/profile/createdby", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const posts = await postmodel
      .find({ createdBy: userId})
      .select("-quiz -images -description")
      .populate("createdBy", "name profile _id"); // Populate user info

    

    res.status(200).json(posts); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching posts" });
  }
});
app.get("/upload/file/news/createdby", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const posts = await newmodel
      .find({ createdBy: userId})
      .populate("createdBy", "name profile _id"); // Populate user info

    

    res.status(200).json(posts); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching posts" });
  }
});
app.post("/upload/file/people/profile/news/:id", async (req, res) => {
  const id = req.params.id;
  const limit = parseInt(req.body.limit) || 12;
  const excludeIds = req.body.excludeIds || []; // Already fetched posts

  try {
    const posts = await newmodel.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(id), 
          _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } // Exclude fetched posts
        } 
      },
      { $sample: { size: limit } }, // Fetch 'limit' number of new posts
      { 
        $lookup: { 
          from: "users", 
          localField: "createdBy", 
          foreignField: "_id", 
          as: "createdBy" 
        } 
      },
      { $unwind: "$createdBy" }, // Flatten the createdBy field
      { 
        $project: { 
          _id: 1,
          title: 1,
          images: 1, 
          likesCount: 1,
          createdBy: { name: 1, profile: 1 ,_id: 1}, // Only include necessary user details
          createdAt: 1
        } 
      }
    ]);

    res.json({
      datas: posts,
      message: "Random user posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.post("/upload/file/people/profile/profile/:id", async (req, res) => {
  const id = req.params.id;
  const limit = parseInt(req.body.limit) || 12;
  const excludeIds = req.body.excludeIds || []; // Already fetched posts

  try {
    const posts = await postmodel.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(id), 
          _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } // Exclude fetched posts
        } 
      },
      { $sample: { size: limit } }, // Fetch 'limit' number of new posts
      { 
        $lookup: { 
          from: "users", 
          localField: "createdBy", 
          foreignField: "_id", 
          as: "createdBy" 
        } 
      },
      { $unwind: "$createdBy" }, // Flatten the createdBy field
      { 
        $project: { 
          _id: 1,
          title: 1,
          thumbnail: 1
        } 
      }
    ]);

    res.json({
      datas: posts,
      message: "Random user posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.post("/upload/file/people/profile/profiletoken", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY );
    const id = decoded.userId;

  const limit = parseInt(req.body.limit) || 12;
  const excludeIds = req.body.excludeIds || []; // Already fetched posts

  try {
    const posts = await postmodel.aggregate([
      { 
        $match: { 
          createdBy: new mongoose.Types.ObjectId(id), 
          _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } // Exclude fetched posts
        } 
      },
      { $sample: { size: limit } }, // Fetch 'limit' number of new posts
      { 
        $lookup: { 
          from: "users", 
          localField: "createdBy", 
          foreignField: "_id", 
          as: "createdBy" 
        } 
      },
      { $unwind: "$createdBy" }, // Flatten the createdBy field
      { 
        $project: { 
          _id: 1,
          title: 1,
          thumbnail: 1
        } 
      }
    ]);

    res.json({
      datas: posts,
      message: "Random user posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
// GET endpoint for fetching all posts
app.get("/upload/file", async (req, res) => {
  try {
    // Fetch posts and populate the createdBy field with user data
    const data = await postmodel.find({}).populate('createdBy', 'name profile _id').select("-quiz -images -description");  // Populate 'name' and 'profile' fields from the user model
    
    res.json({
      datas: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.get("/upload/file/news", async (req, res) => {
  try {
    // Fetch posts and populate the createdBy field with user data
    const data = await newmodel.find({}).populate('createdBy', 'name profile _id');  // Populate 'name' and 'profile' fields from the user model
    
    res.json({
      datas: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});
app.post("/upload/file/news/bit", async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 9; // Default limit
    const excludeIds = req.body.excludeIds || []; // Get already fetched post IDs

    // Fetch random posts while excluding already fetched ones
    const data = await newmodel.aggregate([
      {
        $match: {
          _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } // Exclude already fetched posts
        }
      },
      { $sample: { size: limit } }, // Fetch 'limit' number of new posts
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" }, // Flatten the createdBy field
      {
        $project: {
          _id: 1,  // Include _id in response
          title: 1,
          images: 1,
          likesCount: 1,
          createdBy: {_id:1, name: 1, profile: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,  // The fetched data
      message: "News posts fetched successfully",  // Success message
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});

app.post("/upload/file/home", async (req, res) => {
  try {
    const limit = parseInt(req.body.limit) || 25;
    const excludeIds = req.body.excludeIds || []; // Get already fetched post IDs

    // Fetch random posts while excluding already fetched ones
    const data = await postmodel.aggregate([
      { $match: { _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } } }, // Exclude already fetched posts
      { $sample: { size: limit } }, // Fetch 'limit' number of new posts
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          _id: 1, // Ensure _id is included
          thumbnail: 1,
          title: 1,
          createdBy: {_id:1,name: 1, profile: 1, followercounts: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,
      message: "Random posts fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching posts" });
  }
});



app.delete("/upload/file/:id", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  const postId = req.params.id;

  try {
   
    const post = await postmodel.findById(postId);

    if (!post) {
      
      return res.status(404).json({ error: "Post not found" });
    }

  
    await postmodel.findByIdAndDelete(postId);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
const userId = decoded.userId;

   
    const remainingPosts = await postmodel.find({createdBy:userId}).populate("createdBy","name profile").select("-quiz -images -description");
    res.json({  remainingPosts });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
app.delete("/upload/file/news/:id", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  const postId = req.params.id;

  try {
   
    const post = await newmodel.findById(postId);

    if (!post) {
      
      return res.status(404).json({ error: "Post not found" });
    }

  
    await newmodel.findByIdAndDelete(postId);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
const userId = decoded.userId;

   
    const remainingPosts = await newmodel.find({createdBy:userId}).populate("createdBy","name profile");
    res.json({  remainingPosts });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});
app.delete("/upload/file/wishlist/:id",async(req,res)=>{
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  const{id}=req.params;

  try{
const postid= await wishlistmodel.findById(id);

if(!postid){
  return res.status(404).json({error:"wishlist not found"});
}
await wishlistmodel.findByIdAndDelete(id);
res.status(200).json({message:"Post is deleted. Reload to see the change. Thank you.",});

  }catch(error){
    console.log(error)
  }
})
// GET endpoint for fetching a single post by ID
app.get("/upload/file/:id", async (req, res) => {
  const postId = req.params.id;
  const initialLimit = req.query.initialLimit; 
  try {
    // Fetch post, but don't exclude 'quiz' yet
    const post = await postmodel.findById(postId).populate('createdBy', 'name _id profile followercounts description notelink');

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get the quiz length before excluding 'quiz'
    const quizLength = post.quiz ? post.quiz.length : 0;
 
    // Now you can exclude 'quiz' in the response if needed
    const postData = post.toObject();
    delete postData.quiz;  // Remove quiz data from the response
    const imagesToSend = postData.images.slice(0,initialLimit);

    res.json({
      postdata: { ...postData, images: imagesToSend },  // Send only the first 18 images
      quizLength,  // Send the quiz length
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get the post, thank you" });
  }
});
app.post("/upload/file/images/:id", async (req, res) => {
  const postId = req.params.id;
  const { excludeUrls } = req.body;  // Get array of already fetched image URLs
  const limit = 2; // Load next 5 images

  try {
    const post = await postmodel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Get the images that haven't been sent yet
    const remainingImages = post.images.filter(image => !excludeUrls.includes(image));

    // Get the next 'limit' images
    const nextImages = remainingImages.slice(0, limit);

    res.json({ images: nextImages });
  } catch (error) {
    res.status(500).json({ message: "Failed to load images" });
  }
});

app.get("/upload/file/quiz/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    // Fetch the post but only include the 'quiz' field
    const post = await postmodel.findById(postId).select('quiz');
        
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({
      quiz: post, 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get the quiz, thank you" });
  }
});

app.get("/homeads",async(req,res)=>{
  res.json({homeads:homeads})
})
app.get("/otherads",async(req,res)=>{
  res.json({otherads:otherads})
})
app.post("/search", async (req, res) => {
  try {
    const { query, limit = 9, page = 1 } = req.body;

    const sanitizedQuery = query && typeof query === 'string' ? query.trim() : "";

    if (!sanitizedQuery) {
      return res.json({
        datas: [],
        message: "No search query provided",
      });
    }

    const matchCondition = {
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },
        { description: { $regex: sanitizedQuery, $options: "i" } }
      ]
    };

    // Pagination: Calculate the number of items to skip based on the current page
    const skip = (page - 1) * limit;

    const data = await postmodel.aggregate([
      { $match: matchCondition },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          _id: 1,
          title: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,
      message: "Filtered search results fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching search results" });
  }
});
app.post("/searchpage", async (req, res) => {
  try {
    const { query } = req.body;

    const sanitizedQuery = query && typeof query === 'string' ? query.trim() : "";

    if (!sanitizedQuery) {
      return res.json({
        datas: [],
        message: "No search query provided",
      });
    }

    const matchCondition = {
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },
        { description: { $regex: sanitizedQuery, $options: "i" } }
      ]
    };

    // Set a fixed limit of 36 posts
    const limit = 36;

    const data = await postmodel.aggregate([
      { $match: matchCondition },
      { $sample: { size: limit } }, // Select 36 random posts
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,
      message: "Search results fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching search results" });
  }
});

app.post("/searchnews", async (req, res) => {
  try {
    const { query } = req.body;

    const sanitizedQuery = query && typeof query === 'string' ? query.trim() : "";

    if (!sanitizedQuery) {
      return res.json({
        datas: [],
        message: "No search query provided",
      });
    }

    const matchCondition = {
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },  // Search by title
      ]
    };

    // Set a fixed limit of 36 posts (or news items in this case)
    const limit = 12;

    const data = await newmodel.aggregate([
      { $match: matchCondition },
      { $sort: { createdAt: -1 } },  // Sort by creation date (most recent first)
      { $limit: limit },  // Limit the result to 36 news items
      {
        $lookup: {
          from: "users",  // Lookup the users who created the news
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },  // Unwind the createdBy array to get the user data
      {
        $project: {
          _id: 1,
          title: 1,
          images: 1,
          likesCount: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },  // Include user info
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,
      message: "Search results fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching search results" });
  }
});
app.post('/userlikenotes/:userId', async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.body.limit) || 1;
  const excludeIds = req.body.excludeIds || [];

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch liked posts with exclude logic
    const likedPosts = await postlikemodel
      .find({ userId, postId: { $nin: excludeIds } })
      .populate({
        path: 'postId',
        select: '_id title thumbnail', // Only fetch these fields from the post document
        populate: { path: 'createdBy', model: 'user',select: '_id profile name followercounts'}, // Optional if you want user details
      })
      .limit(limit);

    if (!likedPosts || likedPosts.length === 0) {
      return res.status(404).json({ message: 'No liked posts found for this user' });
    }

    res.status(200).json({
      datas: likedPosts,
      message: 'Liked posts fetched successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching liked posts', error: error.message });
  }
});
app.post("/upload/file/people/profile/likewala/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.body.limit) || 12; // Default limit
    const excludeIds = req.body.excludeIds || []; // Excluded post IDs

    const likedPosts = await postlikemodel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          postId: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "posts", // Ensure the collection name matches your MongoDB
          localField: "postId",
          foreignField: "_id",
          as: "likedPostDetails",
        },
      },
      { $unwind: "$likedPostDetails" },
      {
        $lookup: {
          from: "users", // Join with the 'users' collection for 'createdBy'
          localField: "likedPostDetails.createdBy",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      { $unwind: "$creatorDetails" },
      {
        $project: {
          _id: "$likedPostDetails._id", // Post ID
          title: "$likedPostDetails.title",
          thumbnail: "$likedPostDetails.thumbnail",
          createdBy: {
            id: "$creatorDetails._id", // User ID
            name: "$creatorDetails.name", // User name
            profile: "$creatorDetails.profile", // User profile image
          },
        },
      },
      { $sample: { size: limit } }, // Randomly select 'limit' number of posts
    ]);

    const totalLikedCount = await postlikemodel.countDocuments({ userId });

    res.json({
      datas: likedPosts,
      totalCount: totalLikedCount,
      message: "Liked posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching liked posts" });
  }
});
app.post("/upload/file/people/profile/wishlistwala", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const limit = parseInt(req.body.limit) || 12; // Default limit for pagination
    const excludeIds = req.body.excludeIds || []; // Exclude already fetched posts


    // Aggregate to fetch wishlist posts
    const wishlistPosts = await wishlistmodel.aggregate([
      {
        $match: {
          wishlistby: new mongoose.Types.ObjectId(userId), // Only fetch posts in the user's wishlist
          postid: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) }, // Exclude already fetched posts
        },
      },
      {
        $lookup: {
          from: "posts", // Join with the posts collection to fetch post details
          localField: "postid",
          foreignField: "_id",
          as: "wishlistPostDetails",
        },
      },
      { $unwind: "$wishlistPostDetails" },
      {
        $lookup: {
          from: "users", // Join with the users collection to fetch creator details
          localField: "wishlistPostDetails.createdBy",
          foreignField: "_id",
          as: "creatorDetails",
        },
      },
      { $unwind: "$creatorDetails" },
      {
        $project: {
          _id: 1, // Include wishlist model _id (the wishlist document ID)
          wishlistId: "$_id", // Adding the wishlist model id field
          postId: "$wishlistPostDetails._id", // Post ID
          title: "$wishlistPostDetails.title",
          thumbnail: "$wishlistPostDetails.thumbnail",
          createdBy: {
            id: "$creatorDetails._id", // Creator ID
            name: "$creatorDetails.name", // Creator name
            profile: "$creatorDetails.profile", // Creator profile image
          },
        },
      },
      { $sample: { size: limit } }, // Fetch 'limit' number of posts
    ]);


    // Get total count of wishlist posts for pagination
    const totalWishlistCount = await wishlistmodel.countDocuments({ wishlistby: userId });

    res.json({
      datas: wishlistPosts,
      totalCount: totalWishlistCount,
      message: "Wishlist posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching wishlist posts" });
  }
});
app.post("/upload/file/people/profile/following/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = parseInt(req.body.limit) || 12; // Default limit
    const excludeIds = req.body.excludeIds || []; // Excluded user IDs (to prevent showing already fetched users)

    // Find the users the given user is following
    const followingUsers = await followermodel.aggregate([
      {
        $match: {
          followerId: new mongoose.Types.ObjectId(userId), // Filter by the user ID (followerId)
          followingId: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) }, // Exclude already fetched users
        },
      },
      {
        $lookup: {
          from: "users", // The users collection
          localField: "followingId", // Match with the 'followingId' in the Follower model
          foreignField: "_id", // Match with the '_id' in the users collection
          as: "followingUserDetails", // Store the following user details here
        },
      },
      { $unwind: "$followingUserDetails" }, // Unwind the following user details
      {
        $project: {
          _id: "$followingUserDetails._id", // Following user ID
          name: "$followingUserDetails.name", // Following user name
          profile: "$followingUserDetails.profile",
          followercounts:"$followingUserDetails.followercounts" // Following user profile image
        },
      },
      { $limit: limit }, // Limit the number of results returned (pagination)
    ]);

    // Count the total number of users the user is following
    const totalFollowingCount = await followermodel.countDocuments({ followerId: userId });

    res.json({
      datas: followingUsers,
      totalCount: totalFollowingCount,
      message: "Following users fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching following users" });
  }
});
app.get('/trendingpeople', async (req, res) => {
  try {
    const topUsers = await usermodel.find()
      .sort({ followercounts: -1 })  // Sort in descending order of followercounts
      .limit(5)
      .select('-email -password -education -description');  // Limit the result to the top 5 users

    res.json(topUsers);  // Send the top 5 users as the response
  } catch (error) {
    res.status(500).json({ message: "Error fetching top users", error });
  }
});
app.get('/trendingnotes', async (req, res) => {
  try {
    const posts = await postmodel.find()
      .sort({ likesCount: -1 }) // Sort posts by likesCount in descending order
      .populate('createdBy', 'profile _id name') // Populate the createdBy field with specific user details (profile, _id, and name)
      .select("-quiz -images -description")// Exclude the 'images' field from the Post document
      .limit(21); // Optional: Limit to the top 5 posts with most likes

    res.json(posts); // Send the posts along with the user details in the response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});
app.post("/submit-quiz", async (req, res) => {
  const {
    timeTaken,
    correctAnswers,
    incorrectAnswers,
    negativeMarks,
    totalScore,
    postid
  } = req.body;
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;
    const newQuizResult = new quizresultmodel({
      timeTaken,
      correctAnswers,
      incorrectAnswers,
      negativeMarks,
      totalScore,
      postid,
      submittedBy: userId, // link it to the user
    });

    await newQuizResult.save();
  // Send a response back to the client
  res.status(200).json({ message: "Quiz results received successfully!"});
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing the quiz results." });
  }  
});
// Assuming QuizResult is already required, and Express app setup is done

app.get('/topranker/:postid', async (req, res) => {
  try {
    const postid = req.params.postid;

    // Find top 10 quiz results based on highest totalScore and lowest timeTaken (in case of tie)
    const topRankers = await quizresultmodel.find({ postid: postid })
      .sort({ totalScore: -1, timeTaken: 1 }) // Sort by totalScore descending and timeTaken ascending
      .limit(9)// Limit to top 10
      .populate('submittedBy', 'profile _id name')
      .select("-correctAnswers -incorrectAnswers -negativeMarks")
    // Get count of unique users who have submitted the form for this post
    const uniqueSubmittersCount = await quizresultmodel.distinct('submittedBy', { postid: postid }).countDocuments();

    // Return the top 10 quiz results along with the unique submitter count
    return res.status(200).json({
      topRankers,
      uniqueSubmittersCount
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server Error' });
  }
});
app.post('/post/add-comment/:postid', async (req, res) => {
  const postId = req.params.postid;
  const token = req.headers["authorization"]?.split(" ")[1];

  // Check if the token is provided
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    // Verify the token and get the decoded userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "yourSecretKey");
    const userId = decoded.userId;
    const { text } = req.body;

    // Check if all required fields are provided
    if (!userId || !postId || !text) {
      return res.status(400).json({ message: 'User ID, Post ID, and Comment text are required.' });
    }

    // Check if the post exists
    const post = await postmodel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new comment
    const newComment = new postcommentmodel({
      user: userId,
      post: postId,
      text: text,
    });

    // Save the new comment
    await newComment.save();

    // Increment the comments count on the post
    post.commentsCount += 1;

    // Save the updated post with the new comment count
    await post.save();

    // Populate the user field with 'name' and 'profile _id' after saving the comment
    const populatedComment = await postcommentmodel
      .findById(newComment._id)
      .populate('user', 'name profile _id');  // Populate 'name' and 'profile' field

    // Return a success response with the populated comment
    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post("/getpost/comments/:postId", async (req, res) => {
  const postId = req.params.postId;
  
  const { excludeIds } = req.body; // Array of comment IDs to exclude
 
  const limit = 5;

  try {
    const comments = await postcommentmodel
      .find({
        post: postId, 
        _id: { $nin: excludeIds } // Exclude already fetched comments
      })
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .populate("user", "name profile _id"); // Populate user details (optional)

    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Failed to load comments" });
  }
});
app.post("/quizpage", async (req, res) => {
  try {
    const { query } = req.body;

    const sanitizedQuery = query && typeof query === 'string' ? query.trim() : "";

    if (!sanitizedQuery) {
      return res.json({
        datas: [],
        message: "No search query provided",
      });
    }

    const matchCondition = {
      $or: [
        { title: { $regex: sanitizedQuery, $options: "i" } },
        { description: { $regex: sanitizedQuery, $options: "i" } }
      ]
    };

    // Set a fixed limit of 36 posts
    const limit = 12;

    const data = await realquizmodel.aggregate([
      { $match: matchCondition },
      { $sample: { size: limit } }, // Select 36 random posts
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          _id: 1,
          title: 1,
          totalsubmitted:1,
          quizlength:1,
          description: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },
          createdAt: 1,
        },
      },
    ]);

    res.json({
      datas: data,
      message: "Search results fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching search results" });
  }
});


app.post("/get-quizzesdisplay", async (req, res) => {
  try {
    const { excludeUrls } = req.body;
   

    // Convert excludeUrls to mongoose ObjectId format
    const excludedIds = excludeUrls.map(id => new mongoose.Types.ObjectId(id));

    // Fetch 20 random quizzes, excluding the given IDs, excluding the 'quiz' field, and populate 'createdBy'
    const quizzes = await realquizmodel.aggregate([
      { $match: { _id: { $nin: excludedIds } } }, // Exclude specified quizzes
      { $sample: { size: 10 } }, // Randomly select 20 quizzes
      { $project: { quiz: 0 } }, // Exclude the 'quiz' field from the result
      {
        $lookup: {
          from: "users", // The collection name for users is 'users' based on your schema
          localField: "createdBy", // The field in 'realquiz' collection that references user _id
          foreignField: "_id", // The field in the 'users' collection that corresponds to '_id'
          as: "createdBy" // Populating into this field
        }
      },
      {
        $unwind: "$createdBy" // Unwind the array of 'createdBy' to access individual user object
      },
      {
        $project: {
          _id: 1,
          title: 1,
          totalsubmitted:1,
          quizlength:1,
          description: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },
          createdAt: 1,
        }
      }
    ]);

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
app.post("/get-quizzesdisplay/createdby", async (req, res) => {
  try {
    const { excludeUrls, createdById } = req.body;
   

    if (!createdById) {
      return res.status(400).json({ success: false, message: "createdById is required" });
    }

    // Convert excludeUrls to mongoose ObjectId format
    const excludedIds = excludeUrls.map(id => new mongoose.Types.ObjectId(id));

    // Convert createdById to mongoose ObjectId format
    const userId = new mongoose.Types.ObjectId(createdById);

    // Fetch quizzes created by the user, excluding the given IDs, and populate 'createdBy'
    const quizzes = await realquizmodel.aggregate([
      { $match: { createdBy: userId, _id: { $nin: excludedIds } } }, // Match quizzes created by the user and exclude specified quizzes
      { $sample: { size: 10 } }, // Randomly select 20 quizzes
      { $project: { quiz: 0 } }, // Exclude the 'quiz' field from the result
      {
        $lookup: {
          from: "users", // The collection name for users is 'users' based on your schema
          localField: "createdBy", // The field in 'realquiz' collection that references user _id
          foreignField: "_id", // The field in the 'users' collection that corresponds to '_id'
          as: "createdBy" // Populating into this field
        }
      },
      {
        $unwind: "$createdBy" // Unwind the array of 'createdBy' to access individual user object
      },
      {
        $project: {
          _id: 1,
          title: 1,
          totalsubmitted: 1,
          quizlength: 1,
          description: 1,
          createdBy: { _id: 1, name: 1, profile: 1 },
          createdAt: 1,
        }
      }
    ]);

    res.status(200).json({ success: true, quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.get("/get-quiz-details/:id", async (req, res) => {
  try {
    const { id } = req.params;  // Retrieve the quiz ID from the URL parameter

    if (!id) {
      return res.status(400).json({ success: false, message: "Quiz ID is required" });
    }

    // Find the quiz by its ID and populate the 'createdBy' field with the associated user details
    const quiz = await realquizmodel
      .findById(id)  // Use findById to fetch the quiz by ID
      .populate("createdBy", "name profile _id followercounts description")  // Populate 'createdBy' with 'name' and 'email' (you can add more fields)
      .select("title description quiz createdBy totalsubmitted ")  // Select the fields you need from the quiz document
      .exec();

    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    res.status(200).json({ success: true, quiz });
  } catch (error) {
    console.error("Error fetching quiz details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

app.post("/submit-quiz-with-update", async (req, res) => {
  const {
    timeTaken,
    correctAnswers,
    incorrectAnswers,
    negativeMarks,
    totalScore,
    postid
  } = req.body;

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.userId;

    // Save the quiz result
    const newQuizResult = new quizresultmodel({
      timeTaken,
      correctAnswers,
      incorrectAnswers,
      negativeMarks,
      totalScore,
      postid,
      submittedBy: userId, // link it to the user
    });

    await newQuizResult.save();

    // Find the quiz by postid and increment the totalsubmitted count
    const quiz = await realquizmodel.findOne({ _id: postid });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Increment the totalsubmitted count
    quiz.totalsubmitted += 1;

    // Save the updated quiz
    await quiz.save();

    // Send a success response
    res.status(200).json({ message: "Quiz results and submission count updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing the quiz results." });
  }
});

// const server = awsServerlessExpress.createServer(app);

// // Lambda handler
// export const handler = (event, context) => {
//   return awsServerlessExpress.proxy(server, event, context);
// };
const port=8000
app.listen(port,async()=>{
  console.log("server is running",port)
})