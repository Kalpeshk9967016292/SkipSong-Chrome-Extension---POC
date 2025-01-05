(function() {
  let skipEnabled = true;
  let lastSkipTime = 0;
  const SKIP_COOLDOWN = 2000;
  let songTimestamps = [];
  let lastLoggedMovieId = null;

  window.addEventListener('setSongTimestamps', function(event) {
    songTimestamps = event.detail;
    console.log('PageScript received timestamps:', songTimestamps);
    console.log('Monitoring for the following movie IDs:', 
      songTimestamps.map(t => t.movieId).join(', '));
  });

  function getNetflixPlayer() {
    try {
      const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
      return videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    } catch (error) {
      console.error('Failed to get Netflix player:', error);
      return null;
    }
  }

  function skipSongForNetflix(currentTime) {
    if (!skipEnabled) return;
    
    const now = Date.now();
    if (now - lastSkipTime < SKIP_COOLDOWN) return;

    const player = getNetflixPlayer();
    if (!player) return;

    const movieId = player.getMovieId();
    
    // Only log when movie ID changes
    if (movieId !== lastLoggedMovieId) {
      console.log('Current Netflix Movie ID:', movieId);
      const hasTimestamps = songTimestamps.some(entry => entry.movieId === movieId);
      if (hasTimestamps) {
        console.log('✅ Found timestamps for this movie:', 
          songTimestamps.filter(entry => entry.movieId === movieId)
            .map(entry => ({
              ...entry,
              startMinutes: Math.floor(entry.start / 60000),
              startSeconds: Math.floor((entry.start % 60000) / 1000),
              endMinutes: Math.floor(entry.end / 60000),
              endSeconds: Math.floor((entry.end % 60000) / 1000),
            }))
        );
      }
      lastLoggedMovieId = movieId;
    }
    
    const song = songTimestamps.find(entry => 
      entry.movieId === movieId && 
      currentTime >= entry.start && 
      currentTime <= entry.end
    );

    if (song) {
      console.log('Found song segment at:', {
        movieId: song.movieId,
        currentTime,
        currentMinutes: Math.floor(currentTime / 60000),
        currentSeconds: Math.floor((currentTime % 60000) / 1000),
        segmentStart: song.start,
        segmentEnd: song.end
      });
      
      player.seek(song.end);
      lastSkipTime = now;
      console.log(`✅ Skipped song segment in movie ${movieId}`);
    }
  }

  // Monitor player every second
  setInterval(() => {
    const player = getNetflixPlayer();
    if (player) {
      const currentTime = player.getCurrentTime();
      skipSongForNetflix(currentTime);
    }
  }, 1000);

  console.log('PageScript initialized - Ready to monitor Netflix player');
})();