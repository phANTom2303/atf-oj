import { createContext, useState, useContext } from 'react';
import './App.css'
import Header from './components/Header'
import Ide from './components/ide/Ide';
import Signin from './components/signin/signin';
import Signup from './components/signup/signup';
import './userWorker';

// Define the User context type
interface User {
    id?: string;
    name?: string;
    email?: string;
    // Add other user properties as needed
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the context
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Landing page component
const LandingPage = () => {
    const [showSignIn, setShowSignIn] = useState(true);

    return (
        <div className="landing-page">
            <Header title='CodeRunn' />
            <div className="auth-container">
                {showSignIn ? <Signin onToggleForm={setShowSignIn} /> : <Signup onToggleForm={setShowSignIn} />}
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <>
                {user ? (
                    <>
                        <Header title='C++ Runner' />
                        <Ide />
                    </>
                ) : (
                    <LandingPage />
                )}
            </>
        </UserContext.Provider>
    );
}

export default App;
