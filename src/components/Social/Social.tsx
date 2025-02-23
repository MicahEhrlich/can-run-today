import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { TextareaHTMLAttributes } from 'react';
import { currentWeatherApiRequest } from '../../api/weather-api';
import { WeatherData } from '../Dashboard/Dashboard';
import { WeatherIcon } from '../Dashboard/Dashboard.styled';
import { calculateRunningPace, getCurrentLocation, getWeatherIcon } from '../../utils/utils';
import {
    MainScreenWrapper, WeatherInfo, RunningStats, PostContentWrapper, ActionButtons, Button,
    RunningStatsInput, ErrorMessage, NewPostForm,
    TextArea,
    RunningStatsRow
} from './Social.styled';
import useAuthStore from '../../store/authStore';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Post, useSocialStore } from '../../store/socialStore';
import { SocialFeed } from './SocialFeed';

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

const PostTextarea: React.FC<PostTextareaProps> = forwardRef(({ maxLength, minLength, ...props }, ref) => {
    const forwardRef = ref as React.RefObject<HTMLTextAreaElement>;
    return <TextArea {...props} maxLength={maxLength} minLength={minLength} ref={forwardRef} />;
});

const Social = () => {
    const user = useAuthStore((state) => state.user);
    const posts = useSocialStore((state) => state.posts);
    const addPost = useSocialStore((state) => state.addPost);
    const [distance, setDistance] = useState<number>(0.1);
    const [duration, setDuration] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [postContent, setPostContent] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormFields>()

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
            {posts && posts.length && user ? <SocialFeed posts={posts} user={user} /> : <h2>No Posts Yet!</h2>}
        </MainScreenWrapper>
    );
};

export default Social;