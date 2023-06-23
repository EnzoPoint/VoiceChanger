import { View, Text } from "react-native";
import GoBackButton from "./go-back-button";

import Logo from "@assets/logo.svg"
import styles from "@styles/components/layout/nav.scss"

interface Props {
    goBack: () => void;
    currentScreen: string;
}


const Nav = (
    {
        goBack,
        currentScreen
    }: Props
) => {


    // render

    return (
        <View style={styles.nav}>
            <GoBackButton goBack={goBack} />
            <View style={styles.screenInfoContainer}>
                <Text style={styles.screenName}>{ currentScreen }</Text>
            </View>
            <Logo width={30} height={30}/>
            <Text style={styles.appName}>Voice Changer</Text>
        </View>
    )

}


export default Nav