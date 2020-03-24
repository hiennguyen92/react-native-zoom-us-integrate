/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, ActivityIndicator, ToastAndroid } from 'react-native';
import ZoomUs from 'react-native-zoom-us';
import DialogInput from './DialogInput'

const zoomUserType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: "wynr5X2IlYZZGfSU98uypvvJArrGOVbeC7KY", // TODO: appKey
    appSecret: "Yh22GYWkSSIKuZTWCVsgeJ0y0ik86nbXzbYf", // TODO appSecret
    domain: "zoom.us"
  }
};

type Props = {};
export default class App extends Component<Props> {
  zakTokenRaw = ''; // TODO: meeting zak
  meetingNo = '932340862'; // TODO: meeting number


  constructor(props) {
    super(props);
    this.state = {
      isDialogVisible: false,
      isInitZoom: false
    }
  }


  async componentDidMount() {
    try {
      const initializeResult = await ZoomUs.initialize(
        config.zoom.appKey,
        config.zoom.appSecret,
        config.zoom.domain
      );
      this.setState({ isInitZoom: true })
      //console.warn({ initializeResult });
    } catch (e) {
      //console.warn({ e });
      if (Platform.OS === 'android') {
        ToastAndroid.show('Zoom SDK Initialize Fail', ToastAndroid.SHORT);
      }
    }
  }

  async start() {

    const zakToken = decodeURIComponent(this.zakTokenRaw);
    const displayName = 'Test mentor';

    // TODO recieve user's details from zoom API? WOUT: webinar user is different
    const userId = 'null'; // NOTE: no need for userId when using zakToken
    const userType = zoomUserType;
    const zoomToken = 'null'; // NOTE: no need for userId when using zakToken

    const zoomAccessToken = zakToken;

    try {
      const startMeetingResult = await ZoomUs.startMeeting(
        displayName,
        this.meetingNo,
        userId,
        userType,
        zoomAccessToken,
        zoomToken
      );
      console.warn({ startMeetingResult });
    } catch (e) {
      console.warn({ e });
    }
  }

  async join(meetingNo, displayName = 'Customer') {

    try {
      const joinMeetingResult = await ZoomUs.joinMeeting(
        displayName,
        meetingNo
      );
      //console.warn({ joinMeetingResult });
    } catch (e) {
      console.warn({ e });
    }
  }

  showDialogInputMeetingNo() {
    this.setState({ isDialogVisible: true });
  }

  submitMeetingID(meetingNo) {
    this.setState({ isDialogVisible: false });
    this.join(meetingNo)
  }

  render() {
    const { isInitZoom } = this.state
    return (
      <View style={styles.container}>
        {/* <Button
          onPress={() => this.start()}
          title="Start A Meeting"
        />
        <Text>-------</Text> */}
        {
          isInitZoom ? (
            <Button
              onPress={() => this.showDialogInputMeetingNo()}
              title="Join A Meeting"
            />
          ): (
            <ActivityIndicator size="small" color="#00ff00" />
          )
        }
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Meeting ID"}
          hintInput={"Meeting ID"}
          submitInput={(inputText) => { this.submitMeetingID(inputText) }}
          closeDialog={() => { this.setState({ isDialogVisible: false }); }}>
        </DialogInput>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
