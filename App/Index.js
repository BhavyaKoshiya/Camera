import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Camera from './Screens/Camera'
import Gallery from './Screens/Gallery';

const Stack = createStackNavigator();


export default function Index() {

    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Camera" >
          <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
          <Stack.Screen name="Gallery" component={Gallery} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
};