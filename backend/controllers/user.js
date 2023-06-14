const User = require("../models/User");
const Test = require("../models/Test");
const TestQuestion = require("../models/TestQuestion");
const bcrypt = require("bcrypt");
const axios = require("axios");
exports.welcome = async (req, res) => {
  try {
    return res.status(200).json({
      sucess: true,
      message: "API successfully called",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.signup = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone_number = req.body.phone_number;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "user already exist" });
    }
    user = await User.create({
      name,
      email,
      password,
      phone_number,
    });
    res.status(500).json({
      success: true,
      message: "Signed up successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid user password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const response = await axios.get("https://api.catboys.com/catboy");
    const data = response.data.response;
    //console.log(response);
    const token = await user.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, options).json({
      success: true,
      message: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.phonenumber = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const lastestPhoneNumber = req.body.phone_number;

    if (!lastestPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please provide Phone number",
      });
    }

    user.phone_number = lastestPhoneNumber;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Phone number changed / added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.submitTest = async (req, res) => {
  try {
    if (req.user.testID !== "-1") {
      return res.status(400).json({
        success: false,
        message: "You have already submitted the test.",
      });
    }

    const questionID = req.body.questionID;
    const choosenOption = req.body.choosenOption;

    let score = 0;
    for (let i = 0; i < questionID.length; i++) {
      const currentQuestion = await TestQuestion.findById(questionID[i].qID);
      const currentOption = req.body.choosenOption[i];
      const currentOptionIndex = currentOption[0].ans;

      if (
        currentOption.length === 1 &&
        currentQuestion.multipleAnswers === false
      ) {
        if (
          currentQuestion.option[currentOptionIndex].ans ===
          currentQuestion.correctOption[0].correct
        ) {
          score++;
        }
      } else if (
        currentOption.length > 1 &&
        currentQuestion.multipleAnswers === true &&
        currentOption.length === currentQuestion.correctOption.length
      ) {
        totalCorrectAns = 0;
        for (i = 0; i < currentOption.length; i++) {
          currentIndex = currentOption[i].ans;
          for (j = 0; j < currentOption.length; j++) {
            if (
              currentQuestion.option[currentIndex].ans ===
              currentQuestion.correctOption[j].correct
            ) {
              totalCorrectAns++;
              break;
            }
          }
        }
        if (totalCorrectAns === currentOption.length) {
          score++;
        }
      }
    }

    req.user.answer = req.body.choosenOption;
    req.user.testID = req.body.testID;
    await req.user.save();

    const output = {
      USER_ID: req.body.userID,
      TEST_ID: req.body.testID,
      Score: score,
    };

    return res.status(200).json({
      success: true,
      output,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
