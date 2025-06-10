import { FC, useRef, useState, useEffect, useCallback } from 'react';
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
    const monacoEl = useRef<HTMLDivElement>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Create editor
    useEffect(() => {
        if (monacoEl.current && !editor) {
            const options = getEditorOptions(language, theme, isReadOnly);
            const newEditor = monaco.editor.create(monacoEl.current, options);
            setEditor(newEditor);
        }

        return () => {
            if (editor) {
                editor.dispose();
                setEditor(null);
            }
        };
    }, []);

    // Update editor options when props change
    useEffect(() => {
        if (editor) {
            const options = getEditorOptions(language, theme, isReadOnly);
            editor.updateOptions(options);
            
            // Update model language if it changed
            const model = editor.getModel();
            if (model && options.language) {
                monaco.editor.setModelLanguage(model, options.language);
            }
        }
    }, [editor, language, theme, isReadOnly]);

    // Handle resize and zoom changes with ResizeObserver and window events
    const handleResize = useCallback(() => {
        if (editor) {
            // Use requestAnimationFrame to ensure layout happens after DOM updates
             requestAnimationFrame(() => {
                editor.layout();
            });
        }
    }, [editor]);

    useEffect(() => {
        if (!editor || !monacoEl.current) return;

        // Use ResizeObserver for the most accurate container size changes
        if (window.ResizeObserver) {
            resizeObserverRef.current = new ResizeObserver(handleResize);
            resizeObserverRef.current.observe(monacoEl.current);
        }

        // Also listen to window resize for zoom changes
        window.addEventListener('resize', handleResize);
        
        // Listen for visual viewport changes (mobile zoom, browser zoom)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
        }

        // Initial layout after a brief delay to ensure container is ready
        const timeoutId = setTimeout(handleResize, 50);

        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            }
            window.removeEventListener('resize', handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleResize);
            }
            clearTimeout(timeoutId);
        };
    }, [editor, handleResize]);

    return <div className={styles.Editor} ref={monacoEl}></div>;
};
