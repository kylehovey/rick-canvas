const data = require('./qr_code_data.json');

const reqFor = (x, y, color="#000000") => ({
  column: x,
  row: y,
  color,
});

function postToAggieCanvas(requestData) {
  const url = "https://aggiecanvas.linux.usu.edu/api/update";

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (response.ok) {
        console.log("POST request was successful.");
      } else {
        console.error("POST request failed.");
        throw new Error('whoops');
      }
    });
}

// Call the function to send the POST request
// postToAggieCanvas(reqFor(99, 99));

// console.log(data.map(row => row.map(x => x === 1 ? '#' : ' ').join('')).join('\n'));

(async () => {
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      const setRow = 75 + row;
      const setCol = 75 + col;

      if (data[row][col] === 1) {
        console.log(`Setting row ${row} and col ${col} to black. Progress: ${row * 25 + col}/625`);
        let success = false;
        while (! success) {
          try {
            await postToAggieCanvas(reqFor(setCol, setRow));
            console.log('Success');
            success = true;
          } catch (e) {
            console.log('Retrying...');
            console.log(e);
          }
          await (() => new Promise(r => setTimeout(r, 2500)))();
        }
      }
    }
  }
})();
