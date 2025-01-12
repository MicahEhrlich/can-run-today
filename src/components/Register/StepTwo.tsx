import { SubmitHandler, useForm } from "react-hook-form";
import { Button, ButtonContainer, ErrorMessage, Input, Label, StyledForm } from "./Wizard.styled";
import useRegisterStore from "../../store/registerStore";
import { StepProps } from "./Wizard";
import { CitySearchResult } from "../Dashboard/Dashboard";
import { searchCityApiRequest } from "../../api/weather-api";
import { useCallback, useState } from "react";
import useDebounce from "../../hooks/debounce";
import { Autocomplete, TextField } from "@mui/material";

interface FormFields {
    minTemperature: number;
    maxTemperature: number;
    city: string;
    country: string;
}

const DEFAULT_DEBOUNCE = 500

export const StepTwo = ({ nextStep, prevStep }: StepProps) => {
    const city = useRegisterStore((state) => state.city)
    const country = useRegisterStore((state) => state.country)
    const minTemperature = useRegisterStore((state) => state.minTemperature)
    const maxTemperature = useRegisterStore((state) => state.maxTemperature)

    const setCity = useRegisterStore((state) => state.setCity)
    const setCountry = useRegisterStore((state) => state.setCountry)
    const setMinTemperature = useRegisterStore((state) => state.setMinTemperature)
    const setMaxTemperature = useRegisterStore((state) => state.setMaxTemperature)

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);

    const handleDebouncedSearch = async (debouncedValue: string) => {
        try {
            const response = await searchCityApiRequest(debouncedValue);
            if (response.data) {
                const { results } = response.data as { results: CitySearchResult[] };
                setSearchResults(results);
            }
        } catch (error) {
            console.error('Search API Error:', error);
        }
    };

    const debouncedSearch = useCallback(handleDebouncedSearch, []);

    useDebounce(searchTerm, DEFAULT_DEBOUNCE, debouncedSearch);

    const handleOptionSelect = (event: React.SyntheticEvent, value: CitySearchResult | null) => {
        if (value) {
            const city = value.name;
            const country = value.country;
            setCity(city);
            setCountry(country);
        } else {
            setCity('');
            setCountry('');
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

    const onSubmit: SubmitHandler<FormFields> = () => {
        if (city && country) {
            nextStep()
        }
    }

    // const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)
    // const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)
    const handleMinTempChange = (e: React.ChangeEvent<HTMLInputElement>) => setMinTemperature(Number(e.target.value))
    const handleMaxTempChange = (e: React.ChangeEvent<HTMLInputElement>) => setMaxTemperature(Number(e.target.value))

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <Label>Enter city and Country</Label>
            <Autocomplete
                freeSolo={false}
                options={searchResults ?? []}
                getOptionLabel={(option) => `${option.name}, ${option.admin1}, ${option.country}`}
                getOptionKey={(option) => option.id}
                inputValue={searchTerm}
                onInputChange={(event, newInputValue) => {
                    setSearchTerm(newInputValue);
                }}
                onChange={handleOptionSelect}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search"
                        variant="outlined"
                        margin="normal"
                        sx={{
                            width: '250px', // Change the width here
                            // '& .MuiInputLabel-root': { color: 'white' }
                        }}
                    />
                )}
            />

            <Label>Country</Label>
            <Input value={country} disabled />
            {!country && <ErrorMessage>Country is required</ErrorMessage>}
            <Label>City</Label>
            <Input value={city} disabled />
            {!city && <ErrorMessage>City is required</ErrorMessage>}
            {/* {(!city || !country) && <ErrorMessage>Location is required</ErrorMessage>} */}
            <Label>Minimum Temperature for running</Label>
            <Input type="number" value={minTemperature} {...register("minTemperature", { required: true })} onChange={handleMinTempChange} />
            {errors.minTemperature && <ErrorMessage>Minimum Temperature is required</ErrorMessage>}
            <Input type="number" value={maxTemperature} {...register("maxTemperature", { required: true })} onChange={handleMaxTempChange} />
            {errors.maxTemperature && <ErrorMessage>Maximum Temperature is required</ErrorMessage>}
            <ButtonContainer>
                <Button onClick={prevStep}>Back</Button>
                <Button type="submit">Next</Button>
            </ButtonContainer>
        </StyledForm>
    )
}