import React, { useState } from 'react';
import { Editor } from '../editor/Editor';
import styles from './Ide.module.css';

interface IdeProps {
    defaultLanguage?: string;
    defaultTheme?: string;
    isReadOnly?: boolean;
}

const Ide: React.FC<IdeProps> = ({ 
    defaultLanguage = 'cpp', 
    defaultTheme = 'light', 
    isReadOnly = false 
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
    const [theme, setTheme] = useState(defaultTheme);

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLanguage(event.target.value);
    };

    const handleThemeToggle = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const isDarkTheme = theme === 'dark';

    return (
        <div className={`${styles.ideContainer} ${isDarkTheme ? styles.darkTheme : ''}`}>
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <h3 className={styles.title}>Write your code here</h3>
                </div>
                <div className={styles.toolbarRight}>
                    <select 
                        value={selectedLanguage} 
                        onChange={handleLanguageChange}
                        className={styles.languageSelector}
                    >
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                    </select>
                    
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