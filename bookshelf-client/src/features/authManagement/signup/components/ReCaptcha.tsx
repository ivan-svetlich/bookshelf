import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { KEYS } from "../../../../appConfig";

interface ReCaptchaFormProps {
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const ReCaptcha = ({setToken}: ReCaptchaFormProps) => {
    
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    return (
        <>
        <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={KEYS.RE_CAPTCHA.PUBLIC_KEY}
            onChange={setToken}
        /> 
        </>
    )
}

export default ReCaptcha