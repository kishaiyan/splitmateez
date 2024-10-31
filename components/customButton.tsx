import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import React from 'react'
import LottieView from "lottie-react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress?: () => void;
  containerStyle?: string;
  textStyle?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  handlePress,
  containerStyle = '',
  textStyle = '',
  isLoading = false,
  disabled = false,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      testID="button"
      activeOpacity={0.7}
      className={`bg-secondary rounded-md items-center justify-center ${containerStyle} ${isLoading || disabled ? 'opacity-50' : ''}`}
      onPress={handlePress}
      disabled={disabled || isLoading}
      {...props}
      onPressIn={onPress}
    >
      {isLoading ?
        <LottieView
          source={require("../assets/images/sample.json")} autoPlay loop style={{ width: 25, height: 25 }}
        /> :
        <Text className={`text-center font-bold text-lg text-zinc-300 ${textStyle}`}>{title}</Text>}

    </TouchableOpacity>
  );
};

export default Button