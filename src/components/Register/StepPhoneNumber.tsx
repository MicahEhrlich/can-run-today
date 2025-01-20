import { SubmitHandler, useForm } from "react-hook-form";
import { Button, ButtonContainer, ClearButton, ErrorMessage, Input, Label, StyledForm } from "./Wizard.styled";
import useRegisterStore from "../../store/registerStore";
import { requestOTP } from "../../api/authenticated-api";
import { StepProps } from "./Wizard";
import useAuthStore from "../../store/authStore";

interface FormFields {
    phoneNumber: string;
}

export const StepPhoneNumber = ({ nextStep }: StepProps) => {
    const phoneNumber = useRegisterStore((state) => state.phoneNumber);
    const setPhoneNumber = useRegisterStore((state) => state.setPhoneNumber)
    const error = useRegisterStore((state) => state.error);
    const setError = useRegisterStore((state) => state.setError);
    
    const loading = useAuthStore((state) => state.loading);
    const setLoading = useAuthStore((state) => state.setLoading);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

    const onSubmit: SubmitHandler<FormFields> = async () => {
        setError('')
        setLoading(true)
        const response = await requestOTP(phoneNumber)
        if (response.success) {
            nextStep()
        }
        else {
            setError(response.message)
        }
        setLoading(false)
    }

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)

    const handleClearForm = () => {
        setPhoneNumber('');
        setError('');
    };


    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Label>OTP will be sent to this number</Label>
            {/* Add country code dropdown */}
            <Input value={phoneNumber} maxLength={10} type="number"  {...register("phoneNumber", {
                required: true,
                pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                },
            })} onChange={handlePhoneNumberChange} />

            <ButtonContainer>
                <Button disabled>Back</Button>
                <Button disabled={loading} type="submit">Next</Button>
            </ButtonContainer>
            <ButtonContainer>
                <ClearButton type="button" onClick={handleClearForm}>Clear Form</ClearButton>
            </ButtonContainer>
            {errors.phoneNumber && !phoneNumber.length && <ErrorMessage>Phone number is required</ErrorMessage>}
            {errors.phoneNumber?.message && <ErrorMessage>{errors.phoneNumber?.message}</ErrorMessage>}
            {<ErrorMessage>{error}</ErrorMessage>}
        </StyledForm>
    )
}