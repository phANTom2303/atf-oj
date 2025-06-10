import './App.css'
import Header from './components/Header'
import Ide from './components/ide/Ide';
import './userWorker';

function App() {

    return (
        <>
            <Header title='CodeRunn' />
            <Ide/>
        </>
    )
}

export default App
