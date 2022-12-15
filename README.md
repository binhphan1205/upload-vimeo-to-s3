# CareerFitter *(active)*

### *Circles? Not sure we still use this*
[![CircleCI](https://circleci.com/gh/troynorton/careerfitter1.svg?style=svg)](https://circleci.com/gh/troynorton/careerfitter1)

### *Before you get started...*
Make sure you touch base with Troy and ask about how to safely and
reliably contribute code to the repository.
We follow feature branching and
there are methods put in place to prevent destabilization of master which is
our point of release.
On that note, do not develop off master directly.  New branch off the master for every new project.  
Before every new merge of code into the master Troy likes to create a backup branch of the master for a quick, safe reversal. example name: (bck_Master_9-15-16).
Troy or Senior Programmer Cole have authorization to push to Engine Yard.
Test on Staging Server first.
Staging Server:  https://ec2-52-70-139-157.compute-1.amazonaws.com/


In order to to setup a local database, contact Troy Norton for the following files:

* `db/seeds.rb`

* `private/test_questions_and_answers.txt`

### *Running Tests*
Running Tests Step 1: cd . Step 2: if this is a first time you run test, please setup your test database by command line RAILS_ENV=test rails db:setup Step 3: Run test by command line rspec ./spec Note: To run features test, you should downgrade your firefox browser to version 46.0

This uses gem stripe-ruby-mock to mock Stripe purchases offline. To run purchase testing live against Stripe online, run rspec with the "live" tag: rspec -t live


### *Coding Standards*
All CareerFitter code should conform to the following style guides:
- [Ruby](https://github.com/bbatsov/ruby-style-guide)
- [Rails](https://github.com/bbatsov/rails-style-guide)

Before you push any finalized code to GitHub, use
[RoboCop](https://github.com/bbatsov/rubocop) to make sure your code is up to
snuff.

### *See Github Wiki for other site housekeeping info*
