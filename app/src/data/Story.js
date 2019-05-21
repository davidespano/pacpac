import Immutable from "immutable";

const Story = Immutable.Record({

    genre : "", //senza estensione
	uuid: "",
	systemStory: "",
	userStory: "",
	lastUpdate: "",
});

export default Story;