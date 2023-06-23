import styles from "@styles/components/group.scss"
import { View } from "react-native"

interface Props {
    styleByDefault: boolean
    children: any
}

const Group = (
    {  
        styleByDefault,
        children
    }: Props
) => {

    // render

    return (
        <View style={ styleByDefault ? styles.containerFixe : styles.containerFluid } >
            {children}
        </View>
    )
}

export default Group