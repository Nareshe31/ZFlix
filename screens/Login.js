import axios from 'axios';
import React, { useState, useContext,useRef } from 'react';
import { View, Text, ToastAndroid, TextInput,Image, StyleSheet,Animated, StatusBar, Alert, ImageBackground, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { useDispatch } from 'react-redux'
import * as SecureStore from 'expo-secure-store';
import { colors, styles } from '../globalStyle';
import { abs } from 'react-native-reanimated';

const focusColor='hsla(0,0%,60%,0.65)'
const normalColor='hsla(0,0%,35%,0.60)'
const errorColor='hsla(25,100%,60%,1)'

export default function Login({ navigation }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [loginError, setLoginError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [currentInput,setCurrentInput]=useState(0)

    const dispatch = useDispatch()

    const emailRef=useRef()
    const passwordRef=useRef()
    const handleValidation = () => {
        setLoginError('')
        if (password.length >= 4 && email != '') {
            setPasswordError('')
            handleSubmit()
        }
        else {
            if (password.length < 4) {
                passwordRef.current.focus()
                setPasswordError("You password must contain between 4 and 12 characters.")
            } else {
                emailRef.current.focus()
                setPasswordError('')
            }
        }
    }
    const handleSubmit = async () => {
        try {
            Keyboard.dismiss()
            setIsLoading(true)
            let response = await axios.post('http://important-bow-prawn.glitch.me/login', {
                email,
                password
            })
            setIsLoading(false)
            // Alert.alert('Login successful', `Welcome ${response.data.user.name} 😀`, [{ text: 'Ok' }])
            SecureStore.setItemAsync('token', response.data.token)
            dispatch({ type: "LOGIN", payload: response.data.user })
            ToastAndroid.show("Signed In successfully", ToastAndroid.SHORT);

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
        if(inputType=="email"){
            setCurrentInput(1)
        }
        else    setCurrentInput(2)
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
                            <Text style={[s.label]}>Email</Text>
                           
                            <TextInput
                                style={[s.input,{backgroundColor: currentInput==1?focusColor:normalColor}]}
                                ref={emailRef}
                                returnKeyType={password.length>=4?'go':'next'}
                                autoCorrect={false}
                                onSubmitEditing={()=>passwordRef.current.focus()}
                                onFocus={()=>changeBackground("email")}
                                selectionColor={colors.lightWhite}
                                keyboardType='email-address'
                                placeholder={currentInput==1?'':"abc@xyz.com"}
                                placeholderTextColor={colors.lighterWhite}
                                onChangeText={val => setEmail(val)}
                                value={email} />
                        </View>
                        <View style={[s.inputContainer]}>
                            {passwordError !=''?<View style={[s.errorLine]}></View>:null}
                            <Text style={[s.label]}>Password</Text>
                            <TextInput 
                                style={[s.input,{backgroundColor: currentInput==2?focusColor:normalColor}]} 
                                selectionColor={colors.lightWhite} 
                                ref={passwordRef}
                                returnKeyType='go'
                                secureTextEntry={!showPassword} 
                                maxLength={12}
                                onSubmitEditing={handleValidation}
                                onFocus={()=>changeBackground("password")}
                                placeholder={currentInput==2?'':'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'} 
                                placeholderTextColor={colors.lighterWhite} 
                                onChangeText={val =>setPassword(val)} 
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
                                        Sign In
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <TouchableWithoutFeedback onPress={() => navigation.push('Signup')}>
                            <Text style={[s.label, { textAlign: 'center' }]}>New user? Sign up now.</Text>
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
        borderRadius: 3
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