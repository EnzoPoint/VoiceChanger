import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { TouchableOpacity, Text } from "react-native";

import styles from "@styles/components/floating-button.scss"

interface Props {
    onPress: () => void;
    text: string;
}

const FloatingButton = (
    { onPress, text }: Props
) => {

    // render

    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={onPress} >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

export default FloatingButton