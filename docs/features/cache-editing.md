# Cache Editing in Admin Panel

This document provides an overview of the cache editing functionality available in the admin panel, including how to use it and important considerations.

## Features

- **View Cache Entries**: Browse and inspect cache entries with detailed information
- **Edit Cache Values**: Modify cached data using a JSON editor
- **Manage TTL**: Update the Time-To-Live for cache entries
- **Delete Entries**: Remove individual cache entries
- **Audit Logging**: Track all modifications to the cache

## Usage Guide

### Accessing Cache Management

1. Navigate to the Admin Panel
2. Select "Cache Management" from the sidebar
3. Browse the list of cache keys or use the search functionality

### Editing a Cache Entry

1. Locate the cache entry you want to edit
2. Click on the entry to view its details
3. Click the "Edit" button to enter edit mode
4. Make your changes in the JSON editor
5. Update the TTL if needed (in seconds)
6. Click "Save Changes" to apply your changes

### Deleting a Cache Entry

1. In the cache entry details view
2. Click the red "Delete" button
3. Confirm the deletion when prompted

### Understanding TTL (Time-To-Live)

- TTL is specified in seconds
- A TTL of 0 means the entry will never expire
- The maximum allowed TTL is 30 days (2,592,000 seconds)
- When editing an entry, the current remaining TTL is preserved by default

## Security Considerations

- Only administrators with the appropriate permissions can access cache management
- Some system cache keys (prefixed with `system:`) may be read-only
- All modifications are logged in the audit log
- Be cautious when modifying cache entries as it may affect application behavior

## Best Practices

1. **Test Changes**: Test cache modifications in a development environment first
2. **Document Changes**: Include comments in the JSON data when making complex changes
3. **Monitor Impact**: Keep an eye on application performance after making changes
4. **Use TTL Wisely**: Set appropriate TTL values to prevent stale data

## Troubleshooting

### Common Issues

- **Can't edit a cache entry**: Some system cache keys are read-only
- **Changes not persisting**: Ensure you clicked "Save Changes" and check for error messages
- **JSON validation errors**: The editor will highlight invalid JSON

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review the audit logs for details about the failed operation
3. Contact the development team with details of the issue

## API Reference

### Cache Context Methods

- `updateEntry(key: string, data: any, ttl: number)`: Update a cache entry
- `deleteEntry(key: string)`: Delete a cache entry
- `getEntryData(key: string)`: Get the data for a cache entry
- `getKeyTTL(key: string)`: Get the remaining TTL for a key
- `isEditableKey(key: string)`: Check if a key can be edited

### Audit Logging

All cache modifications are logged with the following information:
- Timestamp
- Action type (UPDATE/DELETE)
- Cache key
- User who performed the action
- Old and new values (for updates)
- TTL information

## Related Documentation

- [Cache Inspection](./cache-inspection.md)
- [Cache Architecture](../architecture/cache.md)
- [Admin Panel Guide](../user-guide/admin-panel.md)
