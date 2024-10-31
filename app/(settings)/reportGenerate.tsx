import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Stack } from 'expo-router'
import { View, Text, Pressable, Linking, Alert } from 'react-native';
import AppBar from '../../components/appBar';
import Button from '../../components/customButton';
import axios from 'axios'
import { useGlobalContext } from '../../context/GlobalProvider';
import { MaterialIcons } from '@expo/vector-icons';

const reportGenerate = () => {
  const { state } = useGlobalContext()
  const { user } = state
  const [report, setReport] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  async function generateReport() {
    setReportLoading(true)
    try {
      const response = await axios.get(`http://13.54.1.10:5000/generateReport?tenant_id=${user}`)
      console.log(response.data)
      if (response.data.stausCode === 301) {
        Alert.alert("No Data Found", response.data.message)
      }
      if (response.data.statusCode === 200) {
        console.log(response.data.pdf_url)
        setReport(response.data.pdf_url)
      }
    } catch (error) {
      // console.error('Error generating report:', error)
    }
    setReportLoading(false)
  }

  const handleDownload = async () => {
    if (!report) return;

    try {
      await Linking.openURL(report);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to download report: ' + error.message
      );
    }
  };


  return (
    <SafeAreaView className='bg-primary flex-1 px-4'>
      <Stack.Screen options={{
        headerShown: false
      }} />
      <AppBar leading={true} />
      <View className="flex-1 flex-col ">
        <Text className='text-secondary text-2xl font-semibold mb-4'>
          Generate Report
        </Text>
        <View className=' rounded-md p-3'>
          <Text className='text-zinc-200 text-sm' style={{ textAlign: 'justify' }}>
            Unlock the power of your data with our cutting-edge AI-generated report! By meticulously analyzing your usage trends and utility patterns, we deliver personalized insights that can help you optimize your consumption and save on costs. Once your report is ready, you'll receive a beautifully formatted PDF that's easy to download and share. While the generation process may take a moment, the invaluable information you'll gain is well worth the wait. Experience the future of utility management today!
          </Text>
        </View>

        <View className='mt-5'>
          {report && (
            <Pressable
              onPress={handleDownload}
              className='flex-row items-center gap-2 p-3 rounded-md bg-secondary'
            >
              <MaterialIcons name='file-present' size={24} color="#ffffff" />
              <Text className='text-white font-semibold'>Download Report</Text>
            </Pressable>
          )}
        </View>
      </View>
      <View className="flex items-center justify-center">
        <Button
          title="Get Report"
          className='px-3 py-2 mb-4'
          disabled={reportLoading}
          isLoading={reportLoading}
          onPress={() => generateReport()}
        />
      </View>
    </SafeAreaView>
  )
}

export default reportGenerate