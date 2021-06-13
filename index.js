import { jobs } from "./data.js";
let jobList = document.querySelector(".job-list");
let filterDisplay = document.querySelector(".filter");
let tagsDisplay = document.querySelector(".tags");
let filterText;
let existingFilterArray = [];
let resetBtn = filterDisplay.querySelector(".clear a");

function displayItems(object = jobs) {
  const items = object
    .map(
      (job) =>
        `    
    <div class="job ${job.featured ? `featured` : ``}">
    <div class="job-info">
      <div class="logo">
        <img src="${job.logo}" alt="${job.company} logo">
      </div>
      <div class="info">
        <h3>${job.company}</h3>
        ${job.new ? `<p class="labels newlabel">New!</p>` : ``}
        ${job.featured ? `<p class="labels featuredlabel">Featured</p>` : ``}
        <h2>${job.position}</h2>
        <ul>
          <li>${job.postedAt}</li>
          <li>${job.contract}</li>
          <li>${job.location}</li>
        </ul>
      </div>
    </div>
    <div class="job-roles">
    <button data-info="${job.role}">${job.role}</button>
    <button data-info="${job.level}">${job.level}</button>
    ${job.languages
      .map((language) => `<button data-info="${language}">${language}</button>`)
      .join("")}
    ${job.tools
      .map((tool) => `<button data-info="${tool}">${tool}</button>`)
      .join("")}
    </div>
 </div>`
    )
    .join("");
  jobList.innerHTML = items;
}

function isTrue(testArr, objArrLang, objArrTool, objRole, objLevel) {
  return testArr.every(
    (i) =>
      objArrLang.includes(i) ||
      objArrTool.includes(i) ||
      objRole.includes(i) ||
      objLevel.includes(i)
  );
}

function updateDisplay() {
  let filtered = jobs.filter(function (job, index, jobs) {
    return isTrue(
      existingFilterArray,
      jobs[index].languages,
      jobs[index].tools,
      jobs[index].role,
      jobs[index].level
    );
  });
  displayItems(filtered);
}

function addToFilter(filter) {
  existingFilterArray.push(filter);
  if (filterDisplay.classList.contains("hidden")) {
    filterDisplay.classList.remove("hidden");
  }
  if (existingFilterArray.length) {
    existingFilterArray.forEach(function (langOrTool) {
      filterText = document.createElement("div");
      filterText.classList.add("filterTag");
      filterText.classList.add(langOrTool);
      filterText.innerHTML = `<p>${langOrTool}</p><button><img src="./images/icon-remove.svg"></button>`;
    });
    tagsDisplay.appendChild(filterText);
  }
  updateDisplay();
}

function removeItemFromFilter(filterEl) {
  let indexToRemove = existingFilterArray.indexOf(filterEl);
  let childToRemove = tagsDisplay.querySelector(`.${filterEl}`);

  existingFilterArray.splice(indexToRemove, 1);

  tagsDisplay.removeChild(childToRemove);
  if (existingFilterArray.length === 0) {
    filterDisplay.classList.add("hidden");
  }
  updateDisplay();
}

function findFilterItem(e) {
  if (
    e.target.matches(".filter button") ||
    e.target.matches(".filter button img")
  ) {
    let filterEl = e.target.closest(".filterTag").firstElementChild.innerText;
    removeItemFromFilter(filterEl);
  }
}
function resetDisplay() {
  let filterTags = tagsDisplay.querySelectorAll(".filterTag");
  console.log(filterTags);

  filterTags.forEach((tag) => {
    tagsDisplay.removeChild(tag);
  });

  existingFilterArray = [];
  if (existingFilterArray.length === 0) {
    filterDisplay.classList.add("hidden");
  }
  displayItems(jobs);
}

displayItems(jobs);

jobList.addEventListener("click", function (e) {
  const filter = e.target.getAttribute("data-info");
  if (e.target.matches(".job-list button")) {
    if (!existingFilterArray.includes(filter)) {
      addToFilter(filter);
    } else {
      removeItemFromFilter(filter);
    }
  }
});

tagsDisplay.addEventListener("click", findFilterItem);

resetBtn.addEventListener("click", resetDisplay);
