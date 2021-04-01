import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { backIcon, exportIcon } from '../assets/Icons/Index';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Images from './Images';
import Videos from './Videos';


const Tab = createMaterialTopTabNavigator();


export default function Gallery({ navigation }) {


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>

                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                >
                    <Image
                        style={styles.backIcon}
                        source={backIcon}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center' }}>

                    <Text style={styles.headerTitle}>Gallery</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL('content://media/internal/images/media');
                        // Linking.sendIntent('CATEGORY_APP_GALLERY');

                    }}
                >
                    <Image
                        style={styles.backIcon}
                        source={exportIcon}
                    />
                </TouchableOpacity>
            </View>
            <Tab.Navigator>
                <Tab.Screen name="Images" component={Images} />
                <Tab.Screen name="Videos" component={Videos} />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        height: 60,
        width: '100%',
        paddingHorizontal: 25,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
    },
    headerTitle: {
        fontSize: 24,
        color: '#000',
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
        resizeMode: 'contain',
    },
});