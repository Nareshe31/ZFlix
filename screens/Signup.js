import axios from 'axios';
import React, { useState, useContext,useRef } from 'react';
import { View, Text, ToastAndroid,Image, TextInput, StyleSheet, StatusBar, Alert, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useDispatch } from 'react-redux'
import * as SecureStore from 'expo-secure-store';
import { colors, styles } from '../globalStyle';

const focusColor='hsla(0,0%,60%,0.65)'
const normalColor='hsla(0,0%,35%,0.60)'
const errorColor='hsla(25,100%,60%,1)'

export default function Signup({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [emailError,setEmailError]=useState('')
    const [nameError, setNameError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [currentInput,setCurrentInput]=useState(0)
    const dispatch = useDispatch()

    const emailRef=useRef()
    const passwordRef=useRef()
    const nameRef=useRef()

    const handleValidation = () => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
        setLoginError('')
        if (name.length>4 && password.length >= 4 && email != '' && reg.test(email)) {
            setPasswordError('')
            setNameError('')
            setEmailError('')
            handleSubmit()
        }
        else {
            
            if(name.length < 4) {
                setNameError('Name should contain more than 4 characters')
                setPasswordError('')
                setEmailError('')
                nameRef.current.focus()
            }  
            else if(email=='' || !reg.test(email)){
                emailRef.current.focus()
                if(email==''){
                    setEmailError('Email should not be empty')
                }
                else setEmailError('Invalid email address')
                setPasswordError('')
                setNameError('')
            }
            else{
                passwordRef.current.focus()
                setNameError('')
                setEmailError('')
                setPasswordError("You password must contain between 4 and 12 characters.")
            }
        }
    }
    const handleSubmit = async () => {
        try {
            Keyboard.dismiss()
            setIsLoading(true)
            let response = await axios.post('http://important-bow-prawn.glitch.me/signup', {
                email,
                name,
                password
            })
            setIsLoading(false)
            // Alert.alert('Sign up successful', `Login to continue`, [{ text: 'Ok' }])
            ToastAndroid.show("Signed Up successfully", ToastAndroid.SHORT)
        } catch (error) {
            setIsLoading(false)
            if (error?.response?.data) {
                setLoginError(error.response.data.message)
                // Alert.alert('Login failed',`${error.response.data.message}`,[{text:'Ok'}])
            }
            else {
                Alert.alert('Login failed', 'Something went wrong...', [{text:'Ok'}])
            }
        }

    }

    const changeBackground=(inputType)=>{
        if(inputType=="name"){
            setCurrentInput(1)
        }
        else if(inputType=="email"){
            setCurrentInput(2)
        }
        else    setCurrentInput(3)
    }

    return (
        <View style={styles.container}>
            {/* <ImageBackground source={require('../assets/images/new-crop.png')} resizeMode='cover' style={s.image}> */}
                <View style={s.container}>
                    <View style={s.appHeader}>
                        {/* <Text style={s.appHeaderText}>ZFlix</Text> */}
                        <Image source={require('../assets/icon.png')} style={{width:75,height:75}} />
                    </View>
                    <View style={s.formContainer}>
                        {/* <Text style={s.header}>Login</Text> */}
                        <View style={s.inputContainer}>
                            {nameError !=''?<View style={[s.errorLine]}></View>:null}
                            <Text style={s.label}>Full Name</Text>
                            <TextInput
                                style={[s.input,{backgroundColor: currentInput==1?focusColor:normalColor}]}
                                ref={nameRef}
                                returnKeyType={password.length>=4?'go':'next'}
                                autoCorrect={false}
                                onSubmitEditing={()=>name.length>4?emailRef.current.focus():handleValidation()}
                                onFocus={()=>changeBackground("name")}
                                selectionColor={colors.lighterWhite}
                                placeholder={currentInput==1?'':"John Doe"}
                                placeholderTextColor={colors.lighterWhite}
                                onChangeText={val => setName(val)}
                                value={name} />
                        </View>
                        {nameError !=''?<Text style={[s.errorText]}>{nameError}</Text>:null}
                        <View style={s.inputContainer}>
                            {nameError=='' && emailError!=''?<View style={[s.errorLine]}></View>:null}
                            <Text style={s.label}>Email</Text>
                            <TextInput
                                style={[s.input,{backgroundColor: currentInput==2?focusColor:normalColor}]}
                                ref={emailRef}
                                returnKeyType={password.length>=4?'go':'next'}
                                autoCorrect={false}
                                onSubmitEditing={()=>handleValidation()}
                                onFocus={()=>changeBackground("email")}
                                selectionColor={colors.lighterWhite}
                                keyboardType='email-address'
                                placeholder={currentInput==2?'':"abc@xyz.com"}
                                placeholderTextColor={colors.lighterWhite}
                                onChangeText={val => setEmail(val)}
                                value={email} />
                        </View>
                        {nameError=='' && emailError!=''?<Text style={[s.errorText]}>{emailError}</Text>:null}
                        <View style={s.inputContainer}>
                            {nameError=='' && emailError=='' && passwordError!=''?<View style={[s.errorLine]}></View>:null}
                            <Text style={s.label}>Password</Text>
                            <TextInput 
                                style={[s.input,{backgroundColor: currentInput==3?focusColor:normalColor}]} 
                                selectionColor={colors.lighterWhite} 
                                ref={passwordRef}
                                returnKeyType='go'
                                secureTextEntry={!showPassword} 
                                maxLength={12}
                                onSubmitEditing={handleValidation}
                                onFocus={()=>changeBackground("password")}
                                placeholder={currentInput==3?'':`••••••••\u2022`} 
                                placeholderTextColor={colors.lighterWhite} 
                                onChangeText={val => setPassword(val)} 
                                value={password} />
                            {password != '' ?
                                <TouchableWithoutFeedback onPress={() => setShowPassword(!showPassword)}>
                                    <Text style={s.showHideText}>{showPassword ? "Hide" : "Show"}</Text>
                                </TouchableWithoutFeedback>
                                : null
                            }
                        </View>
                        {passwordError != '' ? <Text style={s.errorText}>{passwordError}</Text> : null}
                        {loginError != '' ? <Text style={s.errorText}>{loginError}</Text> : null}

                        {isLoading ?
                            <View style={s.button}>
                                <Text style={[s.buttonText, { backgroundColor: colors.lightWhite, color: colors.mainBlackColor }]}>Loading</Text>
                            </View>
                            :
                            <TouchableWithoutFeedback onPress={handleValidation}>
                                <View style={s.button}>
                                    <Text style={[s.buttonText,
                                    {
                                        backgroundColor: colors.mainBlackColor,
                                        color: colors.lightWhite
                                    }]}>
                                        Sign Up
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <TouchableWithoutFeedback onPress={() => navigation.push('Login')}>
                            <Text style={[s.label, { textAlign: 'center' }]}>Already a user? Sign in now.</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            {/* </ImageBackground> */}
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBlackColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    appHeader: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    appHeaderText: {
        fontSize: 36,
        fontFamily: 'Nunito-Bold',
        color: colors.mainBlue
    },
    header: {
        fontFamily: 'Nunito-Bold',
        fontSize: 22,
        color: colors.lightWhite
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        fontSize: 17,
        color: colors.inputWhite,
        borderRadius: 5
    },
    inputContainer: {
        marginVertical: 8
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15
    },
    formContainer: {
        width: '80%',
        justifyContent: 'center',
        marginBottom: 15,
        alignSelf: 'center'
    },
    label: {
        fontSize: 18,
        fontFamily: 'Nunito-SemiBold',
        color: colors.lightWhite,
        paddingVertical: 5
    },
    image: {
        flex: 1,
        justifyContent: "center",
    },
    button: {
        marginTop: 14,
        marginBottom: 18
    },
    buttonText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
        borderWidth: 0.75,
        borderColor: colors.lighterWhite,
        borderRadius: 5,
    },
    errorText: {
        fontFamily: 'Nunito-SemiBold',
        fontSize: 16,
        color: errorColor
    },
    showHideText: {
        fontFamily: 'Nunito-Bold',
        fontSize: 16,
        color: colors.lightWhite,
        position: 'absolute',
        right: 1,
        bottom: 1,
        paddingVertical: 14,
        paddingHorizontal: 12

    },
    errorLine:{
        width:'98%',
        marginHorizontal:'1%',
        height:2,
        position:'absolute',
        left:0,
        bottom:0,
        zIndex:10,
        borderBottomWidth:2,
        borderBottomColor:errorColor
    }
})