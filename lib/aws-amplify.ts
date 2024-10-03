import { signIn,signOut, getCurrentUser, fetchAuthSession,resetPassword,confirmResetPassword, signUp  } from "aws-amplify/auth";

export async function currentSess(){
  try{
    const {accessToken,idToken} =(await fetchAuthSession()).tokens??{};
    console.log("Access Token:",accessToken);
    console.log("Id Token:",idToken);
    // return credentials.sessionToken;
  }
  catch(error){
    return(error)
  }
  
}

export  async function handleSignOut() {
  try {
    await signOut();
    console.log("Signed Out")
  } catch (error) {
    console.log('error signing out: ', error);
  }
}
export  async function getcurrentUser(){
  try{
    const response = await getCurrentUser();
    return response.userId;
  }
  catch(error){
    console.log("Current User Error",error);
  }
}

export async function handleSignIn({ username, password }) {
  try {
    const response=await signIn({ username, password });
    let res;
    if(response.isSignedIn){
      try{
        res = await getCurrentUser()
      }
      catch(error){
        throw error
        console.log("error after signing in ",error);
      }
    }
    return {response,res};
  } catch (error) {
    console.log(error)
    return error;
    
  }
}

export async function handleResetPassword({ username}){
  try {
    const output=await resetPassword({username})
    return output;
  } catch (error) {
    console.log(error)
  }
}

export async function handleCRP({username,confirmationCode,newPassword}){
  try {
    await confirmResetPassword({username,confirmationCode,newPassword})
    console.log("Changed Successfully")
  } catch (error) {
    
  }
}
