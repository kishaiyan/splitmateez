import { signIn, signOut, getCurrentUser, resetPassword, confirmResetPassword, updatePassword, type UpdatePasswordInput } from "aws-amplify/auth";


export const changePassword = async ({ oldPassword, newPassword }: UpdatePasswordInput) => {
  try {
    await updatePassword({ oldPassword, newPassword });
    console.log("Password updated successfully");
  } catch (error) {
    console.log("Error updating password:", error);
  }
};

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
    return response.userId;
  } catch (error) {
    console.log("Current User Error", error);
  }
};

export const handleSignIn = async ({ username, password }) => {
  try {
    const response = await signIn({ username, password });
    if (response.isSignedIn) {
      try {
        const res = await getCurrentUser();
        return { response, res };
      } catch (error) {
        throw error;
      }
    }
    return { response };
  } catch (error) {
    console.log(error.underlyingError);
    return error;
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


