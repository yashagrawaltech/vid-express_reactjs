import { useLayoutEffect } from 'react';
import SigninForm from '../components/Auth/SigninForm';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const { _id, loading } = useUser();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!loading && _id) {
            navigate('/');
            window.location.reload();
        }
    }, [_id, navigate, loading]);

    return (
        <div className="w-dvw h-dvh flex items-center justify-center">
            <SigninForm />
        </div>
    );
};

export default Signin;
