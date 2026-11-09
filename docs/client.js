function comRun(id) {

    id = id || "app";
    com.auto.init(document.querySelector(id));
}

function playMsgAudio(sound) {
    sound = sound || "msg";
    //com.say("来消息了");
    if (window.mauiplug) {
        MauiCall("playaudio", sound);
    } else {

        switch (sound) {
            case "call":
                com.play("/allin/audio/call.wav");
                break;
            default:
                com.play("/allin/audio/msg.mp3");
                break;
        }

    }
    //var adMessage = document.getElementById("adMessage");
    //if (adMessage) {
    //    adMessage.play();
    //}
}
function scrollMsg(id, top) {
    console.log("scrollMsg:" + top);
    top = top || "end";
    var msgList = document.getElementById(id);
    if (msgList) {
        if (top == "end") {
            if (msgList.scrollHeight > msgList.clientHeight) {
                setTimeout(function () {
                    msgList.scrollTop = msgList.scrollHeight - msgList.clientHeight;
                }, 10);
            }
        } else {

            var intTop = parseInt(top);
            console.log("top:" + intTop);
            setTimeout(function () {
                msgList.scrollTop = intTop;
            }, 10);
        }
    }
}

function getScrollData(id) {

    var datas = [];
    var msgList = document.getElementById(id);
    if (msgList) {
        console.log(id + "," + msgList.scrollTop + "," + msgList.clientHeight + "," + msgList.scrollHeight);
        datas.push(parseInt(msgList.scrollTop));
        datas.push(parseInt(msgList.scrollHeight - msgList.clientHeight));
    } 12
    console.log(datas);
    return datas;
}

async function NavToLogin() {
    await localforage.removeItem("my");
    window.location.href = "/allin/login";
}



async function GetClientConfig() {
    var clientConfigName = "ClientConfig";

    if (window.mauiplug) {
        let config = window.mauiplug.CallMauiPlug("clientconfig", "");
        return JSON.parse(config);
    } else {


        return window.ClientConfig;
    }

}


window.loadJs2 = function (arrayJs) {
    if (arrayJs.length > 0) {
        var js = arrayJs.shift();
        var jsName = "js" + js.getHash();
        if (js.indexOf('(') > 0) { //js代码
            com.loadJsCode(null, jsName, js);
            window.loadJs(arrayJs);
        } else {
            if (js.indexOf('/') < 0) {
                js = "/allin/site/" + js + ".js"
            }
            com.loadJs(null, jsName, js, function () {
                window.loadJs(arrayJs);
            });
        }
    }
};

window.loadJs = function (jsName1, jsName2, jsName3) {
    if (jsName1) {
        if (jsName1.indexOf('/') < 0) {
            jsName1 = "/allin/site/" + jsName1 + ".js"
        }


        com.loadJs(null, jsName1, jsName1, function () {
            if (jsName2) {
                if (jsName2.indexOf('/') < 0) {
                    jsName2 = "/allin/site/" + jsName2 + ".js"
                }

                com.loadJs(null, jsName2, jsName2, function () {
                    if (jsName3) {
                        if (jsName3.indexOf('/') < 0) {
                            jsName3 = "/allin/site/" + jsName3 + ".js"
                        }
                        com.loadJs(null, jsName3, jsName3);
                    }
                });
            }
        });
    }
}

function LoadScanJs(qrScaner, razorPage) {
    com.loadJs(null, "qrcode", "/allin/lib/other/llqrcode.js", function () {
        com.loadJs(null, "scaner", "/allin/lib/other/scaner.js", function () {
            if (!qrScaner) {
                qrScaner = "qrscaner";
            }
            var eqrscaner = document.getElementById(qrScaner);
            Scan.init(eqrscaner, null, razorPage);
        });
    });

}


function UnloadScanJs() {
    try {
        Scan.stop();
    } catch (e) {
        console.log(e);
    }
    com.unloadJs(["scaner", "qrcode"]);
}



//通知信息
function ToNotification(info) {
    //当前页面在前台就不通知
    if (document.visibilityState === "visible") return;

    // 先检查浏览器是否支持
    if (!("Notification" in window)) {
        console.log("浏览器不支持通知服务");
        return;
    }

    var toNoti = function (info) {
        var noti = { body: info.body, tag: info.tag, icon: info.icon, requireInteraction: true };
        var n = new Notification(info.title, noti);
        n.onclick = function () {
            event.preventDefault(); // prevent the browser from focusing the Notification's tab
            location.href = info.url;

            //window.open(info.url, '_blank');
        }
    }

    var granted = (Notification.permission === "granted");


    // 检查用户是否同意接受通知
    if (granted) {
        // If it's okay let's create a notification
        toNoti(info);
    }

    // 否则我们需要向用户获取权限
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // 如果用户同意，就可以向他们发送通知
            if (permission === "granted") {
                toNoti(info);
            }
        });
    }

}

//最近的公告信息
var lastNotice = null;

window.marquee = function (selector) {
    var e = document.querySelector(selector);
    if (e) {
        var txt = e.querySelector("span");
        var newNotice = txt.innerHTML;
        var dis = e.querySelector(".hidespan");
        if (!dis) { //创建一个隐藏的span,用来计算公告的长度
            var calcDiv = document.createElement("div");
            calcDiv.style = "width: 40000000px; position: absolute; top: -1000px;";
            calcDiv.innerHTML = '<span class="hidespan" style="display: inline-block; font-size: 0.9rem"></span>';
            e.appendChild(calcDiv);
            dis = document.querySelector(".hidespan");
        }

        if (lastNotice !== newNotice) {
            lastNotice = newNotice;
            noticeshowed = true;
            dis.innerHTML = newNotice;
            //dis.innerHTML = dis.innerText.trim();
            txt.style.width = (dis.offsetWidth + 1) + "px";
            var scrollWidth = e.offsetWidth;
            var minLeft = -dis.offsetWidth;
            var i = scrollWidth;
            function change() {
                if (lastNotice != txt.innerHTML) { //公告已更新,重新滚动
                    marquee();
                    return;
                }
                try {
                    i--;
                    if (i < minLeft) {
                        i = scrollWidth;
                    }
                    txt.style.left = i + "px";
                } catch (e) {

                }
                window.requestAnimationFrame(change);
            }
            window.requestAnimationFrame(change);
        } else {
            return;
        }
    }

};

window.PrintPage = function () {
    window.print();
};


window.ExportTable = function (table) {
    var uri = "data:application/vnd.ms-excel;base64,";
    var template = '<html><head><meta charset="UTF-8"></head><body><table cellpadding="3" cellspacing="0"  border="1"  rull="all" style="border-collapse: collapse;">{table}</table></body></html>';
    var base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
    var format = function (s, c) {
        return s.replace(/{(\w+)}/g,
            function (m, p) { return c[p]; });
    };
    if (!table.nodeType) table = document.getElementById(table);
    var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML };
    //window.location.href = uri + base64(format(template, ctx));
    var link = document.createElement("a");

    link.href = uri + base64(format(template, ctx));
    link.style = "visibility:hidden";
    link.download = table.id + new Date().toLocaleDateString() + new Date().toLocaleTimeString() + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

};

window.DownloadFile = function (fileName, b64Content) {
    var link = document.createElement("a");
    if (b64Content) {
        link.href = "data:application/vnd.ms-excel;base64," + b64Content;
        link.style = "visibility:hidden";
        link.download = fileName;
    } else {
        link.href = fileName;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * 尽可能的通知用户
 * @param {any} title
 * @param {any} msg
 * @param {any} showTime
 * @param {any} sound
 */
window.TopShow = function (title, msg, showTime, sound, buttons,options) {
    showTime = showTime || 0;
    options = options || {};
    let audio;
    var close = function () {
        if (audio) audio.parentNode.removeChild(audio);
    };
    var el;
    if (buttons) { //模式框
        options.close = close;
        el = allin.ui.Modal(title, msg, buttons,  options);

    }else el = allin.ui.Message(title, msg, { showTime: showTime, close: close });


    let runBacktround = allin.env.RunInBackground();
    if (runBacktround || sound) {

        try {
            if (window.mauiplug) {
                MauiCall("playaudio", sound);
            } else {

                switch (sound) {
                    case "call":
                        audio = allin.base.playAudio("/allin/audio/call.wav", true);
                        break;
                    default:
                        audio = allin.base.playAudio("/allin/audio/msg.mp3");
                        break;
                }
            }
        } catch (e) { }

    }
    //当前页面不在前台就判断当前环境
    if (runBacktround) {
        if (window.mauiplug) { //在maui应用里运行
            window.MauiCall("message", [title, msg, sound]);
        } else { //尝试网页通知                
            let info = {};
            info.title = title;
            info.body = msg;
            info.icon = "/data/logo.png";
            try {
                ToNotification(info);
            } catch (e) { }
        }

    }
    return el;
};

/**
 * 调用Maui插件
 * @param {any} cmd 命令
 * @param {any} params  参数列表
 */

window.MauiCall = function (cmd, params) {

    if (cmd === "check") { //检测是否支持MauiPlug
        if (window.mauiplug) return true;
        else return false;
    }
    if (window.mauiplug) {
        let data = JSON.stringify(params);
        return window.mauiplug.CallMauiPlug(cmd, data);
    }
    return null;
};

/**
 * 返回否浏览器是否在后台运行
 * */
window.RunInBackgroud = function () {
    return document.hidden;
}
window.NetWorkMessage = null;
window.Offline = function () {
    if (window.NetWorkMessage) {
        try {
            document.body.removeChild(window.NetWorkMessage);
        } catch (e) { }
    }
    window.NetWorkMessage = TopShow("网络", "您已掉线，正在重新连接...", 0);
}

window.Online = function () {
    if (window.NetWorkMessage) {
        try {
            document.body.removeChild(window.NetWorkMessage);
        } catch (e) { }
    }
    TopShow("网络", "网络连接成功", 3000);
}


window.ClientEnv = function () {
    var env = {};
    if (window.mauiplug) {
        env.IsApp = true;
        var data = window.mauiplug.CallMauiPlug("device", "");
        if (data) {
            let arr = data.split(',');
            if (arr.length >= 4) {
                env.Manufacturer = arr[0];
                env.Model = arr[1];
                env.DeviceId = arr[2];
                env.ClientVer = arr[3];
            }
        }

    } else env.IsApp = false;
    env.DeviceWidth = window.screen.width;
    env.DeviceHeight = window.screen.height;
    env.IsAndroid = allin.env.IsAndroid();
    env.IsIOS = allin.env.IsIOS();



    return env;
}