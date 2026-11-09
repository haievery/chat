/////////////////////////////////////
//Created by ZangMeng
//调用方法  new VDisk(callback,mode).show();
//
////////////////////////
var DISK_DES_IDNAME = "data-disk-id";
//定义虚拟网盘属性
VDisk.prototype = {
    _mode: 0,
    _callback: null,
    _page: null,
    _popEdit: null,
    _diskId: "00000000-0000-0000-0000-000000000000",
    show: function (diskId) {

        if (diskId !== null && diskId !== "") this._diskId = diskId;
        disk_load(this);

    }

}

/**
 * @param {any} page 加载页
 * @param {any} mode 加载模式，0：显示文件夹信息， 1:单选  2：多选
 * @param {any} callback 回调方法 会将选择的文件ID传给调用函数
 */
function VDisk(page, mode, callback) {
    if (page) {
        this._page = page.pageContent;
    } else {
        this._page = document.createElement("div");
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(this._page);
    }
    this._mode = mode;
    this._callback = callback;
}

function disk_load(vdisk) {
    var url = "/allin/File/Load/" + vdisk._diskId + "?mode=" + vdisk._mode;
    vdisk._page.innerHTML = '';
    var className = "file-selected";
    com.ajax({
        type: "GET",
        url: com.base.GetFullUrl(url),
        data: null,
        dataType: "html",
        success: function (back) {
            vdisk._page.innerHTML = back.data;
           
            com.auto.init(vdisk._page, function (element) {
                if (vdisk._mode > 0) { //选择模式
                    var btnOk = vdisk._page.querySelector(".com-disk-ok");
                    if (btnOk) {
                        var btnBack = vdisk._page.querySelector(".com-disk-back");
                        btnOk.classList.remove("com-disk-ok");
                        btnBack.classList.remove("com-disk-back");
                        btnBack.addEventListener("click", function () {

                            vdisk._page.parentNode.removeChild(vdisk._page);
                            if (vdisk._callback) vdisk._callback("back");
                        });
                        btnOk.addEventListener("click", function () {
                            var a = new Array();
                            vdisk._page.querySelectorAll(".file-selected").forEach(function (e) {
                                a.push(e.getAttribute("com-disk-file"));
                            });
                          
                            vdisk._page.parentNode.removeChild(vdisk._page);
                            if (vdisk._callback) vdisk._callback("ok", a);
                        });
                    }
                 
                    element.querySelectorAll("[com-disk-file]").forEach(function (e) {
                   
                        e.addEventListener("click", function (e1) {
                            switch (vdisk._mode) {
                                case 1: //单选
                                    //node.querySelectorAll("[com-disk-file]").forEach(function (e2) {
                                    //    e2.classList.toggle(className, false);
                                    //});
                                    //this.classList.add(className);     
                                    var id = this.getAttribute("com-disk-file");
                                    vdisk._page.parentNode.removeChild(vdisk._page);
                                    if (vdisk._callback) vdisk._callback("ok", id);
                                 
                                    break;
                                case 2: //多选
                                    this.classList.toggle(className);
                                    break;

                            }


                        });
                    });
                }

                var clickFun = function () {
                    var id = this.getAttribute("com-disk-dir");
                    vdisk._page.querySelector("[com-disk-dirid]").value = id;
                    vdisk._page.querySelector(".com-disk-upload button").setAttribute("com-post", "/allin/File/Upload/" + id);
                    vdisk._page.querySelector("[com-disk-search]").click();
                };
              
                element.querySelectorAll("[com-disk-dir]").forEach(function (dir) {
                    com.removeEvent(dir, "click", clickFun);
                    com.addEvent(dir, "click", clickFun);
                });
              
            });
        }
    });
}