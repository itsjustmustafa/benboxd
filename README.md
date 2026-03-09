# Benboxd

### To collect Data:

Go to each page `https://letterboxd.com/delicate6299/films/size/large/page/<PAGE_NUM>/`

run in console:

```
function starsToNumber(s){
  return (s.match(/★/g)?.length || 0) + (s.includes("½") ? 0.5 : 0);
}

function exportMovies(){
  const movie_items = document
    .getElementsByClassName("poster-grid")[0]
    .getElementsByClassName("griditem");

  const movies = [];

  for (const movie of movie_items){
    const ratingStr = movie.getElementsByClassName("rating")[0]?.innerText || "";
    const img = movie.getElementsByTagName("img")[0];

    movies.push({
      title: img?.alt || "",
      poster: img?.src || "",
      rating: starsToNumber(ratingStr)
    });
  }

  const blob = new Blob([JSON.stringify(movies, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "movies.json";
  a.click();

  URL.revokeObjectURL(url);
}

exportMovies();
```

This will download a json file of the movies just on THIS page.

Do this for each page, then take all the json files downloaded via this, put them in a folder, and then in that folder run this to combine it all together:
`jq -s "add" *json > all_movies.json`
