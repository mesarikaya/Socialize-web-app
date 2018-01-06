'use strict';

module.exports = {
  'googleAuth': {
	'clientID': process.env.GOOGLE_CLIENTID,
	'clientSecret': process.env.GOOGLE_SECRET,
	'callbackURL': process.env.APP_URL + 'auth/google/callback'
  },
  'facebookAuth': {
    'clientID': process.env.FACEBOOK_CLIENTID,
    'clientSecret': process.env.FACEBOOK_SECRET,
    'callbackURL': process.env.APP_URL + 'auth/facebook/callback'
  },
  'twitterAuth': {
    'clientID': process.env.TWITTER_CLIENTID,
    'clientSecret': process.env.TWITTER_SECRET,
    'callbackURL': process.env.APP_URL + 'auth/twitter/callback'
  },
  'linkedinAuth': {
    'clientID': process.env.LINKEDIN_CLIENTID,
    'clientSecret': process.env.LINKEDIN_SECRET,
    'callbackURL': process.env.APP_URL + 'auth/linkedin/callback'
  },
  'githubAuth': {
    'clientID': process.env.GITHUB_CLIENTID,
    'clientSecret': process.env.GITHUB_SECRET,
    'callbackURL': process.env.APP_URL + 'auth/github/callback'
  }
};