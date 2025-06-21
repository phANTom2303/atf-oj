import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './signup.module.css';
import axios from 'axios';

interface FormData {
    name: string;
    email: string;
    password: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
}

interface SignupProps {
    onToggleForm: (showSignIn: boolean) => void;
}

const Signup: React.FC<SignupProps> = ({ onToggleForm }) => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
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

        if (!formData.name.trim()) {
            formErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            formErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            formErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            await axios.post('http://localhost:3000/user/signup', {
                ...formData,
            })
                .then((response) => {
                    console.log(response);
                    console.log("Form submitted:", formData);

                    // Simulate API call

                    setIsSubmitting(false);
                    alert("Signup successful!");
                    // Redirect to login or clear form
                    setFormData({ name: '', email: '', password: '' });
                    onToggleForm(true);
                }).catch((error) => {
                    console.log(error.message);
                });

            // Simulate API call

            setIsSubmitting(false);
            // Redirect to login or clear form
            setFormData({ name: '', email: '', password: '' });
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupFormWrapper}>
                <h2>Create an Account</h2>
                <form className={styles.signupForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? styles.error : ""}
                        />
                        {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
                    </div>

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
                        className={styles.signupButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <div className={styles.loginLink}>
                    Already have an account? <button onClick={() => onToggleForm(true)}>Log in</button>
                </div>
            </div>
        </div>
    );
};

export default Signup;