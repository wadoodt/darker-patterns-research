# Survey Tour Persistence Documentation

## Overview

The survey tour system ensures the driver.js tour is displayed only once per device/browser across multiple survey sessions. The tour completion status is stored in the browser's localStorage and persists until the user clears their browser data. This approach works perfectly for anonymous surveys where users don't have accounts.

## Implementation Details

### Device-Based Tracking

- **Simple Approach**: No user ID required - just track if tour has been completed on this device/browser
- **Storage Key**: Single key `survey_tour_completed` in localStorage
- **Value**: `"true"` when tour has been completed, removed when reset

### Storage Mechanism

- **Tour Completion**: Stored in localStorage using the key `survey_tour_completed`
- **Anonymous Friendly**: Works for both anonymous and authenticated users
- **Device Persistent**: Tour completion persists across browser sessions on the same device

### Key Components

#### `useSurveyTour` Hook (`src/hooks/useSurveyTour.ts`)

- Manages tour instance creation and state
- Checks localStorage for tour completion status (device-based)
- Provides methods to start, skip, and reset tours
- Returns `shouldShowTour` boolean for conditional rendering
- No user ID dependency - works for anonymous users

#### `EntryReviewStepContent` Component

- Uses the `shouldShowTour` property instead of local state
- Automatically starts tour when first entry loads (if not previously completed on this device)
- Tour starts with a 500ms delay to ensure DOM is ready

### Testing Tools

#### `TourControls` Component (`src/components/survey/TourControls.tsx`)

A development-only utility component that provides:

- Tour completion status display
- Manual tour start button
- Tour reset button for testing (device-based)

To use for testing:

1. Uncomment the import in `EntryReviewStepContent.tsx`
2. Uncomment the `<TourControls />` component in the return statement
3. The controls will only appear in development mode

## Usage

### For Developers

```typescript
import { useSurveyTour } from '@/hooks/useSurveyTour';

const { startTour, shouldShowTour, resetTourForCurrentDevice } = useSurveyTour();

// Check if tour should be shown
if (shouldShowTour) {
  // Show tour trigger or start automatically
  startTour();
}

// Reset tour for testing (development only)
resetTourForCurrentDevice();
```

### User Experience

1. **First Visit**: User sees the complete driver.js tour when they reach the evaluation step
2. **Subsequent Visits**: Tour is skipped automatically on the same device, even if they:
   - Refresh the page
   - Close and reopen the browser
   - Start a new survey session
   - Complete multiple surveys
   - Use anonymous participation

### Production Considerations

1. **No User Authentication Required**: Works perfectly for anonymous surveys
2. **Remove Debug Logging**: The console.warn statements can be removed in production
3. **Remove TourControls**: Comment out or remove the TourControls component
4. **Error Handling**: Graceful fallbacks included for localStorage access failures

### Storage Keys

- `survey_tour_completed`: Stores tour completion status for this device/browser

### Browser Compatibility

- Uses standard localStorage API (supported in all modern browsers)
- Gracefully handles cases where localStorage is unavailable
- SSR-safe implementation with proper window checks

## Debugging

Enable development mode to see debug information:

- User ID in console
- Tour start/skip decisions
- Tour completion status

## Future Enhancements

1. **Server-side Storage**: Store tour completion in user profiles for authenticated users
2. **Tour Versioning**: Allow showing updated tours when content changes significantly
3. **Analytics**: Track tour completion rates and user behavior
4. **Multiple Tours**: Support different tours for different sections
5. **Cross-Device Sync**: For authenticated users, sync tour completion across devices
