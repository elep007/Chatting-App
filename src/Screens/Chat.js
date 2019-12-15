import React from 'react';
import { View, TouchableOpacity, Text,TextInput, ScrollView, Image } from 'react-native';
import { Container, Header, Content,Tab, Tabs, Left, Right, Icon, Body, Button, Item, Input } from 'native-base';

import {Dimensions } from "react-native";
import firebase from 'react-native-firebase'

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
            sender:'',
            receiver:'',
            message:'',
            messagesData:[],
            roomId:'',
            currentUser:'',
            clientName:'',            
        }
        session = this;
    }

    async componentDidMount(){
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
        this.setState({roomId:roomId})
        console.log(roomId)  
        this.getMessage(roomId, messages=>{
            
        })               
    }

    getMessage = (roomId) => {
        firebase.database().ref(`/chat/`).once("value", snap=>{
            if(snap.exists()){

            }
        })
    }
    getMessage = (CHATROOM, callback) => { 
                  
        try {
            firebase.database()
                .ref('chat/room')
                .child(CHATROOM)
                .on('child_added', snapshot => {  
                                      
                    const message = {
                        message   :snapshot.val().message,
                        receiveId :snapshot.val().receiveId,   
                        sendId    :snapshot.val().sendId,
                        time      :snapshot.val().time,
                    }                                                     
                    
                    callback(snapshot);
                          
                });
        } catch (e) {           
            console.log('=====ERROR=====',e)
        }
    };
   
    changeRead = async () => {
        let CHATROOM= await AsyncStorage.getItem("@CHATROOM") 
        let Ids     = await AsyncStorage.getItem('@UID') 
        let dbCon = firebase.database().ref(`/chat/room/${CHATROOM}`);
        dbCon.once("value", function(snapshot) {
            snapshot.forEach(function(child) {
                console.log(child.val())
                if(child.val().receiveId === Ids){
                    child.ref.update({
                    state: '1'
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
        let time = this.getTime()
        
            console.log(time);
        
    }

    render() {
        // console.log('=======********=======',session.state.messagesData)
        return(
            <View style={{flex:1,}}>
                <Header style={{backgroundColor:'#1d1d1b', justifyContent:'flex-start'}}>
                    <Left style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>

                        
                           
                                <TouchableOpacity 
                                onPress={()=>{this.props.navigation.goBack()}}
                                >
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:40,height:40, marginRight:100}}
                                        source={require('../Resources/iconback.png')}
                                        
                                    /> 
                                </TouchableOpacity>
                        
                        <Text style={{color:'white', fontFamily:'Poppins-Black', marginLeft:10}}>Mr. {this.state.clientName}</Text>
                    </Left>
                    
                </Header>                
                <View style={{flex:1, backgroundColor:'#edeef7'}}>
                    <ScrollView 
                        ref={ref => this.scrollView = ref}
                        onContentSizeChange={(contentWidth, contentHeight)=>{        
                            this.scrollView.scrollToEnd({animated: true});
                        }}>
                    {this.state.messagesData.length>0 &&
                        this.state.messagesData.map(data=>{
                            // console.log('=====---------=====',data.val().sendId)
                            return(
                                data.val().sendId===session.state.currentUser?                                
                                <View style={{flexDirection:'row',justifyContent:'flex-end',}} key = {data.val().time}>                               
                                    <View style={{  backgroundColor:'#4a9ef2',alignSelf: 'flex-end', maxWidth: 500, borderRadius:3,marginVertical:2, marginHorizontal:15, }}>                           
                                        <Text style={{fontSize:10,margin:5,color:'white'}}>You:</Text>
                                        <Text style={{fontSize:20,margin:5,color:'white'}}>{data.val().message}</Text>
                                        <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end'}}>{data.val().time}</Text>                                   
                                    </View>                                            
                                </View>
                                :
                                <View style={{flexDirection:'row',justifyContent:'flex-start'}} key = {data.val().time}>                               
                                    <View style={{alignSelf: 'flex-start', maxWidth: 300, borderRadius:3,backgroundColor:'white', marginVertical:2, marginHorizontal:15, }}>                           
                                        <Text style={{fontSize:10,margin:5}}>{this.state.clientName}</Text>
                                        <Text style={{fontSize:20,margin:5}}>{data.val().message}</Text>
                                        <Text style={{fontSize:8,margin:5, color:'white', alignSelf:'flex-end', color:'black'}}>{data.val().time}</Text>                                   
                                    </View>                                            
                                </View>
                            )
                        })                        
                    }
                    </ScrollView>
                    <View style={{height:50,  backgroundColor:'#ededf5',alignItems:'center', justifyContent:'center',}}>
                        <View style={{alignItems:'center', justifyContent:'center', paddingHorizontal:20, flexDirection:'row',}}>
                            <TextInput style={{backgroundColor:'white',height:35,width:screenWidth/1.5, borderWidth:1, borderColor:'gray', borderRadius:10}}
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
                </View>          

            </View>
        )
    }
}


export default Chat;
