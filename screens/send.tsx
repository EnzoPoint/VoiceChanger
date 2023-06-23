import React, { useState, useContext, useEffect } from 'react';
import { ScreenProps } from '@utils/types';
import { Context } from '@utils/context';
import { View, Text, Platform } from 'react-native';
import FloatingButton from "@components/floating-button"
import Group from "@components/group"
import LottieView from 'lottie-react-native';   

import ScreenContainer from "@components/screen-container"

import Nav from "@components/layout/nav"
import styles from "@styles/screens/send.scss"
import AudioManager from '@controllers/audioManager';
import { faPlay, faPause, faDownload, faHouse } from '@fortawesome/free-solid-svg-icons';
import Button from '@components/button';
import audioManager from '@controllers/audioManager';
  
interface AudioFileRequest {
    fn_index: number;
    data: [
        {   
            data: string;
            name: string;
        },
        string,
        number,
        string,
        number,
        number,
        number,
        string
  ];
  event_data: null;
  session_hash: string;
}

const Send = ({ navigation }: ScreenProps) => {

    const { ipv4 } = useContext(Context);
    const { recording } = useContext(Context);

    const choix = recording.filter((item) => {
        return item.selected === true;
    });

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const name_file = choix[0].name;
    
    const [dataAudio, setDataAudio] = useState<string>("");

    const session_hash = '';
    const websocketUrl = `wss://${ipv4}/queue/join`;

    useEffect(() => {
        Promise.resolve().then(() => {
            const fileContent = AudioManager.getFileFrom(choix[0].uri);
            return fileContent;
        }).then((fileContent) => {
            setDataAudio(fileContent);
        }).catch((error) => {
            console.error('Error getting file:', error);
        });
    } ,[]);

    const [isFinish, setIsFinish] = useState(false);
    const [result, setResult] = useState<string>("");
   
    const { pitch, type_ia, selectedModel } = useContext(Context);
    
    const [ uri, setUri ] = useState<string>("");

    console.log(dataAudio)

    const ws = new WebSocket(websocketUrl);

    const onSend = (message: string) => {
        ws.send(message);
    }

    if(!isFinish && dataAudio !== "") {
        const requestPayload: AudioFileRequest = {
            fn_index: 0,
            data: [
                { 
                    data: dataAudio,
                    name: name_file,
                },
                selectedModel,
                pitch,
                type_ia,
                0.6,
                3,
                1,
                'Disable resampling',
            ],
            event_data: null,
            session_hash: session_hash,
        };
    
        const requestPayloadJson = JSON.stringify(requestPayload);  

        ws.onmessage = (e) => {
            if(e.data.includes('send_hash')) {
                const firstMessage = JSON.stringify({
                    fn_index: 0,    
                    session_hash: session_hash,
                });

                onSend(firstMessage);
            }
            if (e.data.includes('send_data')) {
                console.log(requestPayloadJson)
                onSend(requestPayloadJson);
            }

            if(e.data.includes('process_completed')) {
                const uri = "https://" + ipv4 + "/file=" + JSON.parse(e.data).output.data[0].name;
                setUri(uri);
                ws.close();
                return lastStep(uri);
            }
        };
    }

    const lastStep = async (uri: string) => {
        try {
            const resultat = await audioManager.getFileFrom(uri);
            setIsFinish(true);
            return setResult(resultat);
        } catch (error) {
            console.error('Error getting file:', error);
        }
    }
   
    const startPlaying = async () => {
        console.log('Loading Sound');
       try {
           AudioManager.startPlaying(uri)
            setIsPlaying(true);
       } catch (error) {
           console.error('Error playing sound:', error);
       }
   }
   
    /// stop playing
   
    const stopPlaying = async () => {
        console.log('Stopping Sound')
       try {  
           await AudioManager.stopPlaying();;
           setIsPlaying(false);
        } catch (error) {
            console.error('Error stopping sound:', error);
        }
    }

    const goBack = () => {
        ws.close();
        navigation.goBack();
    }

    const downloadFile = async () => {
        try {
            const nameModif = name_file.replace(" ", "_")
            if(Platform.OS === 'ios') {
                await AudioManager.downloadFile(`${uri}`, nameModif + '_result.wav');
            } else {
                const resultFinal = result.replace(/data.*,/gm, "");
                await AudioManager.downloadFile(resultFinal, nameModif + '_result.wav');
            }
        } catch (error) {
            console.error('Error getting file:', error);
        }
    }

   
    // render 

    return (
        <ScreenContainer style={styles.container}>
            <Nav 
                currentScreen="Send" 
                goBack={navigation.goBack} />

            { }   
            {isFinish ? <Text style={styles.title}>Envoi terminé !</Text> : <Text style={styles.title}>Envoi en cours...</Text>}
            {Platform.OS === 'web' ? (
                <Text style={styles.message}>
                {isFinish ? 'Envoi terminé !' : 'Envoi en cours ...'}
                </Text>
            ) : (
                <LottieView
                    source={isFinish ? require('@lotties/finish.json') : require('@lotties/sending.json')}
                    autoPlay
                    loop
                />
            )}
            <Group styleByDefault >

                { /* @ts-ignore */ } 
                { isFinish ? <Button title="Dashboard" style={styles.button} icon={faHouse} onPress={() => navigation.navigate("Dashboard")} /> : null }
                { isFinish ? <Button 
                        style={styles.button}
                        title={isPlaying ? "Pause" : "Play"}
                        icon={isPlaying ? faPause : faPlay}
                        onPress={() => (isPlaying ? stopPlaying() : startPlaying())}
                /> : <FloatingButton text="Cancel" onPress={() => goBack() } /> }
                { isFinish ? <Button 
                    title="Download" 
                    style={styles.button}
                    icon={faDownload}
                    onPress={downloadFile}
                /> : null }
            </Group>
        </ScreenContainer>
    )
}

export default Send;