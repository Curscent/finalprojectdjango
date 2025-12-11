// frontend/navigation/AppNav.js (FULL, UPDATED CODE)

import React, { useContext } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// --- Import Screens (Auth Stack) ---
import LoginScreen from '../screens/LoginScreen'; 
import RegisterScreen from '../screens/RegisterScreen'; 

// --- Import Screens (App Stack) ---
import MediaList from '../screens/MediaList'; 
import MediaAdd from '../screens/MediaAdd'; 
import MediaEdit from '../screens/MediaEdit'; 
import MediaDelete from '../screens/MediaDelete'; 

// --- Authentication Stack (Login/Register) ---
const AuthStack = createNativeStackNavigator();
const AuthScreens = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
);

// --- App Stack (Protected Screens) ---
const AppStack = createNativeStackNavigator();
const AppScreens = () => (
    <AppStack.Navigator>
        
        <AppStack.Screen 
            name="MediaList" 
            component={MediaList} 
            options={{ title: "Digital Dietitian (Backlog)" }}
        />
        
        <AppStack.Screen 
            name="MediaAdd" 
            component={MediaAdd} 
            options={{ title: "Add New Item" }}
        />
        
        <AppStack.Screen 
            name="MediaEdit" 
            component={MediaEdit} 
            options={{ title: "Edit Item" }}
        />
        
        <AppStack.Screen 
            name="MediaDelete" 
            component={MediaDelete} 
            options={{ title: "Move to Trash" }} 
        />
        
    </AppStack.Navigator>
);

const AppNav = () => {
    const { isLoading, userInfo } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return userInfo ? <AppScreens /> : <AuthScreens />;
};

export default AppNav;