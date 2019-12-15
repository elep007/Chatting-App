import React from "react";
import { View,Image,ImageBackground,Dimensions,TextInput,ScrollView,TouchableHighlight,TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker  } from 'react-native-maps'; 
import MapViewDirections from 'react-native-maps-directions';
import { Container, Content,Text,Spinner} from "native-base";
import { strings } from '../i18n';
import CalendarPicker from 'react-native-calendar-picker';
import { toastr } from '../component/toastComponent'
import SwitchToggle from "react-native-switch-toggle";
import Geolocation from '@react-native-community/geolocation'
// import firebase from 'react-native-firebase'
const GOOGLE_MAPS_APIKEY = "AIzaSyAvn6N_9AZXiYeZTAYgsRnGHPvYW5g9ar0"
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
let that;
export default class Information extends React.Component {

  constructor(props){
    super(props);
    this.state = {
       date:'',
       weekday:'',
       userlat:0,
       userlong:0,
       lat:0,
       long:0,   
       data:{},
       username:'',
       address:'',
       services:'',
       price:''
    };
    that = this
  }

    async componentDidMount(){
        await Geolocation.getCurrentPosition(async info => {
            
            console.log(info)            
            this.setState({lat:info.coords.latitude, long:info.coords.longitude})
            
          },err=>{console.log(err)},{
            timeout:300000,
            enableHighAccuracy:false,
            maximumAge: 1000
          }); 
        let position =this.props.navigation.getParam("position");       
        let data =this.props.navigation.getParam("data"); 
        this.setState({data:data, userlat:data.user.lat, userlong:data.user.long, username:data.user.username, price:data.TotalPrice})
        let temp = []
        temp.push(data.service)
        temp.map(data=>{
            let serviceString = ''
            
            Object.keys(data).map(index=>{
                serviceString = serviceString + data[index].name + ", "
            })
            this.setState({services:serviceString})
        })
        console.log("---------",data)
        console.log(position.latitude, position.longitude) 
        this.fetchAddress(data.user.lat, data.user.long)  
                 
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

    goProgress = () => {
        this.props.navigation.navigate("Progress",{
            data:this.state.data,
            lat:this.state.lat,
            long:this.state.long
        })
    }

    fetchAddress = async (lat, lon) => {
        await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GOOGLE_MAPS_APIKEY}`
        )
          .then(res => res.json())
          .then(json => {                             
                   console.log(json.results[0].formatted_address)
                   this.setState({address:json.results[0].formatted_address})       
                })
                .catch(error=>{
             
                })
    }

  render() {
   
   const{loading} = this.state
   const weekday = "time."+this.state.weekday
   console.log(this.state.lat, this.state.long)
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
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('information.information')}</Text>
                        </View>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        
                            <View style={{height:screenHeight/3.3,width:screenWidth/1.2}}> 
                                <View style={{flex:1.3, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:20}}>{strings('information.ServiceInfo')}</Text>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:screenWidth,height:30,}}
                                        source={require('../Resources/particle2.png')}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={strings('profile.NameSurname')}
                                        onChangeText={this.handleEmail}
                                        onBlur = {this.emailVaidate}
                                        underlineColorAndroid="transparent"
                                        value={this.state.username}
                                        ref={email => { this.emailTxt = email }}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={strings('confirm.Direction')}
                                        onChangeText={this.handleEmail}
                                        onBlur = {this.emailVaidate}
                                        underlineColorAndroid="transparent"
                                        value={this.state.address}
                                        ref={email => { this.emailTxt = email }}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={strings('billing.Service')}
                                        onChangeText={this.handleEmail}
                                        onBlur = {this.emailVaidate}
                                        underlineColorAndroid="transparent"
                                        value={this.state.services}
                                        ref={email => { this.emailTxt = email }}
                                    />
                                </View>
                                <View style={{flex:1}}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={strings('detail.Value')}
                                        onChangeText={this.handleEmail}
                                        onBlur = {this.emailVaidate}
                                        underlineColorAndroid="transparent"
                                        value = {String(this.state.price)}
                                        ref={email => { this.emailTxt = email }}
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
                            {
                                this.state.data.place==='apart'&&
                                <View style={{height:screenHeight/8,width:screenWidth/1.2, alignItems:'center', justifyContent:'center'}}> 
                            
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:screenHeight/12,height:50,}}
                                        source={require('../Resources/confirmApart.png')}
                                    />
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('information.ServiceInfo')}</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{width:screenWidth,height:10,}}
                                            source={require('../Resources/particle.png')}
                                        />
                                </View>
                            }
                            {
                                this.state.data.place==='home'&&
                                <View style={{height:screenHeight/8,width:screenWidth/1.2, alignItems:'center', justifyContent:'center'}}> 
                            
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:screenHeight/12,height:50,}}
                                        source={require('../Resources/confirmHome.png')}
                                    />
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('information.ServiceInfo')}</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{width:screenWidth,height:10,}}
                                            source={require('../Resources/particle.png')}
                                        />
                                </View>
                            }
                            {
                                this.state.data.place==='office'&&
                                <View style={{height:screenHeight/8,width:screenWidth/1.2, alignItems:'center', justifyContent:'center'}}> 
                            
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width:screenHeight/12,height:50,}}
                                        source={require('../Resources/confirmOffice.png')}
                                    />
                                    <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('information.ServiceInfo')}</Text>
                                        <Image
                                            resizeMode={'contain'}
                                            style={{width:screenWidth,height:10,}}
                                            source={require('../Resources/particle.png')}
                                        />
                                </View>
                            }
                            
                   
                        
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
                             <TouchableHighlight 
                            //  onPress={this.handleProfile}
                             >
                                 <Image
                                     resizeMode={'contain'}
                                     style={{width:40,height:40}}
                                     source={require('../Resources/iconhome.png')}
                                     
                                 />   
                             </TouchableHighlight>  
                             <TouchableOpacity
                                onPress={this.goProgress}
                                style={{height:30, width:screenWidth/3, backgroundColor:"#808000", marginLeft:20, alignItems:'center', justifyContent:'center'}}
                             >
                                <Text style={{color:"white",fontFamily:"dbfut_b0",fontSize:15}}>{strings('serviceDetail.Continue')}</Text>
                             </TouchableOpacity> 
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