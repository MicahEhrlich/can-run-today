import { useState } from "react";
import { Post, PostComment, useSocialStore } from "../../store/socialStore";
import { Button } from "@mui/material";
import { FaRunning } from "react-icons/fa";
import { FaHeart, FaComment } from "react-icons/fa6";
import { IoMdSpeedometer } from "react-icons/io";
import { LuTimer } from "react-icons/lu";
import { calculateRunningPace } from "../../utils/utils";
import { PostCard, UserInfo, Popup, PopupRunningRow, PostDate, PostActions, AddCommentArea, TextArea, ActionButtons, CommentDate, CommentStyling, CommentText, CommentUsername } from "./Social.styled";
import { User } from "../../store/authStore";

type SocialFeedProps = {
    posts: Post[];
    user: User;
};

interface CommentProps {
    username: string;
    text: string;
    date: Date;
}

const POST_MAX_LENGTH = 200;
const POST_MIN_LENGTH = 3;

const Comment: React.FC<CommentProps> = ({ username, text, date }) => {
    return (
        <CommentStyling>
            <CommentUsername>{username}</CommentUsername>
            <CommentText>{text}</CommentText>
            <CommentDate>{date.toLocaleString()}</CommentDate>
        </CommentStyling>
    )
}

export const SocialFeed = ({ posts, user }: SocialFeedProps) => {
    const addComment = useSocialStore((state) => state.addComment);

    const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [commentInput, setCommentInput] = useState<{ [key: number]: string }>({});

    const handleCommentChange = (postIndex: number, text: string) => {
        setCommentInput((prev) => ({ ...prev, [postIndex]: text }));
    };

    const addCommentDisabled = (postIndex: number) => {
        if (!commentInput[postIndex]) {
            return true;
        } else {
            return false;
        }
    }

    const addNewComment = (postIndex: number) => {
        const newComment: PostComment = {
            username: user?.email ?? 'Anonymous',
            text: commentInput[postIndex] || '',
            date: new Date(),
        };

        addComment(posts[postIndex].id, newComment);
        setCommentInput((prev) => ({ ...prev, [postIndex]: '' }));
    };

    const handleUserInfoHover = () => {
        setShowUserInfo(!showUserInfo)
    }

    return (
        <>
            {
                posts.map((post: Post, index: number) =>
                    <PostCard key={index}>
                        {showUserInfo && <Popup>
                            <label>{post.username}</label>
                            <label>{post.city ?? 'N/A'}</label>
                            <label>{post.name ?? 'N/A'}</label>
                            <PopupRunningRow><FaRunning /> {post.distance}Km <LuTimer /> {post.duration} <IoMdSpeedometer /> {calculateRunningPace(post.distance, post.duration)}</PopupRunningRow>
                        </Popup>}
                        <UserInfo onMouseEnter={handleUserInfoHover} onMouseLeave={handleUserInfoHover}>
                            <img src="profile-pic.png" alt="User" />
                            <span>{post.username}</span>
                        </UserInfo>
                        <p>{post.text}</p>
                        <PostDate>
                            <span><FaRunning /> {post.distance}Km </span>
                            <span>{post.date.toLocaleString()}</span>
                        </PostDate>
                        <PostActions>
                            <button>
                                <FaHeart /> {post.likes}
                            </button>
                            <button onClick={() => setShowComments(!showComments)}>
                                <FaComment />{post.comments?.length}  Comments
                            </button>
                        </PostActions>
                        {showComments && <>
                            {post?.comments?.map((comment, commentIndex) =>
                                <Comment key={commentIndex} username={comment.username} text={comment.text} date={comment.date} />
                            )}

                            <AddCommentArea>
                                <TextArea
                                    value={commentInput[index] || ''}
                                    placeholder="Add a comment..."
                                    rows={4}
                                    cols={40}
                                    maxLength={POST_MAX_LENGTH}
                                    minLength={POST_MIN_LENGTH}
                                    onChange={(e) => handleCommentChange(index, e.target.value)}
                                />
                                <ActionButtons>
                                    <Button className={addCommentDisabled(index) ? `disabled-post-btn` : `post-run-btn`} disabled={addCommentDisabled(index)} onClick={() => addNewComment(index)}>Post</Button>
                                </ActionButtons>
                            </AddCommentArea>
                        </>}
                    </PostCard>
                )
            }
        </>
    )
}