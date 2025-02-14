const path = require("path");
var modal = new Modal();

var fnScript = "";

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

function fileNameScript() {
    modal.title = "File Name Script";
    modal.body = `
        <div class="grid script">
            <div>You can write a script with function <code>defineName(index)</code> defining the file name for each file (index), with <code>index</code> variable being the current index number of that file (from 0 to length - 1).</div>
            <div>
                <textarea id="code"></textarea>
            </div>
        </div>
    `;
    modal.footer = `
        <button type="button" class="btn btn-primary" onclick="saveFileNameScript()">Save</button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
    `;
    modal.show();
    if (!fnScript) $("#code").val(`function defineName(index) {\n\treturn index;\n}`);
    else $("#code").val(fnScript);
    modal.editor = codeEditor(document.getElementById("code"));
    setTimeout(() => modal.editor.refresh(), 500);
}

function saveFileNameScript() {
    var script = modal.editor.getValue();
    try {
        // Test the script syntax
        (function() { eval(script) })();
    }
    catch (err) {
        alert(`Syntax error in define script. Please check the script again.\n${err.stack}`);
        return;
    }
    fnScript = script;
    modal.hide();
    $("#fileNameRadio3").prop("checked", true);
}