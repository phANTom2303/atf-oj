import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from './signin.module.css';

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

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Here you would typically make an API call to authenticate the user
            console.log("Form submitted:", formData);

            // Simulate API call
            setTimeout(() => {
                setIsSubmitting(false);
                alert("Signin successful!");
                // Redirect to dashboard or home page
                setFormData({ email: '', password: '' });
            }, 1000);
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
