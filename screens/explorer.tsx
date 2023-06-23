// import { ScreenProps } from "@utils/types"
// import { View, Text } from "react-native"


// import styles from "@styles/screens/explorer.scss"

// import FloatingButton from "@components/floating-button"
// import { faHome, faUser } from "@fortawesome/free-solid-svg-icons"
// import Group from "@components/group"

// import Nav from "@components/layout/nav"
// import ScreenContainer  from "@components/screen-container"
// import Button from "@components/button"

// const Explorer = ({ navigation }: ScreenProps) => {

//     // render

//     return (
//         <ScreenContainer style={styles.container}>
//             <Nav 
//                 currentScreen="Voice Center" 
//                 goBack={navigation.goBack} />

//             <View style={styles.menu}>
//                 <Text style={styles.title}>Hey,</Text>
//                 <View style={styles.buttonContainer}>
//                     { /* @ts-ignore */ }
//                     <Button icon={faHome} style={styles.button} title={'Explorer'} onPress={() => navigation.navigate("Explorer")} />
//                     { /* @ts-ignore */ }
//                     <Button icon={faUser} style={styles.button} title={'Dashboard'} onPress={() => navigation.navigate("Dashboard")} /> 
//                 </View>
//             </View>
//             <Text style={styles.subtitle}>Welcome on the Voice Center !</Text>
//             <Text style={styles.section}>Recommendations tailored for you </Text>

//             <Group styleByDefault >
//                 { /* @ts-ignore */ } 
//                 <FloatingButton text="Mon dashboard" onPress={() => navigation.navigate("Dashboard")} />
//             </Group>
//         </ScreenContainer>
//     )
// }

// export default Explorer