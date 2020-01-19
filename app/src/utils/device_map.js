import Immutable from "immutable";
import InteractiveObjectsTypes from "../interactives/InteractiveObjectsTypes.js"

const DeviceMap = Immutable.Map(
[
    [
        InteractiveObjectsTypes.BLIND,
        ["Blind"]
    ],
    [
        InteractiveObjectsTypes.DOOR,
        ["Door"]
    ],
    [
        InteractiveObjectsTypes.AIR_CONDITIONER,
        ["AirConditioner"]
    ],
    [
        InteractiveObjectsTypes.LIGHT,
        ["Light"]
    ],
    [
        InteractiveObjectsTypes.POWER_OUTLET,
        ["PowerOutlet"]
    ],
    [
        InteractiveObjectsTypes.DSWITCH,
        ["Switch"]
    ],
    [
        InteractiveObjectsTypes.SIREN,
        ["Siren"]
    ],
    [
        InteractiveObjectsTypes.MOTION_DETECTOR,
        ["MotionDetector"]
    ],
    [
        InteractiveObjectsTypes.SENSOR,
        ["Sensor"]
    ],
    [
        InteractiveObjectsTypes.SMOKE_DETECTOR,
        ["SmokeDetector"]
    ],
    [
        InteractiveObjectsTypes.SPEAKER,
        ["Speaker"]
    ],
]);


export default DeviceMap;
