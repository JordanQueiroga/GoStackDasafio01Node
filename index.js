const express = require("express");

const server = express();

server.use(express.json());


const projects = [{ id: "1", title: "Rocketseat", tasks: ["Fazer um serviço para cadastro de projetos"] }]

function logRequests(req, res, next) {
  console.count("Req. Num");
  return next();
}
server.use(logRequests);

function isProjectExist(req, res, next) {
  const id = req.params.id + "";
  const projectIndex = projects.findIndex(p => p.id == id);
  if (projectIndex < 0) {
    return res.status(400).json("Project not found")
  }
  req.projectIndex = projectIndex;
  req.project = projects[projectIndex];
  return next();
}

function isValidNewProject(req, res, next) {
  const { id, title } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Project ID is required" })
  }
  if (!title) {
    return res.status(400).json({ error: "Project title is required" })
  }
  const project = projects.find(p => p.id == id);

  if (project) {
    return res.status(400).json({ error: "Project already exists" })
  }
  return next();
}

function isValidPutProject(req, res, next) {
  if (!req.body.title) {
    res.status(400).json({ error: "Project title is required" })
  }
  return next();
}

server.post("/projects", isValidNewProject, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] }
  projects.push({ ...project })
  return res.json(project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", isProjectExist, (req, res) => {
  return res.json(req.project);
});

server.put("/projects/:id", isProjectExist, isValidPutProject, (req, res) => {
  const { title } = req.body;
  projects[req.projectIndex].title = title;
  return res.json(projects[req.projectIndex]);
});

server.delete("/projects/:id", isProjectExist, (req, res) => {
  projects.splice(req.projectIndex, 1);
  return res.send();
});

server.post("/projects/:id/tasks", isProjectExist, (req, res) => {
  return res.json(req.project.tasks);
});


server.listen(3000)