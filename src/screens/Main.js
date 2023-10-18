import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Video } from "expo-av";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";

import FlashButton from "../components/FlashButton";
import ToggleCamera from "../components/ToggleCamera";
import PermissionDenied from "../components/PermissionDenied";

const Main = () => {
  const cameraRef = useRef();

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [video, setVideo] = useState();
  const [isMuted, setIsMuted] = useState(false);

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);

  useEffect(() => {
    (async () => {
      const cameraStatusPermission =
        await Camera.requestCameraPermissionsAsync();
      const audioStatusPermission =
        await Camera.requestMicrophonePermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(cameraStatusPermission.status === "granted");
      setHasAudioPermission(audioStatusPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();

    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  if (
    hasCameraPermission === null ||
    hasAudioPermission === null ||
    hasMediaLibraryPermission === null
  ) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (
    hasCameraPermission === false ||
    hasAudioPermission === false ||
    hasMediaLibraryPermission === false
  ) {
    return <PermissionDenied onRetryPress={PermissionDenied} />;
  }

  const startRecording = () => {
    setIsRecording(true);
    ToastAndroid.showWithGravityAndOffset(
      "Recording Started",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      30
    );
    let options = {
      maxDuration: 60,
      mute: false,
    };
    cameraRef.current.recordAsync(options).then((recordedVideo) => {
      setVideo(recordedVideo);
      setIsRecording(false);
      setRecordingDuration(false);
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingDuration(false);
    cameraRef.current.stopRecording();
    ToastAndroid.showWithGravityAndOffset(
      "Stopped Recording",
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      30
    );
  };

  if (video) {
    const shareVideo = async () => {
      shareAsync(video.uri).then(() => {
        ToastAndroid.showWithGravityAndOffset(
          "Video Shared",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          30
        );
      });
    };

    const toggleMute = async () => {
      if (cameraRef.current) {
        try {
          await cameraRef.current.setIsMutedAsync(!isMuted); // Toggle mute status
          setIsMuted(!isMuted); // Update the state variable based on new mute status
  
          // Show toast message based on mute status
          const toastMessage = isMuted ? "Video Unmuted" : "Video Muted";
          ToastAndroid.showWithGravityAndOffset(
            toastMessage,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            30
          );
        } catch (error) {
          console.error("Error toggling mute status:", error);
        }
      }
    };

    const saveVideo = () => {
      MediaLibrary.saveToLibraryAsync(video.uri).then(() => {
        setVideo(undefined);
        ToastAndroid.showWithGravityAndOffset(
          "Video Saved",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          30
        );
      });
    };

    const deleteVideo = () => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to discard the video?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              setVideo(undefined);
              ToastAndroid.showWithGravityAndOffset(
                "Video deleted",
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                30
              );
            },
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <SafeAreaView style={styles.container}>
        <Video
          style={styles.video}
          ref={cameraRef}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode="cover"
          shouldPlay
          isMuted={false}
          isLooping
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.trashButton}>
            <Ionicons
              name="trash-outline"
              size={40}
              color={"white"}
              onPress={deleteVideo}
            />
          </TouchableOpacity>

          {hasMediaLibraryPermission ? (
            <TouchableOpacity>
              <Ionicons
                name="download-outline"
                size={40}
                color={"white"}
                onPress={saveVideo}
              />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity>
            <Ionicons
              name="share-social-outline"
              size={40}
              color={"white"}
              onPress={shareVideo}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={40}
              color={"white"}
              onPress={toggleMute}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        type={type}
        flashMode={flash}
        ratio="16:9"
        style={styles.camera}
      >
        {isRecording ? (
          <View style={styles.recordingTimer}>
            <Text style={styles.timerText}>
              {formatTime(recordingDuration)}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <View
            style={
              isRecording ? styles.recordingButton : styles.notRecordingButton
            }
          ></View>
          <View
            style={
              isRecording ? styles.recordingButton : styles.notRecordingButton
            }
          ></View>
        </TouchableOpacity>

        {!isRecording ? (
          <FlashButton
            onPress={() => {
              setFlash(
                flash === Camera.Constants.FlashMode.off
                  ? Camera.Constants.FlashMode.on
                  : Camera.Constants.FlashMode.off
              );
            }}
            isFlashOn={flash === Camera.Constants.FlashMode.on}
          />
        ) : null}

        {!isRecording ? (
          <ToggleCamera
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          />
        ) : null}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  camera: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 3,
  },
  notRecordingButton: {
    width: "80%",
    height: "80%",
    borderRadius: 35,
    position: "absolute",
    backgroundColor: "white",
  },
  recordingButton: {
    width: "65%",
    height: "65%",
    borderRadius: 8,
    position: "absolute",
    backgroundColor: "red",
  },
  recordingTimer: {
    backgroundColor: "red",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 40,
    fontSize: 15,
    padding: 10,
    position: "absolute",
    top: Dimensions.get("window").height / 1.2 - 0,
    borderRadius: 25,
  },
  timerText: {
    color: "white",
  },
  buttonContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  trashButton: {
    position: "absolute",
    right: 340,
    top: 0,
  },
  shareButton: {
    position: "absolute",
    right: 20,
    top: 0,
  },
  downloadButton: {
    position: "absolute",
    right: 20,
    top: 40,
  },
});

export default Main;
