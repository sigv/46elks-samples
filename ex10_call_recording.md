# 46elks samples: Recording all incoming calls

Recordings of calls can be made with the 46elks API by using the `recordcall` action in the `voice_start` configuration.

A POST request will be made to the provided endpoint consisting of one key-value pair. The key for the single pair will be `wav` and the value will be the full link to the WAV audio file of the recorded call.

## voice_start

```json
{
  "connect": "+46704508449",
  "recordcall": "http://example.com/newrecording"
}
```
