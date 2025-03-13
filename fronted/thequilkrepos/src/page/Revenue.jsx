import { useNavigate } from "react-router-dom";

export default function Revenue(){
  const navigate = useNavigate();

  const goback = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1 style={{marginLeft:"40%"}}>REVENUE LIKE YOUTUBE SOON....</h1>

      <p style={{fontSize:"medium",fontWeight:"500",lineHeight:"50px"}}>
      Just like YouTube rewards creators based on views, we’re planning to introduce a similar model on our platform in the near future. While we don’t currently pay users based on the number of views their notes get, soon you’ll be able to earn money the more people view and engage with your notes. This change will give users the incentive to share their valuable notes instead of keeping them to themselves, creating a space where knowledge is freely shared and rewarded. Stay tuned for more details on how you can start earning by sharing your notes—just like creators do on YouTube!
      </p>
      <h1 style={{marginLeft:"40%"}}>share your notes instead throw it---www.thequilk.com.</h1>
      <button onClick={goback} style={{marginLeft:"50%",color:"black",width:"150px",height:"35px",fontSize:"medium",fontWeight:"500",marginTop:"87px"}}>Go Back</button>
    </div>
  );
}