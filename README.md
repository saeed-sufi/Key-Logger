# Key-Logger
## An electron app which saves the pressed keys along with a timestamp in a text file.

This app has a very specific use case. Basically, what it does is that it logs each alphabetical letter that a user presses on the keyboard and attaches a timestamp (with milisecond precision) to the key. User can only enter one letter at a time. Logged data is first saved in the local storage of the electron app and user can save data in json format as a text file when he is finished working with the app.

I need these logs so that later I can compare timestamps with the timestamps recorded during a road survey by gps and then attach each letter to a gps coordinate. Anyway, this simple app lets us to 'comment' each road infrastructure while surveying the road in high speed. 
