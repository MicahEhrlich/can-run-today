// import React, { useState } from 'react';
// import styled from 'styled-components';

// interface Post {
//     id: number;
//     content: string;
//     email: string;
// }

// const Social: React.FC = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [newPost, setNewPost] = useState<string>('');
//     const [email, setEmail] = useState<string>('');

//     const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         setNewPost(e.target.value);
//     };

//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.target.value);
//     };

//     const handlePostSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (newPost.trim() && email.trim()) {
//             const post: Post = {
//                 id: Date.now(),
//                 content: newPost,
//                 email: email,
//             };
//             setPosts([post, ...posts]);
//             setNewPost('');
//             setEmail('');
//         }
//     };

//     return (
//         <Container>
//             <h1>Share a Post</h1>
//             <Form onSubmit={handlePostSubmit}>
//                 <Input
//                     type="email"
//                     value={email}
//                     onChange={handleEmailChange}
//                     placeholder="Your email"
//                 />
//                 <Textarea
//                     value={newPost}
//                     onChange={handlePostChange}
//                     placeholder="What's on your mind?"
//                     rows={4}
//                     cols={50}
//                 />
//                 <Button type="submit">Post</Button>
//             </Form>
//             <PostsContainer>
//                 {posts.map((post) => (
//                     <PostCard key={post.id}>
//                         <PostEmail>{post.email}</PostEmail>
//                         <PostContent>{post.content}</PostContent>
//                     </PostCard>
//                 ))}
//             </PostsContainer>
//         </Container>
//     );
// };

// export default Social;

// const Container = styled.div`
//     padding: 20px;
//     max-width: 600px;
//     margin: 0 auto;
// `;

// const Form = styled.form`
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
//     margin-bottom: 20px;
// `;

// const Input = styled.input`
//     padding: 10px;
//     border: 1px solid #ccc;
//     border-radius: 5px;
// `;

// const Textarea = styled.textarea`
//     padding: 10px;
//     border: 1px solid #ccc;
//     border-radius: 5px;
// `;

// const Button = styled.button`
//     padding: 10px;
//     background-color: #007bff;
//     color: white;
//     border: none;
//     border-radius: 5px;
//     cursor: pointer;
//     &:hover {
//         background-color: #0056b3;
//     }
// `;

// const PostsContainer = styled.div`
//     display: flex;
//     flex-direction: column;
//     gap: 10px;
// `;

// const PostCard = styled.div`
//     padding: 15px;
//     border: 1px solid #ccc;
//     border-radius: 10px;
//     background-color:rgba(95, 92, 92, 0.5);
// `;

// const PostEmail = styled.p`
//     font-weight: bold;
//     color: #007bff;
// `;

// const PostContent = styled.p`
//     margin-top: 5px;
//     color:rgb(255, 255, 255);
// `;


import React from 'react';
import styled from 'styled-components';
import { FaHeart, FaThumbsUp, FaComment } from 'react-icons/fa';

// Styled Components
const MainScreenWrapper = styled.div`
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  background: linear-gradient(180deg,rgb(34, 33, 33),rgb(65, 59, 59));
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border-radius: 10px;
`;

const RunningStats = styled.div`
  text-align: center;
  margin: 20px 0;

  h1 {
    font-size: 48px;
    color: #007bff;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &.start-run-btn {
    background: #007bff;

    &:hover {
      background: #0056b3;
    }
  }

  &.view-history-btn {
    background: #ffa500;

    &:hover {
      background: #cc8400;
    }
  }

  &:hover {
    transform: scale(1.05);
  }
`;
const SocialFeed = styled.div`
  padding: 10px 20px;
  overflow-y: auto;
  max-height: 300px;
`;

const PostCard = styled.div`
  background:rgb(85, 82, 82);
  padding: 10px;
  margin-bottom: 10px;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
`;

const PostActions = styled.div`
  margin-top: 10px;

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

const Social = () => {
    return (
      <MainScreenWrapper>
        {/* Weather Info */}
        <WeatherInfo>
          <span>20°C</span>
          <img src="weather-icon.png" alt="Cloudy" />
          <span>Cloudy, London</span>
        </WeatherInfo>
  
        {/* Running Stats */}
        <RunningStats>
          <h1>5.2 km</h1>
          <p>Duration: 30 mins | Pace: 5:45 min/km</p>
        </RunningStats>
  
        {/* Action Buttons */}
        <ActionButtons>
          <Button className="start-run-btn">Start Run</Button>
          <Button className="view-history-btn">Run History</Button>
        </ActionButtons>
  
        {/* Social Feed */}
        <SocialFeed>
          <PostCard>
            <UserInfo>
              <img src="profile-pic.png" alt="User" />
              <span>@user1</span>
            </UserInfo>
            <p>"Morning jog done! 🌅"</p>
            <PostActions>
              <button>
                <FaHeart /> 20
              </button>
              <button>
                <FaThumbsUp /> 15
              </button>
              <button>
                <FaComment /> Comment
              </button>
            </PostActions>
          </PostCard>
          <PostCard>
            <UserInfo>
              <img src="profile-pic.png" alt="User" />
              <span>@user1</span>
            </UserInfo>
            <p>"Morning jog done! 🌅"</p>
            <PostActions>
              <button>
                <FaHeart /> 20
              </button>
              <button>
                <FaThumbsUp /> 15
              </button>
              <button>
                <FaComment /> Comment
              </button>
            </PostActions>
          </PostCard>
          {/* Additional posts can be added here */}
        </SocialFeed>
      </MainScreenWrapper>
    );
  };
  
  export default Social;