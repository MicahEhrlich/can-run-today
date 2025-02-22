import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { FaHeart, FaComment, FaRunning } from 'react-icons/fa';
import { LuTimer } from "react-icons/lu";
import { IoMdSpeedometer } from "react-icons/io";
import { TextareaHTMLAttributes } from 'react';
import { currentWeatherApiRequest } from '../../api/weather-api';
import { WeatherData } from '../Dashboard/Dashboard';
import { WeatherIcon } from '../Dashboard/Dashboard.styled';
import { calculateRunningPace, getCurrentLocation, getWeatherIcon } from '../../utils/utils';
import {
    MainScreenWrapper, WeatherInfo, RunningStats, PostContentWrapper, ActionButtons, SocialFeed, PostCard, UserInfo, PostActions, Button,
    PostDate, Popup, RunningStatsInput, ErrorMessage, NewPostForm,
    PopupRunningRow,
    CommentStyling,
    CommentDate,
    CommentText,
    CommentUsername,
    AddCommentArea,
    TextArea,
    RunningStatsRow
} from './Social.styled';
import useAuthStore from '../../store/authStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Post, PostComment, useSocialStore } from '../../store/socialStore';

const POST_MAX_LENGTH = 200;
const POST_MIN_LENGTH = 3;

interface PostTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxLength: number;
    minLength: number;
}

interface FormFields {
    distance: number;
    duration: string;
    text: string;
}


interface CommentProps {
    username: string;
    text: string;
    date: Date;
}

const Comment: React.FC<CommentProps> = ({ username, text, date }) => {
    return (
        <CommentStyling>
            <CommentUsername>{username}</CommentUsername>
            <CommentText>{text}</CommentText>
            <CommentDate>{date.toLocaleString()}</CommentDate>
        </CommentStyling>
    )
}

const PostTextarea: React.FC<PostTextareaProps> = forwardRef(({ maxLength, minLength, ...props }, ref) => {
    const forwardRef = ref as React.RefObject<HTMLTextAreaElement>;
    return <TextArea {...props} maxLength={maxLength} minLength={minLength} ref={forwardRef} />;
});

const Social = () => {
    const user = useAuthStore((state) => state.user);
    const posts = useSocialStore((state) => state.posts);
    const addPost = useSocialStore((state) => state.addPost);
    const addComment = useSocialStore((state) => state.addComment);
    const [distance, setDistance] = useState<number>(0.1);
    const [duration, setDuration] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [postContent, setPostContent] = useState<string>('');
    const [commentInput, setCommentInput] = useState<{ [key: number]: string }>({});
    const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

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
    };

    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDistance(parseFloat(e.target.value));
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDuration(e.target.value);
    };

    const handlePostContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPostContent(e.target.value);
    };

    //TODO: all this should be saves in store => evnetually will be saved in DB
    const addNewPost = () => {
        const newPost: Post = {
            id: `id-${Date.now()}`,
            username: user?.email ?? ' ',
            name: user?.name ?? ' ',
            city: user?.city ?? ' ',
            text: postContent,
            distance: distance || 0,
            duration: duration,
            likes: 0,
            comments: [],
            date: new Date()
        };
        addPost(newPost);
        resetPost();
    }

    const resetPost = () => {
        setPostContent('');
        setDistance(0.1);
        setDuration('');
    }

    const getCurrentWeather = async (lat: number, lon: number) => {
        const response = await currentWeatherApiRequest(lat, lon);
        if (response.success && response.data) {
            const parsedResponse = response.data[0];
            const utcOffsetSeconds = parsedResponse.utcOffsetSeconds();
            const current = parsedResponse.current()!;
            const weatherData = {
                current: {
                    time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                    temperature2m: current.variables(0)!.value(),
                    isDay: current.variables(1)!.value(),
                    precipitation: current.variables(2)!.value(),
                    rain: current.variables(3)!.value(),
                    showers: current.variables(4)!.value(),
                    weatherCode: current.variables(5)!.value(),
                    windSpeed10m: current.variables(6)!.value(),
                },

            }
            setWeatherData(weatherData);
        }
    }

    const calculatePace = useCallback(() => {
        if (!distance || !duration || distance <= 0) return 'N/A';
        return calculateRunningPace(distance, duration);
    }, [distance, duration]);

    const handleUserInfoHover = () => {
        setShowUserInfo(!showUserInfo)
    }

    const onSubmit: SubmitHandler<FormFields> = () => {
        addNewPost()
    }

    useEffect(() => {
        calculatePace();
    }, [calculatePace, distance, duration]);

    useEffect(() => {
        getCurrentLocation()
            .then(async (location) => {
                getCurrentWeather(location.lat, location.lon);
            })
            .catch((error) => {
                console.error(error.message);
            });
    }, []);

    return (
        <MainScreenWrapper>
            <WeatherInfo>
                <span>{weatherData?.current.temperature2m.toFixed(0)}°C</span>
                {weatherData?.current.weatherCode && <WeatherIcon
                    src={getWeatherIcon(weatherData.current.weatherCode)}
                    alt="Weather Icon"
                />}
                <span>Current Location</span>
            </WeatherInfo>
            <NewPostForm onSubmit={handleSubmit(onSubmit)}>
                <RunningStats>
                    <RunningStatsRow>
                        <label>Distance:
                            <RunningStatsInput type="number" value={distance} step="0.1" placeholder="km"
                                {...register("distance", { required: true, min: 0.1 })} onChange={handleDistanceChange} />
                        </label>
                        {!distance && distance <= 0 && <ErrorMessage>Distance has to be greater than 0</ErrorMessage>}
                        {errors.distance && !distance && <ErrorMessage>Distance is required</ErrorMessage>}
                    </RunningStatsRow>
                    <RunningStatsRow>
                        <label>Duration:
                            <RunningStatsInput type="string" value={duration} placeholder="hh:mm:ss"
                                {...register("duration", {
                                    required: true,
                                    pattern: {
                                        value: /^([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/, // hh:mm:ss
                                        message: "Enter duration in the following format: hh:mm:ss"
                                    }
                                })}
                                onChange={handleDurationChange} />
                        </label>
                        {errors.duration && !duration.length && <ErrorMessage>Duration is required</ErrorMessage>}
                        {errors.duration?.message && <ErrorMessage>{errors.duration?.message}</ErrorMessage>}
                    </RunningStatsRow>
                </RunningStats>
                <RunningStats><label>Pace: {calculatePace()}</label></RunningStats>

                <PostContentWrapper>
                    <PostTextarea
                        {...register("text", { required: true })}
                        value={postContent}
                        onChange={handlePostContentChange}
                        placeholder="What's on your mind?"
                        rows={4}
                        cols={32}
                        maxLength={POST_MAX_LENGTH}
                        minLength={POST_MIN_LENGTH}
                    />
                </PostContentWrapper>
                {errors.text && !postContent.length && <ErrorMessage>Text is required</ErrorMessage>}
                <ActionButtons>
                    <Button className="post-run-btn" type="submit">Post</Button>
                    <Button className="reset-post-btn" onClick={resetPost}>Reset</Button>
                </ActionButtons>
            </NewPostForm>

            {/* Social Feed */}
            {/* TODO: move to a saparate component*/}
            <SocialFeed>
                {
                    posts.map((post: Post, index: number) =>
                        <PostCard key={index}>
                            <UserInfo onMouseEnter={handleUserInfoHover} onMouseLeave={handleUserInfoHover}>
                                <img src="profile-pic.png" alt="User" />
                                <span>{post.username}</span>
                                {showUserInfo && <Popup>
                                    <label>{post.username}</label>
                                    <label>{post.city ?? 'N/A'}</label>
                                    <label>{post.name ?? 'N/A'}</label>
                                    <PopupRunningRow><FaRunning /> {post.distance}Km <LuTimer /> {post.duration} <IoMdSpeedometer /> {calculateRunningPace(post.distance, post.duration)}</PopupRunningRow>
                                </Popup>}
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

                                {/* Add Comment Input */}
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
            </SocialFeed>
        </MainScreenWrapper>
    );
};

export default Social;