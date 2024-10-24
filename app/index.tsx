import React from 'react';
import { Amplify } from 'aws-amplify';
import { PaperProvider } from 'react-native-paper';
import config from "../src/amplifyconfiguration.json";
import Welcome from "../components/welcome";
import { Buffer } from "buffer";
import axios from "axios";
global.Buffer = Buffer;

Amplify.configure(config);

export default function app() {
  return (

    <PaperProvider>
      <Welcome />
    </PaperProvider>

  )
}


