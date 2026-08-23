import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppSettings, loadSettings, saveSettings } from '../lib/storage';

interface AppContextValue {
  chineseAssist: boolean;
  setChineseAssist: (val: boolean) => void;
  apiMode: 'shared' | 'mock' | 'claude' | 'openai' | 'deepseek';
  setApiMode: (val: 'shared' | 'mock' | 'claude' | 'openai' | 'deepseek') => void;
  apiKey: string;
  setApiKey: (val: string) => void;
  dailyGoal: number;
  setDailyGoal: (val: number) => void;
  hintsOn: boolean;
  setHintsOn: (val: boolean) => void;
  slowMode: boolean;
  setSlowMode: (val: boolean) => void;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  showDate: string;
  setShowDate: (val: string) => void;
  showName: string;
  setShowName: (val: string) => void;
  settingsLoaded: boolean;
}

const AppContext = createContext<AppContextValue>({} as AppContextValue);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    chineseAssist: true,
    apiMode: 'shared',
    apiKey: '',
    dailyGoal: 3,
    hintsOn: true,
    slowMode: false,
    dailyReminder: true,
    autoSpeak: true,
    showDate: '',
    showName: '',
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setSettingsLoaded(true);
    });
  }, []);

  function updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings({ [key]: value });
  }

  return (
    <AppContext.Provider
      value={{
        chineseAssist: settings.chineseAssist,
        setChineseAssist: (v) => updateSetting('chineseAssist', v),
        apiMode: settings.apiMode,
        setApiMode: (v) => updateSetting('apiMode', v),
        apiKey: settings.apiKey,
        setApiKey: (v) => updateSetting('apiKey', v),
        dailyGoal: settings.dailyGoal,
        setDailyGoal: (v) => updateSetting('dailyGoal', v),
        hintsOn: settings.hintsOn,
        setHintsOn: (v) => updateSetting('hintsOn', v),
        slowMode: settings.slowMode,
        setSlowMode: (v) => updateSetting('slowMode', v),
        autoSpeak: settings.autoSpeak,
        setAutoSpeak: (v) => updateSetting('autoSpeak', v),
        showDate: settings.showDate,
        setShowDate: (v) => updateSetting('showDate', v),
        showName: settings.showName,
        setShowName: (v) => updateSetting('showName', v),
        settingsLoaded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
