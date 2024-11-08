'use client';

import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';

/**
 * A button to switch between light and dark themes.  Used in the sidenav when the screen is small.
 */

export default function ThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      className="md:hidden"
      size="lg"
      variant="shadow"
      color="default"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      isIconOnly
    >
      {theme === 'dark' ? (
        <MoonIcon className="w-6" />
      ) : (
        <SunIcon className="w-6" />
      )}
    </Button>
  );
}
