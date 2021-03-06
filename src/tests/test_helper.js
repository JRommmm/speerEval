const Tweet = require('../models/Tweet')
const User = require('../models/user')

const initialTweets = [
  {
    content: 'GME to the moon',
  },
  {
    content: 'Apes together strong',
  }
]

const nonExistingId = async () => {
  const tweet = new Tweet({ content: 'willremovethissoon' })
  await tweet.save()
  await tweet.remove()

  return tweet._id.toString()
}

const tweetsInDb = async () => {
  const tweets = await Tweet.find({})
  return tweets.map(tweet => tweet.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialTweets, nonExistingId, tweetsInDb, usersInDb
}