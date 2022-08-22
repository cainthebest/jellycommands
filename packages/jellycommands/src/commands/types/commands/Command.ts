import { type AutocompleteInteraction, ApplicationCommandOptionType } from 'discord.js';
import type { ApplicationCommandOption, ChatInputCommandInteraction } from 'discord.js';
import type { APIApplicationCommandOption } from 'discord-api-types/v10';
import { ApplicationCommandType } from 'discord-api-types/v10';
import type { JellyApplicationCommandOption } from './types';
import type { JellyCommands } from '../../../JellyCommands';
import type { BaseCommandCallback } from '../BaseCommand';
import { schema, CommandOptions } from './options';
import { ApplicationCommand } from 'discord.js';
import { BaseCommand } from '../BaseCommand';
import { removeKeys } from 'ghoststools';

type Awaitable<T> = T | Promise<T>;

export type AutocompleteHandler = (options: {
    interaction: AutocompleteInteraction;
    client: JellyCommands;
}) => Awaitable<any | void>;

export class Command extends BaseCommand<CommandOptions, ChatInputCommandInteraction> {
    public readonly type = ApplicationCommandType.ChatInput;

    constructor(
        run: BaseCommand<CommandOptions, ChatInputCommandInteraction>['run'],
        options: CommandOptions,
        readonly autocomplete?: AutocompleteHandler,
    ) {
        super(run, { options, schema });

        if (this.autocomplete && typeof this.autocomplete !== 'function') {
            throw new TypeError('Autocomplete handler must be a function');
        }
    }

    static transformOptionType(option: JellyApplicationCommandOption): ApplicationCommandOption {
        const type =
            typeof option.type == 'string'
                ? ApplicationCommandOptionType[option.type]
                : option.type;

        if (!type)
            throw new Error(
                `Unable to find Slash Command Option type "${option.type}", see https://discord-api-types.dev/api/discord-api-types-v10/enum/ApplicationCommandOptionType`,
            );

        let options: ApplicationCommandOption[] | undefined;

        if ('options' in option && Array.isArray(option.options)) {
            options = option.options?.map((o) => Command.transformOptionType(o));
        }

        return { ...option, options, type } as ApplicationCommandOption;
    }

    static transformOption(option: JellyApplicationCommandOption): APIApplicationCommandOption {
        const patched = Command.transformOptionType(option);

        const transform = ApplicationCommand['transformOption'].bind(ApplicationCommand);
        return transform(patched, false) as APIApplicationCommandOption;
    }

    get applicationCommandData() {
        const options = this.options.options?.map((o) => Command.transformOption(o));

        return {
            ...super.applicationCommandData,
            description: this.options.description,
            description_localizations: this.options.descriptionLocalizations,
            options,
        };
    }
}

export const command = (
    options: CommandOptions & {
        run: BaseCommandCallback<ChatInputCommandInteraction>;
        autocomplete?: AutocompleteHandler;
    },
) => {
    return new Command(
        options.run,
        removeKeys(options, ['run', 'autocomplete']) as CommandOptions,
        options.autocomplete,
    );
};
