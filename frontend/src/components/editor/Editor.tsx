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
	const monacoEl = useRef(null);
	const [currentLanguage, setCurrentLanguage] = useState(language);

	useEffect(() => {
		if (monacoEl.current && !editor) {
			const newEditor = monaco.editor.create(monacoEl.current, getEditorOptions(language, theme, isReadOnly));
			setEditor(newEditor);
			setCurrentLanguage(language);
		}

		return () => {
			if (editor) {
				editor.dispose();
				setEditor(null);
			}
		};
	}, []);

	// Update editor when props change
	useEffect(() => {
		if (editor) {
			const model = editor.getModel();
			if (model) {
				// If language changed, update both syntax highlighting and content
				if (currentLanguage !== language) {
					// Get the new language template
					const langConfig = getLanguageConfig(language);
					
					// Update the editor content with the new template
					model.setValue(langConfig.value);
					
					// Update language syntax highlighting
					monaco.editor.setModelLanguage(model, language);
					
					setCurrentLanguage(language);
				}
			}
			
			// Update theme
			const themeValue = theme === 'dark' ? 'vs-dark' : 'vs-light';
			monaco.editor.setTheme(themeValue);
			
			// Update read-only state
			editor.updateOptions({ readOnly: isReadOnly });
		}
	}, [editor, language, theme, isReadOnly, currentLanguage]);

	return <div className={styles.Editor} ref={monacoEl}></div>;
};

// Helper function to get language configuration
function getLanguageConfig(language: string) {
	const cppConfig = {
		value: ['#include <iostream>', 'using namespace std;', 'int main', '{', '\tcout << "Hello World";', '\treturn 0;', '}'].join('\n'),
		language: 'cpp'
	};

	const javaConfig = {
		value: ['public class Main {', '\tpublic static void main(String[] args) {', '\t\tSystem.out.println("Hello World");', '\t}', '}'].join('\n'),
		language: 'java'
	};

	const pythonConfig = {
		value: 'print("Hello World")',
		language: 'python'
	};

	const txtConfig = { 
		value: '',
		language: 'txt',
	};

	switch(language){
		case "cpp": return cppConfig;
		case "java": return javaConfig;
		case "python": return pythonConfig;
		default: return txtConfig;
	}
}
