document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const sourceCodeEditor = CodeMirror(document.getElementById('sourceCodeEditor'), {
        mode: "htmlmixed",
        theme: "monokai",
        lineNumbers: true,
        autoCloseTags: true,
        lineWrapping: true,
        showInvisibles: true
    });

    // Define a altura do editor principal e do CodeMirror em 90vh usando JavaScript
    editor.style.minHeight = '90vh';
    sourceCodeEditor.setSize(null, '90vh');

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

    function insertVideo() {
        const videoURL = prompt("Insira o URL de incorporação do vídeo:");
        if (videoURL) {
            const videoHTML = `<div class="video-container">${videoURL}</div>`;
            document.execCommand('insertHTML', false, videoHTML);
        }
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
    window.insertVideo = insertVideo;
    window.toggleSource = toggleSource;
    window.formatHTML = formatHTML;
    window.saveAsHTML = saveAsHTML;
});
