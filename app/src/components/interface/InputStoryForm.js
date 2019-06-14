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
							<div className="form-inline">
								<div className="col-lg-12 form-group new-story-form">
									<label className="col-lg-6 col-form-label" htmlFor={"randomness"}>Casualit&agrave; (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="randomness" id="randomness" />
									<hr/>
									<label className="col-lg-6 col-form-label"  htmlFor={"image_1"}>Immagine 1</label>
									<input type="file" name="image_1" id="image_1" className={"fileUpload"}/>							
									<label className="col-lg-6 col-form-label"  htmlFor={"relevance_1"}>Rilevanza oggetti (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance_1" id="relevance_1"/>		
									<hr/>
									<label className="col-lg-6 col-form-label"  htmlFor={"image_2"}>Immagine 2</label>
									<input type="file" name="image_2" id="image_2" className={"fileUpload"} />							
									<label className="col-lg-6 col-form-label"  htmlFor={"relevance_2"}>Rilevanza oggetti (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance_2" id="relevance_2"/>
									<hr/>
									<label className="col-lg-6 col-form-label"  htmlFor={"image_3"}>Immagine 3</label>
									<input type="file" name="image_3" id="image_3" className={"fileUpload"} />							
									<label className="col-lg-6 col-form-label"  htmlFor={"relevance_3"}>Rilevanza oggetti (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance_3" id="relevance_3"/>
									<hr/>
									<label className="col-lg-6 col-form-label"  htmlFor={"image_4"}>Immagine 4</label>
									<input type="file" name="image_4" id="image_4" className={"fileUpload"} />							
									<label className="col-lg-6 col-form-label"  htmlFor={"relevance_4"}>Rilevanza oggetti (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance_4" id="relevance_4"/>							
									<hr/>
									<label className="col-lg-6 col-form-label"  htmlFor={"image_5"}>Immagine 5</label>
									<input type="file" name="image_5" id="image_5" className={"fileUpload"} />							
									<label className="col-lg-6 col-form-label"  htmlFor={"relevance_5"}>Rilevanza oggetti (1-10)</label>
									<input type="range" min="1" max="10" defaultValue="5" step="1" className={"slider"} name="relevance_5" id="relevance_5"/>
								</div>
							</div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary buttonConferm" onClick={()=>{
                                let name =Math.floor(Date.now()).toString(), randomness=document.getElementById("randomness").value, media = [], relevance = [];
								for(let i=1; i<= 5; i++) 
									if (document.getElementById("image_"+i).files[0] != null) {
										relevance.push(document.getElementById("relevance_"+i).value);
										media.push(document.getElementById("image_"+i).files[0]);
									}
								if(name) {
                                    addImageAndCreateStory(name, media, relevance, randomness);
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

function addImageAndCreateStory(name, media, relevance, randomness){
	
    let ext =[];
	let re = /(?:\.([^.]+))?$/;
	for(let i=0; i< media.length; i++)
		ext.push(re.exec(media[i].name)[1]);
	
    MediaAPI.addImageStory(name, media, ext, relevance, randomness);

}

export default InputStoryForm;