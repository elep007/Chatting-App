import React from "react";
import { View,Image,ImageBackground,Dimensions,TextInput,ScrollView,TouchableHighlight,TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; 
import MapViewDirections from 'react-native-maps-directions';
import { Container, Content,Text,Spinner} from "native-base";
import { strings } from '../i18n';
import CalendarPicker from 'react-native-calendar-picker';
import { toastr } from '../component/toastComponent'
import SwitchToggle from "react-native-switch-toggle";
// import { GoogleSignin } from 'react-native-google-signin';
// import firebase from 'react-native-firebase'
const GOOGLE_MAPS_APIKEY = "AIzaSyAvn6N_9AZXiYeZTAYgsRnGHPvYW5g9ar0"
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let that;
export default class Progress extends React.Component {

  constructor(props){
    super(props);
    this.state = {
       date:'',
       weekday:'',
       userlat:0,
       userlong:0,
       lat:0,
       long:0, 
       data:{}   
    };
    that = this
  }

    componentDidMount(){
        let data =this.props.navigation.getParam("data");
        let lat =this.props.navigation.getParam("lat");
        let long =this.props.navigation.getParam("long");
        this.setState({lat:lat, long:long, userlat:data.user.lat, userlong:data.user.long, data:data})
        console.log(data.user.lat, data.user.long)
              
    }

    onDateChange(date, type) {
        if (type === 'END_DATE') {
            that.setState({
            selectedEndDate: date,
            });
        } else {
            console.log(date)
            that.setState({selectedStartDate: date})            
        }
    }
    goChat = async () => {
        let uid = await AsyncStorage.getItem("@uid")
        this.props.navigation.navigate("Chat",{
            "data":this.state.data,
            "Id":uid
        })
    }

  render() {
   
   const{loading} = this.state
   const weekday = "time."+this.state.weekday
    return (
        <Container>
             {/* <ScrollView> */}
            <ImageBackground
                resizeMode={'stretch'}
                style={{height:screenHeight}}
                source={require('../Resources/bg.jpg')}
            >   
            {loading && (
                      <Spinner
                        style={{position:"absolute",top:150,zIndex:200,left:screenWidth/2-20}}
                        color='#f26727' />
                   )}
                <Content style={{marginTop:100,}}>
                    <View style={{alignItems:"flex-end"}}> 
                        <View style={{width:200,height:30,backgroundColor:"#7d5659",alignItems:'flex-end',justifyContent:"center",paddingRight:15,opacity:0.9,marginBottom:30}}>
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('progress.title')}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        
                            <View style={{height:screenHeight/9,width:screenWidth/1.2}}> 
                                <View style={{flex:1.3, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('progress.Yourservice')}</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:screenWidth,height:30,}}
                                        source={require('../Resources/particle2.png')}
                                    />
                                </View>
                                
                            </View>
                            <View 
                            // style={styles.container}
                            style={{height:screenHeight/4,width:screenWidth, backgroundColor:'green'}}
                            > 
                            <MapView
                                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.map}
                                region={{
                                    latitude: parseFloat(this.state.lat),
                                    longitude: parseFloat(this.state.long),
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}>
                                    <Marker coordinate={{latitude:this.state.lat, longitude:this.state.long}}>
                                        {/* <MyCustomMarkerView {...marker} /> */}
                                    </Marker>
                                   
                                    <Marker coordinate={{latitude:this.state.userlat, longitude:this.state.userlong}}>
                                        
                                    </Marker>
                                   
                                    
                                    <MapViewDirections
                                        origin={{latitude:this.state.lat, longitude:this.state.long}}
                                        destination={{latitude:this.state.userlat, longitude:this.state.userlong}}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={3}
                                        strokeColor="#e40000"
                                    />
                            </MapView>
                            </View>
                            <View style={{flex:0.5, backgroundColor:'blue'}}> 
                            </View>
                            <View style={{height:screenHeight/3.5,width:screenWidth/1.5, marginTop:10}}> 
                                <View style={{flex:1, backgroundColor:"#d7b3b3", borderWidth:17, borderColor:"#bd8080", alignItems:'center', justifyContent:'space-around'}}>
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('progress.way')}</Text>
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('progress.min')}</Text>
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('progress.out')}</Text>
                                    <TouchableOpacity style={{width:70, height:25, backgroundColor:'#c58f8f', alignItems:'center', justifyContent:'center', alignSelf:'flex-end', marginRight:10}}
                                    onPress={this.goChat}>
                                        <Text style={{color:"white",fontFamily:"dbfut_r0",fontSize:15}}>{strings('progress.Chat')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                   
                        
                    </View>        
                </Content>
                
                {/* <Image
                        resizeMode={'stretch'}
                        style={{position:"absolute",bottom:40,marginLeft:20,height:40,width:40}}
                        source={require('../Resources/iconhome.png')}
                    />    */}
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
            </ImageBackground>
            {/* </ScrollView> */}
           
        </Container>
    );
  }
}
const styles = StyleSheet.create({
    
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      input: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
        backgroundColor: '#7a7a79',
        color: 'white',
        fontFamily:"dbfut_r0",
        margin:3,
        opacity:0.7
        
    },
   });