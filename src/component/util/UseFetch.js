const fetchData = async (url, param = {}, method = "POST") => {
  let activeUser = "Admin";
  let response;

  try {
    if (method === "POST") {
      let paramToSent = {
        ...param,
        activeUser: activeUser === "" ? undefined : activeUser,
      };
      response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(paramToSent),
        headers: {
          "Content-Type": "application/json"
        },
      });
    } else if (method === "GET") {
      response = await fetch(url);
    }

    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      return "ERROR";
    }
  } catch (err) {
    return "ERROR";
  }
};

export default fetchData;
