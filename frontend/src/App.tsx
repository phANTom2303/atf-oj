import './App.css'
import Header from './components/Header'
import Ide from './components/ide/Ide';
import './userWorker';

function App() {

    return (
        <>
            <Header  title='CodeRunn'/>
            <div className='editorContainer'>
                <Ide defaultLanguage='cpp' defaultTheme='light' isReadOnly={false} />
            </div>
        </>
    )
}

export default App
