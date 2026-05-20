import CssBaseline from "@mui/material/CssBaseline";
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { type Preview } from '@storybook/react-vite';
import React, { useEffect, useState } from 'react';
import { DARK_MODE_EVENT_NAME, useDarkMode } from 'storybook-dark-mode';
import { addons } from 'storybook/preview-api';

const channel = addons.getChannel();

const lightTheme = createTheme({
  palette: { mode: 'light' },
});

const darkTheme = createTheme({
  palette: { mode: 'dark' },
});

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const [isDark, setDark] = useState(true);
      const theme = isDark ? darkTheme : lightTheme;

      useEffect(() => {
        const sbRoot = document.getElementsByClassName(
          'sb-show-main',
        )[0] as HTMLElement;
        channel.on(DARK_MODE_EVENT_NAME, setDark);
        if (sbRoot) {
          sbRoot.style.backgroundColor = theme.palette.background.default;
        }
        return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
      }, [theme]);

      useEffect(() => {
        if (process.env.NODE_ENV === 'development') return;
        const script = document.createElement('script');
        script.src = 'https://plausible.io/js/script.js';
        script.setAttribute('data-domain', 'material-react-table.dev');
        script.defer = true;

        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        };
      }, []);

      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography
              sx={{
                color: useDarkMode() ? '#fff' : '#666',
                pb: '0.5rem',
              }}
              variant="subtitle2"
            >
              Looking for the main docs site? Click{' '}
              <Link
                href="https://www.material-react-table.com"
                rel="noopener"
                target="_blank"
              >
                here.
              </Link>
            </Typography>
            <Typography
              sx={{
                color: useDarkMode() ? '#fff' : '#666',
                pb: '1rem',
              }}
              variant="subtitle2"
            >
              View Source code for these examples in the code tab below or{' '}
              <Link
                href="https://github.com/KevinVandy/material-react-table/tree/v3/packages/material-react-table/stories/features"
                target="_blank"
              >
                here on GitHub.
              </Link>
            </Typography>
            <Story {...context} />
          </LocalizationProvider>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    docs: {
      codePanel: true
    }
  },
};

export default preview;
