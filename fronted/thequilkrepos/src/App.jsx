import * as React from "react";
import Home from "./page/Home";
import Search from "./page/Search";
import Wishlist from "./page/Wishlist";
import Profile from "./page/Profile";
import People from "./page/People";
import Review from "./page/Review";
import Info from "./page/Info";
import News from "./page/News";
import Newsinfo from "./page/Newsinfo";
import DiscussPage from "./page/Discuss";
import Like from "./page/Like";
import "./App.css"
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./page/login";
import Signup from "./page/signup";
import Terms from "./page/Terms"
import Revenue from "./page/Revenue";
import Follower from "./page/Follower";
import Trending from "./page/Trending";
import Quiz from "./page/Quiz";
import Quizinfo from "./page/Quizinfo";
import Pquiz from "./page/PQuiz";
import Userhome from "./page/Userhome";
const router = createBrowserRouter([
  {
    path: "/",
    element: ( <Home/>  ),
  },
  {
    path: "/wishlist",
    element:(<Wishlist/>),
  },
  {
    path: "/search",
    element: (<Search/>),
  },
  {
    path: "/profile",
    element:(<Profile/>),
  },{
     path:"/news",
     element:(<News/>)
  },
  {
    path: "/people",
    element: (<People/>),
  },
  {
    path: "/revenue",
    element: (<Revenue/>),
  },
{
  path:"/trending",
  element:(<Trending/>)
},
 {
  path:"/detail/review/:id",
  element:(<Review/>)
 }
,{
  path:"/quizinfo/:id",
  element:(<Quizinfo/>)
},
{
  path:"*",
  element:<Navigate to="/" replace />
},
{
path:"/signup",
element:<Signup/>
},
{
  path:"/profile/info/:id",
  element:(<Info/>)
},
{
  path:"/userhome/:id",
  element:(<Userhome/>)
},
{
path:"/profile/quiz/:id",
element:(<Pquiz/>)
},
{
  path:"/profile/news/:id",
  element:(<Newsinfo/>)
},
{
  path:"/login",
  element:<Login/>
},
{
  path:"/terms-and-conditions",
  element:<Terms/>
},
{
path:"/likenotes/:id",
element:<Like/>
},
{
  path:"/follower/:id",
  element:<Follower/>
},
{
  path:"/discuss/info/:id",
  element:(<DiscussPage/>)
},{
  path:"/quiz",
  element:(<Quiz/>)
}
]);
export default function App(){
  return(
    <div className="app">
    <RouterProvider router={router}>
   </RouterProvider>
   </div>
  )
}