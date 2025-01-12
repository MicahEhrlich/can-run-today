import styled from "styled-components";

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  margin: 0 auto;
  color: #333; /* Ensure text color is visible */
`;

export const Header = styled.h1`
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
`;

export const WizardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg,rgb(130, 214, 130),rgb(73, 255, 37));
  min-height: 100vh;
  transition: filter 0.3s ease;
  &.loading {
    filter: blur(5px);
  }
`;

export const StepContainer = styled.div`
    width: 100%;
    background-color: #fff;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export const StepDiv = styled.div`
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
`;

export const ErrorMessage = styled.span`
  color: red;
  margin-bottom: 10px;
`;
export const FormTitle = styled.h1`
  text-align: center;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  margin-bottom: 10px;
  font-weight: bold;
  font-color: #333;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

export const CheckboxInput = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #6a5acd;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;

  &:checked {
    background-color: #6a5acd;
    border-color: #483d8b;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(106, 90, 205, 0.5);
  }
`;

export const ClearButton = styled(Button)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

export const SuccessLabel = styled.div`
color: green;
font-weight: bold;
margin-top: 20px;
`;