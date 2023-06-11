import React, { useEffect, useRef, useState } from 'react';
import { View, Button, PermissionsAndroid } from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';

const VideoCallScreen = () => {
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        // Request camera permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Video call requires access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const requestAudioPermission = async () => {
      try {
        // Request audio permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Audio Permission',
            message: 'Video call requires access to your microphone.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Audio permission granted');
        } else {
          console.log('Audio permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    // Request camera and audio permissions on component mount
    requestCameraPermission();
    requestAudioPermission();
  }, []);

  const startCall = async () => {
    try {
      const constraints = { audio: true, video: true };
      // Get the user's media stream (audio and video)
      const stream = await mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      setIsCalling(true);
    } catch (err) {
      console.warn('Error accessing media devices:', err);
    }
  };

  const endCall = () => {
    // Release the local media stream
    localStream.current.release();
    setIsCalling(false);
  };

  const renderLocalStream = () => {
    return (
      <RTCView
        streamURL={localStream.current && localStream.current.toURL()}
        style={{ flex: 200 }}
      />
    );
  };

  const renderRemoteStream = () => {
    return (
      <RTCView
        streamURL={remoteStream.current && remoteStream.current.toURL()}
        style={{ flex: 200 }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {isCalling ? (
        <>
          {renderLocalStream()}
          {renderRemoteStream()}
          <Button title="End Call" onPress={endCall} />
        </>
      ) : (
        <Button title="Start Call" onPress={startCall} />
      )}
    </View>
  );
};

export default VideoCallScreen;
