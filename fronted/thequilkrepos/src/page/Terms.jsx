import { useNavigate } from "react-router-dom";

export default function Terms(){
  const navigate = useNavigate();

  const goback = () => {
    navigate(-1);
  };

  return (
    <div>
      <p style={{fontSize:"medium",fontWeight:"500",textShadow:"10px 10px 10px black",lineHeight:"50px"}}>
        Terms of Service

        Effective Date: February 2, 2025

        Welcome to thequilk.com, an educational platform and news-sharing website where users can upload, share, and access content for educational purposes. Please read these Terms of Service ("Terms") carefully before using our website. By accessing or using thequilk.com, you agree to comply with and be bound by these Terms.

        1. General Terms  
        thequilk.com ("the Website," "we," "our," "us") provides a platform where users can upload and share educational content, including notes, videos, and PDFs. The Website also offers brief news summaries targeted at Generation Z ("Gen Z").  
        These Terms govern your access to and use of the Website. If you disagree with any part of these Terms, please do not use the Website.

        2. User Responsibilities  
        You are solely responsible for the content you upload, share, or display on thequilk.com. This includes ensuring that your content does not infringe on the intellectual property rights of third parties (e.g., copyright, trademark).  
        By uploading any content, you represent and warrant that:  
        - You own or have the necessary rights and permissions to upload and share the content.  
        - The content does not violate any laws, infringe on any third-party rights, or contain harmful or illegal material.  
        - You understand that thequilk.com is not responsible for the content you upload or share, and you do so at your own risk.

        3. Content Ownership and Copyright  
        thequilk.com does not own any of the content uploaded by users. The users retain full ownership of their content, but by uploading content, you grant thequilk.com a non-exclusive, distribute, and share it on the platform.  
        If you upload content that is copyrighted or owned by someone else, you must have the appropriate permissions or licenses to share that content. You are fully responsible for obtaining any necessary rights or licenses before uploading such content.

        4. Copyright Infringement and DMCA Takedown  
        thequilk.com respects the intellectual property rights of others. If you believe that content on the Website infringes your copyright, you may submit a DMCA takedown notice (or a similar legal request depending on your jurisdiction).  
        Upon receiving a valid DMCA notice or other legal request, thequilk.com will promptly remove the allegedly infringing content from the platform.  
        To file a copyright complaint, please contact us at thequilk369@gmail.com with the necessary legal documentation (e.g., DMCA Takedown Notice or equivalent).  
        Important: You must provide all necessary information in your complaint, including proof of copyright ownership and a description of the infringing content. Failure to provide proper legal documentation may result in the content not being removed.

        5. Safe Harbor and Limitation of Liability  
        As a service provider, thequilk.com is protected under the Digital Millennium Copyright Act (DMCA) and other similar safe harbor laws in various jurisdictions. This means that we are not liable for the content uploaded by users, provided that we act promptly in removing infringing content upon receiving valid legal notices.  
        thequilk.com is not responsible for the legality, accuracy, or quality of user-generated content. We do not monitor user-uploaded content but will act upon proper notification of alleged violations.  
        By using thequilk.com, you agree to release us from any claims, liabilities, or damages resulting from content uploaded by other users.

        6. User Conduct  
        You agree to use thequilk.com only for lawful purposes and study purpose only and in accordance with these Terms. You will not use the Website to:  
        - Upload, share, or distribute any content that is harmful, abusive, defamatory, offensive, or violates the rights of others.  
        - Engage in any activities that disrupt or interfere with the functioning of the Website.  
        - Impersonate any person or entity or misrepresent your affiliation with any person or entity.  
        - Violate any local, national, or international law.

        7. Privacy Policy  
        Your use of thequilk.com is also governed by this terms. By using the Website, you agree to the collection and use of your personal data as outlined in this terms and we used your data for user convenience.

        8. Termination of Access  
        We reserve the right to suspend or terminate your account or access to the Website at any time, without notice, for any reason, including, but not limited to, violation of these Terms.  
        If we suspend or terminate your account for any reason, you agree that you will not attempt to access the Website using a different account or identity.

        9. Limitation of Liability  
        To the maximum extent permitted by law, thequilk.com shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the Website, including any loss of data or content.  
        You agree that your sole remedy for any dissatisfaction with the Website is to stop using it.

        10. Changes to the Terms  
        thequilk.com reserves the right to update or modify these Terms at any time. Any changes will be effective immediately upon posting on the Website, and you are responsible for reviewing these Terms periodically.  
        Your continued use of the Website after any changes to these Terms will constitute your acceptance of those changes.

        11. Governing Law  
        These Terms shall be governed by and construed in accordance with the laws of Belize. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in Belize.

        12. Contact Information  
        If you have any questions about these Terms, or if you need to submit a copyright complaint, please contact us at:  
        Email: thequilk369@gmail.com  
        Website: www.thequilk.com

      </p>
      <button onClick={goback} style={{marginLeft:"50%",color:"black",width:"150px",height:"35px",fontSize:"medium",fontWeight:"500",textShadow:"10px 10px 10px black"}}>Go Back</button>
    </div>
  );
}