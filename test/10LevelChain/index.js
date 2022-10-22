const { default: axios } = require("axios");

let API_URL = "http://localhost:3001/user/register";
let LOGIN_URL = "http://localhost:3001/user/login";
let token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmNmZTg1NTRjMDg5YmFjMTZhMmZhNmQiLCJuYW1lIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE2NTgzNDM5MTAsImV4cCI6MTY1ODM0NzUxMH0.CjB4Xl4Z0SVpaxDG49SKrWYOIZ1koQUVvKOjiVHRz6M";

let lastRef = "62cfe8554c089bac16a2fa6d";
const register = async (num) => {
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL, {
        name: "Test User " + num,
        email: `test${num}@gmail.com`,
        password: "password",
        phone: "00000000" + num,
        admin: false,
        idProof: `aadhar${num}.jpg`,
        referredBy: lastRef,
      })
      .then(function (response) {
        axios
          .post(LOGIN_URL, {
            email: `test${num}@gmail.com`,
            password: "password",
          })
          .then(function (response) {
            lastRef = response.data.user._id;
            resolve("Done");
          });
      });
  });
};

register(1).then(() => {
  console.log("Registered 1");
  register(2).then(() => {
    console.log("Registered 2");
    register(3).then(() => {
      console.log("Registered 3");
      register(4).then(() => {
        console.log("Registered 4");
        register(5).then(() => {
          console.log("Registered 5");
          register(6).then(() => {
            console.log("Registered 6");
            register(7).then(() => {
              console.log("Registered 7");
              register(8).then(() => {
                console.log("Registered 8");
                register(9).then(() => {
                  console.log("Registered 9");
                  register(10).then(() => {
                    console.log("Registered 10");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
