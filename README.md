# Vec Tor Bel

At [False Flag](https://false-flag.org/) Nov 10 - Dec 20 2018.

This is an API art piece by [NonCoreProjector](https://noncoreprojector.com/). The sequel to [Verbolect](http://verbolect.com/) ([source](https://github.com/ejarzo/verbolect)).

![Vec Tor Bel Screenshot](misc/vec-tor-bel-screenshot.png)

*False Flag is proud to present *Vec Tor Bel* from NonCoreProjector—a collective formed by
Rollo Carpenter, Jack Colton, Elias Jarzombek, and John O’Connor.*

_Projected onto the gallery’s main wall is a continually-evolving series of translucent videos,
overlaid with dynamic colored graphs. The visual content is produced by Cleverbot, a chatbot
developed by Rollo Carpenter, driven by an artificial intelligence algorithm. Each day initiates a new
conversation: Cleverbot pulls a headline from the morning’s news, searches that phrase on
YouTube, plays the resulting video, and reads aloud the first comment - which becomes the initial
node on a projected graph. Cleverbot responds to this initial comment, then uses the response for a
subsequent search, repeating this cycle through the end of the day._

[Read the full press release](misc/Press_Release_NonCoreProjector_Vec-Tor-Bel.pdf)

---

## Overview

_Vec Tor Bel_ is a web application written in JavaScript. The piece physically consists of a projection, a monitor, a laptop, and speakers.

The projection displays the “_Vec Tor Bel_ Brain,” the central component of the piece. The projection size can vary, though we prefer it to be large and definitely larger than the monitor.

The monitor is vertically oriented and displays the “Data HUD”. A monitor of any size can be used, but the program will have to be scaled manually to fit. It should be placed within a viewer’s line of sight when looking at the projection, preferably on a surface perpendicular to it. Both the monitor and the projection are a standard widescreen aspect ratio.

A single Mac computer runs the program for both displays and shows the web page’s javascript console on its screen. The laptop should be using [Google Chrome](https://www.google.com/chrome/) as its default web browser. It should be placed on a table of some sort, a distance away from the other displays.

The sound for the piece runs in stereo, with speakers to either side of the projection connected through an amp to the laptop or directly to the laptop.

We suggest some sort of seating arrangement for viewers. For the False Flag installation we used a couch, which we like the aesthetic of, but folding chairs will also work, or something else.

## Setup

The following steps allow you to initialize and run _Vec Tor Bel_. The setup may take a little time but once it is complete, running the program is straightforward.

To be able to run _Vec Tor Bel_, you need several [API](https://en.wikipedia.org/wiki/Application_programming_interface) keys. An API is a public interface that defines certain actions or questions that can be asked of a program. For example, if you wanted to ask YouTube how many views a certain video had, you could do this using the YouTube API. Most APIs offer subscriptions that allow for a certain amount of requests in a month. We are using the free plans for all of these APIs except Cleverbot.

These are the APIs that _Vec Tor Bel_ uses:

### 1. Cleverbot (https://www.cleverbot.com)

-   The cleverbot API is used for generating the conversation. Each reply is fed back to the API as a new request. We also receive emotion data for each response from the cleverbot API which is used to generate graphs and other visuals.
-   API: https://www.cleverbot.com/api/
-   If the program isn’t running constantly we suggest the API topup method of payment, simply purchasing more calls when necessary. If the program is running eight hours per day it will use roughly 44,000 calls per month.

### 2. YouTube (https://www.youtube.com/)

-   The YouTube API is used to search for videos for each reply in the conversation, and to retrieve comments for the videos that are used.
-   API: https://developers.google.com/youtube/
-   To get an API key, you must have a google account.
-   Follow these instructions to create the YouTube API key: https://www.slickremix.com/docs/get-api-key-for-youtube/

### 3. Freesound (https://freesound.org/)

-   This API is used to search for sounds using the emotion of each response in the conversation
-   API: https://freesound.org/docs/api/
-   To get an API key, you must have a Freesound account
-   Then go to https://freesound.org/apiv2/apply/ and fill out the form. When you submit, you will see a new API key show up under “Existing credentials”
    You can create as many new keys as you want by filling out the form again.

### 4. News (https://newsapi.org/)

-   This API is used to retrieve the latest news headlines, which are used to start the conversation.
-   API: https://newsapi.org/docs
-   To get an API key, click the “Get API Key” button on the homepage and follow the steps

### 4. Language Layer (https://languagelayer.com)

-   This API is used to detect the language of the replies so that the correct voice can be used when speaking them.
-   API: https://languagelayer.com/documentation
-   To get an API key, make an account here: https://languagelayer.com/product. The free subscription should be sufficient

Once you have all of these API keys, you will need to activate them in the _Vec Tor Bel_ program. This process requires [Homebrew](https://brew.sh/) to be installed. If it is not already installed, double click the `INSTALL_HOMEBREW.command` file to install it. Once that is done, open `SETUP.command`. This will prompt you to enter your API keys and then build the program. You should only have to run this once, unless you change API keys at some point.

## Run

To run the program, open `START.command`. This begins a local server. Then open the two files: `VecTorBel-Projection.webloc` and `VecTorBel-TV.webloc`. These should open in your browser. If not, navigate to http://localhost:5000/ for the projection and http://localhost:5000/tic-tac-toe for the TV. To open the javascript console that is displayed on the laptop screen, click on the projection screen (to focus the window) and press `command+option+j`. This will open a console window. Set the Theme to ‘Dark’ in the settings which can be access with the button in the top right.

Once these windows are on their respective devices, make them full screen and then refresh each page (except the console) with command+r to make sure that the sizing is correct. To begin the program, hover over the top left of the projection screen and a "BEGIN" button will appear. Click it and move the mouse away to hide it again.

If at any point something goes wrong, simply reload both the main projection and the TV screen and click "BEGIN" again.

---

## Development

You will need the API keys defined in above. These will be in the `.env.local` file.

To run in development:

```
yarn install; yarn start;
```
