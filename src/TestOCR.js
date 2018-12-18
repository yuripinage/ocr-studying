import React, { Component } from 'react'
import { StyleSheet, View, Button, ActivityIndicator, Image, Text, TouchableOpacity, ScrollView } from 'react-native'
import * as axios from 'axios'
import ImagePicker from 'react-native-image-picker'
import { RNCamera } from 'react-native-camera'
import {captureRef, captureScreen} from "react-native-view-shot";
import Spinner from 'react-native-loading-spinner-overlay'

//435, 290
const PendingView = () => (
    <View
      style={{
        width: '25%',
        height: 150,
        backgroundColor: '#26C6DA50',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );

export default class TestOCR extends Component {

    constructor(props) {
        super(props)

        this.state = { loading: false, showCamera: true };
    }

    render() {

        return (
            <View style={styles.container}>

                {this.renderCamera()}

                {this.state.imageData && this.renderImage()}

                <Spinner visible={this.state.loading} color='#80DEEA' overlayColor='#00000075' />
            </View>
        )
    }

    renderImage = () => {
        return(
            <View style={{ padding: 20, backgroundColor: 'transparent' }} ref='result' >
                <Image 
                    source={{uri: `data:image/jpeg;base64,${this.state.imageData}`}} style={{ width: 300, height: 300 }}
                    resizeMode="contain"  
                    />
                <View style={{
                    width: 50, height: 50, backgroundColor: '#26C6DA50', position:'absolute',
                    top: 150, left: 150
                }}/>
            </View>
        )
    }

    renderCamera = () => {
        return (
            <View style={styles.containerCamera} ref="preview">
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    permissionDialogTitle={'Permission to use camera'}
                    permissionDialogMessage={'We need your permission to use your camera phone'}
                    >
                        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => this.takeScreenShot('preview')} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}> SHOT </Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => this.setState({imageData: ''})} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}> CLEAR </Text>
                            </TouchableOpacity> */}
                        </View>
                </RNCamera>
            </View>
        )
    }

    takeScreenShot = ref => {

        // if(this.state.imageData)
        //     ref === 'result'

        captureRef(this.refs[ref], {
            format: "jpg",
            quality: 1,
            result: 'tmpfile'
        })
        .then(
            result => {
                console.log("Image saved to", result)
                this.handleOCR(result)
                this.setState({ imageData: result })
                // if(ref === 'preview')
                //     setTimeout(() => this.takeScreenShot('result'), 300)
            },
            error => console.error("Oops, snapshot failed", error)
        );
    }

    handleOCR =  photo => {

        const formData = new FormData();

        formData.append('image', {
            // uri: `data:image/png;base64,${photo.base64}`,
            uri: photo,
            name: 'image.jpeg',
            type: 'multipart/form-data'
        })
        formData.append('budget_id', 1)

        console.log(formData)

        this.setState({ loading: true })

        axios.post(
			'https://api.csodev.idx.digital/v1/cnh',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
		)
		.then(
			(response) => {
				console.log('response', response)
				console.log('response.data', response.data)
                this.setState({ responseData: response.data, loading: false })
            },
			(error) => {
                console.log(error.response)
			}
		)

        // fetch('https://api.csodev.idx.digital/v1/cnh', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //         body: formData
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         this.setState({ loading: false });
        //         console.log(data)
        //     })    
        //     .catch(error => {
        //         this.setState({ loading: false });
        //         console.log('error', error)
        //     })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    containerCamera: {
        // width: 290,
        // height: 193.3,
        width: 580,
        height: 390,
        flexDirection: 'column',
        backgroundColor: 'black',
        // height: 300
      },
      preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
      },
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
      }
});
