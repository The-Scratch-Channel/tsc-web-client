import { sendEmailVerification } from "firebase/auth";

export default function EmailVerification(){
    return(
        <div>
            <button
           onClick={sendEmailVerification()}
          >Send Verification Email</button>
            </div>
    )
}