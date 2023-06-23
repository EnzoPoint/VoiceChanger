import { ScreenProps } from "@utils/types"
import { View, Text, Platform } from "react-native"

import { GestureHandlerRootView }  from 'react-native-gesture-handler';


import styles from "@styles/screens/dashboard.scss"
import * as DocumentPicker from 'expo-document-picker';

import FloatingButton from "@components/floating-button"
import CustomFlatList from "@components/flatlist";
import { faUpload, faMicrophone, faPlay, faPause, faCircle, faCheckCircle, faTrash } from "@fortawesome/free-solid-svg-icons"
import Group from "@components/group"
import Button from "@components/button"

import Nav from "@components/layout/nav"

import ScreenContainer  from "@components/screen-container"
import { useContext, useEffect, useState } from "react"
import { Context } from "@utils/context"
import RecordingManager from "@controllers/recordingManager"
import AudioManager from "@controllers/audioManager";

const Dashboard = ({ navigation }: ScreenProps) => {

    /// record audio 

    const [ isRecording, setRecording ] = useState(false) 
    const { recording, setRecordingBase64 } = useContext(Context)

    const startRecording = async () => {
        try {
            RecordingManager.startRecording();
            setRecording(true);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    
    const stopRecording = async () => {
        console.log('Stopping recording..');
        await RecordingManager.stopRecording();
        setRecording(false);

        const recordingUri = RecordingManager.getRecordingUri();

        if(Platform.OS === 'web') { 
            const fileContent = await AudioManager.getFileFrom(recordingUri);

            return handleAudioToggle(fileContent);
        } 

        const cacheUri = await AudioManager.copyToTheCache(recordingUri);

        return handleAudioToggle(cacheUri);
    }

    const handleAudioToggle = (lastRecorded: string, name?: string) => {
        let newList = [...recording]

        const id = newList.length + 1;

        newList.push({
            id: id,
            uri: lastRecorded,
            name: name ? name : 'Record ' + id,
            date: new Date(),
            selected: isSelected[id] ? isSelected[id] : false,
        });

        return setRecordingBase64(newList)
    }

    const handleFileUpload = async () => {
        const file = await DocumentPicker.getDocumentAsync({
            type: ['*/*'],
            copyToCacheDirectory: true,
        })

        if (file.type === 'success') {
            if(!file.mimeType?.match(/audio/g)) return alert('Le format de votre fichier n\'est pas celui attendu (audio)')

            const fileName = file.name.split('.')[0];

            if(Platform.OS === 'web') { 
                const fileContent = await AudioManager.getFileFrom(file.uri);

                return handleAudioToggle(fileContent, fileName);
            } 

            return handleAudioToggle(file.uri, fileName);
        }
      };

    /// play audio 

    const [isPlaying, setIsPlaying] = useState<{[key: number]: boolean }>({});
    const [isSelected, setIsSelected] = useState<{[key: number]: boolean }>({});

    const startPlaying = async (id: number) => {
        console.log('Loading Sound');
        try {
            console.log(recording[recording.length - 1]?.uri)
            AudioManager.startPlaying(recording[recording.length - 1]?.uri)
            setIsPlaying(prevState => ({
                ...prevState,
                [id]: true,
            }));
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    /// stop playing

    const stopPlaying = async (id: number) => {
        console.log('Stopping Sound')
        try {
            await AudioManager.stopPlaying();
            setIsPlaying(prevState => ({
                ...prevState,
                [id]: false,
            }));
        } catch (error) {
            console.error('Error stopping sound:');
            console.error(error);
        }
    }

    const clearAllAudio = async () => {
        /// STOP AUDIO
        if(isPlaying) await AudioManager.stopPlaying();

        /// DELETE ALL AUDIOS
        return await setRecordingBase64([])
    }

    const clearAudio = async (id: number) => {
        /// STOP AUDIO 
        if(isPlaying[id]) await AudioManager.stopPlaying();
        setIsPlaying(prevState => ({
            ...prevState,
            [id]: false,
        }));

        /// DELETE AUDIO
        const newList = [...recording]
        const index = newList.findIndex((item) => item.id === id)
        newList.splice(index, 1)
        return await setRecordingBase64(newList)
    }

    const selectRecord = async (id: number) => {
        setIsSelected(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));

        const newList = [...recording]
        const index = newList.findIndex((item) => item.id === id)
        newList[index].selected = !newList[index].selected
        return await setRecordingBase64(newList)
    }

    // Render item for FlatList

    const renderItem = ({ item }: any) => (
        <View style={styles.itemContainer}>
            <Group styleByDefault={false} >
                <Button
                    style={styles.selectButton}
                    icon={item.selected ? faCheckCircle: faCircle}
                    onPress={() => selectRecord(item.id)}
                />
                <Text style={styles.itemText}>{item.name}</Text>
                <Button 
                    style={styles.button}
                    icon={isPlaying[item.id] ? faPause : faPlay}
                    onPress={() => (isPlaying[item.id] ? stopPlaying(item.id) : startPlaying(item.id))}
                />
                <Button
                    style={styles.button}
                    icon={faTrash}
                    onPress={() => (clearAudio(item.id))}
                />
            </Group>
        </View>
    );

    // count the number in recording is selected

    const choix = recording.filter((item) => item.selected === true)

    // do next step

    const doNext = async (screen: string) => {
        /// STOP AUDIO & RESET STATE
        if(isPlaying) await AudioManager.stopPlaying();
        setIsPlaying({});

        /// GO TO NEXT SCREEN
        { /* @ts-ignore */ }
        navigation.navigate(screen)
    }

    // render

    return (
        <ScreenContainer style={styles.container}>
            <Nav 
                currentScreen="Dashboard" 
                goBack={navigation.goBack} />

            { recording ? null : <Text style={styles.title}>Envoie ton premier audio !</Text>  }

            <Group styleByDefault={false} >
                <Button
                    icon={faUpload}
                    style={styles.button}
                    title="Upload a file"
                    onPress={handleFileUpload}
                />
                <Button
                    icon={faMicrophone}
                    style={styles.button}
                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                    onPress={isRecording ? stopRecording : startRecording}
                />
            </Group>

            <Text style={styles.title}>Mes audios ({recording ? recording.length : 0}) : </Text>
            <Text style={styles.description} onPress={clearAllAudio} >Clear all audio</Text>

            <Group styleByDefault={false} >
                <GestureHandlerRootView>
                 <View style={styles.pagination} >
                        <CustomFlatList
                            data={recording}
                            keyExtractor={(item) => item?.id?.toString()}
                            renderItem={renderItem}
                        />
                    </View> 
                </ GestureHandlerRootView>
            </Group>

            <Group styleByDefault >
                { /* @ts-ignore */ } 
                { choix.length == 1 ? <FloatingButton text="Next step" onPress={() => doNext("Config")} /> : <FloatingButton text="Choose one" /> }
            </Group>
        </ScreenContainer>
    )
}

export default Dashboard