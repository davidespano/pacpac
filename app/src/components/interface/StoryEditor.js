import React from 'react';
import settings from '../../utils/settings';
import interface_utils from "./interface_utils";
import InputStoryForm from './InputStoryForm';
import StoryAPI from "../../utils/StoryAPI";
import moment from 'moment';

const {mediaURL} = settings;

StoryAPI.getAllStories();

function StoryEditor(props){
	if (props.stories.count()) {
    return (
        <div className={'story-editor-container'}>
			<div className={"story"}>
				<ol className={"story-list"}>	
					{[...props.stories.values()].map(child => (
						<StoryItem
							key = {child.name}
							editing= {props.editStories}
							child = {child}
							startEditingStory={props.startEditingStory}
							stopEditingStory={props.stopEditingStory}		
							onEditStory={props.onEditStory}
						/>
					 ))}
				</ol>
			</div>	
			{Foot(props)}
        </div>
    )
		}
	else {
		return (
	        <div className={'story-editor-container'}>
			<div className={"story"}>
			<h1>Nessuna immagine inserita</h1>
			</div>	
			{Foot(props)}
        </div>	
		)
		}
}

function StoryItem (props) {
	
	let path = `${mediaURL}${window.localStorage.getItem("gameID")}/story_editor/`;
	const {editing, child} = props;
	const isEditing = (editing === child.name);
	const startEditingStory = () => props.startEditingStory(child.name);	
	let input = null;
	
	if (isEditing) {
		const onChange = (event) => props.onEditStory(child.name, event.target.value);
		const stopEditingStory = () => props.stopEditingStory;	
		
		input =
		  <textarea
			className="edit"
			id={child.name + '_tmp_textarea'} 
			value={child.userStory ? child.userStory : child.systemStory}
			onBlur={() => { 
								{let content = document.getElementById(child.name + '_tmp_textarea').value;
									StoryAPI.editUserStory(child, content, Math.floor(Date.now()));
									props.stopEditingStory();
									}}}
			onChange={onChange}
		  />;
	}

	return (
				<li className={isEditing ? 'editing' : ''}>
					<div className={"story-container"}>							
						<div className={"rightbutton"}> { child.userStory && child.lastUpdate ? 
							<a href="#" onClick={() => {StoryAPI.restoreSystemStory(child)}}>
							<img src={"icons/restore-story.png"} alt="Ripristina storia"/>
							</a> : ''}	
							<a href="#" onClick={() => {StoryAPI.deleteStory(child)}}>
							<img src={"icons/delete-story.png"} alt="Cancella storia"/>
							</a>
						</div>
						<div className={"leftstory"}>
							<img
								src={path + child.img}
								alt={child.name}
							/>
							<label htmlFor={child.name + '_relevance'}>Object relevance: <span>{child.relevance}</span></label>
							<input type="range" 
								min="1" max="10" value={child.relevance} step="1" 
								className={"slider"} name={child.name + '_relevance'} id={child.name + '_relevance'}
								onChange={() => { 
									let value = document.getElementById(child.name + '_relevance').value; 
									StoryAPI.changeStoryParameters(child, 'relevance', value);}}
							/>
							<label htmlFor={child.name + '_randomness'}>Randomness: <span>{child.randomness}</span></label>
							<input type="range"
								min="1" max="10"value={child.randomness} step="1" 
								className={"slider"} name={child.name + '_randomness'} id={child.name + '_randomness'}
								onChange={() => { 
									let value = document.getElementById(child.name + '_randomness').value; 
									StoryAPI.changeStoryParameters(child, 'randomness', value);}}								
							/>
						</div>
						<div className={"rightstory"}>	
							<div className={"view"} >
								<textarea value={child.userStory ? child.userStory : child.systemStory} 
										id={child.name + '_textarea'} 
										onClick={startEditingStory}
								/>
							</div>
							{input}
							{UserUpdate(child)}
						</div>
					</div>	
				</li>
				);
}

function UserUpdate(child){
	if (child.userStory && child.lastUpdate) {
		return(
					<span>
					<img src={"icons/user.png"} alt="Utente" />
					Ultima modifica: {moment(child.lastUpdate).format("DD/MM/YYYY - HH:mm")}
					</span>
				  )
					}
}

function Foot(props){
	
	return (
				<div className={"foot"}>
					<InputStoryForm {...props} />
					<button title={"Aggiungi immagine"} className={"btn btn-success"} data-toggle="modal" data-target="#add-story-modal">+</button>
				</div>	
				)	
}

export default StoryEditor;