import { Tabs } from 'expo-router';
import React from 'react';
import TabBar from '../../components/tabBar';
import { AntDesign } from '@expo/vector-icons';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          
        }}
        
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: 'Home',
            
          }}
        />
        
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
