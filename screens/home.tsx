import { View, Text } from "react-native"
import React, { useContext } from "react"
import { Context } from "@utils/context"
import styles from "@styles/screens/home.scss"
import { ScreenProps } from "@utils/types"

import Logo from "@assets/logo.svg"

import ScreenContainer from "@components/screen-container"

import FloatingButton from "@components/floating-button"
import Group from "@components/group"

const Home = ({ navigation }: ScreenProps) => {

    const { isConnected } = useContext(Context)

	// render

	return (
        <ScreenContainer style={styles.container}>
            <View style={styles.hero}>
                <Logo width={100} height={100} />
                <Text style={styles.text}>Voice Changer</Text>
                <Text style={styles.caption}>TRANSFORM YOUR VOICE, WILL CHANGE THE FUTURE</Text>
            </View>

            { isConnected == true ? <Group styleByDefault > 
                { /* @ts-ignore */}
                <FloatingButton text="Lets Go" onPress={() => navigation.navigate("Dashboard")}/> 
            </Group> : <Group styleByDefault > 
                { /* @ts-ignore */}
                <FloatingButton text="Connexion" onPress={() => navigation.navigate("Connexion")}/>
            </Group> }
        </ScreenContainer> 
    )
}

export default Home