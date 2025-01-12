import { SubmitHandler, useForm } from "react-hook-form";
import { Button, ButtonContainer, ErrorMessage, Input, Label, StyledForm } from "./Wizard.styled";
import useRegisterStore from "../../store/registerStore";
import { useState } from "react";
import { verifyOTP } from "../../api/authenticated-api";
import { StepProps } from "./Wizard";
import useAuthStore from "../../store/authStore";

interface FormFields {
    code: string;
}

const CODE_LENGTH = 6;

export const StepOTP = ({ nextStep, prevStep }: StepProps) => {
    const code = useAuthStore((state) => state.code)
    const setCode = useAuthStore((state) => state.setCode)
    const phoneNumber = useRegisterStore((state) => state.phoneNumber)
    const error = useAuthStore((state) => state.error); 
    const setError = useAuthStore((state) => state.setError);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

    const onSubmit: SubmitHandler<FormFields> = async () => {
        setLoading(true)
        setError('');
        const verify = await verifyOTP(phoneNumber, code)
        if (verify.success) {
            nextStep()
            setCode('')
        } else {
            setError(verify.message);
        }
        setLoading(false)
    }

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
        const code = e.target.value;
        if (code.length <= CODE_LENGTH) {
            setCode(e.target.value) 
        }
    }

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Label>Enter OTP Code:</Label>
            <Input value={code} type="number" {...register("code", {
                required: true, pattern: {
                    value: /^[0-9]{6}$/, // Adjust regex for your desired pattern
                    message: "Code length should be 6 digits",
                },
            })} onChange={handleCodeChange} />
            <ButtonContainer>
                <Button disabled={loading} onClick={prevStep}>Back</Button>
                <Button disabled={loading} type="submit">Next</Button>
            </ButtonContainer>
            {errors.code && !code.length && <ErrorMessage>Code is required</ErrorMessage>}
            {errors.code?.message && <ErrorMessage>{errors.code?.message}</ErrorMessage>}
            {<ErrorMessage>{error}</ErrorMessage>}
        </StyledForm>
    )
}