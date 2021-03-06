const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Tweet = require('../models/tweet')
const User = require('../models/user')

describe('when there is initially some tweets saved', () => {
  beforeEach(async () => {
    await Tweet.deleteMany({})

    const tweetObjects = helper.initialTweets
      .map(tweet => new Tweet(tweet))
    const promiseArray = tweetObjects.map(tweet => tweet.save())
    await Promise.all(promiseArray)
  })

  test('tweets are returned as json', async () => {
    await api
      .get('/api/tweets')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all tweets are returned', async () => {
    const response = await api.get('/api/tweets')

    expect(response.body.length).toBe(helper.initialTweets.length)
  })

  test('a specific tweet is within the returned tweets', async () => {
    const response = await api.get('/api/tweets')

    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
      'Apes together strong'
    )
  })

  describe('viewing a specific tweet', () => {

    test('succeeds with a valid id', async () => {
      const tweetsAtStart = await helper.tweetsInDb()

      const tweetToView = tweetsAtStart[0]

      const resultTweet = await api
        .get(`/api/tweets/${tweetToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultTweet.body).toEqual(tweetToView)
    })

    test('fails with statuscode 404 if tweet does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      console.log(validNonexistingId)

      await api
        .get(`/api/tweets/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/tweets/${invalidId}`)
        .expect(400)
    })
  })

  

  describe('deletion of a tweet', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const tweetsAtStart = await helper.tweetsInDb()
      const tweetToDelete = tweetsAtStart[0]

      await api
        .delete(`/api/tweets/${tweetToDelete.id}`)
        .expect(204)

      const tweetsAtEnd = await helper.tweetsInDb()

      expect(tweetsAtEnd.length).toBe(
        helper.initialTweets.length - 1
      )

      const contents = tweetsAtEnd.map(r => r.content)

      expect(contents).not.toContain(tweetToDelete.content)
    })
  })
})