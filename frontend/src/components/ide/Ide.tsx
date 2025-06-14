import Editor from '@monaco-editor/react';
import { fileTypes } from "./constants"
import styles from './Ide.module.css';
import { useEffect, useRef, useState } from 'react';
import { languages, editor } from 'monaco-editor';
import axios from "axios";

function Ide() {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [inp, setInp] = useState('input');
    const [outputBox, setOutputBox] = useState('ouptut');
    const [isRunning, setIsRunning] = useState(false);

    const axiosCancelTokenRef = useRef<CancelTokenSource | null>(null); // Ref to store the cancel token

    useEffect(() => {
        // This is the cleanup function that runs when the component unmounts
        return () => {
            if (axiosCancelTokenRef.current) {
                axiosCancelTokenRef.current.cancel("Component unmounted, request cancelled.");
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor;
    }

    function handleRunCode() {
        if (isRunning)
            return;
        setIsRunning(true);
        const code = editorRef.current?.getValue();
        const input = inp;
        const url = "http://localhost:3000/code";
        const payload = {
            code: code, input: input,
        }
        axios.post(url, payload)
            .then((response) => {
                console.log("Server data POST success", response);
                console.log(response);
                setOutputBox(response.data.output);

            })
            .catch((err) => {
                setOutputBox(err);
            })
            .finally(() => {
                setIsRunning(false);
            });
    }

    //TODO : Tryu to use memoization with useMemo
    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                <img src="../../../c-.png" alt="cpp logo" className={styles.logo}/>
                <div className={styles.toolbarTitle}>Runner</div>
                <button className={styles.submitButton}onClick={() => handleRunCode()} disabled={isRunning}>{isRunning ? "Running..." : "Submit   "}</button>
                <a className={styles.toolbarLink}href="https://github.com/phANTom2303"> Made by Anish</a>
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

                    />

                </div>
                <div className={styles.iocontainer}>

                    <textarea name="input" id="input" value={inp} onChange={(e) => setInp(e.target.value)}></textarea>


                    {/* <textarea name="expected_output" id="expected_output" defaultValue={"expected output"}></textarea> */}
                    <textarea name="output" id="output" value={outputBox}></textarea>
                </div>
            </div>
        </div>
    );
}

export default Ide;