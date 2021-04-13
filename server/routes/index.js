const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/login");
const roomsController = require("../controllers/rooms");
const verifyWebhooks = require("../middlewares/verifyWebhooks");
const webhooksController = require("../controllers/webhooks");
const passport = require("passport");
const statsController = require("../controllers/stats");
require('@tensorflow/tfjs-node');
const toxicity = require('@tensorflow-models/toxicity');

router.post("/login", loginController.createToken);
router.post("/sso", loginController.sso);
router.get("/logout", loginController.logout);
router.post("/createChannel", roomsController.createRoom);
router.post(
  "/webhooks/github/events",
  verifyWebhooks.verifyGithubWebhook,
  webhooksController.handleGithubWebhook
)
router.get('/activities/github', webhooksController.fetchGithubActivities)
router.get(
  "/webhooks",
  webhooksController.fetchWebhook
);
router.post(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.createGithubWebhook
);
router.patch(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.updateGithubWebhook
);
router.delete(
  "/webhooks/github",
  passport.authenticate("jwt", { session: false }),
  webhooksController.deleteGithubWebhook
);

router.get("/stats", statsController.fetchStats);
router.get("/roomMembers", roomsController.fetchRoomMembers);

router.post("/messageSent", async (req, res) => {

  console.log(req.body)

  // The minimum prediction confidence.
const threshold = 0.9;

// Load the model. Users optionally pass in a threshold and an array of
// labels to include.
toxicity.load(threshold).then(model => {
  const sentences = ['you suck'];

  model.classify(sentences).then(predictions => {
    // `predictions` is an array of objects, one for each prediction head,
    // that contains the raw probabilities for each input along with the
    // final prediction in `match` (either `true` or `false`).
    // If neither prediction exceeds the threshold, `match` is `null`.

    console.log(predictions[1]);
    return res.status(200).json({success: true})
  });
});
})

module.exports = router;
