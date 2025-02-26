document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const sourceCodeEditor = CodeMirror(document.getElementById('sourceCodeEditor'), {
        mode: "htmlmixed",
        theme: "monokai",
        lineNumbers: true,
        autoCloseTags: true,
        lineWrapping: true,  // Adicione essa linha para permitir a quebra de linha
        showInvisibles: true // Adicione essa linha para exibir caracteres invisíveis
    });
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
            editor.innerHTML = sourceCodeEditor.getValue();
            document.getElementById('sourceCodeEditor').style.display = "none";
            editor.style.display = "block";
        } else {
            sourceCodeEditor.setValue(formatHTML(editor.innerHTML));
            document.getElementById('sourceCodeEditor').style.display = "block";
            editor.style.display = "none";
        }
        isSourceVisible = !isSourceVisible;
    }

    function formatHTML(html) {
        return html_beautify(html, {
            indent_size: 2,
            space_in_empty_paren: true
        });
    }

    async function saveAsHTML() {
        if (!isSourceVisible) {
            sourceCodeEditor.setValue(formatHTML(editor.innerHTML));
        }

        const sourceCodeValue = sourceCodeEditor.getValue();
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: 'codigo-fonte.html',
                types: [{
                    description: 'HTML Files',
                    accept: {
                        'text/html': ['.html'],
                    },
                }],
            });
            const writableStream = await handle.createWritable();
            await writableStream.write(sourceCodeValue);
            await writableStream.close();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar o arquivo.');
        }
    }

    window.execCmd = execCmd;
    window.execCmdWithArg = execCmdWithArg;
    window.toggleSource = toggleSource;
    window.formatHTML = formatHTML;
    window.saveAsHTML = saveAsHTML;
});
