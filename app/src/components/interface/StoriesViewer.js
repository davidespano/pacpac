import React from 'react';
import settings from '../../utils/settings';
import interface_utils from "./interface_utils";
import StoryAPI from "../../utils/StoryAPI";
import ActionTypes from "../../actions/ActionTypes";

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
								{StoryList(props)}
								</div>					 
							</div>
						</div>
					</div>	
				)
}

function StoryList(props){
	if (props.stories.size > 0)
		return (
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
					);
	else
		return (
					<React.Fragment>
						<h4>Nessuna storia creata</h4>
						<button className={"btn"} href="#nav-story-editor" data-toggle="modal" data-dismiss="modal" 
						onClick={() => {handleSwitchToStoryEditorMode(props)}}>Crea storia
						</button>
					</React.Fragment>
					);
}

function handleSwitchToStoryEditorMode(props){
	if(props.editor.mode != ActionTypes.STORY_EDITOR_MODE_ON)
		{
		props.switchToStoryEditorMode();
		document.getElementById("nav-tabContent").hidden = true;
		document.getElementById("nav-objects-story-editor").className = "nav-item nav-link active";
		document.getElementById("nav-game-tab").className = "nav-item nav-link";
		}
}

export default StoriesViewer;