const changeLogContent = document.getElementById("changeLogContent");
const changeLogDateText = document.getElementById("changeLogDateText");
const totalCommits = document.getElementById("totalCommits");

const genChangeLogContent = (commits) => {
  changeLogContent.innerHTML = "";
  for (let i = 0; i < commits.length; i++) {
    const msg = commits[i].commit.message;
    const date = new Date(commits[i].commit.author.date);
    const formattedDate = Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
    if (i === 0) {
      changeLogDateText.innerHTML = `${formattedDate} | `;
    }
    changeLogContent.innerHTML += `
        <li class="text-white">
            ${formattedDate} | "${msg}"
        </li>
    `;
  }
};

const genNumberOfCommitsText = (num) => {
  totalCommits.innerHTML = num;
};

const fetchRepoCommits = async () => {
  console.log("Fetching GitHub data...");
  const url =
    "https://api.github.com/repos/selenestica/hd2-random-strat/commits?per_page=15";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    genChangeLogContent(data);
    const linkHeader = response.headers.get("Link");

    if (!linkHeader) {
      // No pagination, so only 1 commit
      return 1;
    }

    // Extract the last page number from the Link header
    const match = linkHeader.match(/&page=(\d+)>; rel="last"/);
    if (match) {
      genNumberOfCommitsText(parseInt(match[1], 10) * 15);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchRepoCommits();
