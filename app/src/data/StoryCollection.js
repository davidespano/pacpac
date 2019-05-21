import Immutable from "immutable";

const StoryCollection = Immutable.Record({

    name : "", //senza estensione
	randomness : 0,
	uuid: "",
	images : [],	
	stories: [],
});

export default StoryCollection;
