<a name="Collector"></a>
# Collector

> A Collector for `manbo` based bots

* [Manbo-Collector](#Collector)
    * [Features](#Features)
    * [Install](#Install)
      * [NPM](#NPM)
      * [Yarn](#Yarn)
      * [PNPM](#PNPM)
    * [API](#API)
      * [Message](#Message) 
        * [MessageCollector](#MessageCollector)
        * [awaitMessages](#awaitMessages)
      * [Reaction](#Reaction)
        * [ReactionCollector](#ReactionCollector)
        * [awaitReactions](#awaitReactions)
      * [Interaction](#Interaction)
        * [InteractionCollector](#InteractionCollector)
        * [awaitComponentInteractions](#awaitComponentInteractions)
      * [Events](#Events)
      * [Contribute](#Contribute)

<a name="Features"></a>
## Features

* Works with latest [manbo](https://npmjs.com/manbo) package.
* Supports `MessageCollector` and `awaitMessages`.
* Supports `ReactionCollector` and `awaitReactions`.
* Supports `InteractionCollector` and `awaitInteractions`.
* Configurable `message`, `channel`, `guild`, `interaction` options.
* Configurable `time`, `idle`, `dispose`, `max` options.
* Active community and fast support.

<a name="Install"></a>
## Install

### NPM

```bash
npm install manbo-collector
```

### Yarn

```bash
yarn add manbo-collector
```

### PNPM

```bash
pnpm add manbo-collector
```

<a name="API"></a>
## API

<a name="Message"></a>
## Message

<a name="MessageCollector"></a>
## MessageCollector

> Create a collector to collect messages in the channel

**Parameters:**

- **_client:_** The client to apply a collector
    - Type: `Manbo.Client` (see more information
      in [Client](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/Client.js#L67))
    - Required: `true`


- **_channel:_** The channel to collect messages
    - Type: `Manbo.TextChannel` (see more information
      in [TextChannel](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/TextChannel.js#L17))
    - Required: `true`


- **_options:_** Collector options

  |options|type|description|
  |------|---|---|
  |**dispose?**|boolean|Whether to dispose data when it's deleted|
  |**idle?**|number|How long to stop the collector after inactivity in milliseconds|
  |**max?**|number|The maximum total amount of data to collect|
  |**time?**|number|How long to run the collector for in milliseconds|
  |**filter?**|function|The filter applied to this collector|

**Methods:**

- **_stop:_** Stop this collector

  |param|default|description|
  |---|---|---|
  |**reason?**|`user`|The reason to stop this collector

  **Example:**
    ```ts
    collector.stop('custom reason')
    collector.stop() // reason: `user` (default)
    ```

- **_resetTimer:_** Reset the time to end this collector
    - **ResetTimerOptions**

      |param|type|description|
      |---|---|---|
      |**idle?**|number|How long to stop the collector after inactivity in milliseconds|
      |**time?**|number|How long to run the collector for in milliseconds|

  **Example:**
    ```ts
    collector.resetTimer({idle: 15_000, time: 30_000})
    collector.resetTimer({idle: 150_000})
    collector.resetTimer({time: 30_000})
    ```
    
- **_empty:_** Empty the collected data of this collector

    **Example:**
    ```ts
    collector.empty()
    ```

**Examples:**
<details> 
<summary>ESM</summary>

```ts 
import { MessageCollector } from 'manbo-collector'
import { Client, Constants, Message } from 'manbo'

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message: Message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg: Message) => msg.author.id === message.author.id

    const collector = new MessageCollector(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    collector.on('collect', (collectedMessage) => {
        console.log(`collected message: ${collectedMessage.id}`)
    })

    collector.on('end', (collectedMessages) => {
        console.log(`collected ${collectedMessages.length} messages`)
    })
})
```

</details>
<details> 
<summary>CommonJS</summary>

```js 
const { MessageCollector } = require('manbo-collector')
const { Client, Constants } = require('manbo')

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg) => msg.author.id === message.author.id

    const collector = new MessageCollector(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    collector.on('collect', (collectedMessage) => {
        console.log(`collected message: ${collectedMessage.id}`)
    })

    collector.on('end', (collectedMessages) => {
        console.log(`collected ${collectedMessages.length} messages`)
    })
})
```

</details>

<a name="awaitMessages"></a>
## awaitMessages

> A method to collect messages in TextChannel

**Parameters:**

- **_client:_** The client to apply in a method
    - Type: `Manbo.Client` (see more information
      in [Client](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/Client.js#L67))
    - Required: `true`


- **_channel:_** The channel to collect messages
    - Type: `Manbo.TextChannel` (see more information
      in [TextChannel](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/TextChannel.js#L17))
    - Required: `true`


- **_options:_** Collect options

  |options|type|description|
  |------|---|---|
  |**dispose?**|boolean|Whether to dispose data when it's deleted|
  |**idle?**|number|How long to stop this collecting method after inactivity in milliseconds.|
  |**max?**|number|The maximum total amount of data to collect|
  |**time?**|number|How long to run this collecting method for in milliseconds|
  |**filter?**|function|The filter applied to this collecting method|

- **_Returns:_**
    
    `Promise<Manbo.Message[]>` (see more information in [awaitMessages](https://github.com/Manbo-js/collector/commit/fce19260f7a3ce906095cf8ee325a41d3e3dee8a/src/structures/MessageCollector.ts#L79))

**Examples:**
<details> 
<summary>ESM</summary>

```ts 
import { awaitMessages } from 'manbo-collector'
import { Client, Constants, Message } from 'manbo'

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message: Message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg: Message) => msg.author.id === message.author.id

    const collectedMessages = await awaitMessages(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    console.log(`collected ${collectedMessages.length} messages`)
})
```

</details>
<details> 
<summary>CommonJS</summary>

```js 
const { awaitMessages } = require('manbo-collector')
const { Client, Constants } = require('manbo')

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg) => msg.author.id === message.author.id

    const collectedMessages = await awaitMessages(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    console.log(`collected ${collectedMessages.length} messages`)
})
```

</details>


<a name="Reaction"></a>
## Reaction

<a name="ReactionCollector"></a>
## ReactionCollector

> Create a collector to collect message reactions in a message

same as [MessageCollector](#MessageCollector) but with reactions

<a name="awaitReactions"></a>
## awaitReactions

> A method to collect message reactions in a message

same as [awaitMessages](#awaitMessages) but with reactions

too lazy to add same of this again and again and again and again...


<a name="Interaction"></a>
## Interaction

<a name="InteractionCollector"></a>
## InteractionCollector

> Create a collector to collect interactions in the channel

**Parameters:**

- **_client:_** The client to apply a collector
    - Type: `Manbo.Client` (see more information
      in [Client](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/Client.js#L67))
    - Required: `true`

- **_options:_** Collector options

  |options|type|description|
  |------|---|---|
  |**dispose?**|boolean|Whether to dispose data when it's deleted.|
  |**idle?**|number|How long to stop the collector after inactivity in milliseconds.|
  |**max?**|number|The maximum total amount of data to collect|
  |**time?**|number|How long to run the collector for in milliseconds|
  |**filter?**|function|The filter applied to this collector|
  |**channel?**|[TextChannel](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/TextChannel.js#L17)|The channel to listen to interactions from|
  |**guild?**|[Guild](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/Guild.js#L81)|The guild to listen to interactions from|
  |**interaction?**|[AutoCompleteInteraction](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/AutocompleteInteraction.js#L21) <br>or [CommandInteraction](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/CommandInteraction.js#L34) <br>or [ComponentInteraction](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/ComponentInteraction.js#L17)|The interaction response to listen to message component interactions from|
  |**message?**|[Message](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/structures/Message.js#53)|The message to listen to interactions from|
  |**componentType?**|[ComponentType](https://discord.com/developers/docs/interactions/message-components#component-object-component-types)|The type of components to listen for|
  |**interactionType?**|[InteractionType](https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type)|The type of interactions to listen for|

**Methods:**

- **_stop:_** Stop this collector

  |param|default|description|
  |---|---|---|
  |**reason?**|`user`|The reason to stop this collector

  **Example:**
    ```ts
    collector.stop('custom reason')
    collector.stop() // reason: `user` (default)
    ```

- **_resetTimer:_** Reset the time to end this collector
    - **ResetTimerOptions**

      |param|type|description|
      |---|---|---|
      |**idle?**|number|How long to stop the collector after inactivity in milliseconds|
      |**time?**|number|How long to run the collector for in milliseconds|

  **Example:**
    ```ts
    collector.resetTimer({idle: 15_000, time: 30_000})
    collector.resetTimer({idle: 150_000})
    collector.resetTimer({time: 30_000})
    ```

- **_empty:_** Empty the collected data of this collector

  **Example:**
    ```ts
    collector.empty()
    ```

**Examples:**
<details> 
<summary>ESM</summary>

```ts 
import { InteractionCollector } from 'manbo-collector'
import { Client, Constants, Message } from 'manbo'

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message: Message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    const msg = await message.channel.createMessage({
        content: 'An InteractionCollector',
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                    {
                        type: Constants.ComponentTypes.BUTTON,
                        custom_id: `a custom ID of button component`,
                        label: `A label to be displayed in button`,
                        style: Constants.ButtonStyles.SECONDARY,
                        emoji: {
                            id: null,
                            name: '✅'
                        }
                    }
                ]
            }
        ]
    })
    
    
    const collector = new InteractionCollector(client, msg.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000 // end collector after 30 seconds
        // I'd prefer to handle all interaction becuase it would cause interaction fail
        // filter: None
    })

    collector.on('collect', async (collectedInteraction) => {
        // defer interaction
        await collectedInteraction.defer(64)
        
        // handle filter
        if (collectedInteraction.member!.id !== message.author.id)
            await collectedInteraction.createFollowup({
                content: `Only message author can use this button!`,
                flags: 64
            })
        else {
            // since i didnt used filter, you can just add internal Collection cleanup or just use filter :>
            await collectedInteraction.createFollowup({
                content: `collected interaction: ${collectedInteraction.id}`,
                flags: 64
            })
            /*
            You can also do things like:
            
            await msg.edit({
                content: `edit original message`
            }) 
            
            or just acknowldge interaction without `.defer()` using `editParent`:
            
            await collectedInteraction.editParent({
                content: `also edits original message but also acknowledgs interaction`
            })
            */
        }
    })

    collector.on('end', (collectedInteractions) => {
        console.log(`collected ${collectedInteractions.length} interactions`)
    })
})
```

</details>
<details> 
<summary>CommonJS</summary>

```js 
const { MessageCollector } = require('manbo-collector')
const { Client, Constants } = require('manbo')

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    const msg = await message.channel.createMessage({
        content: 'An InteractionCollector',
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                    {
                        type: Constants.ComponentTypes.BUTTON,
                        custom_id: `a custom ID of button component`,
                        label: `A label to be displayed in button`,
                        style: Constants.ButtonStyles.SECONDARY,
                        emoji: {
                            id: null,
                            name: '✅'
                        }
                    }
                ]
            }
        ]
    })


    const collector = new InteractionCollector(client, msg.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000 // end collector after 30 seconds
        // I'd prefer to handle all interaction becuase it would cause interaction fail
        // filter: None
    })

    collector.on('collect', async (collectedInteraction) => {
        // defer interaction
        await collectedInteraction.defer(64)

        // handle filter
        if (collectedInteraction.member.id !== message.author.id)
        await collectedInteraction.createFollowup({
            content: `Only message author can use this button!`,
            flags: 64
        })
    else {
            // since i didnt used filter, you can just add internal Collection cleanup or just use filter :>
            await collectedInteraction.createFollowup({
                content: `collected interaction: ${collectedInteraction.id}`,
                flags: 64
            })
            /*
            You can also do things like:
            
            await msg.edit({
                content: `edit original message`
            }) 
            
            or just acknowldge interaction without `.defer()` using `editParent`:
            
            await collectedInteraction.editParent({
                content: `also edits original message but also acknowledgs interaction`
            })
            */
        }
    })

    collector.on('end', (collectedInteractions) => {
        console.log(`collected ${collectedInteractions.length} interactions`)
    })
})
```

</details>

<a name="awaitComponentInteractions"></a>
## awaitComponentInteractions

> A method to collect component interactions

**Parameters:**

- **_client:_** The client to apply in a method
    - Type: `Manbo.Client` (see more information
      in [Client](https://github.com/Manbo-js/manbo/blob/ba2f885e4d112f6c98726d6639b7503426639e35/lib/Client.js#L67))
    - Required: `true`
    

- **_options:_** Collect options

  |options|type|description|
  |------|---|---|
  |**dispose?**|boolean|Whether to dispose data when it's deleted.|
  |**idle?**|number|How long to stop the collecting method after inactivity in milliseconds.|
  |**time?**|number|How long to run the collecting method for in milliseconds|
  |**filter?**|function|The filter applied to this collecting method|
  |**componentType?**|[ComponentType](https://discord.com/developers/docs/interactions/message-components#component-object-component-types)|The type of components to listen for|

- **_Returns:_**

  `Promise<MappedComponentTypes[]>` (see more information in [MappedComponentTypes](https://github.com/Manbo-js/collector/commit/fce19260f7a3ce906095cf8ee325a41d3e3dee8a/src/structures/InteractionCollector.ts#L11))

**Examples:**
<details> 
<summary>ESM</summary>

```ts 
import { awaitMessages } from 'manbo-collector'
import { Client, Constants, Message } from 'manbo'

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message: Message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg: Message) => msg.author.id === message.author.id

    const collectedMessages = await awaitMessages(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    console.log(`collected ${collectedMessages.length} messages`)
})
```

</details>
<details> 
<summary>CommonJS</summary>

```js 
const { awaitMessages } = require('manbo-collector')
const { Client, Constants } = require('manbo')

const client = new Client("Bot BOT_TOKEN", {
    intents: Constants.Intents.all
})

client.on('messageCreate', async (message) => {
    // its only to show how collector can be used,
    // you need to configure your own message handler in oreder to use collector precisely

    // filter message, only collect original message author's message
    const filterFunction = (msg) => msg.author.id === message.author.id

    const collectedMessages = await awaitMessages(client, message.channel, {
        dispose: true, // delete data when collector ends
        idle: 10_000, // stop collector when there are no messaegs for 10 seconds
        max: 5, // collect max five messages
        time: 30_000, // end collector after 30 seconds
        filter: filterFunction
    })

    console.log(`collected ${collectedMessages.length} messages`)
})
```

</details>

<a name="Events"></a>
## Events

|name|callback params|description|
|---|---|---|
|collect|`collected` (The element collected)|Emitted whenever something is collected|
|dispose|`disposed` (The element disposed)|Emitted whenever something is disposed|
|ignored|`ignored` (The element ignored)|Emitted whenever something is ignored|
|end|`collected` (The data collected by the collector) <br>`reason` (The reason the collector has ended)|Emitted whenever the collector stops collecting|

**Example:**
```ts
collector.on('collect', (collected) => {
    console.log(`collected: ${collected}`)
})
collector.on('dispose', (disposed) => {
    console.log(`disposed: ${disposed}`)
})
collector.on('ignored', (ignored) => {
    console.log(`ignored: ${ignored}`)
})
collector.on('end', (collected, reason) => {
    console.log(`collector ended with reason: ${reason}`)
    console.log(`collected: ${collected}`)
})
```

<a name="Contribute"></a>
## Contribute

> **PRs are always welcomed! Feel free to submit PRs!**
