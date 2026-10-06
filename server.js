const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  const page = parsedUrl.pathname;

  const word = parsedUrl.searchParams.get("word");

  console.log(page);

  if (page === "/") {
    fs.readFile("index.html", function (err, data) {
      if (err) {
        console.log(err);

        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("Something went wrong.");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.end(data);
    });
  } else if (page === "/api") {
    if (word) {
      const cleanedWord = word.toLowerCase().replace(/[^a-z0-9]/g, "");

      const reversedWord = cleanedWord.split("").reverse().join("");

      let isPalindrome;

      if (cleanedWord === reversedWord) {
        isPalindrome = true;
      } else {
        isPalindrome = false;
      }

      const responseObject = {
        original: word,
        cleaned: cleanedWord,
        reversed: reversedWord,
        isPalindrome: isPalindrome,
      };

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(responseObject));
    } else {
      const responseObject = {
        error: "Please enter a word or phrase.",
      };
      res.writeHead(400, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(responseObject));
    }
  } else if (page === "/main.css") {
    fs.readFile("main.css", function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }

      res.writeHead(200, {
        "Contetn-Type": "text/css",
      });
      res.end(data);
    });
  } else if (page === "/js/main.js") {
    fs.readFile("js/main.js", function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, {
        "Content-Type": "text/javascript",
      });
      res.end(data);
    });
  } else if (page === "/favicon.ico") {
    res.writeHead(204);
    res.end();
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 - Page Not Found");
  }
});

server.listen(8000, function () {
  console.log("Server running on http://localhost:8000");
});
