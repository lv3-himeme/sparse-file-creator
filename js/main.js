const path = require("path");
const fs = require("fs");
var modal = new Modal();

var fnScript = "", fsScript = "";

function codeEditor(element) {
    return CodeMirror.fromTextArea(element, {
        mode: "javascript",
        theme: "monokai"
    });
}

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

function codeEditorModal(type = "Name") {
    modal.title = `File ${type} Script`;
    modal.body = `
        <div class="grid script">
            <div>You can write a script with function <code>define${type}(index)</code> defining the file name for each file (index), with <code>index</code> variable being the current index number of that file (from 0 to length - 1).</div>
            <div>
                <textarea id="code"></textarea>
            </div>
        </div>
    `;
    modal.footer = `
        <button type="button" class="btn btn-primary" onclick="saveFile${type}Script()">Save</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    `;
    modal.show();
    if (!fnScript) $("#code").val(`function define${type}(index) {\n\treturn index;\n}`);
    else $("#code").val(fnScript);
    modal.editor = codeEditor(document.getElementById("code"));
    setTimeout(() => modal.editor.refresh(), 500);
}

function testScript(script, type) {
    try {
        // Test the script syntax
        (function() { eval(`${script}\ndefine${type}(0)`) })();
    }
    catch (err) {
        alert(`Syntax error in define script. Please check the script again.\n${err.stack}`);
        return false;
    }
    return true;
}

function saveFileNameScript() {
    var script = modal.editor.getValue();
    if (!testScript(script, "Name")) return;
    fnScript = script;
    modal.hide();
    $("#fileNameRadio3").prop("checked", true);
}

function saveFileSizeScript() {
    var script = modal.editor.getValue();
    if (!testScript(script, "Size")) return;
    fsScript = script;
    modal.hide();
    $("#fileSizeRadio3").prop("checked", true);
}

function createFile(path, size) {
    var file = fs.openSync(path, "w");
    fs.ftruncateSync(file, size);
    fs.close(file);
}

function randomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

function begin() {
    $("input").prop("disabled", true);
    (function() {
        try {
            var folder = $("#folderLocation").val(),
                fileNameType = (function() {
                    for (var i = 1; i <= 3; i++) if ($(`#fileNameRadio${i}`).prop("checked")) return i;
                    return 0;
                })(),
                extension = $("#fileExtension").val(),
                fileSizeType = (function() {
                    for (var i = 1; i <= 3; i++) if ($(`#fileSizeRadio${i}`).prop("checked")) return i;
                    return 0;
                })(),
                quantity = Number($("#fileQuantity").val()) || 1;
            if (!folder) return alert("Please choose an output folder.");
            if (!fileNameType) return alert("Please specify a file name.");
            if (!fileSizeType) return alert("Please specify a file size.");
            $("#fileQuantity").val(quantity);
            if (!fs.existsSync(folder) && confirm(`${folder} does not exist. Create it?`)) fs.mkdirSync(folder, {recursive: true});
            for (var i = 0; i < quantity; i++) {
                $("#progress").css("width", `${i / quantity * 100}%`);
                var names = [$("#fileName").val(), randomString(Number($("#fileNameCharLength").val())), (function() {
                    if (!fnScript) return null;
                    eval(fnScript);
                    return defineName();
                })()],
                    fileName = names[fileNameType - 1];
                if (!fileName) return alert("Please specify a file name.");
                var sizes = [Number($("#fileSize").val()), (function() {
                    var min = Number($("#fileSizeMin").val()), max = Number($("#fileSizeMax").val());
                    return Math.floor(Math.random() * max - min + 1) + min;
                })(), (function() {
                    if (!fsScript) return null;
                    eval(fsScript);
                    return defineSize();
                })()],
                    fileSize = sizes[fileSizeType - 1];
                if (!fileSize) return alert("Please specify a file size.");
                createFile(path.join(folder, `${fileName}${extension ? `.${extension}` : ""}`), fileSize);
            }
            alert(`Successfully created ${quantity} file(s).`);
        }
        catch (err) {
            console.error(err);
            alert(err.stack);
        }
    })();
    $("#progress").css("width", `0%`);
    $("input").prop("disabled", false);
}