import { convertFromRaw, convertToRaw, ContentState } from 'draft-js';

const getIndicesOf = (searchStr, str, caseSensitive) => {
    let tempStr = str;
    let tempSearchStr = searchStr;
    const searchStrLen = tempSearchStr.length;
    if (searchStrLen === 0) {
        return [];
    }
    let startIndex = 0;
    let index;
    const indices = [];
    if (!caseSensitive) {
        tempStr = tempStr.toLowerCase();
        tempSearchStr = tempSearchStr.toLowerCase();
    }

    while ((index = tempStr.indexOf(tempSearchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
};

const getEntityRanges = (text, mentionName, mentionKey) => {
    const indices = getIndicesOf(mentionName, text);
    if (indices.length > 0) {
        return indices.map(offset => ({
            key: mentionKey,
            length: mentionName.length,
            offset
        }));
    }

    return null;
};

const createMentionEntities = (text, tags) => {
    const rawContent = convertToRaw(ContentState.createFromText(text));
    const rawState = tags.map(tag => ({
        type: 'mention',
        mutability: 'IMMUTABLE',
        data: {name: tag.name }
    }));
    rawContent.entityMap = [...rawState];

    rawContent.blocks = rawContent.blocks.map(block => {
        const ranges = [];
        tags.forEach((tag, index) => {
            const entityRanges = getEntityRanges(block.text, tag.name, index);
            if (entityRanges) {
                ranges.push(...entityRanges);
            }
        });

        return { ...block, entityRanges: ranges };
    });
    return convertFromRaw(rawContent);
};

export default {
    createMentionEntities: createMentionEntities,
    getIndicesOf: getIndicesOf,
};