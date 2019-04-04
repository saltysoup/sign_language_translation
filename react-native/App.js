import React from 'react';
//import Auth from '@aws-amplify/auth';
import { Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Camera, Permissions, ImageManipulator } from 'expo';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      hasCameraPermission: null,
      predictions: [],
      burstMode: false
    };
  };
  

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };

  capturePhoto = async () => {
    if (this.camera) {
      console.log("taking photo")
      let photo = await this.camera.takePictureAsync();
      return photo.uri;
    }
  };

  resize = async photo => {
    height_res = 300;
    width_res = 300;
    console.log("resizing photo to X: " + height_res + " Y: " + width_res); //debugging
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: height_res, width: width_res } }],
      { base64: true },
      { format: 'jpeg' }
    );
    return manipulatedImage.base64;
  };

  // signlanguagetranslation stuff
  predict = async image => {
    console.log("sending photo to signlanguagetranslation api"); //debugging
    let formdata = new FormData();
    formdata.append("image", image);
    let data = {
      method: 'POST',
      body: formdata,
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
      }
    };
    return fetch('http://signlanguage-1884947347.ap-southeast-2.elb.amazonaws.com/api/infer', data)
    //fetch('http://localhost:8000/api/infer', data)
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({
      predictions: responseJson
      });         
    })
    .catch((error) => {
      console.error(error);
    });
  };

  loopFunction = async () => {
    let maxTimes = 30;
    for (i = 0; i < maxTimes; i++){
      console.log("running detection for", i, "times");
      let photo = await this.capturePhoto();
      let resized = await this.resize(photo);
      await this.predict(resized);
      //this.setState({ predictions: predictions});
    }
  };

  render() {
    const { hasCameraPermission, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column',
                justifyContent: 'flex-end'
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignSelf: 'flex-start',
                  alignItems: 'center',
                }}
              >
              
                <FlatList
                  data={
                    this.state.predictions
                    }
                  renderItem={({ item }) => (
                    <Text style={{ paddingTop: 20, paddingLeft: 15, color: 'white', fontSize: 30 }}>{item}</Text>
                  )}
                />
              </View>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  backgroundColor: '#FF9900',
                  height: '10%',
                }}
                onPress={
                    this.loopFunction
                  }
                >
                <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
                  {' '}
                  Detect Sign Language!{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  };

}

