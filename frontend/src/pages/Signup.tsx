import { useLayoutEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/Auth/SignupForm';

const Signup = () => {
    const { _id, loading } = useUser();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!loading && _id) {
            navigate('/');
        }
    }, [_id, navigate, loading]);

    return (
        <div className="w-dvw h-dvh flex items-center justify-center">
            <SignupForm />
        </div>
    );
};

export default Signup;
