import { signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword, updatePassword, type UpdatePasswordInput, fetchUserAttributes, confirmSignUp, updateUserAttributes, resendSignUpCode, fetchAuthSession } from "aws-amplify/auth";


export const resendVerificationCode = async (username: string) => {
  try {
    await resendSignUpCode({ username });
    console.log("Verification code resent successfully");
  } catch (error) {
    console.log("Error resending verification code:", error);
  }
}
export const getAuthSession = async () => {
  try {
    const { tokens } = await fetchAuthSession({ forceRefresh: true })
    return tokens
  } catch (error) {
    console.log("Error fetching auth session: ", error)
  }
}
export const changePassword = async ({ oldPassword, newPassword }: UpdatePasswordInput) => {
  try {
    await updatePassword({ oldPassword, newPassword });
    console.log("Password updated successfully");
  } catch (error) {
    console.log("Error updating password:", error);
  }
};
export const updateAttribute = async () => {
  await updateUserAttributes({
    userAttributes: {
      "custom:changePassword": "false"
    },
  });
}
export const handleSignOut = async () => {
  try {
    await signOut();
    console.log("Signed Out");
  } catch (error) {
    console.log('error signing out: ', error);
  }
};

export const getcurrentUser = async () => {
  try {
    const response = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    return { userId: response.userId, userType: attributes["custom:userType"], changePassword: attributes["custom:changePassword"] }
  } catch (error) {
    console.log("Current User Error", error);
  }
};

export const handleSignIn = async ({ username, password }) => {
  await signOut()
  try {

    const response = await signIn({ username, password });


    if (response.isSignedIn) {
      try {
        const { userId, userType, changePassword } = await getcurrentUser();
        return { response, userId, userType, changePassword };
      } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
      }
    } else if (response.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
      return { response, needsConfirmation: true, username };
    }
    return { response };
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const handleResetPassword = async ({ username }) => {
  try {
    return await resetPassword({ username });
  } catch (error) {
    console.log(error);
  }
};

export const handleCRP = async ({ username, confirmationCode, newPassword }) => {
  try {
    await confirmResetPassword({ username, confirmationCode, newPassword });
    console.log("Changed Successfully");
  } catch (error) {
    console.log("Error changing password:", error);
  }
};

export const confirmUserSignUp = async (username: string, code: string) => {
  try {
    await confirmSignUp({ username, confirmationCode: code });
    console.log("User confirmed successfully");
    return true;
  } catch (error) {
    console.error("Error confirming user:", error);
    return false;
  }
};


