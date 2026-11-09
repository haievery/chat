var recAudio = recAudio || new (class RecAudio {
    constructor() {
        this.rec = null;
        this.uploadUrl = null;
        //.net对象
        this.dotnetObject = null;
    }

    /**调用open打开录音请求好录音权限**/
    recOpen(success) {//一般在显示出录音按钮或相关的录音界面时进行此方法调用，后面用户点击开始录音时就能畅通无阻了
        if (this.rec) {
            try {
                this.recClose();
            } catch {

            }
            this.rec = null;

        }
        this.rec = Recorder({
            type: "mp3", sampleRate: 16000, bitRate: 16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
            , onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
                //录音实时回调，大约1秒调用12次本回调
                try {
                    document.querySelector(".recpowerx").style.width = powerLevel + "%";
                } catch {

                }
            }
        });

        //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
        this.rec.open(function () {//打开麦克风授权获得相关资源
            //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
            //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程

            success && success();
        }, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
            //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
            console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
        });
    };

    /**开始录音**/
    recStart() {//打开了录音后才能进行start、stop调用
        this.rec.start();
    };

    recClose() {
        this.rec.close();
        this.rec = nul;
    }

    /**结束录音**/
    recStop() {
        var me = this;
        this.rec.stop(function (blob, duration) {
            me.rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
            me.rec = null;
            var reader = new FileReader();
            reader.onloadend = function () {
                var b64 = reader.result;
                me.dotnetObject.invokeMethodAsync("UploadRecData", b64);
            };
            reader.readAsDataURL(blob);
            return;
        }, function (msg) {
            console.log("录音失败:" + msg);
            me.rec.close();//可以通过stop方法的第3个参数来自动调用close
            me.rec = null;
        });
    };

    recBegin(dotnetObj, uploadUrl) {
        this.dotnetObject = dotnetObj;
        this.uploadUrl = uploadUrl;
        var me = this;

        this.recOpen(function () {
            me.recStart();
            //  setTimeout(recStop,3000);
        });
    }

    zipImage(dotnetObj, base64) {
        let me = this;
        // 压缩图片需要的一些元素和对象
       // var reader = new FileReader();
        var img = new Image();
        debugger;
        // 缩放图片需要的canvas
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        // base64地址图片加载完毕后
        img.onload = function () {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 900, maxHeight = 900;
            // 目标尺寸
            var targetWidth = originWidth, targetHeight = originHeight;
            // 图片尺寸超出限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
                if (originWidth / originHeight > maxWidth / maxHeight) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth;
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                } else {
                    targetHeight = maxHeight;
                    targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为File并上传,0.8为清淅度
            var dataurl = canvas.toDataURL("image/jpeg",0.7);
            dotnetObj.invokeMethodAsync("UploadRecData", dataurl);
        };
        img.src = base64;
        // 文件base64化，以便获知图片原始尺寸
        //reader.onload = function (e) {
        //    img.src = e.target.result;
        //};
        //reader.re(blob);
        return;
    }
    recCancel() {
        this.recClose();
    }
})();


