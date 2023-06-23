import { Audio } from "expo-av";
import type { Recording } from "expo-av/build/Audio";

class RecordingManager {
    private _recording: Recording | null;

    constructor() {
        this._recording = null;
    }

    public async startRecording() {
        this._recording = null;
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
        const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY );
        this._recording = recording;
    }   

    public async stopRecording() {
        await this._recording?.stopAndUnloadAsync();
    }

    public getRecordingUri(): string {
        return this._recording?.getURI() || "";
    }
}

export default new RecordingManager();