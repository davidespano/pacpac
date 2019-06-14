import React from 'react';
import settings from '../../utils/settings';
import interface_utils from "./interface_utils";
import InputStoryForm from './InputStoryForm';
import StoryAPI from "../../utils/StoryAPI";
import moment from 'moment';

const {mediaURL} = settings;

function StoryEditor(props) {

    if (props.storyCollections.count()) {
        return (
            <div className={'story-editor-container'}>
                <div className={"collection"}>
                    <ol className={"collection-list"}>
                        {[...props.storyCollections.values()].map(collection => (
                            CollectionItem(props, collection)
                        ))}
                    </ol>
                </div>
                {Foot(props)}
            </div>
        )
    } else {
        return (
            <div className={'story-editor-container'}>
                <div className={"collection"}>
                    <h1>Nessuna immagine inserita</h1>
                </div>
                {Foot(props)}
            </div>
        )
    }
}


function CollectionItem(props, collection) {

    const c_img = [];
    const allImages = Object.values(collection.images).flat();
    allImages.map(img_uuid => {
        let img = props.storyImages.get(img_uuid);
        c_img.push(img);
    });

    const c_stories = [];
    const allStories = Object.values(collection.stories).flat();
    allStories.map(story_uuid => {
        let story = props.stories.get(story_uuid);
        c_stories.push(story);
    });
    return (
        <li key={collection.name}>
            <div className={"collection-container"}>
                <div className={"topstory"}>
                    <label
                        htmlFor={collection.name + '_randomness'}>Casualit&agrave;: <span>{collection.randomness}</span></label>
                    <input type="range"
                           min="1" max="10" value={collection.randomness} step="1"
                           className={"slider"} name={collection.name + '_randomness'}
                           id={collection.name + '_randomness'}
                           onChange={() => {
                               let randomness = document.getElementById(collection.name + '_randomness').value;
                               StoryAPI.changeRandomness(collection, randomness, c_img, c_stories);
                           }}
                    />
                </div>
                <div className={"leftstory"}>
                    {c_img.map(img => (
                        <Images
                            collection={collection}
                            c_img={c_img}
                            c_stories={c_stories}
                            key={img.uuid}
                            img={img}
                        />
                    ))}
                </div>
                <div className={"rightstory"}>
                    <ol className={"stories-list"}>
                        {c_stories.map(story => (
                            <Stories
                                editing={props.editStories}
                                collection={collection}
                                startEditingStory={props.startEditingStory}
                                stopEditingStory={props.stopEditingStory}
                                onEditStory={props.onEditStory}
                                story={story}
                                key={story.uuid}
                                c_img={c_img}
                            />
                        ))}
                    </ol>
                </div>
            </div>
        </li>
    );
}

function UserUpdate(collection) {
    if (collection.userStory && collection.lastUpdate) {
        return (
            <span>
					<img src={"icons/user.png"} alt="Utente"/>
					Ultima modifica: {moment(collection.lastUpdate).format("DD/MM/YYYY - HH:mm")}
					</span>
        )
    }
}

function Foot(props) {
    return (
        <div className={"foot"}>
            <InputStoryForm {...props} />
            <button title={"Aggiungi immagine"} className={"btn btn-success"} data-toggle="modal"
                    data-target="#add-story-modal">+
            </button>
        </div>
    )
}

function Images(props) {
    let path = `${mediaURL}${window.localStorage.getItem("gameID")}/`;
    const {img, c_img, c_stories, collection} = props;
    return (
        <div key={img.uuid}>
            <img
                src={path + img.name}
                alt={img.name}
            />
            <label htmlFor={img.name + '_relevance'}>Rilevanza oggetti: <span>{img.relevance}</span></label>
            <input type="range"
                   min="1" max="10" value={img.relevance} step="1"
                   className={"slider"} name={img.name + '_relevance'} id={img.name + '_relevance'}
                   onChange={() => {
                       let value = document.getElementById(img.name + '_relevance').value;
                       StoryAPI.changeRelevance(collection, img, value, c_img, c_stories);
                   }}
            />
        </div>
    )
}

function Stories(props) {

    const {editing, story} = props;
    const isEditing = (editing === story.uuid);
    const startEditingStory = () => props.startEditingStory(story.uuid);
    let input = null;

    if (isEditing) {
        const onChange = (event) => props.onEditStory(story.uuid, event.target.value);
        const stopEditingStory = () => props.stopEditingStory;

        input =
            <textarea
                className="edit"
                id={story.uuid + '_tmp_textarea'}
                value={story.userStory ? story.userStory : story.systemStory}
                onBlur={() => {
                    {
                        let content = document.getElementById(story.uuid + '_tmp_textarea').value;
                        StoryAPI.editStory(story, content, Math.floor(Date.now()));
                        props.stopEditingStory();
                    }
                }}
                onChange={onChange}
            />;
    }

    return (
        <div key={story.uuid}>
            <li className={isEditing ? 'editing' : ''}>
                <div className={"story-header"}>
                    <span>{story.genre.toUpperCase()}</span>
                    {story.userStory && story.lastUpdate ?
                        <a href="#" onClick={() => {
                            StoryAPI.restoreSystemStory(story)
                        }}>
                            <img src={"icons/icons8-reboot-filled-50.png"} alt="Ripristina storia"/>
                        </a> : ''}
                    <a href="#" onClick={() => {
                        if (props.collection.stories.length > 1)
                            StoryAPI.deleteStory(props.collection, story)
                        else
                            StoryAPI.deleteCollection(props.collection, props.c_img)
                    }}>
                        <img src={"icons/icons8-delete-filled-50.png"} alt="Cancella storia"/>
                    </a>
                </div>
                <div className={"view"}>
								<textarea value={story.userStory ? story.userStory : story.systemStory}
                                          id={story.uuid + '_textarea'}
                                          onClick={startEditingStory}
                                />
                </div>
                {input}
                {UserUpdate(story)}
            </li>
        </div>
    )
}

export default StoryEditor;