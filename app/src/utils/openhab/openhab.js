import Provider from "./provider";
import ItemGroup from "./itemgroup";
import Thing from "./thing";
import Item from "./item";

export default class OpenHab
{
    constructor(ip = '127.0.0.1', port = 8080)
    {
        this.provider = new Provider(ip, port);
        this.provider.source = this;
    }

    async getItems(recursive = false)
    {
        // - Get the list of all items regitered in openhab
        var items = await this.provider.get("/items");

        var retItems = {}

        for (var item of items)
        {
            if (item.type === "Group")
                // - Check if the item itself it's a group and do it recursively
                retItems[item.name] = new ItemGroup(this.provider, item, items);
            else if (recursive || item.groupNames.length == 0)
                // - Else just add the item only if we want a plain list
                retItems[item.name] = new Item(this.provider, item);
        }

        return retItems;
    }

    async addItem(data)
    {
        // - Create an instance of item wrapper
        var item = new Item(this.provider, data);

        // - Call openhab to add the member to this group
        await this.provider.put(`/items/${item.name}`, false, true, item.getJson());
        await this.provider.put(`/items/${item.name}/metadata/autoupdate`, false, true,
        {
            value: true,
            config: {}
        });

        return item;
    }

    async addItemGroup(data)
    {
        // - Create an instance of item group wrapper
        var item = new ItemGroup(this.provider, data, []);

        // - Call openhab to add the member to this group
        await this.provider.put(`/items/${item.name}`, false, true, item.getJson());

        return item;
    }

    async addItems(data)
    {
        if (!Array.isArray(data))
            data = [data];

        var rest = [];
        var items = [];
        for (var d of data)
        {
            // - Make the item instance
            var item = new Item(this.provider, d);

            // - Push the rest data
            rest.push(item.getJson())

            // - Push the return data
            items.push(item);
        }

        // - Call openhab to add the member to this group
        await this.provider.put(`/items`, false, true, rest);

        return items;
    }

    async getThings()
    {
        // - Get the list of all things regitered in openhab
        var things = await this.provider.get("/things");

        var retItems = {}
        for (var thing of things)
        {
            var typeData = await this.provider.get("/thing-types/" + thing.thingTypeUID);

            retItems[thing.UID] = new Thing(this.provider, thing, typeData);
        }

        return retItems;
    }

    async getExtensions()
    {
        // - Gets the complete list of extensions from openhab
        var extensions = await this.provider.get("/extensions");


    }
};
