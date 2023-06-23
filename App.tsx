
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connexion from '@screens/connexion';
import Home from '@screens/home';
import Dashboard from '@screens/dashboard';
import Send from '@screens/send';
import Config from '@screens/config';
import { TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import {
	createStackNavigator,
	StackCardInterpolationProps,
	StackNavigationOptions,
  } from '@react-navigation/stack';

import { fonts } from "@utils/fonts"
import { useFonts } from "expo-font"

import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Context, getStorageIPV4, setStorageIPV4, getStatusConnexion, setStatusConnexion, setStorageRecording, getRecordings, getStorageModel, setStorageModel, getStoragePitch, getStorageTypeIA, setStoragePitch, setStorageTypeIA } from '@utils/context';


import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';

import {Recording} from '@utils/context';
import { View } from 'react-native';

// this component serves as the kernel of the app

// nav conf

const Stack = createStackNavigator();

export default function App() {

	// search context

	const [ipv4, setterIPV4] = useState<string>("");
	const [isConnected, setterConnexion] = useState<boolean>(false);
	const [recording, setterURI] = useState<Recording[]>([]);
	const [selectedModel, setterSelectedModel] = useState<string>("");
	const [type_ia, setterType_ia] = useState<string>("");
	const [pitch, setterPitch] = useState<number>(0);

	// custom setter for both
	// that also persists the data to local storage

	const setIPV4 = (ipv4: string) => {
		setStorageIPV4(ipv4).then(setterIPV4);
	}

	const setConnexion = (isConnected: boolean) => {
		setStatusConnexion(isConnected).then(setterConnexion);
	}

	const setRecordingBase64 = (recording: Recording[]) => {
		setStorageRecording(recording).then(setterURI);
	}

	const setSelectedModel = (model: string) => {
		setStorageModel(model).then(setterSelectedModel);
	}

	const setType_ia = (type_ia: string) => {
		setStorageTypeIA(type_ia).then(setterType_ia);
	}

	const setPitch = (pitch: number) => {
		setStoragePitch(pitch).then(setterPitch);
	}

	useEffect(() => {
		getStorageIPV4().then(setterIPV4)
		getStatusConnexion().then(setterConnexion)
		getRecordings().then(setterURI)
		getStorageModel().then(setterSelectedModel)
		getStorageTypeIA().then(setterType_ia)
		getStoragePitch().then(setterPitch)
	}, [])

	// memoize the context,
	// to avoid needless React re-renders
	const value = useMemo(
		() => ({ ipv4, setIPV4, isConnected, setConnexion,  recording, setRecordingBase64, selectedModel, setSelectedModel, type_ia, setType_ia, pitch, setPitch, }), [ipv4, isConnected, recording, selectedModel, type_ia, pitch]
	)

	// load fonts

	const [fontsLoaded] = useFonts(fonts)

	const horizontalAnimation: StackNavigationOptions = {
		gestureDirection: 'horizontal',
		transitionSpec: {
			open: TransitionSpecs.TransitionIOSSpec,
			close: TransitionSpecs.TransitionIOSSpec,
		},
		headerStyleInterpolator: HeaderStyleInterpolators.forFade,
		cardStyleInterpolator: ({
			current,
			layouts,
		}: StackCardInterpolationProps) => {
			return {
			cardStyle: {
				transform: [
				{
					translateX: current.progress.interpolate({
					inputRange: [0, 1],
					outputRange: [layouts.screen.width, 0],
					}),
				},
				],
			},
			};
		},
	};

	// render

	return (
		<Context.Provider value={value}>
			{ fontsLoaded ?
				<SafeAreaProvider>
					<NavigationContainer>
						<Stack.Navigator 
							screenOptions={{  headerShown: false }}>
							<Stack.Screen 
								name="Home" 
								component={Home}
								options={{
									...horizontalAnimation
								}}
							/>
							<Stack.Screen 
								name="Connexion" 
								component={Connexion}
								options={{
									...horizontalAnimation
								}}
							/>
							<Stack.Screen
								name="Dashboard"
								component={Dashboard}
								options={{
									...horizontalAnimation
								}}
							/>
							<Stack.Screen
								name="Config"
								component={Config}
								options={{
									...horizontalAnimation
								}}
							/>
							<Stack.Screen
								name="Send"
								component={Send}
								options={{
									...horizontalAnimation
								}}
							/>
						</Stack.Navigator>
					</NavigationContainer>
					<StatusBar style="auto" />
				</SafeAreaProvider>
			: <></>}
		</Context.Provider>
	)
}

