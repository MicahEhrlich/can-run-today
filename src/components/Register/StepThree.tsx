import { useForm, SubmitHandler } from "react-hook-form";
import useRegisterStore from "../../store/registerStore";
import { Button, ButtonContainer, CheckboxGroup, CheckboxInput, CheckboxWrapper, ErrorMessage, Label, StyledForm } from "./Wizard.styled";
import { useState } from "react";
import { StepProps } from "./Wizard";

interface FormFields {
    weekDaysRunning: number[],
    noteBySMS: boolean;
    noteByWhatsapp: boolean;
    noteByEmail: boolean;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const StepThree = ({ nextStep, prevStep }: StepProps) => {
    const weekDaysRunning = useRegisterStore((state) => state.weekDaysRunning);
    const noteBySMS = useRegisterStore((state) => state.noteBySMS);
    const noteByWhatsapp = useRegisterStore((state) => state.noteByWhatsapp);
    const noteByEmail = useRegisterStore((state) => state.noteByEmail);

    const setWeekDaysRunning = useRegisterStore((state) => state.setWeekDaysRunning);
    const setNoteBySMS = useRegisterStore((state) => state.setNoteBySMS);
    const setNoteByWhatsapp = useRegisterStore((state) => state.setNoteByWhatsapp);
    const setNoteByEmail = useRegisterStore((state) => state.setNoteByEmail);
    const [weekDaysRunningArray, setWeekDaysRunningArray] = useState(weekDaysRunning.split('').map(Number));
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
    } = useForm<FormFields>()

    const handleCheckboxChange = (day: number) => {
        if (weekDaysRunningArray[day] == 1) {
            const runningDays = [...weekDaysRunningArray]
            runningDays[day] = 0
            setWeekDaysRunningArray(runningDays)
            setWeekDaysRunning(runningDays.join(''));
        } else {
            const runningDays = [...weekDaysRunningArray]
            runningDays[day] = 1
            setWeekDaysRunningArray(runningDays)
            setWeekDaysRunning(runningDays.join(''));
        }
    };

    const validateDaysRunning = () => Number(weekDaysRunning) === 0;

    const validateNotifications = () => !noteBySMS && !noteByWhatsapp && !noteByEmail;

    const onSubmit: SubmitHandler<FormFields> = () => {
        if (!validateDaysRunning()) {
            setLoading(true)
            nextStep()
            setLoading(false)
        }
    }

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Label>Days Running</Label>
            <CheckboxGroup>
                {daysOfWeek.map((day: string, index: number) => (
                    <CheckboxWrapper key={day}>
                        <CheckboxInput
                            type="checkbox"
                            checked={weekDaysRunningArray[index] == 1}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <Label>{day}</Label>
                    </CheckboxWrapper>
                ))}
            </CheckboxGroup>
            {validateDaysRunning() && <ErrorMessage>Must select at least one day</ErrorMessage>}

            <Label>Notifications</Label>
            <CheckboxGroup>
                <CheckboxWrapper>
                    <CheckboxInput
                        type="checkbox"
                        checked={noteBySMS}
                        onChange={() => setNoteBySMS(!noteBySMS)}
                    />
                    <Label>Notification by SMS</Label>
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <CheckboxInput
                        type="checkbox"
                        checked={noteByWhatsapp}
                        onChange={() => setNoteByWhatsapp(!noteByWhatsapp)}
                    />
                    <Label>Notification by Whatsapp</Label>
                </CheckboxWrapper>
                <CheckboxWrapper>
                    <CheckboxInput
                        type="checkbox"
                        checked={noteByEmail}
                        onChange={() => setNoteByEmail(!noteByEmail)}
                    />
                    <Label>Notification by Email</Label>
                </CheckboxWrapper>
            </CheckboxGroup>
            {validateNotifications() && <ErrorMessage>Must select at least one notification</ErrorMessage>}
            <ButtonContainer>
                <Button disabled={loading} onClick={prevStep}>Back</Button>
                <Button disabled={loading} type="submit">Finish</Button>
            </ButtonContainer>
        </StyledForm>

    )
}