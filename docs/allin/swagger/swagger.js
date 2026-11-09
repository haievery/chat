
(function () {
  
    function fixUI() {
        var eSwagger = document.getElementById("swagger-ui");
            var eLogo = eSwagger.querySelector(".topbar-wrapper");
            if (eLogo) {
                eLogo = eLogo.querySelector("img");
                eLogo.src = "/allin_file/brand/logo";
        }

        /*隐藏授权按钮*/
        var eAuth = eSwagger.querySelector(".scheme-container"); 
        //if (eAuth) {
        //    eAuth.style.display = "none";
        //}

        //显示界面
        eSwagger.style.display = "block";
    }

    function checkUI() {
        if (!window.ui) {
            setTimeout(checkUI, 1000);
        } else {
            fixUI();
        }
    }
    checkUI();



})();

