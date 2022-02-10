import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { KEYS } from "../../../../appConfig";
import isMobileDevice from "../../../../utils/helpers/isMobileDevice";

interface ReCaptchaFormProps {
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const ReCaptcha = ({ setToken }: ReCaptchaFormProps) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  return (
    <div className="captcha-container">
      {isMobileDevice() ? (
        <ReCAPTCHA
          key="compact-recaptcha"
          size="compact"
          ref={recaptchaRef}
          sitekey={KEYS.RE_CAPTCHA.PUBLIC_KEY}
          onChange={setToken}
        />
      ) : (
        <ReCAPTCHA
          key="normal-recaptcha"
          size="normal"
          ref={recaptchaRef}
          sitekey={KEYS.RE_CAPTCHA.PUBLIC_KEY}
          onChange={setToken}
        />
      )}
    </div>
  );
};

export default ReCaptcha;
