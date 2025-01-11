const {executeQuery, connection} = require("../db");

// <------------- FAKER ------------->

const { faker } = require("@faker-js/faker");

// generate random user data
let getRandomUser = () => {
  return [
    faker.string.uuid(),
      faker.internet.username(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  };
  
  // prepare data and query for random users 
  let q = "INSERT INTO user (id, username, email, password) VALUES ?";
  let data = [];
  for(let i=1; i<=100; i++){
    data.push(getRandomUser());
  }

// execute query and close connection once executed
executeQuery(q, [data], (err, result) => {
  if (err) {
    console.error("Error inserting data:", err);
  } else {
    console.log("Data inserted successfully!");
    console.log(result);
  }
  connection.end();
});