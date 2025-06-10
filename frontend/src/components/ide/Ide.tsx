import { Editor } from '../editor/Editor';
import styles from './Ide.module.css';

function Ide() {

    return (
        <div className={styles.ideContainer}>
            <div className={styles.toolbar}>
                Toolbar
            </div>

            <div className={styles.codeBoxes}>
                <div className={styles.editorContainer}>
                    <Editor language='cpp' theme='dark' isReadOnly={false} />
                </div>
                <div className={styles.iocontainer}>
                    <textarea name="input" id="input"> input</textarea>
                    <textarea name="expected_output" id="expected_output">expected_output</textarea>
                    <textarea name="output" id="output"> output</textarea>
                </div>
            </div>
        </div>
    );
}

export default Ide;