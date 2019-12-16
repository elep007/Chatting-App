import React from "react";
import { View,Image,ImageBackground,Dimensions,TouchableOpacity,ScrollView,TouchableHighlight } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Entypo'
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
       loading:false,       
       currentUser:'',
       switchOn4: false,
       selectedStartDate:'',
       selectedEndDate:'',
       position:'',
    };
    that = this
  }

    async componentDidMount(){
        let uid = await AsyncStorage.getItem("@uid")
        let position = ''
        await Geolocation.getCurrentPosition(async info => {            
            console.log(info)            
            position = info
            this.setState({position:info.coords});
            firebase.database().ref(`/staff/${uid}/region/`).update({
                lat:info.coords.latitude,
                long:info.coords.longitude
            })
            
          },err=>{console.log(err)},{
            timeout:300000,
            enableHighAccuracy:false,
            maximumAge: 1000
          });      
    }
    


    
    onPress4 = () => {
        this.setState({ switchOn4: !this.state.switchOn4 });
      };
      getButtonText() {
        return this.state.switchOn4 ? "" : "";
      }
     
      getRightText() {
        return this.state.switchOn4 ? "" : strings('login.active');
      }
     
      getLeftText() {
        return this.state.switchOn4 ? strings('login.inactive') : "";
      }
    onDateChange(date, type) {
        if (type === 'END_DATE') {
            that.setState({
            selectedEndDate: date,
            });
        } else {
            // console.log(date)
            that.props.navigation.navigate("Service", {
                date: date,  
                position: that.state.position              
              })
            // that.setState({selectedStartDate: date})            

        }
    }

  render() {
   
   const{loading} = this.state
    return (
        <Container>
             <ScrollView>
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
                <Content style={{marginTop:160,}}>
                    <View style={{alignItems:"flex-end"}}> 
                        <View style={{width:200,height:30,backgroundColor:"#7d5659",alignItems:'flex-end',justifyContent:"center",paddingRight:15,opacity:0.9,marginBottom:30}}>
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('detail.Services')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginLeft:20,marginRight:20, marginTop:15}}>
                        <View style={{height:50, width:130, alignSelf:'flex-start'}}>
                            <SwitchToggle
                                buttonText={this.getButtonText()}
                                backTextRight={this.getRightText()}
                                backTextLeft={this.getLeftText()}
                                type={1}
                                buttonStyle={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "absolute"
                                }}
                                rightContainerStyle={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",                                
                                }}
                                leftContainerStyle={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "flex-start"
                                }}
                                buttonTextStyle={{ fontSize: 12, color:'white', fontWeight:'bold' }}
                                textRightStyle={{ fontSize: 12, color:'white', fontWeight:'bold' }}
                                textLeftStyle={{ fontSize: 12, color:'white', fontWeight:'bold' }}
                                containerStyle={{                                
                                    width: 100,
                                    height: 35,
                                    borderRadius: 30,
                                    padding: 5,
                                    borderWidth:0.5,
                                    borderColor:"#ffffff"
                                }}
                                backgroundColorOn="#b20000"
                                backgroundColorOff="#979700"
                                circleStyle={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 30,
                                    backgroundColor: "blue" // rgb(102,134,205)
                                }}
                                switchOn={this.state.switchOn4}
                                onPress={this.onPress4}
                                circleColorOff="#bd8080"
                                circleColorOn="#bd8080"
                                duration={500}
                                />
                        </View>
                        <View style={{width:screenWidth/1.2, height:screenHeight/3, backgroundColor:'#bd8080',paddingHorizontal:20, alignItems:'center', justifyContent:'center'}}>
                            <View style={{width:screenWidth/1.3, height:screenHeight/3.3, backgroundColor:'#d7b3b3'}}>
                            <CalendarPicker
                                onDateChange={this.onDateChange}
                                width={screenWidth/1.2}
                                height={screenHeight/2.7}
                                />
                            </View>                            
                        </View>             
                    </View>        
                </Content>
                
                {/* <Image
                        resizeMode={'stretch'}
                        style={{position:"absolute",bottom:40,marginLeft:20,height:40,width:40}}
                        source={require('../Resources/iconhome.png')}
                    />    */}
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center", position:'absolute', bottom:30, right:30}} >
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChatList")}>
                            <Icon
                            style={{marginRight:100}}
                            name = "chat"
                            size = {25}
                            color = "white"/>
                        </TouchableOpacity>
                        <TouchableHighlight 
                    //  onPress={()=>{this.props.navigation.push('History')}}
                        >
                            <Image
                                resizeMode={'contain'}
                                style={{width:40,height:40, marginRight:100}}
                                source={require('../Resources/iconbook.png')}
                                
                            /> 
                        </TouchableHighlight>
                        <TouchableHighlight 
                    //  onPress={this.handleProfile}
                        >
                        <Image
                            resizeMode={'contain'}
                            style={{width:40,height:40}}
                            source={require('../Resources/iconman.png')}
                            
                        />   
                        </TouchableHighlight>  
                    </View>  
            </ImageBackground>
            </ScrollView>
           
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