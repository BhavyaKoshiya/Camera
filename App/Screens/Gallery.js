import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import { backIcon, closeIcon, leftIcon, rightIcon } from '../assets/Icons/Index';
import ImageView from "react-native-image-viewing";
import Modal from 'react-native-modal';

var imgDesPath = '/storage/emulated/0/MyCamera/Images/';
const numColumns = 3;

export default function Gallery({ navigation }) {

    const [images, setImages] = useState([]);
    const [visible, setIsVisible] = useState(false);
    const [imageIndex, setimageIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    console.log('images', images);
    useEffect(() => {
        // setImages([])
        readFolder();
    }, [])

    const readFolder = () => {

        RNFS.readDir(imgDesPath)
            .then((result) => {

                // setImages(result)
                // let imgpath={...result.path}
                // console.log(result);
                result.reverse().map((item) => {
                    setImages(images => [...images, 'file://' + item.path])
                    // images.push(item.path)
                    // console.log(item.path);
                })
                // images.sort((a, b) => a - b);
                // console.log(imgpath);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }

    const __renderItem = ({ item, index }) => {
        // console.log('item',item);
        return (
            <View key={index} style={styles.item}>
                <TouchableOpacity
                    onPress={() => toggleModal()}
                    onPressIn={() => setimageIndex(index)}>
                    <Image source={{ uri: item }} style={{ height: '100%', }} />
                </TouchableOpacity>
            </View>
        )
    }

    const nextImage = () => {
        if (imageIndex < images.length) {
            setimageIndex(imageIndex + 1)
        }
    }
    const prevImage = () => {
        if (imageIndex > 0) {
            setimageIndex(imageIndex - 1)
        }
    }


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
            </View>
            <FlatList
                data={images}
                // keyExtractor={(index) => index}
                keyExtractor={(item, index) => index}
                renderItem={__renderItem}
                style={{ width: '100%' }}
                numColumns={numColumns}
            />
            {/* <ImageView
                images={images}
                imageIndex={imageIndex}
                visible={visible}
                // FooterComponent={footerComponent}
                onRequestClose={() => { console.log(images), setIsVisible(false) }}
            /> */}
            <Modal isVisible={isModalVisible}
                onBackButtonPress={() => toggleModal()}
                animationIn='fadeIn'
                animationOut='fadeOut'
                deviceHeight={Dimensions.get('screen').height}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                backdropOpacity={1}
                backdropColor='#000'
            >

                <View style={{ flex: 1, justifyContent: 'space-evenly', paddingVertical: 30 }}>


                    <View style={{ backgroundColor: '#000', alignSelf: 'flex-end', height: 40, width: 40, justifyContent: 'center', borderRadius: 40, margin: 10 }}>

                        <TouchableOpacity
                            onPress={() => { setModalVisible(false) }}>
                            <Image
                                source={closeIcon}
                                style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Image
                            style={{ height: '100%', width: '100%', resizeMode: 'contain', }}
                            source={{
                                uri: images[imageIndex],
                            }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 20 }}>

                        <TouchableOpacity
                            onPress={prevImage}
                            style={{ paddingHorizontal: 15 }}
                        >
                            <Image source={leftIcon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={nextImage}
                            style={{ paddingHorizontal: 15 }}
                        >
                            <Image source={rightIcon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        flex: 1,
        margin: 1,
        height: Dimensions.get('window').width / numColumns,
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