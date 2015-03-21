# 46elks samples: Voicemail

A voicemail system can be set up to handle missed calls that go unanswered due to any reason.

Using the following `voice_start` configuration allows doing just that with the 46elks API.

## voice_start

```json
{
  "connect": "+46704508449",
  "timeout": 15,
  "busy": {
    "play": "http://www.46elks.com/download/PleaseLeaveAMessageAfterTheBeep.wav",
    "next": {
      "record": "http://example.com/newvoicemail.php"
    }
  },
  "failed": {
    "play": "http://www.46elks.com/download/PleaseLeaveAMessageAfterTheBeep.wav",
    "next": {
      "record": "http://example.com/newvoicemail.php"
    }
  }
}
```
