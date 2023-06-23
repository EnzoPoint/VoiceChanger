import { Pressable, View } from "react-native";

import styles from "@styles/components/layout/go-back-button.scss"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
    goBack: () => void;
}

const GoBackButton = ({ goBack }: Props) => {

    // render

    return (
        <Pressable 
            style={styles.button}
            onPress={goBack}>
                <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </Pressable>
    )

}


export default GoBackButton