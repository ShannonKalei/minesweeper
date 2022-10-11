import React, { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import createPersistedState from 'use-persisted-state';

const LOCAL_STORAGE_KEY = "colorScheme";

function checkLocalStorageItem(key: string) {
  const value = localStorage.getItem(key);

  if (value == null) {
    return true;
  }

  try {
    JSON.parse(value);
    return true;
  } catch (error) {
    return false;
  }
}

function useLocalStorageValidation(key: string) {
  const safeCheck = useRef(false);

  if (!safeCheck.current) {
    safeCheck.current = true;

    if (!checkLocalStorageItem(key)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
}

const useColorSchemeState = createPersistedState<any>('colorScheme');

export default function ThemeSlider() {
  useLocalStorageValidation(LOCAL_STORAGE_KEY);
  const systemPrefersDark = useMediaQuery({query: '(prefers-color-scheme:dark)'});
  const initialColorState = useColorSchemeState();

  let active = useColorSchemeState();
  let systemPref = 'dark';
  if (!initialColorState[0]) {
    if (!systemPrefersDark) {
      systemPref = 'light'
    } 
  }
  active = useColorSchemeState(systemPref);
  const [ prevTheme, setPrevTheme ] = useState(systemPrefersDark ? 'dark' : 'light');
  const [ activeTheme, setActiveTheme ] = useColorSchemeState(active);

  const colorThemes = {
    1: "light",
    2: "sakura",
    3: "maple",
    4: "carrot",
    5: "sun",
    6: "turtle",
    7: "water",
    8: "grape",
    9: "dark"
  }

  useEffect(() => {
    let timerId;
    if (timerId) {
      clearTimeout(timerId);
    }
    document.body.classList.add(activeTheme);

    if (activeTheme !== prevTheme) {
      const gradient = document.getElementById("gradient-background");
      if (!gradient) return;
      gradient.classList.remove('gradient-background-on');
      document.body.classList.remove(prevTheme);
      timerId = setTimeout(() => {
        gradient.classList.add('gradient-background-on');
      }, 2000);
      
    }
  }, [activeTheme]);

  function getColorThemeKey(object: { [key: string]: string }, value: any) {
    return Object.keys(object).find(key => object[key] === value);
  }
  
  const handleColorThemeChange = (theme: string | number | React.ChangeEvent<HTMLInputElement>) => {
    setActiveTheme(colorThemes[theme as keyof typeof colorThemes]);
  }

  return (
    <div className="color-theme-picker-container">
        <input type="range"
          className='color-theme-slider'
          value={getColorThemeKey(colorThemes, activeTheme)}
          min={1}
          max={9}
          step={1}
          onChange={(theme) => {
            setPrevTheme(activeTheme);
            handleColorThemeChange(theme.target.value);
          }}
        ></input>
        <div className="color-slider-labels">
          <span>🍙</span>
          <span>🌸</span>
          <span>🍁</span>
          <span>🥕</span>
          <span>🌞</span>
          <span>🐢</span>
          <span>💧</span>
          <span>🍇</span>
          <span>🌘</span>
        </div>
    </div>
      
  );
};