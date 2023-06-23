
import { Platform, SafeAreaView, StyleProp, View } from "react-native";
import styles from "@styles/components/screen-container.scss";
import { useEffect } from "react";

interface Props {
    style?: StyleProp<any>;
    children: React.ReactNode;
}

const ScreenContainer = (
    {
        style = {},
        children
    }: Props
) => {


    // manage safe area in Android

    const viewStyles = {
        ...styles.container,
        ...style,
        paddingTop: Platform.OS === "android" ? 48 : 0,
        paddingBottom: 32,
    }

    // render

    return (
        <SafeAreaView style={{ width: "100%", height: "100%" }}>
            <View style={viewStyles}>
                {children}
            </View>
        </SafeAreaView>
    )

}

export default ScreenContainer