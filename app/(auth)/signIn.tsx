import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import { Href, Link, useRouter } from 'expo-router';
import { handleSignIn, confirmUserSignUp, changePassword, updateAttribute } from '../../lib/aws-amplify';
import AppBar from '../../components/appBar';
import { useGlobalContext } from '../../context/GlobalProvider';
import Toast from "react-native-toast-message";
import LoadingScreen from '../../app/loadingScreen';

const Signin = () => {
  const { state, dispatch, initializeUserData } = useGlobalContext();
  if (!dispatch) {
    console.error("Dispatch not imported rightly")
  }
  const { isLoading } = state;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();
  const [signForm, setSignForm] = useState({
    email: '',
    password: ''
  });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });
  };

  const handleSignInSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { response, userId, userType, changePassword: needsChangePassword, needsConfirmation } = await handleSignIn({
        username: signForm.email,
        password: signForm.password,
      });

      if (needsConfirmation) {
        setNeedsConfirmation(true);
        return;
      }
      if (response) {
        if (response.isSignedIn) {
          dispatch({ type: 'SET_USER_DETAILS', payload: userId });
          dispatch({ type: 'SET_USER_TYPE', payload: userType });
          dispatch({ type: 'SET_CHANGE_PASSWORD', payload: needsChangePassword });

          await initializeUserData(userId);
          let redirectPath;
          if (userType === "owner") {
            if (response.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
              navigateToConfirmEmail();
              return;
            } else {
              redirectPath = '/(home)';
            }
          } else if (userType === "tenant") {
            if (needsChangePassword === "true") {
              setShowChangePassword(true);
              setOldPassword(signForm.password);
              return;
            } else {
              redirectPath = '/(tenant)';
            }
          } else {
            console.error("Unknown user type:", userType);
            showErrorToast("An error occurred. Please try again.");
            return;
          }
          router.replace(redirectPath);
        } else if (response.nextStep.signInStep === "CONFIRM_SIGN_UP") {
          navigateToConfirmEmail();
        }
      } else {
        handleSignInError(new Error("Sign in failed"));
      }
    } catch (error) {
      console.error("Sign in error:", error);
      showErrorToast(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const navigateToConfirmEmail = () => {
    const encodedEmail = encodeURIComponent(signForm.email);
    router.push(`confirmEmail?email=${encodedEmail}` as Href);
  };

  const handleSignInError = (error: Error) => {
    console.error(error);
    Alert.alert(
      "Sign In Failed",
      "Please check your credentials and try again.",
      [
        { text: "OK", style: "cancel" },
        { text: "Sign Up", onPress: () => router.push('/signUp') }
      ]
    );
  };

  const handleConfirmSignUp = async () => {
    const success = await confirmUserSignUp(signForm.email, confirmationCode);
    if (success) {
      setNeedsConfirmation(false);
      // Attempt to sign in again after confirmation
      handleSignInSubmit();
    } else {
      showErrorToast("Failed to confirm user. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      showErrorToast("New passwords do not match.");
      return;
    }
    try {
      await changePassword({ oldPassword, newPassword });
      await updateAttribute();
      setShowChangePassword(false);
      router.replace('/(tenant)');
    } catch (error) {
      console.error("Error changing password:", error);
      showErrorToast("Failed to change password. Please try again.");
    }
  };

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <AppBar leading={false} />
      {
        <View className='flex-1'>
          {needsConfirmation ? (
            <View>
              <TextField
                label="Confirmation Code"
                value={confirmationCode}
                onhandleChange={setConfirmationCode}
                placeholder="Enter confirmation code"
                keyboardtype="number-pad"
                secureTextEntry={false}
              />
              <Button
                title='Confirm Sign Up'
                containerStyle='mt-5 mb-3 px-10 py-3'
                onPress={handleConfirmSignUp}
              />
            </View>
          ) : showChangePassword ? (
            <View>
              <TextField
                label="New Password"
                value={newPassword}
                onhandleChange={setNewPassword}
                placeholder="Enter new password"
                keyboardtype="default"
                secureTextEntry={true}
              />
              <TextField
                label="Confirm New Password"
                value={confirmNewPassword}
                onhandleChange={setConfirmNewPassword}
                placeholder="Confirm new password"
                keyboardtype="default"
                secureTextEntry={true}
              />
              <Button
                title='Change Password'
                containerStyle='mt-5 mb-3 px-10 py-3'
                onPress={handleChangePassword}
              />
            </View>
          ) : (
            <><View className='flex items-start'>
              <Text className="text-secondary text-xl">SIGN IN</Text>
            </View><View className='items-center justify-start px-4 my-2'>
                <TextField
                  label="Email"
                  value={signForm.email}
                  onhandleChange={(email) => setSignForm({ ...signForm, email })}
                  placeholder="john.doe@something.com"
                  keyboardtype="email-address"
                  secureTextEntry={false}
                />

                <TextField
                  label="Password"
                  value={signForm.password}
                  onhandleChange={(password) => setSignForm({ ...signForm, password })}
                  keyboardtype="default"
                  placeholder="Password"
                  secureTextEntry={true}
                />

                <Button
                  title='Sign In'
                  containerStyle={`mt-5 mb-3 px-10 py-3 ${state.isLoading ? 'opacity-30' : 'opacity-100'}`}
                  isLoading={state.isLoading}
                  onPress={handleSignInSubmit} />
                <Link href={'/forgotPass'} className='text-gray-300 text-xs font-thin'>Forgot your password?</Link>
              </View><View className='flex items-center mt-10'>
                <Text className='text-white text-md'>Don't have an account?</Text>
                <Link href={'/signUp'} className={`text-xl text-secondary`} disabled={isLoading}> Sign Up</Link>
              </View></>
          )}
        </View>
      }
      <Toast />
    </SafeAreaView>
  )
}

export default Signin;