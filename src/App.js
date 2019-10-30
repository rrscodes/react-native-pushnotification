import React, { Component } from "react";
import {
    View,
    StyleSheet,
    AsyncStorage,
    Text,
    Alert
} from "react-native";
import firebase from 'react-native-firebase';

export default class App extends Component {

    constructor() {
        super();
        this.state={
          regToken:''
        }
    }

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners(); 
      }

  //1
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    console.log('check 1')
    if (enabled) {
        console.log('check 2')
        this.getToken();
    } else {
        console.log('check 3')
        this.requestPermission();
    }
  }
  
    //3
  async getToken() {
    const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            this.setState({regToken:fcmToken});
            await AsyncStorage.setItem("deviceRegID", fcmToken)
            console.log('token:'+this.state.regToken);
        } else {
            // user doesn't have a device token yet
            console.log("Not Found");


        }
        return fcmToken;
  }
  
    //2
  async requestPermission() {
    console.log('check 7')
    try {
      console.log('check 8')
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  componentWillUnmount() {
    // this.notificationListener();
    this.notificationOpenedListener();
  }
  
  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text>Test</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    }
});