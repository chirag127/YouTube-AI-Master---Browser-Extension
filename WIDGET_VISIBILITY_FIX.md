# Widget Visibility Fix

## Problem

The sidebar widget was intermittently showing and hiding when navigating between YouTube videos. Sometimes it would appear, sometimes it wouldn't.

## Root Cause

The code was checking for widget **existence** in the DOM but not widget **visibility**. When YouTube's SPA navigation occurred, the widget element could still exist in the DOM but be:

-   Hidden (display: none, visibility: hidden, opacity: 0)
-   Displaced from its correct position
-   In the wrong parent container

The early return logic would skip re-injection if the widget element existed, even if it wasn't actually visible to the user.

## Solution

Added a comprehensive visibility check function `isWidgetProperlyVisible()` that verifies:

1. Widget exists in DOM
2. Widget is visible (not hidden by CSS)
3. Widget has the correct parent container (secondary column)
4. Widget is positioned at the top of its parent

## Files Modified

### 1. `extension/content/utils/dom.js`

Added `isWidgetProperlyVisible()` function that performs comprehensive visibility checks.

### 2. `extension/content/core/observer.js`

-   Replaced simple existence checks with visibility checks
-   Now re-injects widget if it exists but is not properly visible
-   Updated both `checkCurrentPage()` and the MutationObserver logic

### 3. `extension/content/ui/widget.js`

-   Updated `injectWidget()` to use visibility check instead of simple existence check
-   Widget is now removed and re-injected if it exists but is not properly visible

## Result

The widget will now consistently appear and remain visible when navigating between YouTube videos, as it properly detects and corrects visibility issues.
