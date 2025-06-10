import Editor from '@monaco-editor/react';
import { fileTypes } from "./constants"
import styles from './Ide.module.css';
import { useEffect, useRef, useState } from 'react';
import { languages, editor } from 'monaco-editor';
import axios from "axios";

function Ide() {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function handleRunCode() {
        const code = editorRef.current?.getValue();
        const input = document.getElementById('input')?.textContent;
        const url = "http://localhost:3000/";
        const payload = {
            code: code, input: input,
        }
        axios.post(url, payload)
            .then(() => console.log("Server data POST success"))
            .catch((err) => console.log(`error : ${err}`));
    }


    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                Toolbar
                <button onClick={() =>handleRunCode ()}>Submit</button>
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
                    <textarea name="input" id="input" defaultValue={"input"}></textarea>
                    <textarea name="expected_output" id="expected_output" defaultValue={"expected output"}></textarea>
                    <textarea name="output" id="output" defaultValue={"output"}></textarea>
                </div>
            </div>
        </div>
    );
}

export default Ide;