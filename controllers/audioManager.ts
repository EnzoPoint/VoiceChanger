import { Audio } from "expo-av";

import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Platform} from 'react-native';
import {StorageAccessFramework} from 'expo-file-system';

class AudioManager {
    private _song: Audio.Sound | null;

    constructor() {
        this._song = null;
    }

    public async startPlaying(uri: string) {
        this._song = new Audio.Sound();

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        })
        await Audio.requestPermissionsAsync();

        await this._song?.loadAsync({ uri })
        await this._song?.playAsync();
    }   

    public async stopPlaying() {
        return await this._song?.unloadAsync();
    }

    public getFileFrom = async (uri: string): Promise<string> => {
        const filePath = uri;

        if(filePath.match(/data:/)) return filePath;

        try {
            const response = await fetch(filePath);
            const blob = await response.blob();
            const reader = new FileReader();

            return new Promise<string>((resolve, reject) => {
              reader.onloadend = () => {
                const fileContent = reader.result as string;

                resolve(fileContent);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
        } catch (error) {
          console.error('Error reading audio file:', error);
          return '';
        }
    };  

    public copyToTheCache = async (uri: string): Promise<string> => {      
      try {
        return new Promise<string>((resolve, reject) => {
          FileSystem.copyAsync({
            from: uri,
            to: FileSystem.cacheDirectory + 'audio.wav',
          }).then(() => {
            resolve(FileSystem.cacheDirectory + 'audio.wav');
          }).catch((e) => {
            reject(e);
          });
        });
      } catch (error) {
        console.error('Error copying file to the cache:', error);
        return '';
      }
    }


    
    public downloadFile = async (base64Data: string, filename: string) => {
      try {    
        if (Platform.OS === "android") {
            const permissions_ = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!permissions_.granted) return;
            const uri = await StorageAccessFramework.createFileAsync(
              permissions_.directoryUri,
              filename,
              'audio/x-wav',
            );
            await FileSystem.writeAsStringAsync(uri, base64Data, {encoding: 'base64'});
        } else {

          const result = await FileSystem.downloadAsync(
            base64Data,
            FileSystem.documentDirectory + filename,
          )

          if(result.status === 200) {
            await shareAsync(result.uri);
          }
        }
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };


}

export default new AudioManager();

