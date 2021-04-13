const axios = require("axios"); //you can use any http client
const constants = require("./../config/constants");
const tf = require("@tensorflow/tfjs-node");
const nsfw = require("nsfwjs");

module.exports.imageModeration = async (req, res) => {
  try {
    console.log(req.body.message);

    const pic = await axios.get(
      `${constants.rocketChatDomain}/${req.body.message.attachments.image_url}`,
      {
        responseType: "arraybuffer",
      }
    );
    const model = await nsfw.load(); // To load a local model, nsfw.load('file://./path/to/model/')
    // Image must be in tf.tensor3d format
    // you can convert image to tf.tensor3d with tf.node.decodeImage(Uint8Array,channels)
    const image = await tf.node.decodeImage(pic.data, 3);
    const predictions = await model.classify(image);
    image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).
    console.log("Predictions = ", predictions);
    return res.status(200).json({
      text: "The above attachment was detected as NSFW!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false });
  }
};
