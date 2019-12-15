import React from "react";
import { View,Image,ImageBackground,Dimensions,TextInput,ScrollView } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import { Container, Content,Text,Spinner, Toast} from "native-base";
import { strings } from '../i18n';

import { toastr } from '../component/toastComponent'

// import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase'

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default class RegisterPage extends React.Component {

  constructor(props){
    super(props);
    this.state = {       
       name:'',
       password:'',
       email:'',
       phone:'',
       loading:false,
       mailvalidate:false,
       currentUser:'',     
    };
  }

    componentDidMount(){
    }
    handleName =(text)=>{
        this.setState({ name: text })
    }

    handlePassword=(text)=>{
        this.setState({ password: text })
    }

    handleEmail = (text)=>{
        this.setState({mailvalidate:false})
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
      if(reg.test(text) === false)
      {
        
        // this.setState({email:text})
        return false;
      }
      else {
        this.setState({email:text})
        this.setState({mailvalidate:true})
        
      }
    }

    emailVaidate =() =>{
        if(!this.state.mailvalidate)
          toastr.showToast('Invalidating Email',2500)
    }

    handlePhone = (text)=>{
        this.setState({ phone: text })
    }

    handleRegister = () =>{
        // this.props.navigation.replace("ServiceActive")               

        
        const {name,password,email,phone} = this.state
        if(!password || !email){
            console.log("---------------")
            toastr.showToast("Please enter the all informations",3500) 
        }else{
            if(password.length<6)
            {
                toastr.showToast("password length is bigger than 6 lenghts");
            }else{
                this.setState({loading:true})
                firebase.database().ref(`/staff/`).once("value",async snap=>{
                    Object.keys(snap.val()).map( async data=>{
                        if (snap.val()[data].email===email && snap.val()[data].password===password){
                            await AsyncStorage.setItem("@uid", data)
                            this.setState({loading:false})
                            this.props.navigation.replace("ServiceActive")  
                        } else {

                        }
                    })
                    this.setState({loading:false})
                    // toastr.showToast("Please try again!",3500) 
                })
                              
               
            }
        }


        // this.props.navigation.navigate('Services')
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
                            <Text style={{color:"white",opacity:1,fontFamily:"dbfut_b0"}}>{strings('login.title')}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginLeft:20,marginRight:20, marginTop:80}}>
                        
                        

                        <View style={styles.searchSection}>
                            <TextInput
                                style={styles.input}
                                placeholder={strings('register.email')}
                                onChangeText={this.handleEmail}
                                onBlur = {this.emailVaidate}
                                underlineColorAndroid="transparent"
                                ref={email => { this.emailTxt = email }}
                            />
                        </View>
                        <View style={styles.searchSection}>
                            <TextInput
                                style={styles.input}
                                placeholder="password"
                                onChangeText={this.handlePassword}
                                underlineColorAndroid="transparent"
                                secureTextEntry = {true}
                                ref={password => { this.passwordTxt = password }}
                            />
                        </View>
                        
                    </View>
        
                   <View style={{flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:15}}>
                        
                        <View style={{flex:1,height:35,backgroundColor:"#ad7731",width:screenWidth/1.1,justifyContent:"center",marginTop:15}}>
                            <Text 
                                style={{textAlign:"center",color:"white",fontFamily:"dbfut_r0"}}
                                onPress= {this.handleRegister}
                            >{strings('login.enter')}</Text>
                        </View>
                        
                        
                        
                   </View>
                   
                </Content>
                
                {/* <Image
                        resizeMode={'stretch'}
                        style={{position:"absolute",bottom:40,marginLeft:20,height:40,width:40}}
                        source={require('../Resources/iconhome.png')}
                    />    */}
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