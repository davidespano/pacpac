import Immutable from "immutable";

const Story = Immutable.Record({

    name : "",
	img : "",
	relevance : 0,
	randomness : 0,
	systemStory : "",
	userStory : "",
	lastUpdate : "",

});

export default Story;
