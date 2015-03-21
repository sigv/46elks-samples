# 46elks samples: IVR

An IVR ([interactive voice response](https://en.wikipedia.org/wiki/Interactive_voice_response)) system can be used to do any action, such as routing the person to the appropriate phone number.

Using the following `voice_start` configuration allows doing just that with the 46elks API.

## voice_start

```json
{
  "ivr": "http://www.46elks.com/download/DummySupportIVR.wav",
  "1": {
    "connect": "+461890510"
  },
  "2": {
    "connect": "+461890511"
  }
}
```
