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
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const content = range.extractContents();
        const wrapper = document.createElement(command === 'insertUnorderedList' ? 'ul' : 'ol');
        wrapper.className = arg;

        if (content.childNodes.length > 0) {
            Array.from(content.childNodes).forEach(node => {
                const li = document.createElement('li');
                while (node.firstChild) {
                    li.appendChild(node.firstChild);
                }
                wrapper.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode('Novo item'));
            wrapper.appendChild(li);
        }

        range.deleteContents();
        range.insertNode(wrapper);
    }

    function insertImageLink() {
        const imageUrl = prompt("Insira o URL da imagem:");
        if (imageUrl) {
            const imgHTML = `<img src="${imageUrl}" alt="Imagem">`;
            document.execCommand('insertHTML', false, imgHTML);
        }
    }

    function floatImage(direction) {
        const img = getSelectedImage();
        if (img) {
            img.style.float = direction;
        }
    }

    function resizeImage(sizeClass) {
        const img = getSelectedImage();
        if (img) {
            img.className = sizeClass;
        }
    }

    function getSelectedImage() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const container = range.startContainer;
            if (container.nodeType === Node.ELEMENT_NODE && container.tagName === 'IMG') {
                return container;
            } else if (container.parentNode && container.parentNode.tagName === 'IMG') {
                return container.parentNode;
            }
        }
        return null;
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
    window.insertImageLink = insertImageLink;
    window.floatImage = floatImage;
    window.resizeImage = resizeImage;
    window.insertVideo = insertVideo;
    window.toggleSource = toggleSource;
    window.formatHTML = formatHTML;
    window.saveAsHTML = saveAsHTML;
});
