const DEFAULT_PROFILE_PICTURE = '/default_profile_picture.png'

type ProfilePictureArgs = {
    source?: string,
    sourceType?: string
    className?: string
}

const ProfilePicture = ({source, sourceType, className}: ProfilePictureArgs) => {
    if(source){
        if(sourceType === 'url'){
            return <img src={source} alt="profile" className={className ? className : `profile-picture`} />
        }
        if(sourceType === 'base64'){
            return <img src={`data:image/jpg;base64,${source}`} alt="profile" className={className ? className : `profile-picture`} />
        }
        else{
            return <img src={DEFAULT_PROFILE_PICTURE} alt="profile" className={className ? className : `profile-picture`} />
        }
    }   
    else{
        return <img src={DEFAULT_PROFILE_PICTURE} alt="profile" className={className ? className : `profile-picture`} />
    }
}

export default ProfilePicture;