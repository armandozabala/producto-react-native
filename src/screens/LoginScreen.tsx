import React, { useContext, useEffect } from 'react'
import { Alert, TextInput, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any>{}



const LoginScreen = ( {navigation}: Props ) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext)

    const { email, password, onChange} = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {

        if( errorMessage.length === 0 ) return;

        Alert.alert(
            'Login Incorrecto',
            errorMessage,
            [
                {
                    text: 'Ok',
                    onPress: removeError
                }
            ]
        );

    },[errorMessage])

    const onLogin = () => {
        console.log({email, password})
        Keyboard.dismiss();

        signIn({ correo: email, password});
    }

    return (
        <>
          {/* Background */}

           <Background/>

           <KeyboardAvoidingView 
               style={{ 
                   flex: 1
               }}
               behavior={ (Platform.OS === 'ios') ? 'padding' : 'height'}
           > 

                {/* Keyboard avoid view */}
                <View style={ loginStyles.formContainer }> 
                <WhiteLogo/>
                
                <Text style={ loginStyles.title }>Login</Text>

                <Text style={ loginStyles.label }>Email: </Text>

                <TextInput
                        placeholder="Ingrese su email"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={ [
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS   
                        ]}
                        selectionColor="white"
                        onChangeText={ (value) => onChange(value, 'email')}
                        value={email}
                        onSubmitEditing={onLogin}
                        autoCapitalize="none"
                        autoCorrect={false}
                />

                    <Text style={ loginStyles.label }>Contraseña: </Text>

                    <TextInput
                        placeholder="*********"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry={true}
                        style={ [
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS   
                        ]}
                        selectionColor="white"
                        onChangeText={ (value) => onChange(value, 'password')}
                        value={password}
                        onSubmitEditing={onLogin}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Boton Login */}
                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={ loginStyles.button }
                            onPress={ onLogin }
                        >
                            <Text style={ loginStyles.buttonText }>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/**Crear nueva cuenta */}
                    <View style={ loginStyles.newUserContainer }>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={ () =>  navigation.replace('RegisterScreen') }
                        >
                            <Text style={ loginStyles.buttonText }>Nueva cuenta</Text>
                        </TouchableOpacity>
                    </View>
                    </View>

            </KeyboardAvoidingView>

        </>
    )
}

export default LoginScreen
