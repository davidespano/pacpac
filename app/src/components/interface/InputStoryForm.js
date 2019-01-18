import React from 'react';
import MediaAPI from "../../utils/MediaAPI";
import StoryAPI from "../../utils/StoryAPI";

function InputStoryForm(props){
    return(
        <div id={"addStoryDiv"}>
            <div className="modal fade" id="add-story-modal" tabIndex="-1" role="dialog" aria-labelledby="add-story-modal-label" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="add-scene-modal-label">Nuova Storia</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body modalOptions">
							<label htmlFor={"relevance"}>Rilevanza oggetti (1-10):</label>
							<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance" id="relevance"/>
							<label htmlFor={"randomness"}>Casualit&agrave; (1-10):</label>
							<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="randomness" id="randomness" />
							<label htmlFor={"Image"}>Immagine</label>
                            <input type="file"
                                   name="image"
                                   id="image"
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={()=>{
                                let name =Math.floor(Date.now()), relevance=document.getElementById("relevance").value, randomness=document.getElementById("randomness").value,
								systemStory="We were barely able to catch the breeze at the beach, and it felt as if someone stepped out of my mind. She was in love with him for the first time in months, so she had no intention of escaping. The sun had risen from the ocean, making her feel more alive than normal. She's beautiful, but the truth is that I don't know what to do. The sun was just starting to fade away, leaving people scattered around the Atlantic Ocean. I'd seen the men in his life, who guided me at the beach once more.",
								media = document.getElementById("image").files[0];
								if(name) {
                                    addImageAndCreateStory(name,
                                        media, systemStory,
                                        relevance, randomness
                                    );
                                }
                            }
                            } data-dismiss="modal" >Conferma</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function addImageAndCreateStory(name, media, systemStory, relevance, randomness){

    let re = /(?:\.([^.]+))?$/;
    let ext = re.exec(media.name)[1];
    name = name + "." + ext;
	
    MediaAPI.addImageStory(name, media, systemStory, relevance, randomness);

}

export default InputStoryForm;