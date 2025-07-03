import { createContext, useState, useContext, useEffect } from 'react';
import './App.css'
import Ide from './components/ide/Ide';
import Signin from './components/signin/signin';
import Signup from './components/signup/signup';
import './userWorker';
import axios from 'axios';

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
            <div className="auth-container">
                {showSignIn ? <Signin onToggleForm={setShowSignIn} /> : <Signup onToggleForm={setShowSignIn} />}
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const verifyToken = async () => {
            try {
                // This request will automatically include the httpOnly cookie
                const response = await axios.get('http://localhost:3000/user/verify', {
                    withCredentials: true
                });

                if (response.data.success) {
                    setUser({
                        id: response.data.user._id,
                        name: response.data.user.name,
                        email: response.data.user.email
                    });
                }
            } catch (error) {
                console.log('No valid token found');
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <>
                {user ? (
                    <>
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
