function include(file) {
    var script = document.createElement("script");
    script.src = file;
    script.type = "text/javascript";
    script.async = false;
    document.getElementsByTagName("head").item(0).appendChild(script);
  }
  
include("./utils.js");
include("./noteController.js");
include("./app.js");
