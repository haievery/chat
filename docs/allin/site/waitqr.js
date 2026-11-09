var secs = 0;
var qrUrl = "";
var qrJmp = "";
var qrmoney = 0;

var bindClick = false;
function isPC1() {
    var userAgentInfo = navigator.userAgent.toLowerCase();
    var agents = ["android", "iphone",
        "symbianos", "windows phone",
        "ipad", "ipod"];
    var flag = true;
    for (var v = 0; v < agents.length; v++) {
        if (userAgentInfo.indexOf(agents[v]) >= 0) {
            flag = false;
            break;
        }
    }
    return flag;

}
function IsJsonString(o) {
    if (typeof (o) === "string") {
        return /^\s*?\{[\s\S]*?\}\s*?$/.test(o);
    }
    return false;
}

//ajax
ajax = function (options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.async = options.async || true;
    options.dataType = (options.dataType || "json").toUpperCase();
    options.waitMsg = options.waitMsg || "";
    var xhr;
    var wait;
    //创建ajax请求对象
    xhr = new XMLHttpRequest();
    //连接和发送数据

    if (options.type === "GET") {
        var params = formatParams(options.data);
        xhr.open("GET", options.url + (params ? params : ""), options.async);
        xhr.send(null);
    } else if (options.type === "POST") {
        xhr.open("POST", options.url, options.async);

        //设置表单提交时的内容类型
        if (options.dataType === "JSON") {
            xhr.setRequestHeader("Content-Type", "application/json");
            options.data = JSON.stringify(options.data);
        } else if (options.dataType !== "FILE") {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(options.data);
    }

    //接收处理
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var status = xhr.status;

            if (status >= 200 && status < 300 || status === 304) {
                var obj = xhr.responseText;
                if (options.dataType !== "JSON") {
                    if (IsJsonString(obj)) { //json格式
                        obj = JSON.parse(obj);
                    } else {
                        obj = { state: "ok", data: obj };
                    }

                } else {
                    if (IsJsonString(obj)) {
                        obj = JSON.parse(obj);
                    } else {
                        obj = { state: "err", msg: obj.toString() };
                    }

                }
                try {
                    options.success && options.success(obj);
                    options.any && options.any(obj);
                } catch (ex) {
                    console.log(ex);
                }


            } else {
                alert(status + ":请求失败");
            }


        }
    };
};


