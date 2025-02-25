document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const sourceCode = document.getElementById('sourceCode');
    let isSourceVisible = false;

    function execCmd(command) {
        if (command === 'createLink' || command === 'insertImage') {
            const url = prompt("Insira o URL:");
            document.execCommand(command, false, url);
        } else {
            document.execCommand(command, false, null);
        }
    }

    function execCmdWithArg(command, arg) {
        document.execCommand(command, false, arg);
    }

    function toggleSource() {
        if (isSourceVisible) {
            editor.innerHTML = sourceCode.value;
            sourceCode.style.display = "none";
            editor.style.display = "block";
        } else {
            sourceCode.value = formatHTML(editor.innerHTML);
            sourceCode.style.display = "block";
            editor.style.display = "none";
        }
        isSourceVisible = !isSourceVisible;
    }

    function formatHTML(html) {
        const formattedHTML = html.replace(/></g, ">\n<");
        return formattedHTML;
    }

    window.execCmd = execCmd;
    window.execCmdWithArg = execCmdWithArg;
    window.toggleSource = toggleSource;
    window.formatHTML = formatHTML;
});
