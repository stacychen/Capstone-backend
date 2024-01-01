const db = require("../db/connection");

const tableName = "reviews";

const reduceProperties = require("../utils/reduce-properties");

const reduceCritics = reduceProperties("review_id", {
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

async function destroy(reviewId) {
  // TODO: Write your code here
  return db(tableName).where({ review_id: reviewId }).del();
}

async function list(movie_id) {
  // TODO: Write your code here
  return db("reviews")
    .join("critics", "critics.critic_id", "reviews.critic_id")
    .where({ "reviews.movie_id": movie_id })
    .then(reduceCritics);
}

async function read(reviewId) {
  // TODO: Write your code here
  return db("reviews").select("*").where({ review_id: reviewId }).first();
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
