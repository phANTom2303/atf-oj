import React, { useState } from 'react';
import { Editor } from '../editor/Editor';
import styles from './Ide.module.css';

interface IdeProps {
    language?: string;
    defaultTheme?: string;
    isReadOnly?: boolean;
}

const Ide: React.FC<IdeProps> = ({ 
    language = 'text',
    defaultTheme = 'light', 
    isReadOnly = false 
}) => {
    const [theme, setTheme] = useState(defaultTheme);
    
    // Use the language prop instead of hardcoding
    const selectedLanguage = language;

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const isDarkTheme = theme === 'dark';

    return (
        <div className={`${styles.ideContainer} ${isDarkTheme ? styles.darkTheme : ''}`}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <h3 className={styles.title}>C++ Code</h3>
                </div>
                <div className={styles.toolbarRight}>
                    <div className={styles.themeToggle}>
                        <span>{isDarkTheme ? '🌙' : '☀️'}</span>
                        <button 
                            onClick={handleThemeToggle}
                            className={`${styles.toggleSwitch} ${isDarkTheme ? styles.dark : ''}`}
                            aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
                        >
                            <div className={styles.toggleKnob}></div>
                        </button>
                    </div>
                </div>
            </div>
            
            <div className={styles.editorWrapper}>
                <Editor 
                    language={selectedLanguage}
                    theme={theme}
                    isReadOnly={isReadOnly}
                />
            </div>
        </div>
    );
};

export default Ide;