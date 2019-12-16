import React from 'react';
import { View, TouchableOpacity, Text,TextInput, ScrollView, Image } from 'react-native';
import { Container, Header, Content,Tab, Tabs, Left, Right,  Body, Button, Item, Input } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay';
import {Dimensions } from "react-native";
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

// import firebase from 'react-native-firebase';

const screenHeight = Math.round(Dimensions.get('window').height);

const screenWidth = Math.round(Dimensions.get('window').width);

let check = ''

let session;
class Chat extends React.Component {

    constructor(props){
        super(props)
        this.state={
            isVisbleImage:false,
            senderId:'',
            senderName:'',
            receiverName:'',
            receiverId:'',
            message:'',
            messagesData:[],
            roomId:'',
            currentUser:'',
            clientName:'',  
            data:{},
            firstImg:'',
            loading:false   
        }
        session = this;
    }

    async componentDidMount(){
        let index = this.props.navigation.getParam("index")
        if(index==="1"){
            let roomId = this.props.navigation.getParam("roomId")
            let chatId = this.props.navigation.getParam("chatId")
            let receiverName = this.props.navigation.getParam("chatName")
            let senderId = this.props.navigation.getParam("senderId")
            let senderName = this.props.navigation.getParam("senderName")
            console.log(roomId, chatId,senderId, receiverName, senderName)
            this.setState({roomId:roomId,senderId:senderId, receiverId:chatId, receiverName:receiverName, senderName:senderName})
            this.getMessage(roomId, messages=>{
                this.setState({messagesData:messages})
            })
        }else {
            let id = this.props.navigation.getParam("Id")
        
            let data = this.props.navigation.getParam("data")
            let chatId = data.user.userId
            console.log(id, chatId)
            let roomId = ''
            if(id>chatId){
                roomId = id+chatId
            } else {
                roomId = chatId+id
            }
            this.setState({roomId:roomId, data:data, senderId:id, receiverId:chatId, senderName:data.staff.fullName, receiverName:data.user.username})
            console.log(roomId)  
            this.getMessage(roomId, messages=>{
                this.setState({messagesData:messages})
            })   
        }
                   
    }

    selectPhotoTapped = (data) => {
        const options = {
          quality: 1.0,
          maxWidth: 500,
          maxHeight: 500,
          storageOptions: {
            skipBackup: true
          }
        };    
        ImagePicker.showImagePicker(options, async (response) => {
            console.log('Response = ', response);    
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {                  
                    this.setState({firstImg: response.uri, isVisbleImage:true})
                    await this.uploadImage(response.uri.toString(),"first")                       
                }
        });
    }
    uploadImage = (image, index) => {
        this.setState({loading:true})
        let filename = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        firebase.storage().ref('chat/'+ filename).putFile(image)
        .then(data=>{
            console.log(data.downloadURL)
            if(index==='first'){
                this.setState({firstImg:data.downloadURL})
                // this.setState({loading:false})
            }
        })
    }

    getMessage = async (roomId, callback) => {
        let temp = []
        await firebase.database().ref(`/chat/${roomId}`).on("child_added", snap=>{
            if(snap.exists()){
                // console.log(snap.val())
                temp.push(snap.val())
                callback(temp)
            }
        })
         
    }
   
   
    changeRead = async () => {
        let CHATROOM= this.state.roomId
        let Ids     = await AsyncStorage.getItem('@uid') 
        let dbCon = firebase.database().ref(`/chat/${CHATROOM}`);
        dbCon.once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                console.log(child.val())
                if(child.val().receiveId === Ids){
                    child.ref.update({
                    status: '1'
                    });
                }                
            });
        });
    }
    getTime =()=> {
        let now = new Date();
        let year = "" + now.getFullYear();
        let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    } 

    sendMessage = async () => { 
        const {senderId, receiverId, senderName, receiverName, roomId, firstImg, message} = this.state 
        let time = this.getTime()
        console.log(senderId, receiverId, senderName, receiverName);
        firebase.database().ref(`/chat/${roomId}/`).once("value", snap=>{
            let index = 0
            if(snap.exists()){
                Object.keys(snap.val()).map(data=>{
                    index = parseInt(data)
                })
                index += 1
            } else {
                index = 0
            }
            firebase.database().ref(`/chat/${roomId}/${index}/`).set({
                senderId:senderId,
                receiveId:receiverId,
                senderName:senderName,
                receiverName:receiverName,
                dateTime: time,
                text:message,
                image:firstImg,
                status:"0"
            })
            .then(data=>{
                this.setState({message:'', firstImg:'', isVisbleImage:false})})
            .catch(error=>{alert(error)})
        })
        
    }

    render() {
        // console.log('=======********=======',session.state.messagesData)
        return(
            <View style={{flex:1,}}>
                <Spinner
                        visible={this.state.loading}
                        textContent={'Uploading...'}
                        textStyle={{color: '#FFF'}}/> 
                <Header style={{backgroundColor:'#1d1d1b', justifyContent:'flex-start'}}>
                    <Left style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>

                        
                           
                                <TouchableOpacity 
                                onPress={()=>{
                                    if(this.props.navigation.getParam("index")==='1'){
                                        this.props.navigation.pop()
                                        // this.props.navigation.replace("ChatList")
                                    } else {
                                        this.props.navigation.goBack()
                                    }
                                }}
                                >
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:40,height:40, marginRight:20}}
                                        source={require('../Resources/iconback.png')}
                                        
                                    /> 
                                </TouchableOpacity>
                        
                        <Text style={{color:'white', fontFamily:'Poppins-Black'}}>Mr. {this.state.receiverName}</Text>
                    </Left>
                    
                </Header>                
                <View style={{flex:1, backgroundColor:'#edeef7'}}>
                    <ScrollView 
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight)=>{        
                            this.scrollView.scrollToEnd({animated: true});
                        }}>
                    {this.state.messagesData.length>0 &&
                        this.state.messagesData.map((data, index)=>{
                            // console.log('=====---------=====',data.val().sendId)
                            return(
                                data.senderId===session.state.senderId?                                
                                <View style={{justifyContent:'flex-end',}} key = {index}> 
                                    {data.image===''&& data.text!==''?
                                    <View style={{  backgroundColor:'#4a9ef2',alignSelf: 'flex-end', maxWidth: screenWidth/1.3, borderRadius:3,marginVertical:2, marginHorizontal:15, }}>                           
                                        <Text style={{fontSize:10,margin:5,color:'white'}}>You:</Text>
                                        <Text style={{fontSize:20,margin:5,color:'white'}}>{data.text}</Text>
                                        <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end'}}>{data.dateTime}</Text>                                   
                                    </View>  
                                    :
                                    <View style={{  backgroundColor:'#4a9ef2',alignSelf: 'flex-end', maxWidth: screenWidth/1.3, borderRadius:3,marginVertical:2, marginHorizontal:15,padding:5, alignItems:'center' }}>                           
                                        <Image source = {{uri:data.image}} style={{width:screenWidth/1.3,height:screenHeight/2, resizeMode:'contain',}}/>
                        
                                    </View> 
                                    }    
                                    
                                    {data.image!==''&& data.text!==''&&
                                    
                                        <View style={{  backgroundColor:'#4a9ef2',alignSelf: 'flex-end', maxWidth: screenWidth/1.3, borderRadius:3,marginVertical:2, marginHorizontal:15,padding:5  }}>                           
                                            <Image source = {{uri:data.image}} style={{width:screenWidth/1.3,height:screenHeight/2, resizeMode:'contain',}}/>
                                            <Text style={{fontSize:10,margin:5,color:'white'}}>You:</Text>
                                            <Text style={{fontSize:20,margin:5,color:'white'}}>{data.text}</Text>
                                            <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end'}}>{data.dateTime}</Text>      
                            
                                        </View> 
                                    }                                                                  
                                </View>
                                :
                                <View style={{justifyContent:'flex-start'}} key = {index}>  
                                    {data.image===''&& data.text!==''?                             
                                        <View style={{alignSelf: 'flex-start', maxWidth: screenWidth/1.3, borderRadius:3,backgroundColor:'white', marginVertical:2, marginHorizontal:15, }}>                           
                                            <Text style={{fontSize:10,margin:5}}>{data.receiverName}</Text>
                                            <Text style={{fontSize:20,margin:5}}>{data.text}</Text>
                                            <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end', color:'black'}}>{data.dateTime}</Text>                                   
                                        </View>  
                                        :  
                                        <View style={{alignSelf: 'flex-start', maxWidth: screenWidth/1.3, borderRadius:3,backgroundColor:'white', marginVertical:2, marginHorizontal:15, }}>                           
                                            <Image source = {{uri:data.image}} style={{width:screenWidth/1.3,height:screenHeight/2, resizeMode:'contain',}}/>
                                
                                        </View> 
                                    }  
                                    {data.image!==''&& data.text!==''&&
                                        <View style={{alignSelf: 'flex-start', maxWidth: screenWidth/1.3, borderRadius:3,backgroundColor:'white', marginVertical:2, marginHorizontal:15, }}>                           
                                            <Image source = {{uri:data.image}} style={{width:screenWidth/1.3,height:screenHeight/2, resizeMode:'contain',}}/>
                                            <Text style={{fontSize:10,margin:5}}>{data.receiverName}</Text>
                                            <Text style={{fontSize:20,margin:5}}>{data.text}</Text>
                                            <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end', color:'black'}}>{data.dateTime}</Text> 
                                        </View> 
                                    }                                      
                                </View>                                
                            )
                        })                        
                    }
                    </ScrollView>
                    <View style={{height:50,  backgroundColor:'#eae8e8',alignItems:'center', justifyContent:'center',}}>
                        <View style={{alignItems:'center', justifyContent:'center', paddingHorizontal:20, flexDirection:'row',}}>
                            <TouchableOpacity onPress = {()=>this.selectPhotoTapped("firstImg")}>
                                <Icon
                                style={{marginRight:15}}
                                name = "camera"
                                size = {25}
                                color="black"/>
                            </TouchableOpacity>
                            <TextInput style={{backgroundColor:'white',height:35,width:screenWidth/1.8, borderWidth:1, borderColor:'gray', borderRadius:10}}
                                
                                value = {this.state.message}
                                onTouchStart={this.changeRead}
                                onChangeText={(message)=>{this.setState({message})}}/>

                            
                            <TouchableOpacity style={{backgroundColor:'green', height:35, width:screenWidth/6, alignItems:'center', justifyContent:'center', borderRadius:5, marginLeft:5}}
                                onPress = {this.sendMessage}>
                                <Text style={{color:'white'}}>
                                    SEND
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.state.firstImg!==''&& this.state.isVisbleImage===true&&
                        <Image source = {{uri:this.state.firstImg}} style={{width:screenWidth,height:screenHeight/3, resizeMode:'contain', position:'absolute',bottom:50}}/>
                    }
                    
                </View>          

            </View>
        )
    }
}


export default Chat;
