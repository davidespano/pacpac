import Channel from "./channel";

export default class Thing
{
    constructor(provider, data, typeData)
    {
        this.provider = provider;

        this.label = data.label;
        this.bridge = data.bridgeUID;
        this.configuration = data.configuration;
        this.properties = data.properties;
        this.uid = data.UID;
        this.type = typeData;
        this.editable = data.editable;
        this.location = data.location;
        this.status = data.statusinfo;
        this.firmware = data.firmwareStatus;

        // - Handle channels
        this.channels = {}
        for (var channel of data.channels)
            this.channels[channel.id] = new Channel(this.provider, channel)
    }
};
