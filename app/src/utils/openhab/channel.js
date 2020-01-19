export default class Channel
{
    constructor(provider, data)
    {
        this.provider = provider;

        this.uid = data.uid;
        this.id = data.id;
        this.typeUid = data.channelTypeUID;
        this.item = data.itemType;
        this.kind = data.kind;
        this.label = data.label;
        this.description = data.description;
        this.tags = data.defaultTags;
        this.properties = data.properties;
        this.configuration = data.configuration;
    }
};
