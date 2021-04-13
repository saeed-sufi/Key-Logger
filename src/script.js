const save = document.querySelector("#save")
const commentInput = document.querySelector("#comment")
const list = document.querySelector(".comment-list")
const alert = document.querySelector(".alert")
const electron = require("electron")
const { ipcRenderer } = electron
const { app, dialog } = electron.remote

// when the app starts, if the local storage has a 'comments' key, remove it.
if (getLocalStorage().length) {
  localStorage.removeItem("comments")
}
commentInput.addEventListener("keyup", addComment)

function addComment(e) {
  // the condition checks if the pressed key is an alphabetical letter or a numerical value.
  if (
    e.code.substring(0, 3) == "Key" ||
    e.code.substring(0, 5) == "Digit" ||
    (e.code.substring(0, 6) == "Numpad" && e.code.length == 7)
  ) {
    const comment = commentInput.value.substring(0, 1)
    if (comment.length < 1) return

    const element = document.createElement("article")
    element.classList.add("comment-item")
    const date = new Date()

    // setting a unique id for each comment using date object
    const commentId = date.getTime().toString()
    let attr = document.createAttribute("data-id")
    attr.value = commentId
    element.setAttributeNode(attr)

    // the time shown on the app main window
    const time = date.toLocaleTimeString()

    // setting the comment html content
    element.innerHTML = `<span><i class="far fa-comment-dots"></i><span class="title"> ${comment}</span></span>
    <span class="time-btn">
    <i class="far fa-clock"></i>
    <span>${time}</span>
    </span>
    <div>
    <button type="button" class="delete-btn">
    <i class="fas fa-trash"></i>
    </button>
    </div>
    `

    // empty the input field and add the comment to the page. last comment sits at the top of the list.
    commentInput.value = ""
    list.prepend(element)

    // now that the comment is created, we can add event listener to delete-btn
    const deleteBtn = document.querySelector(".delete-btn")
    deleteBtn.addEventListener("click", deleteComment)

    // the exact time when the key was pressed in milliseconds precision.
    const hour = date.getHours()
    const min = date.getMinutes()
    const sec = date.getSeconds()
    const ms = date.getMilliseconds()
    clock = `${hour}:${min}:${sec}:${ms}`

    //adding the comment to local storage
    addToLocalStorage(commentId, comment, clock)
  } else {
    // nothing will happen if the pressed key is anything other that an alphabetical letter
    commentInput.value = ""
  }
}

function deleteComment(e) {
  const element = e.currentTarget.parentNode.parentNode
  const id = element.dataset.id
  list.removeChild(element)
  commentInput.focus()

  removeFromLocalStorage(id)
  alertUser("Comment removed", "danger")
}

function alertUser(message, action) {
  alert.textContent = message
  alert.classList.add(`alert-${action}`)

  setTimeout(function () {
    alert.textContent = ""
    alert.classList.remove(`alert-${action}`)
  }, 2000)
}

function addToLocalStorage(commentId, comment, clock) {
  let list = getLocalStorage()
  const commentObj = { commentId, comment, clock }
  list.push(commentObj)
  localStorage.setItem("comments", JSON.stringify(list))
}

function getLocalStorage() {
  return localStorage.getItem("comments")
    ? JSON.parse(localStorage.getItem("comments"))
    : []
}

function removeFromLocalStorage(id) {
  const comments = getLocalStorage()
  const result = comments.filter((c) => c.commentId !== id)
  localStorage.setItem("comments", JSON.stringify(result))
}

save.addEventListener("click", () => {
  const saveOptions = {
    defaultPath: app.getPath("documents"),
    filters: [{ name: "Text File", extensions: ["txt"] }],
  }
  if (getLocalStorage().length) {
    dialog.showSaveDialog(saveOptions).then((response) => {
      if (!response.canceled) {
        return ipcRenderer.send(
          "saveBtn:select",
          response.filePath,
          localStorage.getItem("comments")
        )
      }
      dialog.showErrorBox(
        "Unknown Path",
        "No path specified. Comments are not saved."
      )
    })
  } else {
    alertUser("There is no comment to save!", "danger")
  }
})

// if saving the comments on local fs is successful, delete local storage "comments" key.
ipcRenderer.on("save:success", () => {
  list.textContent = ""
  localStorage.removeItem("comments")
  alertUser("Successfully saved comments.", "success")
})

ipcRenderer.on("save:fail", (e, err) => {
  list.textContent = err
})

ipcRenderer.on("app:close", () => {
  let isSaved = true
  if (getLocalStorage().length != 0) {
    isSaved = false
  }
  ipcRenderer.send("comments:save", isSaved)
})
