import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Checkbox, FormControlLabel, Box, CircularProgress, TextField, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import { getUserDetails, updateUserDetails } from '../../api/authenticated-api';
import useSettingsStore, { UserSettings } from '../../store/settingsStore';
import useAuthStore from '../../store/authStore';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Settings: React.FC = () => {
    const setUserSettings = useSettingsStore((state) => state.setUserSettings);
    const userSettings = useSettingsStore((state) => state.userSettings);
    const loading = useAuthStore((state) => state.loading);
    const [editMode, setEditMode] = useState(false);
    const [weekDaysRunning, setWeekDaysRunning] = useState<number[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

    const handleCheckboxChange = (index: number) => {
        const updatedWeekDaysRunning = [...weekDaysRunning];
        updatedWeekDaysRunning[index] = updatedWeekDaysRunning[index] === 1 ? 0 : 1;
        setWeekDaysRunning(updatedWeekDaysRunning);
    };

    const handleNoteChange = (field: keyof UserSettings) => {
        if (userSettings) {
            setUserSettings({
                ...userSettings,
                [field]: !userSettings[field],
            });
        }
    };

    const handleTemperatureChange = (field: keyof UserSettings, value: number) => {
        if (userSettings) {
            setUserSettings({
                ...userSettings,
                [field]: value,
            });
        }
    };

    const handleInputChange = (field: keyof UserSettings, value: string) => {
        if (userSettings) {
            setUserSettings({
                ...userSettings,
                [field]: value,
            });
        }
    };

    const handleSave = async () => {
        try {
            const updatedSettings: UserSettings = {
                ...userSettings,
                weekDaysRunning: weekDaysRunning,
            };
            const response = await updateUserDetails(updatedSettings);
            if (response.success) {
                setEditMode(false);
                setAlertMessage('Settings saved successfully');
                setAlertSeverity('success');
            } else {
                setAlertMessage('Failed to save settings');
                setAlertSeverity('error');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                setAlertMessage(error.message);
            } else {
                console.error(error);
                setAlertMessage('An error occurred');
            }
            setAlertSeverity('error');
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getUserDetails();
                if (response.success && response.data) {
                    const userSettings = response.data as UserSettings;
                    setUserSettings(userSettings);
                    if (userSettings.weekDaysRunning) {
                        setWeekDaysRunning(userSettings.weekDaysRunning.toString().split('').map(Number));
                    }
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error(error);
                }
            }

        };
        fetchData();
    }, [setUserSettings]);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                User Settings
            </Typography>
            {userSettings ? (<Paper elevation={3} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Personal Information
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            type="text"
                            fullWidth
                            value={userSettings.name}
                            disabled={!editMode}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            type="text"
                            fullWidth
                            value={userSettings.email}
                            disabled={!editMode}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone Number"
                            type="text"
                            fullWidth
                            value={userSettings.phoneNumber}
                            disabled={!editMode}
                            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="City"
                            type="text"
                            fullWidth
                            value={userSettings.city}
                            disabled={!editMode}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Country"
                            type="text"
                            fullWidth
                            value={userSettings.country}
                            disabled={!editMode}
                            onChange={(e) => handleInputChange('country', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Temperature Preferences
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Min Temperature"
                            type="number"
                            fullWidth
                            value={userSettings.minTemperature}
                            disabled={!editMode}
                            onChange={(e) => handleTemperatureChange('minTemperature', Number(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Max Temperature"
                            type="number"
                            fullWidth
                            value={userSettings.maxTemperature}
                            disabled={!editMode}
                            onChange={(e) => handleTemperatureChange('maxTemperature', Number(e.target.value))}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Running Days
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {daysOfWeek.map((day, index) => (
                            <FormControlLabel
                                key={index}
                                control={
                                    <Checkbox
                                        disabled={!editMode}
                                        checked={weekDaysRunning[index] === 1}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                }
                                label={day}
                            />
                        ))}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Notifications
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={!editMode}
                                    checked={Boolean(userSettings.noteByEmail)}
                                    onChange={() => handleNoteChange('noteByEmail')}
                                />
                            }
                            label="Note by Email"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={!editMode}
                                    checked={Boolean(userSettings.noteByWhatsapp)}
                                    onChange={() => handleNoteChange('noteByWhatsapp')}
                                />
                            }
                            label="Note by Whatsapp"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={!editMode}
                                    checked={Boolean(userSettings.noteBySMS)}
                                    onChange={() => handleNoteChange('noteBySMS')}
                                />
                            }
                            label="Note by SMS"
                        />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        {editMode ? (
                            <>
                                <Button variant="contained" color="primary" disabled={loading} onClick={handleSave}>
                                    Save
                                </Button>
                                <Button variant="contained" color="secondary" disabled={loading} onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" color="secondary" onClick={() => setEditMode(true)}>
                                Edit Settings
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Paper>) :
                (<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>)}
            {alertMessage && (
                <Box sx={{ mt: 2 }}>
                    <Alert severity={alertSeverity} onClose={() => setAlertMessage(null)}>
                        {alertMessage}
                    </Alert>
                </Box>
            )}
        </Container>
    );
};

export default Settings;