import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { switchIcon, circleIcon, galleryIcon, flashAutoIcon, flashOnIcon, flashOffIcon, flashTorchIcon, stopIcon } from '../assets/Icons/Index';
import RNFS from 'react-native-fs';
import moment from 'moment';

// var RNFS = require('react-native-fs');

export default function Camera({ navigation }) {

    let camera = useRef(RNCamera);

    const [front, setFront] = useState(false);
    const [mode, setMode] = useState(true);
    const [flash, setFlash] = useState('auto');
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    var imgDesPath = '/storage/emulated/0/MyCamera/Images/';
    var vidDesPath = '/storage/emulated/0/MyCamera/Videos/';

    useEffect(() => {
        RNFS.mkdir(imgDesPath)
            .then((result) => {
                // console.log('Directory Created')
            })
            .catch((error) => {
                console.warn('mkdir Photo error', error)
            })
        RNFS.mkdir(vidDesPath)
            .then((result) => {
                // console.log('Directory Created')
            })
            .catch((error) => {
                console.warn('mkdir Video error', error)
            })

    }, [])

    const toggleCamera = () => {
        setFront(!front);
    }

    const fileName = (str) => {
        return str.split('\\').pop().split('/').pop();
    }

    const toggleFlash = () => {
        if (flash === 'auto') {
            setFlash('on')
        } else if (flash === 'on') {
            setFlash('off')
        } else if (flash === 'off') {
            setFlash('torch')
        } else if (flash === 'torch') {
            setFlash('auto')
        }

    }

    const takeVideo = async () => {
        if (camera) {
            try {
                const promise = camera.recordAsync();

                if (promise) {
                    setIsRecording(true)
                    // this.setState({ isRecording: true });
                    const data = await promise;
                    setIsRecording(false)
                    // this.setState({ isRecording: false });
                    console.warn('takeVideo', data);
                    const timestamp = moment(new Date()).format("YYYYMMDDHHmmss");

                    RNFS.moveFile(data.uri, vidDesPath + 'VID-' + timestamp + '.mp4')
                        .then((success) => {
                            console.log('FILE Copied to: ' + vidDesPath + fileName(data.uri));
                            // alert('FILE Copied to: ' + desPath + fileName(capturedImg.uri));
                        })
                        .catch((err) => {
                            console.log('FILE Error:', err.message);
                        });

                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const stopRec = () => {
        camera.stopRecording();
    }

    const capturePicture = async () => {
        if (camera) {

            await camera.takePictureAsync()
                .then((capturedImg) => {
                    console.log('Flash Mode:' + flash, capturedImg);
                    console.log('FileName:', fileName(capturedImg.uri));

                    const timestamp = moment(new Date()).format("YYYYMMDDHHmmss");

                    RNFS.moveFile(capturedImg.uri, imgDesPath + 'IMG-' + timestamp + '.jpg')
                        .then((success) => {
                            console.log('FILE Copied to: ' + imgDesPath + fileName(capturedImg.uri));
                            // alert('FILE Copied to: ' + desPath + fileName(capturedImg.uri));
                        })
                        .catch((err) => {
                            console.log('FILE Error:', err.message);
                        });

                })
                .catch((error) => {
                    console.log('Could not capture image.', error);
                });
        }
    }



    return (
        <View style={styles.container}>
            {/* <Text>Index</Text> */}

            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 30, marginTop: -50 }}>

                {/* Switch Flash */}
                <TouchableOpacity
                    style={styles.secondButtonContainer}
                    onPress={toggleFlash}
                >
                    <Image source={flash === 'torch' ? flashTorchIcon : flash === 'on' ? flashOnIcon : flash === 'off' ? flashOffIcon : flashAutoIcon} style={styles.secondButtonIcon} />
                </TouchableOpacity>

            </View>
            <RNCamera
                ref={(ref) => { camera = ref }}
                style={{ width: "100%", padding: 20, height: Dimensions.get('screen').width }}
                type={front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                useNativeZoom
                playSoundOnCapture
                flashMode={flash === 'torch' ? RNCamera.Constants.FlashMode.torch : flash === 'on' ? RNCamera.Constants.FlashMode.on : flash === 'off' ? RNCamera.Constants.FlashMode.off : RNCamera.Constants.FlashMode.auto}
            >
                <View style={{ flex: 1 }} />
            </RNCamera>


            <View style={{ flex: 1, justifyContent: 'center', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 30, }}>
                    <TouchableOpacity
                        style={{ padding: 20, }}
                        onPress={() => setMode(true)}
                    >
                        <Text style={{ color: mode ? 'dodgerblue' : '#fff' }}>Photo</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ padding: 20 }}
                        onPress={() => setMode(false)}
                    >
                        <Text style={{ color: mode ? '#fff' : 'dodgerblue' }}>Video</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', }}>


                    {/* isRecording ? Nothing : Open Gallery */}
                    {isRecording ?
                        <View style={{ height: 50, width: 50, }} />
                        :
                        <TouchableOpacity
                            style={styles.secondButtonContainer}
                            onPress={() => navigation.navigate('Gallery')}
                        >
                            <Image source={galleryIcon} style={styles.secondButtonIcon} />
                        </TouchableOpacity>
                    }


                    {/* Click Photo / Capture Video */}

                    {
                        mode ?
                            < TouchableOpacity
                                style={styles.mainButton}
                                onPress={capturePicture}
                            >
                                <Image source={circleIcon} style={styles.photoButton} />
                            </TouchableOpacity>
                            :
                            isRecording ?
                                < TouchableOpacity
                                    style={styles.mainButton}
                                    onPress={stopRec}
                                >
                                    <View style={{ height: 60, width: 60, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image source={stopIcon} style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: 'red' }} />
                                    </View>

                                </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    style={styles.mainButton}
                                    onPress={takeVideo}
                                >
                                    <Image source={circleIcon} style={styles.videoButton} />
                                </TouchableOpacity>
                    }

                    {/* isRecording ? Capure Image While Rec : Switch Camera */}
                    {isRecording ?
                        <TouchableOpacity
                            style={styles.secondButtonContainer}
                            onPress={capturePicture}
                        >
                            <Image source={circleIcon} style={styles.secondButtonIcon} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={styles.secondButtonContainer}
                            onPress={toggleCamera}
                        >
                            <Image source={switchIcon} style={styles.secondButtonIcon} />
                        </TouchableOpacity>
                    }

                </View>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    secondButtonContainer: {
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(71, 71, 71, 0.50)',
    },
    mainButton: {
        height: 75,
        width: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: 'rgba(71, 71, 71, 0.50)',
    },
    photoButton: {
        height: 60,
        width: 60,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
    videoButton: {
        height: 60,
        width: 60,
        resizeMode: 'contain',
        tintColor: 'red',
    },
    secondButtonIcon: {
        height: 30,
        width: 30,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
});