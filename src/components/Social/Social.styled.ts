
import styled from 'styled-components';


const MainScreenWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  background: linear-gradient(180deg,rgb(34, 33, 33),rgb(65, 59, 59));

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const NewPostForm = styled.form`
    background-color: dimgray;
    border-radius: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 20px;
`;

const WeatherInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border-radius: 10px;
`;

const RunningStats = styled.div`
    display: flex;
    justify-content: space-between;
  text-align: center;

  h1 {
    font-size: 48px;
    color: #007bff;
  }
`;

const RunningStatsInput = styled.input`
  width: 80px;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &.post-run-btn {
    background: #007bff;

    &:hover {
      background: #0056b3;
    }
  }

  &.reset-post-btn {
    background: #ffa500;

    &:hover {
      background: #cc8400;
    }
  }

  &.disabled-post-btn {

    background: #ccc;
    cursor: not-allowed;
    &:hover {
      background: #ccc;
    }
  }

  &:hover {
    transform: scale(1.05);
  }
`;
const SocialFeed = styled.div`
  overflow-y: auto;
  max-height: 300px;
`;

const PostContentWrapper = styled.div`
  margin: 20px 0;
`;

const PostCard = styled.div`
  background:rgb(85, 82, 82);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 5px;
  }
`;

const TextArea = styled.textarea`
  resize: none;
`;

const RunningStatsRow = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  &:hover {
    text-decoration: underline;
  }
`;
const Popup = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 10px;
    border-radius: 10px;
    background:rgb(121, 117, 117);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    max-width: 90%;
    width: 200px;

    @media (max-width: 768px) {
        width: 90%;
        padding: 15px;
    }
`;

const PopupRunningRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-top: 10px;
`;

const PostActions = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    background: transparent;
    margin-right: 10px;
    color: #007bff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
`;

const PostDate = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    font-family: ui-monospace;
`;

const StyledForm = styled.form`
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

const ErrorMessage = styled.span`
    color: red;
    margin-bottom: 10px;
`;

const CommentStyling = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: dimgray;
  margin-bottom: 10px;
  padding: 10px;
`;

const CommentDate = styled.div`
  font-size: 12px;
  font-family: ui-monospace;
  display: flex;
  justify-content: flex-end;
`
const CommentText = styled.div`
  display: flex;
  font-size: 12px;
`

const CommentUsername = styled(CommentText)`
  font-weight: bold;
  font-size: 14px;
`

const AddCommentArea = styled.div`
  display: flex;
  flex-direction: column;
`;

export {
  MainScreenWrapper,
  WeatherInfo,
  RunningStats,
  ActionButtons,
  Button,
  SocialFeed,
  PostContentWrapper,
  PostCard,
  UserInfo,
  Popup,
  PostActions,
  PostDate,
  NewPostForm,
  RunningStatsInput,
  PopupRunningRow,
  StyledForm,
  ErrorMessage,
  CommentStyling,
  CommentDate,
  CommentText,
  CommentUsername,
  AddCommentArea,
  TextArea,
  RunningStatsRow
};