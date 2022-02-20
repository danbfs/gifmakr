import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export const run = async () => {
  let videoUrl;

  const ffmpeg = createFFmpeg({ log: true });

  await ffmpeg.load();

  const video = document.getElementById("player");

  const input = document.getElementById("videoinput");

  const convertButton = document.getElementById("gifconverter");

  const image = document.getElementById("gif");

  const durationInput = document.getElementById("duration");

  const initialTimeInput = document.getElementById("initialtime");

  input.onchange = (e) => {
    videoUrl = e.target.files?.item(0);
    video.src = URL.createObjectURL(videoUrl);
    convertButton.disabled = false;
  };

  const convertToGif = async () => {
    const gifDuration = durationInput.value;
    const gifInitialTime = initialTimeInput.value;

    if (gifInitialTime > video.duration) {
      alert(
        `Initial time can't be greater than video duration (${video.duration} seconds)`
      );
      return;
    }

    if (gifDuration <= 0) {
      alert("Minimum duration is 0.1s");
      return;
    }

    const totalTime = parseFloat(gifInitialTime) + parseFloat(gifDuration);

    if (parseFloat(gifInitialTime) + parseFloat(gifDuration) > video.duration) {
      alert(
        `Initial time + duration (${totalTime}s) exceeds video length (${video.duration}s)`
      );
      return;
    }
    convertButton.disabled = true;
    convertButton.innerText = "Converting...";
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(videoUrl));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      gifDuration,
      "-ss",
      gifInitialTime,
      "-f",
      "gif",
      "out.gif"
    );

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    image.src = url;
    convertButton.disabled = false;
    convertButton.innerText = "Convert to GIF";
  };

  convertButton.onclick = convertToGif;
};
