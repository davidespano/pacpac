export default class Item
{
    constructor(provider, json)
    {
        this.provider = provider;

        this.name = json.name;
        this.editable = json.editable;
        this.type = json.type;
        this.label = json.label;
        this.tags = json.tags;
        this.state = json.state;
        this.category = json.category;
        this.groups = json.groupNames;
        this.metadata = json.metadata;
        this.function = json.function;
    }

    async getState()
    {
        // - Return the item state by calling the openhab's api
        return await this.provider.get(`/items/${this.name}/state`, true);
    }

    async setState(state)
    {
        // - Send an action to openhab
        return await this.provider.put(`/items/${this.name}/state`, true, false, state);
    }

    async delete()
    {
        // - Call openhab to remove the item
        await this.provider.delete(`/items/${this.name}`);
    }

    async linkChannel(channel)
    {
        // - Call for the openhab link
        await this.provider.put(`/links/${this.name}/${channel.uid}`);
    }

    async unlinkChannel(channel)
    {
        // - Call the openhab api to delete the specified channel
        await this.provider.delete(`/links/${this.name}/${channel.uid}`);
    }

    async getConnectedChannels()
    {
        // - Gets all links from openhab
        var links = await this.provider.get("/links");

        // - Gets all links uid pointing to this item
        links = links.filter((x) => x.itemName === this.name)
                     .map((x) => x.channelUID);

        if (links.length > 0)
        {
            // - Gets all things from openhab
            var things = await this.provider.source.getThings();

            // - Gets only values exluding keys
            things = Object.values(things);

            // - Gets all the channels referenced by the links
            things = things.map((x) => Object.values(x.channels)).flat()
                           .filter((x) => links.includes(x.uid));

            return things;
        }

        return [];
    }

    getJson()
    {
        var ret =
        {
            name: this.name,
            "type": this.type,
            label: this.label,
            category: this.category,
            tags: this.tags,
            groupNames: this.groups,
            function: this.function,
            metadata: this.metadata
        };

        return ret;
    }
};
