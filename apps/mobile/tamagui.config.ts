import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'
import { themes } from './themes'
import { shorthands } from '@tamagui/shorthands'

const appConfig = createTamagui({
    ...defaultConfig,
    themes,
    shorthands
})

export type AppConfig = typeof appConfig

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}

export default appConfig 