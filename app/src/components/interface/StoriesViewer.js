import React from 'react';
import settings from '../../utils/settings';
import interface_utils from "./interface_utils";
import StoryAPI from "../../utils/StoryAPI";

const {mediaURL} = settings;
let path = `${mediaURL}${window.localStorage.getItem("gameID")}/story_editor/`;

function StoriesViewer(props){
    return (
					<div className="modal fade" id="view-story-modal" tabIndex="-1" role="dialog" aria-labelledby="view-story-modal-label" aria-hidden="true">
						<div className="modal-dialog modal-lg" role="document">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title" id="view-scene-modal-label">Le tue storie</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Riduci a icona">
									<span aria-hidden="true">&mdash;</span>
									</button>
								</div>
								<div className="modal-body modalOptions">
									<ul className={"stories-list"}>	
									{[...props.stories.values()].map(child => (
										<li key={child.name}>	
												<div className={"story-content"} >
													<textarea value={child.userStory ? child.userStory : child.systemStory} disabled={true}
													id={child.name + '_textarea'} readOnly={true} 
													/>
												</div>
										</li>
										 ))}
									</ul>		
								</div>					 
							</div>
						</div>
					</div>	
				)
}


export default StoriesViewer;