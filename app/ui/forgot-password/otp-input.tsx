import { Input } from '@nextui-org/react';
import React, {
  useRef,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
} from 'react';

export function OTPInput({
  otp,
  setOtp,
}: {
  otp: string[];
  setOtp: (_otp: string[]) => void;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '') {
        if (index > 0) {
          inputs.current[index - 1]?.focus();
        }
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const paste = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (/^\d{6}$/.test(paste)) {
      const newOtp = paste.split('');
      setOtp(newOtp);
      inputs.current[5]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="mb-4 flex w-full gap-2" onPaste={handlePaste}>
      {otp.map((data, index) => (
        <Input
          data-testid={`code${index}-field`}
          id={`code${index}`}
          name={`code${index}`}
          key={index}
          className="w-1/6"
          size="lg"
          variant={'bordered'}
          color="primary"
          classNames={{ input: 'text-center' }}
          maxLength={1}
          type="text"
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
}

export default OTPInput;
