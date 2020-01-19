import Item from "./item";

export default class ItemGroup extends Item
{
    constructor(provider, json, items)
    {
        super(provider, json);

        // - Internal properties
        this.groupType = json.groupType;

        // - Contains sub-group members
        this.members = [];

        for (var item of items)
        {
            // - If the item belongs to this group add it
            if (item.groupNames.includes(this.name))
            {
                if (item.type === "Group")
                    // - Check if the item itself it's a group and do it recursively
                    this.members.push(new ItemGroup(this.provider, item, items));
                else
                    // - Else just add the item
                    this.members.push(new Item(this.provider, item));
            }
        }
    }

    async addMember(member)
    {
        // - Call openhab to add the member to this group
        await this.provider.put(`/items/${this.name}/members/${member.name}`);

        // - Only after api call we can add the new member locally
        this.members.push(member);
    }

    async removeMember(member)
    {
        // - Call openhab to remove the member from this group
        await this.provider.delete(`/items/${this.name}/members/${member.name}`);

        // - Only after api call we can remove the member locally
        this.members.remove(member);
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
            groupType: this.groupType,
            function: this.function
        };

        return ret;
    }
};
