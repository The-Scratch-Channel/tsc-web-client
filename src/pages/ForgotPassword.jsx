import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Adjust import based on your Firebase configuration
import { useTranslation } from 'react-i18next';
import '../styles/ForgotPassword.css'; // Assuming you have a CSS file for styling

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError(t('error.invalidEmail'));
            return;
        }
        setError('');
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage(t('forgotPassword.success'));
        } catch (error) {
            setError(t('error.sendFailed'));
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    };

    return (
        <div className="forgot-password">
            <h2>{t('forgotPassword.title')}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    required
                />
                <button type="submit">{t('forgotPassword.submit')}</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
