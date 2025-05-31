import { FC, useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.module.css';
import getEditorOptions from './getEditorOptions';

interface EditorProps {
  language: string;
  theme: string;
  isReadOnly: boolean;
}

export const Editor: FC<EditorProps> = ({ language, theme, isReadOnly }) => {
    const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
    const [options, setOptions] = useState(() => getEditorOptions(language, theme, isReadOnly));
    const monacoEl = useRef(null);

    // Update options when props change
    useEffect(() => {
        setOptions(getEditorOptions(language, theme, isReadOnly));
    }, [language, theme, isReadOnly]);

    useEffect(() => {
        if (monacoEl.current && !editor) {
            const newEditor = monaco.editor.create(monacoEl.current, options);
            setEditor(newEditor);
        }

        return () => {
            if (editor) {
                editor.dispose();
                setEditor(null);
            }
        };
    }, [options]); // Depend on options instead of empty array

    return <div className={styles.Editor} ref={monacoEl}></div>;
};
