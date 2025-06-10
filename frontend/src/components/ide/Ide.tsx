import Editor from '@monaco-editor/react';
import { fileTypes } from "./constants"



import styles from './Ide.module.css';
import { useEffect, useRef, useState } from 'react';
import { languages } from 'monaco-editor';

function Ide() {
    const monacoRef = useRef(null);

    function handleEditorDidMount(editor, monaco) {
        // here is another way to get monaco instance
        // you can also store it in `useRef` for further usage
        monacoRef.current = monaco;
    }


    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                Toolbar
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