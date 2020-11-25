const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const redButton = document.getElementById('red')

function getVideo() { // gets the video to play
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream)
            try {
                video.srcObject = localMediaStream;
                console.log(1)
              } catch (error) {
                console.error("You denied the webcam. Access is required to proceed.")
              }
              video.play();
        })
}
let num = 0;


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height) // start in the upper left side of the canvas and paint the width and height
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height); // huge array of numbers representing rgba
        //mess with them
        redButton.addEventListener('click', () => {
            pixels = redEffect(pixels)
        })
        // pixels = redEffect(pixels)
        // pixels = rgbSplit(pixels)
        // ctx.globalAlpha = 0.1;
        
        // pixels = greenScreen(pixels)
        //put them back
        ctx.putImageData(pixels, 0, 0)
    }, 16)
}

function takePhoto() {
    //play the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg'); // text based version of the photo
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'goodlooking')
    link.innerHTML = `<img src="${data}" alt="Good Looking" />` // 
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i=0; i<pixels.data.length; i+=4) {
        // pixels[i] =  // red
        // pixels[i + 1] // green
        // pixels[i + 2] // blue
        pixels.data[i + 0] = pixels.data[i + 0] + 200;
        pixels.data[i + 1] = pixels.data[i + 1] - 50;
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
    }
    return pixels
}
function rgbSplit(pixels) {
    for(let i=0; i<pixels.data.length; i+=4) {
        pixels.data[i - 150] = pixels.data[i + 0];
        pixels.data[i + 500] = pixels.data[i + 1];
        pixels.data[i - 350] = pixels.data[i + 2];
    }
    return pixels
}

function greenScreen(pixels) {
    const levels = {} // will hold minimum and maximum green
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });
    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];
    
        if (red >= levels.rmin
          && green >= levels.gmin
          && blue >= levels.bmin
          && red <= levels.rmax
          && green <= levels.gmax
          && blue <= levels.bmax) {
          // take it out! 
          pixels.data[i + 3] = 0; // transparency pixel
        }
      }
    
      return pixels;
}

getVideo()

video.addEventListener('canplay', paintToCanvas)