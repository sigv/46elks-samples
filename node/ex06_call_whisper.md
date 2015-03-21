# 46elks samples: Whisper in voice calls

"Whisper" is the common term for playing a message before transferring a call to the actual destination.

Using the following `voice_start` configuration allows doing just that with the 46elks API.

## voice_start

```json
{
  "play": "http://example.com/whisper.wav",
  "next": {
    "connect": "+461890510"
  }
}
```
