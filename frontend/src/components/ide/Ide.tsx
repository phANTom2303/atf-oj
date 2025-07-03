import Editor from '@monaco-editor/react';
import { fileTypes } from "./constants"
import styles from './Ide.module.css';
import { useEffect, useRef, useState } from 'react';
import { languages, editor } from 'monaco-editor';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useUser } from '../../App';

import axios from "axios";

function Ide() {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [inp, setInp] = useState('input');
    const [outputBox, setOutputBox] = useState('ouptut');
    const [expectedOutput, setExpectedOutput] = useState('expected output');
    const [isRunning, setIsRunning] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Ready to Execute');
    const [isCheckerActive, setIsCheckerActive] = useState(false);
    const { user, setUser } = useUser();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const axiosCancelTokenRef = useRef<any>(null); // Ref to store the cancel token

    useEffect(() => {
        // This is the cleanup function that runs when the component unmounts
        return () => {
            if (axiosCancelTokenRef.current) {
                axiosCancelTokenRef.current.cancel("Component unmounted, request cancelled.");
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;
    }

    function handleRunCode() {
        if (isRunning)
            return;
        setIsRunning(true);
        setStatusMessage("Running...");
        const code = editorRef.current?.getValue();
        const input = inp;
        const url = `${backendUrl}/code`;
        const payload = {
            code: code, input: input,
        }
        axios.post(url, payload)
            .then((response) => {
                console.log("Server data POST success", response);
                console.log(response);
                setOutputBox((response.data.output.output) ? response.data.output.output : response.data.output);
                if (response.data.status) {
                    const executionTime = response.data.executionTime;
                    let baseMessage = `Executed in ${executionTime} ms`;
                    
                    // Only compare outputs if checker is active
                    if (isCheckerActive) {
                        // Compare expected output with actual output
                        const actualOutput = (response.data.output.output) ? response.data.output.output : response.data.output;
                        const expectedOutputTrimmed = expectedOutput.trim().toLowerCase();
                        const actualOutputTrimmed = actualOutput.trim().toLowerCase();
                        
                        if (expectedOutputTrimmed === actualOutputTrimmed) {
                            setStatusMessage(`${baseMessage} - Correct Answer`);
                        } else {
                            setStatusMessage(`${baseMessage} - Wrong Answer`);
                        }
                    } else {
                        // Just show the base message when checker is inactive
                        setStatusMessage(baseMessage);
                    }
                } else {
                    const error = response.data.error;
                    if (error === 'compilation_error')
                        setStatusMessage("Compilation Error");
                    else if (error === 'time_limit_exceeded')
                        setStatusMessage("Time Limit Exceeded (5000ms)");
                    else
                        setStatusMessage('Runtime Error');
                }
            })
            .catch((err) => {
                setOutputBox(err);
            })
            .finally(() => {
                setIsRunning(false);
            });
    }

    const handleSignOut = async () => {
        try {
            // Clear the user context
            setUser(null);

            // Optional: Call backend to clear the cookie
            await axios.post('http://localhost:3000/user/logout', {}, {
                withCredentials: true
            });

            console.log('User signed out successfully');
        } catch (error) {
            console.error('Error during sign out:', error);
            // User is still signed out on frontend even if backend call fails
        }
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const handleMenuItemClick = (action: string) => {
        setShowUserMenu(false);

        switch (action) {
            case 'profile':
                console.log('Profile clicked');
                // Add profile logic here
                break;
            case 'settings':
                console.log('Settings clicked');
                // Add settings logic here
                break;
            case 'signout':
                console.log('signout clicked');
                handleSignOut();
                break;
            default:
                break;
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        // Only add listener when menu is open
        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    //TODO : Tryu to use memoization with useMemo
    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                <img src="../../../c-.png" alt="cpp logo" className={styles.logo} />
                <div className={styles.toolbarTitle}>Runner</div>

                {/* Checker button, status message, and submit button row */}
                <div className={styles.controlRow}>
                    <button 
                        className={`${styles.checkerButton} ${isCheckerActive ? styles.active : ''}`}
                        onClick={() => setIsCheckerActive(!isCheckerActive)}
                    >
                        {isCheckerActive ? "Checker ON" : "Checker OFF"}
                    </button>
                    <div className={`${styles.statusMessage} ${statusMessage.includes('Error') || statusMessage.includes('Exceeded') || statusMessage.includes('Wrong Answer')
                            ? styles.error
                            : statusMessage === 'Running...'
                                ? styles.running
                                : ''
                        }`}>
                        {statusMessage}
                    </div>
                    <button className={styles.submitButton} onClick={() => handleRunCode()} disabled={isRunning}>
                        {isRunning ? "Running..." : "Submit"}
                    </button>
                </div>

                {/* Username display with dropdown menu */}
                <div className={styles.userSection} ref={userMenuRef}>
                    <span className={styles.userName} onClick={toggleUserMenu}>
                        {user?.name || 'User'} ▼
                    </span>
                    {showUserMenu && (
                        <div className={styles.userMenu}>
                            {/* <div className={styles.menuItem} onClick={() => handleMenuItemClick('profile')}>
                                    Profile
                                </div>
                                <div className={styles.menuItem} onClick={() => handleMenuItemClick('settings')}>
                                    Settings
                                </div> */}
                            <div className={styles.menuItem} onClick={() => handleMenuItemClick('signout')}>
                                Sign Out
                            </div>
                        </div>
                    )}
                </div>

                {/* <a className={styles.toolbarLink}href="https://github.com/phANTom2303"> Made by Anish</a> */}
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
                    <div className={styles.textareaGroup}>
                        <label className={styles.textareaLabel}>Input</label>
                        <textarea name="input" id="input" value={inp} onChange={(e) => setInp(e.target.value)}></textarea>
                    </div>

                    <div className={styles.textareaGroup}>
                        <label className={styles.textareaLabel}>Output</label>
                        <textarea name="output" id="output" value={outputBox} readOnly={true}></textarea>
                    </div>

                    {isCheckerActive && (
                        <div className={styles.textareaGroup}>
                            <label className={styles.textareaLabel}>Expected Output</label>
                            <textarea name="expected_output" id="expected_output" value={expectedOutput} onChange={(e) => setExpectedOutput(e.target.value)}></textarea>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Ide;