import Editor from '@monaco-editor/react';
import { fileTypes } from "./constants"
import styles from './Ide.module.css';
import { useEffect, useRef, useState } from 'react';
import { languages, editor } from 'monaco-editor';
import axios from "axios";

function Ide() {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [inp, setInp] = useState('input');
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function handleRunCode() {
        const code = editorRef.current?.getValue();
        const input = inp;
        const url = "http://localhost:3000/";
        const payload = {
            code: code, input: input,
        }
        axios.post(url, payload)
            .then((response) => { 
                console.log("Server data POST success", response); 

                const outputBox = document.getElementById('output') as HTMLTextAreaElement;
                if (outputBox) {
                    outputBox.value = response.data.output;
                }
            })
            .catch((err) => console.log(`error : ${err}`));
    }

    //TODO : Tryu to use memoization with useMemo
    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                Toolbar
                <button onClick={() => handleRunCode()}>Submit</button>
            </div>

            <div className={styles.codeBoxes}>
                <div className={styles.editorContainer}>
                    <Editor
                        // onChange={setCode}
                        height="90vh"
                        language="cpp"
                        theme="vs-dark"
                        value={fileTypes.cpp.templateCode}
                        onMount={handleEditorDidMount}

                    />;

                </div>
                <div className={styles.iocontainer}>

                    <textarea name="input" id="input" value={inp} onChange={(e)=> setInp(e.target.value)}></textarea>


                    {/* <textarea name="expected_output" id="expected_output" defaultValue={"expected output"}></textarea> */}
                    <textarea name="output" id="output" defaultValue={"output"}></textarea>
                </div>
            </div>
        </div>
    );
}

export default Ide;