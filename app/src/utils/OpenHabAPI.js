import OpenHab from './openhab/openhab';
import Actions from "../actions/Actions";
import InteractiveObjectsTypes from '../interactives/InteractiveObjectsTypes';

var cache = null;

async function updateThings()
{
    var openHab = new OpenHab();
    var things = await openHab.getThings();

    things = Object.values(things);

    Actions.updateThings(things);
}

function refreshItemsCache()
{
    cache = null;
}

async function updateBinding(item, thing)
{
    var openHab = new OpenHab();

    var uuid = item.get('deviceUuid');
    var mapping = item.get('deviceStateMapping');
    var habitem = null;

    if (uuid !== thing)
    {
        var things = await openHab.getThings();

        if (uuid != "")
        {
            try
            {
                var oldThing = things[uuid];

                for (var i = 0; i < Object.values(mapping).length; i++)
                {
                    var binding = Object.values(mapping)[i];
                    var property = Object.keys(mapping)[i];

                    var items = await openHab.getItems(true);
                    var habitem = items[binding.itemid];

                    if (!habitem) continue;

                    for (let channel of binding.channel)
                    {
                        if (Object.keys(oldThing.channels).includes(channel))
                        {
                            await habitem.unlinkChannel(oldThing.channels[channel]);
                            await habitem.delete();
                        }
                    }

                    mapping[property].itemid = "";
                    mapping[property].deviceChannel = "";
                }

                item = item.set('deviceStateMapping', mapping);
                item = item.set('deviceUuid', "");

                if (thing == "") return item;
            }
            catch (e)
            {
                // - Print warning
            }
        }

        var currThing = things[thing];

        for (var i = 0; i < Object.values(mapping).length; i++)
        {
            var binding = Object.values(mapping)[i];
            var property = Object.keys(mapping)[i];

            // - Make a new item on openhab
            habitem = await openHab.addItem(
            {
                name: item.get('name') + property,
                editable: "true",
                "type": binding.type,
                metadata: {autoupdate: {value: "true", config: {}}},
                label: item.get('name') + " " + property,
                tags: []
            });

            var linkedChannelid = "";
            for (let channel of binding.channel)
            {
                if (Object.keys(currThing.channels).includes(channel))
                {
                    await habitem.linkChannel(currThing.channels[channel]);
                    linkedChannelid = currThing.channels[channel].id;
                    break;
                }
            }

            mapping[property].itemid = habitem.name;
            mapping[property].deviceChannel = linkedChannelid;
        }

        item = item.set('deviceStateMapping', mapping);
        item = item.set('deviceUuid', thing);
    }

    return item;
}

async function changeBind(obj, prop, targetId)
{
    var openHab = new OpenHab();

    var uuid = obj.get('deviceUuid');
    var mapping = obj.get('deviceStateMapping');
    var habitem = null;

    var things = await openHab.getThings();

    if (uuid !== "")
    {
            var thing = things[uuid];

            var items = await openHab.getItems(true);
            var habitem = items[mapping[prop].itemid];

            if (!habitem) return obj;


            if (Object.keys(thing.channels).includes(mapping[prop].deviceChannel))
            {
                var ch = thing.channels[mapping[prop].deviceChannel];
                await habitem.unlinkChannel(ch);
            }

            mapping[prop].deviceChannel = "";
            obj = obj.set('deviceStateMapping', mapping);

            if (Object.keys(thing.channels).includes(targetId))
            {
                await habitem.linkChannel(thing.channels[targetId]);

                mapping[prop].deviceChannel = targetId;
            }

            obj = obj.set('deviceStateMapping', mapping);
    }

    return obj;
}

async function updateInteractiveObj(obj)
{
    var openHab = new OpenHab();

    var uuid = obj.get('deviceUuid');
    var state = obj.get("properties").state;

    var items;
    if (cache != null) items = cache;
    else cache = items = await openHab.getItems(true);

    var changed = false;

    if (uuid !== "")
    {
        var bindings = obj.get("deviceStateMapping");
        var props = obj.get("properties");
        var nprops = {...props};
        nprops.state = {...props.state};
        props = nprops;

        if (state instanceof Object)
        {
            var keys = Object.keys(bindings);
            for (var i = 0; i < keys.length; i++)
            {
                var prop = keys[i];
                var value = bindings[keys[i]];

                if (!value) continue;

                var item = Object.values(items).find(x => x.name == value.itemid);

                if (!item)
                    continue;

                var currState = item.state;

                if (currState !== props.state[prop])
                    changed = true;

                props.state[prop] = decodeInValue(currState, prop);
            }
        }

        obj = obj.set('properties', props);
    }

    return obj;
}

async function commitInteractiveObj(obj, state, target)
{
    var openHab = new OpenHab();

    var uuid = obj.deviceUuid;

    var items = await openHab.getItems(true);

    if (uuid !== "")
    {
        var bindings = obj.deviceStateMapping;

        if (state instanceof Object)
        {
            var prop = target;
            var value = bindings[target];

            if (!value) return;

            var item = Object.values(items).find(x => x.name == value.itemid);

            if (item) await item.setState(encodeOutValue(state[prop]));
        }
        else
        {
            var item = Object.values(items).find(x => x.name == bindings.itemid);
            if (item) await item.setState(state);
        }
    }
}

function encodeOutValue(value)
{
    var outValue = ""
    switch (value) {
        case 'OPEN':
        case 'LOCKED':
            return 'ON';
        case 'CLOSED':
        case 'UNLOCKED':
            return 'OFF';
    }
    return "" + value;
}

function decodeInValue(value, prop)
{
    switch (prop) {
        case 'open': return value == "ON" ? "OPEN" : "CLOSED";
        case 'lock': return value == "ON" ? "LOCKED" : "UNLOCKED";
        case 'value':
        case 'volume': return value == "NULL" || value == "NONE" ? '0' : value;
        case 'color': return value == "NULL" || value == "NONE" ? '0,0,0' : value;
        case 'roller': return value;
        default:
            if (value === "NULL" || value === "NONE")
                return 'OFF';

            return value;
    }
}

export default {
    changeBind: changeBind,
    updateThings: updateThings,
    updateBinding: updateBinding,
    updateInteractiveObj: updateInteractiveObj,
    commitInteractiveObj: commitInteractiveObj,
    refreshItemsCache: refreshItemsCache
}
