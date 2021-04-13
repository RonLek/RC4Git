require("@tensorflow/tfjs-node");
const toxicity = require("@tensorflow-models/toxicity");

module.exports.textModeration = async (req, res) => {
  try {
    if (req.body.text !== "The above message was flagged inappropriate.") {
      console.log(req.body);

      // The minimum prediction confidence.
      const threshold = 0.9;

      // Load the model. Users optionally pass in a threshold and an array of
      // labels to include.
      const model = await toxicity.load(threshold);

      const sentences = [req.body.text];
      const predictions = await model.classify(sentences);

      console.log("Predictions = ", predictions);
      return res
        .status(200)
        .json({ text: "The above message was flagged inappropriate." });
    } else {
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.log("Error = ", error);
    return res.status(500).json({ success: false });
  }
};
