import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableOpacity,ScrollView,TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Content,Text,Spinner} from "native-base";
import { strings } from '../i18n';
import CalendarPicker from 'react-native-calendar-picker';
import { toastr } from '../component/toastComponent'
import SwitchToggle from "react-native-switch-toggle";
// import { GoogleSignin } from 'react-native-google-signin';
// import firebase from 'react-native-firebase'
import Geolocation from '@react-native-community/geolocation'
import firebase from "react-native-firebase";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let that;
export default class ServiceActive extends React.Component {

  constructor(props){
    super(props);
    this.state = {      
       lists:[],
       senderName:'',
    };
    that = this
  }

    async componentDidMount(){
       
        let uid = await AsyncStorage.getItem("@uid")
        await this.getName(uid, snap=>{
            this.setState({senderName:snap})
        })
        
        this.getChatList(uid, value=>{
            this.setState({lists:value})
        })
    }
    getName = (id, callback) =>{
        firebase.database().ref(`/staff/${id}/`).once("value",snap=>{
            callback(snap.val().fullName)
        })
    }
    getChatList = (id, callback) => {        
        firebase.database().ref(`/chat/`).on("value", snap=>{
            let temp = []
            let tempdata = {}
            Object.keys(snap.val()).map(index=>{
                Object.keys(snap.val()[index]).map(key=>{
                    // console.log(snap.val()[index][key].receiveId, id)
                    if(snap.val()[index][key].receiveId === id){
                        
                        tempdata['id'] = snap.val()[index][key].senderId
                        tempdata['name'] = snap.val()[index][key].senderName
                        // tempdata['read'] = "0"
                        if(snap.val()[index][key].status==="0"){
                            tempdata['read'] = "0"
                        } else if (snap.val()[index][key].status==="1"){
                            tempdata['read'] = "1"
                        }
                        
                    }
                })             
            })
            temp.push(tempdata)
            callback(temp)
            // console.log(tempdata)
        })
    }
    
    goChat =async (chatid, chatName) => {
        
        let id = await AsyncStorage.getItem("@uid") 
        
        let roomId = ''
        if(id>chatid){
            roomId = id+chatid
        } else {
            roomId = chatid+id
        }
        this.props.navigation.navigate("Chat", {
            index:"1",
            roomId:roomId,
            chatId:chatid,
            chatName:chatName,
            senderId:id,
            senderName:this.state.senderName
        })
        console.log(roomId)
    }

    
 

  render() {
  
    return (
        <Container>
             {/* <ScrollView> */}
            <ImageBackground
                resizeMode={'stretch'}
                style={{height:screenHeight}}
                source={require('../Resources/bg.jpg')}
            >   
            
                <Content style={{marginTop:160, marginBottom:70}}>
                    <ScrollView>
                        {
                            this.state.lists.map((data, index)=>{
                                return(
                                    <TouchableOpacity key={index} style={{height:50, width:screenWidth/1.2, backgroundColor:'#7e5958', alignSelf:'center', marginBottom:10, borderRadius:5, opacity:0.5, alignItems:'center', paddingHorizontal:20, flexDirection:'row' }}
                                        onPress = {()=>this.goChat(data.id, data.name)}>
                                        <Text style={{color:"white",fontFamily:"dbfut_b0"}}>{data.name}</Text> 
                                        {
                                            data.read === '0'&&
                                            <View style={{height:30, width:30, backgroundColor:'red', borderRadius:30, position:'absolute', right:20}}/> 

                                        }
                                    </TouchableOpacity>
                                )
                            })
                        }
                       
                        
                    </ScrollView>
                </Content>

               
            </ImageBackground>
            {/* </ScrollView> */}
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", position:'absolute', bottom:30, left:30}} >
                             
                <TouchableHighlight 
                onPress={()=>{this.props.navigation.goBack()}}
                >
                    <Image
                        resizeMode={'contain'}
                        style={{width:40,height:40, marginRight:100}}
                        source={require('../Resources/iconback.png')}
                        
                    /> 
                </TouchableHighlight>
                
            </View>  
        </Container>
    );
  }
}

const styles={
    searchSection: {
        flex: 1,
        marginTop:15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7a7a79',
        height:35,
        color:"white"
        
    },
    input: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#7a7a79',
        color: 'white',
        fontFamily:"dbfut_r0"
        
    },
}