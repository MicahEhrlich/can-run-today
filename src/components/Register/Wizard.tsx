import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAppStore from "../../store/registerStore"
import { useShallow } from 'zustand/shallow'
import { StepOne } from "./StepOne";
import { ErrorMessage, Header, StepContainer, SuccessLabel, WizardContainer } from "./Wizard.styled";
import { StepTwo } from "./StepTwo";
import { StepOTP } from "./StepOTP";
import { StepThree } from "./StepThree";
import { register } from "../../api/authenticated-api";
import { StepPhoneNumber } from "./StepPhoneNumber";
import useAuthStore from "../../store/authStore";
import { Button } from "@mui/material";

const LAST_STEP = 4
const LOGIN_TIMEOUT = 3000


export interface StepProps {
    nextStep: () => void
    prevStep?: () => void
}

export const Wizard = () => {
    const accessToken = useAuthStore((state) => state.token);
    const reset = useAppStore((state) => state.reset)
    const setError = useAppStore((state) => state.setError);
    const error = useAppStore((state) => state.error);
    const { name, phoneNumber, email, password, country, city, minTemperature, maxTemperature,
        weekDaysRunning, noteByEmail, noteByWhatsapp, noteBySMS
    } = useAppStore(useShallow(state => ({
        name: state.name, phoneNumber: state.phoneNumber, email: state.email, password: state.password, country: state.country, city: state.city,
        minTemperature: state.minTemperature, maxTemperature: state.maxTemperature,
        weekDaysRunning: state.weekDaysRunning, noteByEmail: state.noteByEmail, noteByWhatsapp: state.noteByWhatsapp, noteBySMS: state.noteBySMS
    })))

    const loading = useAuthStore((state) => state.loading);
    const setLoading = useAuthStore((state) => state.setLoading);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            navigate('/dashboard');
        }
    }, [accessToken, navigate]);

    const prevStep = () => {
        if (step > 0) {
            if (step == 2) {
                setStep(0)
            }
            else {
                setStep(step - 1);
            }
            setError('');
        }
    };

    const nextStep = async () => {
        if (step < LAST_STEP) {
            setStep(step + 1);
        } else {
            setLoading(true)
            const formFields = {
                name, phoneNumber, email, password, country, city, minTemperature, maxTemperature,
                weekDaysRunning, noteByEmail, noteByWhatsapp, noteBySMS
            }
            const response = await register(formFields)
            if (response.success) {
                setRegisterSuccess(true)
                setError('')
                reset()
                setTimeout(() => {
                    setRegisterSuccess(false)
                    navigate('/login')
                }, LOGIN_TIMEOUT)
            } else {
                setError(response.message)
            }
            setLoading(false)
        }
    }

    const resetAll = () => {
        setStep(0)
        reset()
        setError('')
    }

    const backToLogin = () => {
        resetAll()
        navigate('/login')
    }

    return (
        <>
            <WizardContainer className={loading || registerSuccess ? 'loading' : ''}>
                <Header>Can you run today?</Header>
                <StepContainer>
                    {step == 0 && <StepPhoneNumber nextStep={nextStep} />}
                    {step == 1 && <StepOTP nextStep={nextStep} prevStep={prevStep} />}
                    {step == 2 && <StepOne nextStep={nextStep} prevStep={prevStep} />}
                    {step == 3 && <StepTwo nextStep={nextStep} prevStep={prevStep} />}
                    {step == 4 && <StepThree nextStep={nextStep} prevStep={prevStep} />}
                </StepContainer>
                <Button variant="contained" disabled={loading} onClick={resetAll}>Restart</Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    onClick={backToLogin}
                >
                    Back to Sign In
                </Button>
            </WizardContainer>
            {registerSuccess && <SuccessLabel>User registered successfully!</SuccessLabel>}
            {<ErrorMessage>{error}</ErrorMessage>}
        </>
    )


}