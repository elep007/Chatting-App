import React from 'react';
import {  
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableHighlight, 
  Dimensions
 } from 'react-native';
 import { strings } from '../i18n';
 const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
 export default class ModalComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
        };
      
    }
    render() {
      
        return (
            <View>
                <Modal animationType = {"slide"} transparent = {true}
                    visible = {this.props.visible}
                    onRequestClose = {() => { console.log("Modal has been closed.") } }>
            
                    <View style = {styles.container}>
                        <Image 
                            source={require('../Resources/ServicesPhoneConfirm.jpg')} 
                            style={styles.succssImg}
                            resizeMode={'stretch'}
                        />
                        <View style={{position:"absolute", width:screenWidth/1.2,height:130,padding:10}}>
                            <Text style = {styles.normalTxt}>{this.props.txt}</Text>
                            <TouchableHighlight onPress = {this.props.toggleModal}
                                style={styles.OKbtn}  
                            >
                            
                                <Text style = {styles.OKTxt}>Ok</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

}

const styles = StyleSheet.create({
        container:{
           
 
            height:130,
            marginTop:screenHeight/3,
            justifyContent:"center",
            alignItems:"center",
            flexDirection:"column"
        },
        succssImg:{
            width:screenWidth/1.2,
            height:130
        },
        normalTxt:{

            
            color:"#fff",
            fontSize:20,
            marginTop:10, 
            textAlign:"center",
            fontFamily:"dbfut_r0"
        },

        OKbtn:{
            width:70,
            height:30,
            backgroundColor:"#c58f8f",
            justifyContent:"center",
            alignItems:"center",
            marginTop:10,
            alignSelf:"flex-end",
            marginRight:30
        
        },
        OKTxt:{
            color:"#fff",
            textAlign:"center",
            fontFamily:"dbfut_r0"
        },


})

