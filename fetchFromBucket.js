fetch("https://movieswebsiteforpractice.s3.us-east-2.amazonaws.com/movies.csv")
  .then(res => res.text())
  .then(csvText => {
    // parse with PapaParse or similar
    console.log(csvText);
  });

