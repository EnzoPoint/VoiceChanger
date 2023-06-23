
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context API configuration

export interface AppContextType {
    ipv4: string;
    isConnected: boolean;
    recording: Recording[];
    pitch : number;
    type_ia: string;
    selectedModel: string;
    setSelectedModel: (data: string) => void;
    setType_ia: (data: string) => void;
    setPitch: (data: number) => void;
    setIPV4: (data: string) => void;
    setConnexion: (data: boolean) => void;
    setRecordingBase64: (data: Recording[] ) => void;
}

export type Recording = {
    id: number;
    uri: string;
    name: string;
    date: Date;
    selected: boolean;
  };
  

export const initContext: AppContextType = {
    ipv4: '',
    isConnected: false,
    recording: [],
    pitch: 0,
    type_ia: 'pm',
    selectedModel: 'pm',
    setSelectedModel: () => { },
    setType_ia: () => { },  
    setPitch: () => { },
    setIPV4: () => { },
    setConnexion: () => { },
    setRecordingBase64: () => { }
}

export const Context = React.createContext(initContext)

// Dealing with AsyncStorage

/**
 * Get the adress IPV4 for the connexion from async storage
 * @returns Promise<string> The string of the ipv4
 */

export const getStorageIPV4 = () => {
    return AsyncStorage.getItem('@ipv4').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<string>
}

/**
 * Set the ipv4 in async storage
 * @param data The ipv4 to set in async storage
 * @returns Promise<void>
 */

export const setStorageIPV4 = (data: string) => {
    return AsyncStorage.setItem('@ipv4', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getStorageIPV4())
}

/**
 * Get the port for the connexion from async storage
 * @returns Promise<number> The string of the port
 */

export const getStatusConnexion = () => {
    return AsyncStorage.getItem('@connexion').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<boolean>
}

/**
 * Set the port in async storage
 * @param data The port to set in async storage
 * @returns Promise<void>
 */

export const setStatusConnexion = async (data: boolean) => {
    return AsyncStorage.setItem('@connexion', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getStatusConnexion())
}

/**
 * 
 * @returns Promise<string[]> The string of the uri
 * @description Get the uri of the recording from async storage
 */

export const getRecordings = (): Promise<Recording[]>  => {    
    return AsyncStorage.getItem('@audios').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<[]>
}

/**
 *  
 * @param data The uri to set in async storage
 * @returns Promise<void>
 * @description Set the uri of the recording in async storage
 */

export const setStorageRecording = async (data: Recording[]) => {
    // console.log("YOPAA")
    // console.log(JSON.stringify(data))
    return AsyncStorage.setItem('@audios', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getRecordings())
}

/**
 * 
 * @param data The uri to set in async storage
 * @returns Promise<void>
* @description Get the model of the recording in async storage
*/

export const getStorageModel = () => {
    return AsyncStorage.getItem('@model').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<string>
}

/**
 * 
 * @param data The uri to set in async storage
 * @returns Promise<void>
* @description Set the model of the recording in async storage
*/

export const setStorageModel = async (data: string) => {
    return AsyncStorage.setItem('@model', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getStorageModel())
}

export const getStoragePitch = () => {
    return AsyncStorage.getItem('@pitch').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<number>
}

export const setStoragePitch = async (data: number) => {
    return AsyncStorage.setItem('@pitch', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getStoragePitch())
}

export const getStorageTypeIA = () => {
    return AsyncStorage.getItem('@type_ia').then((res) => res != null ? JSON.parse(res) : []).catch(e => {
        console.log(e)
        return []
    }) as Promise<string>
}

export const setStorageTypeIA = async (data: string) => {
    return AsyncStorage.setItem('@type_ia', JSON.stringify(data)).catch(e => {
        console.log(e);
    }).then(() => getStorageTypeIA())
}
