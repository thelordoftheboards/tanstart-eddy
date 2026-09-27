import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from '~/components/theme-provider';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

export function ToggleAppearance() {
  const { theme, setTheme } = useTheme();
  //const theme = 'light';

  // Local settings for display preferences (these could be stored in localStorage or user preferences)
  // const [displaySettings, setDisplaySettings] = useState({
  //   fontSize: 'medium',
  //   compactMode: false,
  //   reducedMotion: false,
  //   highContrast: false,
  // });

  // Load settings from localStorage on mount
  // useEffect(() => {
  //   const loadSetting = (key: string, defaultValue: string | boolean) => {
  //     try {
  //       const stored = localStorage.getItem(`display-${key}`);
  //       return stored ? JSON.parse(stored) : defaultValue;
  //     } catch {
  //       return defaultValue;
  //     }
  //   };

  //   setDisplaySettings({
  //     fontSize: loadSetting('fontSize', 'medium'),
  //     compactMode: loadSetting('compactMode', false),
  //     reducedMotion: loadSetting('reducedMotion', false),
  //     highContrast: loadSetting('highContrast', false),
  //   });
  // }, []);

  const themes = [
    {
      description: 'Light mode theme',
      icon: IconSun,
      label: 'Light',
      value: 'light',
    },
    {
      description: 'Dark mode theme',
      icon: IconMoon,
      label: 'Dark',
      value: 'dark',
    },
    {
      description: 'Use system preference',
      icon: IconDeviceDesktop,
      label: 'System',
      value: 'system',
    },
  ];

  // const handleDisplaySettingChange = (key: string, value: string | boolean) => {
  //   setDisplaySettings((prev) => ({ ...prev, [key]: value }));
  //   // Persist to localStorage
  //   localStorage.setItem(`display-${key}`, JSON.stringify(value));
  //   console.log(`Display setting ${key} changed to ${value}`);
  // };

  return (
    <div className="flex items-center gap-2">
      <Tabs className="w-full" onValueChange={setTheme} value={theme}>
        <TabsList className="grid w-full grid-cols-3">
          {themes.map((themeOption) => (
            <TabsTrigger className="gap-2" key={themeOption.value} value={themeOption.value}>
              <themeOption.icon className="h-4 w-4" />
              {/*themeOption.label*/}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
