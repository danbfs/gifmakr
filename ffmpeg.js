import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export const run = async () => {
  let videoUrl;

  const ffmpeg = createFFmpeg({ log: true });

  await ffmpeg.load();

  const video = document.getElementById("player");

  const input = document.getElementById("videoinput");

  const convertButton = document.getElementById("gifconverter");

  const image = document.getElementById("gif");

  input.onchange = (e) => {
    videoUrl = e.target.files?.item(0);
    video.src = URL.createObjectURL(videoUrl);
    convertButton.disabled = false;
  };

  const convertToGif = async () => {
    convertButton.disabled = true;
    convertButton.innerText = "Converting...";
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(videoUrl));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
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
