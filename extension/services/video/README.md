# Video Service

YouTube video detection and player interaction utilities.

## Modules

### `detector.js`

-   Extract video ID from URL
-   Detect if on video page
-   Get current video ID

### `player.js`

-   Get player element
-   Get current playback time
-   Control playback (seek, pause, play)

## Usage

```javascript
import { getCurrentVideoId, isVideoPage } from "./services/video/detector.js";
import { getCurrentTime, seekTo } from "./services/video/player.js";

if (isVideoPage()) {
    const videoId = getCurrentVideoId();
    const currentTime = getCurrentTime();

    // Seek to 30 seconds
    seekTo(30);
}
```
