
var Scan = {
    gUM: false,
    c: 0,
    stype: 0,
    webkit: false,
    moz: false,
    state:"stop",

    videoInputDevice: [], //设备列表
    qrscanerE: null,
    videoElement: null,

    canvasElement: document.getElementById("qr-canvas"),
    //视频容器
    scanerElement:null,
 
    decodeTimer: null,
 
    canvasTimer: null,
    scanerBody: document.querySelector(".scanerBody"),
 
    canvasContext: null,



    dragenter(e) {
        e.stopPropagation();
e.preventDefault();
},

dragover(e) {
    e.stopPropagation();
    e.preventDefault();
},
drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    if (files.length > 0) {
        handleFiles(files);
    }
    else
        if (dt.getData('URL')) {
            qrcode.decode(dt.getData('URL'));
        }
    },
 handleFiles(f)
{
    var o = [];

    for (var i = 0; i < f.length; i++) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function (e) {
                this.canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

                qrcode.decode(e.target.result);
            };
        })(f[i]);
        reader.readAsDataURL(f[i]);
    }
},


    captureToCanvas() {
        if (Scan.state === "stop") return;
        if (Scan.stype != 1)
return;
        if (Scan.gUM) {
    try {
        Scan.canvasContext.drawImage(Scan.videoElement, 0, 0);
        try {
           
            qrcode.decode();
        }
        catch (e) {
            console.log(e);
            setTimeout(Scan.captureToCanvas, 500);
        };
    }
    catch (e) {
        console.log(e);
        setTimeout(Scan.captureToCanvas, 500);
    };
}
},

    success(stream) {

        window.stream = stream; 
        Scan.videoElement.srcObject = stream;
        Scan.videoElement.play();
        Scan.videoElement.style.display = "block";
        Scan.gUM = true;
        setTimeout(Scan.captureToCanvas, 500);
},


error(error) {
    Scan.gUM = false;
    return;
}
,

    setwebcam() {
        //关闭原来的流
        if (window.stream) {

            window.stream.getTracks().forEach((track) => {

                track.stop();

            });

        }

        var that = this;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        try {
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                    devices.forEach(function (device) {
                        if (device.kind === 'videoinput') {
                            that.videoInputDevice.push(device);
                        }
                        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
                    });
                   that.setwebcam2();
                });
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        console.log("no navigator.mediaDevices.enumerateDevices");
        that.setwebcam2();
    }

    },

    setwebcam2() {
        Scan.state = "run";
    if (Scan.stype == 1) {
        setTimeout(Scan.captureToCanvas, 500);
        return;
    }

    var that = this;


   

    //访问用户媒体设备的兼容方法
    function getUserMedia(constraints) {
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(that.success).catch(that.error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, that.success, that.error)
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            navigator.mozGetUserMedia(constraints, that.success, that.error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, that.success, that.error);
        }
    }
    var options = true;
    if (this.videoInputDevice.length > 0) { //获取最后那个摄像头
        options = { 'deviceId': { 'exact': this.videoInputDevice[this.videoInputDevice.length-1].deviceId }, 'facingMode': 'environment' };
    }
   
    getUserMedia({ video: options, audio: false });



    Scan.stype = 1;
    setTimeout(this.captureToCanvas, 500);
},

 setimg() {
     if (Scan.stype == 2)
         return;
     this.qrscanerE.querySelector(".outdiv").innerHTML = imghtml;
    //document.getElementById("qrimg").src="qrimg.png";
    //document.getElementById("webcamimg").src="webcam2.png";
    document.getElementById("qrimg").style.opacity = 1.0;
    document.getElementById("webcamimg").style.opacity = 0.2;
    var qrfile = document.getElementById("qrfile");
    qrfile.addEventListener("dragenter", dragenter, false);
    qrfile.addEventListener("dragover", dragover, false);
    qrfile.addEventListener("drop", drop, false);
    Scan.stype = 2;
},




 
    // 获取到的媒体设备
 
    gotDevices (deviceInfos) {
 
        let that = this;
 
        for (let i = 0; i !== deviceInfos.length; ++i) {

            let deviceInfo = deviceInfos[i];
 
            if (deviceInfo.kind === 'audioinput') {
 
                // 音频设备
 
            } else if (deviceInfo.kind === 'videoinput') {
 
                // 视频设备
 
                that.videoInputDevice.push(deviceInfo);
 
            } else {
 
                // 其他设备
 
                console.log('Found one other kind of source/device: ', deviceInfo);
 
            }
 
        }
 
    },
 
    getStream () {
 
        let that = this;
 
      
 
        // if(that.isIOS){
 
        //     let constraints = {
 
        //         video: { facingMode: { exact: "environment" } }
 
        //       };
 
        //     console.log('3: ', constraints);
 
        //     // let constraints = {
 
        //     //   video: {
 
        //     //     // environment表示后置摄像头
 
        //     //     // user表示前置摄像头
 
        //     //     facingMode: ("environment")
 
        //     //   }
 
        //     // };
 
        // }else{
 
        let constraints = {
 
            // 包含audio 可声明音频设备调用
 
            // 声明视频设备调用
 
            video: true
 
            //video: {
 
            //    deviceId: {
 
            //        // [1].deviceId 表示后置摄像头,默认开启的是前置摄像头
 
            //        //exact: that.videoInputDevice[1].deviceId
            //        exact: that.videoInputDevice[0].deviceId
 
            //    }
 
            //}
 
        };
 
        // }
 
 
 
        // 视频设备初始化
 
        navigator.mediaDevices.getUserMedia(constraints).then(that.gotStream.bind(that)).catch(that.handleError.bind(that));
 
        that.captureToCanvas();
 
        that.decode();
 
    },
 
 
 
    // 解码
 
    decode () {
 
        let that = this;
 
        try {
 
            qrcode.decode();
 
        } catch (e) {
 
            console.log('1:' + e);
 
        };
 
        that.decodeTimer = setTimeout(that.decode.bind(that), 100); // 解码频率为100毫秒一次
 
    },
 
 
 
    ////将视频流放到画布
 
    //captureToCanvas () {
 
    //    let that = this;
 
    //    try {

          
    //        // 根据视频大小设置canvas大小
 
    //        //let w = that.videoElement.videoWidth;
 
    //        //let h = that.videoElement.videoHeight;
    //        let w = 400;
    //        let h = 500;
 
    //        that.canvasElement.width = w;
 
    //        that.canvasElement.height = h;
 
    //        that.canvasContext.drawImage(that.videoElement, 0, 0, w, h);
 
    //    } catch (e) {
 
    //        console.log(e);
 
    //    };
 
    //    // 100毫秒绘制一次
 
    //    that.canvasTimer = setTimeout(that.captureToCanvas.bind(that), 100);
 
    //},
 
 
 
    //handleError (error) {
 
    //    //$.colorbox.close();
    //    console.log(error);
 
    //    //if (ChkUtil.IsMobileDevice()) {
    //    //    if (error.toString().indexOf("TypeError: Cannot read property 'deviceId' of undefined") != -1) {
    //    //        alert("无法访问摄像头！请授予手机浏览器摄像头权限或切换至有摄像头权限的浏览器!");
    //    //    }
    //    //} else {
    //    //    console.log(error);
    //    //}
 
    //    return;
 
    //},
 
 
 
    //gotStream (stream) {
 
    //    let that = this;
 
    //    window.stream = stream; // make stream available to console
 
    //    that.videoElement.srcObject = stream;
 
    //},

    /**
     * 初始化
     * @param {any} element
     * @param {any} callback
     * @param {any} razorPage 引入scaner的razorPage的引用，用于调用blazor 实例方法
     */
    init(element, callback, razorPage) {

        Scan.razorPage = razorPage;
        Scan.qrscanerE = element;
         this.canvasElement = document.createElement('canvas');
     
        if (this.canvasElement.getContext && this.canvasElement.getContext('2d') && window.File && window.FileReader) {

            this.canvasElement.id = "qr-canvas";
            document.body.appendChild(this.canvasElement);

            var w = 800;
            var h = 600;
 
            this.canvasElement.style.width = w + "px";
            this.canvasElement.style.height = h + "px";
            this.canvasElement.width = w;
            this.canvasElement.height = h;
            this.canvasContext = this.canvasElement.getContext('2d');
            this.canvasContext.clearRect(0, 0, w, h);

            var hasRun = false; //避免重复执行回调函数
            let that = this;
            //结果回调
            qrcode.callback = (e) => {
                if (!hasRun) {
                    // 清除画布，停止摄像头          
                    
                    Scan.stop();
                    e = e.replace("httq://", "http://").replace("httqs://", "https://"); //这里有时会把http识别为httq，可在这一步替换
                    if (e.startsWith("allin://")) { ////内部功能
                        //window.history.replaceState(null, "", e.substr(7));
                        //location.replace(e.substr(7));
                        if (Scan.razorPage) {
                            console.log(e);
                            Scan.razorPage.invokeMethodAsync("AllinFun", e);
                        }
                    } else {
                        var qrShow = Scan.qrscanerE.querySelector(".scaner-result");
                        if (qrShow) {
                            qrShow.querySelector(".result").innerHTML = "扫描结果：" + e;
                            var btns = qrShow.querySelector(".scaner-buttons");
                            btns.innerHTML = "";
                            if (e.indexOf("http://") === 0 || e.indexOf("https://") === 0) {

                                if (typeof (plus) === "undefined") {

                                    let a = document.createElement("a");
                                    a.setAttribute("class", "button is-success");
                                    a.setAttribute("href", e);
                                    a.setAttribute("target", "_blank");
                                    a.innerHTML = "打开";
                                    btns.appendChild(a);
                                } else {
                                    var b = document.createElement("button");
                                    b.setAttribute("class", "button is-success");
                                    b.addEventListener("click", function () {
                                        plus.runtime.openURL(e);
                                        return false;
                                    });
                                    b.innerHTML = "打开";
                                    btns.appendChild(b);

                                }
                            }
                            var q = document.createElement("button");
                            q.setAttribute("class", "button is-success");
                            q.addEventListener("click", function () {
                                window.back();
                            });
                            q.innerHTML = "关闭";
                            btns.appendChild(q);
                            qrShow.style.display = "block";
                        }
                    }

                    if (callback) {
                        callback(e);
                    }
                }

            };
            Scan.scanerElement = element.querySelector(".outdiv");
            Scan.scanerElement.innerHTML = '<video autoplay style="display:none;"></video>';
            Scan.videoElement = element.querySelector("video");
            Scan.setwebcam();
        }
        else {
            console.log("很抱歉，您的浏览器不支持");
            return;
        }

      

    }

    , stop() {
        Scan.state = "stop";
        clearTimeout(Scan.decodeTimer);
        clearTimeout(Scan.canvasTimer);
        clearTimeout(Scan.captureToCanvas);
        //Scan.videoElement.stop();

        Scan.canvasContext.clearRect(0, 0, 300, 200);
        if (window.stream) {

            window.stream.getVideoTracks().forEach((track) => {
                track.stop();
            });
        }
        Scan.videoElement.style.display = 'none';
        Scan.canvasElement.style.display = 'none';
        Scan.scanerBody.style.display = "none";
        if (Scan.canvasElement && Scan.canvasElement.parentNode)   Scan.canvasElement.parentNode.removeChild(Scan.canvasElement);
        if (Scan.videoElement && Scan.videoElement.parentNode) Scan.videoElement.parentNode.removeChild(Scan.videoElement);
    }
};

