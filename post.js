const data = require("./qr_code_data.json");

const reqFor = (x, y, color = "#000000") => ({
  row: x,
  column: y,
  color,
});

const postToAggieCanvas = (requestData) => {
  const url = "https://aggiecanvas.linux.usu.edu/api/update";

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  }).then((response) => {
    if (response.ok) {
      console.log("POST request was successful.");
    } else {
      throw new Error("POST request failed");
    }
  });
};

// Checking the QR code is right
console.log(
  data.map((row) => row.map((x) => (x === 1 ? "#" : " ")).join("")).join("\n")
);

(async () => {
  // Using for/let instead of for/of to get indexes
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data.length; col++) {
      const offset = 99 - data.length + 1;
      const setRow = offset + row;
      const setCol = offset + col;

      const state = data[row][col] === 1 ? "#000000" : "#ffffff";

      console.log(
        `Setting row ${row} and col ${col} to ${state}. Progress: ${
          row * 25 + col
        }/625`
      );

      let success = false;

      while (!success) {
        try {
          // Set the pixel
          await postToAggieCanvas(reqFor(setRow, setCol, state));
          console.log("Success");
          success = true;
        } catch (e) {
          console.log("Retrying...");
          console.log(e);
        }

        // Wait 2.5s between each attempt
        await (() => new Promise((r) => setTimeout(r, 2500)))();
      }
    }
  }
})();
