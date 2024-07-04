import React from 'react';
// import SignupCard from '../components/SignupCard';
import LoginCard from '../components/LoginCard';
import { useRecoilValue } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import SignupCard from '../components/SignupCard';

const AuthPage = () => {

    const authScreenState = useRecoilValue(authScreenAtom);//it is like a use state whenever we want data it give

    console.log(authScreenState);

    return (
        <>
            {
                authScreenState === "login" ? <LoginCard/> : <SignupCard/>
            }
        </>
    )
}

export default AuthPage;