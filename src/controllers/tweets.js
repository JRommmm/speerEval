
const tweetsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Tweet = require('../models/tweet')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

tweetsRouter.get('/', async (request, response) => {
  const tweets = await Tweet
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(tweets.map(tweet => tweet.toJSON()))
})

tweetsRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const tweet = new Tweet({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedTweet = await tweet.save()
  user.tweets = user.tweets.concat(savedTweet._id)
  await user.save()

  response.json(savedTweet.toJSON())
})

tweetsRouter.get('/:id', async (request, response) => {
  const tweet = await Tweet.findById(request.params.id)
  if (tweet) {
    response.json(tweet.toJSON())
  } else {
    response.status(404).end()
  }
})

tweetsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const tweet = {
    content: body.content,
    important: body.important,
  }

  Tweet.findByIdAndUpdate(request.params.id, tweet, { new: true })
    .then(updatedTweet => {
      response.json(updatedTweet.toJSON())
    })
    .catch(error => next(error))
})

tweetsRouter.delete('/:id', async (request, response) => {
  await Tweet.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = tweetsRouter