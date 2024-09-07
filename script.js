const table = document.querySelector(".details");
const CREATE__USER = document.querySelector("#create");
const userName = document.querySelector("#username");
const userSurname = document.querySelector("#usersurname");

let BaseURL = "http://localhost:3001";

const getApiDataWithCallBack = async (endPoint, cb) => {
  let response = await fetch(`${BaseURL}/${endPoint}`).then((res) =>
    res.json()
  );
  cb(response);
};

const PostApiData = async (endPoint, data) => {
  let response = fetch(`${BaseURL}/${endPoint}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

const DeleteApiDataById = async (endPoint, id) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
    method: "DELETE",
  });
  return response;
};

const UpdateApiDataById = async (endPoint, id, data) => {
  let response = await fetch(`${BaseURL}/${endPoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response;
};

getApiDataWithCallBack("data", (data) => {
  data.map((item) => {
    table.innerHTML += `
                     <div class="flex flex-col">
                        <p>${item.name}</p>
                        <p>${item.surname}</p>
                        <button data-id=${item.id} class="deletebtn">Delete</button>
                      <button data-id=${item.id} class="editbtn bg-blue-500 text-white p-1 mt-2">Edit</button>

                     </div>
                `;

    const DELETE_USER = document.querySelectorAll(".deletebtn");

    DELETE_USER &&
      DELETE_USER.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          let AttrID = e.target.getAttribute("data-id");

          DeleteApiDataById("data", AttrID);
        });
      });

    const EDIT_USER = document.querySelectorAll(".editbtn");
    EDIT_USER &&
      EDIT_USER.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          let AttrID = e.target.getAttribute("data-id");

          const userToEdit = data.find((user) => user.id == AttrID);
          if (userToEdit) {
            userName.value = userToEdit.name;
            userSurname.value = userToEdit.surname;
            editingUserId = AttrID;
          }
        });
      });
  });
});

CREATE__USER &&
  CREATE__USER.addEventListener("click", async (event) => {
    event.preventDefault();

    const userData = {
      name: userName.value,
      surname: userSurname.value,
    };

    try {
      if (editingUserId) {
        await UpdateApiDataById("data", editingUserId, userData);
        editingUserId = null;
      } else {
        await PostApiData("data", userData);
      }

      getApiDataWithCallBack("data", renderData);
      userName.value = "";
      userSurname.value = "";
    } catch {
      console.error("Error processing user data");
    }
  });
