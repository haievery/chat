(function () {
    var ui = document.getElementById("blazorLoaderUI");
    function load(file) {
        var xh = new XMLHttpRequest();
        ui.innerHTML = "正在加载 " + file;
        xh.open("GET", file, true);
        if (ui) {
            xh.onload = function () {
                ui.innerHTML = "";
            }
        }
        xh.send("");
    }
    function loadBlazor() {
        var xh = new XMLHttpRequest();
        xh.open("GET", "_framework/blazor.boot.json", true);
        xh.onload = function () {
            var res = JSON.parse(xh.responseText);
            for (var r in res.resources.assembly)
                load("_framework/" + r);
            for (var r in res.resources.runtime)
                load("_framework/" + r);
          //  load("_framework/blazor.webassembly.js");
        }
        xh.send("");
        //if (ui) {
        //    ui.parentNode.removeChild(ui);
        //}
    }
    loadBlazor();
})();
