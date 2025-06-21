import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './signin.module.css';
import axios from 'axios';
import { useUser } from '../../App';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

interface SigninProps {
    onToggleForm: (showSignIn: boolean) => void;
}

const Signin: React.FC<SigninProps> = ({ onToggleForm }) => {
    const { setUser } = useUser();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = (): boolean => {
        let formErrors: FormErrors = {};

        if (!formData.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            formErrors.password = "Password is required";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);


            await axios.get(`http://localhost:3000/user/login`, {
                params: formData,
                withCredentials: true,
            })
                .then((response) => {
                    // Extract and log the token cookie
                    const cookies = document.cookie.split(';');
                    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
                    if (tokenCookie) {
                        console.log("Auth token:", tokenCookie.trim().substring(6));
                    } else {
                        console.log("No token cookie found");
                    }
                    console.log("Login successful:", response.data);

                    // Set the user in context using the response data
                    setUser({
                        name: response.data.name,
                        email: response.data.email,
                        id: response.data.id
                    });

                    setIsSubmitting(false);
                    setFormData({ email: '', password: '' });
                })
                .catch((error) => {
                    // Handle login errors
                    console.error("Login failed:", error.response?.data || error.message);
                    alert("Login failed: " + (error.response?.data?.message || "Please try again"));
                    setIsSubmitting(false);
                });

        }
    };

    return (
        <div className={styles.signinContainer}>
            <div className={styles.signinFormWrapper}>
                <h2>Sign In</h2>
                <form className={styles.signinForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.error : ""}
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? styles.error : ""}
                        />
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className={styles.signinButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className={styles.signupLink}>
                    Don't have an account? <button onClick={() => onToggleForm(false)}>Sign up</button>
                </div>
            </div>
        </div>
    );
};

export default Signin;
