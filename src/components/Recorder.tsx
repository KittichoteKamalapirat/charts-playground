import { AudioRecorder } from "react-audio-voice-recorder";
import Chart, { APIAudioPitch, AudioPitch } from "./Chart";
import axios from "axios";
import { urlResolver } from "../utils/urlResolver";
import { useState } from "react";

function Recorder() {
  const [frequencyData, setFrequencyData] = useState<AudioPitch[]>([]);
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    getPitch(blob);
  };

  const getPitch = async (blob: Blob) => {
    const formData = new FormData();

    formData.append("file", blob);

    formData.append("pronounceWord", String("kishimoto.word"));
    formData.append("pronounceKana", String("kishimoto.kana"));

    const drawResponse = await axios.post(urlResolver.getPitch, formData, {
      headers: {
        "Content-Type": `multipart/form-data`,
      },
    });

    const drawResponseData = drawResponse.data as APIAudioPitch[];
    const formatted = drawResponseData.map((item) => ({
      frequency: item.pitch,
      seconds: item.timestamp,
    }));
    setFrequencyData(formatted);
  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          sampleRate: 44100,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err: unknown) => console.table(err)} // TODO
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        // showVisualizer={true}
      />
      <Chart data={frequencyData} />
      <br />
    </div>
  );
}

export default Recorder;
