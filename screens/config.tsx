import React, { useState, useContext, useEffect } from 'react';
import { ScreenProps } from '@utils/types';
import { Context } from '@utils/context';
import { View, Text, TouchableOpacity } from 'react-native';
import FloatingButton from "@components/floating-button"
import Group from "@components/group"

import Slider from '@react-native-community/slider';

import RNPickerSelect from 'react-native-picker-select';

import ScreenContainer from "@components/screen-container"

import Nav from "@components/layout/nav"
import styles from "@styles/screens/config.scss"

const Config = ({ navigation }: ScreenProps) => {

    const { ipv4 } = useContext(Context);

    const [modelItems, setModelItems] = useState<string[]>([]);
    const [iaItems, setIaItems] = useState<string[]>([]);

    const { pitch, setPitch } = useContext(Context);
    const [ localPitch, setLocalPitch ] = useState(0);
    const { type_ia, setType_ia } = useContext(Context);
    const { selectedModel, setSelectedModel } = useContext(Context);

    const handlePitchChange = async (value: number) => {
        setLocalPitch(value);
    }

    const getFromApi = async () => {
        let models: string[] = [];
        let ia: string[] = [];

        await fetch(`https://${ipv4}/`).then((response) => {

            response.text().then(function (data) {
                const modelRegex = /"id":23,"type":"dropdown","props":{"choices":\[(.*)],"allow/gm;
                const iaRegex = /"id":13,"type":"radio","props":{"choices":\[(.*)],"value":"pm/gm;

                let modelMatches = data.matchAll(modelRegex);
                let iaMatches = data.matchAll(iaRegex);

                for (const match of modelMatches) {
                    match[1].split(',').forEach((item) => {
                        models.push(item.replace(/"/g, ''));
                    })
                } 

                for (const match of iaMatches) {
                    match[1].split(',').forEach((item) => {
                        ia.push(item.replace(/"/g, ''));
                    })
                }

                setModelItems(models);
                setIaItems(ia);;
            });
        });
            
        fetch(`https://${ipv4}/run/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fn_index: 2,
                data: ["ALL - Ariana Grande"],
                session_hash: ""
            })
        }).then((response) => {
            response.text().then(function (data) {
                   // here is the reponse from api : {"data":["<h3>Model info</h3>\n<p><img src=\"/file/model/arianagrande/Ariana.png\" alt=\"model icon\"><strong>Ariana Grande</strong></p>\n<p>Author: Arithyst</p>\n<p>Source: ALL</p>\n<p>7 minute dataset (All of the dataset are from her Pro-Tools Dataset), Trained in RVC v2, Crepe Hop Length - 30</p>\n"],"is_generating":false,"duration":0.00020194053649902344,"average_duration":0.00017008998177268288} write variable separate to get img author etc
            });
        }
        ).catch((err) => {
            console.log(err);
        }
        );
    }

    const handleTypeChange = (value: string) => {
        setType_ia(value);
    }

    const RadioOption = ({ label, value, selected, onSelect }: any) => {
        const handlePress = () => {
          onSelect(value);
        };
      
        return (
          <TouchableOpacity onPress={handlePress} style={styles.radioBlock}>
            <View style={[styles.radio, selected ? styles.selected : null]} />
            <Text style={styles.radioLabel}>{label}</Text>
          </TouchableOpacity>
        );
    };

    const doNext = (screen: string) => {
        setPitch(localPitch);
        { /* @ts-ignore */ }
        navigation.navigate(screen);
    }
 
    // state
    
    useEffect(() => {
        getFromApi();
    }, [pitch]);  
   
    // render

    return (
        <ScreenContainer style={styles.container}>
            <Nav 
                currentScreen="Config" 
                goBack={navigation.goBack} />

            <Text style={styles.title}>Config your IA</Text>

            <Text style={styles.label}>Choose the model : </Text>
            
            <RNPickerSelect
                items={modelItems.map((model) => { return { label: model, value: model } })}
                value={selectedModel || ''}
                placeholder={{ label: 'Define your IA Model', value: '' }}
                style={{
                    inputWeb: styles.inputContainer,
                    placeholder: styles.placeholderStyle,
                    inputAndroid: styles.input,
                    inputAndroidContainer: styles.inputContainer,
                    inputIOS: styles.input,
                    inputIOSContainer: styles.inputContainer,
                }}
                onValueChange={(value) => setSelectedModel(value)}
            />

            <Text style={styles.label}>Pitch ({localPitch}) :</Text>

            <Slider
                style={styles.slider}
                minimumValue={-24}
                maximumValue={24}
                step={1}
                maximumTrackTintColor="#606060"
                minimumTrackTintColor="#6E8C9A"
                thumbTintColor="#6E8C9A"
                value={localPitch}
                onValueChange={handlePitchChange}
            />

            <View style={styles.rangeContainer}>
                <Text style={styles.rangeValue}>-24</Text>
                <Text style={styles.rangeValue}>24</Text>
            </View>

            <Text style={styles.label}>Choose the type :</Text>

            <View style={styles.radioContainer}>
                {iaItems.map((item, index) => {
                    return (
                    <RadioOption
                        key={index}
                        label={item}
                        value={item}
                        selected={type_ia === item}
                        onSelect={handleTypeChange}
                    />
                    );
                })}
            </View>

            <Group styleByDefault >
                { /* @ts-ignore */ }
                <FloatingButton text="Send" onPress={() => doNext("Send")} />
            </Group>
        </ScreenContainer>
    )

}

export default Config;