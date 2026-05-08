## Project Structure:
```
.
├── backend
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── src
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── auth.controller.js
│       │   ├── dashboard.controller.js
│       │   ├── project.controller.js
│       │   └── task.controller.js
│       ├── database
│       │   └── schema.sql
│       ├── middleware
│       │   ├── auth.middleware.js
│       │   ├── error.middleware.js
│       │   ├── role.middleware.js
│       │   └── validate.middleware.js
│       ├── routes
│       │   ├── auth.routes.js
│       │   ├── dashboard.routes.js
│       │   ├── project.routes.js
│       │   └── task.routes.js
│       ├── utils
│       │   ├── generateToken.js
│       │   └── response.js
│       └── validators
│           ├── auth.validator.js
│           ├── project.validator.js
│           └── task.validator.js
├── frontend
│   ├── dist
│   │   ├── assets
│   │   │   ├── index-4ColNKnB.css
│   │   │   └── index-Bo4ry52G.js
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── index.html
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   ├── authApi.js
│   │   │   ├── axios.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── projectApi.js
│   │   │   └── taskApi.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   └── Textarea.jsx
│   │   │   ├── dashboard
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── StatusChart.jsx
│   │   │   │   └── TasksPerUserChart.jsx
│   │   │   ├── layout
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── projects
│   │   │   │   ├── AddMemberForm.jsx
│   │   │   │   ├── MemberList.jsx
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   └── ProjectForm.jsx
│   │   │   ├── routes
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── PublicRoute.jsx
│   │   │   └── tasks
│   │   │       ├── GlobalTaskForm.jsx
│   │   │       ├── PriorityBadge.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       ├── TaskCard.jsx
│   │   │       ├── TaskForm.jsx
│   │   │       ├── TaskStatusSelect.jsx
│   │   │       └── TaskTable.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks
│   │   │   ├── useAuth.js
│   │   │   └── useProjects.js
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── TaskDetails.jsx
│   │   └── utils
│   │       ├── constants.js
│   │       ├── formatDate.js
│   │       ├── getErrorMessage.js
│   │       └── roleHelpers.js
│   └── vite.config.js
└── README.md

```

28 directories, 91 files
(base) nagi@NAGIs-MacBook-Air Team_Task_Manager % 