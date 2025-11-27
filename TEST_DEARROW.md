# Testing DeArrow Integration

## Quick Tests

### Test 1: DeArrow API Direct Call

Open browser console and run:

```javascript
// Test DeArrow API
const testVideoId = "dQw4w9WgXcQ"; // Rick Astley - Never Gonna Give You Up

// Standard API
fetch(
    `https://sponsor.ajay.app/api/branding?videoID=${testVideoId}&service=YouTube`
)
    .then((res) => res.json())
    .then((data) => {
        console.log("DeArrow Data:", data);
        console.log("Titles:", data.titles);
        console.log("Best Title:", data.titles[0]?.title);
    })
    .catch((err) => console.error("Error:", err));
```

### Test 2: Privacy-Preserving API

```javascript
// Generate SHA256 hash prefix
async function testPrivateAPI(videoId) {
    const encoder = new TextEncoder();
    const data = encoder.encode(videoId);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    const prefix = hashHex.substring(0, 4);

    console.log("Video ID:", videoId);
    console.log("SHA256 Prefix:", prefix);

    const response = await fetch(
        `https://sponsor.ajay.app/api/branding/${prefix}?service=YouTube`
    );
    const data = await response.json();

    console.log("Private API Response:", data);
    console.log("Data for our video:", data[videoId]);
}

testPrivateAPI("dQw4w9WgXcQ");
```

### Test 3: Extension Integration

In YouTube page console (after extension loads):

```javascript
// Test metadata extraction with DeArrow
async function testMetadataExtraction() {
    // Get current video ID
    const videoId = new URLSearchParams(window.location.search).get("v");

    if (!videoId) {
        console.error("No video ID found");
        return;
    }

    console.log("Testing video:", videoId);

    // Import metadata extractor
    const { default: metadataExtractor } = await import(
        chrome.runtime.getURL("content/metadata/extractor.js")
    );

    // Extract with DeArrow
    const metadata = await metadataExtractor.extract(videoId, {
        useDeArrow: true,
        usePrivateDeArrow: true,
    });

    console.log("=== Metadata Extraction Results ===");
    console.log("Video ID:", metadata.videoId);
    console.log("Has DeArrow Data:", metadata.hasDeArrowTitle);
    console.log("DeArrow Title:", metadata.deArrowTitle);
    console.log("Original Title:", metadata.originalTitle);
    console.log("Final Title (used):", metadata.title);
    console.log("Author:", metadata.author);
    console.log(
        "Description:",
        metadata.description?.substring(0, 100) + "..."
    );

    if (metadata.deArrowThumbnail) {
        console.log("DeArrow Thumbnail:", metadata.deArrowThumbnail);
    }
}

testMetadataExtraction();
```

### Test 4: Compare Titles

```javascript
// Compare original vs DeArrow titles
async function compareTitles(videoId) {
    // Get original title from DOM
    const originalTitle = document.querySelector(
        "h1.ytd-watch-metadata yt-formatted-string"
    )?.textContent;

    // Get DeArrow title
    const response = await fetch(
        `https://sponsor.ajay.app/api/branding?videoID=${videoId}&service=YouTube`
    );

    if (response.ok) {
        const data = await response.json();
        const deArrowTitle = data.titles?.[0]?.title;

        console.log("=== Title Comparison ===");
        console.log("Original:", originalTitle);
        console.log("DeArrow:", deArrowTitle);
        console.log(
            "Improvement:",
            deArrowTitle ? "Yes ✅" : "No DeArrow data ❌"
        );
    } else {
        console.log("No DeArrow data available for this video");
    }
}

// Test with current video
const videoId = new URLSearchParams(window.location.search).get("v");
compareTitles(videoId);
```

### Test 5: Thumbnail Generation

```javascript
// Test thumbnail generation
async function testThumbnail(videoId, timestamp = 60) {
    const url = `https://dearrow-thumb.ajay.app/api/v1/getThumbnail?videoID=${videoId}&time=${timestamp}`;

    console.log("Fetching thumbnail from:", url);

    const response = await fetch(url);

    if (response.status === 204) {
        console.log("❌ Thumbnail generation failed");
        console.log("Reason:", response.headers.get("X-Failure-Reason"));
    } else if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        console.log("✅ Thumbnail generated successfully");
        console.log("Size:", blob.size, "bytes");
        console.log("Type:", blob.type);

        // Display thumbnail
        const img = document.createElement("img");
        img.src = objectUrl;
        img.style.cssText =
            "position:fixed;top:10px;right:10px;z-index:9999;border:3px solid red;";
        document.body.appendChild(img);

        console.log("Thumbnail displayed in top-right corner");
    }
}

// Test with current video at 60 seconds
const videoId = new URLSearchParams(window.location.search).get("v");
testThumbnail(videoId, 60);
```

## Test Videos

### Videos with Good DeArrow Data

1. **Popular Tech Videos**

    - Often have clickbait titles replaced with descriptive ones
    - Example: "This Changes EVERYTHING!" → "New JavaScript Framework Comparison"

2. **Tutorial Videos**

    - Clickbait replaced with actual tutorial content
    - Example: "You're Doing It WRONG!" → "Common CSS Mistakes and Solutions"

3. **News/Commentary**
    - Sensational titles replaced with factual descriptions
    - Example: "SHOCKING Truth Revealed!" → "Analysis of Recent Policy Changes"

### Test Cases

```javascript
const testVideos = [
    "dQw4w9WgXcQ", // Popular music video
    "jNQXAC9IVRw", // "Me at the zoo" - first YouTube video
    // Add more video IDs to test
];

async function testMultipleVideos(videoIds) {
    for (const videoId of videoIds) {
        console.log(`\n=== Testing ${videoId} ===`);

        const response = await fetch(
            `https://sponsor.ajay.app/api/branding?videoID=${videoId}&service=YouTube`
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Has DeArrow data:", !!data.titles?.length);
            if (data.titles?.length) {
                console.log("Best title:", data.titles[0].title);
                console.log("Votes:", data.titles[0].votes);
                console.log("Locked:", data.titles[0].locked);
            }
        } else if (response.status === 404) {
            console.log("No DeArrow data available");
        } else {
            console.log("Error:", response.status);
        }

        // Wait a bit between requests
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
}

testMultipleVideos(testVideos);
```

## Expected Results

### Successful DeArrow Fetch

```
=== Metadata Extraction Results ===
Video ID: dQw4w9WgXcQ
Has DeArrow Data: true
DeArrow Title: Rick Astley - Never Gonna Give You Up (Official Music Video)
Original Title: Rick Astley - Never Gonna Give You Up (Official Video)
Final Title (used): Rick Astley - Never Gonna Give You Up (Official Music Video)
Author: Rick Astley
Description: The official video for "Never Gonna Give You Up"...
```

### No DeArrow Data

```
=== Metadata Extraction Results ===
Video ID: xyz123
Has DeArrow Data: false
DeArrow Title: null
Original Title: Some Video Title
Final Title (used): Some Video Title
Author: Channel Name
```

## Debugging

### Enable Verbose Logging

```javascript
// In console
localStorage.setItem("debug_dearrow", "true");
```

### Check Network Requests

1. Open DevTools → Network tab
2. Filter by "sponsor.ajay.app"
3. Look for branding API calls
4. Check response status and data

### Common Issues

**Issue: 404 Not Found**

-   Video has no DeArrow data yet
-   This is normal, fallback to original title

**Issue: Timeout**

-   Network slow or API down
-   Extension will use cached/DOM data

**Issue: CORS Error**

-   Should not happen (API has CORS enabled)
-   Check browser console for details

## Performance Monitoring

```javascript
// Measure DeArrow API performance
async function measurePerformance(videoId) {
    const start = performance.now();

    const response = await fetch(
        `https://sponsor.ajay.app/api/branding?videoID=${videoId}&service=YouTube`
    );

    const end = performance.now();
    const duration = end - start;

    console.log("API Response Time:", duration.toFixed(2), "ms");
    console.log("Status:", response.status);

    if (response.ok) {
        const data = await response.json();
        console.log("Data Size:", JSON.stringify(data).length, "bytes");
    }
}

const videoId = new URLSearchParams(window.location.search).get("v");
measurePerformance(videoId);
```

## Integration Verification

### Check if DeArrow is Being Used

```javascript
// Verify DeArrow integration in extension
async function verifyIntegration() {
    const checks = {
        "DeArrow API Service": false,
        "Metadata Extractor": false,
        "Gemini Integration": false,
    };

    try {
        // Check if DeArrow API is available
        const deArrowAPI = await import(
            chrome.runtime.getURL("services/dearrow/api.js")
        );
        checks["DeArrow API Service"] = !!deArrowAPI.default;

        // Check if metadata extractor uses DeArrow
        const metadataExtractor = await import(
            chrome.runtime.getURL("content/metadata/extractor.js")
        );
        checks["Metadata Extractor"] = true;

        // Test actual extraction
        const videoId = new URLSearchParams(window.location.search).get("v");
        if (videoId) {
            const metadata = await metadataExtractor.default.extract(videoId, {
                useDeArrow: true,
            });
            checks["Gemini Integration"] =
                metadata.hasOwnProperty("deArrowTitle");
        }
    } catch (e) {
        console.error("Verification error:", e);
    }

    console.log("=== Integration Status ===");
    Object.entries(checks).forEach(([name, status]) => {
        console.log(`${status ? "✅" : "❌"} ${name}`);
    });
}

verifyIntegration();
```
