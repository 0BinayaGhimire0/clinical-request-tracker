const DATA_SOURCE = "localStorage";
// Later options:
// const DATA_SOURCE = "excel";
// const DATA_SOURCE = "sharePoint";
// const DATA_SOURCE = "dataverse";

function getRequests() {
  if (DATA_SOURCE === "localStorage") {
    return JSON.parse(localStorage.getItem("clinicalRequests")) || [];
  }

  // Future Excel connector
  if (DATA_SOURCE === "excel") {
    console.log("Excel connector would be used here.");
    return [];
  }

  // Future SharePoint connector
  if (DATA_SOURCE === "sharePoint") {
    console.log("SharePoint List connector would be used here.");
    return [];
  }

  // Future Dataverse connector
  if (DATA_SOURCE === "dataverse") {
    console.log("Dataverse connector would be used here.");
    return [];
  }

  return [];
}

function saveRequests(requests) {
  if (DATA_SOURCE === "localStorage") {
    localStorage.setItem("clinicalRequests", JSON.stringify(requests));
    return;
  }

  if (DATA_SOURCE === "excel") {
    console.log("Saving request data to Excel would happen here.");
    return;
  }

  if (DATA_SOURCE === "sharePoint") {
    console.log("Saving request data to SharePoint List would happen here.");
    return;
  }

  if (DATA_SOURCE === "dataverse") {
    console.log("Saving request data to Dataverse would happen here.");
    return;
  }
}