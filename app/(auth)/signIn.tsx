import React, { useState, useCallback } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, Link, useRouter } from 'expo-router';
import Toast from "react-native-toast-message";
import { handleSignIn, confirmUserSignUp, changePassword, updateAttribute, resendVerificationCode } from '../../lib/aws-amplify';
import { useGlobalContext } from '../../context/GlobalProvider';
import TextField from '../../components/textField';
import Button from '../../components/customButton';
import AppBar from '../../components/appBar';

const Signin = () => {
  const { state, dispatch, initializeUserData } = useGlobalContext();
  const { isLoading } = state;
  const router = useRouter();

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [signForm, setSignForm] = useState({ email: '', password: '' });
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);

  const showErrorToast = useCallback((message) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });
  }, []);

  const navigateToConfirmEmail = useCallback(() => {
    const encodedEmail = encodeURIComponent(signForm.email);
    router.push(`confirmEmail?email=${encodedEmail}` as Href);
  }, [router, signForm.email]);

  const handleSignInSubmit = useCallback(async () => {
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

      if (response?.isSignedIn) {
        dispatch({ type: 'SET_USER_DETAILS', payload: userId });
        dispatch({ type: 'SET_USER_TYPE', payload: userType });
        dispatch({ type: 'SET_CHANGE_PASSWORD', payload: needsChangePassword });

        await initializeUserData(userId, userType);

        if (userType === "owner") {
          if (response.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
            navigateToConfirmEmail();
          } else {
            router.replace('/(home)');
          }
        } else if (userType === "tenant") {
          if (needsChangePassword === "true") {
            setShowChangePassword(true);
            setOldPassword(signForm.password);
          } else {
            router.replace('/(tenant)');
          }
        } else {
          disableResendButton();
          throw new Error("Unknown user type");
        }
      } else if (response?.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        navigateToConfirmEmail();
      } else {
        throw new Error("Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      showErrorToast(error instanceof Error ? error.message : String(error));
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, signForm, initializeUserData, navigateToConfirmEmail, router, showErrorToast]);

  const handleConfirmSignUp = useCallback(async () => {
    const success = await confirmUserSignUp(signForm.email, confirmationCode);
    if (success) {
      setNeedsConfirmation(false);
      handleSignInSubmit();
    } else {
      showErrorToast("Failed to confirm user. Please try again.");
    }
  }, [signForm.email, confirmationCode, handleSignInSubmit, showErrorToast]);

  const handleChangePassword = useCallback(async () => {
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
  }, [oldPassword, newPassword, confirmNewPassword, router, showErrorToast]);

  function disableResendButton() {
    setResendDisabled(true);
    setTimeout(() => {
      setResendDisabled(false);
    }, 20000); // Disable for 60 seconds
  }
  const handleResendVerificationCode = useCallback(() => {
    resendVerificationCode(signForm.email);
    setResendDisabled(true);
    setTimeout(() => setResendDisabled(false), 2000);
  }, [signForm.email]);

  const renderConfirmationView = () => (
    <View>
      <View className='flex-1'>
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
        <View className='flex items-center w-[100%] bg-zinc-700 h-[5%] justify-center'>
          <Pressable
            onPress={handleResendVerificationCode}
            disabled={resendDisabled}
          >
            <Text className={`text-xs ${resendDisabled ? 'text-white/50' : 'text-white'}`}>
              {resendDisabled ? 'Resending...' : 'Resend Verification Code'}
            </Text>
          </Pressable>
        </View>
      </View>
      <View className='flex items-center'>
        <Pressable onPress={() => setNeedsConfirmation(false)}>
          <Text className='text-secondary text-lg'>Back to Sign In</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderChangePasswordView = () => (
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
  );

  const renderSignInView = () => (
    <>
      <View className='flex items-start'>
        <Text className="text-secondary text-xl">SIGN IN</Text>
      </View>
      <View className='items-center justify-start px-4 my-2'>
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
          containerStyle={`mt-5 mb-3 px-10 py-3 ${isLoading ? 'opacity-30' : 'opacity-100'}`}
          isLoading={isLoading}
          onPress={handleSignInSubmit}
        />
        <Link href={'/forgotPass'} className='text-gray-300 text-xs font-thin'>Forgot your password?</Link>
      </View>
      <View className='flex items-center mt-10'>
        <Text className='text-white text-md'>Don't have an account?</Text>
        <Link href={'/signUp'} className={`text-xl text-secondary`} disabled={isLoading}> Sign Up</Link>
      </View>
    </>
  );

  return (
    <SafeAreaView className='flex-1 items-center bg-primary px-5'>
      <AppBar leading={false} />
      <View className='flex-1'>
        {needsConfirmation ? renderConfirmationView() :
          showChangePassword ? renderChangePasswordView() :
            renderSignInView()}
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default Signin;

