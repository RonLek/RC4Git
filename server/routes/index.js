const { Router } = require("express");
const router = Router();
const loginController = require("../controllers/login");
const roomsController = require("../controllers/rooms");
const verifyWebhooks = require("../middlewares/verifyWebhooks");
const webhooksController = require("../controllers/webhooks");
const passport = require("passport");
const statsController = require("../controllers/stats");

const axios = require('axios') //you can use any http client
const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

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

router.post("/fileUpload", async (req,res) => {
  try {

    const pic = await axios.get("https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/close-up-of-cat-wearing-sunglasses-while-sitting-royalty-free-image-1571755145.jpg", {
    responseType: 'arraybuffer',
  })
  const model = await nsfw.load() // To load a local model, nsfw.load('file://./path/to/model/')
  // Image must be in tf.tensor3d format
  // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
  const image = await tf.node.decodeImage(pic.data,3)
  const predictions = await model.classify(image)
  image.dispose() // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
  console.log("Predictions = ", predictions)
  return res.status(200).json({
    "text": "The above attachment was detected as NSFW!",
  })
  } catch(err) {
    console.log(err)
    return res.status(500).json({success: false})
  }
  
})

module.exports = router;
