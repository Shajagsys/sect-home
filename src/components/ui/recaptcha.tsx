'use client';

import { forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export interface ReCaptchaProps {
  siteKey: string;
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  theme?: 'dark' | 'light';
}

export const ReCaptcha = forwardRef<ReCAPTCHA, ReCaptchaProps>(
  ({ siteKey, onChange, onExpired, theme = 'dark' }, ref) => {
    if (!siteKey) return null;

    return (
      <div className="my-2 flex flex-col items-start min-h-[78px] min-w-[304px]">
        <ReCAPTCHA
          ref={ref}
          sitekey={siteKey}
          theme={theme}
          onChange={onChange}
          onErrored={onExpired}
          onExpired={onExpired}
        />
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';
