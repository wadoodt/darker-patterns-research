# Notification Flow

This document outlines the notification system in the dashboard, from initial data fetch to real-time updates and user interactions.

## 1. Initial Notifications on Login

- **Endpoint**: `/api/users/me`
- **Context**: `AuthContext`

When a user logs in or their session is verified, the `AuthContext` fetches user data from the `/api/users/me` endpoint. This response includes up to 10 of the latest unread notifications.

These initial notifications are stored in the `AuthenticatedUser` object in the `AuthContext` state.

## 2. Displaying the Notification Indicator

- **Component**: `NotificationsDropdown`
- **Context**: `NotificationsContext`

The `NotificationsDropdown` component, located in the main header, consumes the `NotificationsContext`. The `NotificationsContext` is initialized with the notifications from the `AuthContext`.

If there are any unread notifications in this initial set, the bell icon in the `NotificationsDropdown` will display a badge, indicating to the user that they have new notifications.

## 3. Viewing and Interacting with Notifications

- **Action**: User clicks the bell icon.
- **Component**: `NotificationsDropdown`
- **Context**: `NotificationsContext`

When the user clicks the bell icon, the `NotificationsDropdown` opens. At this point, the `enable` function in the `NotificationsContext` is called. This triggers a fetch to the `/api/notifications` endpoint for the first page of notifications.

The notifications fetched from the API are then merged with the initial notifications from the `AuthContext`. The merging logic ensures that there are no duplicates.

The dropdown displays the combined list of notifications. The user can then:

- **Mark as Read**: Clicking on a notification marks it as read.
- **Mark All as Read**: A button is available to mark all notifications as read.
- **Load More**: If there are more pages of notifications, a "Load more" button is displayed.

## 4. Future Enhancements

- **Real-time Updates**: The current implementation relies on fetching notifications when the dropdown is opened. A future enhancement will be to implement real-time updates using WebSockets, so new notifications appear instantly without requiring a manual refresh.
- **Notification Grouping**: Grouping notifications by type or date could improve readability.
- **In-app Navigation**: Clicking a notification could navigate the user to the relevant page within the application.
