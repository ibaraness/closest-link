# Closest-link
A simple experimental script to find the closest link tag to the mouse cursor.

## Idea
It started from trying to complete front-end interview questions in some website. I think it was on some of the comment on that webpage that I saw a suggestion for a task. The task was to create a script that finds the closest link to the mouse cursor, and so, I've desided to give it a try.   
While it's working more or less, it's far from being perfect. 

## How it works?
Currently my way of doing it was first finding the most clossest elements on the Y axis. Elements who are in the same line will will have the same height, So the first check would sometimes return more than 1 element. 
The next step was to test which of the returned elements was the once closest to the cursor, using the X axis this time.

## Demo
You can see it in action [here:](http://ibaraness.com/demos/javascript/find_closest_link/)
