import { SubmitHandler, useForm } from "react-hook-form";
import { Button, ButtonContainer, ErrorMessage, Input, Label, StyledForm } from "./Wizard.styled";
import useRegisterStore from "../../store/registerStore";
import { StepProps } from "./Wizard";

interface FormFields {
    name: string;
    email: string;
    password: string;
}

export const StepOne = ({ nextStep, prevStep }: StepProps) => {
    const name = useRegisterStore((state) => state.name);
    const phoneNumber = useRegisterStore((state) => state.phoneNumber);
    const email = useRegisterStore((state) => state.email);
    const password = useRegisterStore((state) => state.password);

    const setName = useRegisterStore((state) => state.setName);
    const setEmail = useRegisterStore((state) => state.setEmail)
    const setPassword = useRegisterStore((state) => state.setPassword)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

    const onSubmit: SubmitHandler<FormFields> = () => {
        nextStep()
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Label>Name</Label>
            <Input value={name} {...register("name", { required: true })} onChange={handleNameChange} />
            {errors.name && <ErrorMessage>Name is required</ErrorMessage>}
            <Label>Phone number</Label>
            <Input value={phoneNumber} type="number" disabled />
            <Label>Email</Label>
            <Input value={email} {...register("email", {
                required: true, pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                },
            })} onChange={handleEmailChange} />
            {errors.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
            <Label>Password</Label>
            <Input type="password" value={password} {...register("password", {
                required: true,
                minLength: {
                    value: 6,
                    message: "Passowrd must have at least 6 characters",
                },
            })} onChange={handlePasswordChange} />
            {errors.password && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
            <ButtonContainer>
                <Button onClick={prevStep}>Back</Button>
                <Button type="submit">Next</Button>
            </ButtonContainer>
        </StyledForm>
    )
}