import '../../styles/profilePictureStyles.css';
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { LoginState } from "../../../../store/slices/loginSlice";
import React from 'react';
import ErrorAlert from './ErrorAlert';
import Loading from '../../../loading/Loading';
import { useUpdateProfilePicture } from '../../hooks/useUpdateProfilePicture';
import SubHeader from '../../../header/components/SubHeader';
import SettingsNav from './SettingsNav';
import ProfilePicture from '../ProfilePicture';
import { setMessage } from '../../../../store/slices/messageSlice';

const TEN_MB_IN_BYTES = 10485760; //Max picture file size
const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const ProfilePicturePage = () => {

    const { loading, user, error }: LoginState = useAppSelector(state => state.login);
    let dispatch = useAppDispatch();
    const [picture, setPicture] = useState<string>();
    let [profileState, updateProfilePicture] = useUpdateProfilePicture();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState({type: '', visible: false});
    const fileInput: React.RefObject<HTMLInputElement> = React.createRef();;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files){
            const file = event.target.files[0];
            if(allowedFileTypes.includes(file.type)){
                if (file.size <= TEN_MB_IN_BYTES){
                    setFileError({type: '', visible: false});
                    setSelectedFile(file);
                    setPicture(URL.createObjectURL(file));
                    
                }
                else {
                    clearFile();
                    event.target.value = '';
                    setFileError({type: 'size', visible: true});
                }
            }
            else {
                clearFile();
                event.target.value = '';
                setFileError({type: 'fileType', visible: true});
            }
            
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(selectedFile) {
            const formData = new FormData();
            formData.append("profilePicture", selectedFile);
            updateProfilePicture(formData);
        }
        else{
            setFileError({type: 'noFile', visible: true});
        }
    }

    const clearFile = () => {
        setPicture(undefined);
        setSelectedFile(null);
        
        if(fileInput && fileInput.current){
            fileInput.current.value = '';
        }
        setFileError({type: '', visible: false});
    }

    useEffect(() => {
        if(profileState.data) {
            dispatch(setMessage({content: 'Profile picture updated successfuly', variant: 'Success'}));
        }
        else if(profileState.error) {
            dispatch(setMessage({content: `Oops! Couldn't update profile picture. Please try again`, 
                variant: 'Danger'}));
        }
    }, [dispatch, profileState.data, profileState.error])

    return (
        <div className="profile-picture-page">
            <SubHeader title="Profile picture" childComp={() => SettingsNav('picture')} icon='fas fa-user-edit'></SubHeader>
            {(loading || profileState.loading) && <Loading />}
            {error && "Error"}
            {! loading && 
            <div className="profile-picture-wrapper">
                <div className="picture-container">
                    {picture && <ProfilePicture source={picture} sourceType="url"/>}
                    {!picture && !profileState.loading && user && user.profilePicture && 
                    <ProfilePicture source={user.profilePicture} sourceType="base64"/>}
                </div>
                <div className="picture-form-container">
                    <ErrorAlert error={fileError.type} visible={fileError.visible} />
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Select your profile picture (maximum file size: 10MB)</Form.Label>
                            <Form.Control type="file" ref={fileInput} onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)} />
                        </Form.Group>
                        <div>
                            <Button variant="dark" type="submit" className="picture-button">Save changes</Button>
                            <Button variant="outline-dark" type="button" onClick={e => clearFile()} className="picture-button">Clear input</Button>
                        </div>
                    </Form>
                </div>              
            </div>}
        </div>
    );
};

export default ProfilePicturePage;