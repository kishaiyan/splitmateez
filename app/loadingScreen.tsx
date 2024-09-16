import LottieView from 'lottie-react-native';
import React from 'react'

export default function LoadingScreen(){
return(
  <LottieView source={require("../assets/images/sample.json")} autoPlay loop style={{width:200, height:200}}/>
)
}