import api from '../api';
import notifUtils from '../utils/notifications';
import { getIcon } from '../icons';
import nanoid from 'nanoid';
import onFailError from '../utils/onFailError';
import { readLocalFile } from '../utils/upload';
import icons from '../icons-svg';
import getMess from '../translations';
import { normalizeResource } from '../utils/common';

const label = 'upload';

async function handler(apiOptions, actions) {
    const {
        navigateToDir,
        updateNotifications,
        getResource,
        getNotifications
    } = actions;

    const getMessage = getMess.bind(null, apiOptions.locale);

    const notificationId = label;
    const notificationChildId = nanoid();
    const prevResourceId = getResource().id;

    const onStart = ({ files }) => {
        var newChildren;
        const notifications = getNotifications();
        const notification = notifUtils.getNotification(notifications, notificationId);
        files.forEach((file)=>{
            const childElement = {
                elementType: 'NotificationProgressItem',
                elementProps: {
                    title: file.name,
                    progress: 0,
                    icon: getIcon({ name: file.name })
                }
            };

            newChildren =
                notifUtils.addChild(( notification && notification.children) || newChildren|| [], file.id, childElement);
        });
        if(newChildren) {
            const newNotification = {
                title: newChildren.length > 1 ?
                    getMessage('uploadingItems', {quantity: newChildren.length}) :
                    getMessage('uploadingItem'),
                children: newChildren
            };

            const newNotifications = notification ?
                notifUtils.updateNotification(notifications, notificationId, newNotification) :
                notifUtils.addNotification(notifications, notificationId, newNotification);

            updateNotifications(newNotifications);
        }
    };

    const onProgress = id => progress => {
        const notifications = getNotifications();
        const notification = notifUtils.getNotification(notifications, notificationId);
        const child = notifUtils.getChild(notification.children, id);
        const newChild = {
            ...child,
            element: {
                ...child.element,
                elementProps: {
                    ...child.element.elementProps,
                    progress
                }
            }
        };
        const newChildren = notifUtils.updateChild(notification.children, id, newChild);
        const newNotifications = notifUtils.updateNotification(notifications, notificationId, { children: newChildren });
        updateNotifications(newNotifications);
    };

    const resource = getResource();
    try {
        var newResource;
        const files = await readLocalFile(true);
        onStart({ files });
        for (var i = 0; i < files.length; i++) {
            const response = await api.uploadFileToId({apiOptions, parentId: resource.id, file:files[i], onProgress: onProgress(files[i].id)});
            newResource = normalizeResource(response.body[0]);
            const notifications = getNotifications();
            const notification = notifUtils.getNotification(notifications, notificationId);
            const notificationChildrenCount = notification.children.length;
            let newNotifications;
            if (notificationChildrenCount > 1) {
                newNotifications = notifUtils.updateNotification(
                    notifications,
                    notificationId, {
                        title: notification.children.length-1 > 1 ?
                            getMessage('uploadingItems', {quantity: notification.children.length-1}) :
                            getMessage('uploadingItem'),
                        children: notifUtils.removeChild(notification.children, files[i].id)
                    }
                );
            } else {
                newNotifications = notifUtils.removeNotification(notifications, notificationId);
            }
            updateNotifications(newNotifications);
            if (prevResourceId === resource.id && newResource) {
                navigateToDir(resource.id, newResource.id, false);
            }
        }
    } catch (err) {
        onFailError({
            getNotifications,
            label: getMessage(label),
            notificationId,
            updateNotifications
        });
        console.log(err)
    }
}

export default (apiOptions, actions) => {
    const localeLabel = getMess(apiOptions.locale, label);
    const { getResource } = actions;
    return {
        id: label,
        icon: { svg: icons.fileUpload },
        label: localeLabel,
        shouldBeAvailable: (apiOptions) => {
            const resource = getResource();
            if (!resource || !resource.capabilities) {
                return false
            }
            return resource.capabilities.canAddChildren
        },
        availableInContexts: ['files-view', 'new-button'],
        handler: () => handler(apiOptions, actions)
    };
}