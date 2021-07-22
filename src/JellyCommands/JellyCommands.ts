import CommandManager from './managers/CommandManager';
import EventManager from './managers/EventManager';
import { MessageEmbed, Client } from 'discord.js';
import { defaults, schema } from './options';

import type { JellyCommandsOptions, FullJellyCommandsOptions } from './options';
import type { MessageOptions, MessageEmbedOptions } from 'discord.js';
import type { JellyCommandsOptionsMessage } from './options';

export class JellyCommands {
    public readonly client: Client;
    public readonly options: FullJellyCommandsOptions;

    private eventManager: EventManager;
    private commandManager: CommandManager;

    constructor(client: Client, options: JellyCommandsOptions = {}) {
        if (!client || !(client instanceof Client))
            throw new SyntaxError(
                `Expected a instance of Discord.Client, recieved ${typeof client}`,
            );

        this.client = client;

        const { error, value } = schema.validate(
            Object.assign(defaults, options),
        );

        if (error) throw error.annotate();
        else this.options = value;

        this.eventManager = new EventManager(this);
        this.commandManager = new CommandManager(this);
    }

    static resolveMessageObject(
        item: JellyCommandsOptionsMessage,
    ): MessageOptions {
        if (typeof item == 'string') return { content: item };
        if (item instanceof MessageEmbed) return { embed: item };
        return { embed: item as MessageEmbedOptions };
    }

    get events() {
        return this.eventManager;
    }

    get commands() {
        return this.commandManager;
    }
}
