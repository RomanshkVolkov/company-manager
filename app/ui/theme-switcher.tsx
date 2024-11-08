'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@nextui-org/react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

/**
 * A button to switch between light and dark themes.  Used in all pages when the screen is large.
 */

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Switch
      className="hidden md:flex"
      defaultSelected
      size="lg"
      aria-label="Automatic updates"
      isSelected={theme === 'dark'}
      onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      startContent={<SunIcon className="h-6 w-6" />}
      endContent={<MoonIcon className="h-6 w-6" />}
    />
  );
}
