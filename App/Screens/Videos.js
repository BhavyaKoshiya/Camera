import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import { backIcon, playIcon, pauseIcon, forward10Icon, backward10Icon, rePlayIcon, videoIcon, } from '../assets/Icons/Index';
import Modal from 'react-native-modal';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';

var vidDesPath = '/storage/emulated/0/MyCamera/Videos/';
const numColumns = 3;

export default function Videos({ navigation }) {

    const PLAYER_STATES = [{
        PLAYING: 0,
        PAUSED: 1,
        ENDED: 2
    }]

    const videoPlayer = useRef(null);
    const [duration, setDuration] = useState(0);
    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PAUSED);
    const [isLoading, setIsLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [videoIndex, setVideoIndex] = useState(0);
    const [isModalVisible, setModalVisible] = useState(false);
    const [videoName, setVideoName] = useState([]);


    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        setCurrentTime(0);
    };

    console.log('videos', videos);
    useEffect(() => {
        // setVideos([])
        readFolder();
    }, [])

    const readFolder = () => {
        setVideos([])

        RNFS.readDir(vidDesPath)
            .then((result) => {

                // setVideos(result)
                // let imgpath={...result.path}
                console.log(result);
                result.reverse().map((item) => {
                    setVideos(videos => [...videos, 'file://' + item.path])
                    setVideoName(videoName => [...videoName, item.name])
                    // videos.push(item.path)
                    // console.log(item.path);
                });
                // setVideos(result)
                // videos.sort((a, b) => a - b);
                // console.log(imgpath);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
    }
    const formatTime = (secs) => {
        let minutes = Math.floor(secs / 60);
        let seconds = Math.ceil(secs - minutes * 60);
        if (seconds < 10) seconds = `0${seconds}`;
        return `${minutes}:${seconds}`
    };



    const onSeek = (seek) => {
        videoPlayer?.current.seek(seek);
    };

    const onBackward = (seek) => {
        videoPlayer?.current.seek(currentTime - 10);
    };

    const onForward = (seek) => {
        videoPlayer?.current.seek(currentTime + 10);
    };

    const onSeeking = (currentVideoTime) => setCurrentTime(currentVideoTime);

    const onPaused = (newState) => {
        setPaused(!paused);
        setPlayerState(newState);
    };

    const onReplay = () => {
        videoPlayer?.current.seek(0);
        setCurrentTime(0);
        setPlayerState(PLAYER_STATES.PLAYING);
        setPaused(false);
    };

    const onProgress = (data) => {
        if (!isLoading) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(Math.round(data.duration));
        setIsLoading(false);
    };

    const onLoadStart = () => setIsLoading(true);

    const onEnd = () => {
        setPlayerState(PLAYER_STATES.ENDED);
        setCurrentTime(duration);
        setPaused(true);
    };


    const __renderItem = ({ item, index }) => {
        return (
            <View key={index} style={styles.item}>

                <TouchableOpacity
                    onPress={() => toggleModal()}
                    onPressIn={() => setVideoIndex(index)}>
                    <Image source={{ uri: item }} style={{ height: '100%', resizeMode: 'cover' }} />
                    <Image source={videoIcon} style={{ height: 30, width: 30, tintColor:'#fff', resizeMode: 'contain', position: 'absolute', top: Dimensions.get('window').width / numColumns / 2 - 15, left: Dimensions.get('window').width / numColumns / 2 - 15, }} />

                </TouchableOpacity>
            </View>
        )
    }

    // const nextVideo = () => {
    //     if (videoIndex < videos.length) {
    //         setVideoIndex(videoIndex + 1)
    //     }
    // }
    // const prevVideo = () => {
    //     if (videoIndex > 0) {
    //         setVideoIndex(videoIndex - 1)
    //     }
    // }


    return (
        <View style={styles.container}>

            <FlatList
                data={videos}
                // keyExtractor={(index) => index}
                keyExtractor={(item, index) => index}
                renderItem={__renderItem}
                style={{ width: '100%' }}
                numColumns={numColumns}
            />
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

                <View style={{ flex: 1, }}>


                    <Video
                        onEnd={onEnd}
                        onLoad={onLoad}
                        onLoadStart={onLoadStart}
                        posterResizeMode={'cover'}
                        onProgress={onProgress}
                        paused={paused}
                        ref={(ref) => (videoPlayer.current = ref)}
                        resizeMode={'contain'}
                        source={{ uri: videos[videoIndex] }}
                        style={styles.backgroundVideo}
                    />
                    <View style={styles.headerContainer}>

                        <TouchableOpacity
                            onPress={toggleModal}
                        >
                            <Image
                                style={styles.backIcon}
                                source={backIcon}
                            />
                        </TouchableOpacity>

                        <View style={{ flex: 1, alignItems: 'center' }}>

                            <Text style={styles.headerTitle}>{videoName[videoIndex]}</Text>
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity
                                onPress={onBackward}
                                style={{ paddingHorizontal: 15, marginBottom: 10 }}
                            >
                                <Image source={backward10Icon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                            </TouchableOpacity>

                            {
                                currentTime === duration ?
                                    <TouchableOpacity
                                        onPress={onReplay}
                                        style={{ paddingHorizontal: 15, marginBottom: 10 }}
                                    >
                                        <Image source={rePlayIcon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={onPaused}
                                        style={{ paddingHorizontal: 15, marginBottom: 10 }}
                                    >
                                        <Image source={paused ? playIcon : pauseIcon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                                    </TouchableOpacity>
                            }

                            <TouchableOpacity
                                onPress={onForward}
                                style={{ paddingHorizontal: 15, marginBottom: 10 }}
                            >
                                <Image source={forward10Icon} style={{ height: 25, width: 25, alignSelf: 'center', tintColor: '#fff', }} />
                            </TouchableOpacity>

                        </View>

                        <Slider
                            minimumValue={0}
                            value={currentTime}
                            maximumValue={duration}
                            minimumTrackTintColor="dodgerblue"
                            maximumTrackTintColor="#fff"
                            thumbTintColor='dodgerblue'
                            onValueChange={onSeeking}
                            onSlidingComplete={onSeek}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                            <Text style={{ color: 'white' }}>{formatTime(currentTime)}</Text>
                            <Text style={{ color: 'white' }}>-{formatTime(duration - currentTime)}</Text>
                        </View>

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
        margin: 1,
        height: Dimensions.get('window').width / numColumns,
        width: Dimensions.get('window').width / numColumns,
    },
    headerContainer: {
        height: 60,
        width: '100%',
        paddingHorizontal: 25,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
    },
    backIcon: {
        width: 20,
        height: 20,
        tintColor: '#fff',
        resizeMode: 'contain',
    },
    backgroundVideo: {
        flex: 1,
        backgroundColor: '#000',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 20,
    },
});