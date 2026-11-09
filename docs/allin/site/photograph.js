/**
 * 拍图
 * */

var a= a || class Photograph {
    constructor() {
        this.stream = null;
        this.roomId = "";
        this.width = window.screen.width;
        this.height = window.screen.height;
        console.log(this.width + "*" + this.height);
        this.container = document.getElementById("allin_chat_photograph");
        this.videoContainer = this.container.querySelector(".stopChat");
        this.videoElement = this.container.querySelector("video");
        this.imgContainer = this.container.querySelector(".picPreview");
        this.img = this.imgContainer.querySelector("img");


    }

    async show() {
        this.roomId = "a331341342";
        this.imgContainer.style.display = "none";
        this.container.style.display = "block";
        this.videoContainer.style.display = "block";
        this.videoElement.style.display = "block";
        this.getUserMedia();
      
    }


    async getUserMedia() {
        try {
            debugger;
            this.width = window.screen.width;
            this.height = window.screen.height;
            const constraints = {
                video: {
                    width: this.width, height: this.height,
                    facingMode: 'environment'
                }, audio: false
            };
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function (constraints) {
                    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
                    if (!getUserMedia) {
                        return Promise.reject(new Error('不支持getUserMedia'));
                    }
                    return new Promise(function (resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                }
            }


            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.stream = stream;
         
            this.videoElement.srcObject = stream;
        } catch (err) {
            console.error('user media error.', err.name, err.message);
        }
    }

    async takePhoto() {

        debugger;
        //获得Canvas对象
        let canvas = document.getElementById('canvas');

        canvas.width = this.videoElement.videoWidth;
        canvas.height = this.videoElement.videoHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
        this.img.src = document.getElementById('canvas').toDataURL();
       

        this.videoContainer.style.display = "none";
        this.videoElement.style.display = "none";
        this.imgContainer.style.display = "block";
        // //压缩
        //allin.base.ZipImg(document.getElementById('canvas').toDataURL()).then((imgdataUrl) => {
        //    //this.img.src = imgdataUrl;
        //    this.img.src = document.getElementById('canvas').toDataURL();
        //    this.videoContainer.style.display = "none";
        //    this.videoElement.style.display = "none";
        //    this.imgContainer.style.display = "block";
        //});

     
    }

    async reTakePhoto() {
        this.videoContainer.style.display = "block";
        this.videoElement.style.display = "block";
        this.imgContainer.style.display = "none";
    }

    async close() {
        this.container.style.display = "none";
        if (this.stream) {
            let tracks = this.stream.getTracks();
            tracks.forEach(function (track) {
                track.stop();
            });
            this.videoElement.srcObject = null;
        }
    }

    async upload() {
        return this.img.src;
    }
}
var photograph = new a();

async function Photograph_Close() {
    photograph.close();
    photograph = null;
}

