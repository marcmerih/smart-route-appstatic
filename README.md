# Smart Route Appstatic

The team will build a novel route-based recommender that will optimize the travel experience and travel route preferences for car occupants and increase occupant awareness of their surroundings (e.g., by making them aware of tourism, event, and other exploration opportunities relevant to the preferences of the car occupants). The recommender will require collection of travel, tourism, and business data from a variety of sources and integration with an AI-based backend that can efficiently plan the route taking into account available data, user preferences, and system objectives.

# Client Expectations

The team will develop an interactive map-based front-end tool with a Python-powered backend that stores all data and powers the machine learning and AI-based models to serve front-end requests. The team will provide an interactive planning tool and either a simulated or real-time tool for use enroute. Ideally, students will validate the tool through a small user study designed to assess satisfaction of project requirements.


# Project Contributors

Merih (Marc) Atasoy
Chris Palumbo
Matteo Ciserani
Bassam Bibi

# Supervisor

Prof. Scott Sanner
University of Toronto


-----------

# Libraries

The current application is created using Angular (CLI), NodeJS, HTML, CSS, and Python.

Used libraries include (please add as new dependencies are introduced):
  - Angular Material
  - Material Icons
  - Bootstrap
  - Google Fonts
  
------------

# Workflow

*Pushing code to the master branch:*

  1.  Create a new branch in remote repository (here).
  2.  On your local VSCODE Terminal, run `git checkout master` to enter local master branch.
  3.  To acquire any new branches created by others (and your own branch that you've just created), run `git fetch`.
  4.  To acquire latest changes merged into remote master, run `git pull origin master`.
  5.  You should only make changes to your own branches (and not the master branch). To go into your branch locally, run `git checkout *type/your-branch-name*`
  6.  Create your changes.
  7.  To stage the changes, run `git add .`.
  8.  Now you must commit these staged changes, so you must run `git commit -m "message"`, where the message is a very brief description of what is in that commit.
  9.  Now your code is ready to be pushed, so just run `git push` (alternatively, if you find yourself creating the branch in your local, terminal will prompt you to run `git push --set-upstream origin *type/your-branch-name*`, which will create and sync the same branch in the remote with your local branch).
  10. Open the github website, click on *Create and compare pull request*.
  11. Add reviewers, add a title, and a description (if there are more than 5 files changed), and click create PR!
  
  -----------
  
  # Code Structure
  
  You will notice that there are a lot of files in the repository. These files were introduced by _Angular CLI_. The sub folder we will be most interested in (and will be working with) is in _*src/app*_.
  
  There is also an _*assets*_ subfolder, which will house all images we use, copydeck, documents, etc.
