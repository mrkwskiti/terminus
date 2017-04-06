import * as fs from 'fs-promise'
import * as path from 'path'
import { Injectable } from '@angular/core'
import { TerminalColorSchemeProvider, ITerminalColorScheme } from './api'


@Injectable()
export class HyperColorSchemes extends TerminalColorSchemeProvider {
    async getSchemes (): Promise<ITerminalColorScheme[]> {
        let pluginsPath = path.join(process.env.HOME, '.hyper_plugins', 'node_modules')
        if (!(await fs.exists(pluginsPath))) return []
        let plugins = await fs.readdir(pluginsPath)

        let themes: ITerminalColorScheme[] = []

        plugins.forEach(plugin => {
            let module = (<any>global).require(path.join(pluginsPath, plugin))
            if (module.decorateConfig) {
                let config = module.decorateConfig({})
                if (config.colors) {
                    themes.push({
                        name: plugin,
                        foreground: config.foregroundColor,
                        background: config.backgroundColor,
                        colors: config.colors.black ? [
                            config.colors.black,
                            config.colors.red,
                            config.colors.green,
                            config.colors.yellow,
                            config.colors.blue,
                            config.colors.magenta,
                            config.colors.cyan,
                            config.colors.white,
                            config.colors.lightBlack,
                            config.colors.lightRed,
                            config.colors.lightGreen,
                            config.colors.lightYellow,
                            config.colors.lightBlue,
                            config.colors.lightMagenta,
                            config.colors.lightCyan,
                            config.colors.lightWhite,
                        ] : config.colors,
                    })
                }
            }
        })

        return themes
    }
}