# SkipSong Chrome Extension - POC

**SkipSong** is a simple Chrome extension designed to automatically skip songs in a movie based on timestamps loaded from a Google Sheet. The extension uses a Google Sheet that contains the movie ID and corresponding song timestamps, allowing the extension to skip over song segments during playback. This is a proof of concept (POC) and not the ideal solution, but it serves as a starting point.

## Features
- Loads movie ID and song timestamps from a Google Sheet.
- Skips over the song segments in the movie based on the timestamps.
- Simple, lightweight, and easy to use.

## How It Works
1. The extension fetches the movie ID from the current page URL (e.g., `https://www.netflix.com/watch/81686136` — the movie ID is `81686136`).
2. The extension fetches song timestamps from a publicly accessible Google Sheet, which maps the movie ID to specific song segments (start and end times).
3. The extension automatically skips to the next segment in the movie, avoiding the song segment.
4. This is a POC to demonstrate the concept, and it's far from a production-ready solution.

## Google Sheet Format
The Google Sheet used by the extension should be structured as follows:
- **Movie ID**: Unique identifier for each movie.
- **Song Start Time**: Timestamp where the song begins in the movie (in seconds).
- **Song End Time**: Timestamp where the song ends in the movie (in seconds).

Example:

| Movie ID | Song Start Time (Seconds) | Song End Time (Seconds) |
|----------|---------------------------|-------------------------|
| 81686136 | 300                       | 360                     |
| 81686136 | 1200                      | 1260                    |

The movie ID is used to link the movie with its song segments, and the start and end times specify when to skip.

## Extracting Movie ID from URL
The movie ID is extracted directly from the URL. For example, in the Netflix movie URL:

`https://www.netflix.com/watch/81686136?trackId=255824129&tctx=0%2C0%2Cee7b362d-9137-4839-9483-1263f2840d13-321176310%2Cee7b362d-9137-4839-9483-1263f2840d13-321176310%7C2%2Cunknown%2C%2C%2CtitlesResults%2C81686136%2CVideo%3A81686136%2CminiDpPlayButton`

The movie ID `81686136` can be parsed from the URL, and this is used to fetch the relevant song timestamps from the Google Sheet.

## How to Install
1. Clone this repository to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click on "Load unpacked" and select the directory where the extension is located.
5. The extension will be installed and ready to use.

## How to Use
1. Navigate to a movie page where you want to skip songs (e.g., Netflix).
2. The extension will automatically extract the movie ID from the URL.
3. The extension will load song timestamps from the Google Sheet based on the movie ID.
4. As the movie plays, the extension will automatically skip the song segments based on the timestamps.

## Contributing
I know this is not the ideal way to implement this feature, but this is just a proof of concept (POC). If anyone is interested in improving or contributing to this project, feel free to fork and submit pull requests.

### How to Contribute:
- Fork the repository.
- Implement your changes or improvements.
- Open a pull request with a description of what you've changed.

## License
This project is open source and available under the MIT License.
