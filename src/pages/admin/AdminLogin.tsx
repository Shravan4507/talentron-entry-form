import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import OutlinedTitle from '../../components/heading/OutlinedTitle';
import './Admin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await signInWithEmailAndPassword(auth, username, password);
            navigate('/admin-dashboard');
        } catch (err: any) {
            console.error("Login Error:", err);
            setError('Invalid credentials or access denied.');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-card">
                <OutlinedTitle 
                    text="ADMIN LOGIN" 
                    fillColor="linear-gradient(180deg, #ffea00 0%, #ff8c00 100%)" 
                    outlineColor="#000" 
                    shadowColor="#000"
                    className="small"
                />
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="email" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Admin Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="login-btn">ACCESS DASHBOARD</button>
                    <button type="button" className="home-btn" onClick={() => navigate('/')}>BACK TO HOME</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
