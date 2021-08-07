import { MessagePayload } from 'discord.js';
import Joi from 'joi';

export const schema = Joi.object({
    /**
     * Set to ignore messages from other discord bots or not.
     */
    ignoreBots: Joi.bool().default(true),

    /**
     * Default prefix for the bot.
     */
    prefix: Joi.string().min(1).max(64).default('!'),

    /**
     * Customisable responses
     */
    messages: Joi.object({
        /**
         * This is sent when a unkown command is given
         */
        unknownCommand: [
            Joi.string(),
            Joi.object().instance(MessagePayload),
            Joi.object(),
        ],
    }).default(),
});
