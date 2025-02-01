const path = require("path");

function chooseFolder() {
    var input = document.createElement("input");
    input.style = "width: 1px; height: 1px; margin: 0";
    input.type = "file";
    input.setAttribute("webkitdirectory", "true");
    input.setAttribute("directory", "true");
    input.onchange = function() {
        if (input.files.length > 0) {
            var folderPath = path.dirname(input.files[0].path);
            $("#folderLocation").val(folderPath);
        }
        input.remove();
    }
    document.body.appendChild(input);
    input.click();
}