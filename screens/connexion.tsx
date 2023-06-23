import { Context } from "@utils/context"
import { ScreenProps } from "@utils/types"
import { useContext, useEffect, useState } from "react"
import { Text, View, TextInput } from "react-native"
import FloatingButton from "@components/floating-button"
import ShowPagination from "@components/showPagination"

import ScreenContainer from "@components/screen-container"

import styles from "@styles/screens/connexion.scss"
import Nav from "@components/layout/nav"

const connexionServer = async (ipv4: string) => {
    const url = `wss://${ipv4}/queue/join`;

    return new Promise<any>((resolve, reject) => {
        console.log(url);
        const ws = new WebSocket(url);
    
        ws.onopen = () => {
            ws.close();
            resolve(true);
        };

        ws.onerror = (e) => {
            console.log(e);
            reject(false);
        }


    });
}

const Connexion = ({ navigation }: ScreenProps) => {

    // get context data

    const { ipv4, setIPV4 } = useContext(Context)

    const [ localIPV4, setLocalIPV4 ] = useState(ipv4)

    // do connexion and save the status of the connexion in context 

    const [ isLocalConnected, setLocalConnexion ] = useState(false)
    const { isConnected, setConnexion } = useContext(Context)

    const [ showPagination, setShowPagination] = useState(false)
    
    const doConnexion = async () => {
        setIPV4(localIPV4)
        await connexionServer(localIPV4).then((res) => {
            setLocalConnexion(res)
            setConnexion(res)
            setShowPagination(true)
        }).catch((err) => {
            setLocalConnexion(err)
            setConnexion(err)
            setShowPagination(true)
        })
    }

    /// debug
    
    useEffect(() => {
        if (showPagination) {
            setTimeout(() => {
                setShowPagination(false)
                if(isConnected) navigation.goBack()
            }, 2000)
        }
    }, [isConnected, navigation, showPagination])

    /// render

    return (    
        <ScreenContainer style={styles.container}>
            {(isLocalConnected) ? <Nav 
                    currentScreen="Connecté" 
                    goBack={navigation.goBack} />
                : 
                <Nav
                    currentScreen="Connexion"
                    goBack={navigation.goBack} />
            }
            <Text style={styles.title}>Se connecter</Text>

            {(isLocalConnected && showPagination) ?
                <ShowPagination style={styles.success}>Connexion réussi</ShowPagination> 
                : <></> } 
            {(!isLocalConnected && showPagination) ? 
                <ShowPagination style={styles.fail}>Connexion échouée</ShowPagination> 
                : <></>}

            <TextInput
                value={localIPV4}
                onChangeText={setLocalIPV4}
                placeholder="Adresse IP du serveur"
                style={styles.input} />

            <FloatingButton text="Connexion" onPress={doConnexion}/>
            <Text style={styles.caption}>Si vous n'avez pas d'adresse IP, veuillez contacter le support client.</Text>
        </ScreenContainer>
    )
}

export default Connexion